# === visualizer.py ===
import networkx as nx
from pyvis.network import Network
import tempfile
import streamlit.components.v1 as components

def plot_graph(graph, dark_mode=False, suspicious_nodes=None):
    """
    Generate and display an interactive PyVis graph inside Streamlit.
    """
    if graph is None or not isinstance(graph, nx.Graph):
        return None

    if suspicious_nodes is None:
        suspicious_nodes = []

    net = Network(
        height="600px",
        width="100%",
        bgcolor="#0e1117" if dark_mode else "#ffffff",
        font_color="#f0f2f6" if dark_mode else "#000000",
        directed=True
    )

    for node in graph.nodes():
        label = str(node)
        degree = graph.degree[node]
        tx_count = graph.nodes[node].get("tx_count", "N/A")
        reason = graph.nodes[node].get("reason", "Unknown")

        title = f"<b>Node:</b> {label}<br><b>Degree:</b> {degree}<br><b>Tx Count:</b> {tx_count}<br><b>Reason:</b> {reason}"
        color = "red" if node in suspicious_nodes else ("#00ffe7" if dark_mode else "#007cf0")

        net.add_node(
            n_id=node,
            label=label,
            title=title,
            color=color,
            shape="dot",
            size=20 if node in suspicious_nodes else 10
        )

    for source, target in graph.edges():
        net.add_edge(source, target)

    net.set_options("""
    var options = {
      "nodes": {
        "borderWidth": 1,
        "shadow": true
      },
      "edges": {
        "color": {
          "inherit": true
        },
        "smooth": false
      },
      "physics": {
        "enabled": true,
        "barnesHut": {
          "gravitationalConstant": -8000,
          "centralGravity": 0.3,
          "springLength": 95
        }
      },
      "interaction": {
        "hover": true,
        "tooltipDelay": 100,
        "navigationButtons": true
      }
    }
    """)

    with tempfile.NamedTemporaryFile("w", delete=False, suffix=".html") as tmp_file:
        net.save_graph(tmp_file.name)
        html_content = open(tmp_file.name, "r", encoding="utf-8").read()
        components.html(html_content, height=620, scrolling=True)

    return net

def find_suspicious_nodes(graph, central_wallets=None):
    """
    Analyze graph to find suspicious nodes with a 0-100 score.
    Returns list of (node, score, reason_code)
    """
    if not graph or len(graph.nodes) == 0:
        return []

    suspects = []
    degree_dict = dict(graph.degree())
    max_degree = max(degree_dict.values()) if degree_dict else 1
    mean_degree = sum(degree_dict.values()) / len(degree_dict) if degree_dict else 1

    central_wallets = central_wallets or {}
    # Create a lowercase mapping for case-insensitive lookup
    wallet_map_lc = {k.lower(): v for k, v in central_wallets.items()}
    labeled_addresses_lc = set(wallet_map_lc.keys())

    for node in graph.nodes:
        # 1. Centrality Score (up to 40 points)
        degree = degree_dict[node]
        centrality_score = min(40, (degree / mean_degree) * 10) if mean_degree > 0 else 0

        # 2. Velocity Score (up to 30 points)
        tx_count = graph.nodes[node].get("tx_count", 1)
        if tx_count == 1: tx_count = degree
        velocity_score = min(30, tx_count * 2)

        # 3. Connectivity Risk (up to 30 points)
        connectivity_score = 0
        node_str = str(node).lower()
        
        if node_str in labeled_addresses_lc:
            connectivity_score = 10 
        else:
            for neighbor in graph.neighbors(node):
                if str(neighbor).lower() in labeled_addresses_lc:
                    connectivity_score = 30
                    break

        total_score = int(min(100, centrality_score + velocity_score + connectivity_score))
        
        # Determine primary reason
        reason = 0
        is_dw = False
        
        # Check if node itself is dark web
        if node_str in labeled_addresses_lc:
            lbl = wallet_map_lc.get(node_str, {}).get("label", "").lower()
            if "dark web" in lbl or "mixer" in lbl: is_dw = True
        
        # Check if connected to dark web
        if not is_dw:
            for nbr in graph.neighbors(node):
                nbr_str = str(nbr).lower()
                if nbr_str in labeled_addresses_lc:
                    nlbl = wallet_map_lc.get(nbr_str, {}).get("label", "").lower()
                    if "dark web" in nlbl or "mixer" in nlbl:
                        is_dw = True
                        break

        if is_dw:
            reason = 7
            total_score = max(total_score, 85)
        elif connectivity_score >= 30: reason = 3 # Connected to risky
        elif centrality_score > 20: reason = 1  # High degree
        elif velocity_score > 15: reason = 2    # High frequency
        else: reason = 6 # Anomalous pattern

        if total_score >= 20: # Threshold for being "suspicious"
            graph.nodes[node]["risk_score"] = total_score
            graph.nodes[node]["reason"] = reason
            suspects.append((node, total_score, reason))

    return suspects
