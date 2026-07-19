from __future__ import annotations

from pathlib import Path

import pytest

from app import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config.update(TESTING=True)
    with app.test_client() as test_client:
        yield test_client


def test_log_writes_message(client, monkeypatch, tmp_path):
    log_file = tmp_path / "app.log"
    monkeypatch.setenv("LOG_FILE", str(log_file))

    response = client.post("/log", json={"message": "hello"})

    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}
    assert log_file.read_text(encoding="utf-8") == "hello\n"


def test_log_requires_log_file_env(client, monkeypatch):
    monkeypatch.delenv("LOG_FILE", raising=False)

    response = client.post("/log", json={"message": "hello"})

    assert response.status_code == 500
    assert "LOG_FILE" in response.get_json()["error"]


def test_get_content_returns_file_text(client, tmp_path):
    content_file = tmp_path / "content.txt"
    content_file.write_text("sample", encoding="utf-8")

    response = client.get("/getContent", query_string={"path": str(content_file)})

    assert response.status_code == 200
    assert response.data.decode("utf-8") == "sample"


def test_get_content_requires_path(client):
    response = client.get("/getContent")

    assert response.status_code == 400
    assert "path" in response.get_json()["error"]


def test_get_content_returns_error_for_missing_file(client, tmp_path):
    missing_file = tmp_path / "missing.txt"

    response = client.get("/getContent", query_string={"path": str(missing_file)})

    assert response.status_code == 500
    assert "Unable to read file" in response.get_json()["error"]


def test_version_returns_semver_with_v_prefix(client):
    response = client.get("/version")

    assert response.status_code == 200
    assert response.get_json() == {"version": "v1.0.0"}


def test_health_returns_timestamp(client):
    response = client.get("/health")

    assert response.status_code == 200
    body = response.get_json()
    assert "timestamp" in body
    assert body["timestamp"].endswith("+00:00")
