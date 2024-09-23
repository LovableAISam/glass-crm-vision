// Cores
import React from 'react';

// Components
import {
  Typography,
  Checkbox,
  AutocompleteRenderOptionState,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { OptionMap } from '@woi/option';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type OptionCheckboxProps = {
  props: React.HTMLAttributes<HTMLLIElement>;
  option: OptionMap<string>;
  state: AutocompleteRenderOptionState;
};

function OptionCheckbox(_props: OptionCheckboxProps) {
  const { props, option, state } = _props;

  return (
    <li {...props}>
      <Checkbox
        icon={icon}
        checkedIcon={checkedIcon}
        style={{ marginRight: 4 }}
        checked={state.selected}
      />
      <Typography variant="body2">{option.label}</Typography>
    </li>
  );
}

export const renderOptionCheckbox = (
  props: React.HTMLAttributes<HTMLLIElement>,
  option: OptionMap<string>,
  state: AutocompleteRenderOptionState,
) => {
  return <OptionCheckbox props={props} option={option} state={state} />;
};

export default OptionCheckbox;
