/* globals qq */
qq.supportedFeatures = (function() {
    "use strict";

    var supportsUploading,
        supportsUploadingBlobs,
        supportsFileDrop,
        supportsAjaxFileUploading,
        supportsFolderDrop,
        supportsChunking,
        supportsResume,
        supportsUploadViaPaste,
        supportsUploadCors,
        supportsDeleteFileXdr,
        supportsDeleteFileCorsXhr,
        supportsDeleteFileCors,
        supportsFolderSelection,
        supportsImagePreviews,
        supportsUploadProgress;

    function testSupportsFileInputElement() {
        var supported = true,
            tempInput;

        try {
            tempInput = document.createElement("input");
            tempInput.type = "file";
            qq(tempInput).hide();

            if (tempInput.disabled) {
                supported = false;
            }
        }
        catch (ex) {
            supported = false;
        }

        return supported;
    }

    //only way to test for complete Clipboard API support at this time
    function isChrome14OrHigher() {
        return (qq.chrome() || qq.opera()) &&
            navigator.userAgent.match(/Chrome\/[1][4-9]|Chrome\/[2-9][0-9]/) !== undefined;
    }

    //Ensure we can send cross-origin `XMLHttpRequest`s
    function isCrossOriginXhrSupported() {
        if (window.XMLHttpRequest) {
            var xhr = qq.createXhrInstance();

            //Commonly accepted test for XHR CORS support.
            return xhr.withCredentials !== undefined;
        }

        return false;
    }

    //Test for (terrible) cross-origin ajax transport fallback for IE9 and IE8
    function isXdrSupported() {
        return window.XDomainRequest !== undefined;
    }

    // CORS Ajax requests are supported if it is either possible to send credentialed `XMLHttpRequest`s,
    // or if `XDomainRequest` is an available alternative.
    function isCrossOriginAjaxSupported() {
        if (isCrossOriginXhrSupported()) {
            return true;
        }

        return isXdrSupported();
    }

    function isFolderSelectionSupported() {
        // We know that folder selection is only supported in Chrome via this proprietary attribute for now
        return document.createElement("input").webkitdirectory !== undefined;
    }

    function isLocalStorageSupported() {
        try {
            return !!window.localStorage &&
                // unpatched versions of IE10/11 have buggy impls of localStorage where setItem is a string
                qq.isFunction(window.localStorage.setItem);
        }
        catch (error) {
            // probably caught a security exception, so no localStorage for you
            return false;
        }
    }

    function isDragAndDropSupported() {
        var span = document.createElement("span");

        return ("draggable" in span || ("ondragstart" in span && "ondrop" in span)) &&
            !qq.android() && !qq.ios();
    }

    supportsUploading = testSupportsFileInputElement();

    supportsAjaxFileUploading = supportsUploading && qq.isXhrUploadSupported();

    supportsUploadingBlobs = supportsAjaxFileUploading && !qq.androidStock();

    supportsFileDrop = supportsAjaxFileUploading && isDragAndDropSupported();

    // adapted from https://stackoverflow.com/a/23278460/486979
    supportsFolderDrop = supportsFileDrop && (function() {
        var input = document.createElement("input");

        input.type = "file";
        return !!("webkitdirectory" in (input || document.querySelectorAll("input[type=file]")[0]));
    }());

    supportsChunking = supportsAjaxFileUploading && qq.isFileChunkingSupported();

    supportsResume = supportsAjaxFileUploading && supportsChunking && isLocalStorageSupported();

    supportsUploadViaPaste = supportsAjaxFileUploading && isChrome14OrHigher();

    supportsUploadCors = supportsUploading && (window.postMessage !== undefined || supportsAjaxFileUploading);

    supportsDeleteFileCorsXhr = isCrossOriginXhrSupported();

    supportsDeleteFileXdr = isXdrSupported();

    supportsDeleteFileCors = isCrossOriginAjaxSupported();

    supportsFolderSelection = isFolderSelectionSupported();

    supportsImagePreviews = supportsAjaxFileUploading && window.FileReader !== undefined;

    supportsUploadProgress = (function() {
        if (supportsAjaxFileUploading) {
            return !qq.androidStock() && !qq.iosChrome();
        }
        return false;
    }());

    return {
        ajaxUploading: supportsAjaxFileUploading,
        blobUploading: supportsUploadingBlobs,
        canDetermineSize: supportsAjaxFileUploading,
        chunking: supportsChunking,
        deleteFileCors: supportsDeleteFileCors,
        deleteFileCorsXdr: supportsDeleteFileXdr, //NOTE: will also return true in IE10, where XDR is also supported
        deleteFileCorsXhr: supportsDeleteFileCorsXhr,
        dialogElement: !!window.HTMLDialogElement,
        fileDrop: supportsFileDrop,
        folderDrop: supportsFolderDrop,
        folderSelection: supportsFolderSelection,
        imagePreviews: supportsImagePreviews,
        imageValidation: supportsImagePreviews,
        itemSizeValidation: supportsAjaxFileUploading,
        pause: supportsChunking,
        progressBar: supportsUploadProgress,
        resume: supportsResume,
        scaling: supportsImagePreviews && supportsUploadingBlobs,
        tiffPreviews: qq.safari(), // Not the best solution, but simple and probably accurate enough (for now)
        unlimitedScaledImageSize: !qq.ios(), // false simply indicates that there is some known limit
        uploading: supportsUploading,
        uploadCors: supportsUploadCors,
        uploadCustomHeaders: supportsAjaxFileUploading,
        uploadNonMultipart: supportsAjaxFileUploading,
        uploadViaPaste: supportsUploadViaPaste
    };

}());
