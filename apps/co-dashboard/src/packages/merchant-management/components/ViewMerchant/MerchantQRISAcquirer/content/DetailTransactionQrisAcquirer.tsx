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
import { MerchantTransactionHistoryData } from "@woi/service/co/merchant/merchantTransactionHistoryList";

// Icons
import CloseIcon from '@mui/icons-material/Close';

type ViewMerchantDetailTrxTabProps = {
  isActive: boolean;
  onHide: () => void;
  historyDetail: MerchantTransactionHistoryData | null;
};

const DetailTransactionQRISAcquirer = (
  props: ViewMerchantDetailTrxTabProps,
) => {
  const { isActive, onHide, historyDetail } = props;

  const router = useRouter();
  const { t: tMerchant } = useTranslation('merchant');

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
            {tMerchant('detailTransactionDetail')}
          </Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tMerchant('transactionHistoryTableHeaderDate')}
              </Typography>
              <Typography variant="subtitle2">
                {historyDetail?.postDate
                  ? DateConvert.stringToDateFormat(
                    historyDetail?.postDate,
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
                {tMerchant('transactionHistoryTableHeaderQRType')}
              </Typography>
              <Typography variant="subtitle2">
                {historyDetail?.qrType || '-'}
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
                {tMerchant('transactionHistoryTableHeaderMembersPhoneNo')}
              </Typography>
              <Typography variant="subtitle2">
                {historyDetail?.memberPhoneNumber || '-'}
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
                {tMerchant('transactionHistoryTableHeaderDestination')}
              </Typography>
              <Typography variant="subtitle2">
                {historyDetail?.destination || '-'}
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
                {tMerchant('transactionHistoryTableHeaderIssuer')}
              </Typography>
              <Typography variant="subtitle2">
                {historyDetail?.issuer || '-'}
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
                {tMerchant('transactionHistoryTableHeaderAmount')}
              </Typography>
              <Typography variant="subtitle2">
                {PriceConverter.formatPrice(
                  historyDetail?.amount || 0,
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
                {tMerchant('transactionHistoryTableHeaderMDR')}
              </Typography>
              <Typography variant="subtitle2">
                {historyDetail?.mdr || '-'}
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
                {tMerchant('transactionHistoryTableHeaderDebitCredit')}
              </Typography>
              <Typography variant="subtitle2">
                {PriceConverter.formatPrice(
                  historyDetail?.transactionCategory || 0,
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
                {tMerchant('transactionHistoryTableHeaderCurrency')}
              </Typography>
              <Typography variant="subtitle2">
                {historyDetail?.currency || '-'}
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
                {tMerchant('transactionHistoryTableHeaderBalance')}
              </Typography>
              <Typography variant="subtitle2">
                {historyDetail?.balanceAfterTransaction || '-'}
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
                {tMerchant('transactionHistoryTableHeaderRRN')}
              </Typography>
              <Typography variant="subtitle2">
                {historyDetail?.rrn || '-'}
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
                {tMerchant('transactionHistoryTableHeaderStatus')}
              </Typography>
              <Typography variant="subtitle2">
                {historyDetail?.status || '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default DetailTransactionQRISAcquirer;
