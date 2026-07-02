from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BACKEND = ROOT / "backend"
FRONTEND = ROOT / "frontend-spa"


def run(command: list[str], cwd: Path) -> int:
    print(f"$ {' '.join(command)}")
    return subprocess.run(command, cwd=cwd).returncode


def backend(command: str) -> int:
    commands = {
        "ruff-check": ["uv", "run", "ruff", "check", "--fix", "."],
        "ruff-format": ["uv", "run", "ruff", "format", "."],
        "pyrefly": ["uv", "run", "pyrefly", "check"],
        "vulture": ["uv", "run", "vulture"],
        "pytest": ["uv", "run", "pytest"],
    }

    if command not in commands:
        print(f"Unknown backend command: {command}", file=sys.stderr)
        return 2

    return run(commands[command], BACKEND)


def frontend(script_name: str) -> int:
    package_json = FRONTEND / "package.json"
    if not package_json.exists():
        print(f"Skipping frontend {script_name}: frontend-spa/package.json not found")
        return 0

    with package_json.open(encoding="utf-8") as package_file:
        package = json.load(package_file)

    scripts = package.get("scripts", {})
    if script_name not in scripts:
        print(f"Skipping frontend {script_name}: npm script not found")
        return 0

    return run(["npm", "run", script_name], FRONTEND)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("project", choices=["backend", "frontend"])
    parser.add_argument("command")
    args = parser.parse_args()

    if args.project == "backend":
        return backend(args.command)
    return frontend(args.command)


if __name__ == "__main__":
    raise SystemExit(main())
