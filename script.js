document.addEventListener("DOMContentLoaded", () => {
  // 1) Show/hide rooms via dropdown
  const roomSelect = document.getElementById("roomSelect");
  const rooms = document.querySelectorAll(".room");

  // When the user changes the dropdown:
  roomSelect.addEventListener("change", function () {
    const selectedRoom = this.value; // e.g. "lobby", "dressing", etc.

    // Hide all rooms
    rooms.forEach((room) => {
      room.style.display = "none";
    });

    // Show the selected room (if any)
    if (selectedRoom) {
      document.getElementById(selectedRoom).style.display = "block";
    }
  });

  // 2) Local Storage for checkboxes
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  // On load, restore checkbox states
  checkboxes.forEach((checkbox) => {
    const savedState = localStorage.getItem(checkbox.name);
    if (savedState === "checked") {
      checkbox.checked = true;
    }
    // Whenever a box changes, update localStorage
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        localStorage.setItem(checkbox.name, "checked");
      } else {
        localStorage.removeItem(checkbox.name);
      }
    });
  });
});