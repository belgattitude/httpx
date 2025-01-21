export class DoublyLinkedList<TNode> {
  private head: TNode | null;
  private tail: TNode | null;

  constructor() {
    this.head = null;
    this.tail = null;
  }

  insertAtHead = (node: TNode) => {
    if (this.head) {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    } else {
      this.head = node;
      this.tail = node;
    }
  };

  insertAtTail = (node: TNode) => {
    if (this.tail) {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    } else {
      this.head = node;
      this.tail = node;
    }
  };

  removeAtHead = (): TNode | null => {
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

  removeAtTail = (): TNode | null => {
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

  removeNode = (node: TNode): void => {
    if (node === this.head) return this.removeAtHead();
    if (node === this.tail) return this.removeAtTail();
    node.prev.next = node.next;
    node.next.prev = node.prev;
  };

  promoteNode = function (node: TNode): void {
    this.removeNode(node);
    this.insertAtHead(node);
  };
}
