import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, Loader2, ChevronLeft, 
  Lightbulb, BookOpen, History, Eraser, 
  Download, Copy, Check, Mic, Square, 
  BookmarkPlus, ThumbsUp, ThumbsDown, Share
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
  const [showHistory, setShowHistory] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [transcription, setTranscription] = useState('');

  const subjects = [
    { id: 'math', name: 'Mathematics', icon: '📐' },
    { id: 'physics', name: 'Physics', icon: '⚡' },
    { id: 'chemistry', name: 'Chemistry', icon: '🧪' },
    { id: 'biology', name: 'Biology', icon: '🧬' },
    { id: 'computer', name: 'Computer Science', icon: '💻' },
    { id: 'english', name: 'English & Literature', icon: '📚' },
    { id: 'history', name: 'History', icon: '🏛️' },
    { id: 'language', name: 'Languages', icon: '🌎' },
    { id: 'general', name: 'General Knowledge', icon: '🌟' },
  ];

  const quickPrompts = [
    "Explain this concept simply",
    "Give me an example",
    "How do I solve this?",
    "Why is this important?",
    "Show me step by step",
    "Create a practice problem",
    "How can I remember this?",
    "Connect this to real life",
  ];

  // Initialize welcome message
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
- 📚 English & Literature
- 🏛️ History
- 🌎 Languages
- And more!

## What I Can Do:
- Explain complex concepts simply
- Help solve problems step-by-step
- Provide relevant examples and analogies
- Answer questions at any academic level
- Guide your learning journey
- Create practice exercises and quizzes
- Connect concepts to real-world applications

Choose a subject above or just ask me anything! I'm here to make learning enjoyable and effective.`
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
    
    // If on mobile, close sidebar after selection
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prev => `${prev} ${prompt}`);
    inputRef.current?.focus();
    
    // If on mobile, close sidebar after selection
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
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          // Convert audio to base64 and send to a speech-to-text service
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Audio = reader.result.split(',')[1];
            try {
              // For now, just use a placeholder response
              setInput("How can you help me learn this topic better?");
              toast.success('Voice input processed!');
            } catch (error) {
              console.error('Speech to text error:', error);
              toast.error('Could not process voice input');
            }
          };
          reader.readAsDataURL(audioBlob);
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast.error('Could not access microphone');
      }
    }
  };

  const stopRecording = () => {
    if (speechRecognition && isRecording) {
      speechRecognition.stop();
      setIsRecording(false);
      toast.success('Voice recording stopped!');
    } else if (mediaRecorderRef.current && isRecording) {
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

  const handleFeedback = (messageIndex, isPositive) => {
    setFeedbackMessage(messageIndex);
    toast.success(`Thank you for your ${isPositive ? 'positive' : 'negative'} feedback!`);
    
    // Optional: Reset feedback message after a delay
    setTimeout(() => setFeedbackMessage(null), 3000);
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
      // Detect subject if none selected
      const detectedSubject = !selectedSubject ? 
        helpers.detectSubject(userMessage) : 
        selectedSubject.id;
      
      // Get chat history for context (last 6 messages)
      const chatHistory = messages.slice(-6);
      
      // Get response from chat service
      const botResponse = await chat(userMessage, chatHistory, detectedSubject);

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: botResponse,
        subject: detectedSubject
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response. Please try again.');
      
      // Add a fallback response instead of removing the user's message
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or try rephrasing your question.",
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    // Keep just the welcome message
    setMessages([messages[0]]); 
    setSelectedSubject(null);
    toast.success('Chat cleared!');
  };

  const saveCurrentChat = () => {
    if (messages.length <= 1) {
      toast.error('No conversation to save yet!');
      return;
    }
    
    // Create a chat title from the first user message
    const firstUserMessage = messages.find(m => m.role === 'user');
    const chatTitle = firstUserMessage ? 
      (firstUserMessage.content.length > 30 ? 
        firstUserMessage.content.substring(0, 30) + '...' : 
        firstUserMessage.content) : 
      'Saved Chat';
    
    const newSavedChat = {
      id: Date.now().toString(),
      title: chatTitle,
      date: new Date().toISOString(),
      messages: messages,
      subject: selectedSubject?.id || 'general'
    };
    
    const updatedSavedChats = [newSavedChat, ...savedChats];
    setSavedChats(updatedSavedChats);
    
    // Save to localStorage
    localStorage.setItem('savedAcademicChats', JSON.stringify(updatedSavedChats));
    
    toast.success('Chat saved successfully!');
  };

  const loadSavedChat = (savedChat) => {
    setMessages(savedChat.messages);
    
    // Find and set the subject
    if (savedChat.subject) {
      const subject = subjects.find(s => s.id === savedChat.subject);
      setSelectedSubject(subject || null);
    }
    
    setShowHistory(false);
    toast.success('Chat loaded!');
  };

  const deleteSavedChat = (id, e) => {
    e.stopPropagation(); // Prevent triggering the parent click
    
    const updatedSavedChats = savedChats.filter(chat => chat.id !== id);
    setSavedChats(updatedSavedChats);
    
    // Update localStorage
    localStorage.setItem('savedAcademicChats', JSON.stringify(updatedSavedChats));
    
    toast.success('Chat deleted!');
  };

  const downloadChat = () => {
    if (messages.length <= 1) {
      toast.error('No conversation to download yet!');
      return;
    }
    
    const firstUserMessage = messages.find(m => m.role === 'user');
    const fileName = firstUserMessage ? 
      `academic-chat-${firstUserMessage.content.substring(0, 20).replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md` : 
      'academic-chat.md';
    
    // Format as Markdown for better readability
    const text = messages
      .map(m => `## ${m.role === 'assistant' ? 'Tutor' : 'You'}\n\n${m.content}\n\n---\n\n`)
      .join('');
    
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Chat downloaded!');
  };

  const shareChat = () => {
    if (messages.length <= 1) {
      toast.error('No conversation to share yet!');
      return;
    }
    
    // In a real app, you would generate a shareable link
    // For now, simulate with a copy-to-clipboard of a fictional URL
    
    const shareId = Math.random().toString(36).substring(2, 10);
    const shareUrl = `https://yourdomain.com/shared-chat/${shareId}`;
    
    navigator.clipboard.writeText(shareUrl);
    toast.success('Shareable link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Header with modern design */}
      <header className="bg-white shadow-md sticky top-0 z-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/student/dashboard"
                className="group flex items-center text-gray-600 hover:text-indigo-600 transition-all"
              >
                <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline font-medium">Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex items-center space-x-3">
                <Bot className="h-6 w-6 text-indigo-600 animate-pulse" />
                <span className="font-semibold text-gray-900 tracking-tight">Academic AI</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-all group"
                title="Chat History"
              >
                <History className="h-5 w-5 group-hover:rotate-6 transition-transform" />
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveCurrentChat}
                className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Save Chat
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Enhanced Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced Sidebar */}
          <div className={`lg:col-span-1 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-20 space-y-6">
              {/* Subject Selection Card with Enhanced Design */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Subjects
                  </h2>
                </div>
                <div className="p-4 space-y-2">
                  {subjects.map(subject => (
                    <motion.button
                      key={subject.id}
                      onClick={() => handleSubjectSelect(subject)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left px-4 py-3 rounded-xl flex items-center transition-all ${
                        selectedSubject?.id === subject.id
                          ? 'bg-indigo-50 text-indigo-600 font-medium shadow-sm'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="text-2xl mr-3">{subject.icon}</span>
                      <span className="text-sm font-medium">{subject.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quick Prompts Card with Enhanced Design */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-4 bg-gradient-to-r from-cyan-600 to-blue-600">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Quick Prompts
                  </h2>
                </div>
                <div className="p-4 space-y-2">
                  {quickPrompts.map((prompt, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Chat Container */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-8rem)]">
              {/* Messages Area with Enhanced Styling */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`flex max-w-[80%] ${message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`relative group px-4 py-3 rounded-lg ${
                          message.role === 'assistant' 
                            ? 'bg-white border border-gray-200 shadow-sm' 
                            : 'bg-indigo-600 text-white'
                        }`}>
                          <ReactMarkdown
                            className="prose max-w-none dark:prose-invert"
                            components={{
                              code({node, inline, className, children, ...props}) {
                                return inline ? (
                                  <code className="px-1 py-0.5 rounded-md bg-gray-100 text-gray-800" {...props}>
                                    {children}
                                  </code>
                                ) : (
                                  <SyntaxHighlighter
                                    style={atomDark}
                                    language="javascript"
                                    PreTag="div"
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                );
                              }
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>

                          {/* Action buttons for assistant messages */}
                          {message.role === 'assistant' && (
                            <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {/* Copy button */}
                              <button
                                onClick={() => handleCopy(message.content, index)}
                                className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                                title="Copy message"
                              >
                                {copiedIndex === index ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>

                              {/* Feedback buttons */}
                              {feedbackMessage !== index && (
                                <>
                                  <button
                                    onClick={() => handleFeedback(index, true)}
                                    className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-green-500 transition-colors"
                                    title="Helpful"
                                  >
                                    <ThumbsUp className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleFeedback(index, false)}
                                    className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors"
                                    title="Not helpful"
                                  >
                                    <ThumbsDown className="h-4 w-4" />
                                  </button>
                                </>
                              )}

                              {/* Feedback confirmation */}
                              {feedbackMessage === index && (
                                <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded">
                                  Thanks for your feedback!
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-sm">
                        <div className="flex items-center space-x-3">
                          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                          <span className="text-sm text-gray-500">Thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Input Area */}
              <div className="border-t border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="flex space-x-4">
                  <div className="flex-1 flex items-center space-x-3 px-4 py-3 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 bg-white shadow-sm">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask any academic question..."
                      className="flex-1 focus:outline-none text-sm"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`p-2 rounded-lg transition-colors ${
                        isRecording 
                          ? 'text-red-500 hover:text-red-600 bg-red-50'
                          : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className={`px-6 py-3 rounded-xl flex items-center space-x-2 transition-all ${
                      isLoading || !input.trim()
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <span className="hidden sm:inline font-medium">Send</span>
                    <Send className="h-5 w-5" />
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


            