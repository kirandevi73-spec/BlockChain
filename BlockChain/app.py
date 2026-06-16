import streamlit as st
import pandas as pd
import tempfile
import os
import json
import requests
from datetime import datetime
from streamlit_autorefresh import st_autorefresh
from streamlit.components.v1 import html

from solana_fetcher import fetch_solana_data
from solana_graph_builder import build_solana_graph
from eth_fetcher import fetch_eth_wallet, fetch_eth_tx
from eth_graph_builder import build_eth_graph
from btc_graph_builder import build_btc_graph_from_api
from visualizer import plot_graph, find_suspicious_nodes
from export_neo4j import export_to_neo4j

# Load centralized wallet mapping (global)
CENTRAL_WALLETS_PATH = "central_wallets.json"
if os.path.exists(CENTRAL_WALLETS_PATH):
    with open(CENTRAL_WALLETS_PATH, "r") as f:
        CENTRAL_WALLETS = json.load(f)
else:
    CENTRAL_WALLETS = {}

ETHERSCAN_API_KEY = "YOUR_ETHERSCAN_API_KEY"  # Replace with your real API key

def get_ip(addr):
    entry = CENTRAL_WALLETS.get(addr.lower())
    if isinstance(entry, dict):
        return entry.get("ip", "Decentralized")
    return "Decentralized"

def get_label(addr):
    entry = CENTRAL_WALLETS.get(addr.lower())
    if isinstance(entry, dict):
        return entry.get("label", "Unknown")
    return "Unknown"

def enrich_with_ip(summary_df):
    if not isinstance(summary_df, pd.DataFrame):
        try:
            summary_df = pd.DataFrame(summary_df)
        except Exception:
            return summary_df

    if "From" in summary_df.columns:
        column = "From"
    elif "Wallet" in summary_df.columns:
        column = "Wallet"
    elif "Address" in summary_df.columns:
        column = "Address"
    else:
        return summary_df

    summary_df["IP Address"] = summary_df[column].apply(get_ip)
    summary_df["Wallet Label"] = summary_df[column].apply(get_label)
    return summary_df

def main():
    for key, default in {
        "dark_mode": False,
        "last_input": None,
        "last_blockchain": None,
        "last_graph": None,
        "last_summary": None,
        "last_node_clicked": None,
    }.items():
        if key not in st.session_state:
            st.session_state[key] = default

    st.set_page_config(page_title="Blockchain Forensics Dashboard", layout="wide")

    def toggle_mode():
        st.session_state.dark_mode = not st.session_state.dark_mode

    dark_mode = st.session_state.dark_mode
    font_link = "https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap"
    st.markdown(f"""
        <style>
        @import url('{font_link}');
        html, body, .stApp {{
            font-family: 'Orbitron', sans-serif;
            background-color: {'#0e1117' if dark_mode else '#ffffff'};
            color: {'#f0f2f6' if dark_mode else '#000000'};
        }}
        .title-wrapper {{ text-align: center; animation: glow 2s ease-in-out infinite alternate; }}
        h1 {{ font-size: 3rem; color: {'#00ffe7' if dark_mode else '#005bc5'}; text-shadow: 0 0 20px {'#00ffe7' if dark_mode else '#00aaff'}; }}
        @keyframes glow {{
            from {{ text-shadow: 0 0 10px #00ffe7; }}
            to {{ text-shadow: 0 0 25px #00ffe7, 0 0 50px #00ffe7; }}
        }}
        .stButton > button {{ background: linear-gradient(90deg, #00ffe7, #007cf0); color: black; border: none; border-radius: 12px; padding: 0.5em 1.5em; transition: 0.3s ease-in-out; }}
        .stButton > button:hover {{ transform: scale(1.05); box-shadow: 0 0 15px #00ffe7; }}
        .stSelectbox label, .stTextInput label {{ color: {'#f0f2f6' if dark_mode else '#000000'} !important; }}
        </style>
    """, unsafe_allow_html=True)

    cols = st.columns([0.9, 0.1])
    with cols[0]:
        st.markdown("<div class='title-wrapper'><h1>\U0001f9e0 Blockchain Forensics Dashboard</h1></div>", unsafe_allow_html=True)
    with cols[1]:
        st.button("\U0001f319 Mode", on_click=toggle_mode)

    polling = st.sidebar.checkbox("\U0001f501 Enable Live Polling (every 30s)")
    if polling:
        st_autorefresh(interval=30 * 1000, key="polling")

    tabs = st.tabs(["\U0001f50d Analyze", "\U0001f4c4 Export to CSV", "\U0001f9e0 Export to Neo4j"])

    with tabs[0]:
        blockchain = st.selectbox("Select Blockchain", ["Solana", "Ethereum", "Bitcoin"])
        user_input = st.text_input("\U0001f50d Enter Wallet Address or Transaction Hash/Signature")
        analyze_clicked = st.button("Analyze")

        if analyze_clicked and user_input:
            st.session_state.last_input = user_input
            st.session_state.last_blockchain = blockchain

        analyze = False
        if polling and st.session_state.last_input:
            user_input = st.session_state.last_input
            blockchain = st.session_state.last_blockchain
            analyze = True
        elif analyze_clicked:
            analyze = True

        if analyze:
            summary = None
            graph = None
            suspects = []

            if blockchain == "Solana":
                result = fetch_solana_data(user_input)
                if result and result.get("transfers"):
                    records = [(src, dst, amt, ts, get_ip(src), get_label(src)) for src, dst, amt, ts in result["transfers"]]
                    summary = pd.DataFrame(records, columns=["From", "To", "Amount (SOL)", "Timestamp", "IP Address", "Wallet Label"])
                    graph, _ = build_solana_graph(result["transfers"])
                    suspects = find_suspicious_nodes(graph)
                else:
                    st.warning("No valid Solana transfers found.")

            elif blockchain == "Ethereum":
                if len(user_input) == 66 and user_input.startswith("0x"):
                    transfers = fetch_eth_tx(user_input)
                elif len(user_input) == 42 and user_input.startswith("0x"):
                    transfers = fetch_eth_wallet(user_input)
                else:
                    st.error("Invalid Ethereum input.")
                    transfers = []

                if transfers:
                    records = [(tx["from"], tx["to"], tx["value"], datetime.utcfromtimestamp(tx["timestamp"]).isoformat(), get_ip(tx["from"]), get_label(tx["from"])) for tx in transfers]
                    summary = pd.DataFrame(records, columns=["From", "To", "Value (ETH)", "Timestamp", "IP Address", "Wallet Label"])
                    graph, _ = build_eth_graph(transfers)
                    suspects = find_suspicious_nodes(graph)
                else:
                    st.warning("No Ethereum transfers found.")

            elif blockchain == "Bitcoin":
                from blockchain_fetcher import fetch_transactions
                from graph_builder import build_transaction_graph
                
                try:
                    txs = fetch_transactions(user_input)
                except Exception as e:
                    txs = []
                    st.error(f"Error fetching data: {str(e)}")

                if txs:
                    graph = build_transaction_graph(txs)
                    records = []
                    for sender, receiver, amount, timestamp in txs:
                        records.append((str(sender), str(receiver), float(amount), str(timestamp), get_ip(str(sender)), get_label(str(sender))))
                    summary = pd.DataFrame(records, columns=["From", "To", "Amount (BTC)", "Timestamp", "IP Address", "Wallet Label"])
                    suspects = find_suspicious_nodes(graph)
                else:
                    st.warning("No valid Bitcoin graph data.")

            if graph and summary is not None:
                st.session_state.last_graph = graph
                st.session_state.last_summary = summary

                st.subheader("\U0001f517 Transaction Summary")
                st.dataframe(summary)

                st.subheader("\U0001f4c8 Transaction Graph")
                net = plot_graph(graph, dark_mode=dark_mode, suspicious_nodes=[n for n, _, _ in suspects])
                if net:
                    with tempfile.NamedTemporaryFile(delete=False, suffix=".html") as tmp_file:
                        net.save_graph(tmp_file.name)
                        tmp_file.close()
                        with open(tmp_file.name, "r", encoding="utf-8") as f:
                            html_graph = f.read()
                        html(html_graph, height=650, scrolling=True)
                        os.unlink(tmp_file.name)

                if suspects:
                    st.subheader("\U0001f534 Suspicious Node Details")
                    st.markdown(f"**Total Suspicious Nodes Detected:** {len(suspects)}")

                    details = {
                        "Node": [n for n, _, _ in suspects],
                        "Suspicion Score": [score for _, score, _ in suspects],
                        "Reason": [reason for _, _, reason in suspects]
                    }

                    reason_desc = {
                        1: "High degree centrality (hub activity)",
                        2: "High transaction frequency",
                        3: "Connected to known risky addresses",
                        4: "Unusual transaction volume",
                        5: "Looping/self-transfers",
                        6: "Anomalous graph pattern"
                    }

                    details["Reason Description"] = [reason_desc.get(r, "Unknown") for r in details["Reason"]]
                    df = pd.DataFrame(details)
                    st.dataframe(df)
                    st.session_state["last_suspects_df"] = df

    with tabs[1]:
        st.subheader("\U0001f4c4 Export Suspicious List to CSV")
        if "last_suspects_df" in st.session_state:
            csv = st.session_state["last_suspects_df"].to_csv(index=False).encode("utf-8")
            st.download_button("Download Suspicious List", csv, "suspicious_nodes.csv", "text/csv")
        else:
            st.info("Run an analysis first to export suspicious nodes.")

    with tabs[2]:
        st.subheader("\U0001f9e0 Export Graph to Neo4j")
        if st.session_state.get("last_graph"):
            if st.button("Export Graph to Neo4j"):
                export_to_neo4j(st.session_state.last_graph)
                st.success("Graph successfully exported to Neo4j!")
        else:
            st.info("Run an analysis first to export to Neo4j.")

if __name__ == "__main__":
    main()
