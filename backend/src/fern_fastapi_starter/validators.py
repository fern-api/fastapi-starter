

from fastapi import HTTPException
from .api.generated.resources.imdb.types.movie import Movie
from .api.generated.resources.imdb.types.movie import MovieId


@Movie.Validators.field("id")
def validate_id(id: MovieId, values: Movie.Partial) -> MovieId:
    if len(id.get_as_str()) == 0:
        raise HTTPException(400, "Id must not be empty")
    return id
