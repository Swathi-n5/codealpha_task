 class Calculator {
            constructor(previousOperandElement, currentOperandElement) {
                this.previousOperandElement = previousOperandElement;
                this.currentOperandElement = currentOperandElement;
                this.clear();
            }

            clear() {
                this.currentOperand = '';
                this.previousOperand = '';
                this.operation = undefined;
                this.updateDisplay();
            }

            delete() {
                this.currentOperand = this.currentOperand.toString().slice(0, -1);
                if (this.currentOperand === '') {
                    this.currentOperand = '0';
                }
                this.updateDisplay();
            }

            appendNumber(number) {
                if (number === '.' && this.currentOperand.includes('.')) return;
                if (this.currentOperand === '0' && number !== '.') {
                    this.currentOperand = number.toString();
                } else {
                    this.currentOperand = this.currentOperand.toString() + number.toString();
                }
                this.updateDisplay();
            }

            chooseOperation(operation) {
                if (this.currentOperand === '') return;
                if (this.previousOperand !== '') {
                    this.compute();
                }
                this.operation = operation;
                this.previousOperand = this.currentOperand;
                this.currentOperand = '';
                this.updateDisplay();
            }

            compute() {
                let computation;
                const prev = parseFloat(this.previousOperand);
                const current = parseFloat(this.currentOperand);
                
                if (isNaN(prev) || isNaN(current)) return;
                
                switch (this.operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '-':
                        computation = prev - current;
                        break;
                    case '×':
                        computation = prev * current;
                        break;
                    case '÷':
                        if (current === 0) {
                            this.showError('Cannot divide by zero');
                            return;
                        }
                        computation = prev / current;
                        break;
                    default:
                        return;
                }
                
                computation = Math.round((computation + Number.EPSILON) * 100000000) / 100000000;
                
                this.currentOperand = computation;
                this.operation = undefined;
                this.previousOperand = '';
                this.updateDisplay();
            }

            showError(message) {
                this.currentOperand = message;
                this.updateDisplay();
                setTimeout(() => {
                    this.clear();
                }, 2000);
            }

            getDisplayNumber(number) {
                const stringNumber = number.toString();
                const integerDigits = parseFloat(stringNumber.split('.')[0]);
                const decimalDigits = stringNumber.split('.')[1];
                let integerDisplay;
                
                if (isNaN(integerDigits)) {
                    integerDisplay = '';
                } else {
                    integerDisplay = integerDigits.toLocaleString('en', {
                        maximumFractionDigits: 0
                    });
                }
                
                if (decimalDigits != null) {
                    return `${integerDisplay}.${decimalDigits}`;
                } else {
                    return integerDisplay;
                }
            }

            updateDisplay() {
                if (typeof this.currentOperand === 'string' && this.currentOperand.includes('Cannot')) {
                    this.currentOperandElement.innerText = this.currentOperand;
                } else {
                    this.currentOperandElement.innerText = this.currentOperand === '' ? '0' : this.getDisplayNumber(this.currentOperand);
                }
                
                if (this.operation != null) {
                    this.previousOperandElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
                } else {
                    this.previousOperandElement.innerText = '';
                }
            }
        }

        const previousOperandElement = document.getElementById('previousOperand');
        const currentOperandElement = document.getElementById('currentOperand');
        const calculator = new Calculator(previousOperandElement, currentOperandElement);

        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        document.addEventListener('keydown', function(event) {
            const key = event.key;
            
            if (key >= '0' && key <= '9') {
                calculator.appendNumber(key);
            } else if (key === '.') {
                calculator.appendNumber('.');
            } else if (key === '+') {
                calculator.chooseOperation('+');
            } else if (key === '-') {
                calculator.chooseOperation('-');
            } else if (key === '*') {
                calculator.chooseOperation('×');
            } else if (key === '/') {
                event.preventDefault();
                calculator.chooseOperation('÷');
            } else if (key === 'Enter' || key === '=') {
                event.preventDefault();
                calculator.compute();
            } else if (key === 'Escape') {
                calculator.clear();
            } else if (key === 'Backspace') {
                event.preventDefault();
                calculator.delete();
            }
        });