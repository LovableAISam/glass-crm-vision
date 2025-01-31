// Components
import { Divider, Grid, Stack, Typography } from '@mui/material';

// Hooks & Utils
import { useTranslation } from 'react-i18next';

// Types & Consts
import { ViewMerchantAccountBindingTabProps } from '../ViewMerchantAccountBindingTab';

function MerchantData2(props: ViewMerchantAccountBindingTabProps) {
  const { merchantDetail } = props;

  const { t: tMerchant } = useTranslation('merchant');

  return (
    <Grid container spacing={2} rowSpacing={4} mb={4} pt={4}>
      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">
            {tMerchant('detailMerchantCompleteName')}
          </Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.merchantCompleteName || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">
            {tMerchant('detailMerchantShortName')}
          </Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.merchantShortName || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">{tMerchant('detailPassword')}</Typography>
          <Typography variant="subtitle2">
            {/* {merchantDetail?.password === undefined
              ? 'NO OBJECT DATA'
              : merchantDetail?.password || '-'} */}
            ********
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">
            {tMerchant('detailIsQrisTag51')}
          </Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.isTag51Only ? 'True' : 'False'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">{tMerchant('detailQrType')}</Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.qrType || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">
            {tMerchant('detailMerchantType')}
          </Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.merchantType || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">
            {tMerchant('detailMerchantCriteria')}
          </Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.merchantCriteriaName || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">
            {tMerchant('detailMerchantCategoryCode')}
          </Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.merchantCategoryCodeName || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">
            {tMerchant('detailGrossRevenue')}
          </Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.grossRevenue || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">
            {tMerchant('detailComparisonOfTransaction')}
          </Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.comparisonOfTransactionFrom || '-'}%
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">
            {tMerchant('detailMerchantEmail')}
          </Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.email || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">{tMerchant('detailNikNib')}</Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.nikOrNib || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">
            {tMerchant('detailDateOfMerchantRelease')}
          </Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.merchantReleaseDate || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">
            {tMerchant('detailMdrPercentage')}
          </Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.mdrPercentage || '-'}%
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">
            {tMerchant('detailAuthTokenUrl')}
          </Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.authTokenRequestUrl || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">
            {tMerchant('detailPaymentNotifyUrl')}
          </Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.paymentNotificationUrl || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">
            {tMerchant('detailSecretKey')}
          </Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.secretKey || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">{tMerchant('detailClientId')}</Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.clientId || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">
            {tMerchant('detailPublicKey')}
          </Typography>
          <Typography variant="subtitle2" sx={{ overflowWrap: 'anywhere' }}>
            {merchantDetail?.publicKey || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">
            {tMerchant('detailMerchantAddressCorrespondence')}
          </Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.merchantAddressCorrespondence || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">{tMerchant('detailCity')}</Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.merchantAddressCorrespondenceCity || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">{tMerchant('detailProvince')}</Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.merchantAddressCorrespondenceProvince || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">{tMerchant('detailPostCode')}</Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.merchantAddressCorrespondencePostalCode || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">
            {tMerchant('detailMerchantLocation')}
          </Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.merchantLocation || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">{tMerchant('detailNpwp')}</Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.npwp || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">{tMerchant('detailTipsType')}</Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.tipsType || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">
            {tMerchant('detailSocialMedia')}
          </Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.socialMedia || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">{tMerchant('detailWebsite')}</Typography>
          <Typography variant="subtitle2">
            {merchantDetail?.webSite || '-'}
          </Typography>
          <Divider />
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">
            {tMerchant('detailEffectiveDate')}
          </Typography>
          <Typography variant="subtitle2">{`${merchantDetail?.effectiveDateFrom} - ${merchantDetail?.effectiveDateTo}`}</Typography>
          <Divider />
        </Stack>
      </Grid>
    </Grid>
  );
}

export default MerchantData2;
