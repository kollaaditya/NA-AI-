const Contact = require('../models/Contact');
const ChatMessage = require('../models/ChatMessage');
const { chatWithBot } = require('../services/aiService');
const { sendResponse, sendError } = require('../utils/response');
const { v4: uuidv4 } = require('uuid');

const submitContact = async (req, res, next) => {
  try {
    const { name, email, company, message } = req.body;
    const contact = await Contact.create({ name, email, company, message });
    sendResponse(res, 201, true, 'Message sent successfully. We will get back to you soon!', { contact });
  } catch (error) {
    next(error);
  }
};

const sendChatMessage = async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;
    if (!message?.trim()) return sendError(res, 400, 'Message is required.');

    const sid = sessionId || uuidv4();
    const userId = req.user?._id || null;

    const history = await ChatMessage.find({ sessionId: sid })
      .sort({ createdAt: 1 })
      .limit(10)
      .select('role content');

    const messages = history.map((m) => ({ role: m.role, content: m.content }));
    messages.push({ role: 'user', content: message });

    const reply = await chatWithBot(userId, sid, messages);

    await ChatMessage.insertMany([
      { sessionId: sid, user: userId, role: 'user', content: message },
      { sessionId: sid, user: userId, role: 'assistant', content: reply },
    ]);

    sendResponse(res, 200, true, 'Message sent.', { reply, sessionId: sid });
  } catch (error) {
    next(error);
  }
};

const getChatHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const messages = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 });
    sendResponse(res, 200, true, 'Chat history fetched.', { messages });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContact, sendChatMessage, getChatHistory };
