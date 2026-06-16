# === solana_graph_builder.py ===
import networkx as nx

def build_solana_graph(transfers):
    graph = nx.DiGraph()
    summary = []

    for s, r, a, t in transfers:
        if s and r and float(a) > 0:
            graph.add_edge(s, r, label=f"{float(a):.6f} SOL", timestamp=t)
            summary.append({
                "Sender": s,
                "Receiver": r,
                "Amount (SOL)": float(a),
                "Timestamp": t
            })

    return graph, summary
