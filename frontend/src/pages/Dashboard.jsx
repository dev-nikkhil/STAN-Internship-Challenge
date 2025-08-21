import ChatBox from "../components/dashboard/ChatBox.jsx";
import Sidebar from "../components/dashboard/SideBar";
import { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext.jsx";
import { FiMenu, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ChatWindow from "../components/dashboard/ChatWindow.jsx";

export default function Dashboard() {
  const { isAuthenticated, logout, isLoggingOut } = useAuth();
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Session history states
  const [userSessions, setUserSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);

  const API_BASE_URL = 'http://localhost:3003';

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Handle API errors
  const handleAPIError = (response) => {
    if (response.status === 401 || response.status === 403) {
      console.log('Token expired, logging out...');
      logout();
      return;
    }
    throw new Error(`API Error: ${response.status}`);
  };

  // Fetch all user sessions
  const fetchUserSessions = async () => {
    const token = getAuthToken();
    if (!token) {
      logout();
      return;
    }

    setLoadingSessions(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/sessions/allSessions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          setUserSessions([]);
          return;
        }
        handleAPIError(response);
      }

      const data = await response.json();
      if (data.sessions) {
        setUserSessions(data.sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setUserSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  // Fetch specific session with history
  const fetchSessionById = async (sessionId) => {
    const token = getAuthToken();
    if (!token) {
      logout();
      return;
    }

    setLoadingSession(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        handleAPIError(response);
      }

      const data = await response.json();
      return data.session;
    } catch (error) {
      console.error('Error fetching session:', error);
      return null;
    } finally {
      setLoadingSession(false);
    }
  };

  // Transform history to messages for chat display
  const transformHistoryToMessages = (history) => {
    const messages = [];
    
    history.forEach((item, index) => {
      // Add user message
      messages.push({
        id: `user-${index}-${Date.now()}`,
        sender: 'user',
        text: item.content,
        timestamp: new Date(item.timestamp)
      });

      // Add bot message
      messages.push({
        id: `bot-${index}-${Date.now()}`,
        sender: 'bot',
        text: item.content,
        timestamp: new Date(item.timestamp)
      });
    });

    return messages;
  };

  // Handle session selection from sidebar
  const handleSessionSelect = async (selectedSessionId) => {
    if (selectedSessionId === sessionId) {
      return; 
    }

    console.log('Loading session:', selectedSessionId);
    const sessionData = await fetchSessionById(selectedSessionId);
    
    if (sessionData) {
      const transformedMessages = transformHistoryToMessages(sessionData.history || []);
      
      // Update state
      setSessionId(selectedSessionId);
      setMessages(transformedMessages);
      
      console.log(`Loaded session ${selectedSessionId} with ${transformedMessages.length} messages`);
    }
  };

  const handleNewChat = () => {
    setSessionId(null);
    setMessages([]);
    setIsLoading(false);
    console.log('Started new chat - sessionId reset');
  };

  // Fetch user sessions on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserSessions();
    }
  }, [isAuthenticated]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoggingOut) {
      navigate('/');
    }
  }, [isAuthenticated, isLoggingOut, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // API call for new chat session
  const callNewChatSession = async (message) => {
    const token = getAuthToken();
    if (!token) {
      logout();
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/sessions/newSession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      handleAPIError(response);
    }

    return await response.json();
  };

  // API call for continuing chat session
  const callContinueSession = async (sessionId, message) => {
    const token = getAuthToken();
    if (!token) {
      logout();
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/sessions/continueSession/${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      handleAPIError(response);
    }

    return await response.json();
  };

  // Add user message to chat
  const addUserMessage = (message) => {
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: message,
      timestamp: new Date()
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
  };

  // Add bot message to chat
  const addBotMessage = (response) => {
    const botMessage = {
      id: Date.now() + 1,
      sender: 'bot',
      text: response,
      timestamp: new Date()
    };
    setMessages(prevMessages => [...prevMessages, botMessage]);
  };

  // Main message handler with API integration
  const handleSendMessage = async (message) => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    console.log('Sending:', message);
    
    addUserMessage(message);
    setIsLoading(true);

    try {
      if (sessionId === null) {
        // First message - call new chat session API
        console.log('Calling new chat session API');
        const apiResponse = await callNewChatSession(message);
        
        if (apiResponse && apiResponse.success) {
          setSessionId(apiResponse.data.sessionId);
          console.log('Session ID stored:', apiResponse.data.sessionId);
          
          addBotMessage(apiResponse.data.response);
          
          // Refresh sessions list to include the new session
          fetchUserSessions();
        } else if (apiResponse) {
          throw new Error(apiResponse.error || 'Failed to create session');
        }
      } else {
        // Continue existing session
        console.log('Calling continue session API with sessionId:', sessionId);
        const apiResponse = await callContinueSession(sessionId, message);
        
        if (apiResponse && apiResponse.success) {
          addBotMessage(apiResponse.data.response);
        } else if (apiResponse) {
          throw new Error(apiResponse.error || 'Failed to continue conversation');
        }
      }
    } catch (error) {
      console.error('API Error:', error);
      
      const errorMessage = {
        id: Date.now() + 2,
        sender: 'bot',
        text: `Error: ${error.message}. Please try again.`,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen while checking authentication
  if (!isAuthenticated && isLoggingOut) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#FFF0F5] via-[#F0F8FF] to-[#F5F5DC]">
        <div className="text-xl text-gray-800">Signing out...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#FFF0F5] via-[#F0F8FF] to-[#F5F5DC] relative text-gray-800 overflow-hidden">
      
      {/* Sidebar Toggle Button - Updated colors */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 z-50 w-12 h-12 bg-gradient-to-r from-[#FF6B6B] to-[#FD79A8] hover:from-[#FF8E53] hover:to-[#FF9AA2] text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
          isSidebarOpen ? 'left-72' : 'left-4'
        }`}
      >
        {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={toggleSidebar} />
          <div className="w-64 h-full relative z-10">
            <Sidebar 
              onNewChat={handleNewChat}
              userSessions={userSessions}
              currentSessionId={sessionId}
              onSessionSelect={handleSessionSelect}
              loadingSessions={loadingSessions}
              loadingSession={loadingSession}
            />
          </div>
        </div>
      )}

      {/* Main Dashboard - Full width */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        
        {/* ChatWindow - Takes full height */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow 
            messages={messages} 
            isLoading={isLoading || loadingSession}
          />
        </div>

        {/* ChatBox */}
        <div className="h-24 p-2">
          <ChatBox onSendMessage={handleSendMessage} isLoading={isLoading || loadingSession} />
        </div>
      </div>
    </div>
  );
}