# === Neo4j Interactivity and Live Polling Integration ===

# 🛠️ PREREQUISITES:
# 1. Your Neo4j database must be running and accessible
# 2. You must have the Bolt URI, username, and password for connection
# 3. Neo4j Python Driver installed: pip install neo4j

from neo4j import GraphDatabase
import streamlit as st
import time

# ==== CONFIG ==== (set your own credentials below)
NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASS = "12345678"

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASS))

# === NODE CLICK INTERACTIVITY ===
def get_node_details(tx, node_id):
    result = tx.run("""
        MATCH (n)
        WHERE id(n) = $node_id
        RETURN properties(n) as props
    """, node_id=node_id)
    record = result.single()
    return record["props"] if record else {}

def neo4j_interactive_view():
    with driver.session() as session:
        nodes = session.run("MATCH (n) RETURN id(n) as id, n.address AS address LIMIT 100")
        node_list = [(record["id"], record["address"]) for record in nodes if record.get("address")]

    if node_list:
        selected = st.selectbox("🧠 Select a Node to Explore", options=node_list, format_func=lambda x: x[1])
        if selected:
            with driver.session() as session:
                props = session.read_transaction(get_node_details, selected[0])
                st.json(props)

# === LIVE DATA POLLING ===
def live_polling(callback, interval_sec=30):
    st.info(f"🔄 Auto-refreshing every {interval_sec} seconds...")
    while True:
        callback()
        time.sleep(interval_sec)

# === USAGE EXAMPLES ===
# To use in app.py, call:
#   neo4j_interactive_view()
# For live polling:
#   live_polling(lambda: analyze_wallet_or_hash(user_input), interval_sec=60)

# ⚠️ NOTE: Streamlit does not support true live polling in the main script.
# Use streamlit_autorefresh or manual refresh triggers as an alternative in GUI.
