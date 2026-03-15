// =============================================================
// stack.js  –  Stack (LIFO) visualizer with animated push/pop/peek.
// =============================================================

let stackItems = [30, 20, 10]; // default stack — bottom at index 0, top at end

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

const STACK_CODE = {
  push: [
    '<span class="kw">def</span> <span class="fn">push</span>(self, value):',
    '  <span class="kw">if</span> self.is_full():',
    '    <span class="kw">raise</span> Exception("Stack Overflow")',
    '  self.top += 1',
    '  self.data[self.top] = value  <span class="cm"># place on top</span>',
  ],
  pop: [
    '<span class="kw">def</span> <span class="fn">pop</span>(self):',
    '  <span class="kw">if</span> self.is_empty():',
    '    <span class="kw">raise</span> Exception("Stack Underflow")',
    '  value = self.data[self.top]',
    '  self.top -= 1  <span class="cm"># shrink top pointer</span>',
    '  <span class="kw">return</span> value',
  ],
  peek: [
    '<span class="kw">def</span> <span class="fn">peek</span>(self):',
    '  <span class="kw">if</span> self.is_empty():',
    '    <span class="kw">return</span> None',
    '  <span class="kw">return</span> self.data[self.top]  <span class="cm"># look, don\'t remove</span>',
  ],
};

function showCode(op, line) {
  const lines = STACK_CODE[op] || [];
  const hl    = (line === undefined) ? -1 : line;
  document.getElementById('stack-code').innerHTML = lines
    .map((l, i) =>
      '<div class="code-line' + (i === hl ? ' active' : '') + '">' + l + '</div>'
    )
    .join('');
  document.getElementById('stack-op').textContent = op;
}

function setStatus(msg) {
  document.getElementById('stack-status').textContent = msg;
}

// Draw the stack — newest item at the top of the visual column.
// topGlow   = show the top item highlighted in blue
// pushIdx   = index of item being pushed (dashed green border)
// popIdx    = index of item being popped (fades out)
// peekIdx   = index of item being peeked (orange tint)
function drawStack(topGlow, pushIdx, popIdx, peekIdx) {
  const column = document.getElementById('stack-items');
  document.getElementById('stack-size').textContent =
    stackItems.length + ' item' + (stackItems.length !== 1 ? 's' : '');

  if (stackItems.length === 0) {
    column.innerHTML = '<div class="stack-empty">Stack is empty</div>';
    return;
  }

  column.innerHTML = '';
  // Render top-to-bottom: reverse the array so the last-in item appears first
  [...stackItems].reverse().forEach((value, displayIdx) => {
    const realIdx = stackItems.length - 1 - displayIdx;
    const isTop   = realIdx === stackItems.length - 1;

    const item = document.createElement('div');
    item.className = 'stack-item';
    if (isTop && topGlow)    item.classList.add('is-top');
    if (realIdx === pushIdx) item.classList.add('pushing');
    if (realIdx === popIdx)  item.classList.add('popping');
    if (realIdx === peekIdx) item.classList.add('peeking');

    item.innerHTML =
      '<span>' + value + '</span>'
      + '<span class="stack-item-idx">[' + realIdx + ']</span>'
      + (isTop ? '<span class="stack-top-label">TOP</span>' : '');

    column.appendChild(item);
  });
}

// ------ Operations ------

async function stackPush() {
  const raw = document.getElementById('stack-val').value.trim();
  const val = raw || '?';

  showCode('push', 3);
  setStatus('Incrementing the top pointer and placing "' + val + '" on the stack...');
  logProgress('stack push');

  stackItems.push(val);
  drawStack(false, stackItems.length - 1, -1, -1);
  showCode('push', 4);
  await pause(450);

  drawStack(true, -1, -1, -1);
  setStatus('Pushed "' + val + '" — new top is index [' + (stackItems.length - 1) + ']');
}

async function stackPop() {
  if (!stackItems.length) {
    setStatus('Stack Underflow — cannot pop from an empty stack!');
    showCode('pop', 2);
    return;
  }

  const topIdx = stackItems.length - 1;
  const val    = stackItems[topIdx];

  showCode('pop', 3);
  drawStack(false, -1, topIdx, -1);
  setStatus('Popping "' + val + '" from top [' + topIdx + ']...');
  logProgress('stack pop');
  await pause(450);

  stackItems.pop();
  showCode('pop', 4);
  drawStack(true, -1, -1, -1);
  setStatus('Popped "' + val + '" — stack size is now ' + stackItems.length);
}

async function stackPeek() {
  if (!stackItems.length) {
    setStatus('Stack is empty — nothing to peek at');
    return;
  }

  const topIdx = stackItems.length - 1;
  const val    = stackItems[topIdx];

  showCode('peek', 3);
  drawStack(false, -1, -1, topIdx);
  setStatus('Peek: top element is "' + val + '" at [' + topIdx + '] — it stays in the stack');
  logProgress('stack peek');

  await pause(1200);
  drawStack(true, -1, -1, -1);
}

function stackReset() {
  stackItems = [30, 20, 10];
  drawStack(true, -1, -1, -1);
  showCode('push');
  setStatus('Stack reset to default');
}

document.addEventListener('DOMContentLoaded', function() {
  stackReset();
  document.getElementById('stack-val').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') stackPush();
  });
});