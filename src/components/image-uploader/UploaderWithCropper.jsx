import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FiUploadCloud, FiXCircle, FiCrop, FiInfo } from "react-icons/fi";

// Internal imports
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { notifyError, notifySuccess } from "@/utils/toast";
import Container from "@/components/image-uploader/Container";
import ImageCropper from "@/components/image-uploader/ImageCropper";
import { getAspectRatioType, getContextDisplayName, validateImageForContext } from "@/utils/cropperHelpers";

const UploaderWithCropper = ({
  setImageUrl,
  imageUrl,
  product,
  folder,
  targetWidth = 1200, // Increased for better quality
  targetHeight = 1200, // Increased for better quality
  context, // New prop to specify the context (banner, category-icon, etc.)
  location, // For banners - the specific location
  layoutType, // For banners - single or triple layout
  enableCropper = true, // Allow disabling cropper if needed
  title = "Upload Image"
}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const { globalSetting } = useUtilsFunction();

  // Determine the aspect ratio type based on context
  const aspectRatioType = getAspectRatioType(context, {
    folder,
    targetWidth,
    targetHeight,
    location,
    layoutType
  });

  const contextDisplayName = getContextDisplayName(aspectRatioType);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: product ? true : false,
    maxSize: 10485760, // 10 MB in bytes (increased for better quality)
    maxFiles: globalSetting?.number_of_image_per_product || 2,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        
        // Only show cropper if enableCropper is true and it's not a multi-image upload
        if (enableCropper && !product) {
          // Show cropper for the first file
          const imageUrl = URL.createObjectURL(file);
          setCurrentImageSrc(imageUrl);
          setCurrentFile(file);
          setShowCropper(true);
        } else {
          // For multi-image uploads (product) or when cropper is disabled
          processFiles(acceptedFiles);
        }
      }
    },
  });

  // Process files without cropping (legacy behavior)
  const processFiles = async (filesToProcess) => {
    setFiles(
      filesToProcess.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  };

  // Handle cropper completion
  const handleCropComplete = useCallback((croppedFile, croppedBlob) => {
    setShowCropper(false);
    
    // Clean up the temporary image URL
    if (currentImageSrc) {
      URL.revokeObjectURL(currentImageSrc);
    }
    
    // Process the cropped file
    const fileWithPreview = Object.assign(croppedFile, {
      preview: URL.createObjectURL(croppedBlob),
    });
    
    setFiles([fileWithPreview]);
    setCurrentImageSrc(null);
    setCurrentFile(null);
  }, [currentImageSrc]);

  // Handle cropper cancellation
  const handleCropCancel = useCallback(() => {
    setShowCropper(false);
    
    // Clean up the temporary image URL
    if (currentImageSrc) {
      URL.revokeObjectURL(currentImageSrc);
    }
    
    setCurrentImageSrc(null);
    setCurrentFile(null);
  }, [currentImageSrc]);

  // Handle file rejections
  useEffect(() => {
    if (fileRejections && fileRejections.length > 0) {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          if (error.code === "too-many-files") {
            notifyError(
              `Maximum ${globalSetting?.number_of_image_per_product} Image Can be Upload!`
            );
          } else if (error.code === "file-too-large") {
            notifyError("File is too large. Maximum size is 10MB.");
          } else {
            notifyError(error.message);
          }
        });
      });
    }
  }, [fileRejections, globalSetting]);

  // Upload files when they're processed
  useEffect(() => {
    if (files && files.length > 0) {
      setLoading(true);
      setError(t('Uploading') || 'Uploading...');

      const upload = async () => {
        try {
          const file = files[0];
          const name = file.name.replaceAll(/\s/g, "");
          const baseName = name?.substring(0, name.lastIndexOf(".")) || "image";
          
          // Generate unique public_id to prevent overwriting
          const timestamp = Date.now();
          const randomId = Math.random().toString(36).substr(2, 9);
          const uniquePublicId = `${baseName}_${timestamp}_${randomId}`;

          const formData = new FormData();
          formData.append("image", file);
          formData.append("public_id", uniquePublicId);
          if (folder) formData.append("folder", folder);
          if (context) formData.append("context", context);

          const res = await axios({
            url: `${import.meta.env.VITE_APP_API_BASE_URL}/upload`,
            method: "POST",
            headers: { "Content-Type": "multipart/form-data" },
            data: formData,
          });

          notifySuccess(t('ImageUploadedSuccessfully') || 'Image Uploaded successfully!');
          setLoading(false);
          const freshUrl = `${res.data.secure_url}?cb=${Date.now()}`;
          if (product) {
            setImageUrl((imgUrl) => [...imgUrl, freshUrl]);
          } else {
            setImageUrl(freshUrl);
          }
        } catch (err) {
          console.error("Upload error", err);
          notifyError(err?.message || 'Upload failed');
          setLoading(false);
        }
      };

      upload();
    }
  }, [files, folder, product, setImageUrl, t]);

  const handleRemoveImage = async (img) => {
    try {
      setLoading(false);
      notifyError(t('ImageDeleted') || 'Image delete successfully!');
      if (product) {
        const result = imageUrl?.filter((i) => i !== img);
        setImageUrl(result);
      } else {
        setImageUrl("");
      }
    } catch (err) {
      console.error("err", err);
      notifyError(err.Message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-left">
      {/* Cropper Modal */}
      {showCropper && enableCropper && (
        <ImageCropper
          imageSrc={currentImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatioType={aspectRatioType}
          title={title}
        />
      )}

      {/* Upload Area */}
      <div
        className="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 pt-5 pb-6 hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <span className="mx-auto flex justify-center">
          {enableCropper ? (
            <FiCrop className="text-3xl text-emerald-500" />
          ) : (
            <FiUploadCloud className="text-3xl text-emerald-500" />
          )}
        </span>
        <p className="text-sm mt-2">
          {enableCropper ? t('DropImageToCropAndUpload') || 'Drop image to crop and upload' : t("DragYourImage")}
        </p>
        <em className="text-xs text-gray-400">
          {enableCropper 
            ? t('ImagesWillBeCropped') || 'Images will be cropped to the perfect size automatically'
            : t("imageFormat")
          }
        </em>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-center space-x-2 text-emerald-700 dark:text-emerald-300">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent"></div>
            <span className="text-sm">{err}</span>
          </div>
        </div>
      )}

      {/* Preview Area */}
      <aside className="flex flex-row flex-wrap mt-4">
        {product ? (
          <DndProvider backend={HTML5Backend}>
            <Container
              setImageUrl={setImageUrl}
              imageUrl={imageUrl}
              handleRemoveImage={handleRemoveImage}
            />
          </DndProvider>
        ) : !product && imageUrl ? (
          <div className="relative">
            <img
              className="inline-flex border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2"
              src={imageUrl}
              alt="uploaded"
            />
            <button
              type="button"
              className="absolute top-0 right-0 text-red-500 focus:outline-none hover:text-red-700 transition-colors"
              onClick={() => handleRemoveImage(imageUrl)}
            >
              <FiXCircle />
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );
};

export default UploaderWithCropper; 