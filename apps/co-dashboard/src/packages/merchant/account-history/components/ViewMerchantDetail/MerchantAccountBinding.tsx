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

const DetailMerchantAccountBIndiProps = (
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

      <DialogContent>
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
                {tAccount('detailMerchantAccountNo')}
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
                {tAccount('detailReferenceNumber')}
              </Typography>
              <Typography variant="subtitle2">
                {accountHistoryDetail?.referenceNumber || '-'}
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
                {tAccount('detailMerchantName')}
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
                {tAccount('detailFeeChargedMember')}
              </Typography>
              <Typography variant="subtitle2">
                {PriceConverter.formatPrice(
                  accountHistoryDetail?.feeChargedMember || 0,
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
                {tAccount('detailDebitOrCredit')}
              </Typography>
              <Typography variant="subtitle2">
                {accountHistoryDetail?.debitCredit || '-'}
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
                {tAccount('detailBalance')}
              </Typography>
              <Typography variant="subtitle2">
                {PriceConverter.formatPrice(
                  accountHistoryDetail?.balance || 0,
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
                {tAccount('detailCurrency')}
              </Typography>
              <Typography variant="subtitle2">
                {accountHistoryDetail?.currency || '-'}
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
                {tAccount('detailPartnerReferenceNumber')}
              </Typography>
              <Typography variant="subtitle2">
                {accountHistoryDetail?.partnerReferenceNumber || '-'}
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
                {tAccount('detailTotalAmount')}
              </Typography>
              <Typography variant="subtitle2">
                {PriceConverter.formatPrice(
                  accountHistoryDetail?.totalAmount || 0,
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
                {tAccount('detailFeeChargedMerchant')}
              </Typography>
              <Typography variant="subtitle2">
                {PriceConverter.formatPrice(
                  accountHistoryDetail?.feeChargedMerchant || 0,
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

export default DetailMerchantAccountBIndiProps;
