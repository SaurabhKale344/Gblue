// public/utils.js

// --- Hamburger Menu & Mobile Navigation ---
// This code sets up the hamburger menu to toggle the visibility of the floating navbar and mobile contact info.
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const floatingNavbarContainer = document.querySelector('.floating-navbar-container');
    
    // Check if these elements exist on the current page before trying to manipulate them
    if (hamburger && floatingNavbarContainer) {
        const navLinks = floatingNavbarContainer.querySelector('.nav-links');
        const contactInfoMobile = floatingNavbarContainer.querySelector('.contact-info-mobile');

        // Event listener for the hamburger icon click
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            floatingNavbarContainer.classList.toggle('open'); // Toggle a class on the container to show/hide it
            if (navLinks) navLinks.classList.toggle('active');
            if (contactInfoMobile) contactInfoMobile.classList.toggle('active');
        });

        // Close nav when a link is clicked (for mobile usability)
        if (navLinks) {
            navLinks.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', () => {
                    // Remove active classes to close the menu
                    hamburger.classList.remove('active');
                    floatingNavbarContainer.classList.remove('open');
                    if (navLinks) navLinks.classList.remove('active');
                    if (contactInfoMobile) contactInfoMobile.classList.remove('active');
                });
            });
        }
    }

    // --- Accordion Toggle Function for Careers Page ---
    // This function handles the expanding/collapsing of career benefit details.
    // We attach this directly via JavaScript event listeners rather than inline onclick.
    function gblueCareersToggleDetail(clickedHeader) {
        // Find the closest parent 'li' item to the clicked header
        const benefitItem = clickedHeader.closest('.gblue-careers-v1-benefit-item');
        // Find the main container for all accordion items
        const accordionContainer = clickedHeader.closest('.gblue-careers-v1-benefits-accordion');

        if (benefitItem && accordionContainer) {
            // Close any other currently open accordion items
            const allBenefitItems = accordionContainer.querySelectorAll('.gblue-careers-v1-benefit-item');
            allBenefitItems.forEach(item => {
                // If it's not the clicked item and it's active, deactivate it
                if (item !== benefitItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                    // Reset its icon as well
                    const otherIcon = item.querySelector('.gblue-careers-v1-toggle-button i');
                    if (otherIcon) {
                        otherIcon.classList.remove('fa-chevron-up');
                        otherIcon.classList.add('fa-chevron-down');
                    }
                }
            });

            // Toggle the 'active' class on the clicked item to open/close it
            benefitItem.classList.toggle('active');

            // Toggle the chevron icon direction
            const icon = clickedHeader.querySelector('.gblue-careers-v1-toggle-button i');
            if (icon) {
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            }
        }
    }

    // Attach click listeners to all accordion headers on pages where they exist
    const benefitHeaders = document.querySelectorAll('.gblue-careers-v1-benefit-header');
    if (benefitHeaders.length > 0) { // Only run if accordion headers are found
        benefitHeaders.forEach(header => {
            header.addEventListener('click', () => {
                gblueCareersToggleDetail(header);
            });
        });
    }
});