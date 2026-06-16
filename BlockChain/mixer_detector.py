# === mixer_detector.py ===

def detect_mixers(graph):
    """
    Detects potential mixer nodes based on high outbound transaction volume.
    Nodes with more than 5 outgoing edges are considered suspicious.
    """
    suspicious = []
    for node in graph.nodes():
        if len(graph.out_edges(node)) > 5:
            suspicious.append(node)
    return suspicious
