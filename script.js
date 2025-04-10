// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Form Modal System - Opens/closes modal forms
document.addEventListener('DOMContentLoaded', () => {
    // ------ Modal Form System ------
    function setupModalSystem() {
        const modals = {
            'consultationModal': {
                openButtons: ['#consultation-btn', '.cta-button:first-child'],
                closeButtons: '#consultationModal .close-modal',
                form: '#consultationModalForm'
            },
            'homeCareModal': {
                openButtons: ['#requestHomeCareCTA'],
                closeButtons: '#homeCareModal .close-modal',
                form: '#homeCareModalForm'
            },
            'medicalTourismModal': {
                openButtons: ['#tourism-inquiry-btn', '#exploreMedicalTourism'],
                closeButtons: '#medicalTourismModal .close-modal',
                form: '#medicalTourismModalForm'
            }
        };

        // Function to open modal
        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
                
                // Focus on the first input field for accessibility
                setTimeout(() => {
                    const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea');
                    if (firstInput) firstInput.focus();
                }, 100);
                
                // Announce modal opened for screen readers
                const liveRegion = document.createElement('div');
                liveRegion.setAttribute('aria-live', 'assertive');
                liveRegion.setAttribute('class', 'sr-only');
                liveRegion.textContent = `${modal.querySelector('.modal-header h3').textContent} dialog opened`;
                document.body.appendChild(liveRegion);
                setTimeout(() => document.body.removeChild(liveRegion), 1000);
            }
        }

        // Function to close modal
        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scrolling
            }
        }

        // Set up each modal
        Object.entries(modals).forEach(([modalId, config]) => {
            // Set up open buttons
            config.openButtons.forEach(selector => {
                const buttons = document.querySelectorAll(selector);
                buttons.forEach(button => {
                    if (button) {
                        button.addEventListener('click', (e) => {
                            e.preventDefault();
                            openModal(modalId);
                        });
                    }
                });
            });

            // Set up close buttons
            const closeButtons = document.querySelectorAll(config.closeButtons);
            closeButtons.forEach(button => {
                if (button) {
                    button.addEventListener('click', () => closeModal(modalId));
                }
            });

            // Close when clicking outside modal content
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        closeModal(modalId);
                    }
                });
            }

            // Set up form submission
            const form = document.querySelector(config.form);
            if (form) {
                form.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    
                    // Get form data
                    const formData = new FormData(this);
                    let emailSubject = '';
                    
                    // Set subject based on form
                    if (modalId === 'consultationModal') {
                        emailSubject = 'New Consultation Request';
                    } else if (modalId === 'homeCareModal') {
                        emailSubject = 'Home Care Service Request';
                    } else if (modalId === 'medicalTourismModal') {
                        emailSubject = 'Medical Tourism Inquiry';
                    }
                    
                    // Prepare email content
                    let emailBody = `${emailSubject}:\n\n`;
                    formData.forEach((value, key) => {
                        if (value instanceof File) {
                            if (value.name) {
                                emailBody += `${key}: File attached (${value.name})\n`;
                            }
                        } else {
                            emailBody += `${key}: ${value}\n`;
                        }
                    });
                    
                    // Show loading state
                    const submitBtn = form.querySelector('.submit-btn');
                    const originalText = submitBtn.textContent;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                    
                    try {
                        // Send email using mailto
                        const mailtoLink = `mailto:humphreyabwao@yahoo.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                        window.location.href = mailtoLink;
                        
                        // Show success message
                        submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                        
                        // Reset and close form after delay
                        setTimeout(() => {
                            form.reset();
                            submitBtn.disabled = false;
                            submitBtn.textContent = originalText;
                            closeModal(modalId);
                            
                            // Show confirmation alert
                            alert('Thank you for your submission! An email has been prepared in your default email client. Please send it to complete your request.');
                        }, 1500);
                        
                    } catch (error) {
                        console.error('Error:', error);
                        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
                        
                        setTimeout(() => {
                            submitBtn.disabled = false;
                            submitBtn.textContent = originalText;
                            alert('There was an error processing your request. Please try again or contact us directly.');
                        }, 1500);
                    }
                });
            }
        });

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                Object.keys(modals).forEach(modalId => {
                    const modal = document.getElementById(modalId);
                    if (modal && modal.style.display === 'flex') {
                        closeModal(modalId);
                    }
                });
            }
        });

        // Add additional modal triggers
        // Home page CTA button
        const ctaButton = document.querySelector('.hero .cta-button:first-child');
        if (ctaButton) {
            ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                openModal('consultationModal');
            });
        }

        // Add a button to the Medical Tourism section
        const medicalTourismSection = document.querySelector('.medical-tourism-info');
        if (medicalTourismSection) {
            const tourismBtn = document.createElement('a');
            tourismBtn.href = '#';
            tourismBtn.id = 'tourism-inquiry-btn';
            tourismBtn.className = 'cta-button';
            tourismBtn.textContent = 'Request Information';
            tourismBtn.style.display = 'inline-block';
            tourismBtn.style.marginTop = '30px';
            
            // Check if we already have this button
            if (!document.getElementById('tourism-inquiry-btn')) {
                medicalTourismSection.appendChild(tourismBtn);
            }
        }

        // Service cards - add buttons to each service
        document.querySelectorAll('.service-card').forEach(card => {
            const serviceName = card.querySelector('h3').textContent;
            const button = document.createElement('a');
            button.href = '#';
            button.className = 'service-btn consultation-btn';
            button.textContent = 'Book Consultation';
            button.dataset.service = serviceName;
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                // Set the department in the consultation form if possible
                const departmentSelect = document.getElementById('departmentModal');
                if (departmentSelect) {
                    // Try to match the service name with a department option
                    for (const option of departmentSelect.options) {
                        if (option.text.toLowerCase().includes(serviceName.toLowerCase()) ||
                            serviceName.toLowerCase().includes(option.text.toLowerCase())) {
                            departmentSelect.value = option.value;
                            break;
                        }
                    }
                }
                openModal('consultationModal');
            });
            
            // Only add if it doesn't have a button already
            if (!card.querySelector('.service-btn')) {
                card.appendChild(button);
            }
        });
    }

    // Initialize modal system
    setupModalSystem();

    // Setup payment option selection
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from siblings
            const siblings = [...this.parentElement.children];
            siblings.forEach(sibling => sibling.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Update payment instructions
            const instructionsDiv = this.closest('.payment-section').querySelector('.payment-instructions');
            const method = this.getAttribute('data-method');
            let instructions = '';
            
            switch(method) {
                case 'mpesa':
                    instructions = '<p><strong>M-Pesa Instructions:</strong> Send KSh 500 to Till No: 7636095 (Hopewell Health)</p>';
                    break;
                case 'card':
                    instructions = '<p><strong>Card Payment Instructions:</strong> Click the Submit button to be redirected to our secure payment gateway.</p>';
                    break;
                case 'bank':
                    instructions = '<p><strong>Bank Transfer Instructions:</strong> Transfer KSh 500 to Account: 1234567890, Bank: ABC Bank, Branch: Main.</p>';
                    break;
            }
            
            if (instructionsDiv) {
                instructionsDiv.innerHTML = instructions;
            }
        });
    });
});

// About Us Learn More button functionality
document.addEventListener('DOMContentLoaded', () => {
    const learnMoreBtn = document.getElementById('aboutLearnMore');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create modal container
            const modal = document.createElement('div');
            modal.className = 'about-modal';
            modal.setAttribute('aria-hidden', 'false');
            modal.setAttribute('role', 'dialog');
            
            // Modal content
            modal.innerHTML = `
                <div class="about-modal-content">
                    <div class="modal-header">
                        <h2>About Hopewell Health</h2>
                        <button type="button" class="close-modal" aria-label="Close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="about-history">
                            <h3>Our History</h3>
                            <p>Founded in 2010, Hopewell Health Services began as a small clinic with just three dedicated physicians. Over the years, we've grown into a comprehensive healthcare provider trusted by thousands of patients across the region.</p>
                        </div>
                        <div class="about-mission">
                            <h3>Our Mission</h3>
                            <p>At Hopewell Health, our mission is to provide accessible, compassionate, and high-quality healthcare services to all members of our community. We believe in treating the whole person—mind, body, and spirit.</p>
                        </div>
                        <div class="about-values">
                            <h3>Our Values</h3>
                            <ul>
                                <li><strong>Excellence:</strong> We strive for excellence in all aspects of patient care.</li>
                                <li><strong>Compassion:</strong> We treat each patient with dignity, respect, and empathy.</li>
                                <li><strong>Innovation:</strong> We embrace advanced medical technologies and practices.</li>
                                <li><strong>Integrity:</strong> We uphold the highest ethical standards in healthcare.</li>
                                <li><strong>Community:</strong> We are committed to serving and improving the health of our community.</li>
                            </ul>
                        </div>
                        <div class="about-team">
                            <h3>Our Leadership Team</h3>
                            <div class="team-grid">
                                <div class="team-member">
                                    <h4>Dr. Sarah Johnson</h4>
                                    <p>Chief Medical Officer</p>
                                </div>
                                <div class="team-member">
                                    <h4>Michael Reynolds</h4>
                                    <p>Chief Executive Officer</p>
                                </div>
                                <div class="team-member">
                                    <h4>Dr. David Chen</h4>
                                    <p>Head of Cardiology</p>
                                </div>
                                <div class="team-member">
                                    <h4>Dr. Rebecca Omondi</h4>
                                    <p>Head of Mental Health Services</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .about-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    overflow-y: auto;
                    padding: 20px;
                }
                
                .about-modal-content {
                    background-color: white;
                    border-radius: 10px;
                    max-width: 800px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                    animation: modalFadeIn 0.3s ease-out;
                }
                
                @keyframes modalFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                    position: sticky;
                    top: 0;
                    background: white;
                    z-index: 10;
                }
                
                .modal-header h2 {
                    color: #3498db;
                    margin: 0;
                }
                
                .modal-body {
                    padding: 20px;
                }
                
                .close-modal {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #555;
                }
                
                .close-modal:hover {
                    color: #3498db;
                }
                
                .about-history, .about-mission, .about-values, .about-team {
                    margin-bottom: 30px;
                }
                
                .about-history h3, .about-mission h3, .about-values h3, .about-team h3 {
                    color: #3498db;
                    margin-bottom: 15px;
                }
                
                .about-values ul {
                    padding-left: 20px;
                }
                
                .about-values li {
                    margin-bottom: 10px;
                }
                
                .team-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 20px;
                    margin-top: 15px;
                }
                
                .team-member {
                    background: #f9f9f9;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                }
                
                .team-member h4 {
                    margin: 0 0 5px 0;
                    color: #333;
                }
                
                .team-member p {
                    margin: 0;
                    color: #666;
                    font-size: 0.9em;
                }
                
                @media (max-width: 768px) {
                    .about-modal-content {
                        width: 95%;
                    }
                    
                    .team-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            `;
            
            document.head.appendChild(style);
            document.body.appendChild(modal);
            
            // Close modal functionality
            const closeModalBtn = modal.querySelector('.close-modal');
            closeModalBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            
            // Close when clicking outside the modal content
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    document.body.removeChild(modal);
                }
            });
            
            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && document.querySelector('.about-modal')) {
                    document.body.removeChild(modal);
                }
            });
        });
    }
});

// Function to send data to email
async function sendToGoogleSheets(formData, formType) {
    // Create loading indicator
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading-indicator';
    loadingElement.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Submitting...';
    document.body.appendChild(loadingElement);
    
    try {
        // Format form data for email
        let emailSubject = '';
        switch (formType) {
            case 'consultation':
                emailSubject = 'New Consultation Request from Website';
                break;
            case 'contact':
                emailSubject = 'New Contact Form Submission';
                break;
            case 'homecare':
                emailSubject = 'New Home Care Service Request';
                break;
            case 'therapy':
                emailSubject = 'New Therapy Session Booking';
                break;
            case 'medical-tourism':
                emailSubject = 'New Medical Tourism Inquiry';
                break;
            default:
                emailSubject = 'New Form Submission from Website';
        }
        
        // Format email body with form data
        let emailBody = `${formType.toUpperCase()} FORM SUBMISSION\n\n`;
        for (const [key, value] of Object.entries(formData)) {
            emailBody += `${key}: ${value}\n`;
        }
        emailBody += `\nSubmitted on: ${new Date().toLocaleString()}`;
        
        // Create mailto link
        const mailtoLink = `mailto:humphreyabwao@yahoo.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Remove loading indicator after a delay
        setTimeout(() => {
            if (document.body.contains(loadingElement)) {
                document.body.removeChild(loadingElement);
            }
        }, 1500);
        
        return { success: true };
        
    } catch (error) {
        console.error('Error submitting form:', error);
        
        // Remove loading indicator
        if (document.body.contains(loadingElement)) {
            document.body.removeChild(loadingElement);
        }
        
        return { success: false, error: error.message };
    }
}

// Scroll animations with performance optimization
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-card, .section-title, .feature');
    
    elements.forEach(element => {
        // Only process visible elements to improve performance
        if (isElementInViewport(element)) {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        }
    });
};

// Helper function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0 &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right >= 0
    );
}

// Initial state for animated elements
document.querySelectorAll('.animate-card, .section-title, .feature').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease-out';
});

// Use requestAnimationFrame for smoother animations
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            animateOnScroll();
            ticking = false;
        });
        ticking = true;
    }
});
window.addEventListener('load', animateOnScroll);

// Form submission feedback handlers
function showSuccessMessage(form, message) {
    const formContainer = form.parentElement;
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.innerHTML = `
        <h3>Thank You!</h3>
        <p>${message}</p>
        <button class="submit-btn close-success">Close</button>
    `;
    
    // Hide form and show success
    form.style.display = 'none';
    formContainer.appendChild(successMsg);
    
    // Add close button functionality
    const closeSuccessBtn = formContainer.querySelector('.close-success');
    closeSuccessBtn.addEventListener('click', () => {
        form.reset();
        form.style.display = 'block';
        successMsg.remove();
    });
}

function showErrorMessage(form, errorMessage) {
    const formContainer = form.parentElement;
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message-container';
    errorMsg.innerHTML = `
        <h3>Error</h3>
        <p>${errorMessage}</p>
        <button class="submit-btn close-error">Try Again</button>
    `;
    
    // Hide form and show error
    form.style.display = 'none';
    formContainer.appendChild(errorMsg);
    
    // Add close button functionality
    const closeErrorBtn = formContainer.querySelector('.close-error');
    closeErrorBtn.addEventListener('click', () => {
        form.style.display = 'block';
        errorMsg.remove();
    });
}

// Consultation Form Handling
const consultationForm = document.getElementById('consultationForm');
if (consultationForm) {
    consultationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Submitting...';
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            age: document.getElementById('age').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            department: document.getElementById('department').value,
            urgency: document.getElementById('urgency').value,
            message: document.getElementById('message').value,
            privacy: document.getElementById('privacy').checked ? "Agreed" : "Not Agreed"
        };

        // Validate form data
        if (!validateForm(formData)) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit Request";
            return;
        }

        // Send to Google Sheets
        const result = await sendToGoogleSheets(formData, 'consultation');
        
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Request";
        
        if (result.success) {
            showSuccessMessage(consultationForm, "Your consultation request has been submitted successfully. We will contact you shortly to confirm your appointment.");
        } else {
            showErrorMessage(consultationForm, "There was an error submitting your request. Please try again or contact us directly.");
        }
    });
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Submitting...';
        
        // Get form data
        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            message: document.getElementById('contactMessage').value
        };

        // Validate form data
        if (!validateContactForm(formData)) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";
            return;
        }

        // Send to Google Sheets
        const result = await sendToGoogleSheets(formData, 'contact');
        
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
        
        if (result.success) {
            showSuccessMessage(contactForm, "Your message has been sent successfully. We will get back to you as soon as possible.");
        } else {
            showErrorMessage(contactForm, "There was an error sending your message. Please try again or contact us directly.");
        }
    });
}

// Home Care Form Handling
const homeCareForm = document.getElementById('homeCareForm');
if (homeCareForm) {
    homeCareForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Submitting...';
        
        // Get form data
        const formData = {
            name: document.getElementById('homeCareName').value,
            phone: document.getElementById('homeCarePhone').value,
            address: document.getElementById('homeCareAddress').value,
            serviceType: document.getElementById('serviceType').value,
            preferredTime: document.getElementById('preferredTime').value,
            additionalNotes: document.getElementById('additionalNotes').value,
            privacy: document.getElementById('homeCarePrivacy').checked ? "Agreed" : "Not Agreed",
            hasPrescription: document.getElementById('prescription').files.length > 0 ? "Yes" : "No",
            hasLabRequest: document.getElementById('labRequest').files.length > 0 ? "Yes" : "No"
        };

        // Validate form data
        if (!validateHomeCareForm(formData)) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Request Service";
            return;
        }

        // Send to Google Sheets
        const result = await sendToGoogleSheets(formData, 'homecare');
        
        submitBtn.disabled = false;
        submitBtn.textContent = "Request Service";
        
        if (result.success) {
            showSuccessMessage(homeCareForm, "Your home care service request has been submitted successfully. We will contact you shortly to confirm the details.");
        } else {
            showErrorMessage(homeCareForm, "There was an error submitting your request. Please try again or contact us directly.");
        }
    });
}

// Medical Tourism Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    const exploreTourismBtn = document.getElementById('exploreMedicalTourism');
    
    if (exploreTourismBtn) {
        exploreTourismBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create modal container
            const modal = document.createElement('div');
            modal.className = 'tourism-modal';
            modal.setAttribute('aria-hidden', 'false');
            modal.setAttribute('role', 'dialog');
            
            // Modal content
            modal.innerHTML = `
                <div class="tourism-modal-content">
                    <div class="modal-header">
                        <h2>Medical Tourism Services</h2>
                        <button type="button" class="close-modal" aria-label="Close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="tourism-tabs">
                            <button class="tab-btn active" data-tab="overview">Overview</button>
                            <button class="tab-btn" data-tab="treatments">Treatments</button>
                            <button class="tab-btn" data-tab="packages">Packages</button>
                            <button class="tab-btn" data-tab="testimonials">Testimonials</button>
                        </div>
                        
                        <div class="tab-content active" id="overview">
                            <h3>Welcome to Hopewell Health Medical Tourism</h3>
                            <p>Experience world-class healthcare at a fraction of the cost. Our medical tourism program combines expert medical care with the opportunity to recover in beautiful Kenya.</p>
                            
                            <div class="tourism-features">
                                <div class="feature-item">
                                    <i class="fas fa-hospital-user"></i>
                                    <h4>International Patient Services</h4>
                                    <p>Dedicated coordinators to assist with travel, accommodation, and medical arrangements</p>
                                </div>
                                <div class="feature-item">
                                    <i class="fas fa-certificate"></i>
                                    <h4>Internationally Certified</h4>
                                    <p>Our facilities meet international healthcare standards</p>
                                </div>
                                <div class="feature-item">
                                    <i class="fas fa-wallet"></i>
                                    <h4>Cost Savings</h4>
                                    <p>Save up to 70% compared to treatment costs in Western countries</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="tab-content" id="treatments">
                            <h3>Available Treatments</h3>
                            <div class="treatments-grid">
                                <div class="treatment-card">
                                    <div class="treatment-icon"><i class="fas fa-heartbeat"></i></div>
                                    <h4>Cardiac Procedures</h4>
                                    <ul>
                                        <li>Coronary Artery Bypass</li>
                                        <li>Valve Replacement</li>
                                        <li>Angioplasty</li>
                                        <li>Pacemaker Implantation</li>
                                    </ul>
                                </div>
                                <div class="treatment-card">
                                    <div class="treatment-icon"><i class="fas fa-bone"></i></div>
                                    <h4>Orthopedic Procedures</h4>
                                    <ul>
                                        <li>Joint Replacement</li>
                                        <li>Spine Surgery</li>
                                        <li>Sports Injury Repair</li>
                                        <li>Arthroscopic Surgery</li>
                                    </ul>
                                </div>
                                <div class="treatment-card">
                                    <div class="treatment-icon"><i class="fas fa-eye"></i></div>
                                    <h4>Ophthalmology</h4>
                                    <ul>
                                        <li>LASIK Eye Surgery</li>
                                        <li>Cataract Surgery</li>
                                        <li>Glaucoma Treatment</li>
                                        <li>Retinal Procedures</li>
                                    </ul>
                                </div>
                                <div class="treatment-card">
                                    <div class="treatment-icon"><i class="fas fa-tooth"></i></div>
                                    <h4>Dental Procedures</h4>
                                    <ul>
                                        <li>Dental Implants</li>
                                        <li>Full Mouth Reconstruction</li>
                                        <li>Cosmetic Dentistry</li>
                                        <li>Advanced Oral Surgery</li>
                                    </ul>
                                </div>
                                <div class="treatment-card">
                                    <div class="treatment-icon"><i class="fas fa-user-md"></i></div>
                                    <h4>Cosmetic Surgery</h4>
                                    <ul>
                                        <li>Rhinoplasty</li>
                                        <li>Facelift</li>
                                        <li>Liposuction</li>
                                        <li>Breast Procedures</li>
                                    </ul>
                                </div>
                                <div class="treatment-card">
                                    <div class="treatment-icon"><i class="fas fa-stethoscope"></i></div>
                                    <h4>General Procedures</h4>
                                    <ul>
                                        <li>Bariatric Surgery</li>
                                        <li>Fertility Treatments</li>
                                        <li>Cancer Treatments</li>
                                        <li>Executive Health Checkup</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div class="tab-content" id="packages">
                            <h3>Medical Tourism Packages</h3>
                            <div class="packages-container">
                                <div class="package-card">
                                    <div class="package-header">
                                        <h4>Essential Package</h4>
                                        <div class="package-price">From $1,500</div>
                                    </div>
                                    <div class="package-body">
                                        <ul>
                                            <li><i class="fas fa-check"></i> Medical procedure</li>
                                            <li><i class="fas fa-check"></i> Airport pickup & drop-off</li>
                                            <li><i class="fas fa-check"></i> 3-night hospital stay</li>
                                            <li><i class="fas fa-check"></i> Translation services</li>
                                            <li><i class="fas fa-check"></i> Follow-up consultation</li>
                                        </ul>
                                        <button class="package-btn">Learn More</button>
                                    </div>
                                </div>
                                <div class="package-card premium">
                                    <div class="package-header">
                                        <div class="package-badge">Most Popular</div>
                                        <h4>Premium Package</h4>
                                        <div class="package-price">From $3,500</div>
                                    </div>
                                    <div class="package-body">
                                        <ul>
                                            <li><i class="fas fa-check"></i> Medical procedure</li>
                                            <li><i class="fas fa-check"></i> Airport VIP service</li>
                                            <li><i class="fas fa-check"></i> 5-night private hospital room</li>
                                            <li><i class="fas fa-check"></i> Translation services</li>
                                            <li><i class="fas fa-check"></i> 3-night hotel recovery stay</li>
                                            <li><i class="fas fa-check"></i> Private nurse during recovery</li>
                                            <li><i class="fas fa-check"></i> Two follow-up consultations</li>
                                        </ul>
                                        <button class="package-btn">Learn More</button>
                                    </div>
                                </div>
                                <div class="package-card">
                                    <div class="package-header">
                                        <h4>Luxury Package</h4>
                                        <div class="package-price">From $5,500</div>
                                    </div>
                                    <div class="package-body">
                                        <ul>
                                            <li><i class="fas fa-check"></i> Medical procedure</li>
                                            <li><i class="fas fa-check"></i> Private airport transfer</li>
                                            <li><i class="fas fa-check"></i> 7-night luxury hospital suite</li>
                                            <li><i class="fas fa-check"></i> Personal concierge</li>
                                            <li><i class="fas fa-check"></i> 7-night 5-star hotel recovery</li>
                                            <li><i class="fas fa-check"></i> 24/7 private nursing care</li>
                                            <li><i class="fas fa-check"></i> Tourist excursions during recovery</li>
                                            <li><i class="fas fa-check"></i> 6-month follow-up program</li>
                                        </ul>
                                        <button class="package-btn">Learn More</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="tab-content" id="testimonials">
                            <h3>Patient Testimonials</h3>
                            <div class="testimonials-container">
                                <div class="testimonial-card">
                                    <div class="testimonial-text">
                                        <p>"I saved over $45,000 on my heart surgery by choosing Hopewell Health. The care was excellent, and I recovered in a beautiful beachside hotel."</p>
                                    </div>
                                    <div class="testimonial-author">
                                        <div class="testimonial-name">John D.</div>
                                        <div class="testimonial-location">United States</div>
                                        <div class="testimonial-procedure">Cardiac Bypass Surgery</div>
                                    </div>
                                </div>
                                <div class="testimonial-card">
                                    <div class="testimonial-text">
                                        <p>"The dental work I had done was impeccable. I combined my treatment with a safari tour and had an amazing experience overall."</p>
                                    </div>
                                    <div class="testimonial-author">
                                        <div class="testimonial-name">Emma R.</div>
                                        <div class="testimonial-location">Canada</div>
                                        <div class="testimonial-procedure">Full Dental Reconstruction</div>
                                    </div>
                                </div>
                                <div class="testimonial-card">
                                    <div class="testimonial-text">
                                        <p>"After researching medical tourism destinations worldwide, I chose Hopewell Health for my knee replacement. The surgeons were world-class and the cost was a fraction of what I would pay at home."</p>
                                    </div>
                                    <div class="testimonial-author">
                                        <div class="testimonial-name">Michael T.</div>
                                        <div class="testimonial-location">United Kingdom</div>
                                        <div class="testimonial-procedure">Total Knee Replacement</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="tourism-cta">
                            <h3>Request More Information</h3>
                            <form id="medicalTourismForm">
                                <div class="form-group">
                                    <label for="tourismName">Full Name*</label>
                                    <input type="text" id="tourismName" name="tourismName" required>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="tourismEmail">Email Address*</label>
                                        <input type="email" id="tourismEmail" name="tourismEmail" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="tourismPhone">Phone Number*</label>
                                        <input type="tel" id="tourismPhone" name="tourismPhone" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="treatmentType">Interested In*</label>
                                    <select id="treatmentType" name="treatmentType" required>
                                        <option value="">Select Treatment Type</option>
                                        <option value="Cardiac">Cardiac Procedures</option>
                                        <option value="Orthopedic">Orthopedic Procedures</option>
                                        <option value="Dental">Dental Procedures</option>
                                        <option value="Cosmetic">Cosmetic Surgery</option>
                                        <option value="Eye">Ophthalmology</option>
                                        <option value="Other">Other Medical Services</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="tourismMessage">Additional Information</label>
                                    <textarea id="tourismMessage" name="tourismMessage" rows="4" placeholder="Please share any specific procedures you're interested in or questions you might have."></textarea>
                                </div>
                                <div class="form-group privacy-group">
                                    <input type="checkbox" id="tourismPrivacy" name="tourismPrivacy" required>
                                    <label for="tourismPrivacy">I agree to the privacy policy and consent to be contacted about medical tourism services.</label>
                                </div>
                                <div class="form-group">
                                    <button type="submit" class="submit-btn">Request Information</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            // Add styles for the modal
            const style = document.createElement('style');
            style.textContent = `
                .tourism-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    overflow-y: auto;
                    padding: 20px;
                }
                
                .tourism-modal-content {
                    background-color: white;
                    border-radius: 10px;
                    max-width: 900px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                    animation: modalFadeIn 0.3s ease-out;
                }
                
                .tourism-tabs {
                    display: flex;
                    overflow-x: auto;
                    border-bottom: 1px solid #eee;
                    background: #f8f9fa;
                    position: sticky;
                    top: 0;
                    z-index: 5;
                }
                
                .tab-btn {
                    padding: 15px 25px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    color: #555;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                }
                
                .tab-btn:hover {
                    color: #3498db;
                    background-color: #f0f0f0;
                }
                
                .tab-btn.active {
                    color: #3498db;
                    border-bottom: 3px solid #3498db;
                }
                
                .tab-content {
                    display: none;
                    padding: 30px;
                }
                
                .tab-content.active {
                    display: block;
                    animation: fadeIn 0.5s ease-out;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .tourism-features {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 20px;
                    margin-top: 30px;
                }
                
                .feature-item {
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 10px;
                    text-align: center;
                    transition: all 0.3s ease;
                }
                
                .feature-item:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                }
                
                .feature-item i {
                    font-size: 2.5rem;
                    color: #3498db;
                    margin-bottom: 15px;
                }
                
                .treatments-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 25px;
                }
                
                .treatment-card {
                    background: white;
                    border-radius: 10px;
                    padding: 25px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease;
                }
                
                .treatment-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                }
                
                .treatment-icon {
                    width: 60px;
                    height: 60px;
                    background: #e1f0fa;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 15px;
                }
                
                .treatment-icon i {
                    font-size: 1.8rem;
                    color: #3498db;
                }
                
                .treatment-card h4 {
                    margin: 10px 0;
                    color: #333;
                }
                
                .treatment-card ul {
                    padding-left: 20px;
                    margin-top: 10px;
                }
                
                .treatment-card li {
                    margin-bottom: 5px;
                    color: #555;
                }
                
                .packages-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 25px;
                    margin-top: 20px;
                }
                
                .package-card {
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease;
                    position: relative;
                }
                
                .package-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
                }
                
                .package-card.premium {
                    border: 2px solid #3498db;
                }
                
                .package-badge {
                    position: absolute;
                    top: 0;
                    right: 0;
                    background: #3498db;
                    color: white;
                    padding: 5px 10px;
                    font-size: 0.8rem;
                    border-bottom-left-radius: 10px;
                }
                
                .package-header {
                    padding: 20px;
                    background: #f8f9fa;
                    border-bottom: 1px solid #eee;
                    text-align: center;
                }
                
                .package-header h4 {
                    margin: 0;
                    color: #333;
                    font-size: 1.2rem;
                }
                
                .package-price {
                    color: #3498db;
                    font-weight: 700;
                    font-size: 1.3rem;
                    margin-top: 5px;
                }
                
                .package-body {
                    padding: 20px;
                }
                
                .package-body ul {
                    padding: 0;
                    list-style: none;
                    margin-bottom: 20px;
                }
                
                .package-body li {
                    margin-bottom: 10px;
                    color: #555;
                }
                
                .package-body i {
                    color: #3498db;
                    margin-right: 5px;
                }
                
                .package-btn {
                    display: block;
                    width: 100%;
                    padding: 10px;
                    background: #3498db;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background 0.3s ease;
                }
                
                .package-btn:hover {
                    background: #2980b9;
                }
                
                .testimonials-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 25px;
                }
                
                .testimonial-card {
                    background: white;
                    border-radius: 10px;
                    padding: 25px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
                }
                
                .testimonial-text {
                    position: relative;
                    padding-left: 25px;
                    border-left: 3px solid #3498db;
                    margin-bottom: 20px;
                }
                
                .testimonial-text p {
                    color: #555;
                    font-style: italic;
                    line-height: 1.6;
                }
                
                .testimonial-name {
                    font-weight: 700;
                    color: #333;
                }
                
                .testimonial-location {
                    font-size: 0.9rem;
                    color: #777;
                    margin-bottom: 5px;
                }
                
                .testimonial-procedure {
                    font-size: 0.9rem;
                    color: #3498db;
                }
                
                .tourism-cta {
                    margin-top: 40px;
                    padding: 30px;
                    background: #f8f9fa;
                    border-radius: 10px;
                }
                
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                
                @media (max-width: 768px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                    
                    .tourism-tabs {
                        justify-content: flex-start;
                    }
                }
            `;
            
            document.head.appendChild(style);
            document.body.appendChild(modal);
            
            // Tab switching functionality
            const tabBtns = modal.querySelectorAll('.tab-btn');
            const tabContents = modal.querySelectorAll('.tab-content');
            
            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Remove active class from all buttons and contents
                    tabBtns.forEach(b => b.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    
                    // Add active class to current button and its corresponding content
                    btn.classList.add('active');
                    const tabId = btn.getAttribute('data-tab');
                    document.getElementById(tabId).classList.add('active');
                });
            });
            
            // Close modal functionality
            const closeModalBtn = modal.querySelector('.close-modal');
            closeModalBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
                document.head.removeChild(style);
            });
            
            // Close when clicking outside the modal content
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    document.body.removeChild(modal);
                    document.head.removeChild(style);
                }
            });
            
            // Close on escape key
            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape' && document.querySelector('.tourism-modal')) {
                    document.body.removeChild(modal);
                    document.head.removeChild(style);
                    document.removeEventListener('keydown', escHandler);
                }
            });
        });
    }
});

// Medical Tourism Form Handling
document.addEventListener('DOMContentLoaded', () => {
    const handleTourismForm = () => {
        const medicalTourismForm = document.getElementById('medicalTourismForm');
        if (medicalTourismForm) {
            medicalTourismForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const submitBtn = this.querySelector('.submit-btn');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Submitting...';
                
                // Get form data
                const formData = {
                    name: document.getElementById('tourismName').value,
                    email: document.getElementById('tourismEmail').value,
                    phone: document.getElementById('tourismPhone').value,
                    treatmentType: document.getElementById('treatmentType').value,
                    message: document.getElementById('tourismMessage').value,
                    privacy: document.getElementById('tourismPrivacy').checked ? "Agreed" : "Not Agreed"
                };

                // Validate form data
                if (!validateTourismForm(formData)) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Request Information";
                    return;
                }

                // Send to Google Sheets
                const result = await sendToGoogleSheets(formData, 'medical-tourism');
                
                submitBtn.disabled = false;
                submitBtn.textContent = "Request Information";
                
                if (result.success) {
                    showSuccessMessage(medicalTourismForm, "Your medical tourism inquiry has been submitted successfully. Our international care coordinator will contact you within 48 hours to discuss your options.");
                } else {
                    showErrorMessage(medicalTourismForm, "There was an error submitting your request. Please try again or contact us directly.");
                }
            });
        }
    };
    handleTourismForm();
});

// Medical Tourism form validation
function validateTourismForm(formData) {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    
    // Clear previous errors
    clearErrors();

    if (!formData.name.trim()) {
        showError('tourismName', 'Please enter your name');
        isValid = false;
    }

    if (!emailRegex.test(formData.email)) {
        showError('tourismEmail', 'Please enter a valid email address');
        isValid = false;
    }

    if (!phoneRegex.test(formData.phone)) {
        showError('tourismPhone', 'Please enter a valid phone number');
        isValid = false;
    }

    if (!formData.treatmentType) {
        showError('treatmentType', 'Please select a treatment type');
        isValid = false;
    }

    if (!formData.privacy) {
        showError('tourismPrivacy', 'Please agree to our privacy policy');
        isValid = false;
    }

    return isValid;
}

// Form Validation Functions
function validateForm(formData) {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    // Clear previous errors
    clearErrors();

    if (!formData.name.trim()) {
        showError('name', 'Please enter your name');
        isValid = false;
    }

    if (!formData.age || formData.age < 0 || formData.age > 120) {
        showError('age', 'Please enter a valid age between 0 and 120');
        isValid = false;
    }

    if (!emailRegex.test(formData.email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    if (!phoneRegex.test(formData.phone)) {
        showError('phone', 'Please enter a valid phone number');
        isValid = false;
    }

    if (!formData.department) {
        showError('department', 'Please select a department');
        isValid = false;
    }

    if (!formData.urgency) {
        showError('urgency', 'Please select urgency level');
        isValid = false;
    }

    if (!formData.privacy) {
        showError('privacy', 'Please agree to our privacy policy');
        isValid = false;
    }

    // Validate file sizes and types
    const documentFiles = document.getElementById('medicalDocuments').files;
    const imageFiles = document.getElementById('medicalImages').files;
    
    if (documentFiles.length > 0) {
        for (let i = 0; i < documentFiles.length; i++) {
            if (documentFiles[i].size > 5 * 1024 * 1024) { // 5MB limit
                showError('medicalDocuments', 'Each document must be less than 5MB');
                isValid = false;
                break;
            }
        }
    }
    
    if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
            if (imageFiles[i].size > 2 * 1024 * 1024) { // 2MB limit
                showError('medicalImages', 'Each image must be less than 2MB');
                isValid = false;
                break;
            }
        }
    }

    return isValid;
}

function validateContactForm(formData) {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Clear previous errors
    clearErrors();

    if (!formData.name.trim()) {
        showError('contactName', 'Please enter your name');
        isValid = false;
    }

    if (!emailRegex.test(formData.email)) {
        showError('contactEmail', 'Please enter a valid email address');
        isValid = false;
    }

    if (!formData.message.trim()) {
        showError('contactMessage', 'Please enter your message');
        isValid = false;
    }

    return isValid;
}

function validateHomeCareForm(formData) {
    let isValid = true;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    
    // Clear previous errors
    clearErrors();

    if (!formData.name.trim()) {
        showError('homeCareName', 'Please enter your name');
        isValid = false;
    }

    if (!phoneRegex.test(formData.phone)) {
        showError('homeCarePhone', 'Please enter a valid phone number');
        isValid = false;
    }

    if (!formData.address.trim()) {
        showError('homeCareAddress', 'Please enter your delivery address');
        isValid = false;
    }

    if (!formData.serviceType) {
        showError('serviceType', 'Please select a service type');
        isValid = false;
    }

    if (!formData.preferredTime) {
        showError('preferredTime', 'Please select a preferred time');
        isValid = false;
    }

    if (!formData.privacy) {
        showError('homeCarePrivacy', 'Please agree to our privacy policy');
        isValid = false;
    }

    // Validate file sizes if uploaded
    const prescriptionFile = document.getElementById('prescription').files[0];
    const labRequestFile = document.getElementById('labRequest').files[0];

    if (prescriptionFile && prescriptionFile.size > 5 * 1024 * 1024) {
        showError('prescription', 'Prescription file must be less than 5MB');
        isValid = false;
    }

    if (labRequestFile && labRequestFile.size > 5 * 1024 * 1024) {
        showError('labRequest', 'Lab request file must be less than 5MB');
        isValid = false;
    }

    return isValid;
}

// Clear all error messages
function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    
    const errorFields = document.querySelectorAll('.has-error');
    errorFields.forEach(field => field.classList.remove('has-error'));
}

// Show error message function
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('has-error');
    
    let errorDiv = formGroup.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        formGroup.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

// Modal Functionality for Safe Space
document.addEventListener('DOMContentLoaded', () => {
    const openSafeSpaceModal = document.getElementById('openSafeSpaceModal');
    const safeSpaceModal = document.getElementById('safeSpaceModal');
    const closeModalButton = safeSpaceModal?.querySelector('.close-modal');
    const therapyBookingForm = document.getElementById('therapyBookingForm');
    
    if (openSafeSpaceModal && safeSpaceModal) {
        // Open modal function
        const openModal = (e) => {
            e.preventDefault();
            
            // Calculate position based on button location
            const buttonRect = openSafeSpaceModal.getBoundingClientRect();
            const modalContent = safeSpaceModal.querySelector('.modal-content');
            
            // Position the modal
            safeSpaceModal.style.display = 'block';
            
            // Get modal dimensions now that it's visible
            const modalRect = modalContent.getBoundingClientRect();
            
            // Calculate position - place it to the right of the button if there's enough space,
            // otherwise place it below the button
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            let leftPosition, topPosition;
            
            // Check if placing to the right would go off-screen
            if (buttonRect.right + modalRect.width + 20 < viewportWidth) {
                // Position to the right of the button
                leftPosition = buttonRect.right + 10;
                topPosition = buttonRect.top - 10;
            } else if (buttonRect.left - modalRect.width - 20 > 0) {
                // Position to the left of the button if right doesn't fit
                leftPosition = buttonRect.left - modalRect.width - 10;
                topPosition = buttonRect.top - 10;
            } else {
                // Position below the button if neither left nor right fit
                leftPosition = Math.max(10, Math.min(buttonRect.left, viewportWidth - modalRect.width - 10));
                topPosition = buttonRect.bottom + 10;
            }
            
            // Ensure the modal doesn't go off the top of the screen
            if (topPosition < 10) {
                topPosition = 10;
            }
            
            // Ensure reasonable visibility when scrolled down the page
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollAdjustedTop = topPosition + scrollTop;
            
            // Set modal position
            safeSpaceModal.style.position = 'absolute';
            safeSpaceModal.style.top = `${scrollAdjustedTop}px`;
            safeSpaceModal.style.left = `${leftPosition}px`;
            safeSpaceModal.style.transform = 'none';
            safeSpaceModal.style.margin = '0';
            safeSpaceModal.style.maxHeight = `${viewportHeight - 20}px`;
            safeSpaceModal.style.overflowY = 'auto';
            
            // Add pointer (arrow) to the modal
            let arrow = document.getElementById('modal-arrow');
            if (!arrow) {
                arrow = document.createElement('div');
                arrow.id = 'modal-arrow';
                modalContent.prepend(arrow);
                
                // Add arrow styles
                const arrowStyle = document.createElement('style');
                arrowStyle.textContent = `
                    #modal-arrow {
                        position: absolute;
                        width: 20px;
                        height: 20px;
                        background: linear-gradient(45deg, #9c27b0, #673ab7);
                        transform: rotate(45deg);
                        z-index: 1;
                    }
                `;
                document.head.appendChild(arrowStyle);
            }
            
            // Position the arrow based on modal placement
            if (leftPosition > buttonRect.right) {
                // Modal is to the right
                arrow.style.left = '-10px';
                arrow.style.top = '20px';
            } else if (leftPosition + modalRect.width < buttonRect.left) {
                // Modal is to the left
                arrow.style.right = '-10px';
                arrow.style.left = 'auto';
                arrow.style.top = '20px';
            } else {
                // Modal is below
                arrow.style.top = '-10px';
                arrow.style.left = `${buttonRect.left + (buttonRect.width/2) - leftPosition - 10}px`;
            }
            
            // Accessibility
            safeSpaceModal.setAttribute('aria-hidden', 'false');
            
            // Set focus to first form element
            setTimeout(() => {
                const firstInput = safeSpaceModal.querySelector('input, select, textarea');
                if (firstInput) firstInput.focus();
                
                // Set today as the minimum date for the date picker
                const dateInput = document.getElementById('preferredDate');
                if (dateInput) {
                    const today = new Date().toISOString().split('T')[0];
                    dateInput.min = today;
                }
            }, 100);
            
            // Add event listener to reposition modal on window resize
            window.addEventListener('resize', repositionModal);
            // Add event listener to reposition modal on window scroll
            window.addEventListener('scroll', repositionModal);
            
            function repositionModal() {
                if (safeSpaceModal.style.display === 'block') {
                    const updatedButtonRect = openSafeSpaceModal.getBoundingClientRect();
                    const updatedScrollTop = window.scrollY || document.documentElement.scrollTop;
                    
                    // Update position for scroll
                    safeSpaceModal.style.top = `${updatedButtonRect.top + updatedScrollTop + updatedButtonRect.height}px`;
                }
            }
        };
        
        // Close modal function
        const closeModal = () => {
            // Add closing animation
            const modalContent = safeSpaceModal.querySelector('.modal-content');
            modalContent.style.animation = 'modalSlideOut 0.3s ease-out forwards';
            
            setTimeout(() => {
                safeSpaceModal.style.display = 'none';
                modalContent.style.animation = 'modalSlideIn 0.4s ease-out';
                
                safeSpaceModal.setAttribute('aria-hidden', 'true');
                
                // Return focus to the button that opened the modal
                openSafeSpaceModal.focus();
                
                // Remove event listeners for modal repositioning
                window.removeEventListener('resize', repositionModal);
                window.removeEventListener('scroll', repositionModal);
            }, 300);
            
            function repositionModal() {
                // This is just an empty function reference for removal
                // The actual implementation is in the openModal function
            }
        };
        
        // Event Listeners
        openSafeSpaceModal.addEventListener('click', openModal);
        
        if (closeModalButton) {
            closeModalButton.addEventListener('click', closeModal);
        }
        
        // Close when clicking outside the modal content
        document.addEventListener('click', (e) => {
            if (safeSpaceModal.style.display === 'block' && 
                !safeSpaceModal.querySelector('.modal-content').contains(e.target) && 
                e.target !== openSafeSpaceModal) {
                closeModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && safeSpaceModal.style.display === 'block') {
                closeModal();
            }
        });
        
        // Add some animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes modalSlideOut {
                from {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translateY(-10px) scale(0.95);
                }
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            @keyframes pulseButton {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            #openSafeSpaceModal {
                animation: pulseButton 2s infinite;
            }
        `;
        document.head.appendChild(style);
        
        // Handle form submission
        if (therapyBookingForm) {
            therapyBookingForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitBtn = therapyBookingForm.querySelector('.submit-btn');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Submitting...';
                
                // Get form data
                const formData = {
                    fullName: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    preferredDate: document.getElementById('preferredDate').value,
                    preferredTime: document.getElementById('preferredTime').value,
                    sessionType: document.getElementById('sessionType').value,
                    concerns: document.getElementById('concerns').value,
                    privacy: document.getElementById('therapyPrivacy').checked ? "Agreed" : "Not Agreed"
                };
                
                // Validate the form
                const isValid = validateTherapyForm(formData);
                
                if (!isValid) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Book Session";
                    return;
                }
                
                try {
                    // Send to email
                    const emailSubject = "Mental Health Safe Space Session Request";
                    let emailBody = `THERAPY BOOKING REQUEST\n\n`;
                    
                    for (const [key, value] of Object.entries(formData)) {
                        emailBody += `${key}: ${value}\n`;
                    }
                    emailBody += `\nSubmitted on: ${new Date().toLocaleString()}`;
                    
                    // Create mailto link
                    const mailtoLink = `mailto:humphreyabwao@yahoo.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                    
                    // Open email client
                    window.location.href = mailtoLink;
                    
                    // Format date for display
                    const displayDate = new Date(formData.preferredDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    
                    // Prepare WhatsApp message
                    const whatsappNumber = "254796780345"; // WhatsApp phone number
                    const message = encodeURIComponent(
                        `Hello, I'd like to book a therapy session.\n\n` +
                        `Name: ${formData.fullName}\n` +
                        `Email: ${formData.email}\n` +
                        `Phone: ${formData.phone}\n` +
                        `Preferred Date: ${displayDate}\n` +
                        `Preferred Time: ${formData.preferredTime}\n` +
                        `Session Type: ${formData.sessionType}\n` +
                        `Concerns: ${formData.concerns || 'None specified'}`
                    );
                    
                    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;
                    
                    // Show confirmation message inside the modal with WhatsApp button
                    const formContainer = therapyBookingForm.parentElement;
                    const successMsg = document.createElement('div');
                    successMsg.className = 'success-message';
                    successMsg.innerHTML = `
                        <h3>Booking Request Received</h3>
                        <p>Thank you, ${formData.fullName}. Your therapy session request has been submitted for ${displayDate} at ${formData.preferredTime}.</p>
                        <p>To confirm your booking immediately, please click the button below to send your details via WhatsApp:</p>
                        <a href="${whatsappLink}" target="_blank" class="whatsapp-button">
                            <i class="fab fa-whatsapp"></i> Confirm via WhatsApp
                        </a>
                        <p class="small-text">You can also call us directly at +254796780345</p>
                        <button class="submit-btn close-success">Close</button>
                    `;
                    
                    // Hide form and show success
                    therapyBookingForm.style.display = 'none';
                    formContainer.insertBefore(successMsg, formContainer.firstChild);
                    
                    // Add close button functionality
                    const closeSuccessBtn = formContainer.querySelector('.close-success');
                    closeSuccessBtn.addEventListener('click', () => {
                        // Reset and close
                        therapyBookingForm.reset();
                        therapyBookingForm.style.display = 'block';
                        successMsg.remove();
                        closeModal();
                    });
                    
                } catch (error) {
                    console.error('Error submitting form:', error);
                    
                    // Show error message
                    const formContainer = therapyBookingForm.parentElement;
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message-container';
                    errorMsg.innerHTML = `
                        <h3>Error</h3>
                        <p>There was an error submitting your booking. Please try again or contact us directly.</p>
                        <button class="submit-btn close-error">Try Again</button>
                    `;
                    
                    // Hide form and show error
                    therapyBookingForm.style.display = 'none';
                    formContainer.insertBefore(errorMsg, formContainer.firstChild);
                    
                    // Add close button functionality
                    const closeErrorBtn = formContainer.querySelector('.close-error');
                    closeErrorBtn.addEventListener('click', () => {
                        therapyBookingForm.style.display = 'block';
                        errorMsg.remove();
                        submitBtn.disabled = false;
                        submitBtn.textContent = "Book Session";
                    });
                }
            });
        }
    }
});

// Therapy form validation
function validateTherapyForm(formData) {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    
    // Clear previous errors
    clearErrors();
    
    // Validate each field
    if (!formData.fullName.trim()) {
        showError('fullName', 'Please enter your name');
        isValid = false;
    }
    
    if (!emailRegex.test(formData.email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!phoneRegex.test(formData.phone)) {
        showError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    if (!formData.preferredDate) {
        showError('preferredDate', 'Please select a date');
        isValid = false;
    }
    
    if (!formData.preferredTime) {
        showError('preferredTime', 'Please select a time');
        isValid = false;
    }
    
    if (!formData.sessionType) {
        showError('sessionType', 'Please select a session type');
        isValid = false;
    }
    
    if (!formData.privacy) {
        showError('therapyPrivacy', 'Please agree to our privacy policy');
        isValid = false;
    }
    
    return isValid;
}

// Add loading indicator styles
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .loading-indicator {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 1.5rem;
            z-index: 9999;
        }
        
        .loading-indicator i {
            margin-right: 10px;
        }
        
        .error-message-container {
            background-color: #ffeeee;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            animation: fadeIn 0.5s ease-out;
            margin-bottom: 20px;
            border: 1px solid #ffcccc;
        }
        
        .error-message-container h3 {
            color: #e74c3c;
            margin-bottom: 10px;
            font-size: 1.5rem;
        }
        
        .error-message-container p {
            color: #e74c3c;
            margin-bottom: 15px;
            line-height: 1.6;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
});

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        // Create overlay element for darkening background when menu is open
        const menuOverlay = document.createElement('div');
        menuOverlay.className = 'menu-overlay';
        document.body.appendChild(menuOverlay);
        
        // Toggle menu when clicking the hamburger icon
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
            
            // Change icon between hamburger and X
            const icon = mobileMenuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking on overlay
        menuOverlay.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
        
        // Close menu when clicking on navigation links
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
                
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
});

// Payment Option Selection Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Setup payment options for all payment sections
    const allPaymentSections = document.querySelectorAll('.payment-section');
    
    allPaymentSections.forEach(section => {
        const options = section.querySelectorAll('.payment-option');
        const instructionsDiv = section.querySelector('.payment-instructions');
        
        // Set the first option (M-Pesa) as default selected
        if (options.length > 0) {
            options[0].classList.add('selected');
        }
        
        options.forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected class from all options
                options.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                this.classList.add('selected');
                
                // Update instructions based on payment method
                const method = this.getAttribute('data-method');
                let instructionsHtml = '';
                
                switch(method) {
                    case 'mpesa':
                        instructionsHtml = '<p><strong>M-Pesa Instructions:</strong> Send KSh 500 to Till No: 7636095 (Hopewell Health)</p>';
                        break;
                    case 'card':
                        instructionsHtml = '<p><strong>Card Payment Instructions:</strong> Click the Submit button to be redirected to our secure payment gateway.</p>';
                        break;
                    case 'bank':
                        instructionsHtml = '<p><strong>Bank Transfer Instructions:</strong> Transfer KSh 500 to Account: 1234567890, Bank: ABC Bank, Branch: Main.</p>';
                        break;
                }
                
                instructionsDiv.innerHTML = instructionsHtml;
            });
        });
    });
    
    // Form validation for payment references
    function validatePaymentReference(formData) {
        // Get all payment references
        const referenceFields = [
            document.getElementById('paymentReference'),
            document.getElementById('homeCarePaymentReference'),
            document.getElementById('tourismPaymentReference'),
            document.getElementById('therapyPaymentReference')
        ].filter(field => field !== null);
        
        let isValid = true;
        
        referenceFields.forEach(field => {
            if (field && field.value.trim() === '') {
                showError(field.id, 'Please enter a valid payment reference number');
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Extend existing form validation functions to include payment validation
    const originalValidateForm = window.validateForm;
    if (typeof originalValidateForm === 'function') {
        window.validateForm = function(formData) {
            let isValid = originalValidateForm(formData);
            return isValid && validatePaymentReference(formData);
        }
    }
    
    const originalValidateContactForm = window.validateContactForm;
    if (typeof originalValidateContactForm === 'function') {
        window.validateContactForm = function(formData) {
            let isValid = originalValidateContactForm(formData);
            return isValid && validatePaymentReference(formData);
        }
    }
    
    const originalValidateHomeCareForm = window.validateHomeCareForm;
    if (typeof originalValidateHomeCareForm === 'function') {
        window.validateHomeCareForm = function(formData) {
            let isValid = originalValidateHomeCareForm(formData);
            return isValid && validatePaymentReference(formData);
        }
    }
    
    const originalValidateTherapyForm = window.validateTherapyForm;
    if (typeof originalValidateTherapyForm === 'function') {
        window.validateTherapyForm = function(formData) {
            let isValid = originalValidateTherapyForm(formData);
            return isValid && validatePaymentReference(formData);
        }
    }
    
    const originalValidateTourismForm = window.validateTourismForm;
    if (typeof originalValidateTourismForm === 'function') {
        window.validateTourismForm = function(formData) {
            let isValid = originalValidateTourismForm(formData);
            return isValid && validatePaymentReference(formData);
        }
    }
});

// Update form data collection to include payment information
const originalSendToGoogleSheets = window.sendToGoogleSheets;
if (typeof originalSendToGoogleSheets === 'function') {
    window.sendToGoogleSheets = function(formData, formType) {
        // Add payment information to form data
        let paymentReference = '';
        let paymentMethod = 'M-Pesa'; // Default
        
        switch(formType) {
            case 'consultation':
                paymentReference = document.getElementById('paymentReference')?.value || '';
                const consultPaymentOption = document.querySelector('#consultationForm .payment-option.selected');
                if (consultPaymentOption) {
                    paymentMethod = consultPaymentOption.getAttribute('data-method');
                }
                break;
            case 'homecare':
                paymentReference = document.getElementById('homeCarePaymentReference')?.value || '';
                const homecarePaymentOption = document.querySelector('#homeCareForm .payment-option.selected');
                if (homecarePaymentOption) {
                    paymentMethod = homecarePaymentOption.getAttribute('data-method');
                }
                break;
            case 'medical-tourism':
                paymentReference = document.getElementById('tourismPaymentReference')?.value || '';
                const tourismPaymentOption = document.querySelector('#medicalTourismForm .payment-option.selected');
                if (tourismPaymentOption) {
                    paymentMethod = tourismPaymentOption.getAttribute('data-method');
                }
                break;
            case 'therapy':
                paymentReference = document.getElementById('therapyPaymentReference')?.value || '';
                const therapyPaymentOption = document.querySelector('#therapyBookingForm .payment-option.selected');
                if (therapyPaymentOption) {
                    paymentMethod = therapyPaymentOption.getAttribute('data-method');
                }
                break;
        }
        
        // Add payment info to formData
        formData.paymentMethod = paymentMethod;
        formData.paymentReference = paymentReference;
        formData.paymentAmount = 'KSh 500';
        
        // Call the original function with the updated form data
        return originalSendToGoogleSheets(formData, formType);
    }
}

// Service Buttons Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all service buttons in the services section
    const consultationButtons = document.querySelectorAll('.consultation-btn');
    const tourismButtons = document.querySelectorAll('.tourism-btn');
    
    // Handle consultation buttons
    consultationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get service type from data attribute
            const serviceType = this.getAttribute('data-service');
            
            // Open consultation modal
            const consultationModal = document.getElementById('consultationModal');
            if (consultationModal) {
                // Set the department in the modal based on service type
                const departmentSelect = document.getElementById('departmentModal');
                if (departmentSelect) {
                    // Try to match the service with a department option
                    switch(serviceType) {
                        case 'cardiology':
                            departmentSelect.value = 'cardiology';
                            break;
                        case 'neurology':
                            departmentSelect.value = 'neurology';
                            break;
                        case 'orthopedics':
                            departmentSelect.value = 'orthopedics';
                            break;
                        case 'obgyn':
                            departmentSelect.value = 'obgyn';
                            break;
                        case 'emergency':
                            // Set urgency to emergency for ambulance service
                            const urgencySelect = document.getElementById('urgencyModal');
                            if (urgencySelect) {
                                urgencySelect.value = 'emergency';
                            }
                            departmentSelect.value = 'general';
                            break;
                        default:
                            departmentSelect.value = 'general';
                    }
                }
                
                // Display the modal
                consultationModal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
                
                // Focus the first input field for accessibility
                setTimeout(() => {
                    const firstInput = consultationModal.querySelector('input:not([type="hidden"]), select, textarea');
                    if (firstInput) firstInput.focus();
                }, 100);
            }
        });
    });
    
    // Handle tourism buttons
    tourismButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Open tourism modal
            const tourismModal = document.getElementById('medicalTourismModal');
            if (tourismModal) {
                tourismModal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
                
                // Focus the first input field for accessibility
                setTimeout(() => {
                    const firstInput = tourismModal.querySelector('input:not([type="hidden"]), select, textarea');
                    if (firstInput) firstInput.focus();
                }, 100);
            }
        });
    });
    
    // Close modals when clicking the close buttons
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            // Find the parent modal
            const modal = this.closest('.modal-container');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    });
    
    // Close modals when clicking outside the modal content
    document.querySelectorAll('.modal-container').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-container').forEach(modal => {
                if (modal.style.display === 'flex') {
                    modal.style.display = 'none';
                    document.body.style.overflow = ''; // Restore scrolling
                }
            });
        }
    });
    
    // Also handle the home care button in the home care section
    const requestHomeCareCTA = document.getElementById('requestHomeCareCTA');
    if (requestHomeCareCTA) {
        requestHomeCareCTA.addEventListener('click', function(e) {
            e.preventDefault();
            
            const homeCareModal = document.getElementById('homeCareModal');
            if (homeCareModal) {
                homeCareModal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
                
                // Focus the first input field for accessibility
                setTimeout(() => {
                    const firstInput = homeCareModal.querySelector('input:not([type="hidden"]), select, textarea');
                    if (firstInput) firstInput.focus();
                }, 100);
            }
        });
    }
    
    // Form submission handling for modal forms
    const modalForms = [
        { id: 'consultationModalForm', subject: 'Consultation Request' },
        { id: 'homeCareModalForm', subject: 'Home Care Service Request' },
        { id: 'medicalTourismModalForm', subject: 'Medical Tourism Information Request' }
    ];
    
    modalForms.forEach(modalForm => {
        const form = document.getElementById(modalForm.id);
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data for email body construction
                const formData = new FormData(this);
                let emailBody = `${modalForm.subject}:\n\n`;
                
                // Add form fields to email body
                for (let [name, value] of formData.entries()) {
                    emailBody += `${name}: ${value}\n";
                }
                
                // Update UI to show loading state
                const submitBtn = this.querySelector('.submit-btn');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Submitting...';
                submitBtn.disabled = true;
                
                // Use mailto link to open email client
                const mailtoLink = `mailto:info@hopewellhealth.com?subject=${encodeURIComponent(modalForm.subject)}&body=${encodeURIComponent(emailBody)}`;
                window.location.href = mailtoLink;
                
                // Reset form after delay
                setTimeout(() => {
                    submitBtn.textContent = 'Request Sent!';
                    setTimeout(() => {
                        // Reset form
                        form.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        
                        // Close the modal
                        const modal = form.closest('.modal-container');
                        if (modal) {
                            modal.style.display = 'none';
                            document.body.style.overflow = ''; // Restore scrolling
                        }
                    }, 2000);
                    
                    // Show success message
                    alert('Thank you for your request. An email has been prepared in your default email client. Please review and send it to complete your request.');
                }, 1000);
            });
        }
    });
});