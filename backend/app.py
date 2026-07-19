from __future__ import annotations

import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import tomllib
from flask import Flask, jsonify, request

DEFAULT_VERSION = "1.0.0"


def load_api_version() -> str:
    pyproject_path = Path(__file__).with_name("pyproject.toml")
    try:
        with pyproject_path.open("rb") as file_obj:
            project_data = tomllib.load(file_obj)
        version = str(project_data["project"]["version"])
    except (FileNotFoundError, KeyError, OSError, tomllib.TOMLDecodeError):
        version = DEFAULT_VERSION

    return version if version.startswith("v") else f"v{version}"


def create_app() -> Flask:
    app = Flask(__name__)

    @app.post("/log")
    def write_log() -> tuple[dict[str, Any], int]:
        payload = request.get_json(silent=True)
        message = payload.get("message") if isinstance(payload, dict) else None
        if not isinstance(message, str) or not message:
            return jsonify({"error": "A non-empty string 'message' is required."}), 400

        log_file = os.getenv("LOG_FILE")
        if not log_file:
            return jsonify({"error": "LOG_FILE environment variable is not set."}), 500

        try:
            log_path = Path(log_file)
            log_path.parent.mkdir(parents=True, exist_ok=True)
            with log_path.open("a", encoding="utf-8") as file_obj:
                file_obj.write(message + "\n")
        except OSError as exc:
            return jsonify({"error": f"Unable to write log file: {exc}"}), 500

        return jsonify({"status": "ok"}), 200

    @app.get("/getContent")
    def get_content() -> tuple[Any, int] | Any:
        path_value = request.args.get("path", type=str)
        if not path_value:
            return jsonify({"error": "Query parameter 'path' is required."}), 400

        try:
            content = Path(path_value).read_text(encoding="utf-8")
        except OSError as exc:
            return jsonify({"error": f"Unable to read file: {exc}"}), 500

        return content, 200, {"Content-Type": "text/plain; charset=utf-8"}

    @app.get("/version")
    def get_version() -> tuple[dict[str, str], int]:
        return jsonify({"version": load_api_version()}), 200

    @app.get("/health")
    def get_health() -> tuple[dict[str, str], int]:
        timestamp = datetime.now(timezone.utc).isoformat()
        return jsonify({"timestamp": timestamp}), 200

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
