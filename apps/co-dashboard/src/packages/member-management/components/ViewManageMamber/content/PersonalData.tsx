import React, { useState } from 'react';
import { Box, Grid, Stack, Typography, Divider } from '@mui/material';
import { EmptyList, ViewPhotoModal } from '@woi/web-component';
import { ViewManageMemberTabProps } from '../ViewManageMemberTab';
import { useTranslation } from 'react-i18next';
import { UploadDocumentData } from "@woi/uploadDocument";
import useModal from "@woi/common/hooks/useModal";
import ImageUpload from "@src/shared/components/FormUpload/ImageUpload";
import { DateConvert } from "@woi/core";
import { LONG_DATE_TIME_FORMAT_BE } from "@woi/core/utils/date/constants";

function PersonalData(props: ViewManageMemberTabProps) {
  const {
    memberDetail,
    memberKYCDetail,
    listCountryResidence,
    // listCityResidence,
    // customerProfile
  } = props;
  const { t: tKYC } = useTranslation('kyc');

  const [selectedView, setSelectedView] = useState<UploadDocumentData | null>(
    null,
  );
  const [modalTitle, setModalTitle] = useState<string>('');
  const [isActiveView, showModalView, hideModalView] = useModal();

  const handleView = (_modalTitle: string) => {
    setModalTitle(_modalTitle);
    showModalView();
  };

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

      <Grid container spacing={2} rowSpacing={4} sx={{ mb: 6 }}>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tKYC('personalDataFullName')}
            </Typography>
            <Typography variant="subtitle2">
              {`${memberKYCDetail?.premiumMember?.firstName} ${memberKYCDetail?.premiumMember?.middleName} ${memberKYCDetail?.premiumMember?.lastName}` || '-'}
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
              {/* {customerProfile?.gender?.find(
                item => item.genderCode === memberKYCDetail?.premiumMember?.gender,
              )?.genderDescription
                || '-'} */}
              {memberKYCDetail?.premiumMember?.gender}
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
              {memberKYCDetail?.premiumMember?.motherMaidenName || '-'}
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
              {memberKYCDetail?.premiumMember?.dateOfBirth || '-'}
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
              {memberKYCDetail?.premiumMember?.email || memberDetail?.email || '-'}
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
              {memberKYCDetail?.identityCard.type || '-'}
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
              {memberDetail?.vybeMember === "PRO"
                ? memberKYCDetail?.premiumMember.transactionDate
                  ? DateConvert.stringToDateFormat(
                    memberKYCDetail?.premiumMember.transactionDate,
                    LONG_DATE_TIME_FORMAT_BE,
                  ) : '-'
                : '-'}
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
              {memberKYCDetail?.identityCard.number || '-'}
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
              {memberKYCDetail?.premiumMember?.placeOfBirth || '-'}
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
              {memberKYCDetail?.premiumMember?.cityOfBirth || '-'}
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
              {memberKYCDetail?.premiumMember?.districtOfBirth || '-'}
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
                  item => item.countryCode === memberKYCDetail?.premiumMember?.nationalityId,
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
              {/* {
                listCityResidence?.find(
                  item => item.code === memberKYCDetail?.memberResidence.cityId,
                )?.name
                || '-'} */}
              {memberKYCDetail?.memberResidence.cityId}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataTownorDistrict')}</Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.memberResidence.barangay || '-'}
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
              {memberKYCDetail?.memberResidence.address || '-'}
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
              {memberKYCDetail?.memberResidence.postalCode || '-'}
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
              {/* {
                customerProfile?.sourceOfFunds?.find(
                  item => item.sourceOfFundsCode === memberKYCDetail?.premiumMember?.sourceOfFunds,
                )?.sourceOfFundsDescription
                || '-'} */}
              {memberKYCDetail?.premiumMember?.sourceOfFunds}
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
              {memberKYCDetail?.premiumMember?.employer || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tKYC('personalDataJobTitle')}</Typography>
            <Typography variant="subtitle2">
              {memberKYCDetail?.premiumMember?.jobTitle || '-'}
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
              {/* {
                customerProfile?.natureOfBusiness?.find(
                  item => item.natureOfBusinessCode === memberKYCDetail?.premiumMember?.natureOfWork,
                )?.natureOfBusinessDescription
                || '-'} */}
              {memberKYCDetail?.premiumMember?.natureOfWork}
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
              {memberKYCDetail?.premiumMember?.referralCode || '-'}
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
            {tKYC('personalDataSelfieVerification')}
          </Typography>
          {memberKYCDetail && (
            <ImageUpload
              viewOnly
              selectedFile={memberKYCDetail.selfie}
              selectedImage={memberKYCDetail.selfie.docPath}
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
