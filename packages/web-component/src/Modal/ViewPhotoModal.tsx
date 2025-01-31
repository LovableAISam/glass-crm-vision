import React, { useState, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { QRCode } from 'react-qr-code';

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
import Image from 'next/image';

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
  qrData?: string;
};

const ViewPhotoModal = (props: ViewPhotoModalProps) => {
  const { isActive, selectedFile, onHide, title, qrData } = props;
  const [zoom, setZoom] = useState<number>(1);
  const [rotate, setRotate] = useState<number>(0);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const changeZoom = (offset: number) => {
    if (offset > 0 || (zoom > 1 && offset < 0)) {
      setZoom(prevZoom => prevZoom + offset);
    }
  };

  const refreshZoom = () => {
    setRotate(oldData => oldData + 90);
  };

  const zoomIn = () => {
    changeZoom(0.5);
  };

  const zoomOut = () => {
    changeZoom(-0.5);
  };

  function downloadURI(uri: string, name: string) {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    link.target = '_blank';
    link.click();
  }

  const handleSaveQRCode = () => {
    if (qrCodeRef.current) {
      const svgElement = qrCodeRef.current.querySelector('svg');
      if (svgElement) {
        // Serialize SVG to string
        const svgData = new XMLSerializer().serializeToString(svgElement);

        // Create a new canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // Set canvas size to 3000x3000 pixels
          const desiredWidth = 3000;
          const desiredHeight = 3000;
          canvas.width = desiredWidth;
          canvas.height = desiredHeight;

          // Create an image element using Blob URL
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);

          const img = document.createElement('img') as HTMLImageElement;
          img.onload = () => {
            // Calculate scaling factors
            const scaleX = desiredWidth / img.width;
            const scaleY = desiredHeight / img.height;
            const scale = Math.min(scaleX, scaleY);

            // Calculate position to center the image
            const x = (desiredWidth - img.width * scale) / 2;
            const y = (desiredHeight - img.height * scale) / 2;

            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the image on canvas with scaling
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

            // Convert canvas to PNG data URL
            const imgURL = canvas.toDataURL('image/png');

            // Clean up the URL object
            URL.revokeObjectURL(url);

            // Download the image
            downloadURI(imgURL, 'QRCode.png');
          };

          img.onerror = (error) => {
            console.error('Image loading error:', error);
          };

          // Set image source to the URL created from SVG blob
          img.src = url;
        }
      }
    }
  };

  const handleSave = () => {
    if (selectedFile?.docPath) {
      downloadURI(
        selectedFile.docPath,
        ImageConvert.getFileNameByUrl(selectedFile.docPath),
      );
    } else if (qrData) {
      handleSaveQRCode();
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
      maxWidth="md"
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
            {qrData && (
              <Stack direction="row" justifyContent="center" ref={qrCodeRef}>
                <QRCode
                  size={256}
                  style={{
                    height: 'auto',
                    maxWidth: '100%',
                    width: '50%',
                  }}
                  value={qrData}
                  viewBox={`0 0 256 256`}
                />
              </Stack>
            )}

            {selectedFile?.docPath && (
              <React.Fragment>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    width: '100%',
                    height: 400,
                    position: 'relative',
                  }}
                >
                  <Stack direction="row" justifyContent="center">
                    <Image
                      unoptimized
                      src={selectedFile.docPath}
                      width={`${100 * zoom}%`}
                      height={`${100 * zoom}%`}
                      objectFit="contain"
                      style={{ transform: `rotate(${rotate}deg)` }}
                    />
                  </Stack>
                </Card>
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
              </React.Fragment>
            )}
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
