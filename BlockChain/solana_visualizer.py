# === solana_visualizer.py ===
import matplotlib.pyplot as plt
import networkx as nx
import matplotlib.patches as mpatches

def visualize_solana_graph(graph, suspicious_nodes=[], center_node=None, hops=2):
    """
    Visualizes the Solana transaction graph with:
    - Red: Suspicious nodes
    - Gold: Center node
    - Skyblue: Normal nodes
    - Edge labels show amount + timestamp
    """

    if center_node and center_node in graph:
        print(f"\U0001F50D Visualizing Solana subgraph around: {center_node} (hops={hops})")
        subgraph = nx.ego_graph(graph, center_node, radius=hops, undirected=True)
    else:
        if center_node:
            print(f"\u26A0\ufe0f Warning: Center node '{center_node}' not found in graph.")
        print("\U0001F310 Falling back to full Solana graph visualization.")
        subgraph = graph
        center_node = None

    node_colors = []
    node_sizes = []
    for node in subgraph.nodes():
        if node == center_node:
            node_colors.append("gold")
            node_sizes.append(800)
        elif node in suspicious_nodes:
            node_colors.append("red")
            node_sizes.append(600)
        else:
            node_colors.append("skyblue")
            node_sizes.append(400)

    labels = {node: f"{node[:6]}...{node[-4:]}" for node in subgraph.nodes()}
    pos = nx.spring_layout(subgraph, seed=42, k=0.6)

    plt.figure(figsize=(16, 10))
    nx.draw_networkx_nodes(subgraph, pos, node_color=node_colors, node_size=node_sizes)
    nx.draw_networkx_edges(subgraph, pos, edge_color='gray', arrows=True)
    nx.draw_networkx_labels(subgraph, pos, labels=labels, font_size=8)

    edge_labels = {
        (u, v): f"{data.get('label', '')}\n{data.get('timestamp', '')}"
        for u, v, data in subgraph.edges(data=True)
    }
    nx.draw_networkx_edge_labels(subgraph, pos, edge_labels=edge_labels, font_size=8, font_color='darkgreen')

    legend_items = [
        mpatches.Patch(color='gold', label='Center Node'),
        mpatches.Patch(color='red', label='Suspicious Node'),
        mpatches.Patch(color='skyblue', label='Normal Node')
    ]
    plt.legend(handles=legend_items, loc='upper right', bbox_to_anchor=(1.15, 1), borderaxespad=0.5)

    plt.title("Solana Transaction Graph", fontsize=14)
    plt.axis("off")
    plt.tight_layout()
    plt.show()


# === solana_graph_builder.py ===
import networkx as nx

def build_solana_graph(transfers):
    graph = nx.DiGraph()
    summary = []

    for s, r, a, t in transfers:
        if s and r and float(a) > 0:
            graph.add_edge(s, r, label=f"{float(a):.6f} SOL", timestamp=t)
            summary.append((s, r, float(a), t))

    return graph, summary
