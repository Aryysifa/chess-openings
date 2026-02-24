import React, { useRef, useEffect, useMemo } from 'react';

export const Connect4Tree = ({
  moveHistory,
  onSelectMove,
  completeTree
}) => {
  const treeContainerRef = useRef(null);

  // Build the tree structure from the complete tree data
  const treeData = useMemo(() => {
    if (!completeTree) {
      return null;
    }

    // Calculate max allowed height
    const maxAllowedHeight = Math.min(window.innerHeight - 200, 600);

    // Initialize with root if no moves
    if (!completeTree.moves && moveHistory.length === 0) {
      return {
        nodes: [{
          id: 'root',
          column: -1,
          depth: 0,
          x: 0,
          y: 50,
          isHistory: true,
          isCurrentPosition: true,
          score: 0
        }],
        edges: []
      };
    }

    // Find the current position in the tree
    let currentNode = completeTree;

    // Navigate to the current position using the path
    for (let i = 0; i < moveHistory.length; i++) {
      const col = moveHistory[i];
      if (currentNode.children && currentNode.children.has(col)) {
        currentNode = currentNode.children.get(col);
      }
    }

    // Build the visual tree starting from the root
    const buildVisualTree = () => {
      const nodes = [];
      const edges = [];

      // Recursive function to process child nodes
      const processNodeChildren = (node, parentId, parentDepth, parentPath = []) => {
        if (!node || !node.moves || node.moves.length === 0) return;

        const depth = parentDepth + 1;

        // Only show nodes within reasonable depth
        const maxDepthToShow = moveHistory.length + 2;
        if (depth > maxDepthToShow) return;

        // Calculate spacing
        const totalChildMoves = node.moves.length;
        const availableHeight = maxAllowedHeight - 100;
        const nodeSpacing = Math.min(50, availableHeight / (totalChildMoves + 1));
        const startY = (maxAllowedHeight - (totalChildMoves - 1) * nodeSpacing) / 2;

        node.moves.forEach((moveData, index) => {
          const nodeId = `${parentId}-${moveData.column}`;
          const isInHistory = depth <= moveHistory.length && moveHistory[depth - 1] === moveData.column;
          const isCurrentPos = depth === moveHistory.length && isInHistory;

          const fullPath = [...parentPath, moveData.column];

          nodes.push({
            id: nodeId,
            column: moveData.column,
            player: moveData.player,
            depth: depth,
            x: 120 + (depth - 1) * 250,
            y: startY + index * nodeSpacing,
            isHistory: isInHistory,
            isCurrentPosition: isCurrentPos,
            score: moveData.score || 0,
            explanation: moveData.explanation || '',
            fullPath: fullPath
          });

          edges.push({
            from: parentId,
            to: nodeId
          });

          // If this move is in history and has children, process them
          if (isInHistory && node.children && node.children.has(moveData.column)) {
            const childNode = node.children.get(moveData.column);
            processNodeChildren(childNode, nodeId, depth, fullPath);
          }
        });
      };

      let rootY = 100;

      // Add root node
      nodes.push({
        id: 'root',
        column: -1,
        depth: 0,
        x: 0,
        y: rootY,
        isHistory: true,
        isCurrentPosition: moveHistory.length === 0,
        moves: completeTree.moves || [],
        score: 0
      });

      // Process moves from root
      if (completeTree.moves && completeTree.moves.length > 0) {
        const availableHeight = maxAllowedHeight - 100;
        const totalMoves = completeTree.moves.length;
        const nodeSpacing = Math.min(50, availableHeight / (totalMoves + 1));
        const startY = (maxAllowedHeight - (totalMoves - 1) * nodeSpacing) / 2;

        completeTree.moves.forEach((moveData, index) => {
          const nodeId = `root-${moveData.column}`;
          const isInHistory = moveHistory.length > 0 && moveHistory[0] === moveData.column;
          const isCurrentPos = moveHistory.length === 1 && moveHistory[0] === moveData.column;

          nodes.push({
            id: nodeId,
            column: moveData.column,
            player: moveData.player,
            depth: 1,
            x: 120,
            y: startY + index * nodeSpacing,
            isHistory: isInHistory,
            isCurrentPosition: isCurrentPos,
            score: moveData.score || 0,
            explanation: moveData.explanation || '',
            fullPath: [moveData.column]
          });

          edges.push({
            from: 'root',
            to: nodeId
          });

          // If this move is in history, process its children
          if (isInHistory && completeTree.children && completeTree.children.has(moveData.column)) {
            const childNode = completeTree.children.get(moveData.column);
            processNodeChildren(childNode, nodeId, 1, [moveData.column]);
          }
        });

        // Center root node
        const firstLevelNodes = nodes.filter(n => n.depth === 1);
        if (firstLevelNodes.length > 0) {
          const minY = Math.min(...firstLevelNodes.map(n => n.y));
          const maxY = Math.max(...firstLevelNodes.map(n => n.y));
          const centerY = (minY + maxY) / 2;

          const rootNode = nodes.find(n => n.id === 'root');
          if (rootNode) {
            rootNode.y = centerY;
          }
        }
      }

      // Calculate SVG dimensions
      const maxX = Math.max(...nodes.map(n => n.x)) + 400;
      const svgWidth = Math.max(maxX, 800);
      const maxY = nodes.length > 0 ? Math.max(...nodes.map(n => n.y)) : 0;
      const svgHeight = Math.max(maxY + 100, 200);

      return { nodes, edges, svgWidth, svgHeight };
    };

    return buildVisualTree();
  }, [completeTree, moveHistory]);

  // Auto-scroll to current position
  useEffect(() => {
    if (treeContainerRef.current && treeData && treeData.nodes.length > 0) {
      const currentNode = treeData.nodes.find(n => n.isCurrentPosition);

      if (currentNode) {
        setTimeout(() => {
          const container = treeContainerRef.current;
          if (!container) return;

          const paddingLeft = 200;
          const targetX = Math.max(0, currentNode.x - paddingLeft);
          const targetY = Math.max(0, currentNode.y - 200);

          container.scrollTo({
            left: targetX,
            top: targetY,
            behavior: 'smooth'
          });
        }, 50);
      }
    }
  }, [treeData, moveHistory]);

  if (!treeData) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a1a'
      }}>
        <div style={{ color: '#888' }}>Loading game tree...</div>
      </div>
    );
  }

  const { nodes, edges, svgWidth, svgHeight } = treeData;

  // Render a node
  const renderNode = (node) => {
    const nodeWidth = 220;
    const nodeHeight = 45;

    // Root node (starting position)
    if (node.depth === 0) {
      return (
        <g key={node.id}>
          <circle
            cx={node.x + 15}
            cy={node.y + nodeHeight / 2}
            r={8}
            fill="#e74c3c"
            stroke="#c0392b"
            strokeWidth={2}
          />
          <text
            x={node.x + 30}
            y={node.y + nodeHeight / 2 + 5}
            fill="#e0e0e0"
            fontSize="14"
            fontWeight="bold"
          >
            Start
          </text>
        </g>
      );
    }

    const getBgColor = () => {
      if (node.isCurrentPosition) return node.player === 1 ? '#c0392b' : '#d68910';
      if (node.isHistory) return '#404040';
      return '#1f1f1f';
    };

    const getBorderColor = () => {
      if (node.isCurrentPosition) return node.player === 1 ? '#e74c3c' : '#f1c40f';
      if (node.isHistory) return '#555';
      return '#333';
    };

    const getScoreColor = () => {
      if (node.score > 0) return '#86efac'; // Green for winning
      if (node.score < 0) return '#fca5a5'; // Red for losing
      return '#e0e0e0'; // Gray for draw
    };

    const columnWidth = 65;
    const scoreWidth = 60;

    return (
      <g key={node.id}>
        {/* Main rectangle */}
        <rect
          x={node.x}
          y={node.y}
          width={nodeWidth}
          height={nodeHeight}
          fill={getBgColor()}
          stroke={getBorderColor()}
          strokeWidth={node.isHistory || node.isCurrentPosition ? 2 : 1}
          rx={4}
          style={{ cursor: 'pointer' }}
          onMouseEnter={(e) => {
            e.target.style.filter = 'brightness(1.25)';
            e.target.style.transition = 'filter 0.2s ease';
          }}
          onMouseLeave={(e) => {
            e.target.style.filter = 'brightness(1)';
          }}
          onClick={() => onSelectMove(node.fullPath || [node.column])}
        />

        {/* Column notation */}
        <rect
          x={node.x}
          y={node.y}
          width={columnWidth}
          height={nodeHeight}
          fill="rgba(0,0,0,0.3)"
          rx={4}
        />
        <text
          x={node.x + columnWidth / 2}
          y={node.y + nodeHeight / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ffffff"
          fontSize="15"
          fontWeight="bold"
          style={{ cursor: 'pointer', userSelect: 'none', pointerEvents: 'none' }}
        >
          Col {node.column + 1}
        </text>

        {/* Player indicator circle */}
        <circle
          cx={node.x + columnWidth + 20}
          cy={node.y + nodeHeight / 2}
          r={8}
          fill={node.player === 1 ? '#e74c3c' : '#f1c40f'}
          style={{ pointerEvents: 'none' }}
        />

        {/* Score */}
        <rect
          x={node.x + nodeWidth - scoreWidth}
          y={node.y}
          width={scoreWidth}
          height={nodeHeight}
          fill={node.score > 0 ? 'rgba(34, 197, 94, 0.2)' :
                node.score < 0 ? 'rgba(239, 68, 68, 0.2)' :
                'rgba(100, 116, 139, 0.2)'}
          rx={4}
        />
        <text
          x={node.x + nodeWidth - scoreWidth / 2}
          y={node.y + nodeHeight / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={getScoreColor()}
          fontSize="13"
          fontWeight="bold"
          style={{ cursor: 'pointer', userSelect: 'none', pointerEvents: 'none' }}
        >
          {node.score > 0 ? `+${node.score}` : node.score}
        </text>
      </g>
    );
  };

  // Render edges
  const renderEdge = (edge) => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);

    if (!fromNode || !toNode) return null;

    const nodeWidth = 220;
    const nodeHeight = 45;

    const startX = fromNode.depth === 0 ? fromNode.x + 30 : fromNode.x + nodeWidth;
    const startY = fromNode.y + nodeHeight / 2;
    const endX = toNode.x;
    const endY = toNode.y + nodeHeight / 2;

    return (
      <line
        key={`${edge.from}-${edge.to}`}
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={toNode.isHistory ? '#666' : '#404040'}
        strokeWidth={toNode.isHistory ? 2 : 1}
        opacity={0.8}
      />
    );
  };

  return (
    <div
      ref={treeContainerRef}
      style={{
        maxHeight: '600px',
        overflow: 'auto',
        position: 'relative',
        backgroundColor: '#1a1a1a',
        borderRadius: '8px',
        border: '1px solid #333'
      }}
    >
      <svg
        width={svgWidth}
        height={svgHeight}
        style={{ display: 'block', backgroundColor: '#1a1a1a' }}
      >
        {/* Render edges first */}
        <g>
          {edges.map(edge => renderEdge(edge))}
        </g>

        {/* Render nodes */}
        <g>
          {nodes.map(node => renderNode(node))}
        </g>
      </svg>
    </div>
  );
};
