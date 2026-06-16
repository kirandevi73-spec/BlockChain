import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { GraphNode, GraphEdge } from '@/services/api';

interface WalletGraphProps {
  className?: string;
  interactive?: boolean;
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  highlightPath?: string[]; // node IDs to highlight as shortest path
  highlightNodes?: string[]; // node IDs to highlight as general selection
  nodeClusters?: { [id: string]: number }; // map of node ID to cluster index
}

export function WalletGraph({ 
  className, 
  interactive = true, 
  nodes = [], 
  edges = [], 
  highlightPath = [],
  highlightNodes = [],
  nodeClusters = {}
}: WalletGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [positions, setPositions] = useState<{ [id: string]: { x: number, y: number } }>({});

  const riskColors = {
    low: 'hsl(142, 76%, 45%)',
    medium: 'hsl(38, 92%, 50%)',
    high: 'hsl(25, 95%, 53%)',
    critical: 'hsl(0, 84%, 60%)',
  };

  const clusterColors = [
    'hsl(280, 80%, 60%)', // Purple
    'hsl(200, 80%, 60%)', // Blue
    'hsl(160, 80%, 60%)', // Teal
    'hsl(120, 80%, 60%)', // Green
    'hsl(60, 80%, 60%)',  // Yellow
    'hsl(30, 80%, 60%)',  // Orange
    'hsl(0, 80%, 60%)',   // Red
    'hsl(320, 80%, 60%)', // Pink
    'hsl(240, 80%, 60%)', // Indigo
    'hsl(40, 80%, 60%)',  // Gold
  ];

  // Assign random positions to nodes if they don't have them yet (simple force layout alternative for static viewing)
  useEffect(() => {
    if (nodes.length > 0) {
      const newPos: { [id: string]: { x: number, y: number } } = {};
      const width = 800;
      const height = 400;
      nodes.forEach((n, i) => {
        // distribute them in a circle or roughly random
        const angle = (i / nodes.length) * 2 * Math.PI;
        const radius = Math.min(width, height) * 0.3 + Math.random() * 50;
        newPos[n.id] = {
          x: width / 2 + radius * Math.cos(angle),
          y: height / 2 + radius * Math.sin(angle)
        };
      });
      setPositions(newPos);
    }
  }, [nodes]);

  const handleWheel = (e: React.WheelEvent) => {
    if (!interactive) return;
    e.preventDefault();
    const newScale = Math.max(0.5, Math.min(2, scale - e.deltaY * 0.001));
    setScale(newScale);
  };

  if (nodes.length === 0) {
    return (
      <div className={cn('glass-card p-6 flex items-center justify-center h-[400px]', className)}>
        <p className="text-muted-foreground">No graph data available. Run an analysis first.</p>
      </div>
    );
  }

  return (
    <div className={cn('glass-card p-6 overflow-hidden', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Wallet Connection Graph
        </h3>
      </div>
      
      <div
        className="relative bg-background/50 rounded-lg overflow-hidden"
        style={{ height: '400px' }}
        onWheel={handleWheel}
      >
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{
            transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`,
            transformOrigin: 'center',
          }}
          viewBox="0 0 800 400"
        >
          {/* Edges */}
          <g>
            {edges.map((edge, index) => {
              const sourcePos = positions[edge.source];
              const targetPos = positions[edge.target];
              if (!sourcePos || !targetPos) return null;

              // Check if this edge is part of the highlighted path
              const isPathEdge = highlightPath.length > 1 && highlightPath.some((id, i) =>
                i < highlightPath.length - 1 &&
                ((id === edge.source && highlightPath[i + 1] === edge.target) ||
                  (id === edge.target && highlightPath[i + 1] === edge.source))
              );

              // Check if this edge is part of a flow highlight
              const isFlowEdge = highlightNodes.includes(edge.source) && highlightNodes.includes(edge.target);

              return (
                <line
                  key={`edge-${index}`}
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke={isPathEdge ? 'hsl(186, 100%, 60%)' : isFlowEdge ? 'hsl(186, 100%, 40%)' : 'hsl(222, 30%, 25%)'}
                  strokeWidth={isPathEdge ? 4 : isFlowEdge ? 3 : 2}
                  strokeOpacity={isPathEdge || isFlowEdge ? 1 : 0.6}
                  strokeDasharray={isFlowEdge ? "5,5" : "none"}
                  className="transition-all duration-300"
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g>
            {nodes.map((node) => {
              const pos = positions[node.id];
              if (!pos) return null;
              const isHovered = hoveredNode?.id === node.id;
              
              const isOnPath = highlightPath.includes(node.id);
              const isHighlighted = (highlightNodes || []).includes(node.id);
              const clusterId = (nodeClusters || {})[node.id];

              // Determine color priority: 
              // 1. Shortest Path (Cyan)
              // 2. Flow Trace (Darker Cyan)
              // 3. Detected Cluster (Cluster Palette)
              // 4. ML Suspicious (Red)
              // 5. Activity Level (Orange/Green)
              
              let color = node.degree > 5 ? riskColors.critical : node.degree > 2 ? riskColors.medium : riskColors.low;
              const isSuspicious = node.risk === 'high' || node.risk === 'critical' || node.degree > 10;

              if (isOnPath) {
                color = 'hsl(186, 100%, 60%)';
              } else if (isHighlighted) {
                color = 'hsl(186, 100%, 40%)';
              } else if (clusterId !== undefined) {
                color = clusterColors[clusterId % clusterColors.length];
              } else if (isSuspicious) {
                color = riskColors.critical;
              }

              return (
                <g
                  key={node.id}
                  className={cn(
                    "cursor-pointer transition-transform duration-200",
                    isSuspicious && !isOnPath && !isHighlighted && "animate-pulse"
                  )}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? 25 : 15}
                    fill={color}
                    opacity={0.2}
                    className="transition-all duration-300"
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? 15 : 10}
                    fill={color}
                    stroke="hsl(222, 47%, 10%)"
                    strokeWidth={2}
                    className="transition-all duration-300"
                  />
                  {isHovered && (
                    <text
                      x={pos.x}
                      y={pos.y + 25}
                      textAnchor="middle"
                      fill="hsl(210, 40%, 98%)"
                      fontSize={10}
                      fontFamily="JetBrains Mono, monospace"
                      className="animate-fade-in"
                    >
                      {node.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Tooltip */}
        {hoveredNode && positions[hoveredNode.id] && (
          <div
            className="absolute glass-card p-3 pointer-events-none animate-scale-in z-10"
            style={{
              left: Math.min(positions[hoveredNode.id].x * scale + 20, 700),
              top: Math.max(positions[hoveredNode.id].y * scale - 20, 20),
            }}
          >
            <p className="text-xs font-mono text-foreground">{hoveredNode.id}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Connections: <span className="font-medium text-foreground">{hoveredNode.degree}</span>
            </p>
          </div>
        )}

        {/* Zoom controls */}
        {interactive && (
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button
              onClick={() => setScale(Math.min(3, scale + 0.2))}
              className="glass-card h-8 w-8 flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
            >
              +
            </button>
            <button
              onClick={() => setScale(Math.max(0.5, scale - 0.2))}
              className="glass-card h-8 w-8 flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
            >
              −
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
