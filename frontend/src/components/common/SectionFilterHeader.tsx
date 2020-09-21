import filterIcon from '@iconify/icons-mdi/filter-variant';
import filterVariantRemove from '@iconify/icons-mdi/filter-variant-remove';
import { Icon } from '@iconify/react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch } from 'react-redux';
import { resetFilter, setSearchFilter } from '../../redux/actions/actions';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { NamespacesAutocomplete } from './Autocomplete';
import SectionHeader, { SectionHeaderProps } from './SectionHeader';

interface SectionFilterHeaderProps extends SectionHeaderProps {
  noNamespaceFilter?: boolean;
  noSearch?: boolean;
}

export default function SectionFilterHeader(props: SectionFilterHeaderProps) {
  const { noNamespaceFilter = false, noSearch = false, ...headerProps } = props;
  const filter = useTypedSelector(state => state.filter);
  const dispatch = useDispatch();

  const hasNamespaceFilters = !noNamespaceFilter && filter.namespaces.size > 0;
  const hasSearch = !noSearch && !!filter.search;

  const [showFilters, setShowFilters] = React.useState<boolean>(hasNamespaceFilters || hasSearch);

  function resetFilters() {
    dispatch(resetFilter());
    setShowFilters(false);
  }

  useHotkeys('ctrl+shift+f', () => {
    if (!noSearch || !noNamespaceFilter) {
      setShowFilters(true);
    }
  });

  React.useEffect(() => {
    // We don't want the search to be used globally, but we're using Redux with it because
    // this way we manage it the same way as with the other filters.
    return function cleanup() {
      dispatch(setSearchFilter(''));
    };
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const actions = [];

  if (!showFilters) {
    actions.push(
      <IconButton
        aria-label="show-filter"
        onClick={() => setShowFilters(!showFilters)}
      >
        <Icon icon={filterIcon} />
      </IconButton>
    );
  } else {
    actions.push(
      <Grid
        container
        alignItems="flex-end"
        justify="flex-end"
        spacing={1}
        wrap="nowrap"
      >
        { !noNamespaceFilter &&
          <Grid item>
            <NamespacesAutocomplete />
          </Grid>
        }
        <Grid item>
          <TextField
            id="standard-search"
            label="Search"
            type="search"
            InputLabelProps={{shrink: true}}
            placeholder="Filter"
            value={filter.search}
            autoFocus
            onChange={event =>
              dispatch(setSearchFilter(event.target.value))
            }
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            endIcon={<Icon icon={filterVariantRemove} /> }
            onClick={resetFilters}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
    );
  }

  return (
    <React.Fragment>
      <SectionHeader
        {...headerProps}
        actions={actions.length <= 1 ? actions : [
          <Box>
            <Grid
              container
              spacing={1}
            >
              {actions.map((action, i) =>
                <Grid item key={i}>
                  {action}
                </Grid>
              )}
            </Grid>
          </Box>
        ]}
      />
    </React.Fragment>
  );
}
