import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI model
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini--flash",
  systemInstruction: `You are an expert academic tutor with deep knowledge across multiple subjects. Your goal is to provide clear, engaging, and educational responses that help students learn.

Key Principles:
- Explain concepts in a clear, step-by-step manner
- Adapt explanations to the student's academic level
- Use relevant examples and analogies
- Encourage critical thinking
- Provide practical insights and context
- Break down complex ideas into digestible parts

Response Guidelines:
1. Begin with a concise, direct answer
2. Provide a detailed, structured explanation
3. Include practical examples or real-world applications
4. Suggest practice problems or further exploration
5. Maintain an encouraging and supportive tone`
});

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
  // Basic markdown formatting
  const formatted = text
    .replace(/^(.*?)$/gm, (match) => {
      if (match.toLowerCase().includes('example')) return `### Example\n${match}`;
      if (match.toLowerCase().includes('key point')) return `**${match}**`;
      if (match.toLowerCase().includes('tip')) return `*Tip:* ${match}`;
      return match;
    });

  return formatted;
}

// Main chat function
export async function chat(userMessage, chatHistory = [], subject = 'general') {
  try {
    // Validate and prepare chat history
    const validHistory = chatHistory
      .filter(msg => msg.content && ['user', 'assistant'].includes(msg.role))
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

    // Determine subject context
    const subjectContext = SUBJECT_CONTEXTS[subject] || SUBJECT_CONTEXTS.general;

    // Enhanced prompt with subject context
    const enhancedPrompt = `Subject Context: ${subjectContext}

Student's Question: ${userMessage}

Provide a comprehensive response that:
- Directly answers the question
- Breaks down complex concepts
- Includes relevant examples
- Suggests learning strategies or practice
- Maintains an engaging, educational tone`;

    // Configure generation settings
    const generationConfig = {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 2048
    };

    // Start chat with history
    const chat = model.startChat({
      history: validHistory,
      generationConfig
    });

    // Send message and get response
    const result = await chat.sendMessage(enhancedPrompt);
    const response = result.response;
    
    // Format and return response
    let formattedResponse = formatResponse(response.text());
    return formattedResponse;

  } catch (error) {
    console.error('Chat Generation Error:', error);
    throw new Error('Failed to generate academic response. Please try again.');
  }
}

// Helper functions export
export const helpers = {
  detectSubject,
  formatResponse
};