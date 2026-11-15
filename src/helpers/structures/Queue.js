export class Queue extends Array {
  enqueue(value) {
    this.push(value);
  }

  dequeue() {
    return this.shift();
  }

  peek() {
    return this[0];
  }

  isEmpty() {
    return this.length === 0;
  }

  size() {
    return this.length;
  }

  print() {
    console.log([...this]);
  }
}