import React, { useMemo, useState } from 'react';
import { Card, FormHelperText, Stack, Typography, Box } from "@mui/material";
import { Button, Datatable, Token, useConfirmationDialog } from "@woi/web-component";
import { Column } from "react-table";

// Hooks
import useModal from '@woi/common/hooks/useModal';

// Types
import { CommunityOwnerBankAccount, CommunityOwnerData } from '@woi/communityOwner';

// Components
import PoolBankAccountModal from "./PoolBankAccountModal";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { CreateCOModalContentProps } from './CreateCOModalContent';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';
import TabAction from './TabAction';
import { useTranslation } from 'react-i18next';

function AccountInformation(props: CreateCOModalContentProps) {
  const { activeStep, handleComplete, handleCancel } = props;
  const [isActive, showModal, hideModal] = useModal();
  const [selectedData, setSelectedData] = useState<CommunityOwnerBankAccount | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touched, setTouched] = useState<boolean>(false);
  const { getConfirmation } = useConfirmationDialog();
  const { control, getValues } = useFormContext<CommunityOwnerData>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "bankAccounts",
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tCO } = useTranslation('co');

  const handleDelete = async (_: CommunityOwnerBankAccount) => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationDeleteTitle', { text: "Pool Bank Account" }),
      message: tCommon('confirmationDeleteDescription', { text: "pool bank account" }),
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

  const handleSubmit = (form: CommunityOwnerBankAccount) => {
    const bankAccounts = getValues('bankAccounts');
    const fundTypeMain = form.fundType?.label === 'MAIN';
    const hasBankAccountMain = bankAccounts.find(bankAccount => bankAccount.fundType?.label === 'MAIN');
    if (typeof selectedIndex === 'number') {
      bankAccounts.forEach((bankAccount, i) => {
        if (selectedIndex === i) {
          update(i, form);
        } else {
          let fundTypeForm = bankAccount.fundType;
          if (fundTypeMain && hasBankAccountMain && bankAccount.fundType?.label === 'MAIN') {
            fundTypeForm = { label: 'SECONDARY', value: 'Secondary Account' }
          }
          update(i, {
            ...bankAccount,
            fundType: fundTypeForm,
          });
        }
      })
    } else {
      bankAccounts.forEach((bankAccount, i) => {
        let fundTypeForm = bankAccount.fundType;
        if (fundTypeMain && hasBankAccountMain && bankAccount.fundType?.label === 'MAIN') {
          fundTypeForm = { label: 'SECONDARY', value: 'Secondary Account' }
        }
        update(i, {
          ...bankAccount,
          fundType: fundTypeForm,
        });
      })
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

  const columns: Array<Column<CommunityOwnerBankAccount & { action: string }>> = useMemo(
    () => [
      {
        Header: tCO('poolBankAccountFormBank'),
        accessor: 'bankId',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="bankId">
            {value?.label}
          </Typography>
        )
      },
      {
        Header: tCO('poolBankAccountFormAccountNumber'),
        accessor: 'number',
      },
      {
        Header: tCO('poolBankAccountFormAccountName'),
        accessor: 'name',
      },
      {
        Header: tCO('poolBankAccountFormBin'),
        accessor: 'bin',
      },
      {
        Header: tCO('poolBankAccountFormCurrency'),
        accessor: 'currencyId',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="currencyId">
            {value?.label}
          </Typography>
        )
      },
      {
        Header: tCO('poolBankAccountFormFundType'),
        accessor: 'fundType',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="fundType">
            {value?.label}
          </Typography>
        )
      },
      {
        Header: tCO('poolBankAccountFormVALength'),
        accessor: 'vaLength',
      },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="communityOwnerBankAccountAction">
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
        <Typography variant="subtitle3">{tCO('poolBankAccountTitle')}</Typography>
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
          {tCO('poolBankAccountAdd')}
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
            {tCO('poolBankAccountEmpty')}
          </FormHelperText>
        )}
        {isActive && (
          <PoolBankAccountModal
            selectedData={selectedData}
            lists={getValues('bankAccounts')}
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

export default AccountInformation;