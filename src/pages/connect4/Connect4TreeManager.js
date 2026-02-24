/**
 * Manages the Connect4 game tree, caching, and memory management.
 */
export class Connect4TreeManager {
  constructor() {
    this.root = null;
    this.cache = new Map(); // position -> moves[]
    this.subscribers = new Set();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    for (const cb of this.subscribers) cb(this.root);
  }

  /**
   * Add moves for a given position
   */
  addMoves(position, moves, moveHistory = []) {
    if (!this.root) {
      // Initialize root
      this.root = {
        position,
        moves,
        children: new Map(),
        depth: 0,
        column: null,
        path: []
      };
    } else {
      let node = this.root;
      // Traverse using moveHistory
      for (const col of moveHistory) {
        if (!node.children.has(col)) {
          node.children.set(col, {
            position: null,
            moves: [],
            children: new Map(),
            depth: node.depth + 1,
            column: col,
            path: [...node.path, col]
          });
        }
        node = node.children.get(col);
      }
      // Update node
      node.position = position;
      node.moves = moves;
    }

    this.cache.set(position, moves);
    this.notify();
  }

  /**
   * Traverse the tree using a move history
   */
  traverse(moveHistory) {
    if (!this.root) return null;
    let node = this.root;
    for (const col of moveHistory) {
      if (!node.children.has(col)) return node;
      node = node.children.get(col);
    }
    return node;
  }

  /**
   * Clear the tree and cache
   */
  reset() {
    this.root = null;
    this.cache.clear();
    this.notify();
  }

  /**
   * Set the root of the tree
   */
  setRoot(newRoot) {
    this.root = newRoot;
    this.notify();
  }
}

export default Connect4TreeManager;
