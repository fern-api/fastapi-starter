/**
 * This file was auto-generated by Fern from our API Definition.
 */
export class ImdbApiError extends Error {
    statusCode;
    body;
    constructor({ message, statusCode, body }) {
        super(message);
        Object.setPrototypeOf(this, ImdbApiError.prototype);
        if (statusCode != null) {
            this.statusCode = statusCode;
        }
        if (body !== undefined) {
            this.body = body;
        }
    }
}
