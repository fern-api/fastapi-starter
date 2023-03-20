import { SchemaType } from "../../Schema";
import { entries } from "../../utils/entries";
import { filterObject } from "../../utils/filterObject";
import { isPlainObject, NOT_AN_OBJECT_ERROR_MESSAGE } from "../../utils/isPlainObject";
import { keys } from "../../utils/keys";
import { partition } from "../../utils/partition";
import { getObjectLikeUtils } from "../object-like";
import { getSchemaUtils } from "../schema-utils";
import { isProperty } from "./property";
export function object(schemas) {
    const baseSchema = {
        _getRawProperties: () => Promise.resolve(Object.entries(schemas).map(([parsedKey, propertySchema]) => isProperty(propertySchema) ? propertySchema.rawKey : parsedKey)),
        _getParsedProperties: () => Promise.resolve(keys(schemas)),
        parse: async (raw, opts) => {
            const rawKeyToProperty = {};
            const requiredKeys = [];
            for (const [parsedKey, schemaOrObjectProperty] of entries(schemas)) {
                const rawKey = isProperty(schemaOrObjectProperty) ? schemaOrObjectProperty.rawKey : parsedKey;
                const valueSchema = isProperty(schemaOrObjectProperty)
                    ? schemaOrObjectProperty.valueSchema
                    : schemaOrObjectProperty;
                const property = {
                    rawKey,
                    parsedKey: parsedKey,
                    valueSchema,
                };
                rawKeyToProperty[rawKey] = property;
                if (await isSchemaRequired(valueSchema)) {
                    requiredKeys.push(rawKey);
                }
            }
            return validateAndTransformObject({
                value: raw,
                requiredKeys,
                getProperty: (rawKey) => {
                    const property = rawKeyToProperty[rawKey];
                    if (property == null) {
                        return undefined;
                    }
                    return {
                        transformedKey: property.parsedKey,
                        transform: (propertyValue) => property.valueSchema.parse(propertyValue, opts),
                    };
                },
                unrecognizedObjectKeys: opts?.unrecognizedObjectKeys,
            });
        },
        json: async (parsed, opts) => {
            const requiredKeys = [];
            for (const [parsedKey, schemaOrObjectProperty] of entries(schemas)) {
                const valueSchema = isProperty(schemaOrObjectProperty)
                    ? schemaOrObjectProperty.valueSchema
                    : schemaOrObjectProperty;
                if (await isSchemaRequired(valueSchema)) {
                    requiredKeys.push(parsedKey);
                }
            }
            return validateAndTransformObject({
                value: parsed,
                requiredKeys,
                getProperty: (parsedKey) => {
                    const property = schemas[parsedKey];
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    if (property == null) {
                        return undefined;
                    }
                    if (isProperty(property)) {
                        return {
                            transformedKey: property.rawKey,
                            transform: (propertyValue) => property.valueSchema.json(propertyValue, opts),
                        };
                    }
                    else {
                        return {
                            transformedKey: parsedKey,
                            transform: (propertyValue) => property.json(propertyValue, opts),
                        };
                    }
                },
                unrecognizedObjectKeys: opts?.unrecognizedObjectKeys,
            });
        },
        getType: () => SchemaType.OBJECT,
    };
    return {
        ...baseSchema,
        ...getSchemaUtils(baseSchema),
        ...getObjectLikeUtils(baseSchema),
        ...getObjectUtils(baseSchema),
    };
}
async function validateAndTransformObject({ value, requiredKeys, getProperty, unrecognizedObjectKeys = "fail", }) {
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
    const missingRequiredKeys = new Set(requiredKeys);
    const errors = [];
    const transformed = {};
    for (const [preTransformedKey, preTransformedItemValue] of Object.entries(value)) {
        const property = getProperty(preTransformedKey);
        if (property != null) {
            missingRequiredKeys.delete(preTransformedKey);
            const value = await property.transform(preTransformedItemValue);
            if (value.ok) {
                transformed[property.transformedKey] = value.value;
            }
            else {
                errors.push(...value.errors.map((error) => ({
                    path: [preTransformedKey, ...error.path],
                    message: error.message,
                })));
            }
        }
        else {
            switch (unrecognizedObjectKeys) {
                case "fail":
                    errors.push({
                        path: [preTransformedKey],
                        message: `Unrecognized key "${preTransformedKey}"`,
                    });
                    break;
                case "strip":
                    break;
                case "passthrough":
                    transformed[preTransformedKey] = preTransformedItemValue;
                    break;
            }
        }
    }
    errors.push(...requiredKeys
        .filter((key) => missingRequiredKeys.has(key))
        .map((key) => ({
        path: [],
        message: `Missing required key "${key}"`,
    })));
    if (errors.length === 0) {
        return {
            ok: true,
            value: transformed,
        };
    }
    else {
        return {
            ok: false,
            errors,
        };
    }
}
export function getObjectUtils(schema) {
    return {
        extend: (extension) => {
            const baseSchema = {
                _getParsedProperties: async () => [
                    ...(await schema._getParsedProperties()),
                    ...(await extension._getParsedProperties()),
                ],
                _getRawProperties: async () => [
                    ...(await schema._getRawProperties()),
                    ...(await extension._getRawProperties()),
                ],
                parse: async (raw, opts) => {
                    return validateAndTransformExtendedObject({
                        extensionKeys: await extension._getRawProperties(),
                        value: raw,
                        transformBase: (rawBase) => schema.parse(rawBase, opts),
                        transformExtension: (rawExtension) => extension.parse(rawExtension, opts),
                    });
                },
                json: async (parsed, opts) => {
                    return validateAndTransformExtendedObject({
                        extensionKeys: await extension._getParsedProperties(),
                        value: parsed,
                        transformBase: (parsedBase) => schema.json(parsedBase, opts),
                        transformExtension: (parsedExtension) => extension.json(parsedExtension, opts),
                    });
                },
                getType: () => SchemaType.OBJECT,
            };
            return {
                ...baseSchema,
                ...getSchemaUtils(baseSchema),
                ...getObjectLikeUtils(baseSchema),
                ...getObjectUtils(baseSchema),
            };
        },
    };
}
async function validateAndTransformExtendedObject({ extensionKeys, value, transformBase, transformExtension, }) {
    const extensionPropertiesSet = new Set(extensionKeys);
    const [extensionProperties, baseProperties] = partition(keys(value), (key) => extensionPropertiesSet.has(key));
    const transformedBase = await transformBase(filterObject(value, baseProperties));
    const transformedExtension = await transformExtension(filterObject(value, extensionProperties));
    if (transformedBase.ok && transformedExtension.ok) {
        return {
            ok: true,
            value: {
                ...transformedBase.value,
                ...transformedExtension.value,
            },
        };
    }
    else {
        return {
            ok: false,
            errors: [
                ...(transformedBase.ok ? [] : transformedBase.errors),
                ...(transformedExtension.ok ? [] : transformedExtension.errors),
            ],
        };
    }
}
async function isSchemaRequired(schema) {
    return !(await isSchemaOptional(schema));
}
async function isSchemaOptional(schema) {
    switch (await schema.getType()) {
        case SchemaType.ANY:
        case SchemaType.UNKNOWN:
        case SchemaType.OPTIONAL:
            return true;
        default:
            return false;
    }
}
