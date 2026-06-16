# === eth_neo4j_exporter.py ===
from neo4j import GraphDatabase

uri = "bolt://localhost:7687"
username = "neo4j"
password = "12345678"

driver = GraphDatabase.driver(uri, auth=(username, password))

def export_eth_to_neo4j(transfers):
    with driver.session() as session:
        for tx in transfers:
            sender = tx.get("from") or tx.get("from_address")
            receiver = tx.get("to") or tx.get("to_address")
            amount = tx.get("value", 0)
            timestamp = tx.get("timestamp") or tx.get("timeStamp")
            tx_hash = tx.get("hash")

            if sender and receiver and float(amount) > 0:
                session.write_transaction(
                    _create_eth_transaction, sender, receiver, amount, timestamp, tx_hash
                )

def _create_eth_transaction(tx, sender, receiver, amount, timestamp, tx_hash):
    tx.run("""
        MERGE (s:Wallet {address: $sender})
        MERGE (r:Wallet {address: $receiver})
        MERGE (s)-[t:SENT {
            amount: $amount,
            timestamp: $timestamp,
            tx_hash: $tx_hash
        }]->(r)
    """, sender=sender, receiver=receiver, amount=amount, timestamp=timestamp, tx_hash=tx_hash)
