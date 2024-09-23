import React, { useState } from 'react';
import { Box, Grid, Stack, Typography, Divider } from "@mui/material";
import { UploadDocumentData } from '@woi/uploadDocument';
import useModal from '@woi/common/hooks/useModal';
import { ViewPhotoModal } from '@woi/web-component';
import ImageUpload from '@src/shared/components/FormUpload/ImageUpload';
import { useTranslation } from 'react-i18next';

interface KYCRequestData {
  fullName: string;
  gender: string;
  placeOfBirth: string;
  dateOfBirth: string;
  idType: string;
  idNumber: string;
  email: string;
}

interface AddressData {
  country: string;
  province: string;
  city: string;
  postalCode: string;
  address: string;
}

interface KYCRequestForm {
  idCard: UploadDocumentData | null;
  selfie: UploadDocumentData | null;
  signature: UploadDocumentData | null;
}

function PersonalData() {
  const [kycRequestData] = useState<KYCRequestData>({
    fullName: 'Mukhtar Fauzi Dharmawanto',
    gender: 'Male',
    placeOfBirth: 'Bandar Lampung',
    dateOfBirth: '2 Mar 1993',
    idType: 'Surat Izin Mengemudi',
    idNumber: '187 109284801002',
    email: 'fauzidharmawan@gmail.com',
  })
  const [addressData] = useState<AddressData>({
    country: 'Indonesia',
    province: 'DKI Jakarta',
    city: 'Jakarta',
    postalCode: '10110',
    address: 'Jl Lorem Ipsum, Blok D3/8. RT/RW 011/007. Kebon Jeruk.',
  })
  const [selectedFile, setSelectedFile] = useState<KYCRequestForm>({
    idCard: null,
    selfie: null,
    signature: null,
  });
  const [selectedView, setSelectedView] = useState<UploadDocumentData | null>(null);
  const [selectedIdCard, setSelectedIdCard] = useState<string | null>(null);
  const [selectedSelfie, setSelectedSelfie] = useState<string | null>(null);
  const [selectedSignature, setSelectedSignature] = useState<string | null>(null);
  const [ isActiveView, showModalView, hideModalView ] = useModal();
  const { t: tKYC } = useTranslation('kyc');

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>{tKYC('personalDataTitle')}</Typography>
      <Grid container spacing={2} rowSpacing={4} sx={{ mb: 2 }}>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataFullName')}</Typography>
            <Typography variant="subtitle2">{kycRequestData.fullName}</Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataGender')}</Typography>
            <Typography variant="subtitle2">{kycRequestData.gender}</Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataPlaceOfBirth')}</Typography>
            <Typography variant="subtitle2">{kycRequestData.placeOfBirth}</Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataDateOfBirth')}</Typography>
            <Typography variant="subtitle2">{kycRequestData.dateOfBirth}</Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataIDType')}</Typography>
            <Typography variant="subtitle2">{kycRequestData.idType}</Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataIDNumber')}</Typography>
            <Typography variant="subtitle2">{kycRequestData.idNumber}</Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={12} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataEmail')}</Typography>
            <Typography variant="subtitle2">{kycRequestData.email}</Typography>
            <Divider />
          </Stack>
        </Grid>
      </Grid>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>{tKYC('personalDataAddressInformation')}</Typography>
      <Grid container spacing={2} rowSpacing={4} sx={{ mb: 2 }}>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataCountry')}</Typography>
            <Typography variant="subtitle2">{addressData.country}</Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataProvince')}</Typography>
            <Typography variant="subtitle2">{addressData.province}</Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataCity')}</Typography>
            <Typography variant="subtitle2">{addressData.city}</Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataPostalCode')}</Typography>
            <Typography variant="subtitle2">{addressData.postalCode}</Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={12} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataAddressDetail')}</Typography>
            <Typography variant="subtitle2">{addressData.address}</Typography>
            <Divider />
          </Stack>
        </Grid>
      </Grid>
      <Typography variant="h5" sx={{ mb: 2 }}>{tKYC('personalDataKYC')}</Typography>
      <Stack direction="column" spacing={2}>
        <Stack direction="column" spacing={2}>
          <Typography variant="subtitle1">{tKYC('personalDataIDCard')}</Typography>
          <ImageUpload 
            selectedFile={selectedFile.idCard}
            selectedImage={selectedIdCard}
            onChange={(file) => setSelectedFile(oldForm => ({ ...oldForm, idCard: file }))} 
            onChangeImage={(file) => setSelectedIdCard(file)}
            onView={(file) => {
              setSelectedView(file);
              showModalView();
            }}
          />
        </Stack>
        <Stack direction="column" spacing={2}>
          <Typography variant="subtitle1">{tKYC('personalDataSelfieWithKTP')}</Typography>
          <ImageUpload 
            selectedFile={selectedFile.selfie}
            selectedImage={selectedSelfie}
            onChange={(file) => setSelectedFile(oldForm => ({ ...oldForm, selfie: file }))} 
            onChangeImage={(file) => setSelectedSelfie(file)}
            onView={(file) => {
              setSelectedView(file);
              showModalView();
            }}
          />
        </Stack>
        <Stack direction="column" spacing={2}>
          <Typography variant="subtitle1">{tKYC('personalDataSignature')}</Typography>
          <ImageUpload 
            selectedFile={selectedFile.signature}
            selectedImage={selectedSignature}
            onChange={(file) => setSelectedFile(oldForm => ({ ...oldForm, signature: file }))} 
            onChangeImage={(file) => setSelectedSignature(file)}
            onView={(file) => {
              setSelectedView(file);
              showModalView();
            }}
          />
        </Stack>
      </Stack>
      <ViewPhotoModal isActive={isActiveView} onHide={hideModalView} selectedFile={selectedView} />
    </Box>
  )
}

export default PersonalData;