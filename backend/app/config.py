from dataclasses import dataclass
from os import getenv

from dotenv import load_dotenv

DEFAULT_API_PREFIX = "/api"
DEFAULT_DATABASE_URL = "sqlite+pysqlite:///./feedback.db"
DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8000
EMAIL_PATTERN = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
HIGHLIGHTS = ("Food", "Coffee", "Service", "Atmosphere")
MAX_COMMENT_LENGTH = 1000
MAX_RATING = 5
MIN_COMMENT_LENGTH = 1
MIN_RATING = 1


@dataclass(frozen=True)
class Settings:
    database_url: str
    host: str
    port: int


def load_settings() -> Settings:
    load_dotenv()
    return Settings(
        database_url=getenv("DATABASE_URL", DEFAULT_DATABASE_URL),
        host=getenv("APP_HOST", DEFAULT_HOST),
        port=int(getenv("APP_PORT", str(DEFAULT_PORT))),
    )
