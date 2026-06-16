# === solana_fetcher.py ===

import requests
from datetime import datetime

def is_transaction_signature(input_text):
    return len(input_text.strip()) > 70

def get_transaction_by_signature(signature):
    url = "https://api.mainnet-beta.solana.com"
    headers = {'Content-Type': 'application/json'}

    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTransaction",
        "params": [
            signature,
            {
                "encoding": "jsonParsed",
                "maxSupportedTransactionVersion": 0
            }
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code != 200:
            print("❌ Failed to fetch transaction.")
            return None
        return response.json().get("result")
    except Exception as e:
        print(f"❌ Exception during transaction fetch: {e}")
        return None

def get_sender_receiver_amount(tx_data):
    try:
        timestamp = datetime.utcfromtimestamp(tx_data.get("blockTime")).isoformat() if tx_data.get("blockTime") else "N/A"
        instructions = tx_data["transaction"]["message"]["instructions"]
        transfers = []

        for instruction in instructions:
            if instruction.get("parsed") and instruction.get("program") == "system":
                info = instruction["parsed"]["info"]
                sender = info.get("source")
                receiver = info.get("destination")
                lamports = info.get("lamports", 0)
                sol = lamports / 1e9
                if sender and receiver:
                    transfers.append((sender, receiver, sol, timestamp))

        return transfers
    except Exception as e:
        print(f"⚠️ Error extracting transfer data: {e}")
        return []

def fetch_solana_data(user_input):
    if is_transaction_signature(user_input):
        tx_data = get_transaction_by_signature(user_input)
        if not tx_data:
            return {"type": "signature", "data": None, "transfers": []}
        transfers = get_sender_receiver_amount(tx_data)
        return {"type": "signature", "data": tx_data, "transfers": transfers}
    else:
        print("❌ Only transaction signature input is supported for Solana.")
        return {"type": "unsupported", "data": None, "transfers": []}
