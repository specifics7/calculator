const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator-keys');
const display = document.querySelector('.calculator-display');

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

    return result;
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
        if ( action === 'add' || action === 'subtract' || action === 'multiply' || action ===  'divide') {
            const firstValue = calculator.dataset.firstValue;
            const operator = calculator.dataset.operator;
            const secondValue = displayedNum;

            if (firstValue && operator && previousKeyType !== 'operator' && previousKeyType !== 'calculate') {
                const calcValue = calculate(firstValue, operator, secondValue);
                display.textContent = calcValue;
                // Update calculated value as firstValue
                calculator.dataset.firstValue = calcValue;
            } else {
                // If there are no calculations, set displayedNum as the firstValue
                calculator.dataset.firstValue = displayedNum;
            }
            
            
            key.classList.add('is-depressed'); // add class to operator key so user knows operator is active
            calculator.dataset.previousKeyType = 'operator';
            calculator.dataset.operator = action;
        }

        // Decimal key
        if (action === 'decimal') {
            if (!displayedNum.includes('.')) { // Check if there is already a decimal
                display.textContent = displayedNum + '.';
            } else if (previousKeyType === 'operator' || previousKeyType === 'calculate') {
                display.textContent = '0.';
            }
            calculator.dataset.previousKeyType = 'decimal';
        }

        // Clear key
        if (action === 'clear') {
            // Always clear everything
            delete calculator.dataset.firstValue;
            delete calculator.dataset.modValue;
            delete calculator.dataset.operator;
            delete calculator.dataset.previousKeyType;
            
            display.textContent = 0;
            calculator.dataset.previousKeyType = 'clear';
            key.textContent = 'AC'; // Reset button text
        }

        // if (action !== 'clear') {
        //     const clearButton = calculator.querySelector('[data-action=clear]');
        //     clearButton.textContent = 'CE';
        // }

        // Equal key
        if (action === 'calculate') {
            let firstValue = calculator.dataset.firstValue;
            const operator = calculator.dataset.operator;
            let secondValue = displayedNum;
            
            if (firstValue) {
                if (previousKeyType === 'calculate') {
                    firstValue = displayedNum;
                    secondValue = calculator.dataset.modValue
                }
                display.textContent = calculate(firstValue, operator, secondValue);
            }

            // Set modValue attribute
            calculator.dataset.modValue = secondValue;
            calculator.dataset.previousKeyType = 'calculate';
        }
    }
})