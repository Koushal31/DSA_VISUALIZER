// =============================================================
// linked-list.js  –  Singly linked list visualizer.
// Supports: append, prepend, insert at index, remove head/tail,
//           search by value, and full reversal.
// =============================================================

// Starting list shown when the page first loads
let listData = [10, 20, 30, 40, 50];

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

// ------ Pseudocode for each operation ------
const PSEUDOCODE = {
  append: [
    '<span class="kw">def</span> <span class="fn">append</span>(self, value):',
    '  new_node = Node(value)',
    '  <span class="kw">if</span> self.head <span class="kw">is</span> None:',
    '    self.head = new_node',
    '    <span class="kw">return</span>',
    '  current = self.head',
    '  <span class="kw">while</span> current.next <span class="kw">is not</span> None:',
    '    current = current.next',
    '  current.next = new_node  <span class="cm"># link at the tail</span>',
  ],
  prepend: [
    '<span class="kw">def</span> <span class="fn">prepend</span>(self, value):',
    '  new_node = Node(value)',
    '  new_node.next = self.head  <span class="cm"># point to old head</span>',
    '  self.head = new_node       <span class="cm"># update head pointer</span>',
  ],
  insert_at: [
    '<span class="kw">def</span> <span class="fn">insert_at</span>(self, index, value):',
    '  <span class="kw">if</span> index == 0: <span class="kw">return</span> self.prepend(value)',
    '  current = self.head; i = 0',
    '  <span class="kw">while</span> current <span class="kw">and</span> i < index - 1:',
    '    current = current.next; i += 1',
    '  new_node = Node(value)',
    '  new_node.next = current.next',
    '  current.next = new_node',
  ],
  remove_head: [
    '<span class="kw">def</span> <span class="fn">remove_head</span>(self):',
    '  <span class="kw">if</span> self.head <span class="kw">is</span> None: <span class="kw">return</span>',
    '  self.head = self.head.next  <span class="cm"># skip old head</span>',
    '  <span class="cm"># old head node is now garbage collected</span>',
  ],
  remove_tail: [
    '<span class="kw">def</span> <span class="fn">remove_tail</span>(self):',
    '  <span class="kw">if</span> self.head <span class="kw">is</span> None: <span class="kw">return</span>',
    '  <span class="kw">if</span> self.head.next <span class="kw">is</span> None:',
    '    self.head = None; <span class="kw">return</span>',
    '  current = self.head',
    '  <span class="kw">while</span> current.next.next <span class="kw">is not</span> None:',
    '    current = current.next  <span class="cm"># find second-to-last</span>',
    '  current.next = None       <span class="cm"># unlink the tail</span>',
  ],
  search: [
    '<span class="kw">def</span> <span class="fn">search</span>(self, value):',
    '  current = self.head; index = 0',
    '  <span class="kw">while</span> current <span class="kw">is not</span> None:',
    '    <span class="kw">if</span> current.data == value:',
    '      <span class="kw">return</span> index  <span class="cm"># found it!</span>',
    '    current = current.next; index += 1',
    '  <span class="kw">return</span> -1  <span class="cm"># not in the list</span>',
  ],
  reverse: [
    '<span class="kw">def</span> <span class="fn">reverse</span>(self):',
    '  prev    = None',
    '  current = self.head',
    '  <span class="kw">while</span> current <span class="kw">is not</span> None:',
    '    next_node    = current.next  <span class="cm"># save the rest</span>',
    '    current.next = prev          <span class="cm"># flip pointer</span>',
    '    prev         = current',
    '    current      = next_node',
    '  self.head = prev',
  ],
};

// ------ Helpers ------
function showCode(operation, activeLine) {
  const lines = PSEUDOCODE[operation] || [];
  const hl    = (activeLine === undefined) ? -1 : activeLine;
  document.getElementById('ll-code').innerHTML = lines
    .map((l, i) =>
      '<div class="code-line' + (i === hl ? ' active' : '') + '">' + l + '</div>'
    )
    .join('');
  document.getElementById('ll-op-badge').textContent = operation.replace('_', ' ');
}

function setActiveTab(tabSuffix) {
  document.querySelectorAll('.op-tab').forEach(t => t.classList.remove('active'));
  const tab = document.getElementById('tab-' + tabSuffix);
  if (tab) tab.classList.add('active');
}

function setStatus(msg) {
  document.getElementById('ll-status').textContent = msg;
}

// ------ Draw the list ------
// highlight  = index of a node to show in blue (e.g. being traversed)
// removingAt = index of a node about to be deleted (shown in red/faded)
// newAt      = index of a freshly inserted node (shown dashed green)
function drawList(highlight, removingAt, newAt) {
  const canvas = document.getElementById('ll-canvas');

  document.getElementById('ll-size').textContent =
    listData.length + ' node' + (listData.length !== 1 ? 's' : '');

  if (listData.length === 0) {
    canvas.innerHTML = '<div class="ll-empty">List is empty</div>';
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'll-nodes';

  listData.forEach((value, i) => {
    const group = document.createElement('div');
    group.className = 'll-node-wrap';

    // The node box itself
    const node = document.createElement('div');
    node.className = 'll-node';
    if      (i === newAt)     node.classList.add('nw');
    else if (i === removingAt) node.classList.add('rm');
    else if (i === highlight)  node.classList.add('hl');

    // HEAD / TAIL labels above the first and last nodes
    if (i === 0) {
      const lbl = document.createElement('div');
      lbl.className   = 'll-head-lbl';
      lbl.textContent = 'HEAD';
      node.appendChild(lbl);
    }
    if (i === listData.length - 1) {
      const lbl = document.createElement('div');
      lbl.className   = 'll-tail-lbl';
      lbl.textContent = 'TAIL';
      node.appendChild(lbl);
    }

    const valDiv = document.createElement('div');
    valDiv.className   = 'node-val';
    valDiv.textContent = value;
    node.appendChild(valDiv);

    const idxDiv = document.createElement('div');
    idxDiv.className   = 'node-idx';
    idxDiv.textContent = '[' + i + ']';
    node.appendChild(idxDiv);

    group.appendChild(node);

    // Arrow between nodes
    if (i < listData.length - 1) {
      const arrow = document.createElement('div');
      arrow.className   = 'll-arrow';
      arrow.textContent = '→';
      group.appendChild(arrow);
    }

    wrapper.appendChild(group);
  });

  // Null terminator at the end of the chain
  const arrowToNull = document.createElement('div');
  arrowToNull.className   = 'll-arrow';
  arrowToNull.textContent = '→';
  wrapper.appendChild(arrowToNull);

  const nullEl = document.createElement('div');
  nullEl.className   = 'll-null';
  nullEl.textContent = 'null';
  wrapper.appendChild(nullEl);

  canvas.innerHTML = '';
  canvas.appendChild(wrapper);
}

// ===========================================================
// OPERATIONS
// ===========================================================

async function llAppend() {
  const val = document.getElementById('ll-val').value.trim() || '?';
  setActiveTab('append');
  showCode('append', 1);
  setStatus('Creating a new node with value "' + val + '"...');
  drawList();
  logProgress('linked-list append');
  await pause(350);

  // Animate traversal to the tail
  for (let i = 0; i < listData.length; i++) {
    drawList(i);
    showCode('append', 6);
    setStatus('Traversing to the tail — currently at node [' + i + ']');
    await pause(350);
  }

  listData.push(val);
  drawList(-1, -1, listData.length - 1);
  showCode('append', 8);
  setStatus('Appended "' + val + '" at index ' + (listData.length - 1));
  await pause(600);
  drawList();
}

async function llPrepend() {
  const val = document.getElementById('ll-val').value.trim() || '?';
  setActiveTab('prepend');
  showCode('prepend', 1);
  setStatus('Creating new node "' + val + '" to go at the front...');
  drawList();
  logProgress('linked-list prepend');
  await pause(350);

  showCode('prepend', 2);
  setStatus('Setting new_node.next → head (currently "' + (listData[0] ?? 'null') + '")');
  await pause(450);

  listData.unshift(val);
  drawList(-1, -1, 0);
  showCode('prepend', 3);
  setStatus('"' + val + '" is now the new head');
  await pause(600);
  drawList();
}

async function llInsertAt() {
  const val = document.getElementById('ll-val').value.trim() || '?';
  const idx = parseInt(document.getElementById('ll-idx').value, 10);
  setActiveTab('insert');

  if (isNaN(idx) || idx < 0 || idx > listData.length) {
    setStatus('Index must be between 0 and ' + listData.length);
    return;
  }
  if (idx === 0) { await llPrepend(); return; }

  setStatus('Traversing to position ' + idx + '...');
  showCode('insert_at', 2);
  logProgress('linked-list insert-at');

  for (let i = 0; i < idx; i++) {
    drawList(i);
    showCode('insert_at', 3);
    setStatus('Walking the list — at node [' + i + '], target position is ' + idx);
    await pause(350);
  }

  listData.splice(idx, 0, val);
  drawList(-1, -1, idx);
  showCode('insert_at', 7);
  setStatus('Inserted "' + val + '" at index ' + idx);
  await pause(600);
  drawList();
}

async function llRemoveHead() {
  if (!listData.length) { setStatus('Nothing to remove — list is empty'); return; }
  setActiveTab('remove-head');
  const removed = listData[0];
  showCode('remove_head', 1);
  drawList(0, 0);
  setStatus('Marking head node "' + removed + '" for removal...');
  logProgress('linked-list remove-head');
  await pause(600);

  showCode('remove_head', 2);
  setStatus('head = head.next — moving the head pointer forward');
  await pause(400);

  listData.shift();
  drawList();
  setStatus('Removed "' + removed + '" from the head');
}

async function llRemoveTail() {
  if (!listData.length) { setStatus('Nothing to remove — list is empty'); return; }
  setActiveTab('remove-tail');
  showCode('remove_tail', 4);
  logProgress('linked-list remove-tail');

  // Animate walking to the second-to-last node
  for (let i = 0; i < listData.length - 1; i++) {
    drawList(i);
    showCode('remove_tail', 5);
    setStatus('Walking to the second-to-last node — at [' + i + ']');
    await pause(350);
  }

  const removed = listData[listData.length - 1];
  drawList(-1, listData.length - 1);
  showCode('remove_tail', 7);
  setStatus('Unlinking tail node "' + removed + '"...');
  await pause(600);

  listData.pop();
  drawList();
  setStatus('Removed "' + removed + '" from the tail');
}

async function llSearch() {
  const val = document.getElementById('ll-val').value.trim();
  if (!val) { setStatus('Type a value to search for first'); return; }
  setActiveTab('search');
  showCode('search', 1);
  logProgress('linked-list search');

  for (let i = 0; i < listData.length; i++) {
    drawList(i);
    showCode('search', 3);
    setStatus('Checking [' + i + '] = "' + listData[i] + '" … is it "' + val + '"?');
    await pause(450);

    if (String(listData[i]) === String(val)) {
      showCode('search', 4);
      setStatus('✅  Found "' + val + '" at index ' + i + '!');
      return;
    }
  }

  showCode('search', 6);
  setStatus('❌  "' + val + '" is not in the list');
  drawList();
}

async function llReverse() {
  if (listData.length < 2) { setStatus('Need at least 2 nodes to reverse'); return; }
  setActiveTab('reverse');
  showCode('reverse', 1);
  setStatus('Reversing the list — flipping all pointers...');
  logProgress('linked-list reverse');
  await pause(300);

  // Visualise the pointer-flip step by step
  for (let i = 0; i < Math.floor(listData.length / 2); i++) {
    const mirror = listData.length - 1 - i;
    drawList(i, mirror);
    showCode('reverse', 5);
    setStatus('Reversing pointer between [' + i + '] and [' + mirror + ']');
    await pause(400);
  }

  listData.reverse();
  drawList(-1, -1, 0);
  showCode('reverse', 8);
  setStatus('Done — the old tail is now the head');
  await pause(600);
  drawList();
}

function llReset() {
  listData = [10, 20, 30, 40, 50];
  drawList();
  showCode('append');
  setActiveTab('append');
  setStatus('List reset to default');
}

// ------ Init ------
document.addEventListener('DOMContentLoaded', function() {
  llReset();
  // Allow pressing Enter in the value field to trigger Append
  document.getElementById('ll-val').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') llAppend();
  });
});