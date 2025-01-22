/**
 * @example
 * 
 * This is the example of how to extend the EHTTPStatusCodes enum and the THTTPStatuses
 * in a TypeScript project.
 */

// WARNING: Replace with '@dcoupld/oas-generic-adapter' when properly exported in package.
import { EHTTPStatusCodes } from '@src/index.ts';

// Extend EHTTPStatusCodes by declaring additional custom codes
declare module '@src/index.ts' {
    export enum EHTTPStatusCodes {
        PAYLOAD_TOO_LARGE = 413,
        TOO_MANY_REQUESTS = 429,
        CUSTOM_ERROR = 520,
    }
}

export const TCustomStatuses = {
    PAYLOAD_TOO_LARGE: { code: EHTTPStatusCodes.PAYLOAD_TOO_LARGE, message: "Payload is too large" },
    TOO_MANY_REQUESTS: { code: EHTTPStatusCodes.TOO_MANY_REQUESTS, message: "Too many requests" },
    CUSTOM_ERROR: { code: EHTTPStatusCodes.CUSTOM_ERROR, message: "Custom error occurred" },
} as const;

// Now you can use the extended enum like this:
console.log(EHTTPStatusCodes.ACCEPTED); // 200, original enum
console.log(EHTTPStatusCodes.PAYLOAD_TOO_LARGE); // 413, extended enum

// Use the extended Statuses
console.log(TCustomStatuses.PAYLOAD_TOO_LARGE); // { code: 413, message: 'Payload is too large' }
console.log(TCustomStatuses.PAYLOAD_TOO_LARGE.code); // 413
console.log(TCustomStatuses.PAYLOAD_TOO_LARGE.message); // "Payload is too large"
