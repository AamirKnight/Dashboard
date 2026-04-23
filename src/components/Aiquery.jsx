import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Brain, Sparkles, AlertTriangle } from 'lucide-react';
import { allAlerts } from '../data/mockData';
import { SeverityBadge, TypeBadge } from '../components/ui/Badges';

const MOCK_RESPONSES = {
  'Why is this SLA dropping?': `Based on the pattern data, SLA compliance has been declining for 3 consecutive weeks. The primary root causes identified are:

1. **Power instability** at 4 exchange points in the Eastern zone — 2 sites have reported electricity unavailability via the Samridh Gram app.
2. **Increased fault frequency** — incident count jumped from 8 to 22 in the last 7 days, 2.75× above baseline.
3. **Rack cooling failure** at Kahalgaon block is causing thermal throttling on OLT equipment, directly impacting uptime.

Recommended action: Deploy field team to Kahalgaon and Pirpainti nodes within 24 hours.`,

  'Show root cause of outage': `Root cause analysis for the detected outage pattern:

**Primary cause**: OLT hardware fault at Naugachhia Exchange (offline for 6+ hours)
**Contributing factors**:
- No UPS backup — site lost power during grid failure on Monday evening
- No maintenance visit in 21 days (overdue by 14 days per SLA)
- Force majeure not filed despite reported infrastructure damage

**Impact**: 847 subscribers affected, SLA breach of 4.2 hours so far.
**Resolution ETA**: 6–8 hours pending field team arrival and OLT replacement.`,

  'Which towers are affected?': `Towers currently showing anomalies:

| Tower ID | Location      | Issue              | Severity |
|----------|---------------|--------------------|----------|
| TW-2241  | Kahalgaon     | Power outage       | Critical |
| TW-1893  | Naugachhia    | OLT fault          | Critical |
| TW-2087  | Sultanganj    | Traffic spike 3.2× | High     |
| TW-1654  | Bausi         | No update 21d      | High     |
| TW-2310  | Pirpainti     | AC failure         | Medium   |

Total affected subscribers across these towers: **~2,400**`,

  'default': `I've analyzed the available data for this alert. Based on patterns across UNMS, NOC, and field reports:

- The alert was first detected **2 hours ago** with a confidence score of 94%
- **3 similar events** occurred in the past 30 days — all resolved within 12 hours
- Current risk trajectory suggests escalation to Critical within **48 hours** if unresolved

Suggested next steps:
1. Dispatch field team to the affected GP node
2. Check power and cooling status via Samridh Gram app
3. Raise priority ticket in Issue Management System`,
};

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-[#9CA3AF]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function ChatBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
          <Brain size={14} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-blue-600 text-white rounded-tr-sm'
            : 'bg-white border border-[#E8ECF0] text-[#0F1623] rounded-tl-sm'
        }`}
      >
        {msg.content}
      </div>
    </motion.div>
  );
}

const SUGGESTED = [
  'Why is this SLA dropping?',
  'Show root cause of outage',
  'Which towers are affected?',
  'What action should I take?',
  'How long will this take to fix?',
];

export default function AIQuery() {
  const location  = useLocation();
  const alertId   = location.state?.alertId;
  const alert     = allAlerts.find(a => a.id === alertId) ?? null;

  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [typing, setTyping]       = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', content: q }]);
    setTyping(true);
    setTimeout(() => {
      const reply = MOCK_RESPONSES[q] ?? MOCK_RESPONSES['default'];
      setMessages(m => [...m, { role: 'ai', content: reply }]);
      setTyping(false);
    }, 1200 + Math.random() * 600);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden px-6 py-6 max-w-[900px] mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-[22px] font-700 text-[#0F1623]">Ask AI</h1>
            <p className="text-[13px] text-[#9CA3AF]">BharatNet Risk Intelligence Engine</p>
          </div>
        </div>

        {/* Alert context pill */}
        {alert && (
          <div className="flex items-center gap-3 bg-white border border-[#E8ECF0] rounded-xl px-4 py-3">
            <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-500 text-[#0F1623] truncate">{alert.title}</p>
              <p className="text-[11px] text-[#9CA3AF] truncate">{alert.desc}</p>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <SeverityBadge severity={alert.severity} size="xs" />
              <TypeBadge type={alert.type} size="xs" />
            </div>
          </div>
        )}
      </motion.div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto bg-[#F5F7FA] rounded-2xl p-4 mb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-4">
              <Brain size={24} className="text-white" />
            </div>
            <p className="text-[16px] font-500 text-[#0F1623] mb-1">How can I help you?</p>
            <p className="text-[13px] text-[#9CA3AF] mb-6 max-w-xs">
              Ask anything about this alert, or choose a suggested question below.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTED.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[12px] font-500 px-4 py-2 rounded-xl border border-[#E8ECF0] bg-white text-[#4B5563] hover:border-blue-300 hover:text-blue-700 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => <ChatBubble key={i} msg={msg} />)}
        </AnimatePresence>

        {typing && (
          <div className="flex justify-start mb-4">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center mr-3 flex-shrink-0">
              <Brain size={14} className="text-white" />
            </div>
            <div className="bg-white border border-[#E8ECF0] rounded-2xl rounded-tl-sm">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts (shown after messages start) */}
      {messages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 flex-shrink-0 mb-2">
          {SUGGESTED.map(s => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-[11px] whitespace-nowrap font-500 px-3 py-1.5 rounded-lg border border-[#E8ECF0] bg-white text-[#6B7280] hover:border-blue-300 hover:text-blue-700 transition-colors flex-shrink-0"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about this alert…"
          className="flex-1 px-4 py-3 text-[14px] border border-[#E8ECF0] rounded-xl bg-white text-[#0F1623] focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || typing}
          className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}