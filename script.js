console.log("script.js loaded");
try {
    const display = document.querySelector('.display');
    if (!display) throw new Error("Display element not found");

    let currentInput = '0';
    let hasCalculated = false;

    function updateDisplay(value = currentInput) {
        console.log("Updating display with:", value);
        display.textContent = value || '0';
    }

    function appendCharacter(char) {
        console.log("Appending character:", char);
        if (hasCalculated && /[0-9.]/.test(char)) {
            currentInput = '';
            hasCalculated = false;
        }
        if (currentInput === '0' && /[1-9]/.test(char)) {
            currentInput = char;
        } else if (char === '.' && /\.\d*$/.test(currentInput)) {
            return;
        } else if (/[÷×-+]$/.test(currentInput) && /[÷×-+]/.test(char)) {
            currentInput = currentInput.slice(0, -1) + char;
        } else if (currentInput === '0' && /[÷×-+.]/.test(char)) {
            if (char === '.') currentInput += char;
            else return;
        } else {
            currentInput += char;
        }
        updateDisplay();
    }

    function clearDisplay() {
        console.log("Clearing display");
        currentInput = '0';
        hasCalculated = false;
        updateDisplay();
    }

    function deleteLast() {
        console.log("Deleting last character");
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '') currentInput = '0';
        updateDisplay();
    }

    function calculate() {
        console.log("Calculating:", currentInput);
        try {
            const tokens = tokenize(currentInput);
            console.log("Tokens:", tokens);
            const result = evaluate(tokens);
            console.log("Result:", result);
            if (isNaN(result) || !isFinite(result)) {
                throw new Error("Invalid calculation");
            }
            currentInput = Number(result.toFixed(8)).toString();
            hasCalculated = true;
            updateDisplay();
        } catch (error) {
            console.error("Calculation error:", error.message);
            updateDisplay("Error");
            setTimeout(() => clearDisplay(), 1000);
        }
    }

    function tokenize(input) {
        console.log("Tokenizing:", input);
        const tokens = [];
        let number = '';
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
            if (/[0-9.]/.test(char)) {
                number += char;
            } else if (/[÷×-+]/.test(char)) {
                if (number) tokens.push(parseFloat(number));
                tokens.push(char);
                number = '';
            }
        }
        if (number) tokens.push(parseFloat(number));
        return tokens;
    }

    function evaluate(tokens) {
        console.log("Evaluating tokens:", tokens);
        let result = [];
        let i = 0;
        while (i < tokens.length) {
            if (tokens[i] === '×' || tokens[i] === '÷') {
                const left = result.pop();
                const right = tokens[++i];
                if (typeof right !== 'number') throw new Error("Invalid expression");
                result.push(tokens[i-1] === '×' ? left * right : left / right);
            } else {
                result.push(tokens[i]);
            }
            i++;
        }
        let value = result[0];
        i = 1;
        while (i < result.length) {
            const op = result[i];
            const right = result[i + 1];
            if (typeof right !== 'number') throw new Error("Invalid expression");
            value = op === '+' ? value + right : value - right;
            i += 2;
        }
        return value;
    }

    document.addEventListener('keydown', (e) => {
        console.log("Key pressed:", e.key);
        e.preventDefault();
        if (/[0-9]/.test(e.key)) appendCharacter(e.key);
        else if (e.key === '.') appendCharacter('.');
        else if (e.key === '+') appendCharacter('+');
        else if (e.key === '-') appendCharacter('-');
        else if (e.key === '*') appendCharacter('×');
        else if (e.key === '/') appendCharacter('÷');
        else if (e.key === 'Enter') calculate();
        else if (e.key === 'Escape') clearDisplay();
        else if (e.key === 'Backspace') deleteLast();
    });

    console.log("script.js setup complete");
} catch (error) {
    console.error("script.js error:", error.message);
}