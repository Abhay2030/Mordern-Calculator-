# Modern Calculator

A polished web-based calculator with a modern UX, safe parsing engine, theme support, memory storage, and a full history log.

## Project overview

This repository contains a static calculator app built with plain HTML, CSS, and JavaScript. The app is designed to look fresh and modern while providing a safer alternative to `eval()` by using a tokenizer, shunting-yard parser, and reverse Polish notation evaluator.

The calculator supports advanced expression features, keyboard shortcuts, memory operations, and a persistable state using browser local storage.

## Key features

- Modern responsive UI with light and dark themes
- Safe expression evaluation without `eval()`
- Support for:
  - addition, subtraction, multiplication, division
  - exponentiation with `^`
  - parentheses grouping
  - unary plus and minus
  - square root (`√`)
  - percentage conversion
  - scientific engineering functions: `sin`, `cos`, `tan`, `ln`, `log`, `exp`, `π`, and `e`
- Memory buttons:
  - `MC` — Memory Clear
  - `MR` — Memory Recall
  - `M+` — Memory Add
  - `M-` — Memory Subtract
- Live calculation history panel
- Keyboard-friendly controls
- Local storage persistence for theme, memory, and history

## Files

- `index.html` — application structure and button layout
- `style.css` — visual styling, theme handling, and responsive layout
- `script.js` — calculator behavior, parsing, evaluation, and persistence
- `README.md` — project documentation

## Usage

### Open the app

1. Open `index.html` in your browser.
2. Use the on-screen buttons or keyboard to build expressions.
3. Press `=` or `Enter` to evaluate.
4. Use `AC` to clear the display.
5. Use `DEL` to remove the last digit or operator.
6. Use `±` to toggle the sign of the last number.

### Memory operations

- `M+` adds the current displayed result to memory
- `M-` subtracts the current displayed result from memory
- `MR` recalls the stored memory value to the display
- `MC` clears stored memory

Memory state is preserved across browser refreshes.

## Keyboard controls

- `0-9` — enter digits
- `.` — decimal point
- `+`, `-`, `*`, `/`, `^` — operators
- `(`, `)` — parentheses
- `Enter` or `=` — calculate
- `Backspace` — delete last character
- `Escape` — clear display

## Implementation details

### Expression evaluation

The app uses a multi-step evaluation pipeline:

1. **Tokenization** — converts the raw input string into numbers, operators, parentheses, and function tokens
2. **Shunting-yard algorithm** — rewrites tokens into reverse Polish notation (RPN) while respecting precedence and associativity
3. **RPN evaluation** — computes the final result using a stack-based evaluator

This approach avoids the security and reliability issues of `eval()` and makes the math engine easier to extend.

### Theme persistence

The app stores the selected theme in `localStorage` and re-applies it on page load. The theme toggle button switches between light and dark styles.

### History and storage

Calculation history and memory values are stored in `localStorage` so the app preserves state across refresh and browser sessions.

## Development

### Requirements

- A web browser
- No build tools are required

### Run locally

1. Clone or download the repository.
2. Open `index.html` in your browser.

### Optional local server

For a better local development experience, serve the folder using a simple static server. Example:

```bash
cd Mordern-Calculator-
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Future enhancements

- Add more scientific functions (trigonometry, logarithms, factorial)
- Add customizable history capacity
- Improve expression editing and cursor support
- Add animation transitions to button presses

## License

This project is provided as-is and can be used freely in personal or educational projects.
