const { getClient } = require('../config/openai');
const AILog = require('../models/AILog');
const logger = require('../utils/logger');

const callAI = async (userId, type, systemPrompt, userPrompt) => {
  const start = Date.now();
  try {
    const openai = getClient();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    const duration = Date.now() - start;
    const usage = response.usage;

    await AILog.create({
      user: userId,
      type,
      inputTokens: usage.prompt_tokens,
      outputTokens: usage.completion_tokens,
      model: 'gpt-4o-mini',
      success: true,
      duration,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    await AILog.create({
      user: userId,
      type,
      success: false,
      errorMessage: error.message,
      duration: Date.now() - start,
    }).catch(() => {});
    logger.error(`AI call failed [${type}]: ${error.message}`);
    throw error;
  }
};

const generateProductCategory = (userId, title, description) => {
  const systemPrompt = `You are an AI product categorization expert for a sustainable commerce platform. Always respond with valid JSON only.`;
  const userPrompt = `Analyze this product and return JSON with exactly these fields:
{
  "category": "main category",
  "subCategory": "sub category",
  "seoTags": ["tag1","tag2","tag3","tag4","tag5"],
  "sustainabilityFilters": ["filter1","filter2","filter3"],
  "ecoScore": 75,
  "summary": "2-3 sentence product summary"
}
Product Title: ${title}
Description: ${description}`;
  return callAI(userId, 'product_category', systemPrompt, userPrompt);
};

const generateB2BProposal = (userId, companyName, budget, industry) => {
  const systemPrompt = `You are an expert B2B sales consultant for NA AI Systems, an AI-powered sustainable commerce platform. Always respond with valid JSON only.`;
  const userPrompt = `Generate a B2B proposal for:
Company: ${companyName}
Budget: $${budget}
Industry: ${industry}

Return JSON with exactly these fields:
{
  "recommendations": [{"product":"Product Name","description":"Brief description","cost":5000}],
  "budgetAllocation": [{"category":"Category","percentage":40,"amount":${budget * 0.4}}],
  "roiEstimate": {"percentage":35,"timeframe":"12 months","savings":${budget * 0.35}},
  "sustainabilitySummary": "Summary of sustainability impact",
  "totalCost": ${budget}
}
Include 3-4 recommendations and 4-5 budget allocation categories.`;
  return callAI(userId, 'b2b_proposal', systemPrompt, userPrompt);
};

const generateImpactReport = (userId, data) => {
  const systemPrompt = `You are a sustainability analyst for NA AI Systems. Generate ESG impact reports. Always respond with valid JSON only.`;
  const userPrompt = `Generate an AI sustainability impact report for:
Products Analyzed: ${data.productsCount}
Proposals Generated: ${data.proposalsCount}
Total Budget Managed: $${data.totalBudget}
Industry: ${data.industry || 'Mixed'}

Return JSON with exactly these fields:
{
  "carbonReduction": {"value":2.5,"unit":"tons CO2","description":"description"},
  "plasticSavings": {"value":150,"unit":"kg","description":"description"},
  "ecoImpactScore": 82,
  "esgSummary": "Comprehensive ESG summary paragraph",
  "metrics": [{"label":"Metric Name","value":"Value","trend":"up","change":"+15%"}]
}`;
  return callAI(userId, 'impact_report', systemPrompt, userPrompt);
};

const chatWithBot = async (userId, sessionId, messages) => {
  const start = Date.now();
  try {
    const openai = getClient();
    const systemPrompt = `You are NA AI Systems support assistant. You help with:
- Product categorization questions
- B2B proposal inquiries
- Order tracking (ask for order ID)
- Refund requests (collect order ID and reason)
- General platform questions
Be concise, professional, and helpful. Always respond in plain text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: 0.6,
      max_tokens: 500,
    });

    await AILog.create({
      user: userId,
      type: 'chat',
      inputTokens: response.usage.prompt_tokens,
      outputTokens: response.usage.completion_tokens,
      success: true,
      duration: Date.now() - start,
    }).catch(() => {});

    return response.choices[0].message.content;
  } catch (error) {
    logger.error(`Chat AI failed: ${error.message}`);
    throw error;
  }
};

module.exports = { generateProductCategory, generateB2BProposal, generateImpactReport, chatWithBot };
