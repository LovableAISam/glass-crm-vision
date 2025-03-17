// Core
import React, { useState } from 'react';

// Components
import { Box, Grid, Stack, Typography, Divider, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ImageUpload from '@src/shared/components/FormUpload/ImageUpload';
import useModal from '@woi/common/hooks/useModal';
import { ViewPhotoModal } from '@woi/web-component';

// Const & Types
import { ViewManageMemberTabProps } from '../ViewManageMemberTab';
import { UploadDocumentData } from '@woi/uploadDocument';

function PersonalData(props: ViewManageMemberTabProps) {
  const {
    memberKYCDetail,
    listCountryResidence,
    listCountryDomicile,
    listProvinceResidence,
    listProvinceDomicile,
    listCityResidence,
    listCityDomicile,
    showModalUpdate,
    memberDetail
  } = props;
  const { t: tKYC } = useTranslation('kyc');
  const { t: tMember } = useTranslation('member');

  const [selectedView, setSelectedView] = useState<UploadDocumentData | null>(
    null,
  );
  const [modalTitle, setModalTitle] = useState<string>('');
  const [isActiveView, showModalView, hideModalView] = useModal();

  const handleView = (_modalTitle: string) => {
    setModalTitle(_modalTitle);
    showModalView();
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {tKYC('personalDataTitle')}
      </Typography>
      <Grid container spacing={2} rowSpacing={4} sx={{ mb: 6 }}>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataFullName')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.premiumMember.fullName}
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
              {memberKYCDetail?.premiumMember.gender}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataPlaceOfBirth')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.premiumMember.placeOfBirth}
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
              {memberKYCDetail?.premiumMember.dateOfBirth}
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
              {memberKYCDetail?.identityCard.type}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        {memberKYCDetail?.identityCard.licenseType && (
          <Grid item md={6} xs={12}>
            <Stack direction="column" spacing={2}>
              <Typography variant="body2">
                {tKYC('personalDataSIMType')}
              </Typography>
              <Typography variant="subtitle2">
                {memberKYCDetail?.identityCard.licenseType}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
        )}
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataIDNumber')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.identityCard.number}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataBloodType')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.premiumMember.bloodType}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataEmail')}</Typography>
            <Typography variant="subtitle2">
              {memberDetail?.email}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
      </Grid>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="subtitle1">
          {tKYC('personalDataAddressInformation')}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          sx={{
            py: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 900,
          }}
          onClick={showModalUpdate}
        >
          {tMember('buttonChangeAddress')}
        </Button>
      </Stack>
      <Grid container spacing={2} rowSpacing={4} sx={{ mb: 6 }}>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataCountry')}
            </Typography>
            <Typography variant="subtitle2">
              {
                listCountryDomicile?.data.find(
                  item =>
                    item.id === memberKYCDetail?.premiumMember.nationalityId,
                )?.name
              }
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataProvince')}
            </Typography>
            <Typography variant="subtitle2">
              {
                listProvinceDomicile?.data.find(
                  item => item.id === memberKYCDetail?.identityCard.provinceId,
                )?.name
              }
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataCity')}</Typography>
            <Typography variant="subtitle2">
              {
                listCityDomicile?.data.find(
                  item => item.id === memberKYCDetail?.identityCard.cityId,
                )?.name
              }
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
              {memberKYCDetail?.identityCard.postalCode}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={12} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataAddressDetail')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.identityCard.address}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
      </Grid>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        {tKYC('personalDataDomicileAddress')}
      </Typography>
      <Grid container spacing={2} rowSpacing={4} sx={{ mb: 6 }}>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataCountry')}
            </Typography>
            <Typography variant="subtitle2">
              {
                listCountryResidence?.data.find(
                  item =>
                    item.id === memberKYCDetail?.premiumMember.nationalityId,
                )?.name
              }
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataProvince')}
            </Typography>
            <Typography variant="subtitle2">
              {
                listProvinceResidence?.data.find(
                  item =>
                    item.id === memberKYCDetail?.memberResidence.provinceId,
                )?.name
              }
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataCity')}</Typography>
            <Typography variant="subtitle2">
              {
                listCityResidence?.data.find(
                  item => item.id === memberKYCDetail?.memberResidence.cityId,
                )?.name
              }
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
              {memberKYCDetail?.memberResidence.postalCode}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={12} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataAddressDetail')}
            </Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.memberResidence.address}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
      </Grid>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {tKYC('personalDataKYC')}
      </Typography>
      <Stack direction="column" spacing={2}>
        <Stack direction="column" spacing={2}>
          <Typography variant="subtitle1">
            {tKYC('personalDataIDCard')}
          </Typography>
          {memberKYCDetail && (
            <ImageUpload
              viewOnly
              selectedFile={memberKYCDetail.identityCardUpload}
              selectedImage={memberKYCDetail.identityCardUpload.docPath}
              onView={file => {
                setSelectedView(file);
                handleView('ID Card');
              }}
            />
          )}
        </Stack>
        <Stack direction="column" spacing={2}>
          <Typography variant="subtitle1">
            {tKYC('personalDataSelfieWithKTP')}
          </Typography>
          {memberKYCDetail && (
            <ImageUpload
              viewOnly
              selectedFile={memberKYCDetail.selfie}
              selectedImage={memberKYCDetail.selfie.docPath}
              onView={file => {
                setSelectedView(file);
                handleView('Selfie With KTP');
              }}
            />
          )}
        </Stack>
        <Stack direction="column" spacing={2}>
          <Typography variant="subtitle1">
            {tKYC('personalDataSignature')}
          </Typography>
          {memberKYCDetail && (
            <ImageUpload
              viewOnly
              selectedFile={memberKYCDetail.signature}
              selectedImage={memberKYCDetail.signature.docPath}
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
