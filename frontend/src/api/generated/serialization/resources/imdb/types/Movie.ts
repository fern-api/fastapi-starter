/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import { ImdbApi } from "../../../..";
import * as core from "../../../../core";

export const Movie: core.serialization.ObjectSchema<
  serializers.Movie.Raw,
  ImdbApi.Movie
> = core.serialization.object({
  id: core.serialization.lazy(async () => (await import("../../..")).MovieId),
  title: core.serialization.string(),
  rating: core.serialization.number(),
});

export declare namespace Movie {
  interface Raw {
    id: serializers.MovieId.Raw;
    title: string;
    rating: number;
  }
}
