# export_neo4j.py

try:
    from neo4j import GraphDatabase
    _NEO4J_AVAILABLE = True
except ImportError:
    _NEO4J_AVAILABLE = False

def export_to_neo4j(graph, uri="bolt://localhost:7687", user="neo4j", password="12345678"):
    if not _NEO4J_AVAILABLE:
        raise RuntimeError(
            "neo4j Python package is not installed. "
            "Install it with: pip install neo4j"
        )

    driver = GraphDatabase.driver(uri, auth=(user, password))

    def create_graph(tx):
        for node in graph.nodes:
            tx.run("MERGE (n:Wallet {id: $id})", id=node)
        for src, dst, data in graph.edges(data=True):
            tx.run("""
                MATCH (a:Wallet {id: $src}), (b:Wallet {id: $dst})
                MERGE (a)-[:TRANSFER {amount: $amt}]->(b)
            """, src=src, dst=dst, amt=data.get("amount", 0))

    with driver.session() as session:
        session.write_transaction(create_graph)

    driver.close()
