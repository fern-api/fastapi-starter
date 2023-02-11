import { filterObject } from "../../utils/filterObject";
import { isPlainObject, NOT_AN_OBJECT_ERROR_MESSAGE } from "../../utils/isPlainObject";
import { getSchemaUtils } from "../schema-utils";
export function getObjectLikeUtils(schema) {
    return {
        withParsedProperties: (properties) => withParsedProperties(schema, properties),
    };
}
/**
 * object-like utils are defined in one file to resolve issues with circular imports
 */
export function withParsedProperties(objectLike, properties) {
    const objectSchema = {
        parse: async (raw, opts) => {
            const parsedObject = await objectLike.parse(raw, opts);
            if (!parsedObject.ok) {
                return parsedObject;
            }
            const additionalProperties = Object.entries(properties).reduce((processed, [key, value]) => {
                return {
                    ...processed,
                    [key]: typeof value === "function" ? value(parsedObject.value) : value,
                };
            }, {});
            return {
                ok: true,
                value: {
                    ...parsedObject.value,
                    ...additionalProperties,
                },
            };
        },
        json: (parsed, opts) => {
            if (!isPlainObject(parsed)) {
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
            // strip out added properties
            const addedPropertyKeys = new Set(Object.keys(properties));
            const parsedWithoutAddedProperties = filterObject(parsed, Object.keys(parsed).filter((key) => !addedPropertyKeys.has(key)));
            return objectLike.json(parsedWithoutAddedProperties, opts);
        },
        getType: () => objectLike.getType(),
    };
    return {
        ...objectSchema,
        ...getSchemaUtils(objectSchema),
        ...getObjectLikeUtils(objectSchema),
    };
}
