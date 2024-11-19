'use strict';

export type THTTPStatus = {
    code: number;
    message: string;
};

// WRITE: Clarify the consuming use cases of these two later. Should it be publicly exposed.
type StatusKey = keyof typeof THTTPStatuses; // 'SUCCESS' | 'ERROR' | 'NOT_FOUND'
type StatusValue = (typeof THTTPStatuses)[StatusKey]; // { code: number; message: string }

// WRITE: Clarify the consuming use cases of this. Should it be publicly exposed.
export type StatusCollection<T extends Record<string, THTTPStatus>> = T;

// WRITE: Clarify the consuming use cases of this. Should it be publicly exposed.
type StatusCodes = {
    [K in keyof typeof THTTPStatuses]: typeof THTTPStatuses[K]['code'];
};

// WRITE: Clarify the consuming use cases of this. Should it be publicly exposed.
type StatusesMap = Record<EHTTPStatusCodes, THTTPStatus>;

/**
 * Status codes enum.
 */
export enum EHTTPStatusCodes {
    // 2xx Success
    SUCCESS = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,

    // 3xx Redirection
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    NOT_MODIFIED = 304,

    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,

    // 5xx Server Errors
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
}

/**
 * A collection of status codes and their corresponding messages.
 * Can be extended with custom status codes and messages as per {@link AddCustomStatusesExample}
 * 
 * @example
 * ```typescript
 * const code = Statuses.SUCCESS.code;  // 200
 * const message = Statuses.SUCCESS.message;  // 'Operation successful'
 * ```
 */
export const THTTPStatuses = {
    // 2xx Success
    SUCCESS: { code: EHTTPStatusCodes.SUCCESS, message: 'Operation successful' },
    CREATED: { code: EHTTPStatusCodes.CREATED, message: 'Resource created successfully' },
    ACCEPTED: { code: EHTTPStatusCodes.ACCEPTED, message: 'Request accepted for processing' },
    NO_CONTENT: { code: EHTTPStatusCodes.NO_CONTENT, message: 'No content to return' },

    // 3xx Redirection
    MOVED_PERMANENTLY: { code: EHTTPStatusCodes.MOVED_PERMANENTLY, message: 'Resource moved permanently' },
    FOUND: { code: EHTTPStatusCodes.FOUND, message: 'Resource found, but at a different location' },
    NOT_MODIFIED: { code: EHTTPStatusCodes.NOT_MODIFIED, message: 'Resource not modified since last request' },

    // 4xx Client Errors
    BAD_REQUEST: { code: EHTTPStatusCodes.BAD_REQUEST, message: 'Bad request syntax or invalid request' },
    UNAUTHORIZED: { code: EHTTPStatusCodes.UNAUTHORIZED, message: 'Authentication required' },
    FORBIDDEN: { code: EHTTPStatusCodes.FORBIDDEN, message: 'Access forbidden' },
    NOT_FOUND: { code: EHTTPStatusCodes.NOT_FOUND, message: 'Resource not found' },
    METHOD_NOT_ALLOWED: { code: EHTTPStatusCodes.METHOD_NOT_ALLOWED, message: 'HTTP method not allowed for resource' },

    // 5xx Server Errors
    INTERNAL_SERVER_ERROR: { code: EHTTPStatusCodes.INTERNAL_SERVER_ERROR, message: 'Internal server error' },
    NOT_IMPLEMENTED: { code: EHTTPStatusCodes.NOT_IMPLEMENTED, message: 'Server does not support the functionality required' },
    SERVICE_UNAVAILABLE: { code: EHTTPStatusCodes.SERVICE_UNAVAILABLE, message: 'Service unavailable' },
    GATEWAY_TIMEOUT: { code: EHTTPStatusCodes.GATEWAY_TIMEOUT, message: 'Gateway timeout' },
} as const;

console.log(THTTPStatuses); // 202




