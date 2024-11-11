import React from 'react';
import { Box, Grid, Stack, Typography, Divider } from '@mui/material';
import { EmptyList } from '@woi/web-component';
import { ViewManageMemberTabProps } from '../ViewManageMemberTab';
import { useTranslation } from 'react-i18next';

function PersonalData(props: ViewManageMemberTabProps) {
  const { memberDetail, memberKYCDetail } = props;
  const { t: tKYC } = useTranslation('kyc');

  if (memberDetail?.vybeMember === 'LITE' || memberDetail?.vybeMember === 'UNVERIFIED') {
    return (
      <EmptyList
        title={tKYC('personalDataEmptyTitle')}
        description={tKYC('personalDataEmptyDescription')}
        grayscale
      />
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {tKYC('personalDataIdentityDetails')}
      </Typography>

      <Grid container spacing={2} rowSpacing={4} sx={{ mb: 5 }}>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataFullName')}
            </Typography>
            <Typography variant="subtitle2" textTransform="capitalize">
              {memberKYCDetail?.name.toLocaleLowerCase() || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataGender')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.gender || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataMotherMaidenName')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.motherMaidenName || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataDateOfBirth')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.dateOfBirth || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataEmail')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.email || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataIDType')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.idType || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataTransactionDate')}
            </Typography>
            <Typography variant="subtitle2">
              {memberDetail?.vybeMember === "PRO" ? memberKYCDetail?.transactionDate || '-' : '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataIDNumber')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.idNumber || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataCountryofBirth')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.countryOfBirth || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataCityofBirth')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.cityOfBirth || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataDistrictBirth')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.townDistrictBirth || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 3 }}>
        {tKYC('personalDataAddressInformation')}
      </Typography>

      <Grid container spacing={2} rowSpacing={4} sx={{ mb: 5 }}>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataCountryResidence')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.countryOfResidence || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataCity')}</Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.city || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataTownorDistrict')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.barangay || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataZipCode')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.zipCode || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataCurrentAddress')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.streetAddress || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 3 }}>
        {tKYC('personalDataWorkInformation')}
      </Typography>

      <Grid container spacing={2} rowSpacing={4} sx={{ mb: 2 }}>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataSourceIncome')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.sourceOfIncome || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataEmployerorBusiness')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.employer || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataJobTitle')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.jobTitle || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataIndustry')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.industryId || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataReferalCode')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.referralCode || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PersonalData;
