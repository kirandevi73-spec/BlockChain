# === btc_visualizer.py ===
import matplotlib.pyplot as plt
import networkx as nx
import streamlit as st

def visualize_btc_graph(graph, suspicious_nodes, center_node=None, hops=2):
    st.subheader("📊 BTC Transaction Graph")

    # Subgraph around center_node if provided
    if center_node and center_node in graph:
        nodes_to_include = set([center_node])
        for _ in range(hops):
            neighbors = set()
            for node in nodes_to_include:
                neighbors.update(graph.predecessors(node))
                neighbors.update(graph.successors(node))
            nodes_to_include.update(neighbors)
        subgraph = graph.subgraph(nodes_to_include)
    else:
        subgraph = graph

    pos = nx.spring_layout(subgraph)
    fig, ax = plt.subplots(figsize=(10, 6))

    nx.draw(subgraph, pos, ax=ax, with_labels=True, node_color='lightblue', edge_color='gray', node_size=1500, font_size=8)
    nx.draw_networkx_nodes(subgraph, pos, nodelist=suspicious_nodes, node_color='red', node_size=1600)
    edge_labels = nx.get_edge_attributes(subgraph, 'label')
    nx.draw_networkx_edge_labels(subgraph, pos, edge_labels=edge_labels, font_size=6)

    st.pyplot(fig)
