import { produce } from 'immer';

/**
 * Manages the chess opening tree, caching, and memory management.
 * Decouples data logic from UI for better scalability and testability.
 */
export class OpeningTreeManager {
  constructor() {
    this.root = null; // Root node of the tree
    this.cache = new Map(); // FEN -> moves[]
    this.subscribers = new Set(); // For React integration
  }

  /**
   * Subscribe to tree updates (for React integration)
   * @param {Function} callback
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Notify all subscribers
   */
  notify() {
    for (const cb of this.subscribers) cb(this.root);
  }

  /**
   * Get the node for a given FEN (or null)
   */
  getNode(fen) {
    if (!this.root) return null;
    let node = this.root;
    if (node.fen === fen) return node;
    // BFS to find node by FEN
    const queue = [node];
    while (queue.length) {
      const curr = queue.shift();
      if (curr.fen === fen) return curr;
      for (const child of curr.children.values()) {
        queue.push(child);
      }
    }
    return null;
  }

  /**
   * Add moves for a given FEN, creating nodes as needed
   */
  addMoves(fen, moves, moveHistory = []) {
    this.root = produce(this.root, draft => {
      if (!draft) {
        // Initialize root
        draft = {
          fen,
          moves,
          children: new Map(),
          depth: 0,
          moveSan: null,
          path: []
        };
        return draft;
      }
      let node = draft;
      const tempPath = [];
      // Traverse using moveHistory
      for (const moveSan of moveHistory) {
        tempPath.push(moveSan);
        if (!node.children.has(moveSan)) {
          node.children.set(moveSan, {
            fen: null, // Will be set when moves are added for this node
            moves: [],
            children: new Map(),
            depth: node.depth + 1,
            moveSan,
            path: [...node.path, moveSan]
          });
        }
        node = node.children.get(moveSan);
      }
      // Update node
      node.fen = fen;
      node.moves = moves;
    });
    this.cache.set(fen, moves);
    this.notify();
  }

  /**
   * Traverse the tree using a move history, return the node at the end
   */
  traverse(moveHistory) {
    if (!this.root) return null;
    let node = this.root;
    for (const moveSan of moveHistory) {
      if (!node.children.has(moveSan)) return node;
      node = node.children.get(moveSan);
    }
    return node;
  }

  /**
   * Prune the tree except for the current path
   */
  prune(moveHistory) {
    if (!this.root) return;
    this.root = produce(this.root, draft => {
      let node = draft;
      for (const moveSan of moveHistory) {
        for (const key of node.children.keys()) {
          if (key !== moveSan) node.children.delete(key);
        }
        if (!node.children.has(moveSan)) break;
        node = node.children.get(moveSan);
      }
      // Remove all children from the last node
      node.children = new Map();
    });
    this.notify();
  }

  /**
   * Pre-fetch and expand likely next moves in the background
   * (Stub: implement as needed)
   */
  async prefetchNextMoves(moveHistory, fetcher) {
    const node = this.traverse(moveHistory);
    if (!node || !node.moves) return;
    for (const move of node.moves) {
      // Use fetcher(fen) to get moves for the next position
      // This is a stub for background expansion
      // await fetcher(nextFen);
    }
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
   * Set the root of the tree (for real data integration)
   * @param {Object} newRoot - The new root node
   */
  setRoot(newRoot) {
    this.root = newRoot;
    this.notify();
  }
}

export default OpeningTreeManager; 