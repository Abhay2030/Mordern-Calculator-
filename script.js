const display = document.getElementById('display');
const historyElement = document.getElementById('history');
const themeToggle = document.getElementById('theme-toggle');
const memoryIndicator = document.getElementById('memory-indicator');
const buttons = document.querySelector('.buttons');

const STORAGE_KEY = 'modern-calculator-state';
const MAX_HISTORY_ITEMS = 6;
let memoryValue = 0;
let historyItems = [];

const operators = {
  '+': { precedence: 2, associativity: 'L', argCount: 2, evaluate: (a, b) => a + b },
  '-': { precedence: 2, associativity: 'L', argCount: 2, evaluate: (a, b) => a - b },
  '*': { precedence: 3, associativity: 'L', argCount: 2, evaluate: (a, b) => a * b },
  '/': { precedence: 3, associativity: 'L', argCount: 2, evaluate: (a, b) => a / b },
  '^': { precedence: 4, associativity: 'R', argCount: 2, evaluate: (a, b) => Math.pow(a, b) },
  'u+': { precedence: 5, associativity: 'R', argCount: 1, evaluate: (a) => a },
  'u-': { precedence: 5, associativity: 'R', argCount: 1, evaluate: (a) => -a },
};

const functions = {
  sqrt: (x) => Math.sqrt(x),
  sin: (x) => Math.sin(x),
  cos: (x) => Math.cos(x),
  tan: (x) => Math.tan(x),
  ln: (x) => Math.log(x),
  log: (x) => Math.log10(x),
  exp: (x) => Math.exp(x),
  abs: (x) => Math.abs(x),
};

function init() {
  loadState();
  attachListeners();
  updateMemoryIndicator();
}

function attachListeners() {
  buttons.addEventListener('click', handleButtonClick);
  themeToggle.addEventListener('click', toggleTheme);
  window.addEventListener('keydown', handleKeyboardInput);
}

function handleButtonClick(event) {
  const button = event.target.closest('button');
  if (!button) return;

  const value = button.dataset.value;
  const action = button.dataset.action;

  if (value) {
    appendValue(value);
    return;
  }

  switch (action) {
    case 'clear':
      clearDisplay();
      break;
    case 'delete':
      deleteLast();
      break;
    case 'calculate':
      calculate();
      break;
    case 'memory-add':
      memoryAdd();
      break;
    case 'memory-subtract':
      memorySubtract();
      break;
    case 'memory-recall':
      memoryRecall();
      break;
    case 'memory-clear':
      memoryClear();
      break;
    case 'sin':
      appendValue('sin(');
      break;
    case 'cos':
      appendValue('cos(');
      break;
    case 'tan':
      appendValue('tan(');
      break;
    case 'ln':
      appendValue('ln(');
      break;
    case 'log':
      appendValue('log(');
      break;
    case 'exp':
      appendValue('exp(');
      break;
    case 'sqrt':
      appendValue('sqrt(');
      break;
    case 'power2':
      appendValue('^2');
      break;
    case 'percent':
      applyPercent();
      break;
    case 'pi':
      appendValue('pi');
      break;
    case 'e':
      appendValue('e');
      break;
    case 'parenthesis-left':
      appendParenthesis('(');
      break;
    case 'parenthesis-right':
      appendParenthesis(')');
      break;
    case 'toggle-sign':
      toggleSign();
      break;
    default:
      break;
  }
}

function handleKeyboardInput(event) {
  if (event.target.closest('button')) return;

  const allowedOperators = ['+', '-', '*', '/', '^'];
  if (event.key >= '0' && event.key <= '9') {
    appendValue(event.key);
    return;
  }

  if (event.key === '.') {
    appendValue('.');
    return;
  }

  if (allowedOperators.includes(event.key)) {
    event.preventDefault();
    appendOperator(event.key);
    return;
  }

  if (event.key === 'Enter' || event.key === '=') {
    event.preventDefault();
    calculate();
    return;
  }

  if (event.key === 'Backspace') {
    event.preventDefault();
    deleteLast();
    return;
  }

  if (event.key === 'Escape') {
    clearDisplay();
    return;
  }

  if (event.key === '(' || event.key === ')') {
    appendValue(event.key);
    return;
  }
}

function appendValue(value) {
  if (value === '.' && hasActiveDecimal()) return;
  if (value === '0' && display.value === '0') return;
  if (display.value === '0' && value !== '.') {
    display.value = value;
    return;
  }

  display.value += value;
}

function appendOperator(operator) {
  if (!display.value) return;
  if (/[+\-*/^.]$/.test(display.value)) return;

  display.value += operator;
}

function appendParenthesis(symbol) {
  const last = display.value.slice(-1);
  if (symbol === '(') {
    if (last && /[0-9.)]/.test(last)) {
      display.value += '*(';
    } else {
      display.value += '(';
    }
    return;
  }

  if (symbol === ')') {
    if (!display.value || /[+\-*/^(]$/.test(last)) return;
    const openCount = (display.value.match(/\(/g) || []).length;
    const closeCount = (display.value.match(/\)/g) || []).length;
    if (openCount > closeCount) {
      display.value += ')';
    }
  }
}

function hasActiveDecimal() {
  const currentNumber = display.value.match(/([0-9.]+)$/);
  return currentNumber && currentNumber[0].includes('.');
}

function toggleSign() {
  const expression = display.value;
  if (!expression) return;

  const match = expression.match(/(\(?-?[0-9.]+\)?)$/);
  if (!match) return;

  const lastToken = match[0];
  const prefix = expression.slice(0, match.index);

  if (lastToken.startsWith('(-') && lastToken.endsWith(')')) {
    display.value = prefix + lastToken.slice(2, -1);
  } else {
    display.value = prefix + `(-${lastToken})`;
  }
}

function applyPercent() {
  const expression = display.value;
  if (!expression) return;

  const match = expression.match(/(-?[0-9.]+)$/);
  if (!match) return;

  const prefix = expression.slice(0, match.index);
  const number = parseFloat(match[1]);
  display.value = prefix + `(${number / 100})`;
}

function clearDisplay() {
  display.value = '';
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
}

function memoryAdd() {
  const value = getCurrentValue();
  if (value !== null) {
    memoryValue += value;
    updateMemoryIndicator();
    saveState();
  }
}

function memorySubtract() {
  const value = getCurrentValue();
  if (value !== null) {
    memoryValue -= value;
    updateMemoryIndicator();
    saveState();
  }
}

function memoryRecall() {
  display.value = String(memoryValue);
}

function memoryClear() {
  memoryValue = 0;
  updateMemoryIndicator();
  saveState();
}

function updateMemoryIndicator() {
  memoryIndicator.textContent = memoryValue !== 0 ? 'M' : '';
}

function getCurrentValue() {
  if (!display.value) return null;

  try {
    return evaluateExpression(display.value);
  } catch {
    return null;
  }
}

function calculate() {
  if (!display.value) return;

  try {
    const result = evaluateExpression(display.value);
    const formatted = formatResult(result);
    addHistory(`${display.value} = ${formatted}`);
    display.value = formatted;
    saveState();
  } catch {
    display.value = 'Error';
    setTimeout(clearDisplay, 1200);
  }
}

function formatResult(value) {
  if (!Number.isFinite(value)) {
    throw new Error('Result is not finite');
  }

  const rounded = Math.round(value * 1e12) / 1e12;
  return String(rounded);
}

function addHistory(entry) {
  historyItems.unshift(entry);
  historyItems = historyItems.slice(0, MAX_HISTORY_ITEMS);
  renderHistory();
}

function renderHistory() {
  if (!historyItems.length) {
    historyElement.textContent = 'History will appear here';
    return;
  }

  historyElement.innerHTML = historyItems
    .map((item) => `<div>${item}</div>`)
    .join('');
}

function evaluateExpression(expression) {
  const tokens = tokenize(expression);
  const rpn = shuntingYard(tokens);
  return evaluateRPN(rpn);
}

function tokenize(expression) {
  const tokens = [];
  let index = 0;
  let lastType = 'start';

  while (index < expression.length) {
    const char = expression[index];

    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    if (/[0-9.]/.test(char)) {
      let number = char;
      index += 1;

      while (index < expression.length && /[0-9.]/.test(expression[index])) {
        number += expression[index];
        index += 1;
      }

      tokens.push({ type: 'number', value: parseFloat(number) });
      lastType = 'number';
      continue;
    }

    if (/[+\-*/^()]/.test(char)) {
      const isUnary = (char === '+' || char === '-') && (lastType === 'start' || lastType === 'operator' || lastType === 'left-paren');
      if (isUnary) {
        tokens.push({ type: 'operator', value: char === '+' ? 'u+' : 'u-' });
      } else if (char === '(') {
        tokens.push({ type: 'left-paren', value: char });
        lastType = 'left-paren';
        index += 1;
        continue;
      } else if (char === ')') {
        tokens.push({ type: 'right-paren', value: char });
        lastType = 'right-paren';
        index += 1;
        continue;
      } else {
        tokens.push({ type: 'operator', value: char });
      }

      lastType = 'operator';
      index += 1;
      continue;
    }

    if (/[a-zA-Z]/.test(char)) {
      let name = char;
      index += 1;

      while (index < expression.length && /[a-zA-Z]/.test(expression[index])) {
        name += expression[index];
        index += 1;
      }

      const lowerName = name.toLowerCase();
      if (functions[lowerName]) {
        tokens.push({ type: 'function', value: lowerName });
      } else if (lowerName === 'pi') {
        tokens.push({ type: 'number', value: Math.PI });
      } else if (lowerName === 'e') {
        tokens.push({ type: 'number', value: Math.E });
      } else {
        throw new Error(`Unsupported function: ${name}`);
      }

      lastType = functions[lowerName] ? 'function' : 'number';
      continue;
    }

    throw new Error(`Invalid character encountered: ${char}`);
  }

  return tokens;
}

function shuntingYard(tokens) {
  const output = [];
  const operatorsStack = [];

  for (const token of tokens) {
    if (token.type === 'number') {
      output.push(token);
      continue;
    }

    if (token.type === 'function') {
      operatorsStack.push(token);
      continue;
    }

    if (token.type === 'operator') {
      while (operatorsStack.length > 0) {
        const last = operatorsStack[operatorsStack.length - 1];
        if (last.type === 'operator') {
          const currentOp = operators[token.value];
          const previousOp = operators[last.value];
          if (
            (currentOp.associativity === 'L' && currentOp.precedence <= previousOp.precedence) ||
            (currentOp.associativity === 'R' && currentOp.precedence < previousOp.precedence)
          ) {
            output.push(operatorsStack.pop());
            continue;
          }
        }

        if (last.type === 'function') {
          output.push(operatorsStack.pop());
          continue;
        }

        break;
      }

      operatorsStack.push(token);
      continue;
    }

    if (token.type === 'left-paren') {
      operatorsStack.push(token);
      continue;
    }

    if (token.type === 'right-paren') {
      while (operatorsStack.length > 0 && operatorsStack[operatorsStack.length - 1].type !== 'left-paren') {
        output.push(operatorsStack.pop());
      }

      if (operatorsStack.length === 0) {
        throw new Error('Mismatched parentheses');
      }

      operatorsStack.pop();

      if (operatorsStack.length > 0 && operatorsStack[operatorsStack.length - 1].type === 'function') {
        output.push(operatorsStack.pop());
      }
      continue;
    }
  }

  while (operatorsStack.length > 0) {
    const token = operatorsStack.pop();
    if (token.type === 'left-paren' || token.type === 'right-paren') {
      throw new Error('Mismatched parentheses');
    }
    output.push(token);
  }

  return output;
}

function evaluateRPN(rpn) {
  const stack = [];

  for (const token of rpn) {
    if (token.type === 'number') {
      stack.push(token.value);
      continue;
    }

    if (token.type === 'operator') {
      const operator = operators[token.value];
      if (!operator) {
        throw new Error(`Unknown operator: ${token.value}`);
      }

      const args = [];
      for (let i = 0; i < operator.argCount; i += 1) {
        if (stack.length === 0) throw new Error('Missing operand');
        args.unshift(stack.pop());
      }

      stack.push(operator.evaluate(...args));
      continue;
    }

    if (token.type === 'function') {
      const func = functions[token.value];
      if (!func) {
        throw new Error(`Unknown function: ${token.value}`);
      }

      if (stack.length === 0) throw new Error('Missing function argument');
      const value = stack.pop();
      stack.push(func(value));
      continue;
    }
  }

  if (stack.length !== 1) {
    throw new Error('Invalid expression');
  }

  return stack[0];
}

function toggleTheme() {
  const nextTheme = document.body.classList.contains('light') ? 'dark' : 'light';
  applyTheme(nextTheme);
  saveState();
}

function applyTheme(theme) {
  document.body.classList.toggle('light', theme === 'light');
  document.body.classList.toggle('dark', theme === 'dark');
  themeToggle.querySelector('.theme-toggle__icon').textContent = theme === 'light' ? '☀️' : '🌙';
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (saved.theme) applyTheme(saved.theme);
    memoryValue = Number(saved.memory || 0);
    historyItems = Array.isArray(saved.history) ? saved.history.slice(0, MAX_HISTORY_ITEMS) : [];
    renderHistory();
    updateMemoryIndicator();
  } catch {
    applyTheme('dark');
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      theme: document.body.classList.contains('light') ? 'light' : 'dark',
      memory: memoryValue,
      history: historyItems,
    })
  );
}

init();
