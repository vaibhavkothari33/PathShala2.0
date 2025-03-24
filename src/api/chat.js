import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI model
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Improved system prompt for better academic assistance
const SYSTEM_PROMPT = `You are an expert academic tutor with deep knowledge across multiple subjects. Your role is to:

1. Provide clear, detailed explanations tailored to the student's academic level
2. Break down complex concepts into understandable parts
3. Use relevant examples and analogies to illustrate points
4. Guide students through problem-solving steps
5. Encourage critical thinking and deeper understanding
6. Provide practice problems when appropriate
7. Correct misconceptions gently and constructively

When responding:
- Start with a brief, direct answer
- Follow with a detailed explanation
- Include relevant examples or diagrams when helpful
- End with a quick summary or key takeaway
- If relevant, suggest related concepts to explore

Subject expertise includes:
- Mathematics (Algebra, Geometry, Calculus)
- Sciences (Physics, Chemistry, Biology)
- Literature and Language Arts
- History and Social Studies
- Computer Science and Programming

Remember to:
- Use age-appropriate language and explanations
- Encourage problem-solving skills
- Provide step-by-step guidance when needed
- Include practice questions when relevant
- Be encouraging and supportive`;

export async function chat(userMessage, chatHistory = []) {
  try {
    // Format the chat history for context
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role,
      parts: msg.content,
    }));

    // Create a chat instance with history
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    // Enhance the user's question with academic context
    const enhancedPrompt = `${SYSTEM_PROMPT}

Question from student: ${userMessage}

Please provide a helpful, educational response that:
1. Addresses the specific question
2. Explains the underlying concepts
3. Includes relevant examples
4. Offers practice opportunities if applicable
5. Suggests related topics to explore`;

    // Generate response
    const result = await chat.sendMessage(enhancedPrompt);
    const response = await result.response;
    
    // Format the response for better readability
    let formattedResponse = response.text();
    
    // Add markdown formatting if not present
    if (!formattedResponse.includes('#') && !formattedResponse.includes('*')) {
      formattedResponse = formatResponse(formattedResponse);
    }

    return formattedResponse;
  } catch (error) {
    console.error('Chat API error:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
}

// Helper function to format the response with markdown
function formatResponse(text) {
  // Split response into sections
  const sections = text.split('\n\n');
  
  let formatted = [];
  
  sections.forEach((section, index) => {
    if (index === 0) {
      // Main answer
      formatted.push(`**${section.trim()}**\n`);
    } else if (section.toLowerCase().includes('example')) {
      // Example section
      formatted.push(`### Example:\n${section.trim()}\n`);
    } else if (section.toLowerCase().includes('practice')) {
      // Practice problems
      formatted.push(`### Practice:\n${section.trim()}\n`);
    } else if (section.toLowerCase().includes('key takeaway') || section.toLowerCase().includes('summary')) {
      // Summary section
      formatted.push(`### Key Takeaway:\n${section.trim()}\n`);
    } else if (section.toLowerCase().includes('related topics')) {
      // Related topics
      formatted.push(`### Related Topics to Explore:\n${section.trim()}\n`);
    } else {
      // Regular explanation
      formatted.push(section.trim() + '\n');
    }
  });

  return formatted.join('\n');
}

// Helper function to detect subject area
function detectSubject(message) {
  const subjects = {
    math: ['math', 'algebra', 'geometry', 'calculus', 'equation', 'number'],
    physics: ['physics', 'force', 'energy', 'motion', 'gravity'],
    chemistry: ['chemistry', 'reaction', 'molecule', 'atom', 'element'],
    biology: ['biology', 'cell', 'organism', 'gene', 'evolution'],
    literature: ['literature', 'book', 'poem', 'writing', 'author'],
    history: ['history', 'war', 'civilization', 'period', 'century'],
    programming: ['code', 'programming', 'function', 'algorithm', 'variable']
  };

  const lowercaseMessage = message.toLowerCase();
  
  for (const [subject, keywords] of Object.entries(subjects)) {
    if (keywords.some(keyword => lowercaseMessage.includes(keyword))) {
      return subject;
    }
  }
  
  return 'general';
}

// Helper function to get subject-specific prompts
function getSubjectPrompt(subject) {
  const subjectPrompts = {
    math: `As a math tutor, focus on:
- Breaking down problems step-by-step
- Explaining mathematical concepts clearly
- Providing visual representations when possible
- Including practice problems with solutions`,
    
    physics: `As a physics tutor, focus on:
- Connecting concepts to real-world applications
- Using diagrams and illustrations
- Explaining formulas and their derivations
- Walking through problem-solving strategies`,
    
    chemistry: `As a chemistry tutor, focus on:
- Explaining molecular interactions
- Using molecular diagrams
- Breaking down chemical reactions
- Connecting to real-world applications`,
    
    biology: `As a biology tutor, focus on:
- Explaining biological processes clearly
- Using diagrams and illustrations
- Connecting concepts to real-life examples
- Explaining cause-and-effect relationships`,
    
    literature: `As a literature tutor, focus on:
- Analyzing themes and literary devices
- Providing textual evidence
- Explaining writing techniques
- Helping with essay structure`,
    
    history: `As a history tutor, focus on:
- Explaining historical context
- Making connections between events
- Analyzing cause and effect
- Providing relevant primary sources`,
    
    programming: `As a programming tutor, focus on:
- Explaining code concepts clearly
- Providing code examples
- Following best practices
- Debugging common issues`,
    
    general: `As a general tutor, focus on:
- Breaking down concepts clearly
- Providing relevant examples
- Encouraging critical thinking
- Checking understanding`
  };

  return subjectPrompts[subject] || subjectPrompts.general;
}

// Export helper functions for potential future use
export const helpers = {
  detectSubject,
  getSubjectPrompt,
  formatResponse
}; 