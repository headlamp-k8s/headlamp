import { Box, TextField } from '@mui/material';
import { useMemo, useRef, useState } from 'react';
import { KubeObject } from '../../../lib/k8s/cluster';
import { KubeIcon } from '../kubeIcon/KubeIcon';
import { useClickOutside } from '../useClickOutside';

const MAX_RESULTS = 8;
export function ResourceSearch({
  resources,
  onSearch,
}: {
  resources: KubeObject[];
  onSearch: (resource: any) => void;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useClickOutside(containerRef, () => {
    setIsFocused(false);
  });

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
        zIndex: isFocused ? 9999999 : undefined,
      }}
    >
      <Box position="relative" ref={containerRef}>
        <TextField
          inputRef={inputRef}
          label="Search"
          size={'small'}
          variant="outlined"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onClick={() => setIsFocused(true)}
          autoComplete="off"
          sx={{
            width: isFocused ? '400px' : '200px',
          }}
        />

        {results.length > 0 && isFocused && (
          <Box
            position="absolute"
            width="100%"
            sx={theme => ({
              background: theme.palette.background.default,
              maxHeight: '500px',
              overflowY: 'auto',
              boxShadow: theme.shadows[3],
            })}
            pb={1}
            zIndex={1}
          >
            {results.map(it => (
              <Box
                display="flex"
                gap={1.5}
                p={1.5}
                alignItems="center"
                lineHeight={1}
                sx={theme => ({
                  ':hover': {
                    background: theme.palette.action.hover,
                  },
                })}
                onClick={() => {
                  onSearch(it);
                  setIsFocused(false);
                }}
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
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
