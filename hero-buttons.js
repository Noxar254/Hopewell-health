/**
 * Hero Section Button Functionality
 * Properly links the hero section buttons to their respective sections/modals
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get the hero section buttons
    const consultationBtn = document.querySelector('.hero-buttons .consultation-btn');
    const mentalHealthBtn = document.querySelector('.hero-buttons .secondary');
    const safeSpaceBtn = document.getElementById('openSafeSpaceModal');
    
    // Get the modals
    const consultationModal = document.getElementById('consultationModal');
    const safeSpaceModal = document.getElementById('safeSpaceModal');
    
    // 1. Consultation Button - Open consultation modal
    if (consultationBtn && consultationModal) {
        consultationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the service type
            const serviceType = this.getAttribute('data-service');
            
            // Display the modal
            consultationModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            // Pre-select department if specified in the data-service attribute
            const departmentSelect = document.getElementById('departmentModal');
            if (departmentSelect && serviceType) {
                const options = Array.from(departmentSelect.options);
                const option = options.find(opt => opt.value === serviceType);
                if (option) {
                    departmentSelect.value = serviceType;
                }
            }
            
            // Focus first form element for accessibility
            const firstInput = consultationModal.querySelector('input, select, textarea');
            if (firstInput) firstInput.focus();
        });
    }
    
    // 2. Mental Health Support Button - Smooth scroll to mental health section
    if (mentalHealthBtn) {
        mentalHealthBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const mentalHealthSection = document.getElementById('mental-health');
            if (mentalHealthSection) {
                mentalHealthSection.scrollIntoView({behavior: 'smooth'});
            }
        });
    }
    
    // 3. Safe Space Button - Already has functionality in the custom script, but ensure it works
    if (safeSpaceBtn && safeSpaceModal) {
        // The functionality is already defined in the custom script
        // This is just a backup in case the other event listener doesn't work
        safeSpaceBtn.addEventListener('click', function(e) {
            e.preventDefault();
            safeSpaceModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            safeSpaceModal.setAttribute('aria-hidden', 'false');
            
            // Set minimum date for date picker to today
            const dateInput = document.getElementById('preferredDate');
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.min = today;
            }
            
            // Focus first form element for accessibility
            const firstInput = safeSpaceModal.querySelector('input, select, textarea');
            if (firstInput) firstInput.focus();
        });
    }
    
    // Helper function to close modals
    function closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Re-enable scrolling
            modal.setAttribute('aria-hidden', 'true');
        }
    }
    
    // Add close functionality to all modal close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal-container');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside content
    const modals = document.querySelectorAll('.modal-container');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
});