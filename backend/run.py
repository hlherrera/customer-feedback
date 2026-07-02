from app.config import load_settings
from app.main import create_app

settings = load_settings()
app = create_app()

if __name__ == "__main__":
    app.run(host=settings.host, port=settings.port)
