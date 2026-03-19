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

function openApp(appName) {
  const appScreen = document.getElementById('appscreen');
  const appTitle = document.getElementById('appscreen-title');
  const appContent = document.getElementById('appscreen-content');

  if (appName === 'Home') { appScreen.style.display = 'none'; return; }
  if (appName === 'Back') { appScreen.style.display = 'none'; return; }

  const apps = {
    'Settings': '<div class="setting-item">📶 WiFi <span>Connected</span></div><div class="setting-item">🔵 Bluetooth <span>On</span></div><div class="setting-item">🔆 Brightness <span>80%</span></div><div class="setting-item">🔊 Volume <span>60%</span></div><div class="setting-item">🌐 Mobile Data <span>On</span></div><div class="setting-item">📍 Location <span>On</span></div><div class="setting-item">🔋 Battery <span>100%</span></div><div class="setting-item">💾 Storage <span>256GB</span></div><div class="setting-item">📱 About Device <span>Acer Iconia V12</span></div>',
    'Camera': '<div class="app-placeholder">📷 Camera<br><br>8MP Rear | 5MP Front</div>',
    'Gallery': '<div class="app-placeholder">🖼️ No Photos Yet</div>',
    'Files': '<div class="app-placeholder">📁 Internal Storage<br><br>256GB Total | 200GB Free</div>',
    'Browser': '<div class="app-placeholder">🌐 Browser<br><br>Enter a URL to browse</div>',
    'Calculator': calcHTML,
    'Clock': '<div class="app-placeholder">🕐 Clock<br><br>Alarm | Timer | Stopwatch</div>',
    'Music': '<div class="app-placeholder">🎵 Music Player<br><br>No Music Found</div>',
    'Notes': notesHTML,
    'Maps': '<div class="app-placeholder">🗺️ Maps<br><br>Location Services On</div>',
  };

  if (apps[appName]) {
    appTitle.textContent = appName;
    appContent.innerHTML = apps[appName];
    appScreen.style.display = 'flex';
    if (appName === 'Notes') loadNotes();
  }
}
