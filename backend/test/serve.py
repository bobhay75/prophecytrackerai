import argparse
import json
import pathlib
import signal
import time
from harness import ROOT, server

parser = argparse.ArgumentParser()
parser.add_argument("--port", type=int, default=8097)
args = parser.parse_args()
metadata = ROOT / "frontend/.test-runtime.json"
try:
    with server(port=args.port, web=ROOT/"frontend/out", base="/prophecy") as host:
        metadata.write_text(json.dumps(host))
        signal.signal(signal.SIGTERM, lambda *_: (_ for _ in ()).throw(KeyboardInterrupt()))
        print("Isolated browser-test server ready", flush=True)
        while True:
            time.sleep(1)
except KeyboardInterrupt:
    pass
finally:
    metadata.unlink(missing_ok=True)
