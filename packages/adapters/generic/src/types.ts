'use strict';

export enum EHTTPVerb {
    head = 'HEAD',
    options = 'OPTIONS',
    get = 'GET',
    post = 'POST',
    put = 'PUT',
    patch = 'PATCH',
    delete = 'DELETE'
}

export enum EMediaType {
    // JSON-based types
    APPLICATION_JSON = "application/json",
    APPLICATION_GEO_JSON = "application/geo+json",
    APPLICATION_LD_JSON = "application/ld+json",

    // XML-based types
    APPLICATION_XML = "application/xml",
    TEXT_XML = "text/xml",

    // Form data
    APPLICATION_X_WWW_FORM_URLENCODED = "application/x-www-form-urlencoded",
    MULTIPART_FORM_DATA = "multipart/form-data",

    // Plain text or HTML
    TEXT_PLAIN = "text/plain",
    TEXT_HTML = "text/html",

    // Binary or image data
    APPLICATION_OCTET_STREAM = "application/octet-stream",
    IMAGE_PNG = "image/png",
    IMAGE_JPEG = "image/jpeg",
    APPLICATION_PDF = "application/pdf",

    // Custom type example
    APPLICATION_VENDOR_JSON = "application/vnd.company+json"
}
