from .generated.fern import (
    AbstractMoviesService,
    Movie,
    MovieDoesNotExistError,
    MovieId,
)


class MoviesService(AbstractMoviesService):
    def get_movie(self, *, movie_id: str) -> Movie:
        if movie_id == "titanic":
            return Movie(
                id=MovieId.from_str("titantic"),
                title="Titanic",
                rating=9.8,
            )
        raise MovieDoesNotExistError(MovieId.from_str(movie_id))
