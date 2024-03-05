import { Icon } from '@iconify/react';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { addQuery } from '../../helpers';
import { setStatusFilter } from '../../redux/filterSlice';
import { useTypedSelector } from '../../redux/reducers/reducers';

export interface PureStatusesAutocompleteProps {
  statusNames: string[];
  onChange: (event: React.ChangeEvent<{}>, newValue: string[]) => void;
  filter: { statuses: Set<string>; search: string };
}

export function PureStatusesAutocomplete({
  statusNames,
  onChange: onChangeFromProps,
  filter,
}: PureStatusesAutocompleteProps) {
  const theme = useTheme();
  const { t } = useTranslation(['glossary', 'translation']);
  const [statusInput, setStatusInput] = React.useState<string>('');
  const maxStatusesChars = 12;

  const onInputChange = (event: object, value: string, reason: string) => {
    // For some reason, the AutoComplete component resets the text after a short
    // delay, so we need to avoid that or the user won't be able to edit/use what they type.
    if (reason !== 'reset') {
      setStatusInput(value);
    }
  };

  const onChange = (event: React.ChangeEvent<{}>, newValue: string[]) => {
    // Now we reset the input so it won't show next to the selected namespaces.
    setStatusInput('');
    onChangeFromProps(event, newValue);
  };

  return (
    <Autocomplete
      multiple
      id="statuses-filter"
      autoComplete
      options={statusNames}
      onChange={onChange}
      onInputChange={onInputChange}
      inputValue={statusInput}
      // We reverse the namespaces so the last chosen appear as the first in the label. This
      // is useful since the label is ellipsized and this we get to see it change.
      value={[...filter.statuses.values()].reverse()}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={<Icon icon="mdi:checkbox-blank-outline" />}
            checkedIcon={<Icon icon="mdi:check-box-outline" />}
            style={{
              color: selected ? theme.palette.primary.main : theme.palette.text.primary,
            }}
            checked={selected}
          />
          {option}
        </li>
      )}
      renderTags={(tags: string[]) => {
        if (tags.length === 0) {
          return <Typography variant="body2">{t('translation|All statuses')}</Typography>;
        }

        let statusesToShow = tags[0];
        const joiner = ', ';
        const joinerLength = joiner.length;
        let joinnedStatuses = 1;

        tags.slice(1).forEach(tag => {
          if (statusesToShow.length + tag.length + joinerLength <= maxStatusesChars) {
            statusesToShow += joiner + tag;
            joinnedStatuses++;
          }
        });

        return (
          <Typography style={{ overflowWrap: 'anywhere' }}>
            {statusesToShow.length > maxStatusesChars
              ? statusesToShow.slice(0, maxStatusesChars) + '…'
              : statusesToShow}
            {tags.length > joinnedStatuses && (
              <>
                <span>,&nbsp;</span>
                <b>{`+${tags.length - joinnedStatuses}`}</b>
              </>
            )}
          </Typography>
        );
      }}
      renderInput={params => (
        <Box width="15rem">
          <TextField
            {...params}
            variant="standard"
            label={t('Statuses')}
            fullWidth
            InputLabelProps={{ shrink: true }}
            style={{ marginTop: 0 }}
            placeholder={[...filter.statuses.values()].length > 0 ? '' : 'Filter'}
          />
        </Box>
      )}
    />
  );
}

export function StatusesAutocomplete() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const filter = useTypedSelector(state => state.filter);
  const [statusNames, setStatusNames] = React.useState<string[]>([]);

  // set status names
  React.useEffect(() => {
    const allowedStatuses = ['Running', 'Pending', 'Failed', 'Succeeded'];
    setStatusNames(allowedStatuses);
  });

  const onChange = (event: React.ChangeEvent<{}>, newValue: string[]) => {
    addQuery({ status: newValue.join(' ') }, { status: '' }, history, location, '');
    dispatch(setStatusFilter(newValue));
  };

  return <PureStatusesAutocomplete statusNames={statusNames} onChange={onChange} filter={filter} />;
}
