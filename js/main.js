window.addEventListener('load', () => {
  setTimeout(() => {
    const boot = document.getElementById('bootscreen');
    const lock = document.getElementById('lockscreen');
    if (boot) {
      boot.style.transition = 'opacity 1s';
      boot.style.opacity = '0';
      setTimeout(() => {
        boot.style.display = 'none';
        if (lock) lock.style.display = 'flex';
      }, 1000);
    }
  }, 3000);
});

let powerHold;
document.getElementById('tablet').addEventListener('touchstart', (e) => {
  if (e.touches.length === 2) { powerHold = setTimeout(() => { openPowerMenu(); }, 1000); }
});
document.getElementById('tablet').addEventListener('touchend', () => { clearTimeout(powerHold); });

function openPowerMenu() { document.getElementById('powermenu').style.display = 'flex'; }
function closePowerMenu() { document.getElementById('powermenu').style.display = 'none'; }

function powerOff() {
  closePowerMenu();
  const screen = document.getElementById('screen');
  screen.style.transition = 'opacity 1s';
  screen.style.opacity = '0';
  setTimeout(() => {
    screen.style.opacity = '1';
    document.getElementById('homescreen').style.display = 'none';
    document.getElementById('lockscreen').style.display = 'none';
    document.getElementById('appscreen').style.display = 'none';
    document.getElementById('bootscreen').style.display = 'none';
    document.getElementById('poweroff-screen').style.display = 'flex';
  }, 1000);
}

function restartDevice() {
  closePowerMenu();
  const screen = document.getElementById('screen');
  screen.style.transition = 'opacity 0.5s';
  screen.style.opacity = '0';
  setTimeout(() => {
    screen.style.opacity = '1';
    document.getElementById('homescreen').style.display = 'none';
    document.getElementById('lockscreen').style.display = 'none';
    document.getElementById('appscreen').style.display = 'none';
    document.getElementById('poweroff-screen').style.display = 'none';
    document.getElementById('bootscreen').style.display = 'flex';
    document.getElementById('bootscreen').style.opacity = '1';
    setTimeout(() => {
      document.getElementById('bootscreen').style.transition = 'opacity 1s';
      document.getElementById('bootscreen').style.opacity = '0';
      setTimeout(() => {
        document.getElementById('bootscreen').style.display = 'none';
        document.getElementById('lockscreen').style.display = 'flex';
      }, 1000);
    }, 3000);
  }, 500);
}

function bootDevice() {
  document.getElementById('poweroff-screen').style.display = 'none';
  document.getElementById('bootscreen').style.display = 'flex';
  document.getElementById('bootscreen').style.opacity = '1';
  setTimeout(() => {
    document.getElementById('bootscreen').style.transition = 'opacity 1s';
    document.getElementById('bootscreen').style.opacity = '0';
    setTimeout(() => {
      document.getElementById('bootscreen').style.display = 'none';
      document.getElementById('lockscreen').style.display = 'flex';
    }, 1000);
  }, 3000);
}

const wallpapers = [
  { name: 'Ocean', gradient: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)' },
  { name: 'Sunset', gradient: 'linear-gradient(135deg, #f093fb, #f5576c, #fda085)' },
  { name: 'Forest', gradient: 'linear-gradient(135deg, #134e5e, #71b280)' },
  { name: 'Night', gradient: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' },
  { name: 'Aurora', gradient: 'linear-gradient(135deg, #00c6ff, #0072ff)' },
  { name: 'Volcano', gradient: 'linear-gradient(135deg, #f12711, #f5af19)' },
  { name: 'Mint', gradient: 'linear-gradient(135deg, #2af598, #009efd)' },
  { name: 'Candy', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
];

function applyWallpaper(gradient) {
  document.getElementById('homescreen').style.background = gradient;
  document.getElementById('lockscreen').style.background = gradient;
  localStorage.setItem('wallpaper', gradient);
  alert('✅ Wallpaper applied!');
}

const wallpaperHTML = '<div style="margin-bottom:15px;font-size:16px;opacity:0.8;">Choose a wallpaper:</div>' +
  '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">' +
  wallpapers.map(w =>
    '<div onclick="applyWallpaper(\'' + w.gradient + '\')" style="height:80px;border-radius:12px;background:' + w.gradient + ';display:flex;align-items:flex-end;padding:8px;cursor:pointer;"><span style="font-size:12px;color:white;text-shadow:0 1px 3px rgba(0,0,0,0.8);">' + w.name + '</span></div>'
  ).join('') + '</div>';

function saveContact() {
  const name = document.getElementById('contact-name').value;
  const phone = document.getElementById('contact-phone').value;
  if (!name.trim() || !phone.trim()) { alert('Please enter name and phone number!'); return; }
  const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  contacts.push({ name, phone });
  localStorage.setItem('contacts', JSON.stringify(contacts));
  document.getElementById('contact-name').value = '';
  document.getElementById('contact-phone').value = '';
  loadContacts();
}

function deleteContact(index) {
  const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  contacts.splice(index, 1);
  localStorage.setItem('contacts', JSON.stringify(contacts));
  loadContacts();
}

function loadContacts() {
  const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  const list = document.getElementById('contacts-list');
  if (!list) return;
  if (contacts.length === 0) {
    list.innerHTML = '<div style="text-align:center;opacity:0.5;padding:20px;">No contacts yet</div>';
    return;
  }
  list.innerHTML = contacts.map((c, i) =>
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:15px 10px;border-bottom:1px solid rgba(255,255,255,0.07);">' +
    '<div><div style="font-size:16px;">👤 ' + c.name + '</div><div style="font-size:13px;opacity:0.5;margin-top:3px;">📞 ' + c.phone + '</div></div>' +
    '<div style="display:flex;gap:10px;">' +
    '<button onclick="alert(\'Calling ' + c.name + '...\')" style="background:#27ae60;border:none;color:white;padding:8px 12px;border-radius:10px;cursor:pointer;">📞</button>' +
    '<button onclick="deleteContact(' + i + ')" style="background:#e74c3c;border:none;color:white;padding:8px 12px;border-radius:10px;cursor:pointer;">🗑️</button>' +
    '</div></div>'
  ).join('');
}

const contactsHTML =
  '<div style="margin-bottom:15px;">' +
  '<input id="contact-name" type="text" placeholder="Full Name" style="width:100%;padding:12px;border-radius:10px;border:none;font-size:15px;background:#0f2027;color:white;margin-bottom:8px;"/>' +
  '<input id="contact-phone" type="tel" placeholder="Phone Number" style="width:100%;padding:12px;border-radius:10px;border:none;font-size:15px;background:#0f2027;color:white;margin-bottom:8px;"/>' +
  '<button onclick="saveContact()" style="width:100%;padding:12px;background:#1a73e8;color:white;border:none;border-radius:10px;font-size:16px;cursor:pointer;">➕ Add Contact</button>' +
  '</div>' +
  '<div id="contacts-list"></div>';

let calendarDate = new Date();

function buildCalendar(date) {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  let html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">' +
    '<button onclick="changeMonth(-1)" style="background:rgba(255,255,255,0.1);border:none;color:white;padding:8px 14px;border-radius:10px;cursor:pointer;font-size:18px;">◀</button>' +
    '<div style="font-size:18px;font-weight:500;">' + months[month] + ' ' + year + '</div>' +
    '<button onclick="changeMonth(1)" style="background:rgba(255,255,255,0.1);border:none;color:white;padding:8px 14px;border-radius:10px;cursor:pointer;font-size:18px;">▶</button>' +
    '</div>';

  html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center;">';
  ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d => {
    html += '<div style="font-size:12px;opacity:0.5;padding:5px;">' + d + '</div>';
  });

  for (let i = 0; i < firstDay; i++) {
    html += '<div></div>';
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    html += '<div onclick="selectDay(' + d + ')" style="padding:8px 4px;border-radius:8px;cursor:pointer;font-size:14px;' +
      (isToday ? 'background:#1a73e8;color:white;font-weight:bold;' : 'background:rgba(255,255,255,0.05);') +
      '">' + d + '</div>';
  }

  html += '</div>';

  const events = JSON.parse(localStorage.getItem('calEvents') || '{}');
  const key = year + '-' + month;
  html += '<div style="margin-top:20px;">';
  html += '<input id="event-input" type="text" placeholder="Add event..." style="width:100%;padding:10px;border-radius:10px;border:none;font-size:14px;background:#0f2027;color:white;margin-bottom:8px;"/>';
  html += '<button onclick="addEvent()" style="width:100%;padding:10px;background:#1a73e8;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">➕ Add Event</button>';
  if (events[key]) {
    html += '<div style="margin-top:10px;">' + events[key].map(e => '<div style="padding:8px;background:rgba(255,255,255,0.08);border-radius:8px;margin-bottom:5px;font-size:13px;">📅 ' + e + '</div>').join('') + '</div>';
  }
  html += '</div>';

  const el = document.getElementById('calendar-content');
  if (el) el.innerHTML = html;
}

function changeMonth(dir) {
  calendarDate.setMonth(calendarDate.getMonth() + dir);
  buildCalendar(calendarDate);
}

function selectDay(day) {
  alert('📅 ' + day + ' ' + calendarDate.toLocaleString('default', { month: 'long' }) + ' ' + calendarDate.getFullYear());
}

function addEvent() {
  const input = document.getElementById('event-input');
  if (!input || !input.value.trim()) return;
  const key = calendarDate.getFullYear() + '-' + calendarDate.getMonth();
  const events = JSON.parse(localStorage.getItem('calEvents') || '{}');
  if (!events[key]) events[key] = [];
  events[key].push(input.value.trim());
  localStorage.setItem('calEvents', JSON.stringify(events));
  input.value = '';
  buildCalendar(calendarDate);
}

const calendarHTML = '<div id="calendar-content"></div>';

let battery = 100;
let charging = false;

function updateBattery() {
  if (!charging) {
    battery -= 0.1;
    if (battery < 0) battery = 0;
  } else {
    battery += 0.5;
    if (battery > 100) battery = 100;
  }
  const battStr = Math.round(battery) + '%';
  const icon = charging ? '🔌' : (battery > 20 ? '🔋' : '🪫');
  const el = document.getElementById('status-icons');
  if (el) el.textContent = 'WiFi | BT | ' + icon + battStr;
}

setInterval(updateBattery, 3000);

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

const savedWallpaper = localStorage.getItem('wallpaper');
if (savedWallpaper) {
  document.getElementById('homescreen').style.background = savedWallpaper;
  document.getElementById('lockscreen').style.background = savedWallpaper;
}

let startY = 0;
document.getElementById('lockscreen').addEventListener('touchstart', (e) => { startY = e.touches[0].clientY; });
document.getElementById('lockscreen').addEventListener('touchend', (e) => {
  const endY = e.changedTouches[0].clientY;
  if (startY - endY > 50) {
    document.getElementById('lockscreen').style.display = 'none';
    document.getElementById('homescreen').style.display = 'flex';
  }
});

document.getElementById('statusbar').addEventListener('click', () => { openNoti(); });
function openNoti() { document.getElementById('notipanel').style.display = 'flex'; }
function closeNoti() { document.getElementById('notipanel').style.display = 'none'; }

let recentApps = [];
function addRecent(appName) {
  recentApps = recentApps.filter(a => a !== appName);
  recentApps.unshift(appName);
  if (recentApps.length > 5) recentApps.pop();
}

function openRecents() {
  const appScreen = document.getElementById('appscreen');
  const appTitle = document.getElementById('appscreen-title');
  const appContent = document.getElementById('appscreen-content');
  appTitle.textContent = 'Recent Apps';
  if (recentApps.length === 0) {
    appContent.innerHTML = '<div class="app-placeholder">No recent apps</div>';
  } else {
    appContent.innerHTML = '<div style="display:flex;flex-direction:column;gap:15px;padding:10px;">' +
      recentApps.map(a => '<div onclick="openApp(\'' + a + '\')" style="background:rgba(255,255,255,0.1);border-radius:15px;padding:20px;font-size:18px;cursor:pointer;display:flex;align-items:center;gap:15px;">' + getAppIcon(a) + ' ' + a + '</div>').join('') +
      '</div>';
  }
  appScreen.style.display = 'flex';
}

function getAppIcon(name) {
  const icons = {
    'Camera': '📷', 'Gallery': '🖼️', 'Settings': '⚙️', 'Files': '📁',
    'Browser': '🌐', 'Calculator': '🧮', 'Clock': '🕐', 'Music': '🎵',
    'Notes': '📝', 'Maps': '🗺️', 'About': '📱', 'Wallpaper': '🎨',
    'Contacts': '👥', 'Calendar': '📅'
  };
  return icons[name] || '📱';
}

let calcValue = '';
function calcPress(val) {
  const display = document.getElementById('calc-display');
  if (val === '=') {
    try { calcValue = String(eval(calcValue)); } catch(e) { calcValue = 'Error'; }
  } else if (val === 'C') { calcValue = '';
  } else if (val === 'DEL') { calcValue = calcValue.slice(0, -1);
  } else { calcValue += val; }
  display.textContent = calcValue || '0';
}

function saveNote() {
  const text = document.getElementById('note-input').value;
  if (!text.trim()) return;
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  notes.push({ text, time: new Date().toLocaleString() });
  localStorage.setItem('notes', JSON.stringify(notes));
  document.getElementById('note-input').value = '';
  loadNotes();
}

function loadNotes() {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  const list = document.getElementById('notes-list');
  if (!list) return;
  list.innerHTML = notes.reverse().map(n =>
    '<div class="note-item"><div class="note-text">' + n.text + '</div><div class="note-time">' + n.time + '</div></div>'
  ).join('');
}

let stopwatchTime = 0, stopwatchRunning = false, stopwatchInterval = null;
function stopwatchStart() {
  if (stopwatchRunning) return;
  stopwatchRunning = true;
  stopwatchInterval = setInterval(() => {
    stopwatchTime++;
    const mins = String(Math.floor(stopwatchTime / 60)).padStart(2, '0');
    const secs = String(stopwatchTime % 60).padStart(2, '0');
    const el = document.getElementById('stopwatch-display');
    if (el) el.textContent = mins + ':' + secs;
  }, 1000);
}
function stopwatchStop() { stopwatchRunning = false; clearInterval(stopwatchInterval); }
function stopwatchReset() {
  stopwatchStop(); stopwatchTime = 0;
  const el = document.getElementById('stopwatch-display');
  if (el) el.textContent = '00:00';
}

let timerInterval = null;
function startTimer() {
  const input = document.getElementById('timer-input').value;
  let seconds = parseInt(input) * 60;
  if (!seconds) return;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds--;
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    const el = document.getElementById('timer-display');
    if (el) el.textContent = mins + ':' + secs;
    if (seconds <= 0) { clearInterval(timerInterval); if (el) el.textContent = 'DONE!'; }
  }, 1000);
}

function showClockTab(tab) {
  document.getElementById('tab-stopwatch').style.display = tab === 'stopwatch' ? 'block' : 'none';
  document.getElementById('tab-timer').style.display = tab === 'timer' ? 'block' : 'none';
}

function browserGo() {
  let url = document.getElementById('browser-url').value;
  if (!url.startsWith('http')) url = 'https://' + url;
  document.getElementById('browser-frame').src = url;
}

function showFolder(name) {
  const folders = {
    'Downloads': ['video1.mp4','photo1.jpg','document.pdf','music1.mp3'],
    'Pictures': ['selfie.jpg','wallpaper.png','screenshot.jpg'],
    'Music': ['song1.mp3','song2.mp3','playlist.m3u'],
    'Videos': ['movie.mp4','clip1.mp4'],
    'Documents': ['notes.txt','report.pdf','spreadsheet.xlsx'],
    'DCIM': ['IMG_001.jpg','IMG_002.jpg','IMG_003.jpg'],
  };
  const files = folders[name] || [];
  const el = document.getElementById('files-content');
  if (!el) return;
  el.innerHTML = '<div class="file-header" onclick="showFilesHome()">◀ ' + name + '</div>' +
    files.map(f => '<div class="file-item">📄 ' + f + '</div>').join('');
}

function showFilesHome() {
  const el = document.getElementById('files-content');
  if (!el) return;
  el.innerHTML = filesHomeHTML;
}

const songs = [
  { title: 'Song One', artist: 'Artist A', duration: '3:24' },
  { title: 'Song Two', artist: 'Artist B', duration: '4:12' },
  { title: 'Song Three', artist: 'Artist C', duration: '2:58' },
  { title: 'Song Four', artist: 'Artist D', duration: '5:01' },
];

let currentSong = 0, musicPlaying = false, musicProgress = 0, musicInterval = null;
function musicPlay() {
  musicPlaying = true;
  document.getElementById('music-play-btn').textContent = '⏸';
  musicInterval = setInterval(() => {
    musicProgress += 1;
    if (musicProgress > 100) { musicProgress = 0; musicNext(); }
    const bar = document.getElementById('music-progress');
    if (bar) bar.value = musicProgress;
  }, 1000);
}
function musicPause() {
  musicPlaying = false;
  clearInterval(musicInterval);
  document.getElementById('music-play-btn').textContent = '▶';
}
function musicToggle() { if (musicPlaying) musicPause(); else musicPlay(); }
function musicNext() {
  currentSong = (currentSong + 1) % songs.length;
  musicProgress = 0; updateMusicUI();
  if (musicPlaying) { clearInterval(musicInterval); musicPlay(); }
}
function musicPrev() {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  musicProgress = 0; updateMusicUI();
  if (musicPlaying) { clearInterval(musicInterval); musicPlay(); }
}
function updateMusicUI() {
  const s = songs[currentSong];
  const title = document.getElementById('music-title');
  const artist = document.getElementById('music-artist');
  const duration = document.getElementById('music-duration');
  if (title) title.textContent = s.title;
  if (artist) artist.textContent = s.artist;
  if (duration) duration.textContent = s.duration;
}

function startCamera() {
  const video = document.getElementById('camera-video');
  if (!video) return;
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => { video.srcObject = stream; video.play(); })
    .catch(() => {
      const placeholder = document.getElementById('camera-placeholder');
      if (placeholder) placeholder.style.display = 'flex';
      if (video) video.style.display = 'none';
    });
}

function takePhoto() {
  const video = document.getElementById('camera-video');
  const canvas = document.getElementById('camera-canvas');
  if (!video || !canvas) return;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  const dataURL = canvas.toDataURL('image/jpeg');
  const photos = JSON.parse(localStorage.getItem('photos') || '[]');
  photos.push({ src: dataURL, time: new Date().toLocaleString() });
  localStorage.setItem('photos', JSON.stringify(photos));
  const flash = document.getElementById('camera-flash');
  if (flash) { flash.style.opacity = '1'; setTimeout(() => { flash.style.opacity = '0'; }, 200); }
  alert('📷 Photo saved to Gallery!');
}

function switchCamera() { alert('🔄 Switching between 8MP rear and 5MP front camera...'); }

function loadGallery() {
  const photos = JSON.parse(localStorage.getItem('photos') || '[]');
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  if (photos.length === 0) {
    grid.innerHTML = '<div class="app-placeholder">🖼️ No Photos Yet<br><br>Take a photo with the Camera app!</div>';
    return;
  }
  grid.innerHTML = photos.reverse().map((p, i) =>
    '<div class="gallery-item"><img src="' + p.src + '" style="width:100%;height:100%;object-fit:cover;border-radius:10px;" onclick="viewPhoto(' + i + ')"/><div class="gallery-time">' + p.time + '</div></div>'
  ).join('');
}

function viewPhoto(index) {
  const photos = JSON.parse(localStorage.getItem('photos') || '[]');
  const photo = photos[index];
  if (!photo) return;
  const viewer = document.getElementById('photo-viewer');
  const img = document.getElementById('photo-viewer-img');
  if (viewer && img) { img.src = photo.src; viewer.style.display = 'flex'; }
}

function closePhotoViewer() {
  const viewer = document.getElementById('photo-viewer');
  if (viewer) viewer.style.display = 'none';
}

function mapSearch() {
  const query = document.getElementById('map-search').value;
  if (!query) return;
  const result = document.getElementById('map-result');
  if (result) result.textContent = '📍 Searching for: ' + query + '...';
  const iframe = document.querySelector('#appscreen-content iframe');
  if (iframe) iframe.src = 'https://www.openstreetmap.org/search?query=' + encodeURIComponent(query);
}

const aboutHTML =
  '<div style="text-align:center;padding:15px 0;margin-bottom:10px;">' +
  '<div style="font-size:50px;font-weight:bold;color:#83b735;letter-spacing:4px;">Acer</div>' +
  '<div style="font-size:18px;margin-top:5px;">Iconia V12</div>' +
  '</div>' +
  '<div class="setting-item">📱 Model <span>Acer Iconia V12</span></div>' +
  '<div class="setting-item">🖥️ Display <span>11.97" IPS 2000x1200 90Hz</span></div>' +
  '<div class="setting-item">⚡ Processor <span>MediaTek Helio G99</span></div>' +
  '<div class="setting-item">🧠 RAM <span>8GB DDR4</span></div>' +
  '<div class="setting-item">💾 Storage <span>256GB UFS</span></div>' +
  '<div class="setting-item">📷 Rear Camera <span>8MP</span></div>' +
  '<div class="setting-item">🤳 Front Camera <span>5MP</span></div>' +
  '<div class="setting-item">🔋 Battery <span>8000mAh</span></div>' +
  '<div class="setting-item">⚡ Charging <span>USB-C Power Delivery 2.0</span></div>' +
  '<div class="setting-item">📶 WiFi <span>WiFi 6 (802.11ax)</span></div>' +
  '<div class="setting-item">🔵 Bluetooth <span>5.2</span></div>' +
  '<div class="setting-item">🎨 Color <span>Mist Green</span></div>' +
  '<div class="setting-item">🤖 Android <span>Android 15</span></div>' +
  '<div class="setting-item">🔊 Audio <span>Dual Stereo Speakers</span></div>' +
  '<div class="setting-item">💻 Build <span>Aluminum Chassis</span></div>';

const settingsHTML =
  '<div class="setting-item">📶 WiFi <span>Connected</span></div>' +
  '<div class="setting-item">🔵 Bluetooth <span>On</span></div>' +
  '<div class="setting-item">🔆 Brightness <span>80%</span></div>' +
  '<div class="setting-item">🔊 Volume <span>60%</span></div>' +
  '<div class="setting-item">🌐 Mobile Data <span>On</span></div>' +
  '<div class="setting-item">📍 Location <span>On</span></div>' +
  '<div class="setting-item">🔋 Battery <span>' + Math.round(battery) + '%</span></div>' +
  '<div class="setting-item">💾 Storage <span>256GB</span></div>' +
  '<div class="setting-item" onclick="openApp(\'Wallpaper\')" style="cursor:pointer;">🎨 Wallpaper <span>Change ›</span></div>' +
  '<div class="setting-item" onclick="openApp(\'About\')" style="cursor:pointer;">📱 About Device <span>Acer Iconia V12 ›</span></div>';

const cameraHTML = '<div style="position:relative;width:100%;height:100%;background:#000;display:flex;flex-direction:column;"><div id="camera-flash" style="position:absolute;top:0;left:0;width:100%;height:100%;background:white;opacity:0;z-index:5;pointer-events:none;transition:opacity 0.1s;"></div><canvas id="camera-canvas" style="display:none;"></canvas><video id="camera-video" autoplay playsinline style="width:100%;flex:1;object-fit:cover;"></video><div id="camera-placeholder" style="display:none;flex:1;justify-content:center;align-items:center;flex-direction:column;color:white;font-size:18px;gap:10px;"><div style="font-size:60px;">📷</div><div>8MP Rear Camera</div><div style="opacity:0.5;font-size:14px;">Camera access not available</div></div><div style="display:flex;justify-content:space-around;align-items:center;padding:15px;background:#111;"><button onclick="switchCamera()" style="background:rgba(255,255,255,0.2);border:none;color:white;padding:10px 15px;border-radius:10px;font-size:16px;cursor:pointer;">🔄</button><button onclick="takePhoto()" style="background:white;border:none;color:black;width:65px;height:65px;border-radius:50%;font-size:24px;cursor:pointer;">📷</button><button style="background:rgba(255,255,255,0.2);border:none;color:white;padding:10px 15px;border-radius:10px;font-size:16px;">8MP</button></div></div>';

const galleryHTML = '<div id="photo-viewer" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:100;justify-content:center;align-items:center;flex-direction:column;"><button onclick="closePhotoViewer()" style="position:absolute;top:15px;right:15px;background:none;border:none;color:white;font-size:28px;cursor:pointer;">✕</button><img id="photo-viewer-img" style="max-width:90%;max-height:80%;border-radius:10px;"/></div><div id="gallery-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;"></div>';

const filesHomeHTML = '<div class="file-storage-bar"><div>Internal Storage</div><div>56GB / 256GB used</div></div><div class="file-storage-fill"><div class="file-storage-used"></div></div><div class="files-grid"><div class="folder-item" onclick="showFolder(\'Downloads\')">📥<span>Downloads</span></div><div class="folder-item" onclick="showFolder(\'Pictures\')">🖼️<span>Pictures</span></div><div class="folder-item" onclick="showFolder(\'Music\')">🎵<span>Music</span></div><div class="folder-item" onclick="showFolder(\'Videos\')">🎬<span>Videos</span></div><div class="folder-item" onclick="showFolder(\'Documents\')">📄<span>Documents</span></div><div class="folder-item" onclick="showFolder(\'DCIM\')">📷<span>DCIM</span></div></div>';

const browserHTML = '<div class="browser-bar"><input id="browser-url" type="text" placeholder="Enter URL e.g. wikipedia.org" style="flex:1;padding:8px;border-radius:8px;border:none;font-size:14px;background:#0f2027;color:white;"/><button onclick="browserGo()" style="padding:8px 14px;background:#f0a500;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;margin-left:8px;">Go</button></div><iframe id="browser-frame" src="https://www.wikipedia.org" style="width:100%;flex:1;border:none;border-radius:10px;margin-top:10px;height:80%;"></iframe>';

const musicHTML = '<div style="text-align:center;padding:20px;"><div style="font-size:80px;margin-bottom:10px;">🎵</div><div id="music-title" style="font-size:22px;font-weight:bold;">Song One</div><div id="music-artist" style="font-size:16px;opacity:0.6;margin:5px 0;">Artist A</div><div id="music-duration" style="font-size:14px;opacity:0.4;margin-bottom:20px;">3:24</div><input id="music-progress" type="range" min="0" max="100" value="0" style="width:100%;accent-color:#f0a500;margin-bottom:20px;"/><div style="display:flex;justify-content:center;gap:20px;"><button onclick="musicPrev()" style="font-size:28px;background:none;border:none;color:white;cursor:pointer;">⏮</button><button id="music-play-btn" onclick="musicToggle()" style="font-size:36px;background:#f0a500;border:none;color:white;cursor:pointer;border-radius:50%;width:60px;height:60px;">▶</button><button onclick="musicNext()" style="font-size:28px;background:none;border:none;color:white;cursor:pointer;">⏭</button></div><div style="margin-top:25px;text-align:left;">' + songs.map((s,i) => '<div onclick="currentSong='+i+';musicProgress=0;updateMusicUI();" style="padding:12px;border-bottom:1px solid rgba(255,255,255,0.1);cursor:pointer;">🎵 ' + s.title + ' - ' + s.artist + '</div>').join('') + '</div></div>';

const mapsHTML = '<div style="padding:10px;"><div style="display:flex;gap:8px;margin-bottom:10px;"><input id="map-search" type="text" placeholder="Search location..." style="flex:1;padding:8px;border-radius:8px;border:none;font-size:14px;background:#0f2027;color:white;"/><button onclick="mapSearch()" style="padding:8px 14px;background:#f0a500;color:white;border:none;border-radius:8px;cursor:pointer;">🔍</button></div></div><iframe src="https://www.openstreetmap.org/export/embed.html?bbox=-0.1276%2C51.5074%2C-0.1276%2C51.5074&layer=mapnik" style="width:100%;height:75%;border:none;border-radius:10px;"></iframe><div id="map-result" style="padding:10px;font-size:13px;opacity:0.7;"></div>';

const clockHTML = '<div class="clock-tabs"><button class="clock-tab active" onclick="showClockTab(\'stopwatch\')">Stopwatch</button><button class="clock-tab" onclick="showClockTab(\'timer\')">Timer</button></div><div id="tab-stopwatch"><div id="stopwatch-display" style="font-size:60px;text-align:center;padding:30px;">00:00</div><div style="display:flex;gap:10px;justify-content:center;"><button class="clock-btn green" onclick="stopwatchStart()">Start</button><button class="clock-btn red" onclick="stopwatchStop()">Stop</button><button class="clock-btn" onclick="stopwatchReset()">Reset</button></div></div><div id="tab-timer" style="display:none;"><div id="timer-display" style="font-size:60px;text-align:center;padding:30px;">00:00</div><input id="timer-input" type="number" placeholder="Minutes" style="width:100%;padding:12px;border-radius:10px;border:none;font-size:18px;margin-bottom:10px;background:#0f2027;color:white;"/><button class="clock-btn green" onclick="startTimer()">Start Timer</button></div>';

const calcHTML = '<div id="calc-display">0</div><div class="calc-grid"><button class="calc-btn red" onclick="calcPress(\'C\')">C</button><button class="calc-btn" onclick="calcPress(\'DEL\')">DEL</button><button class="calc-btn" onclick="calcPress(\'%\')">%</button><button class="calc-btn op" onclick="calcPress(\'/\')">÷</button><button class="calc-btn" onclick="calcPress(\'7\')">7</button><button class="calc-btn" onclick="calcPress(\'8\')">8</button><button class="calc-btn" onclick="calcPress(\'9\')">9</button><button class="calc-btn op" onclick="calcPress(\'*\')">×</button><button class="calc-btn" onclick="calcPress(\'4\')">4</button><button class="calc-btn" onclick="calcPress(\'5\')">5</button><button class="calc-btn" onclick="calcPress(\'6\')">6</button><button class="calc-btn op" onclick="calcPress(\'-\')">−</button><button class="calc-btn" onclick="calcPress(\'1\')">1</button><button class="calc-btn" onclick="calcPress(\'2\')">2</button><button class="calc-btn" onclick="calcPress(\'3\')">3</button><button class="calc-btn op" onclick="calcPress(\'+\')">+</button><button class="calc-btn" onclick="calcPress(\'0\')">0</button><button class="calc-btn" onclick="calcPress(\'.\')">.</button><button class="calc-btn op" style="grid-column:span 2" onclick="calcPress(\'=\')">=</button></div>';

const notesHTML = '<textarea id="note-input" placeholder="Type your note here..." style="width:100%;height:120px;background:#0f2027;color:white;border:1px solid #444;border-radius:10px;padding:10px;font-size:15px;margin-bottom:10px;"></textarea><button onclick="saveNote()" style="width:100%;padding:12px;background:#f0a500;color:white;border:none;border-radius:10px;font-size:16px;cursor:pointer;">Save Note</button><div id="notes-list" style="margin-top:15px;"></div>';

const batteryHTML = '<div style="text-align:center;padding:20px;"><div style="font-size:80px;">🔋</div><div style="font-size:50px;margin:10px 0;">' + Math.round(battery) + '%</div><div style="font-size:16px;opacity:0.6;margin-bottom:20px;" id="batt-status">' + (charging ? 'Charging' : 'Discharging') + '</div><button onclick="charging=true;document.getElementById(\'batt-status\').textContent=\'Charging\'" style="padding:12px 25px;background:#27ae60;color:white;border:none;border-radius:10px;font-size:16px;cursor:pointer;margin:5px;">🔌 Plug In</button><button onclick="charging=false;document.getElementById(\'batt-status\').textContent=\'Discharging\'" style="padding:12px 25px;background:#e74c3c;color:white;border:none;border-radius:10px;font-size:16px;cursor:pointer;margin:5px;">🔋 Unplug</button></div>';

function openApp(appName) {
  const appScreen = document.getElementById('appscreen');
  const appTitle = document.getElementById('appscreen-title');
  const appContent = document.getElementById('appscreen-content');
  closeNoti();
  if (appName === 'Home') { appScreen.style.display = 'none'; return; }
  if (appName === 'Back') { appScreen.style.display = 'none'; return; }
  if (appName === 'Recents') { openRecents(); return; }

  addRecent(appName);

  const apps = {
    'Settings': settingsHTML,
    'About': aboutHTML,
    'Wallpaper': wallpaperHTML,
    'Camera': cameraHTML,
    'Gallery': galleryHTML,
    'Files': '<div id="files-content">' + filesHomeHTML + '</div>',
    'Browser': browserHTML,
    'Calculator': calcHTML,
    'Clock': clockHTML,
    'Music': musicHTML,
    'Notes': notesHTML,
    'Maps': mapsHTML,
    'Battery': batteryHTML,
    'Contacts': contactsHTML,
    'Calendar': calendarHTML,
  };

  if (apps[appName]) {
    appTitle.textContent = appName === 'About' ? 'About Device' : appName;
    appContent.innerHTML = apps[appName];
    appScreen.style.display = 'flex';
    if (appName === 'Notes') loadNotes();
    if (appName === 'Gallery') loadGallery();
    if (appName === 'Contacts') loadContacts();
    if (appName === 'Calendar') buildCalendar(calendarDate);
    if (appName === 'Camera') { appContent.style.padding = '0'; startCamera(); }
    if (appName === 'Browser' || appName === 'Maps') { appContent.style.display = 'flex'; appContent.style.flexDirection = 'column'; }
  }
}
