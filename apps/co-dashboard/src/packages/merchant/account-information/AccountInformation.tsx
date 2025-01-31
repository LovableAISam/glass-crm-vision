// Components
import { Card, Divider, Grid, Stack, Typography } from '@mui/material';
import { LoadingPage, Button } from '@woi/web-component';
import { ViewPhotoModal } from '@woi/web-component';

// Hooks & Utils
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import useAccountInformation from './hooks/useAccountInformation';
import useModal from '@woi/common/hooks/useModal';
import QrCode2Icon from '@mui/icons-material/QrCode2';

// Types & Consts
import { MEDIUM_DATE_FORMAT } from '@woi/core/utils/date/constants';
import { DateConvert, PriceConverter } from '@woi/core';

const AccountInformation = () => {
  const [isActive, showModal, hideModal] = useModal();
  const router = useRouter();

  const {
    merchantProfileData,
    merchantProfileStatus,
    qrContent,
    generateQrCode,
  } = useAccountInformation();

  const { t: tAccount } = useTranslation('account');

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">{tAccount('pageAccountProfile')}</Typography>
        </Stack>
        {merchantProfileStatus === 'loading' && <LoadingPage />}
        {merchantProfileStatus === 'success' && (
          <Card sx={{ p: 3, borderRadius: 4 }}>
            <Grid container spacing={2} rowSpacing={4} sx={{ mb: 2 }}>
              {/* Merchant Biller Code */}
              <Grid item md={12 / 3} xs={12}>
                <Stack direction="column" spacing={2}>
                  <Typography variant="body2">
                    {tAccount('detailMerchantBillerCode')}
                  </Typography>
                  <Typography variant="subtitle2">
                    {merchantProfileData?.merchantCode}
                  </Typography>
                  <Divider />
                </Stack>
              </Grid>

              {/* Balance */}
              <Grid item md={12 / 3} xs={12}>
                <Stack direction="column" spacing={2}>
                  <Typography variant="body2">
                    {tAccount('detailBalance')}
                  </Typography>
                  <Typography variant="subtitle2">
                    {merchantProfileData?.balance
                      ? PriceConverter.formatPrice(
                          merchantProfileData?.balance,
                          router.locale,
                        )
                      : '0'}
                  </Typography>
                  <Divider />
                </Stack>
              </Grid>

              {/* Merchant Biller Name */}
              <Grid item md={12 / 3} xs={12}>
                <Stack direction="column" spacing={2}>
                  <Typography variant="body2">
                    {tAccount('detailMerchantBillerName')}
                  </Typography>
                  <Typography variant="subtitle2">
                    {merchantProfileData?.merchantName}
                  </Typography>
                  <Divider />
                </Stack>
              </Grid>

              {/* Account Number */}
              <Grid item md={12 / 3} xs={12}>
                <Stack direction="column" spacing={2}>
                  <Typography variant="body2">
                    {tAccount('detailAccountNumber')}
                  </Typography>
                  <Typography variant="subtitle2">
                    {merchantProfileData?.accountNumber}
                  </Typography>
                  <Divider />
                </Stack>
              </Grid>

              {/* Status */}
              <Grid item md={12 / 3} xs={12}>
                <Stack direction="column" spacing={2}>
                  <Typography variant="body2">
                    {tAccount('detailStatus')}
                  </Typography>
                  <Typography variant="subtitle2">
                    {merchantProfileData?.statusMerchant
                      ? tAccount('detailStatusActive')
                      : tAccount('detailStatusInactive')}
                  </Typography>
                  <Divider />
                </Stack>
              </Grid>

              {/* Effective Date */}
              <Grid item md={12 / 3} xs={12}>
                <Stack direction="column" spacing={2}>
                  <Typography variant="body2">
                    {tAccount('detailEffectiveDate')}
                  </Typography>
                  <Typography variant="subtitle2">
                    {DateConvert.stringToDateFormat(
                      merchantProfileData?.effectiveDateTo,
                      MEDIUM_DATE_FORMAT,
                    )}
                  </Typography>
                  <Divider />
                </Stack>
              </Grid>

              {/* Merchant CO */}
              {/* <Grid item md={12 / 3} xs={12}>
                <Stack direction="column" spacing={2}>
                  <Typography variant="body2">
                    {tAccount('detailCO')}
                  </Typography>
                  <Typography variant="subtitle2">
                    {merchantProfileData?.co}
                  </Typography>
                  <Divider />
                </Stack>
              </Grid> */}
            </Grid>

            {/* Show QR Code button */}
            {merchantProfileData?.qrType === 'Static' && (
              <Grid item md={12 / 3} xs={12}>
                <Stack direction="column" spacing={12} alignItems="center">
                  <Button
                    variant="outlined"
                    startIcon={<QrCode2Icon />}
                    sx={{ borderRadius: 2 }}
                    onClick={() => {
                      generateQrCode(merchantProfileData);
                      showModal();
                    }}
                  >
                    {tAccount('detailShowQr')}
                  </Button>
                </Stack>
              </Grid>
            )}
          </Card>
        )}
      </Stack>

      <ViewPhotoModal
        title={tAccount('detailQRCode')}
        isActive={isActive}
        onHide={hideModal}
        selectedFile={null}
        qrData={qrContent}
      />
    </Stack>
  );
};

export default AccountInformation;
