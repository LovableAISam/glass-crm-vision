import React from 'react';
import Image from 'next/legacy/image';
import { styled } from '@mui/material/styles';
import {
  Stack,
  Typography,
  Box,
  Avatar,
  Card,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Markdown, Token } from '@woi/web-component';
import { css } from '@emotion/css';

import DeviceImage from 'asset/images/device.svg';
import BackgroundPhoneImage from 'asset/images/background-phone.svg';

import AddBoxIcon from '@mui/icons-material/AddBox';
import SendIcon from '@mui/icons-material/Send';
import ReplyIcon from '@mui/icons-material/Reply';
import HomeIcon from '@mui/icons-material/Home';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { UploadDocumentData } from '@woi/uploadDocument';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';

type ImagePreviewProps = {
  selectedFile: UploadDocumentData | null;
  selectedImage: string | null;
  displayText?: string | React.ReactNode;
  width?: string | number;
  height?: string | number;
  background?: string;
  contentSubject?: string | null;
  contentDesc?: string | null;
  multipleContent?: { title: string; description: string }[];

  type?:
    | 'SPLASH'
    | 'APP_ICON'
    | 'ONBOARD'
    | 'THEME'
    | 'CONTENT'
    | 'CONTENT_COLLAPSE';
};

function ImagePreview(props: ImagePreviewProps) {
  const { type = 'SPLASH', ...imageProps } = props;

  switch (type) {
    case 'APP_ICON':
      return <ImagePreviewAppIcon {...imageProps} />;
    case 'ONBOARD':
      return <ImagePreviewOnboard {...imageProps} />;
    case 'THEME':
      return <ImagePreviewTheme {...imageProps} />;
    case 'CONTENT':
      return <ImagePreviewContent {...imageProps} />;
    case 'CONTENT_COLLAPSE':
      return <ImagePreviewContentCollapse {...imageProps} />;
    default:
      return <ImagePreviewSplash {...imageProps} />;
  }
}

function ImagePreviewSplash(props: Omit<ImagePreviewProps, 'type'>) {
  const {
    selectedImage,
    displayText,
    width = 210,
    height = 400,
    background = Token.color.greyscaleGreyWhite,
  } = props;

  const renderText = () => {
    if (!displayText) return;

    if (typeof displayText === 'string') {
      return (
        <Typography
          // @ts-ignore
          variant="caption2"
          textAlign="center"
          color={Token.color.greyscaleGreyDarkest}
          sx={{ zIndex: 2, px: 2 }}
        >
          {displayText}
        </Typography>
      );
    }

    return displayText;
  };

  return (
    <Box sx={{ p: 2 }} style={{ position: 'relative', width, height }}>
      <Image
        src={DeviceImage}
        layout="fill"
        alt="device"
        style={{
          objectFit: 'contain',
        }}
      />
      <Box
        style={{ position: 'absolute' }}
        sx={{ width, height, left: 0, top: 0, zIndex: 2, px: 1.25, py: 5.8 }}
      >
        <Box sx={{ background, width: '100%', height: '100%' }} />
      </Box>
      <Stack
        direction="column"
        spacing={1}
        justifyContent="center"
        alignItems="center"
        sx={{ zIndex: 2, height: '100%' }}
      >
        {selectedImage && (
          <Avatar
            variant="rounded"
            sx={{
              width: 120,
              height: 120,
              background: 'transparent',
              zIndex: 2,
            }}
          >
            <Image
              unoptimized
              src={selectedImage}
              layout="fill"
              alt="selected"
              style={{
                objectFit: 'contain',
              }}
            />
          </Avatar>
        )}
        {renderText()}
      </Stack>
    </Box>
  );
}

function ImagePreviewAppIcon(props: Omit<ImagePreviewProps, 'type'>) {
  const { selectedImage, displayText, width = 210, height = 400 } = props;

  return (
    <Box sx={{ p: 2 }} style={{ position: 'relative', width, height }}>
      <Image
        src={DeviceImage}
        layout="fill"
        alt="device"
        style={{
          objectFit: 'contain',
        }}
      />
      <Box
        style={{ position: 'absolute' }}
        sx={{ width, height, left: 0, top: 0, zIndex: 2, px: 1.25, py: 5.8 }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${BackgroundPhoneImage.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: t =>
              t.palette.mode === 'light'
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </Box>
      <Stack
        direction="column"
        spacing={1}
        alignItems="center"
        sx={{ zIndex: 2, height: '100%', position: 'relative' }}
      >
        <Box sx={{ position: 'absolute', top: 94, right: 50 }}>
          <Stack sx={{ width: 35 }} alignItems="center">
            {selectedImage ? (
              <Avatar
                variant="rounded"
                sx={{
                  width: 30,
                  height: 30,
                  background: 'transparent',
                  zIndex: 2,
                }}
              >
                <Image
                  unoptimized
                  src={selectedImage}
                  layout="fill"
                  alt="selected"
                  style={{
                    objectFit: 'contain',
                  }}
                />
              </Avatar>
            ) : (
              <Avatar
                variant="rounded"
                sx={{
                  width: 30,
                  height: 30,
                  background: Token.color.greyscaleGreyWhite,
                  zIndex: 2,
                }}
              />
            )}
          </Stack>
          <Typography
            color={Token.color.greyscaleGreyWhite}
            textAlign="center"
            sx={{
              mt: 0.2,
              zIndex: 2,
              fontSize: 7,
              width: 35,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {displayText}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

function ImagePreviewOnboard(props: Omit<ImagePreviewProps, 'type'>) {
  const {
    selectedImage,
    displayText,
    width = 210,
    height = 400,
    background = Token.color.greyscaleGreyWhite,
  } = props;

  const renderText = () => {
    if (!displayText) return;

    if (typeof displayText === 'string') {
      return (
        <Typography
          // @ts-ignore
          variant="caption2"
          textAlign="center"
          color={Token.color.greyscaleGreyDarkest}
          sx={{ zIndex: 2, px: 2 }}
        >
          {displayText}
        </Typography>
      );
    }

    return displayText;
  };

  return (
    <Box style={{ position: 'relative', width, height }}>
      <Image
        src={DeviceImage}
        layout="fill"
        alt="device"
        style={{
          objectFit: 'contain',
        }}
      />
      <Box
        style={{ position: 'absolute' }}
        sx={{ width, height, left: 0, top: 0, zIndex: 2, px: 1.2, py: 5.8 }}
      >
        <Box sx={{ background, width: '100%', height: '100%' }} />
      </Box>
      <Stack
        direction="column"
        spacing={1}
        justifyContent="center"
        alignItems="center"
        sx={{ zIndex: 2, height: '100%', width: '100%' }}
      >
        <Stack
          alignItems="center"
          justifyContent="space-between"
          sx={{ zIndex: 2, height: '100%', width: '100%', py: 3.8 }}
        >
          <Stack
            alignItems="center"
            justifyContent="flex-end"
            sx={{ flex: 1.2 }}
          >
            {selectedImage && (
              <Box
                style={{ position: 'relative', width, height: 277, zIndex: 2 }}
              >
                <Image
                  unoptimized
                  src={selectedImage}
                  layout="fill"
                  alt="selected"
                  style={{
                    objectFit: 'contain',
                    zIndex: 2,
                  }}
                />
              </Box>
            )}
          </Stack>
          <Stack direction="column" sx={{ flex: 1, px: 1.15, pb: 2 }}>
            {renderText()}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

function ImagePreviewTheme(props: Omit<ImagePreviewProps, 'type'>) {
  const {
    width = 210,
    height = 400,
    background = Token.color.greyscaleGreyWhite,
  } = props;

  return (
    <Box style={{ position: 'relative', width, height }}>
      <Image
        src={DeviceImage}
        layout="fill"
        alt="device"
        style={{
          objectFit: 'contain',
        }}
      />
      <Box
        style={{ position: 'absolute' }}
        sx={{ width, height, left: 0, top: 0, zIndex: 2, px: 1.2, py: 5.8 }}
      >
        <Box
          sx={{
            background: Token.color.greyscaleGreyWhite,
            width: '100%',
            height: '100%',
          }}
        />
      </Box>
      <Box
        className={css`
          ::before {
            content: '';
            background-color: ${background};
            top: 45px;
            left: 9px;
            position: absolute;
            z-index: 2;
            width: 91.5%;
            height: 21px;
          }
          ::after {
            content: '';
            border-bottom-left-radius: 50% 100%;
            border-bottom-right-radius: 50% 100%;
            position: absolute;
            top: 66px;
            left: 9px;
            z-index: 2;
            width: 91.5%;
            background-color: ${background};
            height: 80px;
          }
        `}
      />
      <Card
        sx={{
          position: 'absolute',
          px: 2,
          py: 1,
          borderRadius: 3,
          top: 100,
          left: 20,
          width: '80%',
          zIndex: 3,
        }}
      >
        <Stack direction="row" spacing={1} justifyContent="space-evenly">
          <Stack direction="column" alignItems="center">
            <AddBoxIcon fontSize="small" sx={{ color: background }} />
            <Typography variant={'caption2' as any}>Top Up</Typography>
          </Stack>
          <Stack direction="column" alignItems="center">
            <SendIcon fontSize="small" sx={{ color: background }} />
            <Typography variant={'caption2' as any}>Transfer</Typography>
          </Stack>
          <Stack direction="column" alignItems="center">
            <ReplyIcon fontSize="small" sx={{ color: background }} />
            <Typography variant={'caption2' as any}>Request</Typography>
          </Stack>
        </Stack>
      </Card>
      <Box
        sx={{
          p: 0.5,
          zIndex: 3,
          position: 'absolute',
          bottom: 50,
          left: 9,
          width: '91.5%',
          borderTop: 1,
          borderColor: Token.color.greyscaleGreyLight,
        }}
      >
        <Stack direction="row" spacing={1} justifyContent="space-evenly">
          <Stack direction="column" alignItems="center">
            <HomeIcon sx={{ fontSize: 14, color: background }} />
            <Typography sx={{ fontSize: 8 }}>Beranda</Typography>
          </Stack>
          <Stack direction="column" alignItems="center">
            <StarBorderIcon sx={{ fontSize: 14, color: background }} />
            <Typography sx={{ fontSize: 8 }}>Loyalty</Typography>
          </Stack>
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Typography sx={{ fontSize: 8 }}>Scan</Typography>
          </Stack>
          <Stack direction="column" alignItems="center">
            <HistoryIcon sx={{ fontSize: 14, color: background }} />
            <Typography sx={{ fontSize: 8 }}>Riwayat</Typography>
          </Stack>
          <Stack direction="column" alignItems="center">
            <PersonIcon sx={{ fontSize: 14, color: background }} />
            <Typography sx={{ fontSize: 8 }}>Profile</Typography>
          </Stack>
        </Stack>
      </Box>
      <Stack
        sx={{
          p: 0.5,
          zIndex: 3,
          position: 'absolute',
          bottom: 68,
          left: 90,
          width: 35,
          height: 35,
          background,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <QrCodeScannerIcon
          sx={{ fontSize: 19, color: Token.color.greyscaleGreyWhite }}
        />
      </Stack>
    </Box>
  );
}

function ImagePreviewContent(props: Omit<ImagePreviewProps, 'type'>) {
  const { width, height, contentSubject, contentDesc } = props;

  return (
    <Box style={{ position: 'relative', width, height }}>
      <Image
        src={DeviceImage}
        layout="fill"
        alt="device"
        style={{
          objectFit: 'contain',
        }}
      />
      <Box
        style={{ position: 'absolute' }}
        sx={{
          width: 336,
          height: 640,
          left: 0,
          top: 0,
          zIndex: 2,
          px: 2,
          py: 9.4,
        }}
      >
        <Stack
          direction="column"
          spacing={1}
          justifyContent="start"
          sx={{ zIndex: 2, height: '100%', p: 2, overflow: 'scroll' }}
        >
          <Typography
            // @ts-ignore
            variant="subtitle3"
            textAlign="center"
            color={Token.color.greyscaleGreyDarkest}
            sx={{ zIndex: 2, px: 2 }}
          >
            {contentSubject}
          </Typography>

          <Markdown
            typographyProps={{
              paragraph: true,
              display: '-webkit-box',
              // @ts-ignore
              variant: 'caption2',
            }}
          >
            {contentDesc || ''}
          </Markdown>
        </Stack>
      </Box>
    </Box>
  );
}

function ImagePreviewContentCollapse(props: Omit<ImagePreviewProps, 'type'>) {
  const { width, height, contentSubject, multipleContent } = props;

  return (
    <Box style={{ position: 'relative', width, height }}>
      <Image
        src={DeviceImage}
        layout="fill"
        alt="device"
        style={{
          objectFit: 'contain',
        }}
      />
      <Box
        style={{ position: 'absolute' }}
        sx={{
          width: 336,
          height: 640,
          left: 0,
          top: 0,
          zIndex: 2,
          px: 2,
          py: 9.4,
        }}
      >
        <Stack
          direction="column"
          spacing={1}
          justifyContent="start"
          sx={{ height: '100%', p: 2 }}
        >
          <Typography
            // @ts-ignore
            variant="subtitle3"
            textAlign="center"
            color={Token.color.greyscaleGreyDarkest}
            sx={{ px: 2 }}
          >
            {contentSubject}
          </Typography>

          <TextField
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                height: '20px',
                width: '70%',
                alignSelf: 'center',
                p: '0px',
              },
            }}
            disabled
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ height: '15px', widht: '15px' }} />
                </InputAdornment>
              ),
            }}
          />

          <AccordionContainer>
            {multipleContent !== null &&
              multipleContent?.map((item, idx) => (
                <Accordion
                  elevation={0}
                  sx={{
                    boxShadow: 'inset 0px -1px 0px #E8EEFF',
                    borderRadius: '0',
                  }}
                  key={idx}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography
                      // @ts-ignore
                      variant="subtitle3"
                      sx={{ fontSize: '11px' }}
                      color={Token.color.greyscaleGreyDarkest}
                    >
                      {item?.title || 'Type title'}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 1 }}>
                    <Markdown
                      typographyProps={{
                        variant: 'caption',
                        sx: {
                          fontSize: 10,
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                        },
                      }}
                    >
                      {item?.description || '<p>Type description</p>'}
                    </Markdown>
                  </AccordionDetails>
                </Accordion>
              ))}
          </AccordionContainer>
        </Stack>
      </Box>
    </Box>
  );
}

const AccordionContainer = styled('div')(() => ({
  '.MuiAccordionSummary-content': {
    margin: '0px !important',
  },
  '.MuiPaper-root': {
    borderRadius: '0px !important',
    margin: '0px !important',
  },
  '.MuiAccordionSummary-root': {
    minHeight: '0px !important',
    padding: '5px 0px 5px 0px  !important',
  },
  '.MuiAccordionDetails-root': {
    padding: '0px 0px 10px 0px !important',
    display: 'flex',
  },
  overflow: 'scroll !important',
  paddingRight: '12px !important',
  margin: '8px -12px 0px 0px !important',
}));

export default ImagePreview;
