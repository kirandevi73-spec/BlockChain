# === solana_helius.py ===

import requests

HELIUS_API_KEY = 'f4327b42-6e18-4e7b-b120-dc6d48c6e5b0'

def fetch_wallet_transactions(wallet_address, limit=20):
    url = f"https://api.helius.xyz/v0/addresses/{wallet_address}/transactions?api-key={HELIUS_API_KEY}&limit={limit}"

    try:
        response = requests.get(url)
        if response.status_code != 200:
            print(f"❌ Failed to fetch transactions: HTTP {response.status_code}")
            return []

        data = response.json()
        if not data:
            print("⚠️ No transactions returned by Helius.")
            return []

        return data

    except Exception as e:
        print(f"❌ Exception during Helius API call: {e}")
        return []
