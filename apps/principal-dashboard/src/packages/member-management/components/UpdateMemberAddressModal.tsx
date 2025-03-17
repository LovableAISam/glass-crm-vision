import {
  Autocomplete,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Button } from '@woi/web-component';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import useUpdateAddressUpsert from '../hooks/useUpdateAddressUpsert';
import { KycPremiumMemberDetailHistoryForm } from '../hooks/useMemberUpsert';
import { useEffect } from 'react';
import { MemberData } from '@woi/service/co/idp/member/memberList';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';

type UpdateMemberAddressModalProps = {
  isActive: boolean;
  onHide: () => void;
  memberKYCDetail: KycPremiumMemberDetailHistoryForm | null;
  selectedData: MemberData;
  fetchMemberKYCHistoryDetail: (id: string) => Promise<void>;
};

const UpdateMemberAddressModal = (props: UpdateMemberAddressModalProps) => {
  const {
    isActive,
    onHide,
    memberKYCDetail,
    selectedData,
    fetchMemberKYCHistoryDetail,
  } = props;

  const { t: tCommon } = useTranslation('common');
  const { t: tMember } = useTranslation('member');
  const { t: tForm } = useTranslation('form');

  const {
    formData,
    handleUpsert,
    handleCancel,
    isAddressSame,
    setIsAddressSame,
    handleCheckboxChange,

    listProvinceIdentity,
    listCityIdentity,
    listSubDistrictIdentity,
    listUrbanVillageIdentity,
    fetchListProvinceIdentity,
    fetchListCityIdentity,
    fetchListSubDistrictIdentity,
    fetchListUrbanVillageIdentity,

    listProvinceDomicile,
    listCityDomicile,
    listSubDistrictDomicile,
    listUrbanVillageDomicile,
    fetchListProvinceDomicile,
    fetchListCityDomicile,
    fetchListSubDistrictDomicile,
    fetchListUrbanVillageDomicile,
  } = useUpdateAddressUpsert({
    onHide,
    memberKYCDetail,
    selectedData,
    fetchMemberKYCHistoryDetail,
  });
  const {
    formState: { errors },
    control,
    setValue,
  } = formData;

  const { field: fieldCountry } = useController({
    name: 'country',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Country' }),
    },
  });

  const { field: fieldProvince } = useController({
    name: 'province',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Province' }),
    },
  });

  const { field: fieldCity } = useController({
    name: 'cityId',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'City' }),
    },
  });

  const { field: fieldSubDistrict } = useController({
    name: 'subDistrictId',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Sub District' }),
    },
  });

  const { field: fieldUrbanVillage } = useController({
    name: 'urbanVillageId',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Urban Village' }),
    },
  });

  const { field: fieldPostalCode } = useController({
    name: 'postalCode',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Postal Code' }),
      minLength: {
        value: 5,
        message: 'Postal code must be at least 5 characters long',
      },
      maxLength: {
        value: 10,
        message: 'Postal code cannot exceed 10 characters',
      },
    },
  });

  const { field: fieldAddress } = useController({
    name: 'address',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Address' }),
    },
  });

  const { field: fieldCountryDomicile } = useController({
    name: 'countryDomicile',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'Country Domicile',
      }),
    },
  });

  const { field: fieldProvinceDomicile } = useController({
    name: 'provinceDomicile',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'Province Domicile',
      }),
    },
  });

  const { field: fieldCityDomicile } = useController({
    name: 'cityIdDomicile',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'City Domicile' }),
    },
  });

  const { field: fieldSubDistrictDomicile } = useController({
    name: 'subDistrictIdDomicile',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'Sub District Domivile',
      }),
    },
  });

  const { field: fieldUrbanVillageDomicile } = useController({
    name: 'urbanVillageIdDomicile',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'Urban Village Domicile',
      }),
    },
  });

  const { field: fieldPostalCodeDomicile } = useController({
    name: 'postalCodeDomicile',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'Postal Code Domicile',
      }),
      minLength: {
        value: 5,
        message: 'Postal code must be at least 5 characters long',
      },
      maxLength: {
        value: 10,
        message: 'Postal code cannot exceed 10 characters',
      },
    },
  });

  const { field: fieldAddressDomicile } = useController({
    name: 'addressDomicile',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'Address Domicile',
      }),
    },
  });

  useEffect(() => {
    if (memberKYCDetail) {
      setIsAddressSame(
        memberKYCDetail.premiumMember.isResidenceSameWithIdentityCard,
      );
      setValue('address', memberKYCDetail?.identityCard.address);
      setValue('postalCode', memberKYCDetail?.identityCard.postalCode);

      if (memberKYCDetail.premiumMember.isResidenceSameWithIdentityCard) {
        setValue('addressDomicile', memberKYCDetail?.identityCard.address);
        setValue(
          'postalCodeDomicile',
          memberKYCDetail?.identityCard.postalCode,
        );
      } else {
        setValue('addressDomicile', memberKYCDetail?.memberResidence.address);
        setValue(
          'postalCodeDomicile',
          memberKYCDetail?.memberResidence.postalCode,
        );
      }
    }
  }, [memberKYCDetail]);

  return (
    <Dialog
      open={isActive}
      onClose={onHide}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        },
      }}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">{tMember('modalUpdateAddress')}</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack gap={4}>
          {/* Identity Address */}
          <Stack>
            <Typography variant="h5">
              {tMember('addressInformationTitle')}
            </Typography>
            <Grid container spacing={2} sx={{ pt: 2 }}>
              <Grid item md={12} xs={12} display="none">
                <Typography variant="subtitle2" gutterBottom>
                  {tMember('formCountry')}
                </Typography>
                <Autocomplete
                  {...fieldCountry}
                  onChange={(_, value) => {
                    fieldCountry.onChange(value);
                    if (value) {
                      fetchListProvinceIdentity(value?.value, false);
                    }
                  }}
                  options={[]}
                  fullWidth
                  getOptionLabel={option => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'country',
                      })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                      error={Boolean(errors.country)}
                      helperText={errors.country?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {tMember('formProvince')}
                </Typography>
                <Autocomplete
                  {...fieldProvince}
                  onChange={(_, value) => {
                    fieldProvince.onChange(value);
                    setValue('cityId', null);
                    setValue('subDistrictId', null);
                    setValue('urbanVillageId', null);
                    if (value) {
                      fetchListCityIdentity(value?.value, false);
                    }
                  }}
                  options={listProvinceIdentity}
                  fullWidth
                  getOptionLabel={option => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'province',
                      })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                      error={Boolean(errors.province)}
                      helperText={errors.province?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {tMember('formCity')}
                </Typography>
                <Autocomplete
                  {...fieldCity}
                  onChange={(_, value) => {
                    fieldCity.onChange(value);
                    setValue('subDistrictId', null);
                    setValue('urbanVillageId', null);
                    if (value) {
                      fetchListSubDistrictIdentity(value?.value, false);
                    }
                  }}
                  options={listCityIdentity}
                  fullWidth
                  getOptionLabel={option => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'city',
                      })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                      error={Boolean(errors.cityId)}
                      helperText={errors.cityId?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {tMember('formSubDistrict')}
                </Typography>
                <Autocomplete
                  {...fieldSubDistrict}
                  onChange={(_, value) => {
                    fieldSubDistrict.onChange(value);
                    setValue('urbanVillageId', null);
                    if (value) {
                      fetchListUrbanVillageIdentity(value?.value, false);
                    }
                  }}
                  options={listSubDistrictIdentity}
                  fullWidth
                  getOptionLabel={option => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'sub district',
                      })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                      error={Boolean(errors.subDistrictId)}
                      helperText={errors.subDistrictId?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {tMember('formUrbanVillage')}
                </Typography>
                <Autocomplete
                  {...fieldUrbanVillage}
                  onChange={(_, value) => fieldUrbanVillage.onChange(value)}
                  options={listUrbanVillageIdentity}
                  fullWidth
                  getOptionLabel={option => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'urban village',
                      })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                      error={Boolean(errors.urbanVillageId)}
                      helperText={errors.urbanVillageId?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {tMember('formPostalCode')}
                </Typography>
                <TextField
                  {...fieldPostalCode}
                  error={Boolean(errors?.postalCode)}
                  helperText={errors?.postalCode?.message}
                  fullWidth
                  placeholder={tForm('placeholderType', {
                    fieldName: 'postal code',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {tMember('formAddress')}
                </Typography>
                <TextField
                  {...fieldAddress}
                  error={Boolean(errors.address)}
                  helperText={errors.address?.message}
                  fullWidth
                  placeholder={tForm('placeholderType', {
                    fieldName: 'address',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  multiline
                  minRows={2}
                  maxRows={3}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="timeout"
                      checked={isAddressSame}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label={
                    <Typography variant="subtitle2">
                      {tMember('labelCheckboxAddress')}
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
          </Stack>
          {/* Domicile Address */}
          <Stack display={isAddressSame ? 'none' : 'initial'}>
            <Typography variant="h5">
              {tMember('domicileAddressTitle')}
            </Typography>
            <Grid container spacing={2} sx={{ pt: 2 }}>
              <Grid item md={12} xs={12} display="none">
                <Typography variant="subtitle2" gutterBottom>
                  {tMember('formCountry')}
                </Typography>
                <Autocomplete
                  {...fieldCountryDomicile}
                  onChange={(_, value) => {
                    fieldCountryDomicile.onChange(value);
                    setValue('provinceDomicile', null);
                    setValue('cityIdDomicile', null);
                    setValue('subDistrictIdDomicile', null);
                    setValue('urbanVillageIdDomicile', null);
                    if (value) {
                      fetchListProvinceDomicile(value?.value, false);
                    }
                  }}
                  options={[]}
                  fullWidth
                  getOptionLabel={option => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'country',
                      })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                      error={Boolean(errors.countryDomicile)}
                      helperText={errors.countryDomicile?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {tMember('formProvince')}
                </Typography>
                <Autocomplete
                  {...fieldProvinceDomicile}
                  onChange={(_, value) => {
                    fieldProvinceDomicile.onChange(value);
                    setValue('cityIdDomicile', null);
                    setValue('subDistrictIdDomicile', null);
                    setValue('urbanVillageIdDomicile', null);
                    if (value) {
                      fetchListCityDomicile(value?.value, false);
                    }
                  }}
                  options={listProvinceDomicile}
                  fullWidth
                  getOptionLabel={option => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'province',
                      })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                      error={Boolean(errors.provinceDomicile)}
                      helperText={errors.provinceDomicile?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {tMember('formCity')}
                </Typography>
                <Autocomplete
                  {...fieldCityDomicile}
                  onChange={(_, value) => {
                    fieldCityDomicile.onChange(value);
                    setValue('subDistrictIdDomicile', null);
                    setValue('urbanVillageIdDomicile', null);
                    if (value) {
                      fetchListSubDistrictDomicile(value?.value, false);
                    }
                  }}
                  options={listCityDomicile}
                  fullWidth
                  getOptionLabel={option => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'city',
                      })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                      error={Boolean(errors.cityIdDomicile)}
                      helperText={errors.cityIdDomicile?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {tMember('formSubDistrict')}
                </Typography>
                <Autocomplete
                  {...fieldSubDistrictDomicile}
                  onChange={(_, value) => {
                    fieldSubDistrictDomicile.onChange(value);
                    setValue('urbanVillageIdDomicile', null);
                    if (value) {
                      fetchListUrbanVillageDomicile(value?.value, false);
                    }
                  }}
                  options={listSubDistrictDomicile}
                  fullWidth
                  getOptionLabel={option => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'sub district',
                      })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                      error={Boolean(errors.subDistrictIdDomicile)}
                      helperText={errors.subDistrictIdDomicile?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {tMember('formUrbanVillage')}
                </Typography>
                <Autocomplete
                  {...fieldUrbanVillageDomicile}
                  onChange={(_, value) =>
                    fieldUrbanVillageDomicile.onChange(value)
                  }
                  options={listUrbanVillageDomicile}
                  fullWidth
                  getOptionLabel={option => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'urban village',
                      })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                      error={Boolean(errors.urbanVillageIdDomicile)}
                      helperText={errors.urbanVillageIdDomicile?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {tMember('formPostalCode')}
                </Typography>
                <TextField
                  {...fieldPostalCodeDomicile}
                  error={Boolean(errors?.postalCodeDomicile)}
                  helperText={errors?.postalCodeDomicile?.message}
                  fullWidth
                  placeholder={tForm('placeholderType', {
                    fieldName: 'postal code',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {tMember('formAddress')}
                </Typography>
                <TextField
                  {...fieldAddressDomicile}
                  error={Boolean(errors.addressDomicile)}
                  helperText={errors.addressDomicile?.message}
                  fullWidth
                  placeholder={tForm('placeholderType', {
                    fieldName: 'address',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  multiline
                  minRows={2}
                  maxRows={3}
                />
              </Grid>
            </Grid>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={'flex-end'}
          sx={{ p: 2, flex: 1 }}
        >
          <AuthorizeView access="principal" privileges={['create', 'update']}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="flex-end"
            >
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{ py: 1, px: 5, borderRadius: 2 }}
              >
                {tCommon('actionCancel')}
              </Button>
              <Button
                variant="contained"
                onClick={handleUpsert}
                sx={{ py: 1, px: 5, borderRadius: 2 }}
              >
                {tCommon('actionSave')}
              </Button>
            </Stack>
          </AuthorizeView>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateMemberAddressModal;
