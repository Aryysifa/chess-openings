import React, { useRef, useEffect, useState, useMemo } from 'react';

export const OpeningsTree = ({
  currentPosition,
  possibleMoves,
  moveHistory,
  onSelectMove,
  loading,
  completeTree
}) => {
  const treeContainerRef = useRef(null);
  const [treeWidth, setTreeWidth] = useState(0);
  const [treeHeight, setTreeHeight] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (treeContainerRef.current) {
        setTreeWidth(treeContainerRef.current.clientWidth);
        setTreeHeight(treeContainerRef.current.clientHeight);
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Build the tree structure from the complete tree data
  const treeData = useMemo(() => {
    if (!completeTree) {
      return null;
    }

    // Initialize with root if no moves
    if (!completeTree.moves && moveHistory.length === 0) {
      return {
        nodes: [{
          id: 'root',
          moveSan: '',
          depth: 0,
          x: 0,
          y: 50,
          isHistory: true,
          isCurrentPosition: true,
          moves: [],
          totalGames: 0,
          winRate: 50
        }],
        edges: []
      };
    }

    // Find the current position in the tree
    let currentNode = completeTree;
    const historyPath = [completeTree];
    
    // Navigate to the current position using the path
    for (let i = 0; i < moveHistory.length; i++) {
      const move = moveHistory[i];
      if (currentNode.children && currentNode.children.has(move)) {
        currentNode = currentNode.children.get(move);
        historyPath.push(currentNode);
      }
    }

    // Build the visual tree starting from the root, showing the full path
    const buildVisualTree = () => {
      const nodes = [];
      const edges = [];
      const levelOffsets = new Map(); // Track y-offset for each depth level
      
      // Recursive function to process child nodes
      const processNodeChildren = (node, parentId, parentDepth, parentPath = []) => {
        if (!node || !node.moves || node.moves.length === 0) return;
        
        const depth = parentDepth + 1;
        if (!levelOffsets.has(depth)) {
          levelOffsets.set(depth, 0);
        }
        
        // Only show nodes within reasonable depth
        const maxDepthToShow = moveHistory.length + 2;
        if (depth > maxDepthToShow) return;
        
        node.moves.forEach((moveData) => {
          const nodeId = `${parentId}-${moveData.move}`;
          const yOffset = levelOffsets.get(depth);
          const isInHistory = depth <= moveHistory.length && moveHistory[depth - 1] === moveData.move;
          const isCurrentPos = depth === moveHistory.length && isInHistory;
          
          const fullPath = [...parentPath, moveData.move];
          
          nodes.push({
            id: nodeId,
            moveSan: moveData.move,
            name: moveData.name || '',
            depth: depth,
            x: 120 + (depth - 1) * 220,
            y: yOffset * 50 + 200,
            isHistory: isInHistory,
            isCurrentPosition: isCurrentPos,
            winRate: moveData.winRate || 50,
            totalGames: moveData.totalGames || 0,
            popularity: moveData.popularity || 0,
            fullPath: fullPath
          });
          
          edges.push({
            from: parentId,
            to: nodeId
          });
          
          levelOffsets.set(depth, yOffset + 1);
          
          // If this move is in history and has children, process them
          if (isInHistory && node.children && node.children.has(moveData.move)) {
            const childNode = node.children.get(moveData.move);
            processNodeChildren(childNode, nodeId, depth, fullPath);
          }
        });
      };
      
      // Calculate center Y for root node (will be updated after processing children)
      let rootY = 200;
      
      // Add root node placeholder (Y will be updated later)
      nodes.push({
        id: 'root',
        moveSan: '',
        depth: 0,
        x: 0,
        y: rootY,
        isHistory: true,
        isCurrentPosition: moveHistory.length === 0,
        moves: completeTree.moves || [],
        totalGames: 0,
        winRate: 50
      });
      
      // Process moves from root
      if (completeTree.moves && completeTree.moves.length > 0) {
        levelOffsets.set(1, 0);
        
        // Calculate base Y position to center the tree vertically
        const baseY = 200; // Start further down to center in viewport
        
        completeTree.moves.forEach((moveData, index) => {
          const nodeId = `root-${moveData.move}`;
          const yOffset = levelOffsets.get(1);
          const isInHistory = moveHistory.length > 0 && moveHistory[0] === moveData.move;
          const isCurrentPos = moveHistory.length === 1 && moveHistory[0] === moveData.move;
          
          nodes.push({
            id: nodeId,
            moveSan: moveData.move,
            name: moveData.name || '',
            depth: 1,
            x: 120,
            y: yOffset * 50 + baseY,
            isHistory: isInHistory,
            isCurrentPosition: isCurrentPos,
            winRate: moveData.winRate || 50,
            totalGames: moveData.totalGames || 0,
            popularity: moveData.popularity || 0,
            fullPath: [moveData.move]
          });
          
          edges.push({
            from: 'root',
            to: nodeId
          });
          
          levelOffsets.set(1, yOffset + 1);
          
          // If this move is in history, process its children
          if (isInHistory && completeTree.children && completeTree.children.has(moveData.move)) {
            const childNode = completeTree.children.get(moveData.move);
            processNodeChildren(childNode, nodeId, 1, [moveData.move]);
          }
        });
        
        // After processing all first-level children, center the root node
        const firstLevelNodes = nodes.filter(n => n.depth === 1);
        if (firstLevelNodes.length > 0) {
          const minY = Math.min(...firstLevelNodes.map(n => n.y));
          const maxY = Math.max(...firstLevelNodes.map(n => n.y));
          const centerY = (minY + maxY) / 2;
          
          // Update root node Y position to be centered among children
          const rootNode = nodes.find(n => n.id === 'root');
          if (rootNode) {
            rootNode.y = centerY;
          }
        }
      }
      
      return { nodes, edges };
    };

    return buildVisualTree();
  }, [completeTree, moveHistory, possibleMoves]);

  // Auto-scroll to current position with smooth animation
  useEffect(() => {
    if (treeContainerRef.current && treeData && treeData.nodes.length > 0) {
      const currentNode = treeData.nodes.find(n => n.isCurrentPosition);
      
      if (currentNode) {
        // Use setTimeout to ensure DOM is fully rendered
        setTimeout(() => {
          const container = treeContainerRef.current;
          if (!container) return;
          
          // Calculate target scroll position
          // Keep some padding on the left and show upcoming moves
          const paddingLeft = Math.min(treeWidth * 0.2, 200);
          const targetX = Math.max(0, currentNode.x - paddingLeft);
          
          // Center vertically with some padding
          const targetY = Math.max(0, currentNode.y - treeHeight / 2 + 20);
          
          console.log('Scrolling to:', {
            currentNode: { id: currentNode.id, x: currentNode.x, depth: currentNode.depth },
            targetX,
            targetY,
            containerScrollWidth: container.scrollWidth,
            containerClientWidth: container.clientWidth,
            svgWidth: container.querySelector('svg')?.getBoundingClientRect().width
          });
          
          // Use scrollTo for better browser support
          container.scrollTo({
            left: targetX,
            top: targetY,
            behavior: 'smooth'
          });
        }, 50);
      }
    }
  }, [treeData, treeWidth, treeHeight, moveHistory]);

  if (!treeData) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="text-gray-400">Loading opening tree...</div>
      </div>
    );
  }

  const { nodes, edges } = treeData;
  
  // Calculate SVG dimensions
  const maxX = Math.max(...nodes.map(n => n.x)) + 400;
  const maxY = Math.max(...nodes.map(n => n.y)) + 200;
  const svgWidth = Math.max(maxX, treeWidth);
  const svgHeight = Math.max(maxY, treeHeight);

  // Render a node
  const renderNode = (node) => {
    const nodeWidth = 200;
    const nodeHeight = 40;
    
    // Root node (starting position)
    if (node.depth === 0) {
      return (
        <g key={node.id}>
          <circle
            cx={node.x + 15}
            cy={node.y + nodeHeight / 2}
            r={8}
            fill="#8b5cf6"
            stroke="#a78bfa"
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
      if (node.isCurrentPosition) return "#6366f1"; // Indigo for current position
      if (node.isHistory) return "#404040"; // Darker gray for history
      if (node.isFutureMove) return "#2d2d2d"; // Dark gray for possible moves
      return "#1f1f1f"; // Default dark
    };

    const getBorderColor = () => {
      if (node.isCurrentPosition) return "#818cf8";
      if (node.isHistory) return "#8b5cf6";
      if (node.isFutureMove) return "#4b5563";
      return "#333333";
    };

    // Calculate sections
    const moveWidth = 55;
    const statsWidth = 55;

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
          onClick={() => onSelectMove(node.fullPath || [node.moveSan])}
        />

        {/* Move notation */}
        <rect
          x={node.x}
          y={node.y}
          width={moveWidth}
          height={nodeHeight}
          fill="rgba(0,0,0,0.3)"
          rx={4}
        />
        <text
          x={node.x + moveWidth / 2}
          y={node.y + nodeHeight / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ffffff"
          fontSize="14"
          fontWeight="bold"
          style={{ cursor: 'pointer', userSelect: 'none', pointerEvents: 'none' }}
        >
          {node.moveSan}
        </text>

        {/* Opening name */}
        <text
          x={node.x + moveWidth + 10}
          y={node.y + nodeHeight / 2}
          textAnchor="start"
          dominantBaseline="middle"
          fill="#e0e0e0"
          fontSize="12"
          style={{ cursor: 'pointer', userSelect: 'none', pointerEvents: 'none' }}
        >
          {node.name && node.name.length > 20 
            ? node.name.substring(0, 20) + '...' 
            : node.name || ''}
        </text>

        {/* Win rate */}
        <rect
          x={node.x + nodeWidth - statsWidth}
          y={node.y}
          width={statsWidth}
          height={nodeHeight}
          fill={node.winRate > 52 ? 'rgba(34, 197, 94, 0.2)' : 
                node.winRate < 48 ? 'rgba(239, 68, 68, 0.2)' : 
                'rgba(100, 116, 139, 0.2)'}
          rx={4}
        />
        <text
          x={node.x + nodeWidth - statsWidth / 2}
          y={node.y + nodeHeight / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={node.winRate > 52 ? '#86efac' : 
                node.winRate < 48 ? '#fca5a5' : 
                '#e0e0e0'}
          fontSize="13"
          fontWeight="bold"
          style={{ cursor: 'pointer', userSelect: 'none', pointerEvents: 'none' }}
        >
          {Math.round(node.winRate)}%
        </text>

        {/* Games count (below win rate) */}
        {node.totalGames > 0 && (
          <text
            x={node.x + nodeWidth - statsWidth / 2}
            y={node.y + nodeHeight - 5}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#9ca3af"
            fontSize="10"
            style={{ cursor: 'pointer', userSelect: 'none', pointerEvents: 'none' }}
          >
            {node.totalGames > 1000000 
              ? `${(node.totalGames / 1000000).toFixed(1)}M` 
              : node.totalGames > 1000 
              ? `${Math.round(node.totalGames / 1000)}k` 
              : node.totalGames}
          </text>
        )}
      </g>
    );
  };

  // Render edges
  const renderEdge = (edge) => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);
    
    if (!fromNode || !toNode) return null;

    const nodeWidth = 200;
    const nodeHeight = 40;
    
    const startX = fromNode.depth === 0 ? fromNode.x + 30 : fromNode.x + nodeWidth;
    const startY = fromNode.y + nodeHeight / 2;
    const endX = toNode.x;
    const endY = toNode.y + nodeHeight / 2;
    
    // Create a simple horizontal line with optional gentle curve
    return (
      <line
        key={`${edge.from}-${edge.to}`}
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={toNode.isHistory ? "#8b5cf6" : 
                toNode.isFutureMove ? "#4b5563" : 
                "#404040"}
        strokeWidth={toNode.isHistory ? 2 : 1}
        opacity={toNode.isFutureMove ? 0.6 : 1}
      />
    );
  };

  return (
    <div 
      ref={treeContainerRef}
      className="w-full h-full relative"
      style={{ 
        backgroundColor: '#1a1a1a',
        overflow: 'auto',
        overflowX: 'auto',
        overflowY: 'auto'
      }}
    >
      <svg
        width={svgWidth}
        height={svgHeight}
        style={{ display: 'block', flexShrink: 0 }}
      >
        {/* Render edges first (so they appear behind nodes) */}
        <g>
          {edges.map(edge => renderEdge(edge))}
        </g>
        
        {/* Render nodes */}
        <g>
          {nodes.map(node => renderNode(node))}
        </g>
      </svg>
      
      {/* Loading indicator */}
      {loading && (
        <div className="absolute top-4 right-4 bg-gray-800 px-3 py-1 rounded text-sm text-gray-300">
          Loading moves...
        </div>
      )}
    </div>
  );
};