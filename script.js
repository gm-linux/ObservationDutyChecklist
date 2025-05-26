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
          let hasMatch = false;
          const anomalies = room.querySelectorAll('ul li');
          anomalies.forEach(anomaly => {
            const text = anomaly.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
              anomaly.style.display = '';
              hasMatch = true;
            } else {
              anomaly.style.display = 'none';
            }
          });
          if (hasMatch) {
            room.style.display = 'block';
            room.classList.add('show');
          } else {
            room.style.display = 'none';
            room.classList.remove('show');
          }
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

  // Save and load progress
  function saveProgress() {
    const progress = {};
    document.querySelectorAll('.room').forEach(room => {
      const roomId = room.id;
      progress[roomId] = [];
      room.querySelectorAll('input[type="checkbox"]').forEach((cb, idx) => {
        if (cb.checked) progress[roomId].push(idx);
      });
    });
    localStorage.setItem('anomalyProgress', JSON.stringify(progress));
  }

  function loadProgress() {
    const progress = JSON.parse(localStorage.getItem('anomalyProgress') || '{}');
    document.querySelectorAll('.room').forEach(room => {
      const roomId = room.id;
      const checkedIdxs = progress[roomId] || [];
      room.querySelectorAll('input[type="checkbox"]').forEach((cb, idx) => {
        cb.checked = checkedIdxs.includes(idx);
        cb.parentNode.style.color = cb.checked ? 'red' : '';
        cb.parentNode.style.fontWeight = cb.checked ? 'bold' : '';
      });
    });
  }

  // Save progress on checkbox change
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', saveProgress);
  });

  // Save progress on reset
  window.resetRoom = function(roomId) {
    const checkboxes = document.querySelectorAll(`#${roomId} input[type="checkbox"]`);
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
      checkbox.parentNode.style.color = '';
      checkbox.parentNode.style.fontWeight = '';
    });
    saveProgress();
  };

  // --- Side Notes Panel Logic ---
  const sideNotesPanel = document.getElementById('sideNotesPanel');
  const sideRoomNotes = document.getElementById('sideRoomNotes');
  const sideNotesRoomName = document.getElementById('sideNotesRoomName');

  // Helper to get current visible room id
  function getCurrentRoomId() {
    const visibleRoom = document.querySelector('.room.show');
    return visibleRoom ? visibleRoom.id : null;
  }

  // Load notes for current room
  function loadSideNotes() {
    const notes = JSON.parse(localStorage.getItem('anomalyNotes') || '{}');
    const roomId = getCurrentRoomId();
    if (roomId) {
      sideRoomNotes.value = notes[roomId] || '';
      const roomTitle = document.querySelector('.room.show h2');
      sideNotesRoomName.textContent = roomTitle ? roomTitle.textContent + ' Notes' : 'Room Notes';
      sideRoomNotes.disabled = false;
    } else {
      sideRoomNotes.value = '';
      sideNotesRoomName.textContent = 'Room Notes';
      sideRoomNotes.disabled = true;
    }
  }

  // Save notes for current room
  function saveSideNotes() {
    const notes = JSON.parse(localStorage.getItem('anomalyNotes') || '{}');
    const roomId = getCurrentRoomId();
    if (roomId) {
      notes[roomId] = sideRoomNotes.value;
      localStorage.setItem('anomalyNotes', JSON.stringify(notes));
    }
  }

  // Update notes panel when room changes
  function updateSideNotesOnRoomChange() {
    loadSideNotes();
    sideRoomNotes.removeEventListener('input', saveSideNotes);
    sideRoomNotes.addEventListener('input', saveSideNotes);
  }

  // Listen for room changes (room select, map select, search)
  const observeRoomChange = new MutationObserver(updateSideNotesOnRoomChange);
  document.querySelectorAll('.room').forEach(room => {
    observeRoomChange.observe(room, { attributes: true, attributeFilter: ['class', 'style'] });
  });
  // Also update on map change
  if (mapSelect) mapSelect.addEventListener('change', () => setTimeout(updateSideNotesOnRoomChange, 600));
  // Also update on room select
  roomSelects.forEach(select => select.addEventListener('change', () => setTimeout(updateSideNotesOnRoomChange, 100)));
  // Also update after search
  document.querySelectorAll('.search-input').forEach(input => input.addEventListener('input', () => setTimeout(updateSideNotesOnRoomChange, 100)));

  // Initial load
  updateSideNotesOnRoomChange();

  // Load notes on page load
  // loadNotes();

  // Load progress on page load
  loadProgress();
});

function resetRoom(roomId) {
  const checkboxes = document.querySelectorAll(`#${roomId} input[type="checkbox"]`);
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
    checkbox.parentNode.style.color = '';
    checkbox.parentNode.style.fontWeight = '';
  });
}