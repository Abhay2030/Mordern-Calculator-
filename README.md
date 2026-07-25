# Modern Calculator

A polished calculator web app with a modern interface, safe expression evaluation, theme switching, memory support, and history.

## Features

- Clean responsive design with light/dark mode
- Safe expression parser with support for:
  - addition, subtraction, multiplication, division
  - exponentiation with `^`
  - parentheses grouping
  - unary plus/minus
  - square root with `√`
- Memory functions: `MC`, `MR`, `M+`, `M-`
- Calculation history displayed live
- Keyboard support for digits, operators, parentheses, Enter, Backspace, and Escape
- Local storage persistence for theme, memory, and history

## Usage

1. Open `index.html` in your browser.
2. Enter expressions using the buttons or your keyboard.
3. Press `=` or `Enter` to evaluate.
4. Use `AC` to clear, `DEL` to delete one character, and `±` to toggle sign.

## Keyboard shortcuts

- `0-9` — digits
- `.` — decimal point
- `+`, `-`, `*`, `/`, `^` — operators
- `(`, `)` — parentheses
- `Enter` / `=` — calculate
- `Backspace` — delete
- `Escape` — clear

## Development

No build step is required. Just open `index.html` in a browser.

## Notes

The calculator no longer uses `eval()` and evaluates expressions through a safe tokenizer and parser.
