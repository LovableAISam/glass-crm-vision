import React, { useCallback, useEffect, useState } from 'react';
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
  FormControl,
  Box,
  Divider,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import {
  Button,
  FormEditor,
  ImagePreview,
  Token,
  useConfirmationDialog,
} from '@woi/web-component';
import { useFieldArray, useForm } from 'react-hook-form';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';
import {
  useContentCreateFetcher,
  useContentNameListFetcher,
  useContentUpdateFetcher,
} from '@woi/service/principal';
import useContentManagementUpsert, {
  ContentDetail,
  FormValues,
  OptionMap,
} from '../hooks/useContentManagementUpsert';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

type CreateContentManagementModalProps = {
  isActive: boolean;
  onHide: () => void;
  detailContent?: {
    currentPage: number;
    totalElements: number;
    totalPages: number;
    data: ContentDetail[];
  };
  isUpdate: boolean;
  selectId: string;
  fetchContentList: () => void;
};

const EditContentManagement = (props: CreateContentManagementModalProps) => {
  const {
    isActive,
    onHide,
    detailContent,
    isUpdate,
    selectId,
    fetchContentList,
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { baseUrl } = useContentManagementUpsert();
  const { getConfirmation } = useConfirmationDialog();
  const { t: tCO } = useTranslation('co');
  const { t: tCommon } = useTranslation('common');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCollapse, setIsCollapse] = useState<Boolean>(false);
  const [selectContentType, setSelectContentType] = useState<string>('');
  const [listContentName, setListContentName] = useState<OptionMap<string>[]>(
    [],
  );
  const [contentDelete, setContentDelete] = useState<
    {
      description: string;
      id: string;
      title: string;
    }[]
  >([]);

  const {
    reset,
    watch,
    control,
    setValue,
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      contentType: null,
      contentName: '',
      multipleContent: [{ title: '', id: '', description: '' }],
    },
  });
  const watchAllFields = watch();
  const { fields, append, remove } = useFieldArray({
    name: 'multipleContent',
    control,
  });

  const fetchContentNameList = useCallback(async () => {
    const { result } = await useContentNameListFetcher(baseUrl);
    if (result) {
      setListContentName(
        result.map(item => ({ ...item, label: item.type, value: item.id })),
      );
    }
  }, []);

  useEffect(() => {
    fetchContentNameList();
  }, []);

  useEffect(() => {
    if (detailContent !== undefined) {
      setSelectContentType(detailContent.data[0].contentName.type);
      setValue('contentType', detailContent.data[0].contentName.type);
      setValue('contentName', detailContent.data[0].contentName.name);
      if (detailContent.data[0].contentName.type === 'FAQ') {
        setIsCollapse(true);
        setValue(
          `multipleContent`,
          detailContent.data.map(item => ({
            title: item.subject.substring(3, item.subject.length - 4),
            id: item.id,
            description: item.content,
          })),
        );
      } else {
        setIsCollapse(false);
        setValue(
          `multipleContent.${0}.title`,
          detailContent.data[0].contentName.name,
        );
        setValue(
          `multipleContent.${0}.description`,
          detailContent.data[0].content,
        );
        setValue(`multipleContent.${0}.id`, detailContent.data[0].id);
      }
    }
  }, [detailContent]);

  const onSubmit = async (dataForm: FormValues) => {
    const { contentType, contentName, multipleContent } = dataForm;
    const selectContent = listContentName.find(
      item => item.label === contentType,
    );
    const confirmed = await getConfirmation({
      title: `${
        isUpdate
          ? tCommon('confirmationUpdateYes')
          : tCommon('confirmationCreateYes')
      } ${tCO('content')}?`,
      message: isUpdate
        ? tCommon('confirmationUpdateDescription', { text: tCO('content') })
        : tCommon('confirmationCreateDescription', { text: tCO('content') }),
      primaryText: `${
        isUpdate
          ? tCommon('confirmationUpdateYes')
          : tCommon('confirmationCreateYes')
      }`,
      secondaryText: tCommon('confirmationUpdateNo'),
    });
    const payloadCreate = {
      contentDetail: multipleContent.map(item => ({
        content: item.description,
        id: '',
        subject:
          item.title === ''
            ? contentName
            : contentType === 'FAQ'
            ? `<p>${item.title}</p>`
            : item.title,
      })),
      contentName: {
        createdBy: selectContent?.createdBy || '',
        createdDate: new Date().toJSON(),
        id: selectContent?.id || '',
        modifiedBy: selectContent?.modifiedBy || '',
        modifiedDate: new Date().toJSON(),
        name: contentName || '',
        secureId: selectContent?.secureId || '',
        type: selectContent?.type || '',
      },
    };
    const payloadUpdate = {
      contentDetail: multipleContent.map(item => ({
        content: item.description,
        id: item.id,
        subject: contentType === 'FAQ' ? `<p>${item.title}</p>` : contentName,
      })),
      contentName: contentName,
      contentWillBeDeleted: contentDelete.map(item => ({
        content: item.description,
        id: item.id,
        subject: item.title,
      })),
    };
    if (confirmed) {
      setIsLoading(true);
      const { error, errorData } = isUpdate
        ? await useContentUpdateFetcher(baseUrl, selectId, payloadUpdate)
        : await useContentCreateFetcher(baseUrl, payloadCreate);
      setIsLoading(false);
      if (!error) {
        enqueueSnackbar(
          `${
            isUpdate
              ? tCO('submitContentUpdateSuccess')
              : tCO('submitContentCreateSuccess')
          }`,
          { variant: 'success' },
        );
        reset();
        onHide();
        setContentDelete([]);
        fetchContentNameList();
        setIsCollapse(false);
        fetchContentList();
      } else {
        enqueueSnackbar(
          errorData?.details?.[0] || isUpdate
            ? tCO('submitContentUpdateFailed')
            : tCO('submitContentCreateFailed'),
          {
            variant: 'error',
          },
        );
      }
    }
  };

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: `Cancel ${isUpdate ? 'Update' : 'Create'} Content?`,
      message: tCommon('confirmationCancelDescription'),
      primaryText: tCommon('confirmationCancelYes'),
      secondaryText: tCommon('confirmationCancelNo'),
      btnPrimaryColor: 'inherit',
      btnSecondaryColor: 'error',
    });

    if (confirmed) {
      reset();
      setContentDelete([]);
      setSelectContentType('');
      onHide();
      setIsCollapse(false);
    }
  };

  const handleDelete = async (index: any) => {
    if (fields.length > 1) {
      const confirmed = await getConfirmation({
        title: `${tCommon('confirmationDeleteTitle', {
          text: tCO('content'),
        })}?`,
        message: tCommon('confirmationCancelDescription'),
        primaryText: tCommon('confirmationDeleteYes'),
        secondaryText: tCommon('confirmationCreateNo'),
        btnPrimaryColor: 'inherit',
        btnSecondaryColor: 'error',
      });

      if (confirmed) {
        setContentDelete(prev => [
          ...prev,
          watchAllFields.multipleContent[index],
        ]);
        remove(index);
      }
    }
  };

  return (
    <Dialog
      open={isActive}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        },
      }}
      maxWidth="lg"
      fullWidth
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <React.Fragment>
          <DialogTitle>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5">
                {isUpdate
                  ? tCommon('tableActionDetail')
                  : tCommon('confirmationCreateYes')}
              </Typography>
              <IconButton
                onClick={() => {
                  reset();
                  setContentDelete([]);
                  setSelectContentType('');
                  onHide();
                  setIsCollapse(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid
                item
                md={8}
                xs={12}
                maxHeight="700px"
                overflow="scroll"
                paddingRight="30px"
              >
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      {tCO('contentType')}
                    </Typography>
                    {isUpdate ? (
                      <TextField
                        disabled
                        fullWidth
                        value={selectContentType}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                          },
                        }}
                      />
                    ) : (
                      <Autocomplete
                        value={listContentName.find(
                          item => item.value === watchAllFields.contentType,
                        )}
                        {...register('contentType', {
                          required: tCO('contentTypeEmpty'),
                        })}
                        onChange={(_, value) => {
                          reset();
                          setValue('contentType', value?.label || null);
                          if (JSON.stringify(value?.value) === '4') {
                            setIsCollapse(true);
                          } else {
                            setIsCollapse(false);
                          }
                        }}
                        options={listContentName}
                        fullWidth
                        renderInput={params => (
                          <TextField
                            {...params}
                            placeholder={tCO('selectContentType')}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                              },
                            }}
                            error={Boolean(errors.contentType)}
                            helperText={errors.contentType?.message}
                          />
                        )}
                      />
                    )}
                  </Grid>

                  <Grid item md={12} xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      {tCO('contentName')}
                    </Typography>
                    <TextField
                      {...register('contentName', {
                        required: tCO('contentNameEmpty'),
                      })}
                      error={Boolean(errors.contentName)}
                      helperText={errors.contentName?.message}
                      fullWidth
                      placeholder={
                        watchAllFields.contentType === null
                          ? tCO('selectContentType')
                          : tCO('typeContentName')
                      }
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Grid>

                  {isCollapse ? (
                    fields.map((field, index) => {
                      return (
                        <Stack ml={2} mt={2} key={index}>
                          <Typography variant="subtitle2" gutterBottom>
                            {tCO('contentField')} {index + 1}
                          </Typography>
                          <Card
                            variant="outlined"
                            sx={{ p: 3, borderRadius: 3 }}
                          >
                            <Grid container spacing={2}>
                              <Grid item md={12} xs={12}>
                                <Typography variant="subtitle2" gutterBottom>
                                  {tCO('title')}
                                </Typography>
                                <FormControl
                                  component="fieldset"
                                  variant="standard"
                                  sx={{ width: '100%', maxHeight: 470 }}
                                >
                                  <IconButton
                                    onClick={() => handleDelete(index)}
                                    color="error"
                                    aria-label="delete"
                                    component="label"
                                    sx={{
                                      position: 'absolute',
                                      padding: '5px',
                                      right: '0px',
                                      top: '-40px',
                                    }}
                                  >
                                    <DeleteIcon sx={{ p: 0, m: 0 }} />
                                  </IconButton>
                                  <TextField
                                    {...register(
                                      `multipleContent.${index}.title`,
                                      isCollapse && {
                                        required: 'Title must be filled.',
                                      },
                                    )}
                                    className={
                                      errors?.multipleContent?.[index]?.title
                                        ? 'error'
                                        : ''
                                    }
                                    error={Boolean(
                                      errors.multipleContent?.[index]?.title,
                                    )}
                                    helperText={
                                      errors.multipleContent?.[index]?.title
                                        ?.message
                                    }
                                    defaultValue={field.title}
                                    fullWidth
                                    placeholder={tCO('typeTitle')}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                      },
                                    }}
                                  />
                                </FormControl>
                              </Grid>

                              <Grid item md={12} xs={12}>
                                <Typography variant="subtitle2" gutterBottom>
                                  {tCO('description')}
                                </Typography>
                                <FormControl
                                  component="fieldset"
                                  variant="standard"
                                  sx={{ width: '100%', maxHeight: 470 }}
                                >
                                  <FormEditor
                                    {...register(
                                      `multipleContent.${index}.description`,
                                      {
                                        required: tCO('descriptionEmpty'),
                                      },
                                    )}
                                    value={
                                      getValues('multipleContent')[index]
                                        .description
                                    }
                                    onChange={value =>
                                      setValue(
                                        `multipleContent.${index}.description`,
                                        value,
                                      )
                                    }
                                    editorStyle={{
                                      overflow: 'scroll',
                                      maxHeight: 400,
                                    }}
                                  />
                                  {Boolean(
                                    errors.multipleContent?.[index]
                                      ?.description,
                                  ) && (
                                    <FormHelperText
                                      sx={{
                                        color: Token.color.redDark,
                                      }}
                                    >
                                      {
                                        errors.multipleContent?.[index]
                                          ?.description?.message
                                      }
                                    </FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Card>
                        </Stack>
                      );
                    })
                  ) : (
                    <Grid item md={12} xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        {tCO('description')}
                      </Typography>
                      <FormControl
                        component="fieldset"
                        variant="standard"
                        sx={{ width: '100%', maxHeight: 470 }}
                      >
                        <FormEditor
                          value={getValues('multipleContent')[0].description}
                          editorStyle={{ overflow: 'scroll', maxHeight: 400 }}
                          {...register(`multipleContent.${0}.description`, {
                            required: tCO('descriptionEmpty'),
                          })}
                          onChange={value =>
                            setValue(`multipleContent.${0}.description`, value)
                          }
                        />
                        {Boolean(errors.multipleContent?.[0]?.description) && (
                          <FormHelperText
                            sx={{
                              color: Token.color.redDark,
                            }}
                          >
                            {errors.multipleContent?.[0]?.description?.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  )}

                  {isCollapse && (
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ mt: 2, width: '100%' }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleIcon />}
                        sx={{ borderRadius: 2 }}
                        onClick={() =>
                          append({
                            title: '',
                            id: '',
                            description: '',
                          })
                        }
                      >
                        {tCO('addField')}
                      </Button>
                    </Stack>
                  )}
                </Grid>
              </Grid>

              <Grid item md={4} xs={12}>
                <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                  <Stack direction="column" spacing={2} alignItems="center">
                    <ImagePreview
                      type={isCollapse ? 'CONTENT_COLLAPSE' : 'CONTENT'}
                      selectedFile={null}
                      selectedImage={null}
                      background="#aabbcc"
                      displayText={null}
                      contentSubject={
                        watchAllFields.contentName || tCO('typeContentName')
                      }
                      contentDesc={
                        watchAllFields.multipleContent[0].description ||
                        `<p>${tCO('typeContentDescription')}</p>`
                      }
                      height={640}
                      width={336}
                      multipleContent={watchAllFields.multipleContent}
                    />
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent={'space-between'}
              sx={{ p: 2, flex: 1 }}
            >
              <Stack direction="row" spacing={2}>
                <Box>
                  <Divider orientation="vertical" />
                </Box>
              </Stack>
              <AuthorizeView access="content" privileges={['create', 'update']}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="flex-end"
                  sx={{ flex: 1 }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={isLoading}
                    sx={{ py: 1, px: 5, borderRadius: 2 }}
                  >
                    {tCommon('confirmationCancelYes')}
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    sx={{ py: 1, px: 5, borderRadius: 2 }}
                  >
                    {isLoading ? (
                      <CircularProgress
                        style={{ width: '25px', height: '25px' }}
                      />
                    ) : isUpdate ? (
                      tCommon('confirmationUpdateYes')
                    ) : (
                      tCommon('confirmationCreateYes')
                    )}
                  </Button>
                </Stack>
              </AuthorizeView>
            </Stack>
          </DialogActions>
        </React.Fragment>
      </form>
    </Dialog>
  );
};

export default EditContentManagement;
