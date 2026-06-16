# === neo4j_exporter.py ===

from neo4j import GraphDatabase

uri = "bolt://localhost:7687"
neo4j_user = "neo4j"
neo4j_pass = "12345678"  # Replace with your actual password

driver = GraphDatabase.driver(uri, auth=(neo4j_user, neo4j_pass))

def export_to_neo4j(transfers):
    with driver.session() as session:
        for s, r, a, t in transfers:
            session.run("""
                MERGE (a:Wallet {address: $sender})
                MERGE (b:Wallet {address: $receiver})
                MERGE (a)-[:TRANSFERRED {amount: $amount, timestamp: $timestamp}]->(b)
            """, sender=s, receiver=r, amount=a, timestamp=t)