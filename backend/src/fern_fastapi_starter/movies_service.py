from .api.generated.resources.imdb.service.service import AbstractImdbService
from .api.generated import Movie, MovieId


class MoviesService(AbstractImdbService):
    def get_movie(self, *, movie_id: str) -> Movie:
        return Movie(
            title="Goodwill Hunting",
            rating=9.8,
            id=MovieId.from_str("tt0119217"),
        )
