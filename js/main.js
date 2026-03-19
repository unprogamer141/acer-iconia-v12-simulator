// Update clock every second
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const timeStr = hours + ':' + minutes + ' ' + ampm;
  document.getElementById('clock').textContent = timeStr;
  document.getElementById('status-time').textContent = timeStr;

  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('date').textContent = days[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate();
}

setInterval(updateClock, 1000);
updateClock();

// Swipe up to unlock
let startY = 0;
document.getElementById('lockscreen').addEventListener('touchstart', (e) => {
  startY = e.touches[0].clientY;
});

document.getElementById('lockscreen').addEventListener('touchend', (e) => {
  const endY = e.changedTouches[0].clientY;
  if (startY - endY > 50) {
    document.getElementById('lockscreen').style.display = 'none';
    document.getElementById('homescreen').style.display = 'flex';
  }
});

// App launcher
function openApp(appName) {
  const appScreen = document.getElementById('appscreen');
  const appTitle = document.getElementById('appscreen-title');
  const appContent = document.getElementById('appscreen-content');

  const apps = {
    'Settings': `
      <div class="setting-item">📶 WiFi <span>Connected</span></div>
      <div class="setting-item">🔵 Bluetooth <span>On</span></div>
      <div class="setting-item">🔆 Brightness <span>80%</span></div>
      <div class="setting-item">🔊 Volume <span>60%</span></div>
      <div class="setting-item">🌐 Mobile Data <span>On</span></div>
      <div class="setting-item">📍 Location <span>On</span></div>
      <div class="setting-item">🔋 Battery <span>100%</span></div>
      <div class="setting-item">💾 Storage <span>256GB</span></div>
      <div class="setting-item">📱 About Device <span>Acer Iconia V12</span></div>
    `,
    'Camera': `<div class="app-placeholder">📷 Camera Viewfinder<br><br>8MP Rear | 5MP Front</div>`,
    'Gallery': `<div class="app-placeholder">🖼️ No Photos Yet</div>`,
    'Files': `<div class="app-placeholder">📁 Internal Storage<br><br>256GB Total | 200GB Free</div>`,
    'Browser': `<div class="app-placeholder">🌐 Browser<br><br>Enter a URL to browse</div>`,
    'Calculator': `<div class="app-placeholder">🧮 Calculator<br><br>Coming Soon</div>`,
    'Clock': `<div class="app-placeholder">🕐 Clock<br><br>Alarm | Timer | Stopwatch</div>`,
    'Music': `<div class="app-placeholder">🎵 Music Player<br><br>No Music Found</div>`,
    'Notes': `<div class="app-placeholder">📝 Notes<br><br>No Notes Yet</div>`,
    'Maps': `<div class="app-placeholder">🗺️ Maps<br><br>Location Services On</div>`,
  };

  if (appName === 'Home') {
    appScreen.style.display = 'none';
    return;
  }
  if (appName === 'Back') {
    appScreen.style.display = 'none';
    return;
  }

  if (apps[appName]) {
    appTitle.textContent = appName;
    appContent.innerHTML = apps[appName];
    appScreen.style.display = 'flex';
  }
}
