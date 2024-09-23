import React, { useMemo, useState } from 'react';
import { Card, FormHelperText, Stack, Typography, Box } from "@mui/material";
import { Button, Datatable, Token, useConfirmationDialog } from "@woi/web-component";
import { Column } from "react-table";

// Hooks
import useModal from '@woi/common/hooks/useModal';

// Types
import { CommunityOwnerUserPIC } from '@woi/communityOwner';

// Components
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LockIcon from '@mui/icons-material/Lock';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { CreateCOModalContentProps } from './CreateCOModalContent';
import AddPICModal from './AddPicModal';
import { DateConvert } from '@woi/core';
import { LONG_DATE_FORMAT } from '@woi/core/utils/date/constants';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';
import TabAction from './TabAction';
import { useTranslation } from 'react-i18next';

function PICData(props: CreateCOModalContentProps) {
  const { activeStep, handleComplete, handleCancel } = props;
  const [isActive, showModal, hideModal] = useModal();
  const [selectedData, setSelectedData] = useState<CommunityOwnerUserPIC | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touched, setTouched] = useState<boolean>(false);
  const { getConfirmation } = useConfirmationDialog();
  const { control } = useFormContext();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "usersPIC",
    keyName: "_id"
  });
  const { t: tCO } = useTranslation('co');
  const { t: tCommon } = useTranslation('common');

  const handleDelete = async (_: CommunityOwnerUserPIC) => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationDeleteTitle', { text: "PIC" }),
      message: tCommon('confirmationDeleteDescription', { text: "PIC" }),
      primaryText: tCommon('confirmationDeleteYes'),
      secondaryText: tCommon('confirmationDeleteNo')
    });

    if (confirmed) {
      if (typeof selectedIndex === 'number') {
        remove(selectedIndex)
      }
      hideModal();
    }
  }

  const handleSubmit = (form: CommunityOwnerUserPIC) => {
    if (typeof selectedIndex === 'number') {
      update(selectedIndex, form);
    } else {
      append(form);
    }
    hideModal();
  }

  const handleNext = () => {
    if (fields.length === 0) {
      setTouched(true);
      return;
    }
    handleComplete(activeStep + 1);
  }

  const validateForm = (callback: () => void) => {
    if (fields.length === 0) {
      setTouched(true);
      return;
    }
    handleComplete(activeStep + 1);
    callback();
  }

  const columns: Array<Column<CommunityOwnerUserPIC & { action: string }>> = useMemo(
    () => [
      {
        Header: tCO('picFormEmail'),
        accessor: 'username',
        Cell: ({ value, row }) => (
          <Stack direction="row" spacing={1} alignItems="center" key="username">
            <Typography variant="inherit" sx={{ color: row.original.isLocked ? Token.color.greyscaleGreyDarkest : Token.color.primaryBlack }}>{value}</Typography>
            {row.original.isLocked && (
              <LockIcon fontSize="small" sx={{ color: Token.color.greyscaleGreyDarkest }} />
            )}
          </Stack>
        )
      },
      {
        Header: tCO('picFormRole'),
        accessor: 'role',
        Cell: ({ value, row }) => (
          <Typography variant="inherit" key="role" sx={{ color: row.original.isLocked ? Token.color.greyscaleGreyDarkest : Token.color.primaryBlack }}>{value?.label}</Typography>
        )
      },
      {
        Header: tCO('picFormEffectiveDate'),
        accessor: 'activeDate',
        Cell: ({ row }) => (
          <Typography variant="inherit" key="activeDate" sx={{ color: row.original.isLocked ? Token.color.greyscaleGreyDarkest : Token.color.primaryBlack }}>{DateConvert.stringToDateFormat(row.original.activeDate, LONG_DATE_FORMAT)} - {DateConvert.stringToDateFormat(row.original.inactiveDate, LONG_DATE_FORMAT)}</Typography>
        )
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="communityOwnerUserPICAction">
            <Button variant="text" size="small" onClick={() => {
              setSelectedData(row.original);
              setSelectedIndex(row.index);
              showModal();
            }}>
              {tCommon('tableActionDetail')}
            </Button>
          </Stack>
        )
      },
    ],
    []
  );

  return (
    <Box>
      <TabAction {...props} validateForm={validateForm} />
      <Stack direction="column" spacing={2}>
        {/** @ts-ignore */}
        <Typography variant="subtitle3">{tCO('picTitle')}</Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddCircleIcon />}
          sx={{ alignSelf: 'flex-start', borderRadius: 2 }}
          onClick={() => {
            setSelectedData(null);
            setSelectedIndex(null);
            showModal();
          }}
        >
          {tCO('picActionAdd')}
        </Button>
        {fields.length > 0 && (
          <Card sx={{ p: 2, borderRadius: 4 }}>
            <Datatable
              columns={columns as Column<object>[]}
              data={fields}
            />
          </Card>
        )}
        {(touched && fields.length === 0) && (
          <FormHelperText sx={{ color: Token.color.redDark }}>
            {tCO('picEmpty')}
          </FormHelperText>
        )}
        {isActive && (
          <AddPICModal
            selectedData={selectedData}
            isActive={isActive}
            onHide={hideModal}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
          />
        )}
        <AuthorizeView access="co" privileges={['create', 'update']}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end" sx={{ pt: 2 }}>
            <Button size="large" variant="outlined" onClick={handleCancel} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tCommon('actionCancel')}</Button>
            <Button
              size="large"
              variant="contained"
              onClick={handleNext}
              sx={{ py: 1, px: 5, borderRadius: 2 }}
            >{tCommon('actionNext')}</Button>
          </Stack>
        </AuthorizeView>
      </Stack>
    </Box>
  )
}

export default PICData;