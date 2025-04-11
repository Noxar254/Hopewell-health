/**
 * Main script functionality tests for Hopewell Health website
 */

describe('Hopewell Health main script tests', () => {
  // Load the HTML structure before tests
  beforeEach(() => {
    document.body.innerHTML = `
      <nav class="navbar">
        <div class="logo">
          <img src="images/logo.png" alt="Hopewell Logo" class="logo-img">
          <h1>Hopewell</h1>
        </div>
        <div class="mobile-menu-toggle">
          <i class="fas fa-bars"></i>
        </div>
        <ul class="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact" class="contact-btn">Contact</a></li>
        </ul>
      </nav>
      <section id="home" class="hero">
        <div class="hero-content"></div>
      </section>
      <section id="services"></section>
      <section id="contact"></section>
    `;
  });

  // Test smooth scrolling functionality
  test('smooth scrolling should be applied to anchor links', () => {
    // Mock the scrollIntoView function
    const scrollIntoViewMock = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    // Load the script
    require('../script.js');

    // Trigger a click on an anchor link
    const homeLink = document.querySelector('a[href="#home"]');
    homeLink.click();

    // Check if scrollIntoView was called with smooth behavior
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  // Test navbar scroll effect
  test('navbar should get "scrolled" class when page is scrolled', () => {
    // Load the script
    require('../script.js');

    // Get the navbar element
    const navbar = document.querySelector('.navbar');
    
    // Initially, navbar shouldn't have the "scrolled" class
    expect(navbar.classList.contains('scrolled')).toBe(false);
    
    // Simulate scrolling down
    Object.defineProperty(window, 'scrollY', { value: 100 });
    // Trigger scroll event
    window.dispatchEvent(new Event('scroll'));
    
    // After scrolling, navbar should have the "scrolled" class
    expect(navbar.classList.contains('scrolled')).toBe(true);
    
    // Simulate scrolling back to top
    Object.defineProperty(window, 'scrollY', { value: 0 });
    // Trigger scroll event
    window.dispatchEvent(new Event('scroll'));
    
    // After scrolling to top, navbar shouldn't have the "scrolled" class
    expect(navbar.classList.contains('scrolled')).toBe(false);
  });

  // Test mobile menu toggle
  test('mobile menu toggle should show/hide nav links', () => {
    // Load the script
    require('../script.js');
    
    // Get relevant elements
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Initially, nav links shouldn't have the "active" class
    expect(navLinks.classList.contains('active')).toBe(false);
    
    // Click the mobile menu toggle
    mobileMenuToggle.click();
    
    // After clicking, nav links should have the "active" class
    expect(navLinks.classList.contains('active')).toBe(true);
    
    // Icon should be changed
    const icon = mobileMenuToggle.querySelector('i');
    expect(icon.classList.contains('fa-times')).toBe(true);
    expect(icon.classList.contains('fa-bars')).toBe(false);
    
    // Click again to hide
    mobileMenuToggle.click();
    
    // After clicking again, nav links shouldn't have the "active" class
    expect(navLinks.classList.contains('active')).toBe(false);
    
    // Icon should be changed back
    expect(icon.classList.contains('fa-bars')).toBe(true);
    expect(icon.classList.contains('fa-times')).toBe(false);
  });
});