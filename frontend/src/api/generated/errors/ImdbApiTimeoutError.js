"use strict";
/**
 * This file was auto-generated by Fern from our API Definition.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImdbApiTimeoutError = void 0;
class ImdbApiTimeoutError extends Error {
    constructor() {
        super("Timeout");
        Object.setPrototypeOf(this, ImdbApiTimeoutError.prototype);
    }
}
exports.ImdbApiTimeoutError = ImdbApiTimeoutError;
