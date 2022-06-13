/* This file contains class implementations 
of the Stack & Queue abstract data types */

export class Stack {
  value: any[]
  constructor(value?: any[]) {
    this.value = value?.reverse() || [];
  }
  push(item: any) {
    this.value.unshift(item)
  }
  pop() {
    return this.value.shift();
  }
  isEmpty() {
    return this.value.length == 0 ? true : false;
  }
}

export class Queue {
  value: any[]
  constructor(value?: any[]) {
    this.value = value ||[];
  }
  enqueue(item: any) {
    return this.value.push(item);
  }
  dequeue() {
    return this.value.shift();
  }
  isEmpty() {
    return this.value.length == 0 ? true : false;
  }
}