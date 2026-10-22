document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-link');
  const loadingOverlay = document.querySelector('.loading-overlay');
  const offlineOverlay = document.getElementById('offlineOverlay');
  const closeOffline = document.getElementById('closeOffline');
  const retryButton = document.querySelector('.retry-button');
  const onlineToast = document.getElementById('onlineToast');
  const netStatus = document.getElementById('netStatus');
  const fabMenu = document.getElementById('fabMenu');
  const homeBtn = document.getElementById('homeBtn');

  // Sounds
  const soundOnline = document.getElementById('soundOnline');
  const soundOffline = document.getElementById('soundOffline');

  // FAB toggle
  homeBtn.addEventListener('click', () => {
    if (fabMenu.classList.contains('show')) {
      window.location.href = "../index.html";
    } else {
      fabMenu.classList.toggle('show');
    }
  });

  // Close offline overlay
  closeOffline.addEventListener('click', () => {
    offlineOverlay.classList.remove('active');
  });

  // NEW FEATURE: Click outside popup to close
offlineOverlay.addEventListener('click', (e) => {
  if (e.target === offlineOverlay) {
    offlineOverlay.classList.remove('active');
  }
});

  retryButton.addEventListener('click', checkConnection);

  // Online / Offline events
  window.addEventListener('online', () => {
    hideOfflineMessage();
    showOnlineToast();
    updateNetStatus(true);
    soundOnline.play();
  });

  window.addEventListener('offline', () => {
    showOfflineMessage();
    updateNetStatus(false);
    soundOffline.play();
  });

  function showOnlineToast() {
    onlineToast.classList.add('show');
    setTimeout(() => {
      onlineToast.classList.remove('show');
    }, 2000);
  }

  function showOfflineMessage() {
    offlineOverlay.classList.add('active');
  }

  function hideOfflineMessage() {
    offlineOverlay.classList.remove('active');
  }

  function updateNetStatus(isOnline) {
    if (isOnline) {
      netStatus.innerHTML = '<i class="fas fa-wifi"></i>';
      netStatus.classList.remove('offline');
    } else {
      netStatus.innerHTML = '<i class="fas fa-wifi-slash"></i>';
      netStatus.classList.add('offline');
    }
  }

  function checkConnection() {
    if (navigator.onLine) {
      hideOfflineMessage();
      updateNetStatus(true);
    } else {
      showOfflineMessage();
      updateNetStatus(false);
    }
  }

  checkConnection();
});
