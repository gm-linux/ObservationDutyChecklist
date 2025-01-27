document.addEventListener("DOMContentLoaded", () => {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  // On load, set checkbox states from localStorage
  checkboxes.forEach((checkbox) => {
    const savedState = localStorage.getItem(checkbox.name);
    checkbox.checked = savedState === "checked";

    // Listen for changes and update localStorage
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        localStorage.setItem(checkbox.name, "checked");
      } else {
        localStorage.removeItem(checkbox.name);
      }
    });
  });
});
