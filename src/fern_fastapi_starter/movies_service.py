from .generated.fern import AbstractMoviesService, Movie


class MoviesService(AbstractMoviesService):
    def get_movie(self, *, movie_id: str) -> Movie:
        return 42
