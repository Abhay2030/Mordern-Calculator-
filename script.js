let display = document.getElementById('display');

function appendNumber(num) {
    if (num === '.' && display.value.includes('.')) return;
    display.value += num;
}

function appendOperator(op) {
    if (display.value === '') return;
    if (isOperator(display.value[display.value.length - 1])) return;
    display.value += op;
}

function clearDisplay() {
    display.value = '';
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        display.value = eval(display.value);
    } catch (error) {
        display.value = 'Error';
        setTimeout(() => {
            clearDisplay();
        }, 1000);
    }
}

function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

// Allow keyboard input
document.addEventListener('keydown', function (event) {
    if (event.key >= '0' && event.key <= '9') {
        appendNumber(event.key);
    } else if (event.key === '.') {
        appendNumber('.');
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        event.preventDefault();
        appendOperator(event.key);
    } else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculate();
    } else if (event.key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    } else if (event.key === 'c' || event.key === 'C') {
        clearDisplay();
    }
});