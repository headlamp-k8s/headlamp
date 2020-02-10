import filterVariantRemove from '@iconify/icons-mdi/filter-variant-remove';
import { Icon } from '@iconify/react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetFilter, setSearchFilter } from '../../redux/actions/actions';
import { NamespacesAutocomplete } from './Autocomplete';
import SectionHeader from './SectionHeader';

const useStyles = makeStyles(theme => ({
  filterAction: {
    marginBottom: theme.spacing(1),
  },
}));

export default function SectionFilterHeader(props) {
  const { noNamespaceFilter=false, noSearch=false, ...headerProps } = props;
  const classes = useStyles();
  const filter = useSelector(state => state.filter);
  const dispatch = useDispatch();

  function resetFilters() {
    dispatch(resetFilter());
  }

  React.useEffect(() => {
    // We don't want the search to be used globally, but we're using Redux with it because
    // this way we manage it the same way as with the other filters.
    return function cleanup() {
      dispatch(setSearchFilter(''));
    };
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const hasNamespaceFilters = !noNamespaceFilter && [...filter.namespaces.values()].length > 0;
  const hasSearch = !noSearch && filter.search;

  const actions = [
  ];

  if (!noNamespaceFilter) {
    actions.push(<NamespacesAutocomplete />);
  }

  actions.push(
    <TextField
      id="standard-search"
      label="Search"
      type="search"
      InputLabelProps={{shrink: true}}
      placeholder="Filter"
      value={filter.search}
      onChange={event =>
        dispatch(setSearchFilter(event.target.value))
      }
    />
  );

  return (
    <React.Fragment>
      <SectionHeader
        {...headerProps}
        actions={actions.length <= 1 ? actions : [
          <Grid
            container
            item
            spacing={1}
          >
            {actions.map((action, i) =>
              <Grid item key={i}>
                {action}
              </Grid>
            )}
          </Grid>
        ]}
      />
      {(hasNamespaceFilters || hasSearch) &&
        <Grid
          container
          alignItems="center"
          justify="center"
          className={classes.filterAction}
        >
          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              endIcon={<Icon icon={filterVariantRemove} />  }
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      }
    </React.Fragment>
  );
}
