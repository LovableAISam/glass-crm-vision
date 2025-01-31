// Core
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

// Component
import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

// Hooks & Utils
import { useTranslation } from 'react-i18next';
import CreateMerchantModalContent from './CreateMerchant/CreateMerchantModalContent';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';

// Types & Consts
import { MerchantDetail } from '@woi/service/co/merchant/merchantDetail';
import { MerchantDataList } from '@woi/service/co/merchant/merchantList';
import { OptionMap } from '@woi/option';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import { useMerchantFunctionListFetcher } from '@woi/service/co';

type CreateMerchantModalProps = {
  isActive: boolean;
  onHide: () => void;
  merchantDetail: MerchantDetail | null;
  selectEdit: MerchantDataList | null;
  fetchMerchantList: () => void;
  setSelectEdit: Dispatch<SetStateAction<MerchantDataList | null>>;
};

const CreateMerchantModal = (props: CreateMerchantModalProps) => {
  const {
    selectEdit,
    isActive,
    onHide,
    fetchMerchantList,
    setSelectEdit,
    merchantDetail,
  } = props;

  const isUpdate = Boolean(selectEdit);
  const { baseUrl } = useBaseUrl();
  const { t: tMerchant } = useTranslation('merchant');
  const { t: tForm } = useTranslation('form');

  const [merchantForOptions, setMerchantForOptions] = useState<
    OptionMap<string>[]
  >([]);
  const [merchantFor, setMerchantFor] = useState<{ label: string; value: string; }>({ label: '', value: '' });

  const fetchMerchantFunctionList = async () => {
    const { result, error } = await useMerchantFunctionListFetcher(baseUrl);

    if (result && !error) {
      const merchantForList = result.merchantfunctionList.map(data => ({
        label: data.function,
        value: data.id,
      }));
      setMerchantForOptions(merchantForList);

      if (isUpdate) {
        const selectMerchantFor = merchantForList.find((el) => el.label === merchantDetail?.merchantFuntionId && { label: el.label, value: el.value });
        if (selectMerchantFor) {
          setMerchantFor(selectMerchantFor);
        }
      } else {
        setMerchantFor(merchantForList[0]);
      }
    }
  };

  useEffect(() => {
    fetchMerchantFunctionList();
  }, [merchantDetail]);

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
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">
            {isUpdate
              ? tMerchant('modalUpdateTitle')
              : tMerchant('modalCreateTitle')}
          </Typography>
          <IconButton data-testid="buttonClose" onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers={true}>
        <Stack>
          <Typography variant="subtitle2" gutterBottom>
            {tMerchant('formMerchantFor')}
          </Typography>
          <Autocomplete
            value={merchantFor}
            onChange={(_, value) => {
              if (value) {
                setMerchantFor(value);
              }
            }}
            disabled={isUpdate}
            options={merchantForOptions}
            fullWidth
            renderInput={params => (
              <TextField
                {...params}
                placeholder={tForm('placeholderSelect', {
                  fieldName: 'merchant for',
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
            )}
          />
        </Stack>
        <CreateMerchantModalContent
          isActive={isActive}
          onHide={onHide}
          merchantDetail={merchantDetail}
          selectEdit={selectEdit}
          fetchMerchantList={fetchMerchantList}
          setSelectEdit={setSelectEdit}
          merchantFor={merchantFor}
          setMerchantFor={setMerchantFor}
          merchantForOptions={merchantForOptions}
          isUpdate={isUpdate}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateMerchantModal;
