from app.repositories.cafe_repository import CafeData, CafeRepository, CafeRow


class CafePersistenceService:
    def __init__(self, repository: CafeRepository) -> None:
        self._repository = repository

    def get_cafe(self, cafe_id: int) -> CafeRow | None:
        return self._repository.get(cafe_id)

    def list_cafes(self) -> list[CafeRow]:
        return self._repository.list()

    def seed_cafes(self, cafes: tuple[CafeData, ...]) -> None:
        self._repository.seed_missing(cafes)
