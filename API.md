## `getItemValue`

For a given item in the data array, return what should be used as the candidate string

### Parameters

* `item` **`Object or String`** an item from the data array



Returns `String` item


## `highlight`

Intercept an item from the results list & highlight the portion in the result
string that matches the query

### Parameters

* `item` **`String`** an item that qualifies as a result from the data array



Returns `String` A formated string (HTML allowed).


## `match`

Evaluates whether an array item qualifies as a match with the current query

### Parameters

* `candidate` **`String`** a possible item from the array passed
* `query` **`String`** the current query



Returns `Boolean` 


## `normalize`

Normalize the results list and input value for matching

### Parameters

* `value` **`String`** 



Returns `String` 


## `Suggestions`

A typeahead component for inputs

### Parameters

* `el` **`HTMLInputElement`** A valid HTML input element
* `data` **`Array`** An array of data used for results
* `options` **`Object`** 


### Examples

```js
// in the browser
var input = document.querySelector('input');
var data = [
  'Roy Eldridge',
  'Roy Hargrove',
  'Rex Stewart'
];

new Suggestions(input, data);

// with options
var input = document.querySelector('input');
var data = [{
  name: 'Roy Eldridge',
  year: 1911
}, {
  name: 'Roy Hargrove',
  year: 1969
}, {
  name: 'Rex Stewart',
  year: 1907
}];

var typeahead = new Suggestions(input, data, {
  minLength: 3, // Number of characters typed into an input to trigger suggestions.
  limit: 3 //  Max number of results to display.
});

// As we're passing an object of an arrays as data, override
// `getItemValue` by specifying the specific property to search on.
typeahead.getItemValue = function(item) { return item.name };

input.addEventListener('change', function() {
  console.log(typeahead.selected); // Current selected item.
});

// With browserify
var Suggestions = require('suggestions');

new Suggestions(input, data);
```

Returns `Suggestions` `this`


