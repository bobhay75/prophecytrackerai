import json
from harness import ROOT, seed
host = json.loads((ROOT / "frontend/.test-runtime.json").read_text())
print(json.dumps(seed(host["private"])))
