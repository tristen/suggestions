'use strict';

var extend = require('xtend');
var List = require('./list');

var Suggestions = function(el, data, options) {
  options = options || {};

  this.options = extend({
    minLength: 2,
    limit: 5
  }, options);

  this.el = el;
  this.data = data || [];
  this.list = new List(this);

  this.query = '';
  this.selected = null;

  this.list.draw();

  this.el.addEventListener('keyup', function(e) {
    this.handleKeyUp.call(this, e.keyCode);
  }.bind(this), false);

  this.el.addEventListener('keydown', function(e) {
    this.handleKeyDown.call(this, e);
  }.bind(this));

  this.el.addEventListener('focus', function() {
    this.handleFocus.call(this);
  }.bind(this));

  this.el.addEventListener('blur', function() {
    this.handleBlur.call(this);
  }.bind(this));

  this.update = function(revisedData) {
    this.data = revisedData;
  }.bind(this);

  return this;
};

Suggestions.prototype.handleKeyUp = function(keyCode) {
  // 40 - DOWN
  // 38 - UP
  // 27 - ESC
  // 13 - ENTER
  // 9 - TAB

  if (keyCode === 40 ||
      keyCode === 38 ||
      keyCode === 27 ||
      keyCode === 13 ||
      keyCode === 9) return;

  this.query = this.normalize(this.el.value);

  this.list.clear();

  if (this.query.length < this.options.minLength) {
    this.list.draw();
    return;
  }

  this.getCandidates(function(data) {
    for (var i = 0; i < data.length; i++) {
      this.list.add(data[i]);
      if (i === (this.options.limit - 1)) break;
    }
    this.list.draw();
  }.bind(this));
};

Suggestions.prototype.handleKeyDown = function(e) {
  switch (e.keyCode) {
    case 13: // ENTER
    case 9:  // TAB
      if (!this.list.isEmpty()) {
        this.value(this.list.items[this.list.active]);
        this.list.hide();
      }
    break;
    case 27: // ESC
      if (!this.list.isEmpty()) this.list.hide();
    break;
    case 38: // UP
      this.list.previous();
    break;
    case 40: // DOWN
      this.list.next();
    break;
  }
};

Suggestions.prototype.handleBlur = function() {
  this.list.hide();
};

Suggestions.prototype.handleFocus = function() {
  if (!this.list.isEmpty()) this.list.show();
};

/**
 * Normalize the results list and input value for matching
 *
 * @param {String} value
 * @return {String}
 */
Suggestions.prototype.normalize = function(value) {
  value = value.toLowerCase();
  return value;
};

/**
 * Evaluates whether an array item qualifies as a match with the current query
 *
 * @param {String} candidate a possible item from the array passed
 * @param {String} query the current query
 * @return {Boolean}
 */
Suggestions.prototype.match = function(candidate, query) {
  return candidate.indexOf(query) > -1;
};

Suggestions.prototype.value = function(value) {
  this.selected = value;
  this.el.value = this.getItemValue(value);

  if (document.createEvent) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent('change', true, false);
    this.el.dispatchEvent(e);
  } else {
    this.el.fireEvent('onchange');
  }
};

Suggestions.prototype.getCandidates = function(callback) {
  var items = [];

  for (var i = 0; i < this.data.length; i++) {
    var candidate = this.getItemValue(this.data[i]);
    if (this.match(this.normalize(candidate), this.query)) {
      items.push(this.data[i]);
    }
  }
  callback(items);
};

/**
 * For a given item in the data array, return what should be used as the candidate string
 *
 * @param {Object|String} item an item from the data array
 * @return {String} item
 */
Suggestions.prototype.getItemValue = function(item) {
  return item;
};

/**
 * Intercept an item from the results list & highlight the portion in the result
 * string that matches the query
 *
 * @param {String} item an item that qualifies as a result from the data array
 * @return {String} A formated string (HTML allowed).
 */
Suggestions.prototype.highlight = function(item) {
  return this.getItemValue(item).replace(new RegExp(this.query, 'ig'), function($1) {
    return '<strong>' + $1 + '</strong>';
  });
};

module.exports = Suggestions;
