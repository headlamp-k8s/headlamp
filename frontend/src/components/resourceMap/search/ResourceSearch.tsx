import { Autocomplete, Box, TextField } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KubeObject } from '../../../lib/k8s/cluster';
import { KubeIcon } from '../kubeIcon/KubeIcon';

const MAX_RESULTS = 8;

/**
 * Search input that looks for resources by their name
 *
 * @param params.resources - list of Kube resources
 * @param params.onSearch - on search callback
 * @returns
 */
export function ResourceSearch({
  resources,
  onSearch,
}: {
  resources: KubeObject[];
  onSearch: (resource: KubeObject) => void;
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!resources || !query.trim()) return [];
    const results = [];

    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i];
      if (resource.metadata.name.includes(query)) {
        results.push(resource);
      }
      if (results.length >= MAX_RESULTS) {
        break;
      }
    }

    return results;
  }, [query, resources]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Autocomplete
        renderInput={params => (
          <TextField {...params} label={t('Search')} sx={{ width: '300px' }} size="small" />
        )}
        freeSolo
        clearOnBlur
        filterOptions={x => x}
        getOptionLabel={option => (typeof option === 'string' ? option : option.metadata.name)}
        onInputChange={(e, value) => {
          setQuery(value);
        }}
        onChange={(e, value) => {
          if (value && typeof value !== 'string') {
            onSearch(value);
          }
        }}
        options={results}
        renderOption={(props, it) => {
          return (
            <li {...props}>
              <Box
                component="li"
                display="flex"
                alignItems="center"
                lineHeight={1}
                py={1}
                gap={1.5}
                width="100%"
              >
                <Box width="28px" height="28px" flexShrink={0}>
                  <KubeIcon kind={it.kind} />
                </Box>

                <Box display="flex" flexDirection="column" ml={0} gap={0.5} overflow="hidden">
                  <Box sx={{ opacity: 0.7 }} fontSize={14}>
                    {it.kind}
                  </Box>
                  <Box
                    textOverflow="ellipsis"
                    overflow="hidden"
                    sx={{
                      whiteSpace: 'nowrap',
                      transition: 'all 0.1s',
                    }}
                  >
                    {it.metadata.name}
                  </Box>
                </Box>
              </Box>
            </li>
          );
        }}
      ></Autocomplete>
    </Box>
  );
}
