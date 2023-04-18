# This file was auto-generated by Fern from our API Definition.

from __future__ import annotations

import datetime as dt
import typing

import pydantic
import typing_extensions

from ....core.datetime_utils import serialize_datetime
from .inner_union import InnerUnion

T_Result = typing.TypeVar("T_Result")


class _Factory:
    def child(self, value: InnerUnion) -> OuterUnion:
        return OuterUnion(__root__=_OuterUnion.Child(**dict(value), type="child"))


class OuterUnion(pydantic.BaseModel):
    factory: typing.ClassVar[_Factory] = _Factory()

    def get_as_union(self) -> typing.Union[_OuterUnion.Child]:
        return self.__root__

    def visit(self, child: typing.Callable[[InnerUnion], T_Result]) -> T_Result:
        if self.__root__.type == "child":
            return child(self.__root__)

    __root__: typing_extensions.Annotated[typing.Union[_OuterUnion.Child], pydantic.Field(discriminator="type")]

    def json(self, **kwargs: typing.Any) -> str:
        kwargs_with_defaults: typing.Any = {"by_alias": True, "exclude_unset": True, **kwargs}
        return super().json(**kwargs_with_defaults)

    def dict(self, **kwargs: typing.Any) -> typing.Dict[str, typing.Any]:
        kwargs_with_defaults: typing.Any = {"by_alias": True, "exclude_unset": True, **kwargs}
        return super().dict(**kwargs_with_defaults)

    class Config:
        frozen = True
        extra = pydantic.Extra.forbid
        json_encoders = {dt.datetime: serialize_datetime}


class _OuterUnion:
    class Child(InnerUnion):
        type: typing_extensions.Literal["child"]

        class Config:
            frozen = True


OuterUnion.update_forward_refs()
