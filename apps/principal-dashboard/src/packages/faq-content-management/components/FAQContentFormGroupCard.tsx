import React from 'react';
import { Typography, Card, TextField, FormControl, useTheme, FormHelperText, Stack, IconButton } from '@mui/material';
import { Token, FormEditor } from '@woi/web-component';

import { useController, useFormContext } from 'react-hook-form';
import { FAQContentData } from '../FAQContentManagement';
import DeleteIcon from '@mui/icons-material/Delete';

type FAQContentFormGroupCardProps = {
  groupIndex: number;
  cardIndex: number;
  handleRemove: (groupIndex: number) => void;
}

function FAQContentFormGroupCard(props: FAQContentFormGroupCardProps) {
  const { groupIndex, cardIndex, handleRemove } = props;
  const theme = useTheme();

  const { control, formState: { errors } } = useFormContext<FAQContentData>();

  const { field: fieldTitle } = useController({
    name: `faqContent.${groupIndex}.groups.${cardIndex}.title`,
    control,
    rules: {
      required: 'Title must be filled.',
    }
  });

  const { field: fieldContent } = useController({
    name: `faqContent.${groupIndex}.groups.${cardIndex}.content`,
    control,
    rules: {
      required: 'Content must be filled.',
    }
  });

  return (
    <Card sx={{ p: 3, borderRadius: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color={Token.color.greyscaleGreyDarker}>Card {groupIndex + 1}.{cardIndex + 1}</Typography>
        {cardIndex > 0 && (
          <IconButton 
            color="default" 
            onClick={() => handleRemove(cardIndex)}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Stack>
      <Stack direction="column" spacing={2}>
        <Stack direction="column" spacing={1}>
          <Typography variant="subtitle2" gutterBottom>Title</Typography>
          <TextField
            {...fieldTitle}
            fullWidth
            placeholder="type title"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3
              }
            }}
            error={Boolean(errors.faqContent?.[groupIndex]?.groups?.[cardIndex]?.title)}
            helperText={errors.faqContent?.[groupIndex]?.groups?.[cardIndex]?.title?.message}
          />
        </Stack>
        <Stack direction="column" spacing={1}>
          <Typography variant="subtitle2" gutterBottom>FAQ card Content</Typography>
          <Card elevation={0} sx={{ p: 1, pr: 2, borderRadius: 3, mb: 1, backgroundColor: theme.palette.secondary.main }}>
            <Typography variant="body2">
              <ul>
                <li>FAQ card content has format to cater dynamic content</li>
                <li>Please use double bracket "<b>&#123;&#123; variableName &#125;&#125;</b>" to defined variable name that will used for dynamic content</li>
              </ul>
            </Typography>
          </Card>
          <FormControl
            component="fieldset"
            variant="standard"
            sx={{ width: '100%' }}
          >
            <FormEditor
              {...fieldContent}
              onChange={(value) => fieldContent.onChange(value)}
            />
            {Boolean(errors.faqContent?.[groupIndex]?.groups?.[cardIndex]?.content) && (
              <FormHelperText sx={{ color: Token.color.redDark }}>
                {errors.faqContent?.[groupIndex]?.groups?.[cardIndex]?.content?.message}
              </FormHelperText>
            )}
          </FormControl>
        </Stack>
      </Stack>
    </Card>
  )
}

export default FAQContentFormGroupCard;