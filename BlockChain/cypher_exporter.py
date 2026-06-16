# cypher_exporter.py

def generate_cypher_script(graph, suspicious_nodes, transactions, file_path="graph_export.cypher"):
    """
    Generates a .cypher script file that can be copy-pasted into Neo4j Browser.
    """
    suspicious_set = set(suspicious_nodes)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write("// Blockchain Forensics - Neo4j Cypher Export\n")
        f.write("// Copy and paste this script into your Neo4j Browser to visualize the graph.\n\n")
        
        f.write("// 1. Clear existing data (optional, uncomment if needed)\n")
        f.write("// MATCH (n) DETACH DELETE n;\n\n")
        
        f.write("// 2. Create constraints (optional)\n")
        f.write("// CREATE CONSTRAINT IF NOT EXISTS FOR (w:Wallet) REQUIRE w.address IS UNIQUE;\n\n")
        
        f.write("// 3. Create Nodes\n")
        for node in graph.nodes():
            is_suspicious = node in suspicious_set
            labels = ":Wallet:Suspicious" if is_suspicious else ":Wallet"
            f.write(f'MERGE (w{labels} {{address: "{node}"}});\n')
            
        f.write("\n// 4. Create Relationships\n")
        for src, dst, data in graph.edges(data=True):
            amount = data.get("amount", 0)
            timestamp = data.get("timestamp", "")
            f.write(f'MATCH (a:Wallet {{address: "{src}"}}), (b:Wallet {{address: "{dst}"}})\n')
            f.write(f'MERGE (a)-[:TRANSFERRED {{amount: {amount}, timestamp: "{timestamp}"}}]->(b);\n')
            
    return file_path
