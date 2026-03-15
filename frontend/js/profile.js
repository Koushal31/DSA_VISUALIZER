// =============================================================
// profile.js  –  User profile, heatmap, progress tracking
// =============================================================

// ------ Badge definitions ------
const BADGE_LIST = [
  { id: 'first_run',  icon: '🚀', name: 'First Run',    desc: 'Ran your first algorithm' },
  { id: 'curious',    icon: '🔍', name: 'Curious',       desc: 'Reached 10 total runs' },
  { id: 'dedicated',  icon: '⚡', name: 'Dedicated',     desc: 'Reached 50 total runs' },
  { id: 'century',    icon: '💯', name: 'Century',       desc: 'Reached 100 total runs' },
  { id: 'explorer',   icon: '🗺️', name: 'Explorer',      desc: 'Tried 3 or more algorithms' },
  { id: 'allsorts',   icon: '🏆', name: 'Sort Master',   desc: 'Used all 5 sorting algorithms' },
  { id: 'streak3',    icon: '🔥', name: '3-Day Streak',  desc: 'Active 3 days in a row' },
  { id: 'streak7',    icon: '💎', name: 'Week Warrior',  desc: 'Active 7 days in a row' },
  { id: 'streak30',   icon: '👑', name: 'Month Master',  desc: 'Active 30 days in a row' },
];

// Floating tooltip div — created once, reused for all heatmap cells
const hmTooltip = document.createElement('div');
hmTooltip.id = 'hm-tooltip';
document.body.appendChild(hmTooltip);

// ------ Entry point ------
async function loadProfile() {
  const user  = getUser();
  const token = getToken();
  const page  = document.getElementById('profile-page');

  // Not logged in — show sign-in prompt
  if (!user || !token) {
    page.innerHTML = `
      <div class="login-prompt">
        <div style="font-size:40px;margin-bottom:16px">🔐</div>
        <h2>Sign in to track your progress</h2>
        <p>Create a free account to see your heatmap, streaks, badges and full history.</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <a href="login.html" class="btn btn-primary btn-lg">Login</a>
          <a href="login.html?tab=signup" class="btn btn-lg">Sign up free</a>
        </div>
      </div>`;
    return;
  }

  // Fetch real data; fall back to demo data if the backend is offline
  try {
    const res  = await fetch('http://localhost:5000/api/progress/profile', {
      headers: { Authorization: 'Bearer ' + token }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    renderProfile(data);
  } catch (_err) {
    renderProfile(buildDemoData(user));
  }
}

// ------ Demo / offline data ------
// Generates a realistic-looking year of activity so the profile page
// always looks complete during a demo, even without a running backend.
function buildDemoData(user) {
  const heatmap = {};
  const now     = new Date();

  // Seed 365 days of activity with a realistic weekday-heavy pattern
  for (let daysAgo = 0; daysAgo < 365; daysAgo++) {
    const d   = new Date(now);
    d.setDate(d.getDate() - daysAgo);

    const dow        = d.getDay(); // 0 = Sunday
    const isWeekday  = dow >= 1 && dow <= 5;
    const threshold  = isWeekday ? 0.45 : 0.68; // less activity on weekends

    if (Math.random() > threshold) {
      const key       = dateKey(d);
      // More runs on recent days (feels like streak is active)
      const maxRuns   = daysAgo < 14 ? 6 : 4;
      heatmap[key]    = Math.floor(Math.random() * maxRuns) + 1;
    }
  }

  // Force the last 6 days to show activity so the streak is visible
  for (let i = 0; i < 6; i++) {
    const d   = new Date(now);
    d.setDate(d.getDate() - i);
    heatmap[dateKey(d)] = Math.floor(Math.random() * 5) + 2;
  }

  // Build the "active days" list for the 30-day calendar
  const activeDays = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    if (heatmap[dateKey(d)]) activeDays.push(i);
  }

  return {
    user: {
      name:       user.name,
      email:      user.email,
      createdAt:  new Date(Date.now() - 90 * 86400000).toISOString(),
      streak:     6,
      lastActive: now.toISOString()
    },
    stats: { totalRuns: 47, algorithmsUsed: 6, algorithmsCompleted: 4 },
    progress: [
      { algorithm: 'Bubble Sort',    runCount: 12, lastRun: new Date(Date.now() - 3600000).toISOString() },
      { algorithm: 'Merge Sort',     runCount: 9,  lastRun: new Date(Date.now() - 86400000).toISOString() },
      { algorithm: 'Quick Sort',     runCount: 8,  lastRun: new Date(Date.now() - 172800000).toISOString() },
      { algorithm: 'Linked List',    runCount: 7,  lastRun: new Date(Date.now() - 259200000).toISOString() },
      { algorithm: 'Stack',          runCount: 6,  lastRun: new Date(Date.now() - 432000000).toISOString() },
      { algorithm: 'Insertion Sort', runCount: 5,  lastRun: new Date(Date.now() - 518400000).toISOString() },
    ],
    recentActivity: [
      { algorithm: 'Bubble Sort',  action: 'Ran', time: new Date(Date.now() - 1800000).toISOString() },
      { algorithm: 'Merge Sort',   action: 'Ran', time: new Date(Date.now() - 86400000).toISOString() },
      { algorithm: 'Quick Sort',   action: 'Ran', time: new Date(Date.now() - 172800000).toISOString() },
      { algorithm: 'Stack',        action: 'Ran', time: new Date(Date.now() - 259200000).toISOString() },
      { algorithm: 'Linked List',  action: 'Ran', time: new Date(Date.now() - 345600000).toISOString() },
    ],
    badges: [
      { id: 'first_run', icon: '🚀', name: 'First Run',   desc: 'Ran your first algorithm' },
      { id: 'curious',   icon: '🔍', name: 'Curious',     desc: 'Reached 10 total runs' },
      { id: 'explorer',  icon: '🗺️', name: 'Explorer',    desc: 'Tried 3 or more algorithms' },
      { id: 'allsorts',  icon: '🏆', name: 'Sort Master', desc: 'Used all 5 sorting algorithms' },
      { id: 'streak3',   icon: '🔥', name: '3-Day Streak',desc: 'Active 3 days in a row' },
    ],
    heatmap,
    activeDays
  };
}

// ------ Render the full profile page ------
function renderProfile(data) {
  const { user, stats, progress, heatmap, badges, recentActivity, activeDays } = data;
  const page = document.getElementById('profile-page');

  // Avatar initials (first letter of each word in name)
  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const since    = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Count days where at least one run happened
  const activeDayCount = Object.keys(heatmap).length;

  page.innerHTML = `
    <!-- ── Profile header ── -->
    <div class="profile-header-card fade-in">
      <div class="profile-avatar">${initials}</div>
      <div class="profile-info">
        <div class="profile-name">${user.name}</div>
        <div class="profile-email">${user.email}</div>
        <div class="profile-since">Member since ${since}</div>
      </div>
      <div class="profile-stat-row">
        <div class="pstat">
          <div class="pstat-num">${stats.totalRuns}</div>
          <div class="pstat-lbl">Total Runs</div>
        </div>
        <div class="pstat">
          <div class="pstat-num">${stats.algorithmsUsed}</div>
          <div class="pstat-lbl">Algos Tried</div>
        </div>
        <div class="pstat">
          <div class="pstat-num">${activeDayCount}</div>
          <div class="pstat-lbl">Active Days</div>
        </div>
        <div class="pstat">
          <div class="pstat-num">${user.streak}</div>
          <div class="pstat-lbl">🔥 Streak</div>
        </div>
      </div>
    </div>

    <!-- ── 1-year heatmap ── -->
    <div class="profile-section" id="progress">
      <div class="section-header">
        <span class="section-title">Activity — Last 12 Months</span>
        <span class="badge badge-green">${activeDayCount} active days</span>
      </div>
      <div class="heatmap-wrap" id="heatmap-wrap"></div>
    </div>

    <!-- ── 30-day calendar ── -->
    <div class="profile-section">
      <div class="section-header">
        <span class="section-title">Last 30 Days</span>
        <span class="badge badge-orange">${user.streak}-day streak 🔥</span>
      </div>
      <div class="cal-grid" id="cal-grid"></div>
    </div>

    <!-- ── Per-algorithm run counts ── -->
    <div class="profile-section">
      <div class="section-header">
        <span class="section-title">Algorithm Runs</span>
        <span class="badge">${progress.length} algorithms</span>
      </div>
      <div class="progress-list" id="progress-list"></div>
    </div>

    <!-- ── Recent activity timeline ── -->
    <div class="profile-section">
      <div class="section-header">
        <span class="section-title">Recent Activity</span>
      </div>
      <div class="timeline" id="timeline"></div>
    </div>

    <!-- ── Badges ── -->
    <div class="profile-section">
      <div class="section-header">
        <span class="section-title">Badges</span>
        <span class="badge badge-blue">${badges.length} / ${BADGE_LIST.length} earned</span>
      </div>
      <div class="badges-grid" id="badges-grid"></div>
    </div>
  `;

  // Populate each section
  drawHeatmap(heatmap);
  drawCalendar(activeDays || activeDaysFromMap(heatmap));
  drawProgressBars(progress);
  drawTimeline(recentActivity || []);
  drawBadges(badges);
}

// =============================================================
// HEATMAP  –  LeetCode / GitHub contribution graph style
// =============================================================
function drawHeatmap(heatmap) {
  const container = document.getElementById('heatmap-wrap');

  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DAY_LABELS  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // ── Step 1: figure out the date range ──
  // "Today" at midnight local time
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  const todayKey = dateKey(todayMidnight);

  // Start = the Sunday that falls exactly 52 weeks before today
  const gridStart = new Date(todayMidnight);
  gridStart.setDate(gridStart.getDate() - 364); // go back 364 days (52 weeks)
  // Rewind to the most recent Sunday on or before that date
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  // ── Step 2: build the grid data ──
  // We walk forward week by week, day by day
  const columns = []; // each column = one week (7 cells)
  const monthLabelMap = {}; // columnIndex -> month name (only when month changes)
  let prevMonth = -1;
  let totalRuns = 0;
  let col = 0;

  const cursor = new Date(gridStart);
  while (cursor <= todayMidnight) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const cellDate  = new Date(cursor);
      cellDate.setDate(cursor.getDate() + d);
      const key       = dateKey(cellDate);
      const isFuture  = cellDate > todayMidnight;
      const isToday   = key === todayKey;
      const runCount  = (!isFuture && heatmap[key]) ? heatmap[key] : 0;
      totalRuns      += runCount;

      week.push({ key, runCount, isFuture, isToday, month: cellDate.getMonth(), day: cellDate.getDate() });
    }
    columns.push(week);

    // Track where each new month starts (for the month label row)
    const firstVisibleDay = week.find(c => !c.isFuture);
    if (firstVisibleDay && firstVisibleDay.month !== prevMonth) {
      monthLabelMap[col] = MONTH_NAMES[firstVisibleDay.month];
      prevMonth = firstVisibleDay.month;
    }

    cursor.setDate(cursor.getDate() + 7);
    col++;
  }

  const totalCols = columns.length;

  // ── Step 3: build HTML ──
  // Cell size + gap (must match CSS: 13px cell, 3px gap = 16px per column)
  const CELL  = 13;
  const GAP   = 3;
  const STEP  = CELL + GAP; // 16px per column / per row

  // Left gutter for day labels
  const LEFT_GUTTER = 32;

  // --- Month label row ---
  let monthRow = '';
  for (let c = 0; c < totalCols; c++) {
    if (monthLabelMap[c]) {
      // Position label at the left edge of this column
      const x = LEFT_GUTTER + c * STEP;
      monthRow += `<span style="position:absolute;left:${x}px;font-size:11px;color:var(--text-3);font-family:var(--mono);white-space:nowrap">${monthLabelMap[c]}</span>`;
    }
  }

  // --- Day-of-week labels (left side) ---
  // Show Mon, Wed, Fri only to keep it clean like LeetCode
  const SHOW_DAYS = [1, 3, 5]; // Monday, Wednesday, Friday
  let dayLabels = '';
  for (let r = 0; r < 7; r++) {
    const label = SHOW_DAYS.includes(r) ? DAY_LABELS[r] : '';
    const y = 20 + r * STEP; // 20px top offset (month row height)
    dayLabels += `<span style="position:absolute;top:${y}px;right:4px;font-size:10px;color:var(--text-3);font-family:var(--mono);line-height:${CELL}px">${label}</span>`;
  }

  // --- Cells ---
  let cells = '';
  columns.forEach((week, c) => {
    week.forEach((cell, r) => {
      const x   = LEFT_GUTTER + c * STEP;
      const y   = 20 + r * STEP;
      let level = 0;
      if (!cell.isFuture && cell.runCount > 0) {
        if      (cell.runCount >= 8) level = 4;
        else if (cell.runCount >= 5) level = 3;
        else if (cell.runCount >= 2) level = 2;
        else                         level = 1;
      }

      const classes = [
        'hm-cell',
        level > 0 ? 'l' + level : '',
        cell.isFuture ? 'future'   : '',
        cell.isToday  ? 'is-today' : ''
      ].filter(Boolean).join(' ');

      // Tooltip text – shown on hover via JS
      const tipText = cell.isFuture
        ? ''
        : cell.runCount === 0
          ? cell.key + ': No activity'
          : cell.key + ': ' + cell.runCount + ' run' + (cell.runCount > 1 ? 's' : '');

      cells += `<div class="${classes}" data-tip="${tipText}" `
             + `style="position:absolute;left:${x}px;top:${y}px;width:${CELL}px;height:${CELL}px"></div>`;
    });
  });

  // Total grid height: 20px month row + 7 rows × 16px step
  const gridHeight = 20 + 7 * STEP;
  const gridWidth  = LEFT_GUTTER + totalCols * STEP;

  container.innerHTML = `
    <div style="position:relative;width:${gridWidth}px;height:${gridHeight}px;margin-bottom:8px">
      <!-- Month labels -->
      <div style="position:absolute;top:0;left:0;right:0;height:20px">${monthRow}</div>
      <!-- Day labels -->
      <div style="position:absolute;top:0;left:0;width:${LEFT_GUTTER}px;height:100%">${dayLabels}</div>
      <!-- Cells -->
      ${cells}
    </div>

    <!-- Legend row -->
    <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text-3);font-family:var(--mono);margin-top:4px">
      Less
      <div style="width:13px;height:13px;border-radius:2px;background:var(--hm-0)"></div>
      <div style="width:13px;height:13px;border-radius:2px;background:var(--hm-1)"></div>
      <div style="width:13px;height:13px;border-radius:2px;background:var(--hm-2)"></div>
      <div style="width:13px;height:13px;border-radius:2px;background:var(--hm-3)"></div>
      <div style="width:13px;height:13px;border-radius:2px;background:var(--hm-4)"></div>
      More
    </div>
    <div style="font-size:12px;color:var(--text-2);margin-top:8px">
      <strong>${totalRuns}</strong> algorithm runs in the last 12 months
    </div>
  `;

  // ── Step 4: wire up tooltip ──
  container.querySelectorAll('.hm-cell[data-tip]').forEach(cell => {
    cell.addEventListener('mouseenter', () => {
      const tip = cell.dataset.tip;
      if (!tip) return;
      hmTooltip.textContent = tip;
      hmTooltip.classList.add('show');
    });
    cell.addEventListener('mousemove', e => {
      // Keep tooltip just above and to the right of the cursor
      hmTooltip.style.left = (e.clientX + 14) + 'px';
      hmTooltip.style.top  = (e.clientY - 36) + 'px';
    });
    cell.addEventListener('mouseleave', () => {
      hmTooltip.classList.remove('show');
    });
  });
}

// =============================================================
// 30-DAY CALENDAR
// =============================================================
function drawCalendar(activeDays) {
  const el         = document.getElementById('cal-grid');
  const todayLocal = new Date();
  todayLocal.setHours(0, 0, 0, 0);
  const activeSet  = new Set(activeDays); // set of "days ago" values (0 = today)
  let html = '';

  // Render oldest day first (i = 29 means 29 days ago)
  for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
    const d = new Date(todayLocal);
    d.setDate(d.getDate() - daysAgo);

    let cls = 'cal-day';
    if (activeSet.has(daysAgo))   cls += ' was-active';
    else if (daysAgo === 0)        cls += ' is-today';

    const fullDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    html += `<div class="${cls}" title="${fullDate}">${d.getDate()}</div>`;
  }
  el.innerHTML = html;
}

// =============================================================
// ALGORITHM PROGRESS BARS
// =============================================================
function drawProgressBars(progress) {
  const el = document.getElementById('progress-list');

  if (!progress.length) {
    el.innerHTML = '<p style="padding:18px;text-align:center;font-size:13px;color:var(--text-3)">No runs yet — open any algorithm page and hit Run!</p>';
    return;
  }

  const maxRuns = Math.max(...progress.map(p => p.runCount), 1);

  el.innerHTML = progress.map(item => {
    const barPct = Math.round((item.runCount / maxRuns) * 100);
    const name   = item.algorithm
      .replace(/-/g, ' ')
      .replace(/\b\w/g, ch => ch.toUpperCase());

    return `
      <div class="progress-item">
        <div style="min-width:150px">
          <div class="progress-name">${name}</div>
          <div class="progress-sub">${item.runCount} run${item.runCount !== 1 ? 's' : ''}</div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${barPct}%"></div>
        </div>
        <div class="progress-date">${friendlyDate(item.lastRun)}</div>
      </div>`;
  }).join('');
}

// =============================================================
// RECENT ACTIVITY TIMELINE
// =============================================================
function drawTimeline(activity) {
  const el = document.getElementById('timeline');

  if (!activity.length) {
    el.innerHTML = '<p style="padding:12px 0;font-size:13px;color:var(--text-3)">Nothing yet — start visualizing!</p>';
    return;
  }

  el.innerHTML = activity.slice(0, 8).map((item, idx) => `
    <div class="tl-item">
      <div class="tl-dot${idx < 2 ? ' recent' : ''}"></div>
      <div style="flex:1">
        <div class="tl-algo">${item.algorithm}</div>
        <div class="tl-action">${item.action || 'Ran'}</div>
      </div>
      <div class="tl-time">${friendlyDate(item.time)}</div>
    </div>`).join('');
}

// =============================================================
// BADGES GRID
// =============================================================
function drawBadges(earned) {
  const el        = document.getElementById('badges-grid');
  const earnedSet = new Set(earned.map(b => b.id));

  el.innerHTML = BADGE_LIST.map(badge => {
    const isEarned = earnedSet.has(badge.id);
    return `
      <div class="badge-card ${isEarned ? 'earned' : 'locked'}">
        <div class="badge-icon">${badge.icon}</div>
        <div class="badge-name">${badge.name}</div>
        <div class="badge-desc">${badge.desc}</div>
        ${!isEarned ? '<div class="badge-locked-text">🔒 locked</div>' : ''}
      </div>`;
  }).join('');
}

// =============================================================
// HELPERS
// =============================================================

// Returns "YYYY-MM-DD" in LOCAL time (avoids UTC offset surprises)
function dateKey(d) {
  const year  = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day   = String(d.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

// Build the activeDays array from heatmap when the backend doesn't supply it
function activeDaysFromMap(heatmap) {
  const todayLocal = new Date();
  todayLocal.setHours(0, 0, 0, 0);
  const result = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(todayLocal);
    d.setDate(d.getDate() - i);
    if (heatmap[dateKey(d)]) result.push(i);
  }
  return result;
}

// Human-readable relative time: "just now", "3m ago", "yesterday", "Mar 5"
function friendlyDate(isoString) {
  const then = new Date(isoString);
  const now  = new Date();
  const diffMs   = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1)   return 'just now';
  if (diffMins < 60)  return diffMins + 'm ago';
  if (diffDays === 0) return Math.floor(diffMins / 60) + 'h ago';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7)   return diffDays + ' days ago';
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Boot
document.addEventListener('DOMContentLoaded', loadProfile);