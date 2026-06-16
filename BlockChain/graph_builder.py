# === graph_builder.py ===
import networkx as nx

def build_transaction_graph(transactions, blockchain='btc'):
    G = nx.DiGraph()

    if blockchain == 'btc':
        for tx in transactions:
            if isinstance(tx, tuple) and len(tx) == 4:
                sender, receiver, amount, timestamp = tx
                G.add_node(sender, label=sender)
                G.add_node(receiver, label=receiver)
                G.add_edge(sender, receiver, weight=amount, timestamp=timestamp)

    else:
        for tx in transactions:
            inputs = tx.get('inputs', [])
            outputs = tx.get('outputs', [])

            for i in inputs:
                from_addrs = i.get('addresses', [])
                if not from_addrs:
                    continue
                from_addr = from_addrs[0]

                for o in outputs:
                    to_addrs = o.get('addresses', [])
                    if not to_addrs:
                        continue
                    to_addr = to_addrs[0]
                    value = o.get('value', 0)

                    G.add_edge(from_addr, to_addr, weight=value)

    return G
