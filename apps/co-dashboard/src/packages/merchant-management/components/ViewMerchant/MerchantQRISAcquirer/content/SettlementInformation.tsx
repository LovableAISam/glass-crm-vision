// Components
import { Box, Divider, Grid, Stack, Typography } from '@mui/material';

// Hooks & Utils
import { useTranslation } from 'react-i18next';

// Types & Consts
import { ViewMerchantQrisAcquirerTabProps } from '../ViewMerchantQrisAcquirerTab';

function SettlementInformation(props: ViewMerchantQrisAcquirerTabProps) {
  const { merchantDetail } = props;

  const { t: tMerchant } = useTranslation('merchant');

  return (
    <Box mb={4}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {tMerchant('detailCooperationAgreement')}
      </Typography>
      {merchantDetail?.cooperationAgreementList.map((el, idx) => [
        <Grid key={idx} container spacing={2} rowSpacing={4} sx={{ mb: 6 }}>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={2}>
              <Typography variant="body2">
                {tMerchant('detailNameOfAuthorizedOfficial')}
              </Typography>
              <Typography variant="subtitle2">
                {el.name || '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={2}>
              <Typography variant="body2">
                {tMerchant('detailJabatan')}
              </Typography>
              <Typography variant="subtitle2">
                {el.position || '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
        </Grid>,
      ])}

      <Typography variant="h5" sx={{ mb: 2 }}>
        {tMerchant('detailSettlementInformation')}
      </Typography>
      <Grid container spacing={2} rowSpacing={4}>
        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailPICNameOfFinance')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.picNameOfFinance || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailPICEmailOfFinance')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.picEmailOfFinance || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailBankNameBranch')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.bankName || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailAccountNo')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.accountNumber || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailAccountName')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.accountName || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SettlementInformation;
