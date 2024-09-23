import React from 'react';
import { Card, Stack } from '@mui/material';
import { Button } from '@woi/web-component';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { FAQContentData } from '../FAQContentManagement';
import FAQContentFormGroup from './FAQContentFormGroup';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function FAQContentForm() {
  const { control } = useFormContext<FAQContentData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "faqContent"
  });

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          sx={{ borderRadius: 2 }}
          onClick={() => {
            append({
              groupName: '',
              groups: [],
            })
          }}
        >
          Add New Group
        </Button>
      </Stack>
      <Card sx={{ p: 3, borderRadius: 4 }}>
        {fields.map((_, index) => (
          <FAQContentFormGroup 
            key={index}
            groupIndex={index}
            handleRemove={(groupIndex: number) => remove(groupIndex)}
          />
        ))}
      </Card>
    </Stack>
  )
}

export default FAQContentForm;