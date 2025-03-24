// Remove the GoogleGenerativeAI import since we're using fetch directly
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Subject-specific context mapping with more focused prompts
const SUBJECT_CONTEXTS = {
  math: "You are a math tutor. Focus on clear explanations, step-by-step solutions, and practical examples. Use markdown for equations and formulas.",
  physics: "You are a physics tutor. Explain concepts with real-world examples and simple analogies. Use markdown for formulas and scientific notation.",
  chemistry: "You are a chemistry tutor. Break down complex reactions and concepts into simple terms. Use markdown for chemical formulas and equations.",
  biology: "You are a biology tutor. Explain biological processes clearly with examples from nature. Use markdown for scientific terms and diagrams.",
  computer: "You are a programming tutor. Provide clear code examples and explain concepts with practical applications. Use markdown for code blocks.",
  literature: "You are a literature tutor. Help analyze texts and explain literary concepts clearly. Use markdown for quotes and emphasis.",
  history: "You are a history tutor. Make historical events engaging and relevant. Use markdown for dates and important terms.",
  general: "You are a helpful academic tutor. Provide clear, concise explanations with practical examples."
};

// Detect subject based on keywords
function detectSubject(message) {
  const lowercaseMessage = message.toLowerCase();
  const subjectKeywords = {
    math: ['math', 'algebra', 'geometry', 'calculus', 'equation', 'theorem'],
    physics: ['physics', 'force', 'energy', 'motion', 'gravity', 'newton'],
    chemistry: ['chemistry', 'molecule', 'atom', 'element', 'reaction', 'compound'],
    biology: ['biology', 'cell', 'organism', 'gene', 'evolution', 'ecosystem'],
    computer: ['code', 'programming', 'algorithm', 'software', 'computer', 'python'],
    literature: ['book', 'poem', 'literature', 'novel', 'writing', 'story'],
    history: ['history', 'war', 'civilization', 'event', 'period', 'historical']
  };

  for (const [subject, keywords] of Object.entries(subjectKeywords)) {
    if (keywords.some(keyword => lowercaseMessage.includes(keyword))) {
      return subject;
    }
  }

  return 'general';
}

// Main chat function with improved prompt
export async function chat(userMessage, chatHistory = [], subject = 'general') {
  try {
    // Validate inputs
    if (!userMessage?.trim()) {
      throw new Error('Please provide a question');
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API key is not configured');
    }

    // Create a more focused and structured prompt
    const prompt = `${SUBJECT_CONTEXTS[subject] || SUBJECT_CONTEXTS.general}

Question: ${userMessage}

Provide a response that is:
1. Clear and concise
2. Easy to understand
3. Includes practical examples
4. Uses markdown formatting

Format your response with:
- Use ### for main points
- Use ** for important terms
- Use * for emphasis
- Use \` for code or technical terms
- Use numbered lists for steps
- Use bullet points for examples`;

    // Make API request with optimized settings
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024, // Reduced for faster responses
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to get response');
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format');
    }

    return formatResponse(data.candidates[0].content.parts[0].text);

  } catch (error) {
    console.error('Chat Error:', error);
    return `### Error
I apologize, but I encountered an error: ${error.message}

Please try:
- Rephrasing your question
- Checking your internet connection
- Trying again in a moment`;
  }
}

// Enhanced response formatting
function formatResponse(text) {
  if (!text) return "I apologize, but I couldn't generate a response. Please try again.";
  
  // Clean up the response
  text = text
    .replace(/```/g, '`') // Fix code block markers
    .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
    .trim();
  
  // Add spacing around headers
  text = text.replace(/###/g, '\n###');
  
  // Format code blocks
  text = text.replace(/`([^`]+)`/g, (match, code) => {
    return `\`${code.trim()}\``;
  });
  
  // Format lists
  text = text.replace(/^\d+\./gm, (match) => `\n${match}`);
  text = text.replace(/^-/gm, (match) => `\n${match}`);
  
  // Add emphasis to key terms
  text = text.replace(/\b(key point|important|note|remember|tip):/gi, '**$1:**');
  
  return text;
}

// Helper functions
export const helpers = {
  detectSubject,
  formatResponse,
  
  // New helper function to validate API key
  validateConfig: () => {
    if (!GEMINI_API_KEY) {
      throw new Error('Missing API key. Please check your environment variables.');
    }
    return true;
  },
  
  // New helper function to get subject info
  getSubjectInfo: (subjectId) => {
    return {
      context: SUBJECT_CONTEXTS[subjectId] || SUBJECT_CONTEXTS.general,
      isValid: Object.keys(SUBJECT_CONTEXTS).includes(subjectId)
    };
  }
};