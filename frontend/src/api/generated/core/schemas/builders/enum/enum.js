import { SchemaType } from "../../Schema";
import { createIdentitySchemaCreator } from "../../utils/createIdentitySchemaCreator";
export function enum_(values) {
    const validValues = new Set(values);
    const schemaCreator = createIdentitySchemaCreator(SchemaType.ENUM, (value, { allowUnknownKeys = false } = {}) => {
        if (typeof value === "string" && (validValues.has(value) || allowUnknownKeys)) {
            return {
                ok: true,
                value: value,
            };
        }
        else {
            return {
                ok: false,
                errors: [
                    {
                        path: [],
                        message: "Not one of the allowed values",
                    },
                ],
            };
        }
    });
    return schemaCreator();
}
