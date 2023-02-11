import { SchemaType } from "../../Schema";
import { createIdentitySchemaCreator } from "../../utils/createIdentitySchemaCreator";
export const string = createIdentitySchemaCreator(SchemaType.STRING, (value) => {
    if (typeof value === "string") {
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
                    message: "Not a string",
                },
            ],
        };
    }
});
