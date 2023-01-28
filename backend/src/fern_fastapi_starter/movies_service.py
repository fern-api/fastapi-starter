from .api.generated import AbstractMoviesService, Movie, MovieId


class MoviesService(AbstractMoviesService):
    def get_movie(self, *, movie_id: str) -> Movie:
        return Movie(
            title="Goodwill Hunting",
            rating=9.8,
            id=MovieId.from_str("tt0119217"),
        )
