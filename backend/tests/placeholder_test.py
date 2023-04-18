from fern_fastapi_starter.api.generated.resources.imdb.types.inner_union import InnerUnion
from fern_fastapi_starter.api.generated.resources.imdb.types.outer_union import OuterUnion


def test_placeholder() -> None:
    pass


def test_union() -> None:
    parent_patch = OuterUnion.factory.child(InnerUnion(field_a="asdf"))

    def child_visitor(child_patch: InnerUnion) -> None:
        child_patch_dict = child_patch.dict(exclude_unset=True)
        assert "field_b" not in child_patch_dict  # AssertionError!

    parent_patch.visit(child=child_visitor)
