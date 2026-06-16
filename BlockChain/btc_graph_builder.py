import networkx as nx
import requests
import pandas as pd

def build_btc_graph_from_api(tx_hash):
    url = f"https://api.blockcypher.com/v1/btc/main/txs/{tx_hash}"
    response = requests.get(url)
    
    if response.status_code != 200:
        return None, pd.DataFrame()
    
    data = response.json()
    G = nx.DiGraph()

    inputs = data.get("inputs", [])
    outputs = data.get("outputs", [])

    summary_data = []

    for vin in inputs:
        input_address = vin.get("addresses", ["unknown"])[0]
        for vout in outputs:
            output_address = vout.get("addresses", ["unknown"])[0]
            value_btc = vout.get("value", 0) / 1e8

            G.add_edge(input_address, output_address, weight=value_btc)

            # Add suspicious marker
            suspicious = value_btc > 5  # e.g., flag large transfers
            G.nodes[output_address]["suspicious"] = suspicious

            summary_data.append({
                "From": input_address,
                "To": output_address,
                "Amount (BTC)": value_btc,
                "Suspicious": suspicious
            })

    df = pd.DataFrame(summary_data)
    return G, df
