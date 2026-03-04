# Chess Openings Explorer

An interactive web application for exploring chess openings, built with React. Integrates the Lichess Master Games API to display real-time move statistics and uses a bundled ECO database for opening identification — all with near-instant navigation via multi-level caching.

## Features

- **Interactive Chessboard** — drag-and-drop piece movement with SVG arrow annotations showing suggested continuations
- **Live Opening Statistics** — win/draw/loss rates and move frequency pulled from the Lichess Master Games database
- **ECO Database** — 5.3MB local Encyclopedia of Chess Openings dataset enabling FEN-based opening name lookup across all major opening families
- **Move Tree Visualization** — branching tree of opening lines with BFS traversal and Immer-backed immutable state
- **Performance Caching** — two-level cache (in-memory position cache + 5-minute API response cache) with background prefetching for near-instant navigation
- **Featured Openings** — quick-select for Sicilian Defense, Queen's Gambit, King's Indian, Ruy Lopez, French Defense, and more
- **Additional Games** — Connect Four with full win detection, plus guides for Blackjack, Poker, and Checkers

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19, React Router 6 |
| Chess Engine | chess.js |
| Chessboard UI | react-chessboard |
| State Management | Immer |
| Styling | Tailwind CSS 4 |
| Data Source | Lichess Opening Explorer API |

## Getting Started

### Prerequisites

- Node.js >= 16
- npm

### Installation

```bash
git clone https://github.com/your-username/chess-openings.git
cd chess-openings
npm install
```

### Running Locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app hot-reloads on file changes.

### Building for Production

```bash
npm run build
```

Outputs an optimized, minified bundle to the `build/` directory.

### Running Tests

```bash
npm test
```

## Project Structure

```
src/
├── components/          # Shared UI components (Header, Sidebar)
├── pages/
│   ├── chess/           # Chess explorer — board, tree manager, ECO service, API layer
│   ├── connect4/        # Connect Four game logic and UI
│   ├── blackjack/       # Blackjack strategy guides
│   ├── poker/           # Poker guide
│   └── checkers/        # Checkers guide
└── data/                # ECO JSON datasets (ecoA–E + interpolated, ~5.3MB total)
```

## Architecture Notes

- **Opening Tree Manager** — custom tree data structure with BFS node lookup, Immer `produce` for immutable updates, and an observer pattern for React integration
- **Data Service** — separates Lichess API fetching from UI concerns; filters moves with < 0.1% frequency or < 2 master games to reduce noise
- **ECO Lookup** — five lazily-loaded JSON chunks are merged on first access and keyed by FEN for O(1) opening name resolution

## License

MIT
