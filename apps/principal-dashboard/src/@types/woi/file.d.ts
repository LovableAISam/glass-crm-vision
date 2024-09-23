declare module '@woi/uploadDocument' {

  export type UploadDocumentData = {
    id?: number;
    docPath: string;
    fileData?: File;
    imageUri?: string;
    fileName?: string;
  };
}