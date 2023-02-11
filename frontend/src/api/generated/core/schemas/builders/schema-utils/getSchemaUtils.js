import { SchemaType } from "../../Schema";
import { JsonError } from "./JsonError";
import { ParseError } from "./ParseError";
export function getSchemaUtils(schema) {
    return {
        optional: () => optional(schema),
        transform: (transformer) => transform(schema, transformer),
        parseOrThrow: async (raw, opts) => {
            const parsed = await schema.parse(raw, opts);
            if (parsed.ok) {
                return parsed.value;
            }
            throw new ParseError(parsed.errors);
        },
        jsonOrThrow: async (parsed, opts) => {
            const raw = await schema.json(parsed, opts);
            if (raw.ok) {
                return raw.value;
            }
            throw new JsonError(raw.errors);
        },
    };
}
/**
 * schema utils are defined in one file to resolve issues with circular imports
 */
export function optional(schema) {
    const baseSchema = {
        parse: (raw, opts) => {
            if (raw == null) {
                return {
                    ok: true,
                    value: undefined,
                };
            }
            return schema.parse(raw, opts);
        },
        json: (parsed, opts) => {
            if (parsed == null) {
                return {
                    ok: true,
                    value: null,
                };
            }
            return schema.json(parsed, opts);
        },
        getType: () => SchemaType.OPTIONAL,
    };
    return {
        ...baseSchema,
        ...getSchemaUtils(baseSchema),
    };
}
export function transform(schema, transformer) {
    const baseSchema = {
        parse: async (raw, opts) => {
            const parsed = await schema.parse(raw, opts);
            if (!parsed.ok) {
                return parsed;
            }
            return {
                ok: true,
                value: transformer.transform(parsed.value),
            };
        },
        json: async (transformed, opts) => {
            const parsed = await transformer.untransform(transformed);
            return schema.json(parsed, opts);
        },
        getType: () => schema.getType(),
    };
    return {
        ...baseSchema,
        ...getSchemaUtils(baseSchema),
    };
}
