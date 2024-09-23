import React, { useState } from 'react';
import { Box, Grid, Stack, Typography, Divider } from "@mui/material";
import { UploadDocumentData } from '@woi/uploadDocument';
import useModal from '@woi/common/hooks/useModal';
import { ViewPhotoModal } from '@woi/web-component';
import ImageUpload from '@src/shared/components/FormUpload/ImageUpload';
import { ViewKYCRequestTabProps } from '../ViewKYCRequestTab';
import { useTranslation } from 'react-i18next';

function PersonalData(props: ViewKYCRequestTabProps) {
  const { kycDetail } = props;
  const [selectedView, setSelectedView] = useState<UploadDocumentData | null>(null);
  const [modalTitle, setModalTitle] = useState<string>('')
  const [isActiveView, showModalView, hideModalView] = useModal();
  const { t: tKYC } = useTranslation('kyc');

  const handleView = (_modalTitle: string) => {
    setModalTitle(_modalTitle)
    showModalView();
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>{tKYC('personalDataTitle')}</Typography>
      <Grid container spacing={2} rowSpacing={4} sx={{ mb: 2 }}>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataFullName')}</Typography>
            <Typography variant="subtitle2">{kycDetail?.fullName}</Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataGender')}</Typography>
            <Typography variant="subtitle2">{kycDetail?.gender}</Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataPlaceOfBirth')}</Typography>
            <Typography variant="subtitle2">
              {kycDetail?.placeOfBirth}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataDateOfBirth')}</Typography>
            <Typography variant="subtitle2">
              {kycDetail?.dateOfBirth}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataIDType')}</Typography>
            <Typography variant="subtitle2">
              {kycDetail?.identityType}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataIDNumber')}</Typography>
            <Typography variant="subtitle2">
              {kycDetail?.identityNumber}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={12} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataEmail')}</Typography>
            <Typography variant="subtitle2">{kycDetail?.email}</Typography>
            <Divider />
          </Stack>
        </Grid>
      </Grid>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>{tKYC('personalDataAddressInformation')}</Typography>
      <Grid container spacing={2} rowSpacing={4} sx={{ mb: 2 }}>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataCountry')}</Typography>
            <Typography variant="subtitle2">
              {kycDetail?.province?.country?.name}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataProvince')}</Typography>
            <Typography variant="subtitle2">
              {kycDetail?.province?.name}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataCity')}</Typography>
            <Typography variant="subtitle2">{kycDetail?.city?.name}</Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataPostalCode')}</Typography>
            <Typography variant="subtitle2">{kycDetail?.zipCode}</Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={12} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataAddressDetail')}</Typography>
            <Typography variant="subtitle2">{kycDetail?.address}</Typography>
            <Divider />
          </Stack>
        </Grid>
      </Grid>
      <Typography variant="h5" sx={{ mb: 2 }}>{tKYC('personalDataKYC')}</Typography>
      <Stack direction="column" spacing={2}>
        <Stack direction="column" spacing={2}>
          <Typography variant="subtitle1">{tKYC('personalDataIDCard')}</Typography>
          {kycDetail && (
            <ImageUpload
              viewOnly
              selectedFile={kycDetail.identityCard}
              selectedImage={kycDetail.identityCard.docPath}
              onView={file => {
                setSelectedView(file);
                handleView('ID Card');
              }}
            />
          )}
        </Stack>
        <Stack direction="column" spacing={2}>
          <Typography variant="subtitle1">{tKYC('personalDataSelfieWithKTP')}</Typography>
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
          <Typography variant="subtitle1">{tKYC('personalDataSignature')}</Typography>
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
  )
}

export default PersonalData;