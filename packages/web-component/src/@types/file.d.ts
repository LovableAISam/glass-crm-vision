declare module '@woi/uploadDocument' {

  export interface UploadDocumentData {
    id?: number;
    docPath: string;
    fileData?: File;
    imageUri?: string;
    fileName?: string;
  };
}
