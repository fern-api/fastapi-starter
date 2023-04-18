/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../..";
import { ImdbApi } from "../../../..";
import * as core from "../../../../core";
export declare const InnerUnion: core.serialization.ObjectSchema<serializers.InnerUnion.Raw, ImdbApi.InnerUnion>;
export declare namespace InnerUnion {
    interface Raw {
        field_a?: string | null;
        field_b?: number | null;
    }
}