// Remove the GoogleGenerativeAI import since we're using fetch directly
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Subject-specific context mapping
const SUBJECT_CONTEXTS = {
  math: "Focus on clear mathematical reasoning, step-by-step problem-solving, and breaking down complex mathematical concepts into understandable parts.",
  physics: "Emphasize real-world applications, provide clear explanations of physical principles, and use diagrams or thought experiments to illustrate concepts.",
  chemistry: "Explain molecular interactions, chemical processes, and theoretical concepts with clear, visual explanations.",
  biology: "Highlight interconnections in biological systems, explain processes with clarity, and relate concepts to broader ecological or health contexts.",
  computer: "Provide clear code explanations, best practices, debugging insights, and practical programming concepts.",
  literature: "Analyze texts deeply, explain literary techniques, provide contextual insights, and encourage critical interpretation.",
  history: "Provide historical context, explain cause-and-effect relationships, and connect historical events to broader societal understanding.",
  general: "Provide a comprehensive, interdisciplinary approach to understanding the topic."
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

// Format response with markdown
function formatResponse(text) {
  if (!text) return "I apologize, but I couldn't generate a response. Please try again.";
  
  return text
    .replace(/^(.*?)$/gm, (match) => {
      if (match.toLowerCase().includes('example')) return `### Example\n${match}`;
      if (match.toLowerCase().includes('key point')) return `**${match}**`;
      if (match.toLowerCase().includes('tip')) return `*Tip:* ${match}`;
      return match;
    });
}

// Main chat function
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

    // Create the prompt
    const prompt = `As an academic tutor, ${SUBJECT_CONTEXTS[subject] || SUBJECT_CONTEXTS.general}

Question: ${userMessage}

Please provide a clear, educational response using markdown formatting with:
- A direct answer
- Step-by-step explanation
- Relevant examples
- Practice suggestions`;

    // Make API request
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
          }]
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