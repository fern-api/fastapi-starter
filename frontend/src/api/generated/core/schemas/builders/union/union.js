import { SchemaType } from "../../Schema";
import { isPlainObject, NOT_AN_OBJECT_ERROR_MESSAGE } from "../../utils/isPlainObject";
import { keys } from "../../utils/keys";
import { enum_ } from "../enum";
import { getObjectLikeUtils } from "../object-like";
import { getSchemaUtils } from "../schema-utils";
export function union(discriminant, union) {
    const rawDiscriminant = typeof discriminant === "string" ? discriminant : discriminant.rawDiscriminant;
    const parsedDiscriminant = typeof discriminant === "string"
        ? discriminant
        : discriminant.parsedDiscriminant;
    const discriminantValueSchema = enum_(keys(union));
    const baseSchema = {
        parse: async (raw, opts) => {
            return transformAndValidateUnion(raw, rawDiscriminant, parsedDiscriminant, (discriminantValue) => discriminantValueSchema.parse(discriminantValue, opts), (discriminantValue) => union[discriminantValue], opts?.allowUnknownKeys ?? false, (additionalProperties, additionalPropertiesSchema) => additionalPropertiesSchema.parse(additionalProperties, opts));
        },
        json: async (parsed, opts) => {
            return transformAndValidateUnion(parsed, parsedDiscriminant, rawDiscriminant, (discriminantValue) => discriminantValueSchema.json(discriminantValue, opts), (discriminantValue) => union[discriminantValue], opts?.allowUnknownKeys ?? false, (additionalProperties, additionalPropertiesSchema) => additionalPropertiesSchema.json(additionalProperties, opts));
        },
        getType: () => SchemaType.UNION,
    };
    return {
        ...baseSchema,
        ...getSchemaUtils(baseSchema),
        ...getObjectLikeUtils(baseSchema),
    };
}
async function transformAndValidateUnion(value, discriminant, transformedDiscriminant, transformDiscriminantValue, getAdditionalPropertiesSchema, allowUnknownKeys, transformAdditionalProperties) {
    if (!isPlainObject(value)) {
        return {
            ok: false,
            errors: [
                {
                    path: [],
                    message: NOT_AN_OBJECT_ERROR_MESSAGE,
                },
            ],
        };
    }
    const { [discriminant]: discriminantValue, ...additionalProperties } = value;
    if (discriminantValue == null) {
        return {
            ok: false,
            errors: [
                {
                    path: [],
                    message: `Missing discriminant ("${discriminant}")`,
                },
            ],
        };
    }
    const transformedDiscriminantValue = await transformDiscriminantValue(discriminantValue);
    if (!transformedDiscriminantValue.ok) {
        return {
            ok: false,
            errors: transformedDiscriminantValue.errors.map((error) => ({
                path: [discriminant, ...error.path],
                message: error.message,
            })),
        };
    }
    const additionalPropertiesSchema = getAdditionalPropertiesSchema(transformedDiscriminantValue.value);
    if (additionalPropertiesSchema == null) {
        if (allowUnknownKeys) {
            return {
                ok: true,
                value: {
                    [transformedDiscriminant]: transformedDiscriminantValue.value,
                    ...additionalProperties,
                },
            };
        }
        else {
            return {
                ok: false,
                errors: [
                    {
                        path: [discriminant],
                        message: "Unrecognized discriminant value",
                    },
                ],
            };
        }
    }
    const transformedAdditionalProperties = await transformAdditionalProperties(additionalProperties, additionalPropertiesSchema);
    if (!transformedAdditionalProperties.ok) {
        return transformedAdditionalProperties;
    }
    return {
        ok: true,
        value: {
            [transformedDiscriminant]: discriminantValue,
            ...transformedAdditionalProperties.value,
        },
    };
}
