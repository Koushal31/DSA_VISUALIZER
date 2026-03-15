// =============================================================
// queue.js  –  Queue (FIFO) visualizer with animated enqueue/dequeue/peek.
// =============================================================

let queueItems = ['A', 'B', 'C']; // default queue

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

const QUEUE_CODE = {
  enqueue: [
    '<span class="kw">def</span> <span class="fn">enqueue</span>(self, value):',
    '  <span class="kw">if</span> self.is_full():',
    '    <span class="kw">raise</span> Exception("Queue Overflow")',
    '  self.rear = (self.rear + 1) % self.capacity',
    '  self.data[self.rear] = value  <span class="cm"># add to rear</span>',
    '  self.size += 1',
  ],
  dequeue: [
    '<span class="kw">def</span> <span class="fn">dequeue</span>(self):',
    '  <span class="kw">if</span> self.is_empty():',
    '    <span class="kw">raise</span> Exception("Queue Underflow")',
    '  value = self.data[self.front]',
    '  self.front = (self.front + 1) % self.capacity',
    '  self.size -= 1  <span class="cm"># remove from front</span>',
    '  <span class="kw">return</span> value',
  ],
  peek: [
    '<span class="kw">def</span> <span class="fn">peek</span>(self):',
    '  <span class="kw">if</span> self.is_empty():',
    '    <span class="kw">return</span> None',
    '  <span class="kw">return</span> self.data[self.front]  <span class="cm"># look, don\'t remove</span>',
  ],
};

function showCode(op, line) {
  const lines = QUEUE_CODE[op] || [];
  const hl    = (line === undefined) ? -1 : line;
  document.getElementById('queue-code').innerHTML = lines
    .map((l, i) =>
      '<div class="code-line' + (i === hl ? ' active' : '') + '">' + l + '</div>'
    )
    .join('');
  document.getElementById('queue-op').textContent = op;
}

function setStatus(msg) {
  document.getElementById('queue-status').textContent = msg;
}

// Draw the queue left-to-right.
// Front item (index 0) is on the left; rear item is on the right.
function drawQueue(enqIdx, deqIdx, peekIdx) {
  const track = document.getElementById('queue-items');
  document.getElementById('queue-size').textContent =
    queueItems.length + ' item' + (queueItems.length !== 1 ? 's' : '');

  if (!queueItems.length) {
    track.innerHTML = '<div class="queue-empty">Queue is empty</div>';
    return;
  }

  track.innerHTML = '';
  queueItems.forEach((value, i) => {
    const isFront = i === 0;
    const isRear  = i === queueItems.length - 1;

    const box = document.createElement('div');
    box.className = 'queue-item';
    if      (i === deqIdx)  box.classList.add('dequeueing');
    else if (i === enqIdx)  box.classList.add('enqueueing');
    else if (i === peekIdx) box.classList.add('peeking');
    else if (isFront)       box.classList.add('is-front');
    else if (isRear)        box.classList.add('is-rear');

    box.innerHTML =
      '<span>' + value + '</span>'
      + '<span class="q-idx">[' + i + ']</span>'
      + (isFront ? '<span class="q-label">FRONT</span>' : '')
      + (isRear  ? '<span class="q-label" style="bottom:-16px">REAR</span>'  : '');

    track.appendChild(box);

    // Arrow between items
    if (i < queueItems.length - 1) {
      const arrow = document.createElement('div');
      arrow.className   = 'queue-arrow';
      arrow.textContent = '→';
      track.appendChild(arrow);
    }
  });
}

// ------ Operations ------

async function queueEnqueue() {
  const raw = document.getElementById('queue-val').value.trim();
  const val = raw || '?';

  showCode('enqueue', 3);
  setStatus('Moving rear pointer forward and adding "' + val + '" to the back...');
  logProgress('queue enqueue');

  queueItems.push(val);
  drawQueue(queueItems.length - 1, -1, -1);
  showCode('enqueue', 4);
  await pause(450);

  drawQueue(-1, -1, -1);
  setStatus('Enqueued "' + val + '" at rear [' + (queueItems.length - 1) + ']');
}

async function queueDequeue() {
  if (!queueItems.length) {
    setStatus('Queue Underflow — cannot dequeue from an empty queue!');
    showCode('dequeue', 2);
    return;
  }

  const val = queueItems[0];
  showCode('dequeue', 3);
  drawQueue(-1, 0, -1);
  setStatus('Dequeuing "' + val + '" from the front...');
  logProgress('queue dequeue');
  await pause(450);

  queueItems.shift();
  showCode('dequeue', 5);
  drawQueue(-1, -1, -1);

  const nextFront = queueItems.length ? '"' + queueItems[0] + '"' : 'empty';
  setStatus('Dequeued "' + val + '" — new front is ' + nextFront);
}

async function queuePeek() {
  if (!queueItems.length) {
    setStatus('Queue is empty — nothing to peek at');
    return;
  }

  const val = queueItems[0];
  showCode('peek', 3);
  drawQueue(-1, -1, 0);
  setStatus('Peek: front element is "' + val + '" — it stays in the queue');
  logProgress('queue peek');

  await pause(1200);
  drawQueue(-1, -1, -1);
}

function queueReset() {
  queueItems = ['A', 'B', 'C'];
  drawQueue(-1, -1, -1);
  showCode('enqueue');
  setStatus('Queue reset to default');
}

document.addEventListener('DOMContentLoaded', function() {
  queueReset();
  document.getElementById('queue-val').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') queueEnqueue();
  });
});