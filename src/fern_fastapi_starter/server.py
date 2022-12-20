import uvicorn
from fastapi import FastAPI

from .generated.fern.register import register
from .movies_service import MoviesService

app = FastAPI()

register(app, imdb=MoviesService())


def start() -> None:
    uvicorn.run(
        "src.fern_fastapi_starter.server:app",
        host="0.0.0.0",
        port=8080,
        reload=True,
    )


if __name__ == "__main__":
    start()
