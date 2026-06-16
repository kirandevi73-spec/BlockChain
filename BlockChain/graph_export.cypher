// Blockchain Forensics - Neo4j Cypher Export
// Copy and paste this script into your Neo4j Browser to visualize the graph.

// 1. Clear existing data (optional, uncomment if needed)
// MATCH (n) DETACH DELETE n;

// 2. Create constraints (optional)
// CREATE CONSTRAINT IF NOT EXISTS FOR (w:Wallet) REQUIRE w.address IS UNIQUE;

// 3. Create Nodes
MERGE (w:Wallet {address: "bc1pgg64vxxr73dfs9afvzqz3thc34ftku08reuqqvhqkcsc5td8wysqdym79x"});
MERGE (w:Wallet:Suspicious {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"});
MERGE (w:Wallet {address: "bc1qvkl3zphd23hgh6qvc97q3kfwmfhyydgh5269h6"});
MERGE (w:Wallet {address: "bc1qzpharyxkygv5s9hu36f3ne5plqlremg9r7apsj"});
MERGE (w:Wallet {address: "bc1qsatlphjcgvzlt9xhsgn0dnjus5jgwg83dr05c6"});
MERGE (w:Wallet {address: "bc1qn3pazv75ft4npctu2u65tyctfspyemg6jgq2hh"});
MERGE (w:Wallet {address: "bc1puz7x7c3ehqsz3mcn93dw4x48uwpt23xh3q0nty25m4l7fuqv9syqk5275k"});
MERGE (w:Wallet {address: "bc1q6csezzn2scerqudwkec77042ghjp2xlg63mlcn"});
MERGE (w:Wallet {address: "bc1qp42j7hn3lup7gck6y6eks6x2lmnp800t6gy7sk"});
MERGE (w:Wallet {address: "bc1q87vftuz2wzqwscmfssdj6tqxu98ypaqg40ry9w"});
MERGE (w:Wallet:Suspicious {address: "3KMmeqPeQcngyTehdfSwsGqvxfU7J7qtc8"});
MERGE (w:Wallet {address: "bc1q94qjej4wvqkegq0mh768yu07p8qe0lkl797825"});
MERGE (w:Wallet {address: "bc1qv4rypmjdu89tjvexcll23hzqhwhlnmpqtumdv8"});
MERGE (w:Wallet {address: "1LXJDmdPPy3CRK6syjdKiMFgpi1YmXJ1dE"});
MERGE (w:Wallet {address: "bc1qhd8z6yugwzx4v06m4jcseugay79dj25cjh0tqp"});
MERGE (w:Wallet {address: "bc1qspw23pm854szh8lne5fe2tuvnz9p73ghd72g8c"});
MERGE (w:Wallet {address: "1NU5AKhTrWhpA1UL82LyKVpVBKqHuR3hUo"});
MERGE (w:Wallet {address: "bc1qzeu2h5705zdtcectu2e7jjuvn320zj7mvhmngh"});
MERGE (w:Wallet {address: "bc1q7lukxsshxfwr3ad02hkj7dv78jf3zssgqw7890"});
MERGE (w:Wallet {address: "bc1qh4q79rv3utrn8nu9eqwejzwsu6l4mlk97t0g5a"});
MERGE (w:Wallet {address: "bc1qr55rzly8ee7tmq2vjhy2c7jtek8n6m3k2rzcrg"});
MERGE (w:Wallet {address: "bc1qn4qjfz0hluwyaak5t7wdmgwvt6s927vjuddyk7"});
MERGE (w:Wallet {address: "bc1qlfa7xtj2camltej54dkl4sarzya6qq875qlrwx"});
MERGE (w:Wallet {address: "bc1q823h6lxtfl6d5racm2exwnhndjf0g2az9z9zw4"});
MERGE (w:Wallet {address: "bc1qcyets2tyhyynukqxzudfss53r4k4xq8j5a3gp7"});
MERGE (w:Wallet {address: "bc1qve5tx0y8xf99pmwflaw33qln8l0a5tm0xz8z8p"});
MERGE (w:Wallet {address: "bc1qu4g0dq83alvp66myj6et2um787thh5jlyzyn0l"});
MERGE (w:Wallet {address: "bc1qx8mpvyhk098tnvxe67nj6tc5tf89vurxe6zluf"});
MERGE (w:Wallet {address: "bc1qtdpa3fsgmd6wywjgf2feckq90uq8mfqs6qe6uu"});
MERGE (w:Wallet {address: "bc1qs4el5kzymw4l88x6tpz644xlkryy84xexwwfvd"});
MERGE (w:Wallet {address: "bc1qm7vnx8e7htfduxgnxqm0u2v7w8n6h9uxrc260d"});
MERGE (w:Wallet {address: "bc1qysla7p7almv8ap7uz6r8ut8l0q0atylyp6dmum"});
MERGE (w:Wallet {address: "bc1qtc3xpy2x6920tfnmj8sxclq05wsz79pe3fv9w7"});
MERGE (w:Wallet {address: "bc1qyt8lx4hd7mhvaa2g5p7xstsfrnnrhpf0v4j00a"});
MERGE (w:Wallet {address: "bc1q9633httpx5dxaa2f24tze24mfgxj3763neu4s6"});
MERGE (w:Wallet {address: "1K3yLdW4hifewQzK2NfgGRSy7bCvzzhDWr"});
MERGE (w:Wallet {address: "bc1q5e70wc0d4xsc6hwx423f6r2zdcggshyz85pl36"});
MERGE (w:Wallet {address: "bc1qgz08pp54vdzesywcs4gpheejzqggyfmrvnegum"});
MERGE (w:Wallet {address: "bc1qllcs3kfzm7r5yjk6vzvks9x60xsks9mhr47kd9"});
MERGE (w:Wallet {address: "bc1qhvdls53tqf8gsrte6a0lj2n9hg9paa9gal5uay"});
MERGE (w:Wallet {address: "bc1qnc9g7e35vskw2ft8nx7qxjwa5vlyjkhvgx4x46"});
MERGE (w:Wallet {address: "bc1q6hmu9q3sdwlgn5dfpf643z566tl8f3mgyjw6a6"});
MERGE (w:Wallet {address: "bc1qjh97sagq4dcxhe8297fmq7ey3zwdgg5r68l03n"});
MERGE (w:Wallet {address: "1C6XJtNXiuXvk4oUAVMkKF57CRpaTrN5Ra"});
MERGE (w:Wallet {address: "bc1qxmael5d6ap8qyjzjrpuptzp99l89jtky949p7r"});
MERGE (w:Wallet {address: "bc1q2pug7tnfnqfwtx9fs35jhdvr05rv47qxv5d39s"});
MERGE (w:Wallet {address: "bc1q0qfzuge7vr5s2xkczrjkccmxemlyyn8mhx298v"});
MERGE (w:Wallet {address: "bc1qkvvv5fu2jlhl7pr42yr3aacs633vxdzlajkkf5"});
MERGE (w:Wallet {address: "bc1q5zu5h3eeuugd5tu6sx9y826c2mjgelwnef5zyl"});

// 4. Create Relationships
MATCH (a:Wallet {address: "bc1pgg64vxxr73dfs9afvzqz3thc34ftku08reuqqvhqkcsc5td8wysqdym79x"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778879105"}]->(b);
MATCH (a:Wallet {address: "bc1pgg64vxxr73dfs9afvzqz3thc34ftku08reuqqvhqkcsc5td8wysqdym79x"}), (b:Wallet {address: "bc1pgg64vxxr73dfs9afvzqz3thc34ftku08reuqqvhqkcsc5td8wysqdym79x"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778879105"}]->(b);
MATCH (a:Wallet {address: "bc1qvkl3zphd23hgh6qvc97q3kfwmfhyydgh5269h6"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778855602"}]->(b);
MATCH (a:Wallet {address: "bc1qvkl3zphd23hgh6qvc97q3kfwmfhyydgh5269h6"}), (b:Wallet {address: "bc1qzpharyxkygv5s9hu36f3ne5plqlremg9r7apsj"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778855602"}]->(b);
MATCH (a:Wallet {address: "bc1qsatlphjcgvzlt9xhsgn0dnjus5jgwg83dr05c6"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778731330"}]->(b);
MATCH (a:Wallet {address: "bc1qsatlphjcgvzlt9xhsgn0dnjus5jgwg83dr05c6"}), (b:Wallet {address: "bc1qsatlphjcgvzlt9xhsgn0dnjus5jgwg83dr05c6"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778731330"}]->(b);
MATCH (a:Wallet {address: "bc1qn3pazv75ft4npctu2u65tyctfspyemg6jgq2hh"}), (b:Wallet {address: "bc1qn3pazv75ft4npctu2u65tyctfspyemg6jgq2hh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778648942"}]->(b);
MATCH (a:Wallet {address: "bc1qn3pazv75ft4npctu2u65tyctfspyemg6jgq2hh"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778648942"}]->(b);
MATCH (a:Wallet {address: "bc1puz7x7c3ehqsz3mcn93dw4x48uwpt23xh3q0nty25m4l7fuqv9syqk5275k"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778516353"}]->(b);
MATCH (a:Wallet {address: "bc1q6csezzn2scerqudwkec77042ghjp2xlg63mlcn"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778506412"}]->(b);
MATCH (a:Wallet {address: "bc1q6csezzn2scerqudwkec77042ghjp2xlg63mlcn"}), (b:Wallet {address: "bc1qp42j7hn3lup7gck6y6eks6x2lmnp800t6gy7sk"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778506412"}]->(b);
MATCH (a:Wallet {address: "bc1q87vftuz2wzqwscmfssdj6tqxu98ypaqg40ry9w"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778506412"}]->(b);
MATCH (a:Wallet {address: "bc1q87vftuz2wzqwscmfssdj6tqxu98ypaqg40ry9w"}), (b:Wallet {address: "bc1qp42j7hn3lup7gck6y6eks6x2lmnp800t6gy7sk"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778506412"}]->(b);
MATCH (a:Wallet {address: "3KMmeqPeQcngyTehdfSwsGqvxfU7J7qtc8"}), (b:Wallet {address: "bc1q94qjej4wvqkegq0mh768yu07p8qe0lkl797825"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778345240"}]->(b);
MATCH (a:Wallet {address: "3KMmeqPeQcngyTehdfSwsGqvxfU7J7qtc8"}), (b:Wallet {address: "bc1qv4rypmjdu89tjvexcll23hzqhwhlnmpqtumdv8"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778345240"}]->(b);
MATCH (a:Wallet {address: "3KMmeqPeQcngyTehdfSwsGqvxfU7J7qtc8"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778345240"}]->(b);
MATCH (a:Wallet {address: "3KMmeqPeQcngyTehdfSwsGqvxfU7J7qtc8"}), (b:Wallet {address: "1LXJDmdPPy3CRK6syjdKiMFgpi1YmXJ1dE"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778345240"}]->(b);
MATCH (a:Wallet {address: "3KMmeqPeQcngyTehdfSwsGqvxfU7J7qtc8"}), (b:Wallet {address: "bc1qhd8z6yugwzx4v06m4jcseugay79dj25cjh0tqp"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778345240"}]->(b);
MATCH (a:Wallet {address: "3KMmeqPeQcngyTehdfSwsGqvxfU7J7qtc8"}), (b:Wallet {address: "bc1qspw23pm854szh8lne5fe2tuvnz9p73ghd72g8c"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778345240"}]->(b);
MATCH (a:Wallet {address: "3KMmeqPeQcngyTehdfSwsGqvxfU7J7qtc8"}), (b:Wallet {address: "1NU5AKhTrWhpA1UL82LyKVpVBKqHuR3hUo"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778345240"}]->(b);
MATCH (a:Wallet {address: "3KMmeqPeQcngyTehdfSwsGqvxfU7J7qtc8"}), (b:Wallet {address: "bc1qzeu2h5705zdtcectu2e7jjuvn320zj7mvhmngh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778345240"}]->(b);
MATCH (a:Wallet {address: "3KMmeqPeQcngyTehdfSwsGqvxfU7J7qtc8"}), (b:Wallet {address: "3KMmeqPeQcngyTehdfSwsGqvxfU7J7qtc8"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778345240"}]->(b);
MATCH (a:Wallet {address: "bc1q7lukxsshxfwr3ad02hkj7dv78jf3zssgqw7890"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778310827"}]->(b);
MATCH (a:Wallet {address: "bc1q7lukxsshxfwr3ad02hkj7dv78jf3zssgqw7890"}), (b:Wallet {address: "bc1q7lukxsshxfwr3ad02hkj7dv78jf3zssgqw7890"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778310827"}]->(b);
MATCH (a:Wallet {address: "bc1qh4q79rv3utrn8nu9eqwejzwsu6l4mlk97t0g5a"}), (b:Wallet {address: "bc1qr55rzly8ee7tmq2vjhy2c7jtek8n6m3k2rzcrg"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778065268"}]->(b);
MATCH (a:Wallet {address: "bc1qh4q79rv3utrn8nu9eqwejzwsu6l4mlk97t0g5a"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778065268"}]->(b);
MATCH (a:Wallet {address: "bc1qn4qjfz0hluwyaak5t7wdmgwvt6s927vjuddyk7"}), (b:Wallet {address: "bc1qr55rzly8ee7tmq2vjhy2c7jtek8n6m3k2rzcrg"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778065268"}]->(b);
MATCH (a:Wallet {address: "bc1qn4qjfz0hluwyaak5t7wdmgwvt6s927vjuddyk7"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778065268"}]->(b);
MATCH (a:Wallet {address: "bc1qlfa7xtj2camltej54dkl4sarzya6qq875qlrwx"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1778000684"}]->(b);
MATCH (a:Wallet {address: "bc1q823h6lxtfl6d5racm2exwnhndjf0g2az9z9zw4"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1777991984"}]->(b);
MATCH (a:Wallet {address: "bc1q823h6lxtfl6d5racm2exwnhndjf0g2az9z9zw4"}), (b:Wallet {address: "bc1q823h6lxtfl6d5racm2exwnhndjf0g2az9z9zw4"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1777991984"}]->(b);
MATCH (a:Wallet {address: "bc1qcyets2tyhyynukqxzudfss53r4k4xq8j5a3gp7"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1777910487"}]->(b);
MATCH (a:Wallet {address: "bc1qve5tx0y8xf99pmwflaw33qln8l0a5tm0xz8z8p"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1777629625"}]->(b);
MATCH (a:Wallet {address: "bc1qu4g0dq83alvp66myj6et2um787thh5jlyzyn0l"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1777300757"}]->(b);
MATCH (a:Wallet {address: "bc1qu4g0dq83alvp66myj6et2um787thh5jlyzyn0l"}), (b:Wallet {address: "bc1qx8mpvyhk098tnvxe67nj6tc5tf89vurxe6zluf"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1777300757"}]->(b);
MATCH (a:Wallet {address: "bc1qtdpa3fsgmd6wywjgf2feckq90uq8mfqs6qe6uu"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1777299078"}]->(b);
MATCH (a:Wallet {address: "bc1qtdpa3fsgmd6wywjgf2feckq90uq8mfqs6qe6uu"}), (b:Wallet {address: "bc1qs4el5kzymw4l88x6tpz644xlkryy84xexwwfvd"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1777299078"}]->(b);
MATCH (a:Wallet {address: "bc1qm7vnx8e7htfduxgnxqm0u2v7w8n6h9uxrc260d"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1777299078"}]->(b);
MATCH (a:Wallet {address: "bc1qm7vnx8e7htfduxgnxqm0u2v7w8n6h9uxrc260d"}), (b:Wallet {address: "bc1qs4el5kzymw4l88x6tpz644xlkryy84xexwwfvd"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1777299078"}]->(b);
MATCH (a:Wallet {address: "bc1qysla7p7almv8ap7uz6r8ut8l0q0atylyp6dmum"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1777299078"}]->(b);
MATCH (a:Wallet {address: "bc1qysla7p7almv8ap7uz6r8ut8l0q0atylyp6dmum"}), (b:Wallet {address: "bc1qs4el5kzymw4l88x6tpz644xlkryy84xexwwfvd"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1777299078"}]->(b);
MATCH (a:Wallet {address: "bc1qtc3xpy2x6920tfnmj8sxclq05wsz79pe3fv9w7"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1777230053"}]->(b);
MATCH (a:Wallet {address: "bc1qtc3xpy2x6920tfnmj8sxclq05wsz79pe3fv9w7"}), (b:Wallet {address: "bc1qyt8lx4hd7mhvaa2g5p7xstsfrnnrhpf0v4j00a"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1777230053"}]->(b);
MATCH (a:Wallet {address: "bc1q9633httpx5dxaa2f24tze24mfgxj3763neu4s6"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776928621"}]->(b);
MATCH (a:Wallet {address: "bc1q9633httpx5dxaa2f24tze24mfgxj3763neu4s6"}), (b:Wallet {address: "bc1q9633httpx5dxaa2f24tze24mfgxj3763neu4s6"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776928621"}]->(b);
MATCH (a:Wallet {address: "1K3yLdW4hifewQzK2NfgGRSy7bCvzzhDWr"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776678933"}]->(b);
MATCH (a:Wallet {address: "1K3yLdW4hifewQzK2NfgGRSy7bCvzzhDWr"}), (b:Wallet {address: "bc1q5e70wc0d4xsc6hwx423f6r2zdcggshyz85pl36"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776678933"}]->(b);
MATCH (a:Wallet {address: "bc1qgz08pp54vdzesywcs4gpheejzqggyfmrvnegum"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776647316"}]->(b);
MATCH (a:Wallet {address: "bc1qllcs3kfzm7r5yjk6vzvks9x60xsks9mhr47kd9"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776461222"}]->(b);
MATCH (a:Wallet {address: "bc1qllcs3kfzm7r5yjk6vzvks9x60xsks9mhr47kd9"}), (b:Wallet {address: "bc1qllcs3kfzm7r5yjk6vzvks9x60xsks9mhr47kd9"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776461222"}]->(b);
MATCH (a:Wallet {address: "bc1qhvdls53tqf8gsrte6a0lj2n9hg9paa9gal5uay"}), (b:Wallet {address: "bc1qnc9g7e35vskw2ft8nx7qxjwa5vlyjkhvgx4x46"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776285135"}]->(b);
MATCH (a:Wallet {address: "bc1qhvdls53tqf8gsrte6a0lj2n9hg9paa9gal5uay"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776285135"}]->(b);
MATCH (a:Wallet {address: "bc1q6hmu9q3sdwlgn5dfpf643z566tl8f3mgyjw6a6"}), (b:Wallet {address: "bc1qnc9g7e35vskw2ft8nx7qxjwa5vlyjkhvgx4x46"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776285135"}]->(b);
MATCH (a:Wallet {address: "bc1q6hmu9q3sdwlgn5dfpf643z566tl8f3mgyjw6a6"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776285135"}]->(b);
MATCH (a:Wallet {address: "bc1qjh97sagq4dcxhe8297fmq7ey3zwdgg5r68l03n"}), (b:Wallet {address: "bc1qnc9g7e35vskw2ft8nx7qxjwa5vlyjkhvgx4x46"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776285135"}]->(b);
MATCH (a:Wallet {address: "bc1qjh97sagq4dcxhe8297fmq7ey3zwdgg5r68l03n"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776285135"}]->(b);
MATCH (a:Wallet {address: "1C6XJtNXiuXvk4oUAVMkKF57CRpaTrN5Ra"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776203341"}]->(b);
MATCH (a:Wallet {address: "1C6XJtNXiuXvk4oUAVMkKF57CRpaTrN5Ra"}), (b:Wallet {address: "1C6XJtNXiuXvk4oUAVMkKF57CRpaTrN5Ra"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776203341"}]->(b);
MATCH (a:Wallet {address: "bc1qxmael5d6ap8qyjzjrpuptzp99l89jtky949p7r"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776192904"}]->(b);
MATCH (a:Wallet {address: "bc1qxmael5d6ap8qyjzjrpuptzp99l89jtky949p7r"}), (b:Wallet {address: "bc1q2pug7tnfnqfwtx9fs35jhdvr05rv47qxv5d39s"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776192904"}]->(b);
MATCH (a:Wallet {address: "bc1q0qfzuge7vr5s2xkczrjkccmxemlyyn8mhx298v"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776122310"}]->(b);
MATCH (a:Wallet {address: "bc1q0qfzuge7vr5s2xkczrjkccmxemlyyn8mhx298v"}), (b:Wallet {address: "bc1q0qfzuge7vr5s2xkczrjkccmxemlyyn8mhx298v"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776122310"}]->(b);
MATCH (a:Wallet {address: "bc1qkvvv5fu2jlhl7pr42yr3aacs633vxdzlajkkf5"}), (b:Wallet {address: "bc1q5zu5h3eeuugd5tu6sx9y826c2mjgelwnef5zyl"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776075589"}]->(b);
MATCH (a:Wallet {address: "bc1qkvvv5fu2jlhl7pr42yr3aacs633vxdzlajkkf5"}), (b:Wallet {address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"})
MERGE (a)-[:TRANSFERRED {amount: 0, timestamp: "1776075589"}]->(b);
