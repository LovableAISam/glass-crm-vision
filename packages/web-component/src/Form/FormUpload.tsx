import React, { useRef } from 'react';
import { styled } from '@mui/system';

export type DocumentItemType = 'Image' | 'Document' | 'Excel';

const Input = styled('input')({
  display: 'none',
});

export type FormUploadRenderMethods = {
  triggerUpload: () => void;
};

type FormUploadProps = {
  uploadType?: DocumentItemType;
  acceptExt?: string;
  handleUpload: (file: File) => void;
  children: (methods: FormUploadRenderMethods) => React.ReactElement;
};

function FormUpload({ uploadType = 'Image', acceptExt, handleUpload, children }: FormUploadProps) {
  const inputRef = useRef();

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      Array.from(files).forEach(file => handleUpload(file));
    }
  };

  const triggerUpload = () => {
    if (inputRef.current) {
      // @ts-ignore
      inputRef.current.click();
    }
  };

  let accept = uploadType === 'Document' 
    ? `application/pdf, image/*` 
    : 'image/*'

  if (acceptExt) {
    accept = acceptExt;
  }

  return (
    <React.Fragment>
      <Input
        // @ts-ignore
        ref={inputRef}
        accept={accept}
        type="file"
        onChange={handleChangeInput}
      />
      {children({ triggerUpload })}
    </React.Fragment>
  );
}

export default FormUpload;