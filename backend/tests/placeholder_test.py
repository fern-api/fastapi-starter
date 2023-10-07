from fern_fastapi_starter.validators import * # noqa
from fern_fastapi_starter.api.generated.resources.imdb.types.movie import Movie


def test_placeholder() -> None:
    Movie(id="", title="My title", rating=0.0)
