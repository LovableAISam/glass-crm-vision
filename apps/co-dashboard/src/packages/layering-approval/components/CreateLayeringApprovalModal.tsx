import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  IconButton,
  TextField,
  Grid,
  Autocomplete,
  Card,
  FormHelperText,
} from '@mui/material';
import { Button, Token } from '@woi/web-component';

// Hooks & Utils
import useLayeringApprovalUpsert, {
  ApprovalLayerForm,
} from '../hooks/useLayeringApprovalUpsert';
import {
  FieldArrayWithId,
  useController,
  useFieldArray,
  UseFieldArrayReturn,
  UseFormReturn,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { ApprovalLayerData } from '@woi/service/co/admin/approvalLayer/approvalLayerList';
import { OptionMap } from '@woi/option';

// Icons
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

export type CreateLayeringApprovalModalProps = {
  selectedData: ApprovalLayerData | null;
  isActive: boolean;
  onHide: () => void;
  fetchApprovalLayerList: () => void;
};

const CreateLayeringApprovalModal = (
  props: CreateLayeringApprovalModalProps,
) => {
  const { isActive, selectedData, onHide, fetchApprovalLayerList } = props;

  const {
    menuOptions,
    roleOptions,
    formData,
    touched,
    handleUpsert,
    handleDelete,
    handleCancel,
  } = useLayeringApprovalUpsert({
    selectedData,
    onHide,
    fetchApprovalLayerList,
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tLayeringApproval } = useTranslation('layeringApproval');
  const { t: tForm } = useTranslation('form');

  const isUpdate = Boolean(selectedData);

  const {
    formState: { errors },
    control,
    getValues,
  } = formData;

  const arrayForm = useFieldArray({
    control,
    name: 'roles',
  });

  const { fields, append } = arrayForm;

  const { field: fieldMenu } = useController({
    name: 'menu',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Menu' }),
    },
  });

  return (
    <Dialog
      open={isActive}
      onClose={onHide}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        },
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">
            {isUpdate
              ? tLayeringApproval('modalUpdateTitle')
              : tLayeringApproval('modalCreateTitle')}
          </Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tLayeringApproval('formMenu')}
            </Typography>
            <Autocomplete
              {...fieldMenu}
              onChange={(_, value) => fieldMenu.onChange(value)}
              options={menuOptions}
              fullWidth
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', {
                    fieldName: 'menu',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.menu)}
                  helperText={errors.menu?.message}
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2">
              {tLayeringApproval('textSetLayerRole')}
            </Typography>
          </Grid>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={2}>
              {fields.length < 3 && (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddCircleIcon />}
                  sx={{ alignSelf: 'flex-start', borderRadius: 2 }}
                  onClick={() => append({ role: null })}
                >
                  {tLayeringApproval('actionAddLayer')}
                </Button>
              )}
              {fields.map((field, index) => (
                <CreateLayeringApprovalContent
                  key={field.id}
                  index={index}
                  field={field}
                  roleOptions={roleOptions}
                  formData={formData}
                  arrayForm={arrayForm}
                />
              ))}
              {touched && getValues('roles').length === 0 && (
                <FormHelperText sx={{ color: Token.color.redDark }}>
                  {tLayeringApproval('layerEmpty')}
                </FormHelperText>
              )}
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={isUpdate ? 'space-between' : 'flex-end'}
          sx={{ p: 2, flex: 1 }}
        >
          {isUpdate && (
            <Button
              variant="text"
              onClick={handleDelete}
              sx={{ py: 1, borderRadius: 2 }}
            >
              {tLayeringApproval('actionDelete')}
            </Button>
          )}
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
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

type CreateLayeringApprovalContentProps = {
  index: number;
  field: FieldArrayWithId<ApprovalLayerForm, 'roles', 'id'>;
  roleOptions: OptionMap<string>[];
  formData: UseFormReturn<ApprovalLayerForm, any>;
  arrayForm: UseFieldArrayReturn<ApprovalLayerForm, 'roles', 'id'>;
};

function CreateLayeringApprovalContent(
  props: CreateLayeringApprovalContentProps,
) {
  const { index, field, roleOptions, formData, arrayForm } = props;
  const { remove } = arrayForm;
  const {
    formState: { errors },
    control,
  } = formData;
  const { t: tLayeringApproval } = useTranslation('layeringApproval');
  const { t: tForm } = useTranslation('form');

  const { field: fieldRole } = useController({
    name: `roles.${index}.role`,
    control,
    rules: {
      required: 'Menu must be filled.',
    },
  });

  return (
    <Card sx={{ p: 2, borderRadius: 4 }} key={field.id}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Stack sx={{ flex: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            {tLayeringApproval('formRoleOfLayer', { number: index + 1 })}
          </Typography>
          <Autocomplete
            {...fieldRole}
            onChange={(_, value) => fieldRole.onChange(value)}
            options={roleOptions}
            fullWidth
            renderInput={params => (
              <TextField
                {...params}
                placeholder={tForm('placeholderSelect', {
                  fieldName: 'role of layer',
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
                error={Boolean(errors.roles?.[index]?.role)}
                helperText={errors.roles?.[index]?.role?.message}
              />
            )}
          />
        </Stack>
        <IconButton
          data-testid="ButtonRemove"
          color="default"
          onClick={() => remove(index)}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Card>
  );
}

export default CreateLayeringApprovalModal;
