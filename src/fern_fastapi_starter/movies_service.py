from .generated import fern


class MoviesService(fern.AbstractMoviesService):
    def get_movie(self, *, movie_id: str) -> fern.Movie:
        if movie_id == "titanic":
            return fern.Movie(id=fern.MovieId.from_str("titantic"), title="Titanic", rating=9.8)
        else:
            raise fern.MovieDoesNotExistError(fern.MovieId.from_str(movie_id))
