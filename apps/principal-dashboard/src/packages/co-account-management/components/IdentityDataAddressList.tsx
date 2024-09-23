import React, { useMemo, useState } from 'react';
import { Stack, Typography, Button, Card, FormHelperText } from "@mui/material";

import { Datatable, Token, useConfirmationDialog } from '@woi/web-component';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useModal from '@woi/common/hooks/useModal';
import { Column } from 'react-table';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { CommunityOwnerAddress, CommunityOwnerData } from '@woi/communityOwner';
import AddAddressModal from './AddAddressModal';
import { useTranslation } from 'react-i18next';

type IdentityDataAddressListProps = {
  touched: boolean;
}

function IdentityDataAddressList(props: IdentityDataAddressListProps) {
  const { touched } = props;
  const [isActive, showModal, hideModal] = useModal();
  const [selectedData, setSelectedData] = useState<CommunityOwnerAddress | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { getConfirmation } = useConfirmationDialog();
  const { control } = useFormContext<CommunityOwnerData>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "addresses",
  });
  const { t: tCO } = useTranslation('co');
  const { t: tCommon } = useTranslation('common');

  const handleDelete = async (_: CommunityOwnerAddress) => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationDeleteTitle', { text: "Address" }),
      message: tCommon('confirmationDeleteDescription', { text: "address" }),
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

  const handleSubmit = (form: CommunityOwnerAddress) => {
    if (typeof selectedIndex === 'number') {
      update(selectedIndex, form);
    } else {
      append(form);
    }
    hideModal();
  }

  const columns: Array<Column<CommunityOwnerAddress & { action: string }>> = useMemo(
    () => [
      {
        Header: tCO('addressFormCountry'),
        accessor: 'countryId',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="countryId">{value?.label}</Typography>
        )
      },
      {
        Header: tCO('addressFormProvince'),
        accessor: 'provinceId',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="provinceId">{value?.label}</Typography>
        )
      },
      {
        Header: tCO('addressFormCity'),
        accessor: 'cityId',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="cityId">{value?.label}</Typography>
        )
      },
      {
        Header: tCO('addressFormPostalCode'),
        accessor: 'postalCode',
      },
      {
        Header: tCO('addressFormAddress'),
        accessor: 'address',
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="communityOwnerAddressAction">
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
      <Typography variant="subtitle2">{tCO('addressTitle')}</Typography>
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
        {tCO('addressActionAdd')}
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
          {tCO('addressEmpty')}
        </FormHelperText>
      )}
      {isActive && (
        <AddAddressModal
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

export default IdentityDataAddressList;