/**
 * Chat functionality for Blacksburg Carpooling
 * This file provides functions for the in-app chat system
 */

// Store active chats in memory
let activeChats = {};

// Get the current user for message attribution
function getCurrentUser() {
  const userData = localStorage.getItem('currentUser');
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

// Initialize a new chat session with a driver
function initializeChat(driverId, driverName) {
  // Check if we already have a chat with this driver
  if (activeChats[driverId]) {
    return activeChats[driverId];
  }
  
  // Create a new chat session
  const chat = {
    id: driverId,
    driverName: driverName,
    messages: [],
    unreadCount: 0
  };
  
  // In a real app, we would load previous messages from the server
  // For this demo, we'll just store in memory
  activeChats[driverId] = chat;
  
  return chat;
}

// Add a message to the chat
function addMessage(chatId, message, isFromCurrentUser) {
  // Get the chat
  const chat = activeChats[chatId];
  if (!chat) return null;
  
  // Create the message object
  const messageObj = {
    id: Date.now(), // Use timestamp as ID
    text: message,
    isFromCurrentUser: isFromCurrentUser,
    timestamp: new Date().toISOString()
  };
  
  // Add to chat messages
  chat.messages.push(messageObj);
  
  // If not from current user, increment unread count
  if (!isFromCurrentUser) {
    chat.unreadCount++;
  }
  
  // In a real app, we would send this to the server
  
  return messageObj;
}

// Mark chat as read
function markChatAsRead(chatId) {
  const chat = activeChats[chatId];
  if (!chat) return;
  
  chat.unreadCount = 0;
}

// Create and open a chat popup window
function openChatPopup(driverId, driverName) {
  // Initialize the chat
  const chat = initializeChat(driverId, driverName);
  
  // Check if popup already exists
  let chatPopup = document.getElementById(`chat-popup-${driverId}`);
  
  if (chatPopup) {
    // Just show it if it already exists
    chatPopup.style.display = 'flex';
    markChatAsRead(driverId);
    return;
  }
  
  // Create the chat popup element
  chatPopup = document.createElement('div');
  chatPopup.id = `chat-popup-${driverId}`;
  chatPopup.className = 'chat-popup';
  
  // Create the popup content
  chatPopup.innerHTML = `
    <div class="chat-header">
      <h3>Chat with ${driverName}</h3>
      <button class="close-btn">&times;</button>
    </div>
    <div class="chat-messages" id="chat-messages-${driverId}">
      <p class="system-message">Start chatting with ${driverName}...</p>
    </div>
    <div class="chat-input">
      <input type="text" placeholder="Type your message..." id="chat-input-${driverId}">
      <button class="send-btn">Send</button>
    </div>
  `;
  
  // Add to the document
  document.body.appendChild(chatPopup);
  
  // Load existing messages
  loadChatMessages(driverId);
  
  // Set up event listeners
  const closeBtn = chatPopup.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => {
    chatPopup.style.display = 'none';
  });
  
  const input = chatPopup.querySelector(`#chat-input-${driverId}`);
  const sendBtn = chatPopup.querySelector('.send-btn');
  
  // Send message on button click
  sendBtn.addEventListener('click', () => {
    sendChatMessage(driverId);
  });
  
  // Send message on Enter key
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendChatMessage(driverId);
    }
  });
  
  // Mark chat as read when opened
  markChatAsRead(driverId);
}

// Load chat messages into the popup
function loadChatMessages(chatId) {
  const chat = activeChats[chatId];
  if (!chat) return;
  
  const messagesContainer = document.getElementById(`chat-messages-${chatId}`);
  if (!messagesContainer) return;
  
  // Clear existing messages (except system message)
  const systemMessage = messagesContainer.querySelector('.system-message');
  messagesContainer.innerHTML = '';
  if (systemMessage) {
    messagesContainer.appendChild(systemMessage);
  }
  
  // Add all messages
  chat.messages.forEach(message => {
    const messageEl = document.createElement('p');
    messageEl.className = message.isFromCurrentUser ? 'user-message' : 'driver-message';
    messageEl.textContent = message.text;
    messagesContainer.appendChild(messageEl);
  });
  
  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send a new chat message
function sendChatMessage(chatId) {
  const input = document.getElementById(`chat-input-${chatId}`);
  if (!input) return;
  
  const message = input.value.trim();
  if (!message) return;
  
  // Add message to chat
  addMessage(chatId, message, true);
  
  // Clear input
  input.value = '';
  
  // Reload messages
  loadChatMessages(chatId);
  
  // In a real app, we would send this to the server and wait for confirmation
  
  // Simulate a response after a delay
  setTimeout(() => {
    // Get user and create appropriate response
    const user = getCurrentUser();
    let responseText = `This is a demo chat. In a real app, the driver would respond here.`;
    
    if (user && user.firstName) {
      responseText = `Hi ${user.firstName}! This is a demo chat. In a real app, I would respond to your message.`;
    }
    
    addMessage(chatId, responseText, false);
    loadChatMessages(chatId);
    
    // Notify the user if the chat is not open
    const chatPopup = document.getElementById(`chat-popup-${chatId}`);
    if (chatPopup && chatPopup.style.display === 'none') {
      // TODO: Add notification logic
    }
  }, 1000);
}

// Get total unread message count
function getUnreadMessageCount() {
  let total = 0;
  Object.values(activeChats).forEach(chat => {
    total += chat.unreadCount;
  });
  return total;
}

// Add chat button click handler to all ride posts
function setupChatButtons() {
  const chatButtons = document.querySelectorAll('.chat-btn');
  chatButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the ride data
      const ridePost = this.closest('.ride-post');
      const rideId = ridePost.dataset.rideId;
      const driverName = ridePost.querySelector('p:first-child').textContent.split(':')[1].trim().split('(')[0].trim();
      
      // Open chat popup
      openChatPopup(rideId, driverName);
    });
  });
}

// Initialize chat system when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Set up chat buttons after rides are loaded
  // This should be called after the rides are displayed
  setTimeout(setupChatButtons, 500);
});

// Export functions for use in other scripts
export {
  initializeChat,
  addMessage,
  markChatAsRead,
  openChatPopup,
  getUnreadMessageCount,
  setupChatButtons
};