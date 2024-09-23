import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  IconButton,
  Grid,
  TextField,
  Autocomplete,
} from '@mui/material';

// Components
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@woi/web-component';

// Types
import { CommunityOwnerAddress } from '@woi/communityOwner';
import { useController } from 'react-hook-form';
import useAddressUpsert from '../hooks/useAddressUpsert';
import { TextValidation } from '@woi/core';
import { useTranslation } from 'react-i18next';

type AddAddressModalProps = {
  isActive: boolean;
  selectedData: CommunityOwnerAddress | null;
  onHide: () => void;
  onSubmit: (form: CommunityOwnerAddress) => void;
  onDelete: (form: CommunityOwnerAddress) => void;
}

const AddAddressModal = (props: AddAddressModalProps) => {
  const {
    isActive,
    onHide,
    selectedData,
    onSubmit,
    onDelete,
  } = props;
  const {
    countryOptions,
    provinceOptions,
    cityOptions,
    formData,
    handleSave,
    fetchProvinceList,
    fetchCityList,
    handleCancel,
  } = useAddressUpsert({ selectedData, onHide, onSubmit });
  const { t: tCommon } = useTranslation('common');
  const { t: tCO } = useTranslation('co');
  const { t: tForm } = useTranslation('form');

  const { control, formState: { errors }, setValue } = formData;

  const { field: fieldCountryId } = useController({
    name: 'countryId',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Country' }),
    }
  });

  const { field: fieldProvinceId } = useController({
    name: 'provinceId',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Province' }),
    }
  });

  const { field: fieldCityId } = useController({
    name: 'cityId',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'City' }),
    }
  });

  const { field: fieldAddress } = useController({
    name: 'address',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Address' }),
    }
  });

  const { field: fieldPostalCode } = useController({
    name: 'postalCode',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Postal code' }),
      validate: value => {
        if (!TextValidation.minChar(value, 5)) return tForm('generalErrorMinChar', { number: 5 });
        else if (!TextValidation.maxChar(value, 5)) return tForm('generalErrorMaxChar', { number: 5 });
      }
    }
  });


  return (
    <Dialog
      open={isActive}
      onClose={onHide}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        }
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{tCO('addressActionAdd')}</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers={true}>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('addressFormCountry')}</Typography>
              <Autocomplete
                {...fieldCountryId}
                onChange={(_, value) => {
                  fieldCountryId.onChange(value)
                  if (value) {
                    fetchProvinceList(value.value)
                    setValue('provinceId', null);
                    setValue('cityId', null);
                  }
                }}
                options={countryOptions}
                fullWidth
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={tForm('placeholderSelect', { fieldName: 'country' })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3
                      }
                    }}
                    error={Boolean(errors.countryId)}
                    helperText={errors.countryId?.message}
                  />
                )}
              />
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('addressFormProvince')}</Typography>
              <Autocomplete
                {...fieldProvinceId}
                onChange={(_, value) => {
                  fieldProvinceId.onChange(value);
                  if (value) {
                    fetchCityList(value.value);
                    setValue('cityId', null);
                  }
                }}
                options={provinceOptions}
                fullWidth
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={tForm('placeholderSelect', { fieldName: 'province' })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3
                      }
                    }}
                    error={Boolean(errors.provinceId)}
                    helperText={errors.provinceId?.message}
                  />
                )}
              />
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('addressFormCity')}</Typography>
              <Autocomplete
                {...fieldCityId}
                onChange={(_, value) => fieldCityId.onChange(value)}
                options={cityOptions}
                fullWidth
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={tForm('placeholderSelect', { fieldName: 'city' })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3
                      }
                    }}
                    error={Boolean(errors.cityId)}
                    helperText={errors.cityId?.message}
                  />
                )}
              />
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('addressFormPostalCode')}</Typography>
              <TextField
                {...fieldPostalCode}
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                fullWidth
                placeholder={tForm('placeholderType', { fieldName: 'postal code' })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
                error={Boolean(errors.postalCode)}
                helperText={errors.postalCode?.message}
              />
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('addressFormAddress')}</Typography>
              <TextField
                {...fieldAddress}
                fullWidth
                placeholder={tForm('placeholderType', { fieldName: 'address' })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
                error={Boolean(errors.address)}
                helperText={errors.address?.message}
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: selectedData ? 'space-between' : 'flex-end', p: 2 }}>
        {selectedData && (
          <Button
            size="large"
            variant="text"
            onClick={() => onDelete(selectedData)}
            sx={{ py: 1, px: 5, borderRadius: 2 }}
          >{tCO('addressActionDelete')}</Button>
        )}
        <Stack direction="row" spacing={2} alignItems="center">
          <Button size="large" variant="outlined" onClick={handleCancel} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tCommon('actionCancel')}</Button>
          <Button size="large" variant="contained" onClick={handleSave} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tCommon('actionSave')}</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default AddAddressModal;