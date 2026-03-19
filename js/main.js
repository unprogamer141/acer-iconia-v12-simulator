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

document.getElementById('statusbar').addEventListener('click', () => {
  openNoti();
});

function openNoti() {
  const panel = document.getElementById('notipanel');
  panel.style.display = 'flex';
}

function closeNoti() {
  const panel = document.getElementById('notipanel');
  panel.style.display = 'none';
}

let calcValue = '';
function calcPress(val) {
  const display = document.getElementById('calc-display');
  if (val === '=') {
    try { calcValue = String(eval(calcValue)); } catch(e) { calcValue = 'Error'; }
  } else if (val === 'C') {
    calcValue = '';
  } else if (val === 'DEL') {
    calcValue = calcValue.slice(0, -1);
  } else {
    calcValue += val;
  }
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

let stopwatchTime = 0;
let stopwatchRunning = false;
let stopwatchInterval = null;

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

function stopwatchStop() {
  stopwatchRunning = false;
  clearInterval(stopwatchInterval);
}

function stopwatchReset() {
  stopwatchStop();
  stopwatchTime = 0;
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
    if (seconds <= 0) {
      clearInterval(timerInterval);
      if (el) el.textContent = 'DONE!';
    }
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

const filesHomeHTML =
  '<div class="file-storage-bar"><div>Internal Storage</div><div>56GB / 256GB used</div></div>' +
  '<div class="file-storage-fill"><div class="file-storage-used"></div></div>' +
  '<div class="files-grid">' +
  '<div class="folder-item" onclick="showFolder(\'Downloads\')">📥<span>Downloads</span></div>' +
  '<div class="folder-item" onclick="showFolder(\'Pictures\')">🖼️<span>Pictures</span></div>' +
  '<div class="folder-item" onclick="showFolder(\'Music\')">🎵<span>Music</span></div>' +
  '<div class="folder-item" onclick="showFolder(\'Videos\')">🎬<span>Videos</span></div>' +
  '<div class="folder-item" onclick="showFolder(\'Documents\')">📄<span>Documents</span></div>' +
  '<div class="folder-item" onclick="showFolder(\'DCIM\')">📷<span>DCIM</span></div>' +
  '</div>';

const browserHTML =
  '<div class="browser-bar">' +
  '<input id="browser-url" type="text" placeholder="Enter URL e.g. google.com" style="flex:1;padding:8px;border-radius:8px;border:none;font-size:14px;background:#0f2027;color:white;"/>' +
  '<button onclick="browserGo()" style="padding:8px 14px;background:#f0a500;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;margin-left:8px;">Go</button>' +
  '</div>' +
  '<iframe id="browser-frame" src="https://www.wikipedia.org" style="width:100%;flex:1;border:none;border-radius:10px;margin-top:10px;height:80%;"></iframe>';

const clockHTML = '<div class="clock-tabs">' +
  '<button class="clock-tab active" onclick="showClockTab(\'stopwatch\')">Stopwatch</button>' +
  '<button class="clock-tab" onclick="showClockTab(\'timer\')">Timer</button>' +
  '</div>' +
  '<div id="tab-stopwatch">' +
  '<div id="stopwatch-display" style="font-size:60px;text-align:center;padding:30px;">00:00</div>' +
  '<div style="display:flex;gap:10px;justify-content:center;">' +
  '<button class="clock-btn green" onclick="stopwatchStart()">Start</button>' +
  '<button class="clock-btn red" onclick="stopwatchStop()">Stop</button>' +
  '<button class="clock-btn" onclick="stopwatchReset()">Reset</button>' +
  '</div></div>' +
  '<div id="tab-timer" style="display:none;">' +
  '<div id="timer-display" style="font-size:60px;text-align:center;padding:30px;">00:00</div>' +
  '<input id="timer-input" type="number" placeholder="Minutes" style="width:100%;padding:12px;border-radius:10px;border:none;font-size:18px;margin-bottom:10px;background:#0f2027;color:white;"/>' +
  '<button class="clock-btn green" onclick="startTimer()">Start Timer</button>' +
  '</div>';

const calcHTML = '<div id="calc-display">0</div><div class="calc-grid">' +
  '<button class="calc-btn red" onclick="calcPress(\'C\')">C</button>' +
  '<button class="calc-btn" onclick="calcPress(\'DEL\')">DEL</button>' +
  '<button class="calc-btn" onclick="calcPress(\'%\')">%</button>' +
  '<button class="calc-btn op" onclick="calcPress(\'/\')">÷</button>' +
  '<button class="calc-btn" onclick="calcPress(\'7\')">7</button>' +
  '<button class="calc-btn" onclick="calcPress(\'8\')">8</button>' +
  '<button class="calc-btn" onclick="calcPress(\'9\')">9</button>' +
  '<button class="calc-btn op" onclick="calcPress(\'*\')">×</button>' +
  '<button class="calc-btn" onclick="calcPress(\'4\')">4</button>' +
  '<button class="calc-btn" onclick="calcPress(\'5\')">5</button>' +
  '<button class="calc-btn" onclick="calcPress(\'6\')">6</button>' +
  '<button class="calc-btn op" onclick="calcPress(\'-\')">−</button>' +
  '<button class="calc-btn" onclick="calcPress(\'1\')">1</button>' +
  '<button class="calc-btn" onclick="calcPress(\'2\')">2</button>' +
  '<button class="calc-btn" onclick="calcPress(\'3\')">3</button>' +
  '<button class="calc-btn op" onclick="calcPress(\'+\')">+</button>' +
  '<button class="calc-btn" onclick="calcPress(\'0\')">0</button>' +
  '<button class="calc-btn" onclick="calcPress(\'.\')">.</button>' +
  '<button class="calc-btn op" style="grid-column:span 2" onclick="calcPress(\'=\')">=</button>' +
  '</div>';

const notesHTML = '<textarea id="note-input" placeholder="Type your note here..." style="width:100%;height:120px;background:#0f2027;color:white;border:1px solid #444;border-radius:10px;padding:10px;font-size:15px;margin-bottom:10px;"></textarea>' +
  '<button onclick="saveNote()" style="width:100%;padding:12px;background:#f0a500;color:white;border:none;border-radius:10px;font-size:16px;cursor:pointer;">Save Note</button>' +
  '<div id="notes-list" style="margin-top:15px;"></div>';

const batteryHTML = '<div style="text-align:center;padding:20px;">' +
  '<div style="font-size:80px;">🔋</div>' +
  '<div style="font-size:50px;margin:10px 0;" id="batt-display">' + Math.round(battery) + '%</div>' +
  '<div style="font-size:16px;opacity:0.6;margin-bottom:20px;" id="batt-status">' + (charging ? 'Charging' : 'Discharging') + '</div>' +
  '<button onclick="charging=true;document.getElementById(\'batt-status\').textContent=\'Charging\'" style="padding:12px 25px;background:#27ae60;color:white;border:none;border-radius:10px;font-size:16px;cursor:pointer;margin:5px;">🔌 Plug In</button>' +
  '<button onclick="charging=false;document.getElementById(\'batt-status\').textContent=\'Discharging\'" style="padding:12px 25px;background:#e74c3c;color:white;border:none;border-radius:10px;font-size:16px;cursor:pointer;margin:5px;">🔋 Unplug</button>' +
  '</div>';

function openApp(appName) {
  const appScreen = document.getElementById('appscreen');
  const appTitle = document.getElementById('appscreen-title');
  const appContent = document.getElementById('appscreen-content');

  closeNoti();

  if (appName === 'Home') { appScreen.style.display = 'none'; return; }
  if (appName === 'Back') { appScreen.style.display = 'none'; return; }

  const apps = {
    'Settings': '<div class="setting-item">📶 WiFi <span>Connected</span></div><div class="setting-item">🔵 Bluetooth <span>On</span></div><div class="setting-item">🔆 Brightness <span>80%</span></div><div class="setting-item">🔊 Volume <span>60%</span></div><div class="setting-item">🌐 Mobile Data <span>On</span></div><div class="setting-item">📍 Location <span>On</span></div><div class="setting-item">🔋 Battery <span>' + Math.round(battery) + '%</span></div><div class="setting-item">💾 Storage <span>256GB</span></div><div class="setting-item">📱 About Device <span>Acer Iconia V12</span></div>',
    'Camera': '<div class="app-placeholder">📷 Camera<br><br>8MP Rear | 5MP Front</div>',
    'Gallery': '<div class="app-placeholder">🖼️ No Photos Yet</div>',
    'Files': '<div id="files-content">' + filesHomeHTML + '</div>',
    'Browser': browserHTML,
    'Calculator': calcHTML,
    'Clock': clockHTML,
    'Music': '<div class="app-placeholder">🎵 Music Player<br><br>No Music Found</div>',
    'Notes': notesHTML,
    'Maps': '<div class="app-placeholder">🗺️ Maps<br><br>Location Services On</div>',
    'Battery': batteryHTML,
  };

  if (apps[appName]) {
    appTitle.textContent = appName;
    appContent.innerHTML = apps[appName];
    appScreen.style.display = 'flex';
    if (appName === 'Notes') loadNotes();
    if (appName === 'Browser') {
      appContent.style.display = 'flex';
      appContent.style.flexDirection = 'column';
    }
  }
}
