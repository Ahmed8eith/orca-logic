//pricing section click effect 

const trialBtnToggle = () => {
    const buttons = document.querySelectorAll('.trial-btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        // First, reset all pricing boxes to the default border.
        const pricingBoxes = document.querySelectorAll('.pricing-box');
        pricingBoxes.forEach(box => {
          box.style.border = '1px solid rgba(217, 217, 217, 0.1)';
        });
        
        // Then, set the active border on the clicked pricing box.
        const pricingBox = button.closest('.pricing-box');
        if (pricingBox) {
          pricingBox.style.border = '1px solid rgba(118, 161, 178, 1)';
        }
      });
    });
  };
  
  // Call the function after the DOM has loaded
  document.addEventListener('DOMContentLoaded', trialBtnToggle);
  
  
  //burger menu

  document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const slidingMenu = document.querySelector('.sliding-menu');
    
    // Show the sliding menu when the menu button is clicked
    menuBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevents the click from bubbling up
      slidingMenu.classList.add('active');
    });
    
    // Hide the sliding menu when clicking anywhere outside of it
    document.addEventListener('click', function(e) {
      // If the click target is not inside the sliding menu or the menu button, hide the menu.
      if (!slidingMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        slidingMenu.classList.remove('active');
      }
    });
  });
  