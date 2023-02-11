import { SchemaType } from "../../Schema";
import { list } from "../list";
import { getSchemaUtils } from "../schema-utils";
export function set(schema) {
    const listSchema = list(schema);
    const baseSchema = {
        parse: async (raw, opts) => {
            const parsedList = await listSchema.parse(raw, opts);
            if (parsedList.ok) {
                return {
                    ok: true,
                    value: new Set(parsedList.value),
                };
            }
            else {
                return parsedList;
            }
        },
        json: async (parsed, opts) => {
            if (!(parsed instanceof Set)) {
                return {
                    ok: false,
                    errors: [
                        {
                            path: [],
                            message: "Not a Set",
                        },
                    ],
                };
            }
            const jsonList = await listSchema.json([...parsed], opts);
            return jsonList;
        },
        getType: () => SchemaType.SET,
    };
    return {
        ...baseSchema,
        ...getSchemaUtils(baseSchema),
    };
}
