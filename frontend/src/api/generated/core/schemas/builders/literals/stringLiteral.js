import { SchemaType } from "../../Schema";
import { createIdentitySchemaCreator } from "../../utils/createIdentitySchemaCreator";
export function stringLiteral(literal) {
    const schemaCreator = createIdentitySchemaCreator(SchemaType.STRING_LITERAL, (value) => {
        if (value === literal) {
            return {
                ok: true,
                value: literal,
            };
        }
        else {
            return {
                ok: false,
                errors: [
                    {
                        path: [],
                        message: `Not equal to "${literal}"`,
                    },
                ],
            };
        }
    });
    return schemaCreator();
}
