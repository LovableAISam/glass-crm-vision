import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import useModal from '@woi/common/hooks/useModal';
import { DateConvert, PriceConverter } from '@woi/core';
import { MEDIUM_DATE_FORMAT } from '@woi/core/utils/date/constants';
import { MerchantDetail } from '@woi/service/co/merchant/merchantDetail';
import { UploadDocumentData } from '@woi/uploadDocument';
import { Token, ViewPhotoModal } from '@woi/web-component';
import Image from 'next/image';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Icons
import VisibilityIcon from '@mui/icons-material/Visibility';

type ViewMerchantModalProps = {
  merchantDetail: MerchantDetail | null;
};

const ViewMerchantModal = (props: ViewMerchantModalProps) => {
  const { merchantDetail } = props;

  const [isActiveView, showModalView, hideModalView] = useModal();
  const [selectedView, setSelectedView] =
    useState<UploadDocumentData | null>(null);
  const { t: tCommon } = useTranslation('common');
  const { t: tMerchant } = useTranslation('merchant');

  return (
    <React.Fragment>
      <Grid container spacing={2} rowSpacing={4} sx={{ pt: 1 }}>
        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailMerchantCode')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.merchantCode}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('formMerchantName')}
            </Typography>
            <Typography variant="subtitle2" sx={{ overflowWrap: 'anywhere' }}>
              {merchantDetail?.merchantCompleteName}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailBalance')}
            </Typography>
            <Typography variant="subtitle2">
              {Boolean(merchantDetail?.balance)
                ? PriceConverter.formatPrice(merchantDetail?.balance || 0)
                : PriceConverter.formatPrice(0)}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tMerchant('formEmail')}</Typography>
            <Typography variant="subtitle2" sx={{ overflowWrap: 'anywhere' }}>
              {merchantDetail?.email}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('formPhoneNo')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.phoneNumber ? `${merchantDetail?.countryCode}${merchantDetail?.phoneNumber}` : '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tMerchant('formStatus')}</Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.status
                ? tMerchant('statusActive')
                : tMerchant('statusInactive')}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tMerchant('formLogo')}</Typography>
            <Box
              sx={{
                position: 'relative',
                width: 120,
                height: 120,
              }}
            >
              {merchantDetail?.photoLogo !== null ? (
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
                    src={merchantDetail?.photoLogo || ''}
                    layout="fill"
                    objectFit="contain"
                  />
                </Card>
              ) : (
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    borderColor: Token.color.greyscaleGreyDark,
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography align="center" variant="subtitle2">
                    {tMerchant('logoEmpty')}
                  </Typography>
                </Card>
              )}
            </Box>
            {merchantDetail?.photoLogo !== null && (
              <Button
                size="small"
                variant="text"
                sx={{ width: 120, textTransform: 'none' }}
                startIcon={<VisibilityIcon />}
                onClick={() => {
                  setSelectedView({
                    docPath: merchantDetail?.photoLogo || '',
                    fileName: undefined,
                    fileData: undefined,
                    imageUri: undefined,
                  });
                  showModalView();
                }}
              >
                {tCommon('actionViewPhoto')}
              </Button>
            )}
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('formEffectiveDate')}
            </Typography>
            <Typography variant="subtitle2">
              {DateConvert.stringToDateFormat(
                merchantDetail?.effectiveDateFrom,
                MEDIUM_DATE_FORMAT,
              )}{' '}
              -{' '}
              {DateConvert.stringToDateFormat(
                merchantDetail?.effectiveDateTo,
                MEDIUM_DATE_FORMAT,
              )}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
      </Grid>

      <ViewPhotoModal
        title={tMerchant('formLogo')}
        isActive={isActiveView}
        onHide={hideModalView}
        selectedFile={selectedView}
      />
    </React.Fragment>
  );
};

export default ViewMerchantModal;
