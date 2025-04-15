// Logout function
function logoutUser() {
    // Either remove the item or set isLoggedIn to false
    // Removing entirely:
    // localStorage.removeItem('currentUser');
    
    // Alternative: Just set logged in flag to false to preserve user data
    try {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        user.isLoggedIn = false;
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error logging out:', error);
      // Fallback to removing the item completely
      localStorage.removeItem('currentUser');
    }
    
    // Redirect to home page
    window.location.href = 'index.html';
  }
  
  // Register a new user
  function registerUser(userData) {
    // only for demo, in future it will be pulled from database

    // Generate a fake user ID
    const userId = 'user_' + Math.random().toString(36).substr(2, 9);
    
    const user = {
      ...userData,
      id: userId,
      isLoggedIn: true,
      joined: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      rides: [],
      rating: 5.0 // Default rating for new users
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return user;
  }
  
  // Update user profile
  function updateUserProfile(updateData) {
    if (!isUserLoggedIn()) return null;
    
    try {
      const userData = localStorage.getItem('currentUser');
      const user = JSON.parse(userData);
      
      // Update user data with new values
      const updatedUser = {
        ...user,
        ...updateData,
        // Make sure these don't get overwritten
        isLoggedIn: true,
        id: user.id
      };
      
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }
  
  // Check if user's email is from Virginia Tech
  function isVTEmail(email) {
    return email && email.endsWith('vt.edu');
  }
  
  // Add navigation guard to protect routes
  function guardAuthenticatedRoute() {
    if (!isUserLoggedIn()) {
      // Redirect to login if not logged in
      window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
      return false;
    }
    return true;
  }
  
  // Update the navigation menu based on login status
  function updateNavigation() {
    const loggedIn = isUserLoggedIn();
    const navItems = document.querySelectorAll('nav ul.nav');
    
    if (navItems.length === 0) return;
    
    // Profile link should only show when logged in
    const profileLinks = document.querySelectorAll('nav a[href="profile.html"]');
    profileLinks.forEach(link => {
      const listItem = link.parentElement;
      if (listItem) {
        listItem.style.display = loggedIn ? 'inline-block' : 'none';
      }
    });
    
    // Add login/logout links
    const nav = navItems[0];
    
    // Remove any existing login/logout links
    const existingAuthLinks = document.querySelectorAll('.auth-nav-item');
    existingAuthLinks.forEach(link => link.remove());
    
    // Create new auth link
    const authItem = document.createElement('li');
    authItem.classList.add('auth-nav-item');
    authItem.style.marginLeft = 'auto';
    
    if (loggedIn) {
      // Create logout link
      const user = getCurrentUser();
      const userName = user.firstName || user.email.split('@')[0];
      
      authItem.innerHTML = `
        <span style="color: white; margin-right: 10px;">Hi, ${userName}</span>
        <a href="#" id="logout-link">Logout</a>
      `;
      nav.appendChild(authItem);
      
      // Add logout event listener
      document.getElementById('logout-link').addEventListener('click', function(e) {
        e.preventDefault();
        logoutUser();
      });
    } else {
      // Create login link
      authItem.innerHTML = `<a href="login.html">Login</a>`;
      nav.appendChild(authItem);
    }
  }
  
  // Initialize auth when the page loads
  document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    
    // Check for protected pages
    const protectedPages = ['profile.html', 'post-ride.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
      guardAuthenticatedRoute();
    }
  });
  
  // Export functions for use in other scripts
  export {
    isUserLoggedIn,
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
    updateUserProfile,
    isVTEmail,
    guardAuthenticatedRoute,
    updateNavigation
  };/**
   * Authentication utilities for Blacksburg Carpooling
   * This file provides functions for handling user authentication across the site
   */
  
  // Check if user is logged in
  function isUserLoggedIn() {
    const userData = localStorage.getItem('currentUser');
    if (!userData) return false;
    
    try {
      const user = JSON.parse(userData);
      return user && user.isLoggedIn === true;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return false;
    }
  }
  
  // Get current user data
  function getCurrentUser() {
    if (!isUserLoggedIn()) return null;
    
    try {
      return JSON.parse(localStorage.getItem('currentUser'));
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
  
  // Login function
  function loginUser(userData) {
    // Add logged in flag
    const user = {
      ...userData,
      isLoggedIn: true,
      lastLogin: new Date().toISOString()
    };
    
    // Store in localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return user;
  }