/**
 * events.js
 *
 * Adds event handlers to the dom
 */
// Wrap the module in a function to avoid littering the global
// namespace
(function () {
  var responsePane = document
    .getElementById('response')
    .getElementsByTagName('span')
    .item(0);
  
  
  // create a click handler for number/decimal buttons
  function mkHandleNumClick(number) {
    return function() {
      updateNumber(number);
      updateResponse(responsePane);

      console.log(state);
    };
  }

  // create a click handler for operators
  function mkHandleOpClick(operation) {
    return function() {
      addOperation(operation);
      updateResponse(responsePane);

      console.log(state);
    };
  }

  // handle clicks for '='
  function handleEqClick() {
    eval();
    updateResponse(responsePane);

    console.log(state);
  }

  // Generate events for each number button
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function(num) {
    document
      .getElementById('input-' + num)
      .addEventListener('click', mkHandleNumClick(num));
  });

  // Decimal button
  document
    .getElementById('input-dec')
    .addEventListener('click', mkHandleNumClick('.'));

  // Operator buttons
  document
    .getElementById('input-div')
    .addEventListener('click', mkHandleOpClick('/'));

  document
    .getElementById('input-mult')
    .addEventListener('click', mkHandleOpClick('*'));

  document
    .getElementById('input-sub')
    .addEventListener('click', mkHandleOpClick('-'));
  
  document
    .getElementById('input-add')
    .addEventListener('click', mkHandleOpClick('+'));

  // '=' button
  document
    .getElementById('input-eq')
    .addEventListener('click', handleEqClick);
})();
