import { Icon } from '@iconify/react';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import { useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { addQuery } from '../../helpers';
import Namespace from '../../lib/k8s/namespace';
import { setNamespaceFilter } from '../../redux/actions/actions';
import { useTypedSelector } from '../../redux/reducers/reducers';

export interface PureNamespacesAutocompleteProps {
  namespaceNames: string[];
  onChange: (event: React.ChangeEvent<{}>, newValue: string[]) => void;
  filter: { namespaces: Set<string>; search: string };
}

export function PureNamespacesAutocomplete({
  namespaceNames,
  onChange,
  filter,
}: PureNamespacesAutocompleteProps) {
  const theme = useTheme();
  const { t } = useTranslation(['glossary', 'frequent']);
  const maxNamespacesChars = 12;

  return (
    <Autocomplete
      multiple
      id="namespaces-filter"
      autoComplete
      options={namespaceNames}
      onChange={onChange}
      // We reverse the namespaces so the last chosen appear as the first in the label. This
      // is useful since the label is ellipsized and this we get to see it change.
      value={[...filter.namespaces.values()].reverse()}
      renderOption={(option, { selected }) => (
        <React.Fragment>
          <Checkbox
            icon={<Icon icon="mdi:checkbox-blank-outline" />}
            checkedIcon={<Icon icon="mdi:check-box-outline" />}
            style={{
              color: selected ? theme.palette.primary.main : theme.palette.text.primary,
            }}
            checked={selected}
          />
          {option}
        </React.Fragment>
      )}
      renderTags={(tags: string[]) => {
        if (tags.length === 0) {
          return <Typography variant="body2">{t('frequent|All namespaces')}</Typography>;
        }

        let namespacesToShow = tags[0];
        const joiner = ', ';
        const joinerLength = joiner.length;
        let joinnedNamespaces = 1;

        tags.slice(1).forEach(tag => {
          if (namespacesToShow.length + tag.length + joinerLength <= maxNamespacesChars) {
            namespacesToShow += joiner + tag;
            joinnedNamespaces++;
          }
        });

        return (
          <Typography style={{ overflowWrap: 'anywhere' }}>
            {namespacesToShow.length > maxNamespacesChars
              ? namespacesToShow.slice(0, maxNamespacesChars) + '…'
              : namespacesToShow}
            {tags.length > joinnedNamespaces && (
              <>
                <span>,&nbsp;</span>
                <b>{`+${tags.length - joinnedNamespaces}`}</b>
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
            label={t('Namespaces')}
            fullWidth
            InputLabelProps={{ shrink: true }}
            style={{ marginTop: 0 }}
            placeholder={[...filter.namespaces.values()].length > 0 ? '' : 'Filter'}
          />
        </Box>
      )}
    />
  );
}

export function NamespacesAutocomplete() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const filter = useTypedSelector(state => state.filter);
  const [namespaceNames, setNamespaceNames] = React.useState<string[]>([]);

  Namespace.useApiList((namespaces: Namespace[]) => {
    setNamespaceNames(namespaces.map(namespace => namespace.metadata.name));
  });

  const onChange = (event: React.ChangeEvent<{}>, newValue: string[]) => {
    addQuery({ namespace: newValue.join(' ') }, { namespace: '' }, history, location, '');
    dispatch(setNamespaceFilter(newValue));
  };

  return (
    <PureNamespacesAutocomplete
      namespaceNames={namespaceNames}
      onChange={onChange}
      filter={filter}
    />
  );
}
