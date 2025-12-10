export interface WebcamHandle {
  captureImage: () => Blob | null;
  toggle: () => void;
}

export interface FileUploadHandle {
  getUploadedFile: () => File | null;
  hasUploadedFile: () => boolean;
  removeFile: () => void;
  toggleFeature: () => void;
  isEnabled: () => boolean;
}
