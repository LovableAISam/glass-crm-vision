import React from 'react';
import { Typography, TextField, Stack, IconButton } from '@mui/material';

import { useController, useFieldArray, useFormContext } from 'react-hook-form';
import { FAQContentData } from '../FAQContentManagement';
import FAQContentFormGroupCard from './FAQContentFormGroupCard';
import { Button, Token } from '@woi/web-component';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

type FAQContentFormGroupProps = {
  groupIndex: number;
  handleRemove: (groupIndex: number) => void;
}

function FAQContentFormGroup(props: FAQContentFormGroupProps) {
  const { groupIndex, handleRemove } = props;

  const { control, formState: { errors } } = useFormContext<FAQContentData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `faqContent.${groupIndex}.groups`
  });

  const { field: fieldGroupName } = useController({
    name: `faqContent.${groupIndex}.groupName`,
    control,
    rules: {
      required: 'Group name must be filled.',
    }
  });

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2" color={Token.color.greyscaleGreyDarker}>Group {groupIndex + 1}</Typography>
        {groupIndex > 0 && (
          <IconButton 
            color="default" 
            onClick={() => handleRemove(groupIndex)}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Stack>
      <Stack direction="column" spacing={2}>
        <Typography variant="subtitle2" gutterBottom>Group Name</Typography>
        <TextField
          {...fieldGroupName}
          fullWidth
          placeholder="type group name"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3
            }
          }}
          error={Boolean(errors.faqContent?.[groupIndex]?.groupName)}
          helperText={errors.faqContent?.[groupIndex]?.groupName?.message}
        />
      </Stack>
      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          sx={{ borderRadius: 2 }}
          onClick={() => {
            append({
              title: '',
              content: '',
            })
          }}
        >
          Add New Card
        </Button>
      </Stack>
      <Stack direction="column" spacing={2}>
        {fields.map((_, index) => (
          <FAQContentFormGroupCard 
            key={`${groupIndex}.${index}`}
            groupIndex={groupIndex}
            cardIndex={index}
            handleRemove={(cardIndex: number) => remove(cardIndex)}
          />
        ))}
      </Stack>
    </Stack>
  )
}

export default FAQContentFormGroup;