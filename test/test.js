'use strict';

var test = require('tape');
var suggestions = require('../');

test('basics', function(t) {
  var parent = document.createElement('div');
  var input = document.createElement('input');
  parent.appendChild(input);

  var data = ['bear', 'bearing', 'bar', 'ball'];
  var typeahead = suggestions(input, data);

  var suggestionsContainer = parent.querySelector('ul');

  t.ok(suggestionsContainer, 'suggestions container exists');
  t.equal(suggestionsContainer.style.display, 'none', 'suggestions container is initially hidden');
  t.equal(typeahead.data, data, 'data is set');

  input.value = 'bear';

  var keyUpEvent = document.createEvent('HTMLEvents');
  keyUpEvent.initEvent('keyup', true, false);

  var focusEvent = document.createEvent('HTMLEvents');
  focusEvent.initEvent('focus', true, false);

  input.dispatchEvent(keyUpEvent);
  input.dispatchEvent(focusEvent);

  t.equal(suggestionsContainer.style.display, 'block', 'suggestions container is displayed');

  var suggestionList = suggestionsContainer.querySelectorAll('li');
  var suggestionResults = [];
  Array.prototype.forEach.call(suggestionList, function(el){
    suggestionResults.push(el.textContent);
  });

  t.deepEqual(suggestionResults, ['bear', 'bearing'], 'populate a correct results');

  var blurEvent = document.createEvent('HTMLEvents');
  blurEvent.initEvent('blur', true, false);
  input.dispatchEvent(blurEvent);

  t.equal(suggestionsContainer.style.display, 'none', 'suggestions container hidden on blur');

  // Results are still present on focus
  input.dispatchEvent(focusEvent);
  t.ok(suggestionsContainer.querySelectorAll('li').length, 'results still present on focus');
  t.equal(suggestionList[0].classList.contains('active'), true, 'first item is active');

  var mouseDownEvent = document.createEvent('HTMLEvents');
  mouseDownEvent.initEvent('mousedown', true, false);
  suggestionList[1].dispatchEvent(mouseDownEvent);

  // console.log('CLASSLIST', suggestionList[1].classList);
  // t.equal(suggestionList[0].classList.contains('active'), false, 'first item no longer active');
  // t.equal(suggestionList[1].classList.contains('active'), true, 'second item is active');

  t.end();
});

// close the smokestack window once tests are complete
test('shutdown', function(t) {
  t.end();
  setTimeout(function() {
    window.close();
  });
});
