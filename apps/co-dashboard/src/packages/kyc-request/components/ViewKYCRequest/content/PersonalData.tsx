import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import ImageUpload from '@src/shared/components/FormUpload/ImageUpload';
import useModal from '@woi/common/hooks/useModal';
import { UploadDocumentData } from '@woi/uploadDocument';
import { ViewPhotoModal } from '@woi/web-component';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ViewKYCRequestTabProps } from '../ViewKYCRequestTab';

function PersonalData(props: ViewKYCRequestTabProps) {
  const {
    kycDetail,
    listCountryResidence,
    listCityResidence,
    customerProfile,
    memberDetail
  } = props;
  const [selectedView, setSelectedView] = useState<UploadDocumentData | null>(
    null,
  );
  const [modalTitle, setModalTitle] = useState<string>('');
  const [isActiveView, showModalView, hideModalView] = useModal();
  const { t: tKYC } = useTranslation('kyc');

  const handleView = (_modalTitle: string) => {
    setModalTitle(_modalTitle);
    showModalView();
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {tKYC('personalDataIdentityDetails')}
      </Typography>

      <Grid container spacing={2} rowSpacing={4} sx={{ mb: 6 }}>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataFullName')}
            </Typography>
            <Typography variant="subtitle2">
              {`${kycDetail?.premiumMember?.firstName} ${kycDetail?.premiumMember?.middleName} ${kycDetail?.premiumMember?.lastName}` || '-'}
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
              {
                customerProfile?.gender?.find(
                  item => item.genderCode === kycDetail?.premiumMember?.gender,
                )?.genderDescription
                || '-'}
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
              {kycDetail?.premiumMember?.motherMaidenName || '-'}
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
              {kycDetail?.premiumMember?.dateOfBirth || '-'}
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
              {kycDetail?.premiumMember?.email || memberDetail?.email || '-'}
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
              {kycDetail?.identityCard.type || '-'}
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
              -
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
              {kycDetail?.identityCard.number || '-'}
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
              {kycDetail?.premiumMember?.placeOfBirth || '-'}
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
              {kycDetail?.premiumMember?.cityOfBirth || '-'}
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
              {kycDetail?.premiumMember?.districtOfBirth || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 3 }}>
        {tKYC('personalDataAddressInformation')}
      </Typography>

      <Grid container spacing={2} rowSpacing={4} sx={{ mb: 6 }}>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataCountryResidence')}</Typography>
            <Typography variant="subtitle2">
              {
                listCountryResidence?.find(
                  item => item.countryCode === kycDetail?.premiumMember?.nationalityId,
                )?.countryName
                || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataCity')}</Typography>
            <Typography variant="subtitle2">
              {
                listCityResidence?.find(
                  item => item.code === kycDetail?.memberResidence.cityId,
                )?.name
                || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataTownorDistrict')}</Typography>
            <Typography variant="subtitle2">
              {kycDetail?.memberResidence.barangay || '-'}
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
              {kycDetail?.memberResidence.address || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataPostalCode')}
            </Typography>
            <Typography variant="subtitle2">
              {kycDetail?.memberResidence.postalCode || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 3 }}>
        {tKYC('personalDataWorkInformation')}
      </Typography>

      <Grid container spacing={2} rowSpacing={4} sx={{ mb: 6 }}>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataSourceIncome')}
            </Typography>
            <Typography variant="subtitle2">
              {
                customerProfile?.sourceOfFunds?.find(
                  item => item.sourceOfFundsCode === kycDetail?.premiumMember?.sourceOfFunds,
                )?.sourceOfFundsDescription
                || '-'}
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
              {kycDetail?.premiumMember?.employer || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataJobTitle')}</Typography>
            <Typography variant="subtitle2">
              {kycDetail?.premiumMember?.jobTitle || '-'}
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
              {
                customerProfile?.natureOfBusiness?.find(
                  item => item.natureOfBusinessCode === kycDetail?.premiumMember?.natureOfWork,
                )?.natureOfBusinessDescription
                || '-'}
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
              {kycDetail?.premiumMember?.referralCode || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 3 }}>
        {tKYC('personalDataKYC')}
      </Typography>

      <Stack direction="column" spacing={2}>
        <Stack direction="column" spacing={2}>
          <Typography variant="subtitle1">
            {tKYC('personalDataIDCard')}
          </Typography>
          {kycDetail && (
            <ImageUpload
              viewOnly
              selectedFile={kycDetail.identityCardUpload}
              selectedImage={kycDetail.identityCardUpload.docPath}
              onView={file => {
                setSelectedView(file);
                handleView('ID Card');
              }}
            />
          )}
        </Stack>
        <Stack direction="column" spacing={2}>
          <Typography variant="subtitle1">
            {tKYC('personalDataSelfieVerification')}
          </Typography>
          {kycDetail && (
            <ImageUpload
              viewOnly
              selectedFile={kycDetail.selfie}
              selectedImage={kycDetail.selfie.docPath}
              onView={file => {
                setSelectedView(file);
                handleView('Selfie Verification');
              }}
            />
          )}
        </Stack>
        <Stack direction="column" spacing={2}>
          <Typography variant="subtitle1">
            {tKYC('personalDataSignature')}
          </Typography>
          {kycDetail && (
            <ImageUpload
              viewOnly
              selectedFile={kycDetail.signature}
              selectedImage={kycDetail.signature.docPath}
              onView={file => {
                setSelectedView(file);
                handleView('Signature');
              }}
            />
          )}
        </Stack>
      </Stack>
      <ViewPhotoModal
        title={modalTitle}
        isActive={isActiveView}
        onHide={hideModalView}
        selectedFile={selectedView}
      />
    </Box>
  );
}

export default PersonalData;
