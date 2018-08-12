/* globals qq, ExifRestorer */
/**
 * Controls generation of scaled images based on a reference image encapsulated in a `File` or `Blob`.
 * Scaled images are generated and converted to blobs on-demand.
 * Multiple scaled images per reference image with varying sizes and other properties are supported.
 *
 * @param spec Information about the scaled images to generate.
 * @param log Logger instance
 * @constructor
 */
qq.Scaler = function(spec, log) {
    "use strict";

    var self = this,
        customResizeFunction = spec.customResizer,
        includeOriginal = spec.sendOriginal,
        orient = spec.orient,
        defaultType = spec.defaultType,
        defaultQuality = spec.defaultQuality / 100,
        failedToScaleText = spec.failureText,
        includeExif = spec.includeExif,
        sizes = this._getSortedSizes(spec.sizes);

    // Revealed API for instances of this module
    qq.extend(this, {
        // If no targeted sizes have been declared or if this browser doesn't support
        // client-side image preview generation, there is no scaling to do.
        enabled: qq.supportedFeatures.scaling && sizes.length > 0,

        getFileRecords: function(originalFileUuid, originalFileName, originalBlobOrBlobData) {
            var self = this,
                records = [],
                originalBlob = originalBlobOrBlobData.blob ? originalBlobOrBlobData.blob : originalBlobOrBlobData,
                identifier = new qq.Identify(originalBlob, log);

            // If the reference file cannot be rendered natively, we can't create scaled versions.
            if (identifier.isPreviewableSync()) {
                // Create records for each scaled version & add them to the records array, smallest first.
                qq.each(sizes, function(idx, sizeRecord) {
                    var outputType = self._determineOutputType({
                        defaultType: defaultType,
                        requestedType: sizeRecord.type,
                        refType: originalBlob.type
                    });

                    records.push({
                        uuid: qq.getUniqueId(),
                        name: self._getName(originalFileName, {
                            name: sizeRecord.name,
                            type: outputType,
                            refType: originalBlob.type
                        }),
                        blob: new qq.BlobProxy(originalBlob,
                        qq.bind(self._generateScaledImage, self, {
                            customResizeFunction: customResizeFunction,
                            maxSize: sizeRecord.maxSize,
                            orient: orient,
                            type: outputType,
                            quality: defaultQuality,
                            failedText: failedToScaleText,
                            includeExif: includeExif,
                            log: log
                        }))
                    });
                });

                records.push({
                    uuid: originalFileUuid,
                    name: originalFileName,
                    size: originalBlob.size,
                    blob: includeOriginal ? originalBlob : null
                });
            }
            else {
                records.push({
                    uuid: originalFileUuid,
                    name: originalFileName,
                    size: originalBlob.size,
                    blob: originalBlob
                });
            }

            return records;
        },

        handleNewFile: function(file, name, uuid, size, fileList, batchId, uuidParamName, api) {
            var self = this,
                buttonId = file.qqButtonId || (file.blob && file.blob.qqButtonId),
                scaledIds = [],
                originalId = null,
                addFileToHandler = api.addFileToHandler,
                uploadData = api.uploadData,
                paramsStore = api.paramsStore,
                proxyGroupId = qq.getUniqueId();

            qq.each(self.getFileRecords(uuid, name, file), function(idx, record) {
                var blobSize = record.size,
                    id;

                if (record.blob instanceof qq.BlobProxy) {
                    blobSize = -1;
                }

                id = uploadData.addFile({
                    uuid: record.uuid,
                    name: record.name,
                    size: blobSize,
                    batchId: batchId,
                    proxyGroupId: proxyGroupId
                });

                if (record.blob instanceof qq.BlobProxy) {
                    scaledIds.push(id);
                }
                else {
                    originalId = id;
                }

                if (record.blob) {
                    addFileToHandler(id, record.blob);
                    fileList.push({id: id, file: record.blob});
                }
                else {
                    uploadData.setStatus(id, qq.status.REJECTED);
                }
            });

            // If we are potentially uploading an original file and some scaled versions,
            // ensure the scaled versions include reference's to the parent's UUID and size
            // in their associated upload requests.
            if (originalId !== null) {
                qq.each(scaledIds, function(idx, scaledId) {
                    var params = {
                        qqparentuuid: uploadData.retrieve({id: originalId}).uuid,
                        qqparentsize: uploadData.retrieve({id: originalId}).size
                    };

                    // Make sure the UUID for each scaled image is sent with the upload request,
                    // to be consistent (since we may need to ensure it is sent for the original file as well).
                    params[uuidParamName] = uploadData.retrieve({id: scaledId}).uuid;

                    uploadData.setParentId(scaledId, originalId);
                    paramsStore.addReadOnly(scaledId, params);
                });

                // If any scaled images are tied to this parent image, be SURE we send its UUID as an upload request
                // parameter as well.
                if (scaledIds.length) {
                    (function() {
                        var param = {};
                        param[uuidParamName] = uploadData.retrieve({id: originalId}).uuid;
                        paramsStore.addReadOnly(originalId, param);
                    }());
                }
            }
        }
    });
};

qq.extend(qq.Scaler.prototype, {
    scaleImage: function(id, specs, api) {
        "use strict";

        if (!qq.supportedFeatures.scaling) {
            throw new qq.Error("Scaling is not supported in this browser!");
        }

        var scalingEffort = new qq.Promise(),
            log = api.log,
            file = api.getFile(id),
            uploadData = api.uploadData.retrieve({id: id}),
            name = uploadData && uploadData.name,
            uuid = uploadData && uploadData.uuid,
            scalingOptions = {
                customResizer: specs.customResizer,
                sendOriginal: false,
                orient: specs.orient,
                defaultType: specs.type || null,
                defaultQuality: specs.quality,
                failedToScaleText: "Unable to scale",
                sizes: [{name: "", maxSize: specs.maxSize}]
            },
            scaler = new qq.Scaler(scalingOptions, log);

        if (!qq.Scaler || !qq.supportedFeatures.imagePreviews || !file) {
            scalingEffort.failure();

            log("Could not generate requested scaled image for " + id + ".  " +
                "Scaling is either not possible in this browser, or the file could not be located.", "error");
        }
        else {
            (qq.bind(function() {
                // Assumption: There will never be more than one record
                var record = scaler.getFileRecords(uuid, name, file)[0];

                if (record && record.blob instanceof qq.BlobProxy) {
                    record.blob.create().then(scalingEffort.success, scalingEffort.failure);
                }
                else {
                    log(id + " is not a scalable image!", "error");
                    scalingEffort.failure();
                }
            }, this)());
        }

        return scalingEffort;
    },

    // NOTE: We cannot reliably determine at this time if the UA supports a specific MIME type for the target format.
    // image/jpeg and image/png are the only safe choices at this time.
    _determineOutputType: function(spec) {
        "use strict";

        var requestedType = spec.requestedType,
            defaultType = spec.defaultType,
            referenceType = spec.refType;

        // If a default type and requested type have not been specified, this should be a
        // JPEG if the original type is a JPEG, otherwise, a PNG.
        if (!defaultType && !requestedType) {
            if (referenceType !== "image/jpeg") {
                return "image/png";
            }
            return referenceType;
        }

        // A specified default type is used when a requested type is not specified.
        if (!requestedType) {
            return defaultType;
        }

        // If requested type is specified, use it, as long as this recognized type is supported by the current UA
        if (qq.indexOf(Object.keys(qq.Identify.prototype.PREVIEWABLE_MIME_TYPES), requestedType) >= 0) {
            if (requestedType === "image/tiff") {
                return qq.supportedFeatures.tiffPreviews ? requestedType : defaultType;
            }

            return requestedType;
        }

        return defaultType;
    },

    // Get a file name for a generated scaled file record, based on the provided scaled image description
    _getName: function(originalName, scaledVersionProperties) {
        "use strict";

        var startOfExt = originalName.lastIndexOf("."),
            versionType = scaledVersionProperties.type || "image/png",
            referenceType = scaledVersionProperties.refType,
            scaledName = "",
            scaledExt = qq.getExtension(originalName),
            nameAppendage = "";

        if (scaledVersionProperties.name && scaledVersionProperties.name.trim().length) {
            nameAppendage = " (" + scaledVersionProperties.name + ")";
        }

        if (startOfExt >= 0) {
            scaledName = originalName.substr(0, startOfExt);

            if (referenceType !== versionType) {
                scaledExt = versionType.split("/")[1];
            }

            scaledName += nameAppendage + "." + scaledExt;
        }
        else {
            scaledName = originalName + nameAppendage;
        }

        return scaledName;
    },

    // We want the smallest scaled file to be uploaded first
    _getSortedSizes: function(sizes) {
        "use strict";

        sizes = qq.extend([], sizes);

        return sizes.sort(function(a, b) {
            if (a.maxSize > b.maxSize) {
                return 1;
            }
            if (a.maxSize < b.maxSize) {
                return -1;
            }
            return 0;
        });
    },

    _generateScaledImage: function(spec, sourceFile) {
        "use strict";

        var self = this,
            customResizeFunction = spec.customResizeFunction,
            log = spec.log,
            maxSize = spec.maxSize,
            orient = spec.orient,
            type = spec.type,
            quality = spec.quality,
            failedText = spec.failedText,
            includeExif = spec.includeExif && sourceFile.type === "image/jpeg" && type === "image/jpeg",
            scalingEffort = new qq.Promise(),
            imageGenerator = new qq.ImageGenerator(log),
            canvas = document.createElement("canvas");

        log("Attempting to generate scaled version for " + sourceFile.name);

        imageGenerator.generate(sourceFile, canvas, {maxSize: maxSize, orient: orient, customResizeFunction: customResizeFunction}).then(function() {
            var scaledImageDataUri = canvas.toDataURL(type, quality),
                signalSuccess = function() {
                    log("Success generating scaled version for " + sourceFile.name);
                    var blob = qq.dataUriToBlob(scaledImageDataUri);
                    scalingEffort.success(blob);
                };

            if (includeExif) {
                self._insertExifHeader(sourceFile, scaledImageDataUri, log).then(function(scaledImageDataUriWithExif) {
                    scaledImageDataUri = scaledImageDataUriWithExif;
                    signalSuccess();
                },
                function() {
                    log("Problem inserting EXIF header into scaled image.  Using scaled image w/out EXIF data.", "error");
                    signalSuccess();
                });
            }
            else {
                signalSuccess();
            }
        }, function() {
            log("Failed attempt to generate scaled version for " + sourceFile.name, "error");
            scalingEffort.failure(failedText);
        });

        return scalingEffort;
    },

    // Attempt to insert the original image's EXIF header into a scaled version.
    _insertExifHeader: function(originalImage, scaledImageDataUri, log) {
        "use strict";

        var reader = new FileReader(),
            insertionEffort = new qq.Promise(),
            originalImageDataUri = "";

        reader.onload = function() {
            originalImageDataUri = reader.result;
            insertionEffort.success(qq.ExifRestorer.restore(originalImageDataUri, scaledImageDataUri));
        };

        reader.onerror = function() {
            log("Problem reading " + originalImage.name + " during attempt to transfer EXIF data to scaled version.", "error");
            insertionEffort.failure();
        };

        reader.readAsDataURL(originalImage);

        return insertionEffort;
    },

    _dataUriToBlob: function(dataUri) {
        "use strict";

        var byteString, mimeString, arrayBuffer, intArray;

        // convert base64 to raw binary data held in a string
        if (dataUri.split(",")[0].indexOf("base64") >= 0) {
            byteString = atob(dataUri.split(",")[1]);
        }
        else {
            byteString = decodeURI(dataUri.split(",")[1]);
        }

        // extract the MIME
        mimeString = dataUri.split(",")[0]
            .split(":")[1]
            .split(";")[0];

        // write the bytes of the binary string to an ArrayBuffer
        arrayBuffer = new ArrayBuffer(byteString.length);
        intArray = new Uint8Array(arrayBuffer);
        qq.each(byteString, function(idx, character) {
            intArray[idx] = character.charCodeAt(0);
        });

        return this._createBlob(arrayBuffer, mimeString);
    },

    _createBlob: function(data, mime) {
        "use strict";

        var BlobBuilder = window.BlobBuilder ||
                window.WebKitBlobBuilder ||
                window.MozBlobBuilder ||
                window.MSBlobBuilder,
            blobBuilder = BlobBuilder && new BlobBuilder();

        if (blobBuilder) {
            blobBuilder.append(data);
            return blobBuilder.getBlob(mime);
        }
        else {
            return new Blob([data], {type: mime});
        }
    }
});
