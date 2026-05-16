import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiRefreshCw } from 'react-icons/fi';
import { supportService } from '../../services';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const FAQ_SUGGESTIONS = [
  'How does product categorization work?',
  'How do I generate a B2B proposal?',
  'What is the eco score?',
  'How do I export my data?',
  'I need help with a refund',
];

function ChatBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-0.5">
          AI
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-emerald-600 text-white rounded-br-sm'
            : 'bg-white/10 text-gray-200 rounded-bl-sm border border-white/10'
        }`}
      >
        {msg.content}
        <p className={`text-xs mt-1 ${isUser ? 'text-emerald-200/70' : 'text-gray-600'}`}>
          {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </p>
      </div>
    </motion.div>
  );
}

export default function ChatSupportPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m the NA AI Systems support assistant. I can help you with product categorization, B2B proposals, order tracking, refunds, and general platform questions. How can I help you today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => localStorage.getItem('na_chat_session') || uuidv4());
  const bottomRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('na_chat_session', sessionId);
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput('');

    const userMsg = { role: 'user', content, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data } = await supportService.sendChat({ message: content, sessionId });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.data.reply, timestamp: new Date().toISOString() },
      ]);
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.', timestamp: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: '👋 Chat cleared! How can I help you today?',
      timestamp: new Date().toISOString(),
    }]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-poppins flex items-center gap-2">
            💬 AI Support Bot
          </h1>
          <p className="text-gray-400 text-sm mt-1">24/7 AI-powered support for all your platform questions.</p>
        </div>
        <button onClick={clearChat} className="btn-secondary py-2 px-3 text-sm flex items-center gap-1.5">
          <FiRefreshCw size={14} /> Clear
        </button>
      </motion.div>

      {/* Chat Window */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card flex flex-col"
        style={{ height: '520px' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-bold">
            AI
          </div>
          <div>
            <p className="text-white font-semibold text-sm">NA AI Assistant</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-gray-500 text-xs">Online · Powered by GPT-4</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pr-1">
          <AnimatePresence>
            {messages.map((msg, i) => <ChatBubble key={i} msg={msg} />)}
          </AnimatePresence>
          {loading && (
            <div className="flex justify-start mb-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">
                AI
              </div>
              <div className="bg-white/10 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* FAQ Suggestions */}
        {messages.length <= 1 && (
          <div className="py-3 border-t border-white/10">
            <p className="text-gray-600 text-xs mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {FAQ_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs bg-white/5 hover:bg-emerald-500/10 text-gray-400 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/30 px-3 py-1.5 rounded-full transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 pt-3 border-t border-white/10">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Enter to send)"
            rows={1}
            className="input-field flex-1 resize-none py-2.5 text-sm"
            style={{ minHeight: '42px', maxHeight: '100px' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="btn-primary px-4 py-2.5 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <LoadingSpinner size="sm" /> : <FiSend size={16} />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
