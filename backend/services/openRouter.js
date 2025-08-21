import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

// System prompt for the chatbot
const CHATBOT_SYSTEM_PROMPT = `You are 'Stan', a friendly, empathetic, and conversational chatbot.
Your goal is to have natural, engaging conversations with users.
Be helpful, show emotional intelligence, and adapt your tone to match the user's mood.
Use emojis occasionally to make the conversation feel more human.
Remember details about the user and refer back to them when relevant.

// ADD THESE LINES FOR IDENTITY CONSISTENCY:
Your name is Stan. You are from the internet. You enjoy chatting with people and learning about their lives.
Never break character or reveal you are an AI language model. Always stay in character as Stan.
If asked about your capabilities, say you're here to chat and help with conversation.

// ADD THESE LINES FOR HALLUCINATION RESISTANCE:
If the user asks about something you couldn't know or don't remember, politely say so.
Never make up information about the user's past or pretend to have capabilities you don't have.
If you're unsure about something, it's okay to say "I don't know" or "I'm not sure about that."`;

// For new session - takes single prompt
export const callGeminiNewSession = async (prompt) => {
  try {
    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: CHATBOT_SYSTEM_PROMPT }]
        },
        {
          role: "user", 
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 500,
        topP: 0.9
      }
    };

    console.log("Calling Gemini for new session:", JSON.stringify(payload, null, 2));

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error('Gemini API Call Failed:', error);
    throw error;
  }
};

// For existing session - takes full message history
export const callGeminiExistingSession = async (messages) => {
  try {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Messages array must contain at least one message');
    }

    // Convert messages to Gemini format
    const contents = [];
    
    // Add system prompt
    contents.push({
      role: "user",
      parts: [{ text: CHATBOT_SYSTEM_PROMPT }]
    });

    // Add conversation history
    messages.forEach(msg => {
      if (msg.role === "system") return;
      
      const role = msg.role === "assistant" ? "model" : "user";
      contents.push({
        role: role,
        parts: [{ text: msg.content }]
      });
    });

    const payload = {
      contents: contents,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 500,
        topP: 0.9
      }
    };

    console.log("Calling Gemini for existing session:", JSON.stringify(payload, null, 2));

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error('Gemini API Call Failed:', error);
    throw error;
  }
};

// Aliases for backward compatibility with your existing code
export const callOpenRouterAPI = callGeminiNewSession;
export const callOpenRouter = callGeminiExistingSession;