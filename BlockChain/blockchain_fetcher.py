# === blockchain_fetcher.py ===
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")
import requests

BLOCKSTREAM_BASE_URL = "https://blockstream.info/api"

def fetch_transactions(wallet_or_tx):
    if len(wallet_or_tx) == 64:  # Likely a transaction hash
        print(f"📡 Fetching BTC transaction: {wallet_or_tx}")
        url = f"{BLOCKSTREAM_BASE_URL}/tx/{wallet_or_tx}"
        res = requests.get(url)
        if res.status_code != 200:
            raise Exception(f"❌ Failed to fetch tx: {res.status_code} - {res.text}")
        tx = res.json()
        return extract_edges_from_tx(tx)
    else:
        print(f"📡 Fetching BTC wallet history: {wallet_or_tx}")
        url = f"{BLOCKSTREAM_BASE_URL}/address/{wallet_or_tx}/txs"
        res = requests.get(url)
        if res.status_code != 200:
            raise Exception(f"❌ Failed to fetch address: {res.status_code} - {res.text}")
        txs = res.json()
        all_edges = []
        for tx in txs:
            all_edges.extend(extract_edges_from_tx(tx))
        return all_edges

def extract_edges_from_tx(tx):
    time = tx.get("status", {}).get("block_time", "unknown")
    edges = []

    inputs = [vin.get("prevout", {}).get("scriptpubkey_address") for vin in tx.get("vin", [])]
    inputs = [addr for addr in inputs if addr]

    outputs = [
        {"address": vout.get("scriptpubkey_address"), "value": vout.get("value", 0)}
        for vout in tx.get("vout", []) if vout.get("scriptpubkey_address") and vout.get("value", 0) > 0
    ]

    for sender in inputs:
        for o in outputs:
            edges.append((sender, o["address"], o["value"] / 1e8, time))

    return edges
