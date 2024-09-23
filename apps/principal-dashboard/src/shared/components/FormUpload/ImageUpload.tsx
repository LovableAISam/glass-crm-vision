import React, { useEffect, useState } from 'react';
import Image from 'next/legacy/image';
import { FileConvert } from '@woi/core';
import { useSnackbar } from 'notistack';

import {
  Stack,
  Typography,
  Card,
  Box,
  Avatar,
  IconButton,
} from '@mui/material';
import { Token, FormUpload, Button } from '@woi/web-component';
import AddImage from 'asset/images/add-image.svg';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { UploadDocumentData } from '@woi/uploadDocument';
import { useUploadTemporaryImageFetcher } from '@woi/service/principal';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';

type ImageUploadProps = {
  selectedFile: UploadDocumentData | null;
  selectedImage: string | null;
  onChange?: (file: UploadDocumentData | null) => void;
  onChangeImage?: (file: string | null) => void;
  onView?: (file: UploadDocumentData) => void;
  viewOnly?: boolean;
  type?: 'KTP' | 'SELFIE' | 'SIGNATURE' | 'APP_CUSTOMIZATION' | 'MERCHANT';
  limitSize?: number | any;
  acceptExt?: string;
};

function ImageUpload(props: ImageUploadProps) {
  const {
    onChange,
    onChangeImage,
    onView,
    selectedFile: _selectedFile,
    selectedImage: _selectedImage,
    viewOnly = false,
    type,
    limitSize = false,
    acceptExt,
  } = props;
  const [hovered, setHovered] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadDocumentData | null>(
    _selectedFile,
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(
    _selectedImage,
  );
  const { enqueueSnackbar } = useSnackbar();
  const { baseUrl } = useBaseUrl();

  const handleUpload = async (file: File) => {
    if (Boolean(limitSize) && file.size > limitSize) {
      enqueueSnackbar(
        `Selected image size ${Math.ceil(
          file.size / 1000000,
        )}MB. Maximum file size is ${Math.ceil(limitSize / 1000000)}MB`,
        {
          variant: 'error',
        },
      );
      return;
    }

    if (acceptExt === '.png' && file.type !== 'image/png') {
      enqueueSnackbar(`Select image with .png extension`, {
        variant: 'error',
      });
      return;
    }

    const { result, error, errorData } = await useUploadTemporaryImageFetcher(
      baseUrl,
      {
        upload: file,
        type,
      },
    );
    if (result && !error) {
      const dataUri = await FileConvert.getDataUriFromFile(file);
      setSelectedFile({
        docPath: result.url,
        fileName: file.name,
        fileData: file,
        imageUri: dataUri as string,
      });
      setSelectedImage(dataUri as string);
    } else {
      enqueueSnackbar(errorData?.details?.[0] || 'Upload failed!', {
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    setSelectedFile(_selectedFile);
  }, [_selectedFile]);

  useEffect(() => {
    setSelectedImage(_selectedImage);
  }, [_selectedImage]);

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(selectedFile);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (typeof onChangeImage === 'function') {
      onChangeImage(selectedImage);
    }
  }, [selectedImage]);

  const handleView = (_selectedImage: string) => {
    if (typeof onView !== 'function') return;

    if (selectedFile) {
      onView(selectedFile);
    } else {
      onView({ docPath: _selectedImage });
    }
  };

  if (viewOnly && !(selectedFile && selectedFile.docPath) && !selectedImage) {
    return (
      <Typography
        variant="body2"
        color={Token.color.greyscaleGreyDarker}
        sx={{ mb: 2 }}
      >
        File not uploaded!
      </Typography>
    );
  }

  if (selectedImage) {
    return (
      <Stack direction="column" spacing={1}>
        <Box
          sx={{
            position: 'relative',
            width: 120,
            height: 120,
          }}
        >
          <Card
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 3,
              borderColor: Token.color.greyscaleGreyDark,
              width: '100%',
              height: '100%',
              position: 'relative',
            }}
          >
            <Image
              unoptimized
              src={selectedImage}
              layout="fill"
              alt="selected"
              objectFit="contain"
            />
          </Card>
          {!viewOnly && (
            <IconButton
              color="error"
              sx={{
                position: 'absolute',
                top: -10,
                right: -10,
                '&.MuiIconButton-root': {
                  background: Token.color.redDark,
                  color: Token.color.greyscaleGreyWhite,
                },
              }}
              size="small"
              onClick={() => {
                setSelectedFile(null);
                setSelectedImage(null);
              }}
            >
              <DeleteIcon fontSize={'small'} />
            </IconButton>
          )}
        </Box>
        {typeof onView === 'function' && (
          <Button
            size="small"
            variant="text"
            sx={{ width: 120 }}
            startIcon={<VisibilityIcon />}
            onClick={() => handleView(selectedImage)}
          >
            View Photo
          </Button>
        )}
      </Stack>
    );
  }

  return (
    <FormUpload
      handleUpload={handleUpload}
      uploadType={'Image'}
      acceptExt={acceptExt}
    >
      {({ triggerUpload }) => {
        return (
          <Card
            elevation={0}
            sx={{
              borderStyle: 'dashed',
              p: 2,
              borderRadius: 3,
              borderColor: Token.color.greyscaleGreyDark,
              width: 120,
              height: 120,
              background: hovered
                ? Token.color.greyscaleGreyLightest
                : Token.color.greyscaleGreyWhite,
              cursor: hovered ? 'pointer' : 'default',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={triggerUpload}
          >
            <Stack
              direction="column"
              spacing={1}
              alignItems="center"
              justifyContent="center"
              sx={{ height: '100%' }}
            >
              <Avatar
                variant="rounded"
                sx={{ width: 50, height: 50, background: 'transparent' }}
              >
                <Image
                  src={AddImage}
                  layout="fill"
                  alt="add-img"
                  style={{
                    objectFit: 'contain',
                  }}
                />
              </Avatar>
              {/** @ts-ignore */}
              <Typography variant="caption2" textAlign="center">
                Upload Image
              </Typography>
            </Stack>
          </Card>
        );
      }}
    </FormUpload>
  );
}

export default ImageUpload;
