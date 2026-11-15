import { Queue } from "./Queue.js";

export class Graph {
  constructor() {
    this.nodes = [];
    this.adjList = {};
  }

  addNode(node) {
    if (!this.searchNode(node)) {
      this.nodes.push(node);
      this.adjList[node] = [];
    }
  }

  addEdge(node1, node2) {
    if (!this.searchNode(node1) || !this.searchNode(node2) || node1 === node2) return;
    if (this.adjList[node1].includes(node2)) return;
    this.adjList[node1].push(node2);
    this.adjList[node2].push(node1);
  }

  removeEdge(node1, node2) {
    if (!this.searchNode(node1) || !this.searchNode(node2)) return;
    this.adjList[node1] = this.adjList[node1].filter((n) => n !== node2);
    this.adjList[node2] = this.adjList[node2].filter((n) => n !== node1);
  }

  searchNode(node) {
    if (!this.nodes.length) return;
    return this.nodes.find((n) => n === node);
  }

  removeNode(node) {
    if (!this.searchNode(node)) return;
    this.adjList[node].forEach((neighbor) => {
      this.adjList[neighbor] = this.adjList[neighbor].filter((n) => n !== node);
    });
    delete this.adjList[node];
    this.nodes = this.nodes.filter((n) => n !== node);
  }

  isEmpty() {
    return this.nodes.length === 0;
  }

  getNeighbors(node) {
    return this.adjList[node] ?? [];
  }

  bfs(start, maxDepth = Infinity) {
    const distances = new Map();
    if (!this.searchNode(start)) return distances;

    const queue = new Queue();
    queue.enqueue(start);
    distances.set(start, 0);

    while (!queue.isEmpty()) {
      const current = queue.dequeue();
      const depth = distances.get(current);
      if (depth === maxDepth) continue;

      for (const neighbor of this.adjList[current]) {
        if (!distances.has(neighbor)) {
          distances.set(neighbor, depth + 1);
          queue.enqueue(neighbor);
        }
      }
    }
    return distances;
  }

  mutualFriends(node1, node2) {
    const friends = new Set(this.getNeighbors(node1));
    return this.getNeighbors(node2).filter((n) => friends.has(n));
  }

  suggestFriends(node, limit = 5) {
    const distances = this.bfs(node, 2);
    const suggestions = [];

    distances.forEach((distance, candidate) => {
      if (distance === 2) {
        suggestions.push({ id: candidate, mutual: this.mutualFriends(node, candidate).length });
      }
    });

    return suggestions.sort((a, b) => b.mutual - a.mutual).slice(0, limit);
  }

  printAdjacency(node) {
    if (this.searchNode(node)) {
      console.log(this.adjList[node]);
    }
  }

  printGraph() {
    console.log(this.adjList);
  }
}