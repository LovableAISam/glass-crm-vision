import React from 'react';
import { Typography, Stack, Card, Grid, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Token, Markdown } from '@woi/web-component';

import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import FAQContentForm from './components/FAQContentForm';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type FAQContentGroup = {
  title: string;
  content: string;
}

type FAQContent = {
  groupName: string;
  groups: FAQContentGroup[];
}

export type FAQContentData = {
  faqContent: FAQContent[];
}

const FAQContentManagementContent = () => {
  const { watch } = useFormContext<FAQContentData>();

  const faqContentList = watch('faqContent');

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">FAQ Content Management</Typography>
        </Stack>
        <Grid container sx={{ pt: 1 }}>
          <Grid item md={6} xs={12}>
            <FAQContentForm />
          </Grid>
          <Grid item md={6} xs={12}>
            <Card elevation={0} sx={{ background: Token.color.dashboardLightest, p: 3, borderRadius: 4, height: '100%' }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Preview</Typography>
              <Card sx={{ p: 3, borderRadius: 4 }}>
                <Stack direction="column" spacing={2}>
                  {faqContentList.map((faqContent, groupIndex) => (
                    <Card sx={{ p: 3, borderRadius: 4 }} key={groupIndex}>
                      <Stack direction="column" spacing={2}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>{faqContent.groupName || 'Enter FAQ Group.'}</Typography>
                        {faqContent.groups.map((groupData, cardIndex) => (
                          <Accordion key={cardIndex} expanded disableGutters>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                            >
                              <Typography>{groupData.title || 'Enter FAQ Title.'}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              {groupData.content ? (
                                <Markdown
                                  typographyProps={{
                                    variant: 'body2',
                                  }}
                                >
                                  {groupData.content}
                                </Markdown>
                              ) : (
                                <Typography variant="body2">Enter FAQ Content.</Typography>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              </Card>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  )
}

function FAQContentManagement() {
  const formData = useForm<FAQContentData>({
    defaultValues: {
      faqContent: [
        {
          groupName: '',
          groups: [
            {
              title: '',
              content: ''
            }
          ]
        }
      ],
    }
  });

  return (
    <FormProvider {...formData}>
      <FAQContentManagementContent />
    </FormProvider>
  );
}

export default FAQContentManagement;