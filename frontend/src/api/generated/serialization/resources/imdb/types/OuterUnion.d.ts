/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../..";
import { ImdbApi } from "../../../..";
import * as core from "../../../../core";
export declare const OuterUnion: core.serialization.Schema<serializers.OuterUnion.Raw, ImdbApi.OuterUnion>;
export declare namespace OuterUnion {
    type Raw = OuterUnion.Child;
    interface Child extends serializers.InnerUnion.Raw {
        type: "child";
    }
}