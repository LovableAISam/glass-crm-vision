import React, { useMemo, useState } from 'react';
import { Stack, Typography, Button, Card, FormHelperText } from "@mui/material";

import { Datatable, Token, useConfirmationDialog } from '@woi/web-component';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useModal from '@woi/common/hooks/useModal';
import AddUserCredentialModal from './AddUserCredentialModal';
import { Column } from 'react-table';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { CommunityOwnerData, CommunityOwnerUserOTP } from '@woi/communityOwner';
import { useTranslation } from 'react-i18next';

type IdentityDataUserCredentialListProps = {
  touched: boolean;
}

function IdentityDataUserCredentialList(props: IdentityDataUserCredentialListProps) {
  const { touched } = props;
  const [isActive, showModal, hideModal] = useModal();
  const [selectedData, setSelectedData] = useState<CommunityOwnerUserOTP | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { getConfirmation } = useConfirmationDialog();
  const { control } = useFormContext<CommunityOwnerData>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "usersOTP",
  });
  const { t: tCO } = useTranslation('co');
  const { t: tCommon } = useTranslation('common');

  const handleDelete = async (_: CommunityOwnerUserOTP) => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationDeleteTitle', { text: "User Credentials OTP" }),
      message: tCommon('confirmationDeleteDescription', { text: "user credentials OTP" }),
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

  const handleSubmit = (form: CommunityOwnerUserOTP) => {
    if (typeof selectedIndex === 'number') {
      update(selectedIndex, form);
    } else {
      append(form);
    }
    hideModal();
  }

  const columns: Array<Column<CommunityOwnerUserOTP & { action: string }>> = useMemo(
    () => [
      {
        Header: tCO('userCredentialFormUser'),
        accessor: 'username',
      },
      {
        Header: tCO('userCredentialFormSender'),
        accessor: 'sender',
      },
      {
        Header: tCO('userCredentialFormDivision'),
        accessor: 'division',
      },
      {
        Header: tCO('userCredentialFormChannel'),
        accessor: 'channel',
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="communityOwnerUserOTPAction">
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
    <Stack direction="column" spacing={1}>
      <Typography variant="subtitle2">{tCO('userCredentialTitle')}</Typography>
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
        {tCO('userCredentialActionAdd')}
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
          {tCO('userCredentialEmpty')}
        </FormHelperText>
      )}
      {isActive && (
        <AddUserCredentialModal
          selectedData={selectedData}
          isActive={isActive}
          onHide={hideModal}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      )}
    </Stack>
  )
}

export default IdentityDataUserCredentialList;