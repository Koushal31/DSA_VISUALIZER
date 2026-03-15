// =============================================================
// sorting.js  –  All 5 sorting algorithms with step animations.
// Each algorithm updates the bar chart + highlights the active
// pseudocode line at every comparison / swap.
// =============================================================

// ------ Algorithm metadata ------
// Stores the pseudocode, complexity info and plain-English explanation
// for each of the 5 algorithms.  The code array uses HTML spans for
// syntax highlighting (keywords in purple, function names in blue).

const ALGOS = {

  bubble: {
    label: 'Bubble Sort',
    best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
    code: [
      '<span class="kw">def</span> <span class="fn">bubble_sort</span>(arr):',
      '  n = len(arr)',
      '  <span class="kw">for</span> i <span class="kw">in</span> range(n):',
      '    <span class="kw">for</span> j <span class="kw">in</span> range(n - i - 1):',
      '      <span class="kw">if</span> arr[j] > arr[j + 1]:',
      '        arr[j], arr[j+1] = arr[j+1], arr[j]  <span class="cm"># swap</span>',
      '  <span class="kw">return</span> arr',
    ],
    explain: {
      summary: 'Bubble Sort walks through the array comparing two neighbouring elements at a time. If they are in the wrong order it swaps them. After each full pass the largest remaining element has settled at its correct position at the end.',
      steps: [
        ['Compare neighbours', 'Look at arr[j] and arr[j+1]. If the left one is bigger, swap them.'],
        ['Finish the pass', 'Continue comparing pairs all the way to the end of the unsorted section.'],
        ['Shrink the range', 'The biggest element is now locked in place. Reduce the unsorted range by one.'],
        ['Repeat', 'Keep doing passes. When a full pass happens with no swaps, the array is sorted.'],
      ]
    }
  },

  selection: {
    label: 'Selection Sort',
    best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
    code: [
      '<span class="kw">def</span> <span class="fn">selection_sort</span>(arr):',
      '  n = len(arr)',
      '  <span class="kw">for</span> i <span class="kw">in</span> range(n):',
      '    min_idx = i',
      '    <span class="kw">for</span> j <span class="kw">in</span> range(i + 1, n):',
      '      <span class="kw">if</span> arr[j] < arr[min_idx]:',
      '        min_idx = j  <span class="cm"># found smaller value</span>',
      '    arr[i], arr[min_idx] = arr[min_idx], arr[i]',
      '  <span class="kw">return</span> arr',
    ],
    explain: {
      summary: 'Selection Sort splits the array into a sorted left section and an unsorted right section. It repeatedly picks the smallest element from the unsorted section and appends it to the sorted section.',
      steps: [
        ['Find the minimum', 'Scan every element in the unsorted section to find the smallest one.'],
        ['Swap it into place', 'Swap that minimum element with the first element of the unsorted section.'],
        ['Grow the sorted side', 'The sorted section is now one element longer; the unsorted section is one shorter.'],
        ['Repeat', 'Keep going until the unsorted section is empty.'],
      ]
    }
  },

  insertion: {
    label: 'Insertion Sort',
    best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
    code: [
      '<span class="kw">def</span> <span class="fn">insertion_sort</span>(arr):',
      '  <span class="kw">for</span> i <span class="kw">in</span> range(1, len(arr)):',
      '    key = arr[i]',
      '    j = i - 1',
      '    <span class="kw">while</span> j >= 0 <span class="kw">and</span> arr[j] > key:',
      '      arr[j + 1] = arr[j]  <span class="cm"># shift right</span>',
      '      j -= 1',
      '    arr[j + 1] = key  <span class="cm"># place the key</span>',
      '  <span class="kw">return</span> arr',
    ],
    explain: {
      summary: 'Insertion Sort builds a sorted array one element at a time. Think of how you sort a hand of playing cards: you pick up each new card and slide it leftward into its correct position among the cards you have already sorted.',
      steps: [
        ['Pick the next element', 'Take arr[i] — we call this the "key". Everything to its left is already sorted.'],
        ['Shift larger elements right', 'Compare the key against elements to its left. Shift each larger element one slot right.'],
        ['Drop the key in', 'Place the key into the gap that was created after all the shifting.'],
        ['Repeat', 'Move on to the next element and do the same until the whole array is sorted.'],
      ]
    }
  },

  merge: {
    label: 'Merge Sort',
    best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)',
    code: [
      '<span class="kw">def</span> <span class="fn">merge_sort</span>(arr):',
      '  <span class="kw">if</span> len(arr) <= 1: <span class="kw">return</span> arr',
      '  mid   = len(arr) // 2',
      '  left  = merge_sort(arr[:mid])',
      '  right = merge_sort(arr[mid:])',
      '  <span class="kw">return</span> merge(left, right)',
      '',
      '<span class="kw">def</span> <span class="fn">merge</span>(L, R):',
      '  result, i, j = [], 0, 0',
      '  <span class="kw">while</span> i < len(L) <span class="kw">and</span> j < len(R):',
      '    <span class="kw">if</span> L[i] <= R[j]: result.append(L[i]); i++',
      '    <span class="kw">else</span>:            result.append(R[j]); j++',
      '  <span class="kw">return</span> result + L[i:] + R[j:]',
    ],
    explain: {
      summary: 'Merge Sort uses the "divide and conquer" idea. It splits the array in half over and over until every piece has just one element, then merges those pieces back together in sorted order. It always runs in O(n log n) — no worst case.',
      steps: [
        ['Divide', 'Cut the array at the midpoint into two halves.'],
        ['Recurse', 'Apply merge sort to each half independently.'],
        ['Merge', 'Combine two sorted halves by repeatedly picking the smaller front element.'],
        ['Done', 'Every merge produces a sorted result. The whole array ends up sorted.'],
      ]
    }
  },

  quick: {
    label: 'Quick Sort',
    best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)',
    code: [
      '<span class="kw">def</span> <span class="fn">quick_sort</span>(arr, lo, hi):',
      '  <span class="kw">if</span> lo < hi:',
      '    pi = partition(arr, lo, hi)',
      '    quick_sort(arr, lo, pi - 1)',
      '    quick_sort(arr, pi + 1, hi)',
      '',
      '<span class="kw">def</span> <span class="fn">partition</span>(arr, lo, hi):',
      '  pivot = arr[hi]  <span class="cm"># use last element as pivot</span>',
      '  i = lo - 1',
      '  <span class="kw">for</span> j <span class="kw">in</span> range(lo, hi):',
      '    <span class="kw">if</span> arr[j] <= pivot:',
      '      i += 1; swap(arr[i], arr[j])',
      '  swap(arr[i + 1], arr[hi])',
      '  <span class="kw">return</span> i + 1',
    ],
    explain: {
      summary: 'Quick Sort picks one element as a "pivot" and rearranges everything so that smaller elements are on the left and larger ones are on the right. The pivot is then in its final sorted position. Both sides are sorted recursively.',
      steps: [
        ['Choose a pivot', 'We use the last element as the pivot.'],
        ['Partition', 'Walk through the array. Elements ≤ pivot go to the left side; elements > pivot stay right.'],
        ['Pivot is settled', 'After partitioning, the pivot is in its correct final position. '],
        ['Recurse', 'Apply the same process to the left sub-array and the right sub-array.'],
      ]
    }
  }
};

// ------ Animation state ------
let currentArray = [];
let isRunning    = false;
let isPaused     = false;
let shouldStop   = false;
let opCount      = 0;

const sleep    = ms => new Promise(resolve => setTimeout(resolve, ms));
const waitIfPaused = async () => {
  while (isPaused && !shouldStop) await sleep(80);
};
const getDelay = () => Math.max(50, 620 - parseInt(document.getElementById('speed').value, 10) * 57);

document.getElementById('speed').addEventListener('input', function() {
  document.getElementById('speed-val').textContent = this.value;
});

// ------ Array helpers ------
function readArray() {
  const raw = document.getElementById('array-input').value;
  const parsed = raw
    .split(',')
    .map(x => parseInt(x.trim(), 10))
    .filter(x => !isNaN(x) && x > 0);
  return parsed.length >= 2 ? parsed : [5, 3, 8, 1, 9, 2, 7, 4, 6];
}

function randomArray() {
  const arr = Array.from({ length: 9 }, () => Math.floor(Math.random() * 20) + 1);
  document.getElementById('array-input').value = arr.join(',');
  currentArray = [...arr];
  drawBars(currentArray);
}

function applyInput() {
  shouldStop = true;
  setTimeout(() => {
    currentArray = readArray();
    drawBars(currentArray);
    setStatus('Ready');
  }, 60);
}

// ------ Bar rendering ------
function drawBars(arr, highlights = {}) {
  const wrapper = document.getElementById('bars');
  const maxVal  = Math.max(...arr, 1);
  wrapper.innerHTML = '';

  arr.forEach((value, index) => {
    const bar    = document.createElement('div');
    const state  = highlights[index] || '';
    bar.className = 'bar' + (state ? ' ' + state : '');
    bar.style.height = (value / maxVal * 152 + 8) + 'px';

    // Only show numbers on smaller arrays — they overlap on large ones
    if (arr.length <= 16) {
      const label = document.createElement('span');
      label.className = 'bar-val';
      label.textContent = value;
      bar.appendChild(label);
    }
    wrapper.appendChild(bar);
  });

  document.getElementById('viz-ops').textContent = opCount + ' ops';
}

function setStatus(msg) {
  document.getElementById('status-line').textContent = msg;
}

// ------ Code panel ------
function showCode(algoKey, highlightLine) {
  const lines = ALGOS[algoKey].code;
  const hl    = (highlightLine === undefined) ? -1 : highlightLine;
  document.getElementById('code-block').innerHTML = lines
    .map((line, i) =>
      '<div class="code-line' + (i === hl ? ' active' : '') + '">'
      + (line || '&nbsp;')
      + '</div>'
    )
    .join('');
}

// ------ Complexity panel ------
function showComplexity(algoKey) {
  const a = ALGOS[algoKey];
  document.getElementById('complexity-grid').innerHTML = `
    <div class="complexity-item">
      <div class="complexity-label">Best Case</div>
      <div class="complexity-value">${a.best}</div>
    </div>
    <div class="complexity-item">
      <div class="complexity-label">Average</div>
      <div class="complexity-value">${a.avg}</div>
    </div>
    <div class="complexity-item">
      <div class="complexity-label">Worst Case</div>
      <div class="complexity-value">${a.worst}</div>
    </div>
    <div class="complexity-item">
      <div class="complexity-label">Space</div>
      <div class="complexity-value">${a.space}</div>
    </div>`;
}

// ------ How it works panel ------
function showExplanation(algoKey) {
  const ex  = ALGOS[algoKey].explain;
  const hdr = document.getElementById('how-title');
  if (hdr) hdr.textContent = 'How ' + ALGOS[algoKey].label + ' Works';

  document.getElementById('how-summary').textContent = ex.summary;
  document.getElementById('how-list').innerHTML = ex.steps
    .map((step, i) =>
      '<div class="how-item">'
      + '<div class="how-num">' + (i + 1) + '</div>'
      + '<div class="how-text"><strong>' + step[0] + ':</strong> ' + step[1] + '</div>'
      + '</div>'
    )
    .join('');
}

// ------ Header badges ------
function updateHeader(algoKey) {
  const a = ALGOS[algoKey];
  document.getElementById('hdr-algo').textContent  = a.label;
  document.getElementById('hdr-best').textContent  = 'Best: '  + a.best;
  document.getElementById('hdr-avg').textContent   = 'Avg: '   + a.avg;
  document.getElementById('hdr-worst').textContent = 'Worst: ' + a.worst;
  document.getElementById('viz-title').textContent = a.label;

  // Highlight matching row in the Big-O table
  document.querySelectorAll('#bigo-body tr').forEach(row => {
    row.classList.toggle('highlight', row.dataset.algo === algoKey);
  });
}

// ------ Controls ------
function onAlgoChange() {
  shouldStop = true;
  const key  = document.getElementById('algo-select').value;
  setTimeout(() => {
    currentArray = readArray();
    opCount      = 0;
    drawBars(currentArray);
    showCode(key);
    showComplexity(key);
    showExplanation(key);
    updateHeader(key);
    setStatus('Ready');
    document.getElementById('btn-run').disabled   = false;
    document.getElementById('btn-pause').disabled = true;
  }, 60);
}

function resetSort() {
  shouldStop = true;
  isRunning  = false;
  isPaused   = false;
  setTimeout(() => {
    currentArray = readArray();
    opCount      = 0;
    const key    = document.getElementById('algo-select').value;
    drawBars(currentArray);
    showCode(key);
    setStatus('Ready');
    document.getElementById('btn-run').disabled   = false;
    document.getElementById('btn-pause').disabled = true;
    document.getElementById('btn-pause').textContent = '⏸ Pause';
  }, 60);
}

function pauseSort() {
  isPaused = !isPaused;
  document.getElementById('btn-pause').textContent = isPaused ? '▶ Resume' : '⏸ Pause';
}

async function runSort() {
  if (isRunning) return;
  currentArray  = readArray();
  opCount       = 0;
  shouldStop    = false;
  isRunning     = true;
  isPaused      = false;
  document.getElementById('btn-run').disabled   = true;
  document.getElementById('btn-pause').disabled = false;

  const key = document.getElementById('algo-select').value;
  logProgress(key + ' sort'); // record to backend (silent if offline)

  if      (key === 'bubble')    await doBubble();
  else if (key === 'selection') await doSelection();
  else if (key === 'insertion') await doInsertion();
  else if (key === 'merge')     await doMergeWrap();
  else if (key === 'quick')     await doQuickWrap();

  isRunning = false;
  document.getElementById('btn-run').disabled   = false;
  document.getElementById('btn-pause').disabled = true;
  document.getElementById('btn-pause').textContent = '⏸ Pause';
}

function switchView(view, clickedBtn) {
  document.querySelectorAll('.view-tab').forEach(b => b.classList.remove('active'));
  clickedBtn.classList.add('active');
  document.querySelectorAll('.view-content').forEach(el => el.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  if (view === 'compare') resetCompareView();
}

// ===========================================================
// SORTING ALGORITHMS
// ===========================================================

async function doBubble() {
  const arr = [...currentArray];
  const n   = arr.length;

  for (let pass = 0; pass < n && !shouldStop; pass++) {
    for (let j = 0; j < n - pass - 1 && !shouldStop; j++) {
      await waitIfPaused();
      opCount++;
      drawBars(arr, { [j]: 'comparing', [j + 1]: 'comparing' });
      showCode('bubble', 4);
      setStatus('Pass ' + (pass + 1) + ': comparing ' + arr[j] + ' and ' + arr[j + 1]);
      await sleep(getDelay());

      if (arr[j] > arr[j + 1]) {
        drawBars(arr, { [j]: 'swapping', [j + 1]: 'swapping' });
        showCode('bubble', 5);
        setStatus('Swapping ' + arr[j] + ' and ' + arr[j + 1]);
        await sleep(getDelay());
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
    // Mark newly settled element as sorted
    if (!shouldStop) {
      const done = {};
      for (let k = n - pass - 1; k < n; k++) done[k] = 'sorted';
      drawBars(arr, done);
    }
  }
  if (!shouldStop) {
    const all = {};
    arr.forEach((_, i) => { all[i] = 'sorted'; });
    drawBars(arr, all);
    setStatus('Done — ' + opCount + ' comparisons');
  }
}

async function doSelection() {
  const arr = [...currentArray];
  const n   = arr.length;

  for (let i = 0; i < n && !shouldStop; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n && !shouldStop; j++) {
      await waitIfPaused();
      opCount++;
      drawBars(arr, { [i]: 'pivot', [minIdx]: 'comparing', [j]: 'swapping' });
      showCode('selection', 5);
      setStatus('Finding min from index ' + i + ': checking ' + arr[j]);
      await sleep(getDelay());
      if (arr[j] < arr[minIdx]) minIdx = j;
    }

    if (!shouldStop && minIdx !== i) {
      drawBars(arr, { [i]: 'swapping', [minIdx]: 'swapping' });
      showCode('selection', 7);
      setStatus('Placing ' + arr[minIdx] + ' at position ' + i);
      await sleep(getDelay());
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
    if (!shouldStop) {
      const done = {};
      for (let k = 0; k <= i; k++) done[k] = 'sorted';
      drawBars(arr, done);
    }
  }
  if (!shouldStop) setStatus('Done — ' + opCount + ' comparisons');
}

async function doInsertion() {
  const arr = [...currentArray];
  const n   = arr.length;

  for (let i = 1; i < n && !shouldStop; i++) {
    const key = arr[i];
    let   j   = i - 1;
    setStatus('Inserting key = ' + key);

    while (j >= 0 && arr[j] > key && !shouldStop) {
      await waitIfPaused();
      opCount++;
      arr[j + 1] = arr[j];
      drawBars(arr, { [j]: 'swapping', [j + 1]: 'comparing' });
      showCode('insertion', 5);
      setStatus('Shifting ' + arr[j] + ' right to make room for ' + key);
      await sleep(getDelay());
      j--;
    }
    arr[j + 1] = key;

    if (!shouldStop) {
      const done = {};
      for (let k = 0; k <= i; k++) done[k] = 'sorted';
      drawBars(arr, done);
      await sleep(getDelay() / 2);
    }
  }
  if (!shouldStop) setStatus('Done — ' + opCount + ' shifts');
}

// Merge sort wrapper — creates a copy then kicks off recursion
async function doMergeWrap() {
  const arr = [...currentArray];
  await mergeSort(arr, 0, arr.length - 1);
  if (!shouldStop) {
    const done = {};
    arr.forEach((_, i) => { done[i] = 'sorted'; });
    drawBars(arr, done);
    setStatus('Done — ' + opCount + ' merge operations');
  }
}
async function mergeSort(arr, left, right) {
  if (left >= right || shouldStop) return;
  const mid = Math.floor((left + right) / 2);
  showCode('merge', 2);
  setStatus('Splitting [' + left + '…' + mid + '] and [' + (mid + 1) + '…' + right + ']');
  await sleep(getDelay() / 2);
  await mergeSort(arr, left, mid);
  await mergeSort(arr, mid + 1, right);
  await mergeHalves(arr, left, mid, right);
}
async function mergeHalves(arr, left, mid, right) {
  const L = arr.slice(left, mid + 1);
  const R = arr.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;

  while (i < L.length && j < R.length && !shouldStop) {
    await waitIfPaused();
    opCount++;
    const highlight = {};
    for (let x = left; x <= right; x++) highlight[x] = 'comparing';
    drawBars(arr, highlight);
    showCode('merge', 9);
    setStatus('Merging: comparing ' + L[i] + ' with ' + R[j]);
    await sleep(getDelay());
    if (L[i] <= R[j]) arr[k++] = L[i++];
    else               arr[k++] = R[j++];
  }
  while (i < L.length) arr[k++] = L[i++];
  while (j < R.length) arr[k++] = R[j++];
}

// Quick sort wrapper
async function doQuickWrap() {
  const arr = [...currentArray];
  await quickSort(arr, 0, arr.length - 1);
  if (!shouldStop) {
    const done = {};
    arr.forEach((_, i) => { done[i] = 'sorted'; });
    drawBars(arr, done);
    setStatus('Done — ' + opCount + ' comparisons');
  }
}
async function quickSort(arr, lo, hi) {
  if (lo >= hi || shouldStop) return;
  const pivotIdx = await partition(arr, lo, hi);
  await quickSort(arr, lo, pivotIdx - 1);
  await quickSort(arr, pivotIdx + 1, hi);
}
async function partition(arr, lo, hi) {
  const pivotVal = arr[hi];
  let i = lo - 1;

  for (let j = lo; j < hi && !shouldStop; j++) {
    await waitIfPaused();
    opCount++;
    const highlight = { [hi]: 'pivot', [j]: 'comparing' };
    for (let x = 0; x < lo; x++) highlight[x] = 'sorted';
    drawBars(arr, highlight);
    showCode('quick', 10);
    setStatus('Pivot = ' + pivotVal + ', checking arr[' + j + '] = ' + arr[j]);
    await sleep(getDelay());

    if (arr[j] <= pivotVal) {
      i++;
      drawBars(arr, { [hi]: 'pivot', [i]: 'swapping', [j]: 'swapping' });
      showCode('quick', 11);
      await sleep(getDelay() / 2);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  return i + 1;
}

// ===========================================================
// COMPARE VIEW  –  runs all 5 algorithms side-by-side
// ===========================================================

function drawCompareBars(containerId, arr, highlights) {
  const container = document.getElementById(containerId);
  const maxVal    = Math.max(...arr, 1);
  container.innerHTML = '';

  arr.forEach((value, idx) => {
    const bar   = document.createElement('div');
    bar.className = 'compare-bar';
    bar.style.height = (value / maxVal * 72 + 4) + 'px';
    bar.style.flex   = '1';
    const state = highlights ? highlights[idx] : '';
    bar.style.background =
      state === 'comparing' ? 'var(--bar-compare)' :
      state === 'swapping'  ? 'var(--bar-swap)'    :
      state === 'sorted'    ? 'var(--bar-sorted)'  :
      state === 'pivot'     ? 'var(--bar-pivot)'   :
      'var(--bar-default)';
    container.appendChild(bar);
  });
}

function resetCompareView() {
  const baseArr = readArray();
  ['bubble', 'selection', 'insertion', 'merge', 'quick'].forEach(name => {
    drawCompareBars('cmp-bars-' + name, [...baseArr], null);
    document.getElementById('cmp-ops-'    + name).textContent = '0 ops';
    document.getElementById('cmp-status-' + name).textContent = 'ready';
  });
  document.getElementById('btn-cmp-run').disabled = false;
}

async function runCompare() {
  document.getElementById('btn-cmp-run').disabled = true;
  const baseArr = readArray();
  // Run all 5 concurrently so they can be compared visually
  await Promise.all([
    runOneCompare('bubble',    [...baseArr]),
    runOneCompare('selection', [...baseArr]),
    runOneCompare('insertion', [...baseArr]),
    runOneCompare('merge',     [...baseArr]),
    runOneCompare('quick',     [...baseArr]),
  ]);
  document.getElementById('btn-cmp-run').disabled = false;
}

async function runOneCompare(name, arr) {
  const opsEl    = document.getElementById('cmp-ops-'    + name);
  const statusEl = document.getElementById('cmp-status-' + name);
  const speed    = Math.max(40, 300 - parseInt(document.getElementById('speed').value, 10) * 28);
  let ops = 0;

  const upd = hl => {
    drawCompareBars('cmp-bars-' + name, arr, hl);
    opsEl.textContent = ops + ' ops';
  };

  if (name === 'bubble') {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        ops++;
        upd({ [j]: 'comparing', [j + 1]: 'comparing' });
        await sleep(speed);
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          upd({ [j]: 'swapping', [j + 1]: 'swapping' });
          await sleep(speed);
        }
      }
    }
  } else if (name === 'selection') {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
      let mn = i;
      for (let j = i + 1; j < n; j++) {
        ops++;
        upd({ [mn]: 'comparing', [j]: 'pivot' });
        await sleep(speed);
        if (arr[j] < arr[mn]) mn = j;
      }
      [arr[i], arr[mn]] = [arr[mn], arr[i]];
    }
  } else if (name === 'insertion') {
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i], j = i - 1;
      while (j >= 0 && arr[j] > key) {
        ops++;
        arr[j + 1] = arr[j];
        upd({ [j]: 'swapping', [j + 1]: 'comparing' });
        await sleep(speed);
        j--;
      }
      arr[j + 1] = key;
    }
  } else if (name === 'merge') {
    async function cmpMerge(a, l, r) {
      if (l >= r) return;
      const m = Math.floor((l + r) / 2);
      await cmpMerge(a, l, m);
      await cmpMerge(a, m + 1, r);
      const L = a.slice(l, m + 1), R = a.slice(m + 1, r + 1);
      let i = 0, j = 0, k = l;
      while (i < L.length && j < R.length) {
        ops++;
        const hl = {};
        for (let x = l; x <= r; x++) hl[x] = 'comparing';
        upd(hl);
        await sleep(speed);
        if (L[i] <= R[j]) a[k++] = L[i++]; else a[k++] = R[j++];
      }
      while (i < L.length) a[k++] = L[i++];
      while (j < R.length) a[k++] = R[j++];
    }
    await cmpMerge(arr, 0, arr.length - 1);
  } else if (name === 'quick') {
    async function cmpQuick(a, lo, hi) {
      if (lo >= hi) return;
      const piv = a[hi]; let idx = lo - 1;
      for (let j = lo; j < hi; j++) {
        ops++;
        upd({ [hi]: 'pivot', [j]: 'comparing' });
        await sleep(speed);
        if (a[j] <= piv) { idx++; [a[idx], a[j]] = [a[j], a[idx]]; }
      }
      [a[idx + 1], a[hi]] = [a[hi], a[idx + 1]];
      await cmpQuick(a, lo, idx);
      await cmpQuick(a, idx + 2, hi);
    }
    await cmpQuick(arr, 0, arr.length - 1);
  }

  const allDone = {};
  arr.forEach((_, i) => { allDone[i] = 'sorted'; });
  upd(allDone);
  statusEl.textContent = 'done — ' + ops + ' ops';
}

// ===========================================================
// PAGE INIT
// ===========================================================
document.addEventListener('DOMContentLoaded', function() {
  currentArray = readArray();
  const startKey = document.getElementById('algo-select').value;
  drawBars(currentArray);
  showCode(startKey);
  showComplexity(startKey);
  showExplanation(startKey);
  updateHeader(startKey);
});