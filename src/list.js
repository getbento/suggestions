'use strict';

var List = function(component) {
  this.component = component;
  this.items = [];
  this.active = undefined;
  this.wrapper = document.createElement('div');
  this.wrapper.className = 'suggestions-wrapper';
  this.element = document.createElement('ul');
  this.element.className = 'suggestions';
  this.wrapper.appendChild(this.element);

  // selectingListItem is set to true in the time between the mousedown and mouseup when clicking an item in the list
  // mousedown on a list item will cause the input to blur which normally hides the list, so this flag is used to keep
  // the list open until the mouseup
  this.selectingListItem = false;

  component.el.parentNode.insertBefore(this.wrapper, component.el.nextSibling);
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
  this.element.innerHTML = '';
  this.items = [];
  this.active = undefined;
};

List.prototype.isEmpty = function() {
  return !this.items.length;
};

List.prototype.isVisible = function() {
  return this.element.style.display === 'block';
};

List.prototype.draw = function() {

  if (this.items.length === 0) {
    this.hide();
    return;
  }

  for (var i = 0; i < this.items.length; i++) {
    this.drawItem(this.items[i], this.active === i);
  }

  this.show();
};

List.prototype.drawItem = function(item, active) {
  let li = null
  let anchor = null
  const currentItem = Array.from(this.element.children).find(child => child.id === item.original.id)
  if (currentItem) {
    li = currentItem
    anchor = currentItem.childNodes[0]
  } else {
    li = document.createElement('li')
    anchor = document.createElement('a')
  
    li.id = item.original.id
    li.role = 'option'

    anchor.innerHTML = item.string;

    li.appendChild(anchor);
    this.element.appendChild(li);

    li.addEventListener('mousedown', function() {
      this.selectingListItem = true;
    }.bind(this));

    li.addEventListener('mouseup', function() {
      this.handleMouseUp.call(this, item);
    }.bind(this));
  }

  if (active) {
    li.classList.add('active');
    this.component.el.setAttribute('aria-activedescendant', li.id)
    li.ariaSelected = 'true';
  } else {
    li.classList.remove('active')
    li.removeAttribute('aria-selected');
  }
};

List.prototype.handleMouseUp = function(item) {
  this.selectingListItem = false;
  this.component.value(item.original);
  this.clear();
  this.draw();
};

List.prototype.move = function(index) {
  this.active = index;
  this.draw();
};

List.prototype.previous = function() {
  if (this.active === undefined || this.active === 0) {
    this.move(this.items.length - 1)
  } else {
    this.move(this.active - 1)
  }
};

List.prototype.next = function() {
  if (this.active === undefined || this.active === this.items.length - 1) {
    this.move(0)
  } else {
    this.move(this.active + 1)
  }
};

List.prototype.drawError = function(msg){
  var li = document.createElement('li');

  li.innerHTML = msg;

  this.element.appendChild(li);
  this.show();
}

module.exports = List;
