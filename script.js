document.addEventListener('DOMContentLoaded', () => {
  const mapSelect = document.getElementById('mapSelect');
  const maps = document.querySelectorAll('.map');
  const roomSelects = document.querySelectorAll('select[id$="RoomSelect"]');
  const clearAllSpa = document.getElementById('clearAllSpa');
  const clearAllapartment = document.getElementById('clearAllapartment');
  const clearAlllogCabin = document.getElementById('clearAlllogCabin');
  const clearAllGasStation = document.getElementById('clearAllGasStation');
  const clearAllMuseum = document.getElementById('clearAllMuseum');
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;
  const backToTopBtn = document.getElementById('backToTopBtn');
  const loadingSpinner = document.getElementById('loadingSpinner');

  // Hide all maps initially
  maps.forEach(map => map.style.display = 'none');

  // Map selection logic
  mapSelect.addEventListener('change', () => {
    loadingSpinner.style.display = 'block';
    setTimeout(() => {
      maps.forEach(map => {
        map.style.display = 'none';
        map.classList.remove('show');
      });
      const selectedMap = document.getElementById(mapSelect.value);
      if (selectedMap) {
        selectedMap.style.display = 'block';
        setTimeout(() => selectedMap.classList.add('show'), 10);
      }
      loadingSpinner.style.display = 'none';
    }, 500);
  });

  // Room selection logic
  roomSelects.forEach(select => {
    select.addEventListener('change', () => {
      const mapSection = select.closest('.map');
      const rooms = mapSection.querySelectorAll('.room');
      rooms.forEach(room => {
        room.style.display = 'none';
        room.classList.remove('show');
      });
      if (select.value) {
        const selectedRoom = document.getElementById(select.value);
        if (selectedRoom) {
          selectedRoom.style.display = 'block';
          setTimeout(() => selectedRoom.classList.add('show'), 10);
        }
      }
    });
  });

  // Clear all checkboxes for each map
  function clearAllCheckboxes(mapId) {
    const checkboxes = document.querySelectorAll(`#${mapId} input[type="checkbox"]`);
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
      checkbox.parentNode.style.color = '';
      checkbox.parentNode.style.fontWeight = '';
    });
  }
  if (clearAllSpa) clearAllSpa.addEventListener('click', () => clearAllCheckboxes('spaMap'));
  if (clearAllapartment) clearAllapartment.addEventListener('click', () => clearAllCheckboxes('apartmentMap'));
  if (clearAlllogCabin) clearAlllogCabin.addEventListener('click', () => clearAllCheckboxes('logCabinMap'));
  if (clearAllGasStation) clearAllGasStation.addEventListener('click', () => clearAllCheckboxes('gasStation'));
  if (clearAllMuseum) clearAllMuseum.addEventListener('click', () => clearAllCheckboxes('museum'));

  // Checkbox click/label highlight logic
  checkboxes.forEach(checkbox => {
    const listItem = checkbox.parentNode;
    listItem.style.cursor = 'pointer';
    listItem.addEventListener('click', (event) => {
      if (event.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }
      if (checkbox.checked) {
        listItem.style.color = 'red';
        listItem.style.fontWeight = 'bold';
      } else {
        listItem.style.color = '';
        listItem.style.fontWeight = '';
      }
    });
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        listItem.style.color = 'red';
        listItem.style.fontWeight = 'bold';
      } else {
        listItem.style.color = '';
        listItem.style.fontWeight = '';
      }
    }); 
  });

  // Dark mode preference
  if (localStorage.getItem('dark-mode') === 'enabled') {
    body.classList.add('dark-mode');
  }
  darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('dark-mode', 'enabled');
    } else {
      localStorage.setItem('dark-mode', 'disabled');
    }
  });

  // Search logic for all rooms in a map
  const searchInputs = document.querySelectorAll('.search-input');
  searchInputs.forEach(input => {
    input.addEventListener('input', () => {
      let mapId;
      if (input.id === 'museumSearch') {
        mapId = 'museum';
      } else if (input.id === 'gasStationSearch') {
        mapId = 'gasStation';
      } else {
        mapId = input.id.replace('Search', 'Map');
      }
      const searchTerm = input.value.toLowerCase();
      const rooms = document.querySelectorAll(`#${mapId} .room`);
      if (searchTerm.length > 0) {
        rooms.forEach(room => {
          room.style.display = 'block';
          room.classList.add('show');
          const anomalies = room.querySelectorAll('ul li');
          anomalies.forEach(anomaly => {
            const text = anomaly.textContent.toLowerCase();
            anomaly.style.display = text.includes(searchTerm) ? '' : 'none';
          });
        });
      } else {
        rooms.forEach(room => {
          room.classList.remove('show');
          room.style.display = 'none';
          const anomalies = room.querySelectorAll('ul li');
          anomalies.forEach(anomaly => {
            anomaly.style.display = '';
          });
        });
        // Show the selected room if any
        const roomSelect = document.querySelector(`#${mapId}RoomSelect`);
        if (roomSelect && roomSelect.value) {
          const selectedRoom = document.getElementById(roomSelect.value);
          if (selectedRoom) {
            selectedRoom.style.display = 'block';
            setTimeout(() => selectedRoom.classList.add('show'), 10);
          }
        }
      }
    });
  });

  // Back to top button functionality
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.style.display = 'block';
    } else {
      backToTopBtn.style.display = 'none';
    }
  });
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

function resetRoom(roomId) {
  const checkboxes = document.querySelectorAll(`#${roomId} input[type="checkbox"]`);
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
    checkbox.parentNode.style.color = '';
    checkbox.parentNode.style.fontWeight = '';
  });
}