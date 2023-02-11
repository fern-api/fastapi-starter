import { getSchemaUtils } from "../builders/schema-utils";
export function createIdentitySchemaCreator(schemaType, validate) {
    return () => {
        const baseSchema = {
            parse: validate,
            json: validate,
            getType: () => schemaType,
        };
        return {
            ...baseSchema,
            ...getSchemaUtils(baseSchema),
        };
    };
}
