import React, { useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  MarkerType,
  type Connection,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { 
    id: 'internet', 
    position: { x: 400, y: 0 }, 
    data: { label: 'Internet / External IPs' },
    style: { background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', width: 180 } 
  },
  { 
    id: 'firewall', 
    position: { x: 400, y: 100 }, 
    data: { label: 'WAF / SentinelGuard' },
    style: { background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', width: 180 } 
  },
  { 
    id: 'lb', 
    position: { x: 400, y: 200 }, 
    data: { label: 'Load Balancer' },
    style: { background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', width: 150 } 
  },
  { 
    id: 'server', 
    position: { x: 250, y: 300 }, 
    data: { label: 'Primary Backend' },
    style: { background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', width: 150 } 
  },
  { 
    id: 'server-backup', 
    position: { x: 550, y: 300 }, 
    data: { label: 'Backup Backend' },
    style: { background: '#059669', color: 'white', border: 'none', borderRadius: '8px', width: 150 } 
  },
  { 
    id: 'db', 
    position: { x: 250, y: 400 }, 
    data: { label: 'Database (Prisma)' },
    style: { background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', width: 150 } 
  },
  { 
    id: 'cloud-storage', 
    position: { x: 550, y: 400 }, 
    data: { label: 'Cloud Storage (S3)' },
    style: { background: '#ec4899', color: 'white', border: 'none', borderRadius: '8px', width: 150 } 
  },
  { 
    id: 'admin-pc', 
    position: { x: 100, y: 150 }, 
    data: { label: 'Admin Workstation' },
    style: { background: '#64748b', color: 'white', border: '1px solid #94a3b8', borderRadius: '8px', width: 140 } 
  },
  { 
    id: 'iot-gateway', 
    position: { x: 700, y: 150 }, 
    data: { label: 'IoT Gateway' },
    style: { background: '#f97316', color: 'white', border: 'none', borderRadius: '8px', width: 140 } 
  },
  { 
    id: 'honeytoken', 
    position: { x: 650, y: 220 }, 
    data: { label: 'Honeytoken Trap' },
    style: { background: '#f59e0b', color: 'black', border: '2px dashed #f59e0b', borderRadius: '8px', fontWeight: 'bold', width: 150 } 
  },
];

const initialEdges = [
  // External to Firewall
  { 
    id: 'e-ext-fw', 
    source: 'internet', 
    target: 'firewall', 
    animated: true, 
    style: { stroke: '#ef4444', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
  },
  // Firewall to Load Balancer
  { 
    id: 'e-fw-lb', 
    source: 'firewall', 
    target: 'lb', 
    animated: true,
    style: { stroke: '#3b82f6' },
  },
  // LB to Servers
  { 
    id: 'e-lb-srv1', 
    source: 'lb', 
    target: 'server', 
    style: { stroke: '#8b5cf6' },
  },
  { 
    id: 'e-lb-srv2', 
    source: 'lb', 
    target: 'server-backup', 
    style: { stroke: '#8b5cf6' },
  },
  // Servers to Data
  { 
    id: 'e-srv-db', 
    source: 'server', 
    target: 'db', 
    style: { stroke: '#10b981' },
  },
  { 
    id: 'e-srv2-cloud', 
    source: 'server-backup', 
    target: 'cloud-storage', 
    style: { stroke: '#059669' },
  },
  // Internal Network
  { 
    id: 'e-fw-admin', 
    source: 'firewall', 
    target: 'admin-pc', 
    style: { stroke: '#94a3b8', strokeDasharray: '4' },
    label: 'VPN Tunnel'
  },
  // IoT Network
  { 
    id: 'e-fw-iot', 
    source: 'firewall', 
    target: 'iot-gateway', 
    style: { stroke: '#f97316' },
  },
  // Deception
  { 
    id: 'e2-honey', 
    source: 'firewall', 
    target: 'honeytoken', 
    animated: true, 
    style: { stroke: '#f59e0b', strokeDasharray: '5,5' },
    label: 'Deception Route'
  },
];

export function ThreatMap({ activeIncidents = [] }: { activeIncidents?: any[] }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  React.useEffect(() => {
      // Check for Honeytoken incidents
      const honeytokenTriggered = activeIncidents.some(i => i.title.includes("Honeytoken"));
      
      setEdges((eds) => eds.map((e) => {
        if (e.id === 'e2-honey') {
          return {
            ...e,
            animated: true,
            style: { 
              ...e.style, 
              stroke: honeytokenTriggered ? '#ff0000' : '#f59e0b',
              strokeWidth: honeytokenTriggered ? 4 : 1
            },
            label: honeytokenTriggered ? '⚠️ INTRUSION DETECTED ⚠️' : 'Deception Route'
          };
        }
        return e;
      }));

      setNodes((nds) => nds.map((n) => {
        if (n.id === 'honeytoken') {
            return {
                ...n,
                style: {
                    ...n.style,
                    background: honeytokenTriggered ? '#ff0000' : '#f59e0b',
                    color: honeytokenTriggered ? 'white' : 'black',
                    boxShadow: honeytokenTriggered ? '0 0 20px #ff0000' : 'none'
                }
            }
        }
        return n;
      }));

  }, [activeIncidents, setEdges, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="h-[400px] w-full border border-gray-700 rounded-lg bg-gray-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background color="#374151" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
