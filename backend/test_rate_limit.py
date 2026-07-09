# Smallest check that fails if the limiter logic breaks: run with `python test_rate_limit.py`
import os

os.environ.setdefault("DATABASE_URL", "sqlite://")  # import da app sem Postgres local
os.environ.setdefault("JWT_SECRET", "test")

from types import SimpleNamespace

from fastapi import HTTPException

from app import messages


def fake_request(ip: str):
    return SimpleNamespace(client=SimpleNamespace(host=ip))


messages._hits.clear()
for _ in range(messages.RATE_LIMIT):
    messages.check_rate_limit(fake_request("1.2.3.4"))  # under the limit: passes

try:
    messages.check_rate_limit(fake_request("1.2.3.4"))
    raise AssertionError("6th request should have been rate-limited")
except HTTPException as e:
    assert e.status_code == 429

messages.check_rate_limit(fake_request("5.6.7.8"))  # other IPs unaffected
print("ok")
