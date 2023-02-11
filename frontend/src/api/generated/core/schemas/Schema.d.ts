import { SchemaUtils } from "./builders";
import { MaybePromise } from "./utils/MaybePromise";
export declare type Schema<Raw = unknown, Parsed = unknown> = BaseSchema<Raw, Parsed> & SchemaUtils<Raw, Parsed>;
export declare type inferRaw<S extends Schema> = S extends Schema<infer Raw, any> ? Raw : never;
export declare type inferParsed<S extends Schema> = S extends Schema<any, infer Parsed> ? Parsed : never;
export interface BaseSchema<Raw, Parsed> {
    parse: (raw: unknown, opts?: SchemaOptions) => MaybePromise<MaybeValid<Parsed>>;
    json: (parsed: unknown, opts?: SchemaOptions) => MaybePromise<MaybeValid<Raw>>;
    getType: () => SchemaType | Promise<SchemaType>;
}
export declare const SchemaType: {
    readonly DATE: "date";
    readonly ENUM: "enum";
    readonly LIST: "list";
    readonly STRING_LITERAL: "stringLiteral";
    readonly OBJECT: "object";
    readonly ANY: "any";
    readonly BOOLEAN: "boolean";
    readonly NUMBER: "number";
    readonly STRING: "string";
    readonly UNKNOWN: "unknown";
    readonly RECORD: "record";
    readonly SET: "set";
    readonly UNION: "union";
    readonly OPTIONAL: "optional";
};
export declare type SchemaType = typeof SchemaType[keyof typeof SchemaType];
export declare type MaybeValid<T> = Valid<T> | Invalid;
export interface Valid<T> {
    ok: true;
    value: T;
}
export interface Invalid {
    ok: false;
    errors: ValidationError[];
}
export interface ValidationError {
    path: string[];
    message: string;
}
export interface SchemaOptions {
    /**
     * @default false
     */
    allowUnknownKeys?: boolean;
}
