import { SchemaType } from "../../Schema";
import { createIdentitySchemaCreator } from "../../utils/createIdentitySchemaCreator";
export const boolean = createIdentitySchemaCreator(SchemaType.BOOLEAN, (value) => {
    if (typeof value === "boolean") {
        return {
            ok: true,
            value,
        };
    }
    else {
        return {
            ok: false,
            errors: [
                {
                    path: [],
                    message: "Not a boolean",
                },
            ],
        };
    }
});
