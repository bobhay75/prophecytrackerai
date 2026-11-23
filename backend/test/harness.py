"""Isolated native PHP test server. Never copied into the release package."""
import contextlib
import json
import os
import pathlib
import shutil
import socket
import sqlite3
import subprocess
import tempfile
import time
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]

def fixture():
    now = int(time.time() * 1000)
    def event(identifier, magnitude, place, timestamp):
        return {"type": "Feature", "id": identifier, "properties": {"mag": magnitude, "place": place, "time": timestamp, "url": "https://earthquake.usgs.gov/earthquakes/eventpage/" + identifier, "status": "reviewed"}, "geometry": {"coordinates": [-92, 37, 8]}}
    return {"type": "FeatureCollection", "metadata": {"generated": now}, "features": [event("fixture-missouri", 4.7, "12 km from Missouri", now), event("fixture-alaska", 6.1, "Alaska", now), event("fixture-previous", 4.9, "Missouri", now-2*86400000)]}

def seed(directory):
    db = sqlite3.connect(str(pathlib.Path(directory) / "data/prophecy.sqlite"))
    data = fixture()
    for period in ("day", "week"):
        selected = dict(data)
        selected["features"] = data["features"][:2] if period == "day" else data["features"]
        db.execute("INSERT OR REPLACE INTO cache(name,value,stored_at) VALUES(?,?,?)", ("feed:"+period, json.dumps(selected), int(time.time())))
    db.commit()
    db.close()
    return data

@contextlib.contextmanager
def server(port=0, web=None, base="", development=True):
    with tempfile.TemporaryDirectory(prefix="prophecy-http-") as tmp:
        tmp = pathlib.Path(tmp)
        private = tmp / "prophecy-private"
        public = tmp / "public_html"
        shutil.copytree(ROOT / "backend/src", private)
        private.chmod(0o700)
        public.mkdir()
        target = public / base.lstrip("/")
        if web:
            shutil.copytree(web, target, dirs_exist_ok=True)
        target.mkdir(exist_ok=True, parents=True)
        (target / "api").mkdir(exist_ok=True)
        shutil.copy(ROOT / "backend/public/index.php", target / "api/index.php")
        if not port:
            with socket.socket() as sock:
                sock.bind(("127.0.0.1", 0))
                port = sock.getsockname()[1]
        origin = f"http://127.0.0.1:{port}"
        configured_origin = origin if development else origin.replace("http://", "https://", 1)
        settings = f"<?php return ['origin'=>'{configured_origin}','base_path'=>'{base}','development'=>{'true' if development else 'false'}];"
        (private / "config.local.php").write_text(settings)
        (private / "config.local.php").chmod(0o600)
        php = os.environ.get("PROPHECY_PHP", "php")
        subprocess.run([php, str(private / "console.php"), "check"], check=True, capture_output=True)
        seed(private)
        env = {**os.environ, "PROPHECY_PRIVATE_DIR": str(private)}
        with open(tmp / "server.log", "wb") as log:
            proc = subprocess.Popen([php, "-S", f"127.0.0.1:{port}", "-t", str(public)], env=env, stdout=log, stderr=log)
            try:
                for _ in range(100):
                    if proc.poll() is not None:
                        raise RuntimeError("Native PHP server exited: " + (tmp / "server.log").read_text())
                    try:
                        with urllib.request.urlopen(origin + base + "/api/index.php?action=health", timeout=1) as response:
                            if response.status == 200:
                                break
                    except urllib.error.HTTPError as error:
                        if not development and error.code == 426:
                            break
                        time.sleep(.05)
                    except OSError:
                        time.sleep(.05)
                else:
                    raise RuntimeError("Native PHP server did not become ready")
                yield {"origin": origin, "base": base, "private": str(private), "public": str(public), "port": port}
            finally:
                proc.terminate()
                try:
                    proc.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    proc.kill()
                    proc.wait(timeout=5)
