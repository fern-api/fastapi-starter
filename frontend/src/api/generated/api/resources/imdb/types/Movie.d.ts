/**
 * This file was auto-generated by Fern from our API Definition.
 */
import { ImdbApi } from "../../../..";
export interface Movie {
    id: ImdbApi.MovieId;
    title: string;
    /** The rating scale is one to five stars */
    rating: number;
}