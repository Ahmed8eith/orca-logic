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
  
  