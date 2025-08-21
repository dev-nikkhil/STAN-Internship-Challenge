import Session from "../model/session.model.js";
import User from "../model/user.model.js";
import { callGeminiNewSession, callGeminiExistingSession } from "../services/openRouter.js"; // Changed import

// Helper function to generate chat title from first message
const generateTitle = (message) => {
  // Simple title generation - take first few words of the message
  const words = message.split(' ');
  if (words.length <= 5) return message;
  return words.slice(0, 5).join(' ') + '...';
};

export const createNewSession = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.userId;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a string',
      });
    }

    // 1. Create a new session with the user's first message
    const session = new Session({
      userId,
      title: generateTitle(message),
      history: [
        {
          role: 'user',
          content: message,
        }
      ],
    });

    // 2. Call Gemini API with the user's message (not full history array)
    const aiResponse = await callGeminiNewSession(message); // Changed to pass just the message

    // 3. Add the AI's response to the session history
    session.history.push({
      role: 'assistant',
      content: aiResponse,
    });

    // 4. Save the complete session
    await session.save();

    // 5. Send back the response and session ID
    res.status(201).json({
      success: true,
      data: {
        sessionId: session._id,
        response: aiResponse,
        title: session.title,
      },
    });

  } catch (err) {
    console.error('Error creating new chat session:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const continueSession = async (req, res) => {
  try {
    const { message } = req.body;
    const { sessionId } = req.params;
    const userId = req.user.userId;

    if (!message?.trim()) {
      return res.status(400).json({ 
        success: false,
        error: 'Message cannot be empty' 
      });
    }

    const session = await Session.findOne({
      _id: sessionId,
      userId 
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    // Build conversation history for context (using the helper function)
    const messagesForLLM = buildConversationPrompt(session.history, message); // Added current message

    // Get AI response using existing session function
    const aiResponse = await callGeminiExistingSession(messagesForLLM);

    // Update session with new messages
    session.history.push(
      { role: 'user', content: message },
      { role: 'assistant', content: aiResponse }
    );

    await session.save();

    res.json({
      success: true,
      data: {
        response: aiResponse,
        sessionId: session._id,
        history: session.history
      }
    });

  } catch (error) {
    console.error('Continue Session Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const buildConversationPrompt = (history, currentMessage = null) => {
  const messages = [];

  // Add conversation history
  history.forEach(message => {
    messages.push({
      role: message.role,
      content: message.content
    });
  });

  // Add current message if provided
  if (currentMessage) {
    messages.push({
      role: 'user',
      content: currentMessage
    });
  }

  return messages;
};

export const getAllSessions = async (req, res) => {
  try {
    console.log('req coming');
    const userId = req.user.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        message: "User does not exist"
      });
    }

    
    const sessions = await Session.find({ userId })
      .select('title createdAt _id')  
      .sort({ createdAt: -1 })
      .lean();

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({
        message: "No sessions found"
      });
    }

    return res.status(200).json({
      message: "Sessions fetched successfully",
      sessions
    });

  } catch (error) {
    console.error('Error fetching sessions:', error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    
    if (!sessionId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid session ID format"
      });
    }

    
    const session = await Session.findOne({ 
      _id: sessionId, 
      userId: userId 
    }).lean();

    if (!session) {
      return res.status(404).json({
        message: "Session not found"
      });
    }

    return res.status(200).json({
      message: "Session fetched successfully",
      session
    });

  } catch (error) {
    console.error('Error fetching session by ID:', error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};