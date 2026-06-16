# === eth_graph_builder.py ===
import networkx as nx

def build_eth_graph(transfers):
    graph = nx.DiGraph()
    summary = []

    for tx in transfers:
        sender = tx.get("from") or tx.get("from_address")
        receiver = tx.get("to") or tx.get("to_address")
        amount = tx.get("value", 0)
        timestamp = tx.get("timestamp") or tx.get("timeStamp")

        if sender and receiver and float(amount) > 0:
            graph.add_edge(sender, receiver, label=f"{float(amount):.6f} ETH", timestamp=timestamp)
            summary.append((sender, receiver, float(amount), timestamp))

    return graph, summary
