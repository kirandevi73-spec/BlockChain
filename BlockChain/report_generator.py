# === report_generator.py ===
import sys
from datetime import datetime

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

def generate_report(graph, suspicious_nodes, transactions, blockchain, file_path="forensic_report.txt"):
    num_nodes = graph.number_of_nodes()
    num_edges = graph.number_of_edges()
    num_suspicious = len(suspicious_nodes)
    risk_level = "HIGH" if num_suspicious > 0 else "LOW"

    with open(file_path, "w", encoding="utf-8") as f:
        f.write("🔍 BLOCKCHAIN FORENSICS REPORT\n")
        f.write(f"Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC | Blockchain: {blockchain}\n\n")
        
        f.write("EXECUTIVE SUMMARY\n")
        f.write("━━━━━━━━━━━━━━━━━\n")
        f.write(f"Total Wallets Analyzed:     {num_nodes}\n")
        f.write(f"Total Transactions:         {num_edges}\n")
        f.write(f"Risk Level:                 {risk_level}\n")
        f.write(f"Suspicious Wallets Found:   {num_suspicious}\n\n")

        f.write("SUSPICIOUS WALLET DETAILS\n")
        f.write("━━━━━━━━━━━━━━━━━━━━━━━━━\n")
        if suspicious_nodes:
            for i, addr in enumerate(suspicious_nodes, 1):
                f.write(f"[{i}] {addr}\n")
        else:
            f.write("✅ No suspicious activity detected.\n")
            
        f.write("\nTRANSACTION SUMMARY (Top 20)\n")
        f.write("━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
        f.write(f"{'FROM'.ljust(45)} {'TO'.ljust(45)} {'AMOUNT'.ljust(15)} {'TIME'}\n")
        
        for tx in transactions[:20]:
            sender = tx.get("from", "Unknown")[:40]
            receiver = tx.get("to", "Unknown")[:40]
            amt = str(tx.get("amount", 0))
            ts = str(tx.get("timestamp", ""))
            f.write(f"{sender.ljust(45)} → {receiver.ljust(43)} {amt.ljust(15)} {ts}\n")

    print("📄 Report saved to:", file_path)
