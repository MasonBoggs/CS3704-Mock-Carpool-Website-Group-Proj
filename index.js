// Wait until the DOM is ready before initializing EmailJS
document.addEventListener('DOMContentLoaded', () => {
    // Replace with your actual EmailJS user ID (found in your EmailJS dashboard)
    emailjs.init('EWEmQ8PqoIBDnuW_w');
  });
  
  /**
   * sendMail - Sends an email using EmailJS based on the form input
   * @returns {boolean} false to prevent normal form submission
   */
  function sendMail() {
    // Grab values from form inputs
    const userEmail = document.getElementById('userEmail').value;
    const subject   = document.getElementById('subject').value;
    const message   = document.getElementById('message').value;
  
    // Construct params matching your EmailJS template fields
    const params = {
      userEmail: userEmail,
      subject:   subject,
      message:   message
    };
  
    // Replace with your actual service ID and template ID from EmailJS
    const serviceID  = 'service_77wy542';
    const templateID = 'template_qowo76y';
  
    // Attempt to send the email
    emailjs.send(serviceID, templateID, params)
      .then((res) => {
        console.log('SUCCESS!', res.status, res.text);
  
        // Optionally clear the form fields on success
        document.getElementById('userEmail').value = '';
        document.getElementById('subject').value   = '';
        document.getElementById('message').value   = '';
  
        // Notify the user
        alert('Your message was sent successfully!');
      })
      .catch((err) => {
        console.error('FAILED...', err);
        alert('Oops, something went wrong. Please try again.');
      });
  
    // Return false to prevent a full page reload or navigation
    return false;
  }
  