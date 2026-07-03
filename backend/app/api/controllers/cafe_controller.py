import asyncio

from app.services.cafe_service import CafePersistenceService


class CafeController:
    def __init__(self, persistence_service: CafePersistenceService) -> None:
        self._persistence_service = persistence_service

    async def list_cafes(self):
        return await asyncio.to_thread(self._persistence_service.list_cafes), 200
