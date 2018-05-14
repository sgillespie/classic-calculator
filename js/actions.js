/**
 * actions.js
 *
 * Adds a global state store and action handlers.
 */

/**
 * Global application state
 */
var state = {
  /**
   * The expression as an array. The array should be numbers delimited by operators.
   * For example: [1, '+', 2, '*', 3]
   */
  expression: [],

  /**
   * The current number being entered by the user
   */
  currentNumber: '',
};

/**
 * Updates the response pane with the final (or iterative) result
 * number
 *
 * @param {Element} element - The response pane
 */
function updateResponse(element) {
  var currentNumber = state.currentNumber;
  var expression = Array.from(state.expression);  // Make a shallow copy

  var textContent = '';  // The eventual result to display

  if (currentNumber === '') {  // Display the iterative evaluation if possible
    // We can evaluate this expression if the precedences are monotonically
    // increasing
    var canEvaluate = expression
      .filter(function(val, idx) { return idx % 2 === 1; }) // only operators
      .map(function(val) { return precedence(val) })
      .reduce(function(accum, val, idx, obj) {
        if (idx === 0) return true;

        return accum && val >= obj[idx - 1];
      }, true);

    if (canEvaluate) {
      // We can't evaluate with a trailing operation
      expression.pop();

      // Update it
      textContent = evalExpr(expression);
    }
    
  } else {
    textContent = currentNumber;
  }

  // Show an error if we would show more than 9 characters
  if (textContent.length > 9) {
    element.textContent = 'Error';
  } else if (textContent.toString().length) {
    element.textContent = textContent;
  }
}


/**
 * Updates the current number being entered by the user. Appends
 * the number to state.currentNumber.
 *
 * @param {string} number - The number representation to append to the
 *                          currentNumber
 */
function updateNumber(number) {
  state.currentNumber += number;
}

/**
 * Add an operator to the expression state. Clears state.currentNumber.
 *
 * @param {string} operator - the representation of the mathematical
 *                            operation (*, /, -, or +)
 */
function addOperation(operator) {
  var currentNumber = state.currentNumber;
  
  var number = Number(currentNumber);
  state.expression.push(number, operator);

  // Clear current number
  state.currentNumber = '';
}

/**
 * Evaluate the current expression and update the state. We use Dijkstra's
 * Shunting-yard algorithm.
 */
function eval() {
  var currentNumber = state.currentNumber;
  var _expression = Array.from(state.expression);  // Make a shallow copy

  // Complete the expression
  var number = Number(currentNumber);
  _expression.push(number);

  var result = evalExpr(_expression);

  // Verify we got a valid number
  if (result === Infinity || isNaN(result)) {
    state.currentNumber = 'Undefined';
  } else {
    state.currentNumber = result.toString();
  }
  
  // Clear the expression
  state.expression = [];
}

/**
 * Evaluate an expression given by the expression. We use Dijkstra's
 * Shunting-yard algorithm
 *
 * @param {array} expression - The parsed expression
 */
function evalExpr(expression) {
  var _expression = Array.from(expression); // Make a shallow copy

  var operators = [];  // The operator stack
  var operands = [];   // The operands stack

  _expression.forEach(function(val, idx) {
    if (idx % 2 === 0) {
      // val is an operand
      operands.push(val);
      return;
    }

    if (operators.length === 0) {
      operators.push(val);
      
    } else {
      while (operators.length > 0) {
        var nextOp = operators[operators.length - 1];

        if (precedence(val) < precedence(nextOp)) {
          break;
        }

        operators.pop();
        var rhs = operands.pop();
        var lhs = operands.pop();

        operands.push(evalOperation(nextOp, lhs, rhs));
      }

      operators.push(val);
    }
  });

  // We've populated our stacks. It should now be safe to evaluate right->left
  operators
    .reverse()
    .forEach(function(operator) {
      var rhs = operands.pop();
      var lhs = operands.pop();

      operands.push(evalOperation(operator, lhs, rhs));
    });

  // We should have one operand left, that's our answer
  return operands.pop();
}

/**
 * Get the precedence of an operator. Operators with a high precedence are have lower
 * numbers. For example, an operator with precedence 0 binds tighter than an operator
 * with precedence 1. 
 *
 *   *, / have precedence 0
 *   +, - have precedence 1 
 *
 * @param {string} operator - a mathematical operator
 */
function precedence(operator) {
  return ['/', '*'].includes(operator) ? 0 : 1;
}

/**
 * Evaluates an expression with one binary operator and two values (lhs operator rhs)
 *
 * @param {string} operator - A mathematical operator (/, *, -, or +)
 * @param {number} lhs - the left-hand operand
 * @param {number} rhs - the right-hand operand
 */
function evalOperation(operator, lhs, rhs) {
  if (operator === '/') {
    return lhs / rhs;
  } else if (operator === '*') {
    return lhs * rhs;
  } else if (operator === '-') {
    return lhs - rhs;
  } else if (operator === '+') {
    return lhs + rhs;
  }
}
