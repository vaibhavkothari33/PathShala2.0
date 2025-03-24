import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, Loader2, ChevronLeft, 
  Lightbulb, BookOpen, History, Eraser, 
  Download, Copy, Check, Mic, Square
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AcademicBot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const subjects = [
    { id: 'math', name: 'Mathematics', icon: '📐' },
    { id: 'physics', name: 'Physics', icon: '⚡' },
    { id: 'chemistry', name: 'Chemistry', icon: '🧪' },
    { id: 'biology', name: 'Biology', icon: '🧬' },
    { id: 'computer', name: 'Computer Science', icon: '💻' },
    { id: 'english', name: 'English', icon: '📚' },
    { id: 'history', name: 'History', icon: '🏛️' },
    { id: 'general', name: 'General Knowledge', icon: '🌟' },
  ];

  const quickPrompts = [
    "Explain this concept simply",
    "Give me an example",
    "How do I solve this?",
    "Why is this important?",
    "Show me step by step",
    "What are the key points?",
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: `# Welcome to Your Academic Assistant! 👋

Hello ${user?.name || 'there'}! I'm here to help you learn and understand better. I can assist you with:

## Subjects I Can Help With:
- 📐 Mathematics
- ⚡ Physics
- 🧪 Chemistry
- 🧬 Biology
- 💻 Computer Science
- 📚 English
- 🏛️ History
- And more!

## What I Can Do:
- Explain complex concepts
- Help solve problems
- Provide examples
- Answer questions
- Guide your learning
- Offer practice exercises

Choose a subject above or just ask me anything! I'm here to help you learn.`
        }
      ]);
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setInput(`Help me with ${subject.name}: `);
    inputRef.current?.focus();
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prev => `${prev} ${prompt}`);
    inputRef.current?.focus();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // Here you would send the audioBlob to your speech-to-text service
        // For now, we'll just show a toast
        toast.success('Voice input recorded! (Speech-to-text coming soon)');
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success('Copied to clipboard!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          subject: selectedSubject?.id,
          history: messages.slice(-6),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response. Please try again.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([messages[0]]); // Keep the welcome message
    toast.success('Chat cleared!');
  };

  const downloadChat = () => {
    const text = messages
      .map(m => `${m.role.toUpperCase()}:\n${m.content}\n\n`)
      .join('---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'academic-chat.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Chat downloaded!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link
            to="/student/dashboard"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Academic Assistant</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearChat}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                title="Clear chat"
              >
                <Eraser className="h-5 w-5" />
              </button>
              <button
                onClick={downloadChat}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                title="Download chat"
              >
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Subject Selection */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-semibold mb-3 flex items-center">
                <BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
                Subjects
              </h2>
              <div className="space-y-2">
                {subjects.map(subject => (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectSelect(subject)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                      selectedSubject?.id === subject.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl mr-2">{subject.icon}</span>
                    <span className="text-sm">{subject.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-semibold mb-3 flex items-center">
                <Lightbulb className="h-5 w-5 text-indigo-600 mr-2" />
                Quick Prompts
              </h2>
              <div className="space-y-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg min-h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex items-start ${
                          message.role === 'assistant' ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <div className={`flex items-start space-x-3 max-w-[85%] ${
                          message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === 'assistant' ? 'bg-indigo-100' : 'bg-gray-100'
                          }`}>
                            {message.role === 'assistant' ? (
                              <Bot className="h-5 w-5 text-indigo-600" />
                            ) : (
                              <User className="h-5 w-5 text-gray-600" />
                            )}
                          </div>
                          <div className={`relative group rounded-xl p-4 ${
                            message.role === 'assistant' 
                              ? 'bg-white border border-gray-200' 
                              : 'bg-indigo-600 text-white'
                          }`}>
                            <div className="prose max-w-none">
                              <ReactMarkdown
                                components={{
                                  code({node, inline, className, children, ...props}) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                      <SyntaxHighlighter
                                        style={atomDark}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                      >
                                        {String(children).replace(/\n$/, '')}
                                      </SyntaxHighlighter>
                                    ) : (
                                      <code className={className} {...props}>
                                        {children}
                                      </code>
                                    );
                                  }
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                            {message.role === 'assistant' && (
                              <button
                                onClick={() => handleCopy(message.content, index)}
                                className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Copy message"
                              >
                                {copiedIndex === index ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="p-4 rounded-xl bg-white border border-gray-200">
                        <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Form */}
              <div className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex space-x-4">
                  <div className="flex-1 flex items-center space-x-2 p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask any academic question..."
                      className="flex-1 focus:outline-none"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`p-2 rounded-full ${
                        isRecording 
                          ? 'text-red-500 hover:text-red-600 bg-red-50'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                      isLoading || !input.trim()
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    <span>Send</span>
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicBot; 