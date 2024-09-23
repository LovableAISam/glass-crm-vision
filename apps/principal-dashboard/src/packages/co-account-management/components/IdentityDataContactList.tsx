import React, { useMemo, useState } from 'react';
import { Stack, Typography, Button, Card, FormHelperText } from "@mui/material";

import { Datatable, Token, useConfirmationDialog } from '@woi/web-component';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useModal from '@woi/common/hooks/useModal';
import { Column } from 'react-table';
import AddContactModal from './AddContactModal';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { CommunityOwnerContact, CommunityOwnerData } from '@woi/communityOwner';
import { useTranslation } from 'react-i18next';

type IdentityDataContactListProps = {
  touched: boolean;
}

function IdentityDataContactList(props: IdentityDataContactListProps) {
  const { touched } = props;
  const [isActive, showModal, hideModal] = useModal();
  const [selectedData, setSelectedData] = useState<CommunityOwnerContact | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { getConfirmation } = useConfirmationDialog();
  const { control } = useFormContext<CommunityOwnerData>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "contacts",
  });
  const { t: tCO } = useTranslation('co');
  const { t: tCommon } = useTranslation('common');

  const handleDelete = async (_: CommunityOwnerContact) => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationDeleteTitle', { text: "Contact" }),
      message: tCommon('confirmationDeleteDescription', { text: "contact" }),
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

  const handleSubmit = (form: CommunityOwnerContact) => {
    if (typeof selectedIndex === 'number') {
      update(selectedIndex, form);
    } else {
      append(form);
    }
    hideModal();
  }

  const columns: Array<Column<CommunityOwnerContact & { action: string }>> = useMemo(
    () => [
      {
        Header: tCO('contactFormContactType'),
        accessor: 'type',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="type">{value?.label}</Typography>
        )
      },
      {
        Header: tCO('contactFormContactNumber'),
        accessor: 'number',
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="communityOwnerContactAction">
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
      <Typography variant="subtitle2">{tCO('contactTitle')}</Typography>
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
        {tCO('contactActionAdd')}
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
          {tCO('contactEmpty')}
        </FormHelperText>
      )}
      {isActive && (
        <AddContactModal
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

export default IdentityDataContactList;