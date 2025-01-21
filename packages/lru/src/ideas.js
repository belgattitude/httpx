var LRUCache = function (capacity) {
  this.capacity = capacity;
  this.map = {};
  this.list = new List();
};

LRUCache.prototype.get = function (key) {
  if (!this.map[key]) return -1;
  var node = this.map[key];
  this.list.moveToHead(node);
  return node.value;
};

LRUCache.prototype.put = function (key, value) {
  if (this.map[key]) {
    this.map[key].value = value;
    this.list.moveToHead(this.map[key]);
    return;
  }
  var newNode = new Node(key, value);
  if (this.list.size === this.capacity) {
    delete this.map[this.list.tail.key];
    this.list.removeTail();
  }
  this.list.addToHead(newNode);
  this.map[key] = newNode;
};

var List = function () {
  this.head = null;
  this.tail = null;
  this.size = 0;
};

List.prototype.addToHead = function (node) {
  if (this.head === null) {
    this.head = node;
    this.tail = node;
  } else {
    this.head.prev = node;
    node.next = this.head;
    this.head = node;
  }
  this.size++;
};

List.prototype.removeTail = function () {
  if (this.size === 0) return;
  if (this.size === 1) {
    this.head = null;
    this.tail = null;
    this.size--;
    return;
  }
  this.tail = this.tail.prev;
  this.tail.next = null;
  this.size--;
};

List.prototype.moveToHead = function (node) {
  if (node === this.head) return;
  if (node === this.tail) {
    this.removeTail();
  } else {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
  this.addToHead(node);
};

var Node = function (key, value) {
  this.key = key;
  this.value = value;
  this.prev = null;
  this.next = null;
};

// https://leetcode.com/problems/lru-cache/solutions/605744/javascript-solution-with-doubly-linked-list/
class Node {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  insertAtHead = function (node) {
    if (this.head) {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    } else {
      this.head = node;
      this.tail = node;
    }
  };

  insertAtTail = function (node) {
    if (this.tail) {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    } else {
      this.head = node;
      this.tail = node;
    }
  };

  removeAtHead = function () {
    const node = this.head;
    if (node) {
      if (this.head === this.tail) {
        this.head = null;
        this.tail = null;
      } else {
        this.head = this.head.next;
        this.head.prev = null;
      }
    }
    return node;
  };

  removeAtTail = function () {
    const node = this.tail;
    if (node) {
      if (this.head === this.tail) {
        this.head = null;
        this.tail = null;
      } else {
        this.tail = this.tail.prev;
        this.tail.next = null;
      }
    }
    return node;
  };

  removeNode = function (node) {
    if (node === this.head) return this.removeAtHead();
    if (node === this.tail) return this.removeAtTail();
    node.prev.next = node.next;
    node.next.prev = node.prev;
  };

  promoteNode = function (node) {
    this.removeNode(node);
    this.insertAtHead(node);
  };
}

const LRUCache = function (capacity) {
  this.capacity = capacity;
  this.cache = {};
  this.list = new DoublyLinkedList();
  this.length = 0;
};

LRUCache.prototype.evict = function () {
  const node = this.list.removeAtTail();
  this.length--;
  const key = Object.keys(this.cache).find((k) => this.cache[k] === node);
  delete this.cache[key];
};

LRUCache.prototype.put = function (key, value) {
  let node = this.cache[key];
  if (node) {
    node.value = value;
    this.list.promoteNode(node);
  } else {
    if (this.length >= this.capacity) this.evict();
    node = new Node(value);
    this.list.insertAtHead(node);
    this.length++;
    this.cache[key] = node;
  }
};

LRUCache.prototype.get = function (key) {
  const node = this.cache[key];
  if (node) this.list.promoteNode(node);
  return node ? node.value : -1;
};

// #############################""
// https://labuladong.online/algo/en/data-structure/lru-cache/#_3-code-implementation

// Doubly linked list node
function Node(k, v) {
  this.key = k;
  this.val = v;
  this.next = null;
  this.prev = null;
}

// Doubly linked list
function DoubleList() {
  // Head and tail dummy nodes
  this.head = new Node(0, 0);
  this.tail = new Node(0, 0);
  // Number of elements in the list
  this._size = 0;

  // Initialize the doubly linked list data
  this.head.next = this.tail;
  this.tail.prev = this.head;
}

// Add node x to the end of the list, time O(1)
DoubleList.prototype.addLast = function (x) {
  x.prev = this.tail.prev;
  x.next = this.tail;
  this.tail.prev.next = x;
  this.tail.prev = x;
  this._size++;
};

// Remove the node x from the list (x must exist)
// Since it's a doubly linked list and the target Node is given, time O(1)
DoubleList.prototype.remove = function (x) {
  x.prev.next = x.next;
  x.next.prev = x.prev;
  this._size--;
};

// Remove the first node in the list and return it, time O(1)
DoubleList.prototype.removeFirst = function () {
  if (this.head.next === this.tail) {
    return null;
  }
  var first = this.head.next;
  this.remove(first);
  return first;
};

// Return the length of the list, time O(1)
DoubleList.prototype.size = function () {
  return this._size;
};

var LRUCache = function (capacity) {
  // key -> Node(key, val)
  this.map = new Map();
  // Node(k1, v1) <-> Node(k2, v2)...
  this.cache = new DoubleList();
  // maximum capacity
  this.cap = capacity;
};

LRUCache.prototype.get = function (key) {
  if (!this.map.has(key)) {
    return -1;
  }
  // Promote this data to be the most recently used
  this.makeRecently(key);
  return this.map.get(key).val;
};

LRUCache.prototype.put = function (key, val) {
  if (this.map.has(key)) {
    // Remove the old data
    this.deleteKey(key);
    // The newly inserted data is the most recently used data
    this.addRecently(key, val);
    return;
  }

  if (this.cap === this.cache.size()) {
    // Remove the least recently used element
    this.removeLeastRecently();
  }
  // Add as the most recently used element
  this.addRecently(key, val);
};

LRUCache.prototype.makeRecently = function (key) {
  var x = this.map.get(key);
  // First remove this node from the list
  this.cache.remove(x);
  // Reinsert it at the end of the list
  this.cache.addLast(x);
};

LRUCache.prototype.addRecently = function (key, val) {
  var x = new Node(key, val);
  // The end of the list is the most recently used element
  this.cache.addLast(x);
  // Don't forget to add the key mapping in the map
  this.map.set(key, x);
};

LRUCache.prototype.deleteKey = function (key) {
  var x = this.map.get(key);
  // Remove from the list
  this.cache.remove(x);
  // Remove from the map
  this.map.delete(key);
};

LRUCache.prototype.removeLeastRecently = function () {
  // The first element at the head of the list is the least recently used
  var deletedNode = this.cache.removeFirst();
  // Also don't forget to remove its key from the map
  var deletedKey = deletedNode.key;
  this.map.delete(deletedKey);
};
