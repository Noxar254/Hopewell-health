/**
 * Hero buttons functionality tests for Hopewell Health website
 */

describe('Hopewell Health hero buttons tests', () => {
  // Setup test environment before each test
  beforeEach(() => {
    // Create a simplified HTML structure for testing hero buttons
    document.body.innerHTML = `
      <div class="hero-buttons">
        <a href="#" class="cta-button consultation-btn" data-service="general">Request Consultation</a>
        <a href="#mental-health" class="cta-button secondary">Mental Health Support</a>
        <a href="#" class="safe-space-button" id="openSafeSpaceModal"><i class="fas fa-heart"></i>Safe Space</a>
      </div>
      
      <section id="mental-health" class="mental-health"></section>
      
      <!-- Consultation Modal -->
      <div id="consultationModal" class="modal-container" style="display: none;">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Request a Consultation</h3>
            <button type="button" class="close-modal" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            <form id="consultationModalForm" class="modal-form">
              <div class="form-group">
                <label for="departmentModal">Department</label>
                <select id="departmentModal" name="departmentModal">
                  <option value="">Select Department</option>
                  <option value="general">General Medicine</option>
                  <option value="cardiology">Cardiology</option>
                </select>
              </div>
              <button type="submit" class="submit-btn">Submit Request</button>
            </form>
          </div>
        </div>
      </div>
      
      <!-- Safe Space Modal -->
      <div id="safeSpaceModal" class="modal-container" style="display: none;">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Safe Space - Mental Health Support</h3>
            <button type="button" class="close-modal" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            <form id="safeSpaceForm">
              <div class="form-group">
                <label for="preferredDate">Preferred Date</label>
                <input type="date" id="preferredDate" name="preferredDate">
              </div>
              <button type="submit" class="submit-btn">Book Session</button>
            </form>
          </div>
        </div>
      </div>
    `;
  });

  // Test consultation button
  test('consultation button should open the consultation modal', () => {
    // Load the hero-buttons.js script
    require('../hero-buttons.js');
    
    // Get the consultation button and modal
    const consultationBtn = document.querySelector('.consultation-btn');
    const consultationModal = document.getElementById('consultationModal');
    
    // Check initial state
    expect(consultationModal.style.display).toBe('none');
    
    // Click the consultation button
    consultationBtn.click();
    
    // Check if modal is displayed
    expect(consultationModal.style.display).toBe('flex');
    
    // Check if department has been preselected based on data-service attribute
    const departmentSelect = document.getElementById('departmentModal');
    expect(departmentSelect.value).toBe('general');
  });

  // Test mental health button
  test('mental health button should scroll to mental health section', () => {
    // Mock scrollIntoView
    const scrollIntoViewMock = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;
    
    // Load the script
    require('../hero-buttons.js');
    
    // Get the mental health button
    const mentalHealthBtn = document.querySelector('.hero-buttons .secondary');
    
    // Click the mental health button
    mentalHealthBtn.click();
    
    // Check if scrollIntoView was called with smooth behavior
    expect(scrollIntoViewMock).toHaveBeenCalledWith({behavior: 'smooth'});
  });

  // Test safe space button
  test('safe space button should open the safe space modal', () => {
    // Load the script
    require('../hero-buttons.js');
    
    // Get the safe space button and modal
    const safeSpaceBtn = document.getElementById('openSafeSpaceModal');
    const safeSpaceModal = document.getElementById('safeSpaceModal');
    
    // Check initial state
    expect(safeSpaceModal.style.display).toBe('none');
    
    // Click the safe space button
    safeSpaceBtn.click();
    
    // Check if modal is displayed
    expect(safeSpaceModal.style.display).toBe('flex');
    
    // Check if date input has min attribute set to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('preferredDate');
    expect(dateInput.min).toBe(today);
  });

  // Test modal close functionality
  test('modal close button should close the modal', () => {
    // Load the script
    require('../hero-buttons.js');
    
    // Open the consultation modal first
    const consultationBtn = document.querySelector('.consultation-btn');
    consultationBtn.click();
    
    const consultationModal = document.getElementById('consultationModal');
    expect(consultationModal.style.display).toBe('flex');
    
    // Click the close button
    const closeButton = consultationModal.querySelector('.close-modal');
    closeButton.click();
    
    // Check if modal is hidden
    expect(consultationModal.style.display).toBe('none');
  });

  // Test clicking outside modal to close
  test('clicking outside modal content should close the modal', () => {
    // Load the script
    require('../hero-buttons.js');
    
    // Open the consultation modal first
    const consultationBtn = document.querySelector('.consultation-btn');
    consultationBtn.click();
    
    const consultationModal = document.getElementById('consultationModal');
    expect(consultationModal.style.display).toBe('flex');
    
    // Click on the modal container (outside the content)
    consultationModal.click();
    
    // Check if modal is hidden
    expect(consultationModal.style.display).toBe('none');
  });
});