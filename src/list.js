'Use strict';

var List = function(component) {
  this.component = component;
  this.items = [];
  this.active = 0;
  this.element = document.createElement('ul');
  this.element.className = 'suggestions';

  component.el.parentNode.insertBefore(this.element, component.el.nextSibling);
  return this;
};

List.prototype.show = function() {
  this.element.style.display = 'block';
};

List.prototype.hide = function() {
  this.element.style.display = 'none';
};

List.prototype.add = function(item) {
  this.items.push(item);
};

List.prototype.clear = function() {
  this.items = [];
  this.active = 0;
};

List.prototype.isEmpty = function() {
  return !this.items.length;
};

List.prototype.draw = function() {
  this.element.innerHTML = '';

  if (this.items.length === 0) {
    this.hide();
    return;
  }

  for (var i = 0; i < this.items.length; i++) {
    this.drawItem(this.items[i], this.active === i);
  }

  this.drawStatus(this.items[this.active]);

  this.show();
};

/* Draws the selected option from the dropdown list for screen readers */
List.prototype.drawStatus = function(activeItem) {
  var span = document.createElement('span');
  span.className = 'visually-hidden';
  span.setAttribute('role', 'status');
  span.setAttribute('aria-live', 'assertive');
  span.setAttribute('aria-relevant', 'additions');
  span.innerHTML = activeItem.original;

  this.element.appendChild(span);
};

List.prototype.drawItem = function(item, active) {
  var li = document.createElement('li'),
    a = document.createElement('a');

  if (active) {
    li.className += ' active';
    li.setAttribute('aria-selected', 'true');
  } else {
    li.setAttribute('aria-selected', 'false');
  }

  a.innerHTML = item.string;

  li.appendChild(a);
  this.element.appendChild(li);

  li.addEventListener('mousedown', function() {
    this.handleMouseDown.call(this, item);
  }.bind(this));
};

List.prototype.handleMouseDown = function(item) {
  this.component.value(item.original);
  this.clear();
  this.draw();
};

List.prototype.move = function(index) {
  this.active = index;
  this.draw();
};

List.prototype.previous = function() {
  this.move(this.active === 0 ? this.items.length - 1 : this.active - 1);
};

List.prototype.next = function() {
  this.move(this.active === this.items.length - 1 ? 0 : this.active + 1);
};

module.exports = List;
