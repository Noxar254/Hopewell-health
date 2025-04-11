/**
 * Form handling tests for Hopewell Health website
 */

describe('Hopewell Health form handling tests', () => {
  // Setup the test environment before each test
  beforeEach(() => {
    // Create a simplified HTML structure for testing forms
    document.body.innerHTML = `
      <!-- Consultation Form -->
      <form id="consultationForm" class="consultation-form">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" required>
        </div>
        <div class="form-group">
          <label for="department">Department</label>
          <select id="department" name="department" required>
            <option value="">Select Department</option>
            <option value="cardiology">Cardiology</option>
            <option value="general">General Medicine</option>
          </select>
        </div>
        <div class="form-group">
          <label for="urgency">Urgency Level</label>
          <select id="urgency" name="urgency" required>
            <option value="">Select Urgency</option>
            <option value="emergency">Emergency</option>
            <option value="routine">Routine</option>
          </select>
        </div>
        <div class="form-group">
          <label for="message">Additional Information</label>
          <textarea id="message" name="message" rows="4"></textarea>
        </div>
        <div class="form-group">
          <input type="checkbox" id="privacy" name="privacy" required>
          <label for="privacy">I understand that my information will be kept confidential</label>
        </div>
        <button type="submit" class="submit-btn">Submit Request</button>
      </form>
      
      <!-- Contact Form -->
      <form id="contactForm" class="contact-form">
        <div class="form-group">
          <label for="contactName">Your Name</label>
          <input type="text" id="contactName" name="contactName" required>
        </div>
        <div class="form-group">
          <label for="contactEmail">Your Email</label>
          <input type="email" id="contactEmail" name="contactEmail" required>
        </div>
        <div class="form-group">
          <label for="contactMessage">Your Message</label>
          <textarea id="contactMessage" name="contactMessage" rows="4" required></textarea>
        </div>
        <button type="submit" class="submit-btn">Send Message</button>
      </form>
      
      <!-- Home Care Form -->
      <form id="homeCareForm" class="home-care-form">
        <div class="form-group">
          <label for="homeCareName">Full Name</label>
          <input type="text" id="homeCareName" name="homeCareName" required>
        </div>
        <div class="form-group">
          <label for="homeCarePhone">Phone Number</label>
          <input type="tel" id="homeCarePhone" name="homeCarePhone" required>
        </div>
        <div class="form-group">
          <label for="homeCareAddress">Delivery Address</label>
          <textarea id="homeCareAddress" name="homeCareAddress" rows="2" required></textarea>
        </div>
        <div class="form-group">
          <label for="serviceType">Service Required</label>
          <select id="serviceType" name="serviceType" required>
            <option value="">Select Service</option>
            <option value="lab-test">Laboratory Test</option>
            <option value="drug-delivery">Drug Delivery</option>
          </select>
        </div>
        <div class="form-group">
          <label for="preferredTime">Preferred Time</label>
          <input type="datetime-local" id="preferredTime" name="preferredTime" required>
        </div>
        <div class="form-group">
          <label for="prescription">Prescription (if applicable)</label>
          <input type="file" id="prescription" name="prescription" accept=".pdf,.jpg,.jpeg,.png">
        </div>
        <div class="form-group">
          <label for="labRequest">Lab Request Form (if applicable)</label>
          <input type="file" id="labRequest" name="labRequest" accept=".pdf,.jpg,.jpeg,.png">
        </div>
        <div class="form-group">
          <label for="additionalNotes">Additional Notes</label>
          <textarea id="additionalNotes" name="additionalNotes" rows="3"></textarea>
        </div>
        <div class="form-group">
          <input type="checkbox" id="homeCarePrivacy" name="homeCarePrivacy" required>
          <label for="homeCarePrivacy">I understand that my information will be kept secure</label>
        </div>
        <button type="submit" class="submit-btn">Request Service</button>
      </form>
    `;
    
    // Mock the sendToGoogleSheets function
    global.sendToGoogleSheets = jest.fn().mockImplementation(() => {
      return Promise.resolve({ success: true });
    });
    
    // Mock mailto functionality
    global.open = jest.fn();
    window.location.href = '';
    
    // Mock form validation functions
    global.validateForm = jest.fn().mockReturnValue(true);
    global.validateContactForm = jest.fn().mockReturnValue(true);
    global.validateHomeCareForm = jest.fn().mockReturnValue(true);
    
    // Mock helper functions
    global.showSuccessMessage = jest.fn();
    global.showErrorMessage = jest.fn();
    global.clearErrors = jest.fn();
    global.showError = jest.fn();
  });

  // Test consultation form submission
  test('consultation form should submit and show success message', async () => {
    // Load the script
    require('../script.js');
    
    // Get the consultation form
    const consultationForm = document.getElementById('consultationForm');
    
    // Fill out the form
    document.getElementById('name').value = 'Test User';
    document.getElementById('email').value = 'test@example.com';
    document.getElementById('phone').value = '+1234567890';
    document.getElementById('department').value = 'cardiology';
    document.getElementById('urgency').value = 'routine';
    document.getElementById('message').value = 'This is a test message';
    document.getElementById('privacy').checked = true;
    
    // Submit the form
    consultationForm.dispatchEvent(new Event('submit'));
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Check if sendToGoogleSheets was called with the correct data
    expect(global.sendToGoogleSheets).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test User',
        email: 'test@example.com',
        department: 'cardiology'
      }),
      'consultation'
    );
    
    // Check if success message was shown
    expect(global.showSuccessMessage).toHaveBeenCalledWith(
      consultationForm,
      expect.any(String)
    );
  });

  // Test contact form submission
  test('contact form should submit and show success message', async () => {
    // Load the script
    require('../script.js');
    
    // Get the contact form
    const contactForm = document.getElementById('contactForm');
    
    // Fill out the form
    document.getElementById('contactName').value = 'Contact User';
    document.getElementById('contactEmail').value = 'contact@example.com';
    document.getElementById('contactMessage').value = 'This is a contact message';
    
    // Submit the form
    contactForm.dispatchEvent(new Event('submit'));
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Check if sendToGoogleSheets was called with the correct data
    expect(global.sendToGoogleSheets).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Contact User',
        email: 'contact@example.com',
        message: 'This is a contact message'
      }),
      'contact'
    );
    
    // Check if success message was shown
    expect(global.showSuccessMessage).toHaveBeenCalledWith(
      contactForm,
      expect.any(String)
    );
  });

  // Test home care form submission
  test('home care form should submit and show success message', async () => {
    // Load the script
    require('../script.js');
    
    // Get the home care form
    const homeCareForm = document.getElementById('homeCareForm');
    
    // Mock the file input
    Object.defineProperty(document.getElementById('prescription'), 'files', {
      value: [{
        name: 'prescription.pdf',
        size: 1024 * 1024, // 1MB
        type: 'application/pdf'
      }]
    });
    
    // Fill out the form
    document.getElementById('homeCareName').value = 'Home Care User';
    document.getElementById('homeCarePhone').value = '+1234567890';
    document.getElementById('homeCareAddress').value = '123 Test Street';
    document.getElementById('serviceType').value = 'lab-test';
    document.getElementById('preferredTime').value = '2025-04-15T10:00';
    document.getElementById('additionalNotes').value = 'Please come in the morning';
    document.getElementById('homeCarePrivacy').checked = true;
    
    // Submit the form
    homeCareForm.dispatchEvent(new Event('submit'));
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Check if sendToGoogleSheets was called with the correct data
    expect(global.sendToGoogleSheets).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Home Care User',
        phone: '+1234567890',
        address: '123 Test Street',
        serviceType: 'lab-test',
        preferredTime: '2025-04-15T10:00'
      }),
      'homecare'
    );
    
    // Check if success message was shown
    expect(global.showSuccessMessage).toHaveBeenCalledWith(
      homeCareForm,
      expect.any(String)
    );
  });

  // Test form validation failure
  test('form should show error when validation fails', async () => {
    // Change mockImplementation to return false
    global.validateForm.mockReturnValue(false);
    
    // Load the script
    require('../script.js');
    
    // Get the consultation form
    const consultationForm = document.getElementById('consultationForm');
    
    // Submit the form without filling it out
    consultationForm.dispatchEvent(new Event('submit'));
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Check if sendToGoogleSheets was NOT called
    expect(global.sendToGoogleSheets).not.toHaveBeenCalled();
    
    // Check if clearErrors was called
    expect(global.clearErrors).toHaveBeenCalled();
  });

  // Test email client opening
  test('form submission should open email client with correct parameters', async () => {
    // Load the script
    require('../script.js');
    
    // Get the contact form
    const contactForm = document.getElementById('contactForm');
    
    // Fill out the form
    document.getElementById('contactName').value = 'Email Test User';
    document.getElementById('contactEmail').value = 'emailtest@example.com';
    document.getElementById('contactMessage').value = 'Testing email functionality';
    
    // Mock the location.href setter
    const originalHref = Object.getOwnPropertyDescriptor(window.location, 'href');
    Object.defineProperty(window.location, 'href', {
      set: jest.fn()
    });
    
    // Submit the form
    contactForm.dispatchEvent(new Event('submit'));
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Check if location.href was set to a mailto link
    expect(window.location.href.set).toHaveBeenCalledWith(
      expect.stringContaining('mailto:hopewell.healthcare22@yahoo.com')
    );
    
    // Restore original href
    Object.defineProperty(window.location, 'href', originalHref);
  });
});