import React, { useState } from 'react';
import { Box, Grid, Stack, Typography, Divider } from '@mui/material';
import { UploadDocumentData } from '@woi/uploadDocument';
import useModal from '@woi/common/hooks/useModal';
import { ViewPhotoModal } from '@woi/web-component';
import ImageUpload from '@src/shared/components/FormUpload/ImageUpload';
import { ViewKYCRequestTabProps } from '../ViewKYCRequestTab';
import { useTranslation } from 'react-i18next';

function PersonalData(props: ViewKYCRequestTabProps) {
  const {
    kycDetail,
    listCountryResidence,
    listCountryDomicile,
    listProvinceResidence,
    listProvinceDomicile,
    listCityResidence,
    listCityDomicile,
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
        {tKYC('personalDataTitle')}
      </Typography>
      <Grid container spacing={2} rowSpacing={4} sx={{ mb: 6 }}>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataFullName')}
            </Typography>
            <Typography variant="subtitle2">
              {kycDetail?.premiumMember.fullName}
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
              {kycDetail?.premiumMember.gender}
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
              {kycDetail?.premiumMember.placeOfBirth}
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
              {kycDetail?.premiumMember.dateOfBirth}
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
              {kycDetail?.identityCard.type}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        {kycDetail?.identityCard.licenseType && (
          <Grid item md={6} xs={12}>
            <Stack direction="column" spacing={2}>
              <Typography variant="body2">
                {tKYC('personalDataSIMType')}
              </Typography>
              <Typography variant="subtitle2">
                {kycDetail?.identityCard.licenseType}
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
              {kycDetail?.identityCard.number}
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
              {kycDetail?.premiumMember.bloodType}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataEmail')}</Typography>
            <Typography variant="subtitle2">
              {kycDetail?.premiumMember.modifiedBy}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
      </Grid>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        {tKYC('personalDataAddressInformation')}
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
                  item => item.id === kycDetail?.premiumMember.nationalityId,
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
                  item => item.id === kycDetail?.memberResidence.provinceId,
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
                  item => item.id === kycDetail?.memberResidence.cityId,
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
              {kycDetail?.memberResidence.postalCode}
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
              {kycDetail?.memberResidence.address}
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
                listCountryDomicile?.data.find(
                  item => item.id === kycDetail?.premiumMember.nationalityId,
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
                  item => item.id === kycDetail?.identityCard.provinceId,
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
                  item => item.id === kycDetail?.identityCard.cityId,
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
              {kycDetail?.identityCard.postalCode}
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
              {kycDetail?.identityCard.address}
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
            {tKYC('personalDataSelfieWithKTP')}
          </Typography>
          {kycDetail && (
            <ImageUpload
              viewOnly
              selectedFile={kycDetail.selfie}
              selectedImage={kycDetail.selfie.docPath}
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
