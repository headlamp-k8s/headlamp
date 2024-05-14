import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getFilterValueByNameFromURL } from '../../helpers';
import { setNamespaceFilter } from '../../redux/filterSlice';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { NamespacesAutocomplete } from './NamespacesAutocomplete';
import SectionHeader, { SectionHeaderProps } from './SectionHeader';

export interface SectionFilterHeaderProps extends SectionHeaderProps {
  noNamespaceFilter?: boolean;
  /**
   * @deprecated
   * This prop has no effect, search has moved inside the Table component.
   * To disable namespace filter use `noNamespaceFilter`
   */
  noSearch?: boolean;
  preRenderFromFilterActions?: React.ReactNode[];
}

export default function SectionFilterHeader(props: SectionFilterHeaderProps) {
  const {
    noNamespaceFilter = false,
    actions: propsActions = [],
    preRenderFromFilterActions,
    ...headerProps
  } = props;
  const filter = useTypedSelector(state => state.filter);
  const dispatch = useDispatch();
  const location = useLocation();

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
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  let actions: React.ReactNode[] = [];
  if (preRenderFromFilterActions) {
    actions.push(...preRenderFromFilterActions);
  }

  if (!!propsActions) {
    actions = actions.concat(propsActions);
  }

  if (!noNamespaceFilter) {
    actions.push(<NamespacesAutocomplete />);
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
