import axios from "axios";
export const fetcher = async (args) => {
    const headers = {
        "Content-Type": "application/json",
    };
    if (args.headers != null) {
        for (const [key, value] of Object.entries(args.headers)) {
            if (value != null) {
                headers[key] = value;
            }
        }
    }
    try {
        const response = await axios({
            url: args.url,
            params: args.queryParameters,
            method: args.method,
            headers,
            data: args.body,
            validateStatus: () => true,
            transformResponse: (response) => response,
            timeout: args.timeoutMs ?? 60_000,
            transitional: {
                clarifyTimeoutError: true,
            },
            withCredentials: args.withCredentials,
        });
        let body;
        if (response.data != null && response.data.length > 0) {
            try {
                body = JSON.parse(response.data) ?? undefined;
            }
            catch {
                return {
                    ok: false,
                    error: {
                        reason: "non-json",
                        statusCode: response.status,
                        rawBody: response.data,
                    },
                };
            }
        }
        if (response.status >= 200 && response.status < 300) {
            return {
                ok: true,
                body,
            };
        }
        else {
            return {
                ok: false,
                error: {
                    reason: "status-code",
                    statusCode: response.status,
                    body,
                },
            };
        }
    }
    catch (error) {
        if (error.code === "ETIMEDOUT") {
            return {
                ok: false,
                error: {
                    reason: "timeout",
                },
            };
        }
        return {
            ok: false,
            error: {
                reason: "unknown",
                errorMessage: error.message,
            },
        };
    }
};
