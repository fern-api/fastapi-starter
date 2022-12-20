# Fern FastAPI Starter

This repo is a starter repo for using Fern with FastAPI.

## Quick start

**Prerequisite:** Install [poetry](https://python-poetry.org/docs/).

Run the server:

```
poetry install
poetry run start
```

Hit the API:

```bash
# existing movie
curl --location --request GET 'localhost:8080/movies/titanic'

# missing movie
curl --location --request GET 'localhost:8080/movies/oceans-11'
```

## Changing the API

The API is defined using [Fern](https://www.buildwithfern.com/). The definition
lives in the [fern](fern/api/definition) directory. You can edit these YAML files
to update the API.

Most of this repo is generated code that's produced by Fern. You can regenerate
using the Fern CLI:

```
npm install -g fern
fern generate
```

This will output newly generated code to [src/fern_fastapi_starter/generated](src/fern_fastapi_starter/generated).

You will get mypy issues if your server doesn't implement the API correctly. If
your IDE isn't set up to work with mypy, you can use the command line:

```
poetry run mypy
```
