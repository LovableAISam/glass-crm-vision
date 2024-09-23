import React, { useMemo } from 'react';
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
  InputAdornment,
  Card,
  FormControlLabel,
  Checkbox,
  Radio,
  List,
  ListItem,
  Divider,
  FormHelperText,
} from '@mui/material';
import { Button, Datatable, Scroll, Token } from '@woi/web-component';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { CellProps, Column } from 'react-table';
import useRoleUpsert, { RoleDataPrivilege } from '../hooks/useRoleUpsert';
import { RoleData } from '@woi/service/principal/idp/role/roleList';
import { useController } from 'react-hook-form';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';
import { useTranslation } from 'react-i18next';

type CreateRoleModalProps = {
  selectedData: RoleData | null;
  isActive: boolean;
  onHide: () => void;
  fetchRoleList: () => void;
}

const CreateRoleModal = (props: CreateRoleModalProps) => {
  const {
    selectedData,
    isActive,
    onHide,
    fetchRoleList,
  } = props;
  const {
    userList,
    menuPrivileges,
    menuList,
    searchMenu,
    setSearchMenu,
    searchUser,
    setSearchUser,
    formData,
    touched,
    handleDelete,
    handleUpsert,
    handleCancel,
    handleActivateDeactivate,
  } = useRoleUpsert({ selectedData, onHide, fetchRoleList })
  const { t: tCommon } = useTranslation('common');
  const { t: tRole } = useTranslation('role');
  const { t: tForm } = useTranslation('form');

  const { formState: { errors }, control, getValues, setValue } = formData;

  const isUpdate = Boolean(selectedData);

  const { field: fieldName } = useController({
    name: 'name',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Name' }),
    }
  });

  const { field: fieldDescription } = useController({
    name: 'description',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Description' }),
    }
  });

  const columns: Array<Column<RoleDataPrivilege>> = useMemo(
    () => [
      {
        Header: tRole('tableHeaderMenu'),
        accessor: 'menuId',
        colspan: 2,
        Cell: ({ row }) => {
          return (
            <Stack direction="column" key="roleMenuId">
              <FormControlLabel
                checked={row.original.checked}
                onChange={(_, checked) => setValue('menuPrivileges', getValues('menuPrivileges').map((data, i) => {
                  if (i === row.index) {
                    data.checked = checked;
                    if (!checked) {
                      data.privilegeType = '';
                    }
                  }
                  return data;
                }))}
                control={
                  <Checkbox name="menu" />
                }
                label={<Typography variant="body2">{row.original.menuName}</Typography>}
              />
              {(touched && row.original.checked && !row.original.privilegeType) && (
                <FormHelperText sx={{ color: Token.color.redDark }}>
                  {tRole('errorEmptySelected')}
                </FormHelperText>
              )}
            </Stack>
          )
        }
      },
      {
        Header: tRole('tableHeaderPrivilege'),
        style: { textAlign: 'center' },
        columns: [
          {
            Header: tRole('tableHeaderViewOnly'),
            style: { textAlign: 'center' },
            Cell: ({ row }: CellProps<RoleDataPrivilege>) => {
              return (
                <Radio
                  name="view"
                  checked={row.original.privilegeType === 'VIEW_ONLY'}
                  onChange={() => setValue('menuPrivileges', getValues('menuPrivileges').map((data, i) => {
                    if (i === row.index) {
                      data.privilegeType = 'VIEW_ONLY';
                    }
                    return data;
                  }))}
                  disabled={!row.original.checked}
                />
              )
            }
          },
          {
            Header: tRole('tableHeaderAddAndEdit'),
            style: { textAlign: 'center' },
            Cell: ({ row }: CellProps<RoleDataPrivilege>) => {
              return (
                <Radio
                  name="view"
                  checked={row.original.privilegeType === 'ADD_EDIT'}
                  onChange={() => setValue('menuPrivileges', getValues('menuPrivileges').map((data, i) => {
                    if (i === row.index) {
                      data.privilegeType = 'ADD_EDIT';
                    }
                    return data;
                  }))}
                  disabled={!row.original.checked}
                />
              )
            }
          },
          {
            Header: tRole('tableHeaderAddEditAndDelete'),
            style: { textAlign: 'center' },
            Cell: ({ row }: CellProps<RoleDataPrivilege>) => {
              return (
                <Radio
                  name="view"
                  checked={row.original.privilegeType === 'ADD_EDIT_DELETE'}
                  onChange={() => setValue('menuPrivileges', getValues('menuPrivileges').map((data, i) => {
                    if (i === row.index) {
                      data.privilegeType = 'ADD_EDIT_DELETE';
                    }
                    return data;
                  }))}
                  disabled={!row.original.checked}
                />
              )
            }
          }
        ]
      },

    ],
    [menuList, touched]
  );

  return (
    <Dialog
      open={isActive}
      onClose={onHide}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        }
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{isUpdate ? tRole('modalUpdateTitle') : tRole('modalCreateTitle')}</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {isUpdate && (
          <AuthorizeView access="role" privileges={['delete']}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="body2" color={Token.color.greyscaleGreyDarkest}>{tRole('actionDeleteDescription')}</Typography>
              <Button variant="outlined" sx={{ borderRadius: 2 }} onClick={handleDelete} disabled={userList.length > 0}>{tRole('actionDelete')}</Button>
            </Stack>
          </AuthorizeView>
        )}
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tRole('formRoleName')}</Typography>
            <TextField
              {...fieldName}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'role name' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tRole('formRoleDescription')}</Typography>
            <TextField
              {...fieldDescription}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'role description' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
              error={Boolean(errors.description)}
              helperText={errors.description?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle1" gutterBottom>{tRole('formAssignPrivilege')}</Typography>
            <TextField
              value={searchMenu}
              onChange={e => setSearchMenu(e.target.value)}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'menu' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item md={12} xs={12} sx={{ py: 2 }}>
            <Card sx={{ p: 2, borderRadius: 4 }}>
              <Scroll horizontal={false}>
                <Datatable
                  columns={columns as Column<object>[]}
                  data={menuPrivileges}
                  coloredHeader
                  sortable={false}
                />
              </Scroll>
              {(touched && !getValues('menuPrivileges').some(menuPrivilege => menuPrivilege.checked && menuPrivilege.privilegeType)) && (
                <FormHelperText sx={{ color: Token.color.redDark }}>
                  {tRole('errorEmptyPrivilege')}
                </FormHelperText>
              )}
            </Card>
          </Grid>
          {isUpdate && (
            <React.Fragment>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle1" gutterBottom>{tRole('listOfUser', { number: userList.length })}</Typography>
                <TextField
                  value={searchUser}
                  onChange={e => setSearchUser(e.target.value)}
                  fullWidth
                  placeholder={tForm('placeholderType', { fieldName: 'user' })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item md={12} xs={12} sx={{ py: 2 }}>
                <Card sx={{ p: 2, borderRadius: 4 }}>
                  <Scroll horizontal={false}>
                    <List
                      sx={theme => ({
                        width: '100%',
                        bgcolor: 'background.paper',
                        '& .MuiListItemButton-root:hover': {
                          background: theme.palette.secondary.main,
                        }
                      })}
                    >
                      {userList.length === 0 && (
                        <Typography
                          variant="body2"
                          color={Token.color.greyscaleGreyDarkest}
                          sx={{ textAlign: 'center' }}
                        >
                          {tRole('errorEmptyUser')}
                        </Typography>
                      )}
                      {userList.map(user => (
                        <React.Fragment>
                          <ListItem sx={{ py: 2 }}>
                            <Stack direction="row" spacing={2}>
                              {/** @ts-ignore */}
                              <Typography variant="body3">{user}</Typography>
                            </Stack>
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))}

                    </List>
                  </Scroll>
                </Card>
              </Grid>
            </React.Fragment>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" alignItems="center" justifyContent={isUpdate ? 'space-between' : 'flex-end'} sx={{ p: 2, flex: 1 }}>
          {isUpdate && (
            <Button
              variant="text"
              startIcon={getValues('isActive') ? <ToggleOffIcon /> : <ToggleOnIcon />}
              color={getValues('isActive') ? "warning" : "success"}
              onClick={handleActivateDeactivate}
              sx={{ py: 1, borderRadius: 2 }}
            >
              {getValues('isActive') ? tRole('actionDectivate') : tRole('actionActivate')}
            </Button>
          )}
          <AuthorizeView access="role" privileges={['create', 'update']}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end" sx={{ flex: 1 }}>
              <Button variant="outlined" onClick={handleCancel} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tCommon('actionCancel')}</Button>
              <Button variant="contained" onClick={handleUpsert} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tCommon('actionSave')}</Button>
            </Stack>
          </AuthorizeView>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default CreateRoleModal;