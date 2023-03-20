import { SchemaType } from "../../Schema";
import { getSchemaUtils } from "../schema-utils";
export function undiscriminatedUnion(schemas) {
    const baseSchema = {
        parse: async (raw, opts) => {
            return validateAndTransformUndiscriminatedUnion((schema) => schema.parse(raw, opts), schemas);
        },
        json: async (parsed, opts) => {
            return validateAndTransformUndiscriminatedUnion((schema) => schema.json(parsed, opts), schemas);
        },
        getType: () => SchemaType.UNDISCRIMINATED_UNION,
    };
    return {
        ...baseSchema,
        ...getSchemaUtils(baseSchema),
    };
}
async function validateAndTransformUndiscriminatedUnion(transform, schemas) {
    const errors = [];
    for (const schema of schemas) {
        const transformed = await transform(schema);
        if (transformed.ok) {
            return transformed;
        }
        else if (errors.length === 0) {
            errors.push(...transformed.errors);
        }
    }
    return {
        ok: false,
        errors,
    };
}
