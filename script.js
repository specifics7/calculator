const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator-keys');
const display = document.querySelector('.calculator-display');
const expression = document.querySelector('.calculator-expression'); // NEW

const calculate = (num1, operator, num2) => {
    let result = '';

    if (operator === 'add') {
        result = parseFloat(num1) + parseFloat(num2);
    } else if (operator === 'subtract') {
        result = parseFloat(num1) - parseFloat(num2);
    } else if (operator === 'multiply') {
        result = parseFloat(num1) * parseFloat(num2);
    } else if (operator === 'divide') {
        result = parseFloat(num1) / parseFloat(num2);
    }

    return formatDisplayNumber(result);
}

const formatDisplayNumber = (number) => {
    // Convert to number if it's a string
    const num = parseFloat(number);
    
    // Handle special cases
    if (isNaN(num)) return '0';
    if (!isFinite(num)) return 'Error';
    
    // Convert to string to check length
    const numStr = num.toString();
    
    // If the number fits (including decimal point), show it as is
    if (numStr.length <= 12) {
        return numStr;
    }
    
    // If it's a very large or very small number, use exponential notation
    if (Math.abs(num) >= 1e10 || (Math.abs(num) < 0.001 && num !== 0)) {
        return num.toExponential(6);
    }
    
    // For long decimals, round to fit the display
    // Calculate how many decimal places we can show
    const integerPart = Math.floor(Math.abs(num)).toString().length;
    const decimalPlaces = Math.max(0, 12 - integerPart - 1); // -1 for decimal point
    
    return num.toFixed(decimalPlaces);
}

// Helper function to get operator symbol
const getOperatorSymbol = (operator) => {
    const symbols = {
        add: '+',
        subtract: '-',
        multiply: '×',
        divide: '÷'
    };
    return symbols[operator] || '';
}

keys.addEventListener('click', e => {
    if (e.target.matches('button')) {
        const key = e.target;
        const action = key.dataset.action;
        const keyContent = key.textContent;
        const displayedNum = display.textContent;
        const previousKeyType = calculator.dataset.previousKeyType;

        // Remove .is-depressed class from all keys
        Array.from(key.parentNode.children).forEach(k =>
            k.classList.remove('is-depressed'),
        )

        // Number keys
        if (!action) {
            if (displayedNum === '0' || previousKeyType === 'operator' || previousKeyType === 'calculate') {
                display.textContent = keyContent;
            } else {
                display.textContent = displayedNum + keyContent;
            }
            calculator.dataset.previousKeyType = 'number';
        }

        // Operator keys
        if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide') {
            const firstValue = calculator.dataset.firstValue;
            const operator = calculator.dataset.operator;
            const secondValue = displayedNum;

            if (firstValue && operator && previousKeyType !== 'operator' && previousKeyType !== 'calculate') {
                const calcValue = calculate(firstValue, operator, secondValue);
                display.textContent = calcValue;
                calculator.dataset.firstValue = calcValue;
            } else {
                calculator.dataset.firstValue = displayedNum;
            }
            
            key.classList.add('is-depressed');
            calculator.dataset.previousKeyType = 'operator';
            calculator.dataset.operator = action;
            
            // Update expression display
            expression.textContent = `${calculator.dataset.firstValue} ${getOperatorSymbol(action)}`;
        }

        // Decimal key
        if (action === 'decimal') {
            if (!displayedNum.includes('.')) {
                display.textContent = displayedNum + '.';
            } else if (previousKeyType === 'operator' || previousKeyType === 'calculate') {
                display.textContent = '0.';
            }
            calculator.dataset.previousKeyType = 'decimal';
        }

        // Clear key
        if (action === 'clear') {
            delete calculator.dataset.firstValue;
            delete calculator.dataset.modValue;
            delete calculator.dataset.operator;
            delete calculator.dataset.previousKeyType;
            
            display.textContent = 0;
            expression.textContent = ''; // Clear expression
            calculator.dataset.previousKeyType = 'clear';
            key.textContent = 'AC';
        }

        // Equal key
        if (action === 'calculate') {
            let firstValue = calculator.dataset.firstValue;
            const operator = calculator.dataset.operator;
            let secondValue = displayedNum;
            
            if (firstValue) {
                if (previousKeyType === 'calculate') {
                    firstValue = displayedNum;
                    secondValue = calculator.dataset.modValue;
                }
                
                const result = calculate(firstValue, operator, secondValue);
                
                // Show full expression before calculating
                expression.textContent = `${firstValue} ${getOperatorSymbol(operator)} ${secondValue} =`;
                
                display.textContent = result;
            }

            calculator.dataset.modValue = secondValue;
            calculator.dataset.previousKeyType = 'calculate';
        }
    }
})