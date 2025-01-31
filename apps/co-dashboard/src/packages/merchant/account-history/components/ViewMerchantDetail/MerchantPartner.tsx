// Component
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

// Hooks & Utils
import { DateConvert, PriceConverter } from '@woi/core';
import { Token } from '@woi/web-component';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';
import { ViewMerchantDetailTabProps } from "../ViewMerchantDetailTab";

// Icons
import CloseIcon from '@mui/icons-material/Close';

const DetailMerchantPartner = (
  props: ViewMerchantDetailTabProps,
) => {
  const { isActive, onHide, accountHistoryDetail } = props;

  const router = useRouter();
  const { t: tAccount } = useTranslation('account');

  return (
    <Dialog
      open={isActive}
      onClose={onHide}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        },
      }}
      maxWidth="xl"
      fullWidth
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">
            {tAccount('detailTitleOrderMerchant')}
          </Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ display: 'none' }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tAccount('detailDate')}
              </Typography>
              <Typography variant="subtitle2">
                {accountHistoryDetail?.date
                  ? DateConvert.stringToDateFormat(
                    accountHistoryDetail?.date,
                    LONG_DATE_TIME_FORMAT,
                  )
                  : '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tAccount('detailTransactionType')}
              </Typography>
              <Typography variant="subtitle2">
                {accountHistoryDetail?.transactionType || '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tAccount('detailMembersPhoneNumber')}
              </Typography>
              <Typography variant="subtitle2">
                {accountHistoryDetail?.membersPhoneNo || '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tAccount('detailMerchantsPhoneNumber')}
              </Typography>
              <Typography variant="subtitle2">
                {accountHistoryDetail?.merchantPhoneNo || '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tAccount('detailAmount')}
              </Typography>
              <Typography variant="subtitle2">
                {PriceConverter.formatPrice(
                  accountHistoryDetail?.amount || 0,
                  router.locale,
                )}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tAccount('detailStatus')}
              </Typography>
              <Typography variant="subtitle2">
                {accountHistoryDetail?.status || '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tAccount('detailMDR')}
              </Typography>
              <Typography variant="subtitle2">
                {PriceConverter.formatPrice(
                  accountHistoryDetail?.mdr || 0,
                  router.locale,
                )}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tAccount('detailReferralNumber')}
              </Typography>
              <Typography variant="subtitle2">
                {accountHistoryDetail?.referralNumber || '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tAccount('detailTransactionNumber')}
              </Typography>
              <Typography variant="subtitle2">
                {accountHistoryDetail?.transactionNumber || '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tAccount('detailPaymentMethod')}
              </Typography>
              <Typography variant="subtitle2">
                {accountHistoryDetail?.paymentMethod || '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tAccount('detailRRN')}
              </Typography>
              <Typography variant="subtitle2">
                {accountHistoryDetail?.rrn || '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tAccount('detailMerchantLongName')}
              </Typography>
              <Typography variant="subtitle2">
                {accountHistoryDetail?.merchantLongName || '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tAccount('detailQRISMerchantLocation')}
              </Typography>
              <Typography variant="subtitle2">
                {accountHistoryDetail?.qrisMerchantLocation || '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tAccount('detailAcquirerName')}
              </Typography>
              <Typography variant="subtitle2">
                {accountHistoryDetail?.acquirerName || '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tAccount('detailMerchantPAN')}
              </Typography>
              <Typography variant="subtitle2">
                {accountHistoryDetail?.merchantPan || '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tAccount('detailTerminalID')}
              </Typography>
              <Typography variant="subtitle2">
                {accountHistoryDetail?.terminalId || '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tAccount('detailCustomerPAN')}
              </Typography>
              <Typography variant="subtitle2">
                {accountHistoryDetail?.customerPan || '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tAccount('detailTransactionAmount')}
              </Typography>
              <Typography variant="subtitle2">
                {PriceConverter.formatPrice(
                  accountHistoryDetail?.transactionAmount || 0,
                  router.locale,
                )}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tAccount('detailTips')}
              </Typography>
              <Typography variant="subtitle2">
                {PriceConverter.formatPrice(
                  accountHistoryDetail?.tips || 0,
                  router.locale,
                )}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default DetailMerchantPartner;
