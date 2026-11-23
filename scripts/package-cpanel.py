"""Build a split public/private cPanel release from already validated source."""
import hashlib
import json
import pathlib
import shutil
import subprocess
import zipfile

root = pathlib.Path(__file__).resolve().parents[1]
out = root / "frontend/out"
assert (out / "index.html").is_file(), "Run the /prophecy frontend production build first"
html = (out / "index.html").read_text()
assert '/prophecy/_next/' in html, "This release must be built with NEXT_PUBLIC_BASE_PATH=/prophecy"
release = root / "prophecy-release"
if release.exists():
    shutil.rmtree(release)
release.mkdir()
shutil.copytree(out, release / "public")
(release / "public/api").mkdir()
shutil.copy(root / "backend/public/index.php", release / "public/api/index.php")
(release / "public/api/.htaccess").write_text("Options -Indexes\nDirectoryIndex index.php\n<FilesMatch \"^(?!index\\.php$).*\">\n  Require all denied\n</FilesMatch>\n")
(release / "private").mkdir()
for name in ("bootstrap.php", "config.php", "service.php", "payments.php", "analysis.php", "console.php"):
    shutil.copy(root / "backend/src" / name, release / "private" / name)
shutil.copy(root / "backend/config.example.php", release / "private/config.example.php")
shutil.copy(root / "docs/CPANEL-INSTALL.md", release / "INSTALL.md")
files = []
for path in sorted(release.rglob("*")):
    if not path.is_file():
        continue
    relative = path.relative_to(release).as_posix()
    assert not any(part in ("node_modules", ".git", "data", "sessions", "test") for part in path.relative_to(release).parts)
    assert path.name not in ("config.local.php", "admin_access_info.txt")
    assert path.suffix not in (".sqlite", ".db", ".log", ".key", ".pem")
    files.append({"path": relative, "bytes": path.stat().st_size, "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
manifest = {"schema": 1, "base_path": "/prophecy", "commit": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=root, text=True).strip(), "dirty_source": bool(subprocess.check_output(["git", "status", "--porcelain"], cwd=root, text=True).strip()), "files": files}
(release / "manifest.json").write_text(json.dumps(manifest, indent=2)+"\n")
archive = root / "prophecytracker-cpanel-release.zip"
with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as target:
    for path in sorted(release.rglob("*")):
        if path.is_file():
            target.write(path, path.relative_to(release))
print(json.dumps({"public_files": sum(x["path"].startswith("public/") for x in files), "private_files": sum(x["path"].startswith("private/") for x in files), "archive": str(archive), "bytes": archive.stat().st_size, "sha256": hashlib.sha256(archive.read_bytes()).hexdigest(), "dirty_source": manifest["dirty_source"]}))
