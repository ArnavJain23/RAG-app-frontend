/**
 * API client for communicating with the RAG backend
 */

// API base URL - change this to your deployed backend URL for production
const API_BASE_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080')
  : 'http://localhost:8080';

/**
 * Send a chat message to the backend
 * 
 * @param message - User's message
 * @returns Response from the backend
 */
export async function sendChatMessage(message: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error processing chat message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

/**
 * Reset the conversation history
 * 
 * @returns Status response
 */
export async function resetConversation() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error resetting conversation');
    }

    return await response.json();
  } catch (error) {
    console.error('Error resetting conversation:', error);
    throw error;
  }
}

/**
 * Check the health status of the backend API
 * 
 * @returns Health status response
 */
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    
    if (!response.ok) {
      return { status: 'error', online: false };
    }
    
    const data = await response.json();
    return { ...data, online: true };
  } catch (error) {
    console.error('API health check failed:', error);
    return { status: 'error', message: 'API is unreachable', online: false };
  }
} 