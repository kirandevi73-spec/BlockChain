# dashboard.py
import streamlit as st
import networkx as nx
import matplotlib.pyplot as plt

from blockchain_fetcher import fetch_transactions
from solana_helius import fetch_wallet_transactions
from solana_fetcher import fetch_solana_data
from eth_fetcher import fetch_eth_wallet, fetch_eth_tx
from graph_builder import build_transaction_graph
from eth_graph_builder import build_eth_graph
from mixer_detector import detect_mixers
from eth_neo4j_exporter import export_eth_to_neo4j
from neo4j_exporter import export_to_neo4j

# Title
st.set_page_config(page_title="Blockchain Forensics Dashboard", layout="wide")
st.title("🛡️ Blockchain Forensics Dashboard")

# Select Blockchain
chain = st.selectbox("Select Blockchain", ["Bitcoin (BTC)", "Ethereum (ETH)", "Solana (SOL)"])
input_value = st.text_input("Enter Wallet Address or Transaction Hash")

# Main logic
if st.button("Analyze") and input_value:
    if "BTC" in chain:
        try:
            st.info("Fetching BTC transactions...")
            txs = fetch_transactions(input_value)
            if not txs:
                st.error("No transactions found.")
            else:
                graph = build_transaction_graph(txs)
                suspicious = detect_mixers(graph)
                st.success(f"Graph: {graph.number_of_nodes()} nodes, {graph.number_of_edges()} edges.")
                st.warning(f"{len(suspicious)} suspicious addresses found.")

                # Visualization
                fig, ax = plt.subplots(figsize=(12, 8))
                nx.draw(graph, with_labels=True, ax=ax, node_color='skyblue')
                st.pyplot(fig)

                generate_report(graph, suspicious)

        except Exception as e:
            st.error(f"BTC Error: {e}")

    elif "ETH" in chain:
        try:
            if input_value.startswith("0x") and len(input_value) == 42:
                transfers = fetch_eth_wallet(input_value)
            elif input_value.startswith("0x") and len(input_value) == 66:
                transfers = fetch_eth_tx(input_value)
            else:
                st.error("Invalid Ethereum input.")
                transfers = []

            if transfers:
                graph = build_eth_graph(transfers)
                suspicious = detect_mixers(graph)
                export_eth_to_neo4j(transfers)
                st.success(f"Graph: {graph.number_of_nodes()} nodes, {graph.number_of_edges()} edges.")
                st.warning(f"{len(suspicious)} suspicious addresses found.")

                # Visualization
                fig, ax = plt.subplots(figsize=(12, 8))
                nx.draw(graph, with_labels=True, ax=ax, node_color='orange')
                st.pyplot(fig)

        except Exception as e:
            st.error(f"ETH Error: {e}")

    elif "SOL" in chain:
        try:
            if len(input_value) >= 80:
                result = fetch_solana_data(input_value)
                transfers = result.get("transfers", [])
            else:
                txs = fetch_wallet_transactions(input_value)
                transfers = []
                for txn in txs:
                    native = txn.get("events", {}).get("nativeTransfers", [])
                    for t in native:
                        transfers.append((t.get("fromUserAccount"), t.get("toUserAccount"), t.get("amount") / 1e9, txn.get("timestamp")))

            if transfers:
                graph = nx.DiGraph()
                for s, r, a, t in transfers:
                    graph.add_edge(s, r, label=f"{a:.6f}", timestamp=t)
                export_to_neo4j(transfers)
                suspicious = detect_mixers(graph)
                st.success(f"Graph: {graph.number_of_nodes()} nodes, {graph.number_of_edges()} edges.")
                st.warning(f"{len(suspicious)} suspicious addresses found.")

                # Visualization
                fig, ax = plt.subplots(figsize=(12, 8))
                nx.draw(graph, with_labels=True, ax=ax, node_color='green')
                st.pyplot(fig)

        except Exception as e:
            st.error(f"SOL Error: {e}")
