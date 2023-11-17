import { Icon } from '@iconify/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { addQuery, getFilterValueByNameFromURL } from '../../helpers';
import { resetFilter, setNamespaceFilter, setSearchFilter } from '../../redux/filterSlice';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { NamespacesAutocomplete } from './NamespacesAutocomplete';
import SectionHeader, { SectionHeaderProps } from './SectionHeader';

export interface SectionFilterHeaderProps extends SectionHeaderProps {
  noNamespaceFilter?: boolean;
  noSearch?: boolean;
  preRenderFromFilterActions?: React.ReactNode[];
}

export default function SectionFilterHeader(props: SectionFilterHeaderProps) {
  const {
    noNamespaceFilter = false,
    noSearch = false,
    actions: propsActions = [],
    preRenderFromFilterActions,
    ...headerProps
  } = props;
  const filter = useTypedSelector(state => state.filter);
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const hasNamespaceFilters = !noNamespaceFilter && filter.namespaces.size > 0;
  const hasSearch = !noSearch && !!filter.search;
  const { t } = useTranslation();

  // When the user moves to a different route, the search filter is reset (to an empty string), but
  // this goes through redux, so when the new route is rendered, the search filter is still the old
  // one. Eventually, the redux state will be updated, but at this point we already have the filter
  // being shown (when it should actually be shown). OTOH, if we always hide the filter when the
  // search (and namespace) are empty, it will also hide when the user deletes the whole string, and
  // that's not desireable (because they may want to keep writing and at that point the filter has
  // been hidden and input is lost).
  // To solve this, we keep track of whether the filter has been shown by the user, in which case we
  // don't hide it even when the search is empty.
  const [showFilters, setShowFilters] = React.useState<{ show: boolean; userTriggered: boolean }>({
    show: hasNamespaceFilters || hasSearch,
    userTriggered: false,
  });

  function resetFilters() {
    addQuery({ namespace: '' }, { namespace: '' }, history, location);
    dispatch(resetFilter());
    setShowFilters({ show: false, userTriggered: true });
  }

  useHotkeys('ctrl+shift+f', () => {
    if (!noSearch || !noNamespaceFilter) {
      setShowFilters({ show: true, userTriggered: true });
    }
  });

  const focusedRef = React.useCallback(node => {
    if (node !== null) {
      node.focus();
    }
  }, []);

  React.useEffect(
    () => {
      const namespace = getFilterValueByNameFromURL('namespace', location);
      if (namespace.length > 0) {
        const namespaceFromStore = [...filter.namespaces].sort();
        if (
          namespace
            .slice()
            .sort()
            .every((value: string, index: number) => value !== namespaceFromStore[index])
        ) {
          dispatch(setNamespaceFilter(namespace));
          if (!noNamespaceFilter) {
            setShowFilters({ show: true, userTriggered: false });
          }
        }
      }
      // We don't want the search to be used globally, but we're using Redux with it because
      // this way we manage it the same way as with the other filters.
      return function cleanup() {
        dispatch(setSearchFilter(''));
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  React.useEffect(() => {
    setShowFilters(state => {
      return {
        show: hasSearch || hasNamespaceFilters || state.userTriggered,
        userTriggered: state.userTriggered,
      };
    });
  }, [hasSearch]);

  let actions: React.ReactNode[] = [];
  if (preRenderFromFilterActions && !showFilters.show) {
    actions.push(...preRenderFromFilterActions);
  }

  if (!showFilters.show) {
    actions.push(
      <IconButton
        aria-label={t('Show filter')}
        onClick={() => setShowFilters({ show: true, userTriggered: true })}
        size="medium"
      >
        <Icon icon="mdi:filter-variant" />
      </IconButton>
    );
  } else {
    actions.push(
      <Grid container alignItems="flex-end" justifyContent="flex-end" spacing={1} wrap="nowrap">
        {!noNamespaceFilter && (
          <Grid item>
            <NamespacesAutocomplete />
          </Grid>
        )}
        <Grid item>
          <TextField
            id="standard-search"
            label={t('Search')}
            type="search"
            InputLabelProps={{ shrink: true }}
            InputProps={{ role: 'search' }}
            placeholder={t('Filter')}
            value={filter.search}
            onChange={event => {
              dispatch(setSearchFilter(event.target.value));
              setShowFilters({ show: true, userTriggered: true });
            }}
            inputRef={focusedRef}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            endIcon={<Icon icon="mdi:filter-variant-remove" />}
            onClick={resetFilters}
            aria-controls="standard-search"
          >
            {t('Clear')}
          </Button>
        </Grid>
      </Grid>
    );
  }

  if (!!propsActions) {
    actions = actions.concat(propsActions);
  }

  return (
    <React.Fragment>
      <SectionHeader
        {...headerProps}
        actions={
          actions.length <= 1
            ? actions
            : [
                <Box>
                  <Grid container spacing={1} alignItems="center">
                    {actions.map((action, i) => (
                      <Grid item key={i}>
                        {action}
                      </Grid>
                    ))}
                  </Grid>
                </Box>,
              ]
        }
      />
    </React.Fragment>
  );
}
