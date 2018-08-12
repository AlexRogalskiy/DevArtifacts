/*globals qq */
/**
 * Ajax requester used to send an ["Abort Multipart Upload"](http://docs.aws.amazon.com/AmazonS3/latest/API/mpUploadAbort.html)
 * request to S3 via the REST API.

 * @param o
 * @constructor
 */
qq.s3.AbortMultipartAjaxRequester = function(o) {
    "use strict";

    var requester,
        options = {
            method: "DELETE",
            endpointStore: null,
            signatureSpec: null,
            maxConnections: 3,
            getBucket: function(id) {},
            getHost: function(id) {},
            getKey: function(id) {},
            log: function(str, level) {}
        },
        getSignatureAjaxRequester;

    qq.extend(options, o);

    // Transport for requesting signatures (for the "Complete" requests) from the local server
    getSignatureAjaxRequester = new qq.s3.RequestSigner({
        endpointStore: options.endpointStore,
        signatureSpec: options.signatureSpec,
        cors: options.cors,
        log: options.log
    });

    /**
     * Attach all required headers (including Authorization) to the "Abort" request.  This is a promissory function
     * that will fulfill the associated promise once all headers have been attached or when an error has occurred that
     * prevents headers from being attached.
     *
     * @param id Associated file ID
     * @param uploadId ID of the associated upload, according to AWS
     * @returns {qq.Promise}
     */
    function getHeaders(id, uploadId) {
        var headers = {},
            promise = new qq.Promise(),
            bucket = options.getBucket(id),
            host = options.getHost(id),
            signatureConstructor = getSignatureAjaxRequester.constructStringToSign
                (getSignatureAjaxRequester.REQUEST_TYPE.MULTIPART_ABORT, bucket, host, options.getKey(id))
                .withUploadId(uploadId);

        // Ask the local server to sign the request.  Use this signature to form the Authorization header.
        getSignatureAjaxRequester.getSignature(id, {signatureConstructor: signatureConstructor}).then(promise.success, promise.failure);

        return promise;
    }

    /**
     * Called by the base ajax requester when the response has been received.  We definitively determine here if the
     * "Abort MPU" request has been a success or not.
     *
     * @param id ID associated with the file.
     * @param xhr `XMLHttpRequest` object containing the response, among other things.
     * @param isError A boolean indicating success or failure according to the base ajax requester (primarily based on status code).
     */
    function handleAbortRequestComplete(id, xhr, isError) {
        var domParser = new DOMParser(),
            responseDoc = domParser.parseFromString(xhr.responseText, "application/xml"),
            errorEls = responseDoc.getElementsByTagName("Error"),
            awsErrorMsg;

        options.log(qq.format("Abort response status {}, body = {}", xhr.status, xhr.responseText));

        // If the base requester has determine this a failure, give up.
        if (isError) {
            options.log(qq.format("Abort Multipart Upload request for {} failed with status {}.", id, xhr.status), "error");
        }
        else {
            // Make sure the correct bucket and key has been specified in the XML response from AWS.
            if (errorEls.length) {
                isError = true;
                awsErrorMsg = responseDoc.getElementsByTagName("Message")[0].textContent;
                options.log(qq.format("Failed to Abort Multipart Upload request for {}.  Error: {}", id, awsErrorMsg), "error");
            }
            else {
                options.log(qq.format("Abort MPU request succeeded for file ID {}.", id));
            }
        }
    }

    requester = qq.extend(this, new qq.AjaxRequester({
        validMethods: ["DELETE"],
        method: options.method,
        contentType: null,
        endpointStore: options.endpointStore,
        maxConnections: options.maxConnections,
        allowXRequestedWithAndCacheControl: false, //These headers are not necessary & would break some installations if added
        log: options.log,
        onComplete: handleAbortRequestComplete,
        successfulResponseCodes: {
            DELETE: [204]
        }
    }));

    qq.extend(this, {
        /**
         * Sends the "Abort" request.
         *
         * @param id ID associated with the file.
         * @param uploadId AWS uploadId for this file
         */
        send: function(id, uploadId) {
            getHeaders(id, uploadId).then(function(headers, endOfUrl) {
                options.log("Submitting S3 Abort multipart upload request for " + id);
                requester.initTransport(id)
                    .withPath(endOfUrl)
                    .withHeaders(headers)
                    .send();
            });
        }
    });
};
