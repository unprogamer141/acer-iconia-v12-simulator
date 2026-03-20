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
    'Notes': '📝', 'Maps': '🗺️'
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
    'Settings': '<div class="setting-item">📶 WiFi <span>Connected</span></div><div class="setting-item">🔵 Bluetooth <span>On</span></div><div class="setting-item">🔆 Brightness <span>80%</span></div><div class="setting-item">🔊 Volume <span>60%</span></div><div class="setting-item">🌐 Mobile Data <span>On</span></div><div class="setting-item">📍 Location <span>On</span></div><div class="setting-item">🔋 Battery <span>' + Math.round(battery) + '%</span></div><div class="setting-item">💾 Storage <span>256GB</span></div><div class="setting-item">📱 About Device <span>Acer Iconia V12</span></div>',
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
  };

  if (apps[appName]) {
    appTitle.textContent = appName;
    appContent.innerHTML = apps[appName];
    appScreen.style.display = 'flex';
    if (appName === 'Notes') loadNotes();
    if (appName === 'Gallery') loadGallery();
    if (appName === 'Camera') { appContent.style.padding = '0'; startCamera(); }
    if (appName === 'Browser' || appName === 'Maps') { appContent.style.display = 'flex'; appContent.style.flexDirection = 'column'; }
  }
}
