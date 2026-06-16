# === eth_visualizer.py ===
import matplotlib.pyplot as plt
import networkx as nx
import matplotlib.patches as mpatches

def visualize_eth_graph(graph, suspicious_nodes=None, center_node=None, hops=2):
    if center_node:
        nodes = set([center_node])
        for _ in range(hops):
            new_nodes = set()
            for node in nodes:
                new_nodes.update(graph.successors(node))
                new_nodes.update(graph.predecessors(node))
            nodes.update(new_nodes)
        subgraph = graph.subgraph(nodes).copy()
    else:
        subgraph = graph.copy()

    pos = nx.spring_layout(subgraph, k=0.5, seed=42)
    plt.figure(figsize=(14, 8))

    node_colors = []
    for node in subgraph.nodes:
        if node == center_node:
            node_colors.append("yellow")
        elif suspicious_nodes and node in suspicious_nodes:
            node_colors.append("red")
        else:
            node_colors.append("skyblue")

    nx.draw_networkx_nodes(subgraph, pos, node_color=node_colors, node_size=800)
    labels = {n: f"{n[:6]}...{n[-4:]}" for n in subgraph.nodes}
    nx.draw_networkx_labels(subgraph, pos, labels, font_size=9)
    nx.draw_networkx_edges(subgraph, pos, arrows=True, arrowstyle="->", width=1.2)

    edge_labels = {
        (u, v): f"{d.get('label', '')}\n{d.get('timestamp', '')}"
        for u, v, d in subgraph.edges(data=True)
    }
    nx.draw_networkx_edge_labels(subgraph, pos, edge_labels=edge_labels, font_size=8)

    legend_items = [
        mpatches.Patch(color='yellow', label='Center Node'),
        mpatches.Patch(color='red', label='Suspicious Node'),
        mpatches.Patch(color='skyblue', label='Normal Node')
    ]
    plt.legend(handles=legend_items, loc='upper left', bbox_to_anchor=(1.02, 1.0), borderaxespad=0.5)

    plt.title("Ethereum Transaction Graph", fontsize=14)
    plt.axis("off")
    plt.tight_layout()
    plt.show()
