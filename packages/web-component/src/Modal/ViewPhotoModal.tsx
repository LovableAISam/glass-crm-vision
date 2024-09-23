import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  IconButton,
  DialogActions,
  Card,
} from '@mui/material';
import Image from 'next/legacy/image';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import { Button, Token } from '@woi/web-component';
import DownloadIcon from '@mui/icons-material/Download';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RefreshIcon from '@mui/icons-material/Refresh';
import { UploadDocumentData } from '@woi/uploadDocument';
import { ImageConvert } from '@woi/core';

type ViewPhotoModalProps = {
  isActive: boolean;
  selectedFile: UploadDocumentData | null;
  onHide: () => void;
  title?: string;
};

const ViewPhotoModal = (props: ViewPhotoModalProps) => {
  const { isActive, selectedFile, onHide, title } = props;
  const [zoom, setZoom] = useState<number>(1);
  const [rotate, setRotate] = useState<number>(0);

  const changeZoom = (offset: number) => {
    if (offset > 0 || (zoom > 1 && offset < 0)) {
      setZoom(prevZoom => prevZoom + offset);
    }
  };

  const refreshZoom = () => {
    setRotate(oldData => {
      return oldData + 90;
    });
  };

  const zoomIn = () => {
    changeZoom(0.5);
  };

  const zoomOut = () => {
    changeZoom(-0.5);
  };

  function downloadURI(uri: string, name: string) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    link.target = '_blank';
    link.click();
  }

  const handleSave = () => {
    if (selectedFile?.docPath) {
      downloadURI(
        selectedFile.docPath,
        ImageConvert.getFileNameByUrl(selectedFile.docPath),
      );
    }
  };

  return (
    <Dialog
      open={isActive}
      onClose={onHide}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        },
      }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">View Photo</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={2}>
          {title && <Typography variant="body2">{title}</Typography>}
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: Token.color.greyscaleGreyLighter,
            }}
          >
            {selectedFile?.docPath && (
              <Card
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 3,
                  width: '100%',
                  height: 200,
                  position: 'relative',
                }}
              >
                <Stack direction="row" justifyContent="center">
                  <Image
                    unoptimized
                    src={selectedFile.docPath}
                    alt="select-file"
                    style={{
                      objectFit: 'contain',
                      transform: `rotate(${rotate}deg)`,
                      height: `${100 * zoom}%`,
                      width: `${100 * zoom}%`,
                    }}
                  />
                </Stack>
              </Card>
            )}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
              sx={{ mt: 2 }}
            >
              <IconButton
                color="secondary"
                sx={{
                  '&.MuiIconButton-root': {
                    background: Token.color.greyscaleGreyDarker,
                  },
                }}
                onClick={zoomIn}
              >
                <ZoomInIcon sx={{ color: Token.color.greyscaleGreyWhite }} />
              </IconButton>
              <IconButton
                color="secondary"
                sx={{
                  '&.MuiIconButton-root': {
                    background: Token.color.greyscaleGreyDarker,
                  },
                }}
                onClick={zoomOut}
              >
                <ZoomOutIcon sx={{ color: Token.color.greyscaleGreyWhite }} />
              </IconButton>
              <IconButton
                color="secondary"
                sx={{
                  '&.MuiIconButton-root': {
                    background: Token.color.greyscaleGreyDarker,
                  },
                }}
                onClick={refreshZoom}
              >
                <RefreshIcon sx={{ color: Token.color.greyscaleGreyWhite }} />
              </IconButton>
            </Stack>
          </Card>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="flex-end"
          sx={{ p: 2 }}
        >
          <Button
            variant="outlined"
            onClick={handleSave}
            sx={{ py: 1, px: 2, borderRadius: 2 }}
            startIcon={<DownloadIcon />}
          >
            Save Image
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default ViewPhotoModal;
