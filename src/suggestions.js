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
    this.handleKeyUp.call(this);
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

  this.query = this.filter(this.el.value);

  this.list.clear();

  if (this.query.length < this.options.minLength) {
    this.list.draw();
    return;
  }

  this.getCandidates(function(data) {
    for (var i = 0; i < data.length; i++) {
      this.list.add(data[i]);
      if (this.options.limit !== false && i === this.limit) {
        break;
      }
    }
    this.list.draw();
  }.bind(this));
};

Suggestions.prototype.handleKeyDown = function(e) {
  var keyCode = e.keyCode;

  switch (keyCode) {
    case 13: // ENTER
      if (!this.list.isEmpty()) {
        this.value(this.list.items[this.list.active]);
        this.list.hide();
      }
    break;
    case 27: // ESC
    case 9:  // TAB
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

Suggestions.prototype.filter = function(value) {
  value = value.toLowerCase();
  return value;
};

Suggestions.prototype.match = function(candidate) {
  return candidate.indexOf(this.query) > -1;
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
    if (this.match(this.filter(candidate))) {
      items.push(this.data[i]);
    }
  }
  callback(items);
};

Suggestions.prototype.getItemValue = function(item) {
  return item;
};

Suggestions.prototype.highlight = function(item) {
  return this.getItemValue(item).replace(new RegExp('^(' + this.query + ')', 'ig'), function($1, match) {
    return '<strong>' + match + '</strong>';
  });
};

module.exports = Suggestions;
