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
import { chat, helpers } from '../api/chat'; // Import the enhanced chat service

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
      // Fallback to traditional audio recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          // Here we would send this to a speech-to-text service
          toast.success('Voice input recorded! (Processing...)');
          
          // Simulate Speech-to-Text with a placeholder
          setTimeout(() => {
            const placeholderText = "Can you explain this topic more simply?";
            setInput(placeholderText);
            toast.success('Voice transcribed!');
          }, 1500);
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
    
    // In a real app, you would send this feedback to your backend
    const feedbackType = isPositive ? 'positive' : 'negative';
    console.log(`Feedback for message ${messageIndex}: ${feedbackType}`);
    
    toast.success(`Thank you for your ${isPositive ? 'positive' : 'negative'} feedback!`);
    
    // Optionally ask for more detailed feedback if negative
    if (!isPositive) {
      // You could show a modal or form here
      setTimeout(() => {
        const reason = prompt('How could this response be improved?');
        if (reason) {
          console.log(`Improvement feedback: ${reason}`);
          // Send this to your backend
        }
      }, 500);
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <Link
            to="/student/dashboard"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-3"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Academic Assistant</h1>
              {selectedSubject && (
                <div className="ml-3 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center">
                  <span className="mr-1">{selectedSubject.icon}</span>
                  {selectedSubject.name}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                title="Chat history"
              >
                <History className="h-5 w-5" />
              </button>
              <button
                onClick={saveCurrentChat}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                title="Save chat"
              >
                <BookmarkPlus className="h-5 w-5" />
              </button>
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
              <button
                onClick={shareChat}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                title="Share chat"
              >
                <Share className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 lg:hidden"
                title="Toggle sidebar"
              >
                <BookOpen className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Hidden on mobile unless toggled */}
          <div className={`lg:col-span-1 space-y-4 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
            {showHistory ? (
              /* Saved Chat History */
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h2 className="text-lg font-semibold mb-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <History className="h-5 w-5 text-indigo-600 mr-2" />
                    Saved Chats
                  </div>
                  <button 
                    onClick={() => setShowHistory(false)} 
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Back
                  </button>
                </h2>
                
                {savedChats.length === 0 ? (
                  <p className="text-gray-500 text-sm">No saved chats yet. Use the bookmark button to save conversations.</p>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {savedChats.map(chat => (
                      <div 
                        key={chat.id} 
                        onClick={() => loadSavedChat(chat)}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer relative group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-800">{chat.title}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(chat.date).toLocaleDateString()} · 
                              {subjects.find(s => s.id === chat.subject)?.name || 'General'}
                            </p>
                          </div>
                          <button 
                            onClick={(e) => deleteSavedChat(chat.id, e)}
                            className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Eraser className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Normal Sidebar Content */
              <>
                {/* Subject Selection */}
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <h2 className="text-lg font-semibold mb-3 flex items-center">
                    <BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
                    Subjects
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                    {subjects.map(subject => (
                      <button
                        key={subject.id}
                        onClick={() => handleSubjectSelect(subject)}
                        className={`text-left px-3 py-2 rounded-lg flex items-center ${
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
              </>
            )}
          </div>

          {/* Chat Container */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg min-h-[calc(100vh-200px)] flex flex-col">
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
                        transition={{ duration: 0.3 }}
                        className={`flex items-start ${
                          message.role === 'assistant' ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <div className={`flex items-start space-x-3 max-w-[90%] ${
                          message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === 'assistant' 
                              ? message.isError 
                                ? 'bg-red-100' 
                                : 'bg-indigo-100' 
                              : 'bg-gray-100'
                          }`}>
                            {message.role === 'assistant' ? (
                              <Bot className={`h-5 w-5 ${message.isError ? 'text-red-600' : 'text-indigo-600'}`} />
                            ) : (
                              <User className="h-5 w-5 text-gray-600" />
                            )}
                          </div>
                          <div className={`relative group rounded-xl p-4 ${
                            message.role === 'assistant' 
                              ? message.isError
                                ? 'bg-red-50 border border-red-200'
                                : 'bg-white border border-gray-200' 
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
                            
                            {/* Action buttons for assistant messages */}
                            {message.role === 'assistant' && !message.isError && (
                              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleCopy(message.content, index)}
                                  className="p-1 rounded text-gray-400 hover:text-gray-600"
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
                                      className="p-1 rounded text-gray-400 hover:text-green-500"
                                      title="Helpful"
                                    >
                                      <ThumbsUp className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleFeedback(index, false)}
                                      className="p-1 rounded text-gray-400 hover:text-red-500"
                                      title="Not helpful"
                                    >
                                      <ThumbsDown className="h-4 w-4" />
                                    </button>
                                  </>
                                )}
                                
                                {feedbackMessage === index && (
                                  <span className="text-xs text-green-500">Thanks!</span>
                                )}
                              </div>
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
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                          <span className="text-sm text-gray-500">Thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Form */}
              <div className="border-t p-3 sm:p-4">
                <form onSubmit={handleSubmit} className="flex space-x-2 sm:space-x-4">
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
                      title={isRecording ? "Stop recording" : "Start voice input"}
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


            