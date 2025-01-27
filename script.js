// script.js

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  
    // Load saved states from local storage
    checkboxes.forEach((checkbox) => {
      const savedState = localStorage.getItem(checkbox.name);
      if (savedState === "checked") {
        checkbox.checked = true;
      }
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          localStorage.setItem(checkbox.name, "checked");
        } else {
          localStorage.removeItem(checkbox.name);
        }
      });
    });
  });
  
