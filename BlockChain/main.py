# === main.py ===
import sys
import networkx as nx
from blockchain_fetcher import fetch_transactions
from graph_builder import build_transaction_graph
from mixer_detector import detect_mixers
from btc_visualizer import visualize_btc_graph
from solana_visualizer import visualize_solana_graph
from report_generator import generate_report
from solana_fetcher import fetch_solana_data
from solana_helius import fetch_wallet_transactions
from neo4j_exporter import export_to_neo4j
from eth_fetcher import fetch_eth_wallet, fetch_eth_tx
from eth_graph_builder import build_eth_graph
from eth_visualizer import visualize_eth_graph
from eth_neo4j_exporter import export_eth_to_neo4j

def get_input_for_chain():
    print("\n🌐 Choose blockchain (btc / sol / eth):")
    chain = input("👉 ").strip().lower()
    if chain not in ["btc", "sol", "eth"]:
        print("❌ Invalid blockchain. Choose 'btc', 'sol', or 'eth'.")
        return None, None
    print("\n🔐 Enter wallet address or transaction signature/hash:")
    user_input = input("👉 ").strip().replace("👉", "").strip()
    return chain, user_input

def main():
    print("\n=== 🛡️ Blockchain Forensics Tool ===\n")

    chain, user_input = get_input_for_chain()
    if not chain or not user_input:
        return

    if chain == "btc":
        wallets = [user_input]
        all_transactions = []

        for wallet in wallets:
            try:
                txs = fetch_transactions(wallet)
                all_transactions.extend(txs)
            except Exception as e:
                print(f"⚠️ Error fetching BTC transactions for {wallet}: {e}")

        if not all_transactions:
            print("❌ No transactions were fetched. Please check the address.")
            return

        print("\n🔗 Building BTC transaction graph...")
        graph = build_transaction_graph(all_transactions)
        print(f"✅ Graph created with {graph.number_of_nodes()} nodes and {graph.number_of_edges()} edges.")

        print("\n📄 Transaction Summary:")
        for sender, receiver, amount, timestamp in all_transactions:
            print(f"🔁 {sender} → {receiver} | {amount:.8f} BTC at {timestamp}")

        suspicious_nodes = detect_mixers(graph)
        print(f"🚨 Detected {len(suspicious_nodes)} suspicious nodes.\n")

        center_node = max(suspicious_nodes, key=lambda n: graph.degree(n)) if suspicious_nodes else None
        visualize_btc_graph(graph, suspicious_nodes, center_node=center_node, hops=2)
        generate_report(graph, suspicious_nodes)

    elif chain == "sol":
        if len(user_input) >= 80:
            print(f"\n🔍 Recognized as Transaction Signature: {user_input}")
            result = fetch_solana_data(user_input)

            if result["type"] == "signature":
                tx = result["data"]
                transfers = result["transfers"]

                if not tx or not transfers:
                    print("⚠️ No valid transaction data returned.")
                    return

                print("\n📄 Transaction Summary:")
                for s, r, a, t in transfers:
                    print(f"🔁 {s} → {r} | {a:.6f} SOL at {t}")

                graph = nx.DiGraph()
                for s, r, a, t in transfers:
                    graph.add_edge(s, r, label=f"{a:.6f} SOL", timestamp=t)

                suspicious_nodes = [n for n in graph.nodes if graph.degree(n) > 3]
                visualize_solana_graph(graph, suspicious_nodes, center_node=user_input, hops=1)
                export_to_neo4j(transfers)

        else:
            print(f"\n🔍 Recognized as Solana Wallet Address: {user_input}")
            transactions = fetch_wallet_transactions(user_input)

            if not transactions:
                print("⚠️ No transactions found for this wallet.")
                return

            print(f"✅ {len(transactions)} transactions retrieved from Helius.")

            graph = nx.DiGraph()
            for txn in transactions:
                timestamp = txn.get("timestamp")
                native_transfers = txn.get("events", {}).get("nativeTransfers", [])
                token_transfers = txn.get("events", {}).get("tokenTransfers", [])

                for transfer in native_transfers:
                    sender = transfer.get("fromUserAccount")
                    receiver = transfer.get("toUserAccount")
                    amount = transfer.get("amount", 0) / 1e9

                    if sender and receiver and amount > 0:
                        graph.add_edge(sender, receiver, label=f"{amount:.6f} SOL", timestamp=timestamp)

                for transfer in token_transfers:
                    sender = transfer.get("fromUserAccount")
                    receiver = transfer.get("toUserAccount")
                    token_amount = transfer.get("tokenAmount", {})
                    amount = float(token_amount.get("amount", 0))
                    decimals = int(token_amount.get("decimals", 0))
                    symbol = transfer.get("tokenSymbol", "TOKEN")

                    real_amount = amount / (10 ** decimals) if decimals else amount

                    if sender and receiver and real_amount > 0:
                        graph.add_edge(sender, receiver, label=f"{real_amount:.6f} {symbol}", timestamp=timestamp)

            if graph.number_of_edges() == 0:
                print("⚠️ No valid transfer edges found in wallet history.")
                return

            print("\n📄 Transaction Summary:")
            for u, v, d in graph.edges(data=True):
                print(f"🔁 {u} → {v} | {d['label']} at {d['timestamp']}")

            print(f"\n📊 Built wallet graph with {graph.number_of_nodes()} nodes and {graph.number_of_edges()} edges.")
            suspicious_nodes = [n for n in graph.nodes if graph.degree(n) > 3]
            visualize_solana_graph(graph, suspicious_nodes, center_node=user_input, hops=2)

    elif chain == "eth":
        if len(user_input) == 66 and user_input.startswith("0x"):
            print(f"\n🔍 Recognized as Ethereum Transaction Hash: {user_input}")
            transfers = fetch_eth_tx(user_input)
        elif user_input.startswith("0x") and len(user_input) == 42:
            print(f"\n🔍 Recognized as Ethereum Wallet Address: {user_input}")
            transfers = fetch_eth_wallet(user_input)
        else:
            print("❌ Invalid Ethereum input.")
            return

        if not transfers:
            print("⚠️ No valid ETH transfer data found.")
            return

        print("\n📄 Transaction Summary:")
        for tx in transfers:
            sender = tx.get("from") or tx.get("from_address")
            receiver = tx.get("to") or tx.get("to_address")
            value = float(tx.get("value", 0))
            timestamp = tx.get("timestamp") or tx.get("timeStamp")
            print(f"🔁 {sender} → {receiver} | {value:.6f} ETH at {timestamp}")

        graph = build_eth_graph(transfers)
        print(f"\n📊 Built ETH graph with {graph.number_of_nodes()} nodes and {graph.number_of_edges()} edges.")

        suspicious_nodes = [n for n in graph.nodes if graph.degree(n) > 3]

        center_node = None
        if transfers and isinstance(transfers[0], dict):
            center_node = transfers[0].get("from") or transfers[0].get("from_address")
        if not center_node and graph.nodes:
            center_node = list(graph.nodes)[0]

        visualize_eth_graph(graph, suspicious_nodes, center_node=center_node, hops=2)
        export_eth_to_neo4j(transfers)
        print("🧐 Ethereum graph data exported to Neo4j.")

    print("\n✅ All steps completed successfully!\n")

if __name__ == "__main__":
    main()
