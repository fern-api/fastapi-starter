import { getObjectUtils } from "../object";
import { getObjectLikeUtils } from "../object-like";
import { getSchemaUtils } from "../schema-utils";
import { constructLazyBaseSchema, getMemoizedSchema } from "./lazy";
export function lazyObject(getter) {
    const baseSchema = {
        ...constructLazyBaseSchema(getter),
        _getRawProperties: async () => (await getMemoizedSchema(getter))._getRawProperties(),
        _getParsedProperties: async () => (await getMemoizedSchema(getter))._getParsedProperties(),
    };
    return {
        ...baseSchema,
        ...getSchemaUtils(baseSchema),
        ...getObjectLikeUtils(baseSchema),
        ...getObjectUtils(baseSchema),
    };
}
