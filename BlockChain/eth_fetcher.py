# === eth_fetcher.py ===
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")
import requests

ETHERSCAN_API_KEY = "1AJZ68QD2R32RW4EMB4275DFBAQWXEQE2Y"
ETHERSCAN_BASE = "https://api.etherscan.io/v2/api"

def fetch_eth_wallet(address):
    print(f"\n📡 Fetching ETH transactions for wallet: {address}")
    url = f"{ETHERSCAN_BASE}?chainid=1&module=account&action=txlist&address={address}&startblock=0&endblock=99999999&sort=asc&apikey={ETHERSCAN_API_KEY}"
    response = requests.get(url)
    data = response.json()

    if data.get("status") != "1":
        print("⚠️ No transactions found or API limit reached.")
        return []

    transfers = []
    for tx in data["result"]:
        if tx.get("to") and tx.get("value"):
            transfers.append({
                "from": tx["from"],
                "to": tx["to"],
                "value": int(tx["value"]) / 1e18,
                "timestamp": int(tx["timeStamp"]),
                "hash": tx["hash"]
            })
    return transfers

def fetch_eth_tx(tx_hash):
    print(f"\n📡 Fetching ETH transaction: {tx_hash}")
    url = f"{ETHERSCAN_BASE}?chainid=1&module=proxy&action=eth_getTransactionByHash&txhash={tx_hash}&apikey={ETHERSCAN_API_KEY}"
    response = requests.get(url)
    data = response.json()

    tx = data.get("result")
    if not tx:
        print("⚠️ No transaction found.")
        return []

    from_addr = tx.get("from")
    to_addr = tx.get("to")
    value = int(tx["value"], 16) / 1e18
    block_number = int(tx["blockNumber"], 16)

    block_url = f"{ETHERSCAN_BASE}?chainid=1&module=block&action=getblockreward&blockno={block_number}&apikey={ETHERSCAN_API_KEY}"
    block_data = requests.get(block_url).json()
    timestamp = int(block_data.get("result", {}).get("timeStamp", "0"))

    return [{
        "from": from_addr,
        "to": to_addr,
        "value": value,
        "timestamp": timestamp,
        "hash": tx_hash
    }]
