// Day 07 - Hesap Makinesi
// Temel işlemler (+, -, *, /), yüzde, sil, temizle, klavyeden destek

const prevOperandEl = document.getElementById("prev-operand");
const currOperandEl = document.getElementById("curr-operand");

class Calculator {
  constructor(prevOperandTextElement, currOperandTextElement) {
    this.prevOperandTextElement = prevOperandTextElement;
    this.currOperandTextElement = currOperandTextElement;
    this.clear();
  }

  clear() {
    this.currOperand = "0";
    this.prevOperand = "";
    this.operation = undefined;
    this.shouldResetScreen = false;
  }

  delete() {
    if (this.shouldResetScreen) return;
    if (this.currOperand === "0") return;
    if (this.currOperand.length === 1) {
      this.currOperand = "0";
    } else {
      this.currOperand = this.currOperand.toString().slice(0, -1);
    }
  }

  appendNumber(number) {
    if (this.shouldResetScreen) {
      this.currOperand = "";
      this.shouldResetScreen = false;
    }
    if (number === "." && this.currOperand.includes(".")) return;
    if (this.currOperand === "0" && number !== ".") {
      this.currOperand = number.toString();
    } else {
      this.currOperand = this.currOperand.toString() + number.toString();
    }
  }

  chooseOperation(operation) {
    if (this.currOperand === "") return;
    if (this.prevOperand !== "") {
      this.compute();
    }
    this.operation = operation;
    this.prevOperand = this.currOperand;
    this.currOperand = "";
  }

  compute() {
    let computation;
    const prev = parseFloat(this.prevOperand);
    const current = parseFloat(this.currOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "/":
        computation = current === 0 ? null : prev / current;
        break;
      default:
        return;
    }
    if (computation === null) {
      this.currOperand = "Hata";
      this.prevOperand = "";
      this.operation = undefined;
      this.shouldResetScreen = true;
      this.updateDisplay();
      return;
    }
    // Floating point hatasını gidermek için yuvarla
    computation = Math.round(computation * 1e10) / 1e10;
    this.currOperand = computation.toString();
    this.operation = undefined;
    this.prevOperand = "";
    this.shouldResetScreen = true;
  }

  percent() {
    const current = parseFloat(this.currOperand);
    if (isNaN(current)) return;
    this.currOperand = (current / 100).toString();
    this.shouldResetScreen = false;
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("tr-TR", { maximumFractionDigits: 0 });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currOperandTextElement.innerText = this.getDisplayNumber(this.currOperand);
    if (this.operation != null) {
      this.prevOperandTextElement.innerText = `${this.getDisplayNumber(this.prevOperand)} ${this.operation}`;
    } else {
      this.prevOperandTextElement.innerText = "";
    }
  }
}

const calculator = new Calculator(prevOperandEl, currOperandEl);

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-action='equals']");
const deleteButton = document.querySelector("[data-action='delete']");
const allClearButton = document.querySelector("[data-action='clear']");
const percentButton = document.querySelector("[data-action='percent']");

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.dataset.number);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.dataset.operation);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", () => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener("click", () => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener("click", () => {
  calculator.delete();
  calculator.updateDisplay();
});

percentButton.addEventListener("click", () => {
  calculator.percent();
  calculator.updateDisplay();
});

// Klavyeden destek
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") {
    calculator.appendNumber(e.key);
    calculator.updateDisplay();
  }
  if (e.key === ".") {
    calculator.appendNumber(".");
    calculator.updateDisplay();
  }
  if (e.key === "=" || e.key === "Enter") {
    e.preventDefault();
    calculator.compute();
    calculator.updateDisplay();
  }
  if (e.key === "Backspace") {
    calculator.delete();
    calculator.updateDisplay();
  }
  if (e.key === "Escape") {
    calculator.clear();
    calculator.updateDisplay();
  }
  if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
    calculator.chooseOperation(e.key);
    calculator.updateDisplay();
  }
  if (e.key === "%") {
    calculator.percent();
    calculator.updateDisplay();
  }
});

// Başlangıç ekranı
calculator.updateDisplay();