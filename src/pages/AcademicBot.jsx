import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, Loader2, ChevronLeft, ChevronRight,
  BookOpen, History, Eraser, Download, Copy, 
  Check, Mic, Square, BookmarkPlus, ThumbsUp, 
  ThumbsDown, Share, Menu, X, Settings, Bookmark, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { chat, helpers } from '../api/chat';

const AcademicBot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [savedChats, setSavedChats] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  // const [showHistory, setShowHistory] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');
  const [showTips, setShowTips] = useState(true);

  const subjects = [
    { id: 'math', name: 'Mathematics', icon: '📐', color: 'bg-blue-100', description: 'Algebra, Calculus, Geometry, Statistics and more' },
    { id: 'science', name: 'Science', icon: '🔬', color: 'bg-green-100', description: 'Physics, Chemistry, Biology, Astronomy and more' },
    // { id: 'english', name: 'English', icon: '📚', color: 'bg-purple-100', description: 'Grammar, Literature, Essay Writing, Analysis' },
    // { id: 'history', name: 'History', icon: '🏛️', color: 'bg-amber-100', description: 'World History, Civilizations, Historical Events' },
    { id: 'computer-science', name: 'Computer Science', icon: '💻', color: 'bg-cyan-100', description: 'Programming, Algorithms, Data Structures' },
    { id: 'general', name: 'General', icon: '🌟', color: 'bg-gray-100', description: 'Any other topic you need help with' },
  ];

  const sampleQuestions = [
    { subject: 'math', question: "Can you explain integration by parts?" },
    { subject: 'science', question: "How does photosynthesis work?" },
    { subject: 'english', question: "What are the key themes in Macbeth?" },
    { subject: 'general', question: "How can I improve my study habits?" },
  ];

  const studyTips = [
    "Break complex topics into smaller chunks",
    "Use the Pomodoro technique: 25 minutes study, 5 minutes break",
    "Teach concepts to someone else to test your understanding",
    "Review material regularly, not just before tests",
    "Create mind maps to visualize connections between concepts"
  ];

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: `# Welcome to PathShala AI, ${user?.name || 'Student'}! 👋

I'm your AI learning companion, ready to help you understand any topic better. I can:

- Break down complex concepts into simple explanations
- Guide you through problem-solving step-by-step  
- Answer questions at any level
- Provide relevant examples and practice problems

Just select a subject or ask me anything to get started!`
        }
      ]);
    }
  }, [user]);

  // Load saved chats from localStorage
  useEffect(() => {
    const loadSavedChats = () => {
      const saved = localStorage.getItem('savedAcademicChats');
      if (saved) {
        try {
          setSavedChats(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading saved chats:', e);
        }
      }
    };
    
    loadSavedChats();
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setTranscription(transcript);
        setInput(transcript);
      };
      
      setSpeechRecognition(recognition);
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setInput(`Help me with ${subject.name}: `);
    inputRef.current?.focus();
    
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const startRecording = async () => {
    if (speechRecognition) {
      try {
        speechRecognition.start();
        setIsRecording(true);
        toast.success('Voice recording started!');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast.error('Could not start voice recognition');
      }
    }
  };

  const stopRecording = () => {
    if (speechRecognition && isRecording) {
      speechRecognition.stop();
      setIsRecording(false);
      toast.success('Voice recording stopped!');
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success('Copied to clipboard!');
  };

  const handleFeedback = (messageIndex, isPositive) => {
    setFeedbackMessage(messageIndex);
    toast.success(`Thank you for your ${isPositive ? 'positive' : 'negative'} feedback!`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const detectedSubject = !selectedSubject ? 
        helpers.detectSubject(userMessage) : 
        selectedSubject.id;
      
      const chatHistory = messages.slice(-6);
      const botResponse = await chat(userMessage, chatHistory, detectedSubject);

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: botResponse,
        subject: detectedSubject
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response. Please try again.');
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleQuestion = (question) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const handleSaveChat = () => {
    if (messages.length > 1) {
      const chatTitle = messages.find(m => m.role === 'user')?.content?.substring(0, 30) + '...' || 'Saved Chat';
      const newChat = {
        id: Date.now().toString(),
        title: chatTitle,
        date: new Date().toISOString(),
        messages: messages,
        subject: selectedSubject?.id || 'general'
      };
      
      const updatedChats = [...savedChats, newChat];
      setSavedChats(updatedChats);
      localStorage.setItem('savedAcademicChats', JSON.stringify(updatedChats));
      toast.success('Chat saved successfully!');
    } else {
      toast.error('No conversation to save yet');
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the current conversation?')) {
      setMessages([{
        role: 'assistant',
        content: `# Welcome back, ${user?.name || 'Student'}! 👋\n\nHow can I help you today?`
      }]);
      setSelectedSubject(null);
      toast.success('Chat cleared');
    }
  };

  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
            {showTips && messages.length <= 2 && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-blue-800 flex items-center gap-2">
                    <Info className="h-4 w-4" /> Quick Tips
                  </h3>
                  <button 
                    onClick={() => setShowTips(false)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <ul className="space-y-1 text-sm text-blue-700">
                  {studyTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {messages.length <= 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <h3 className="font-medium text-gray-700 col-span-full">Try asking:</h3>
                {sampleQuestions.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSampleQuestion(item.question)}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition shadow-sm hover:shadow"
                  >
                    <p className="text-gray-900">{item.question}</p>
                    <span className="text-xs text-gray-500 mt-1 inline-block">
                      #{subjects.find(s => s.id === item.subject)?.name || item.subject}
                    </span>
                  </button>
                ))}
              </div>
            )}
            
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'} relative group`}
                >
                  <div className={`max-w-[85%] rounded-xl p-4 ${
                    message.role === 'assistant' 
                      ? 'bg-blue-50 text-gray-800' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    {message.role === 'assistant' && (
                      <div className="flex items-center mb-2 text-blue-700">
                        <Bot className="h-5 w-5 mr-2" />
                        <span className="font-medium">EduAI</span>
                        {message.subject && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            {subjects.find(s => s.id === message.subject)?.name || message.subject}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {message.role === 'user' && (
                      <div className="flex items-center justify-end mb-2 text-blue-100">
                        <span className="font-medium">{user?.name || 'You'}</span>
                        <User className="h-4 w-4 ml-2" />
                      </div>
                    )}
                    
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
                    
                    {message.role === 'assistant' && (
                      <div className="mt-2 pt-2 border-t border-blue-100 flex items-center justify-between text-xs text-blue-500">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleFeedback(index, true)}
                            className="p-1 hover:bg-blue-100 rounded flex items-center gap-1"
                          >
                            <ThumbsUp className="h-3 w-3" /> Helpful
                          </button>
                          <button 
                            onClick={() => handleFeedback(index, false)}
                            className="p-1 hover:bg-blue-100 rounded flex items-center gap-1"
                          >
                            <ThumbsDown className="h-3 w-3" /> Not Helpful
                          </button>
                        </div>
                        <button 
                          onClick={() => handleCopy(message.content, index)}
                          className="p-1 hover:bg-blue-100 rounded flex items-center gap-1"
                        >
                          {copiedIndex === index ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          {copiedIndex === index ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2 items-center text-gray-500 bg-blue-50 px-4 py-3 rounded-lg max-w-xs"
              >
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: "0s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
                <span className="text-blue-700">PathShala AI is thinking...</span>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        );
      case 'history':
        return (
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="font-medium text-lg mb-4">Chat History</h2>
            {savedChats.length > 0 ? (
              <div className="space-y-3">
                {savedChats.map((chat) => (
                  <div 
                    key={chat.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{chat.title}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(chat.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                        {subjects.find(s => s.id === chat.subject)?.name || chat.subject}
                      </span>
                      <span className="ml-3">{chat.messages.length} messages</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <BookmarkPlus className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p>No saved conversations yet</p>
                <p className="text-sm mt-1">Your saved chats will appear here</p>
              </div>
            )}
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="font-medium text-lg mb-4">Settings</h2>
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Appearance</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span>Theme</span>
                    <button 
                      onClick={handleToggleTheme}
                      className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm transition"
                    >
                      {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Font Size</span>
                    <div className="flex gap-2">
                      {['small', 'medium', 'large'].map((size) => (
                        <button
                          key={size}
                          onClick={() => setFontSize(size)}
                          className={`px-3 py-1 rounded-lg text-sm transition ${
                            fontSize === size 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {size.charAt(0).toUpperCase() + size.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Chat Settings</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span>Show Tips</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showTips}
                        onChange={() => setShowTips(!showTips)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Data Management</h3>
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete all saved chats?')) {
                      setSavedChats([]);
                      localStorage.removeItem('savedAcademicChats');
                      toast.success('All saved chats deleted');
                    }
                  }}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
                >
                  <Eraser className="h-4 w-4" />
                  Delete All Saved Chats
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-white text-gray-800'}`}>
      <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-sm border-b sticky top-0 z-20`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/student/dashboard" className={`${theme === 'dark' ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} flex items-center gap-1`}>
              <ChevronLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-blue-600" />
              <span className="font-medium text-lg">PathShala AI</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} lg:hidden`}
            >
              <Settings className="h-5 w-5" />
            </button>
            
            <div className="hidden md:flex gap-2 items-center">
              <button
                onClick={handleSaveChat}
                className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'} p-2 rounded-lg flex items-center gap-1 text-sm`}
              >
                <BookmarkPlus className="h-4 w-4" /> Save
              </button>
              <button
                onClick={handleClearChat}
                className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'} p-2 rounded-lg flex items-center gap-1 text-sm`}
              >
                <Eraser className="h-4 w-4" /> Clear
              </button>
            </div>
            
            <div className={`h-8 w-8 ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-100'} rounded-full flex items-center justify-center font-medium text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
              {user?.name?.charAt(0) || 'S'}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Sidebar */}
          <aside className={`lg:block lg:col-span-1 ${isSidebarOpen ? 'block' : 'hidden'}`}>
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-4 space-y-4 sticky top-24`}>
              <div className="flex items-center justify-between">
                <h2 className="font-medium">Subjects</h2>
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden p-1 rounded-md hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-2">
                {subjects.map(subject => (
                  <motion.button
                    key={subject.id}
                    onClick={() => handleSubjectSelect(subject)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-3 rounded-lg flex items-center gap-3 transition ${
                      selectedSubject?.id === subject.id
                        ? theme === 'dark' ? 'bg-blue-900 text-blue-100' : 'bg-blue-50 text-blue-700'
                        : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className={`text-xl h-8 w-8 flex items-center justify-center rounded-lg ${subject.color}`}>
                      {subject.icon}
                    </span>
                    <div className="text-left">
                      <span className="block">{subject.name}</span>
                      <span className="text-xs text-gray-500 block">{subject.description}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
              
              <div className="pt-3 mt-3 border-t border-gray-200">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`p-2 rounded-lg flex items-center gap-2 ${
                      activeTab === 'chat' 
                        ? theme === 'dark' ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-700' 
                        : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Bot className="h-5 w-5" />
                    <span>Chat</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`p-2 rounded-lg flex items-center gap-2 ${
                      activeTab === 'history' 
                        ? theme === 'dark' ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-700' 
                        : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <History className="h-5 w-5" />
                    <span>History</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`p-2 rounded-lg flex items-center gap-2 ${
                      activeTab === 'settings' 
                        ? theme === 'dark' ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-700' 
                        : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm flex flex-col h-[calc(100vh-8rem)]`}>
              {renderMainContent()}
              
              {activeTab === 'chat' && (
                <div className="border-t p-4 bg-white">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 border rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask your question..."
                        className="flex-1 focus:outline-none bg-transparent"
                      />
                      <button 
                        type="button"
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`p-2 rounded-lg transition-colors ${
                          isRecording 
                            ? 'text-red-500 hover:bg-red-50' 
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                      </button>
                    </div>
                    <motion.button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-5 w-5" />
                    </motion.button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className={`lg:block lg:col-span-1 ${isRightSidebarOpen ? 'block' : 'hidden'}`}>
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-4 space-y-4 sticky top-24`}>
              <div className="flex items-center justify-between">
                <h2 className="font-medium">Quick Actions</h2>
                <button
                  onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                  className="lg:hidden p-1 rounded-md hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleSaveChat}
                  className={`w-full p-3 rounded-lg flex items-center gap-3 transition ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <Bookmark className="h-5 w-5" />
                  <span>Save Chat</span>
                </button>
                <button
                  onClick={handleClearChat}
                  className={`w-full p-3 rounded-lg flex items-center gap-3 transition ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <Eraser className="h-5 w-5" />
                  <span>Clear Chat</span>
                </button>
                <button
                  onClick={handleToggleTheme}
                  className={`w-full p-3 rounded-lg flex items-center gap-3 transition ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span>Toggle Theme</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default AcademicBot;