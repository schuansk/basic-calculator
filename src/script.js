const operations = [];
const numericalSequence = [];
const operationsView = [];

const operationsViewElement = document.getElementById('operations_view');
const resultElement = document.getElementById('result');

let waiting_operator = true;

document.addEventListener('keydown', (event) => {
  const key = event.key;

  const values = ['.', ',', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const operators = ['+', '-', '/', '*'];

  if (values.indexOf(key) > -1) addNumeral(key);
  if (operators.indexOf(key) > -1) addOperator(key);
  if (key === 'Backspace' || key === 'c') cleanScreen();
}, false);

function addNumeral(request_numeral) {
  if (operationsView.length <= 30) {
    waiting_operator = true;

    let numeral = request_numeral;

    if (numeral === '.' || numeral === ',') {
      numeral = '.';
      if (numericalSequence.indexOf('.') > -1) return ;
    }

    if (numericalSequence.length === 0 && numeral === '.') {   
      numericalSequence.push('0');
      operationsView.push('0');
    }
    
    numericalSequence.push(numeral);
    operationsView.push(numeral);

    operationsViewElement.innerHTML = `<p>${operationsView.join('')}</p>`;
    
    calculate();
  }
}

function addOperator(operator) {
  if (operationsView.length <= 30) {
    if (waiting_operator) {
      waiting_operator = false;

      if (operations.length === 0 && numericalSequence.length === 0) {
        if (operator === '-') {
          operationsView.push(operator);
          numericalSequence.push(operator);
          operationsViewElement.innerHTML = `<p>${operationsView.join('')}</p>`;
        }
      } else {
        let operator_for_viewing;

        operations.push(numericalSequence.join(''));
        operations.push(operator);
        numericalSequence.splice(0, numericalSequence.length);
        
        switch (operator) {
          case '/':
            operator_for_viewing = '÷';
            break;
          case '*':
            operator_for_viewing = 'x';
            break;
          default: 
            operator_for_viewing = operator;
        }
            
        operationsView.push(`<spam class="highlighted">${operator_for_viewing}</spam>`);
        
        operationsViewElement.innerHTML = `<p>${operationsView.join('')}</p>`;
      }
    } 
  }
}

function calculate() {
  let calculation_operations = [].concat(operations);
  let response = true;

  calculation_operations.push(numericalSequence.join(''));
  
  while (response !== false) {
    response = getCalculationData(calculation_operations);
    
    if (response !== false) {
      const operation_result = performOperation(
        parseFloat(calculation_operations[response.first_position]), 
        parseFloat(calculation_operations[response.second_position]), 
        response.operator
      ); 
      
      calculation_operations.splice(response.first_position, 1);
      calculation_operations.splice(response.first_position, 1);
      
      calculation_operations[response.first_position] = String(operation_result);
    }
  }

  let result = calculation_operations[0];

  if (isNaN(result)) {
    result = 'Error'
  } else if (result.indexOf('.') > -1) {
    result = parseFloat(result).toFixed(2);
  } else if (result.length > 10) {
    result = 'Oops :(';
  }

  resultElement.innerHTML = `<p>${result}</p>`;
}

function performOperation(first_value, second_value, operator) {
  switch (operator) {
    case "+":
      return first_value + second_value;
    case "-":
      return first_value - second_value;
    case "/":
      return first_value / second_value;
    case "*":
      return first_value * second_value;
  }
}

function getCalculationData(full_calculation) {
  for(let i = 0; i < full_calculation.length; i++) {
    if (full_calculation[i] === "/" || full_calculation[i] === "*") {
      return {
        first_position: i - 1,
        second_position: i + 1,
        operator: full_calculation[i],
      }
    } 
  }

  for(let i = 0; i < full_calculation.length; i++) {
    if (full_calculation[i] === "+" || full_calculation[i] === "-") {
      return {
        first_position: i - 1,
        second_position: i + 1,
        operator: full_calculation[i],
      }
    } 
  }

  return false;
}

function cleanScreen() {
  operations.splice(0, operations.length);
  numericalSequence.splice(0, numericalSequence.length);
  operationsView.splice(0, operationsView.length);

  operationsViewElement.innerHTML = '';
  resultElement.innerHTML = '<p>0</p>';
}
