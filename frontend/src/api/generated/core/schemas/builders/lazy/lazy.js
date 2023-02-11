import { getSchemaUtils } from "../schema-utils";
export function lazy(getter) {
    const baseSchema = constructLazyBaseSchema(getter);
    return {
        ...baseSchema,
        ...getSchemaUtils(baseSchema),
    };
}
export function constructLazyBaseSchema(getter) {
    return {
        parse: async (raw, opts) => (await getMemoizedSchema(getter)).parse(raw, opts),
        json: async (parsed, opts) => (await getMemoizedSchema(getter)).json(parsed, opts),
        getType: async () => (await getMemoizedSchema(getter)).getType(),
    };
}
export async function getMemoizedSchema(getter) {
    const castedGetter = getter;
    if (castedGetter.__zurg_memoized == null) {
        castedGetter.__zurg_memoized = await getter();
    }
    return castedGetter.__zurg_memoized;
}
