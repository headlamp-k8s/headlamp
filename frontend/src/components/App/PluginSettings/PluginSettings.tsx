import { Switch, SwitchProps, Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { MRT_Row } from 'material-react-table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import helpers from '../../../helpers';
import { useFilterFunc } from '../../../lib/util';
import { PluginInfo, reloadPage, setEnablePlugin } from '../../../plugin/pluginsSlice';
import { useTypedSelector } from '../../../redux/reducers/reducers';
import { Link as HeadlampLink, SectionBox, Table } from '../../common';
import SectionFilterHeader from '../../common/SectionFilterHeader';

/**
 * Interface of the component's props structure.
 *
 * plugins: will consist of an array of plugin data objects
 *
 * @see PluginInfo
 *
 * onSave: function that will handle the named plugins data array
 */
export interface PluginSettingsPureProps {
  plugins: PluginInfo[];
  pluginsEnabledMap: Record<string, boolean>;
  onSave: (plugins: PluginInfo[]) => void;
  saveAlwaysEnable?: boolean;
}

/** PluginSettingsProp intentially left empty to remain malleable */
export interface PluginSettingsProps {}

const EnableSwitch = (props: SwitchProps) => {
  const theme = useTheme();

  return (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      sx={{
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
          padding: 0,
          margin: '2px',

          transitionDuration: '300ms',
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#0078d4',
              opacity: 1,
              border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.5,
            },
          },
          '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
          },
          '&.Mui-disabled .MuiSwitch-thumb': {
            color:
              theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
          },
        },
        '& .MuiSwitch-thumb': {
          boxSizing: 'border-box',
          width: 22,
          height: 22,
        },
        '& .MuiSwitch-track': {
          borderRadius: 26 / 2,
          backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
          opacity: 1,
          transition: theme.transitions.create(['background-color'], {
            duration: 500,
          }),
        },
      }}
      {...props}
    />
  );
};

/** PluginSettingsPure is the main component to where we render the plugin data. */
export function PluginSettingsPure(props: PluginSettingsPureProps) {
  const dispatch = useDispatch();

  const { t } = useTranslation(['translation']);

  /**
   * Copy of plugins with pending changes
   */
  const [pluginChanges, setPluginChanges] = useState<PluginInfo[]>(
    props.plugins.map((plugin: PluginInfo) => {
      const [author, name] = plugin.name.includes('@')
        ? plugin.name.split(/\/(.+)/)
        : [null, plugin.name];

      return {
        ...plugin,
        displayName: name ?? plugin.name,
        origin: plugin.origin ?? author?.substring(1) ?? t('translation|Unknown'),
      };
    })
  );

  /**
   * pendingPluginsEnabled is either from the local storage or the prop data
   */
  const [pendingPluginsEnabled, setPendingPluginsEnabled] = useState<Record<string, boolean>>(
    props.pluginsEnabledMap
  );

  const enableSave = useMemo(() => {
    return !pluginChanges.every((plugin: { name: string }) => {
      return (
        Boolean(props.pluginsEnabledMap[plugin.name]) ===
        Boolean(pendingPluginsEnabled[plugin.name])
      );
    });
  }, [pendingPluginsEnabled, pluginChanges, props.pluginsEnabledMap]);

  /**
   * onSaveButton function to be called once the user clicks the Save button.
   */
  function onSaveButtonHandler() {
    dispatch(setEnablePlugin(pendingPluginsEnabled));
    dispatch(reloadPage());
  }

  /**
   * On change function handler to control the enableSave state and update the pluginChanges state.
   * This function is called on every plugin toggle action and recreates the state for pluginChanges.
   * Once the user clicks a toggle, the Save button is also rendered via setEnableSave.
   */
  function switchChangeHandler(plug: { name: any }) {
    const plugName = plug.name;

    setPluginChanges([
      ...pluginChanges.map(p => {
        if (p.name === plugName) {
          return {
            ...p,
            isEnabled: !p.isEnabled,
          };
        }
        return p;
      }),
    ]);

    setPendingPluginsEnabled({
      ...pendingPluginsEnabled,
      [plugName]: !pendingPluginsEnabled[plugName],
    });
  }

  return (
    <>
      <SectionBox
        title={<SectionFilterHeader title={t('translation|Plugins')} noNamespaceFilter />}
      >
        <Table
          columns={[
            {
              header: t('translation|Name'),
              accessorKey: 'name',
              muiTableBodyCellProps: {
                sx: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  width: 'unset',
                },
              },
              Cell: ({ row: { original: plugin } }: { row: MRT_Row<PluginInfo> }) => {
                return (
                  <>
                    <Typography variant="subtitle1">
                      <HeadlampLink
                        routeName={'pluginDetails'}
                        params={{ name: plugin.name }}
                        align="right"
                      >
                        {plugin.displayName}
                      </HeadlampLink>
                    </Typography>
                    <Typography variant="caption">{plugin.version}</Typography>
                  </>
                );
              },
            },
            {
              header: t('translation|Description'),
              accessorKey: 'description',
            },
            {
              header: t('translation|Origin'),
              Cell: ({ row: { original: plugin } }: { row: MRT_Row<PluginInfo> }) => {
                const url = plugin?.homepage || plugin?.repository?.url;
                return plugin?.origin ? (
                  url ? (
                    <Link href={url}>{plugin.origin}</Link>
                  ) : (
                    plugin?.origin
                  )
                ) : (
                  t('translation|Unknown')
                );
              },
            },
            // TODO: Fetch the plugin status from the plugin settings store
            {
              header: t('translation|Status'),
              accessorFn: (plugin: PluginInfo) => {
                if (plugin.isCompatible === false) {
                  return t('translation|Incompatible');
                }
                return pendingPluginsEnabled[plugin.name]
                  ? t('translation|Enabled')
                  : t('translation|Disabled');
              },
            },
            {
              header: t('translation|Enable'),
              Cell: ({ row: { original: plugin } }: { row: MRT_Row<PluginInfo> }) => {
                if (!plugin.isCompatible || !helpers.isElectron()) {
                  return null;
                }
                return (
                  <EnableSwitch
                    aria-label={`Toggle ${plugin.name}`}
                    checked={pendingPluginsEnabled[plugin.name]}
                    onChange={() => switchChangeHandler(plugin)}
                    color="primary"
                    name={plugin.name}
                  />
                );
              },
              sort: (a: PluginInfo, b: PluginInfo) =>
                a.isEnabled === b.isEnabled ? 0 : a.isEnabled ? -1 : 1,
            },
          ]
            // remove the enable column if we're not in app mode
            .filter(el => !(el.header === t('translation|Enable') && !helpers.isElectron()))}
          data={pluginChanges}
          filterFunction={useFilterFunc<PluginInfo>(['.name'])}
        />
      </SectionBox>
      {enableSave && (
        <Box sx={{ display: `flex`, justifyContent: `flex-end`, margin: `5px` }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ margin: `5px` }}
            onClick={() => onSaveButtonHandler()}
          >
            {t('translation|Save & Apply')}
          </Button>
        </Box>
      )}
    </>
  );
}

/** Container function for the PluginSettingsPure, onSave prop returns plugins */
export default function PluginSettings() {
  const dispatch = useDispatch();

  const pluginData = useTypedSelector(state => state.plugins.pluginData);

  const oldLocalEnabledList = localStorage.getItem('headlampPluginSettings');
  const localEnabledList = localStorage.getItem('enabledPluginsList');

  let pluginsEnabledMap;

  /**
   * Note: this is a temporary fix to handle the migration of the old plugin settings.
   */
  if (oldLocalEnabledList) {
    const oldSettings = JSON.parse(oldLocalEnabledList);

    pluginsEnabledMap = oldSettings.reduce(
      (acc: Record<string, any>, p: { name: string; isEnabled: boolean }) => {
        acc[p.name] = !!p.isEnabled;
        return acc;
      },
      {} as Record<string, any>
    );

    localStorage.setItem('enabledPluginsList', JSON.stringify(pluginsEnabledMap));
    localStorage.removeItem('headlampPluginSettings');

    dispatch(setEnablePlugin(pluginsEnabledMap));
    dispatch(reloadPage());
  } else {
    /**
     * NOTE: For compatibility with old settings, we need to check if the `localEnabledList` exists.
     * If `localEnabledList` exists, parse it and assign it to `pluginsEnabledMap`.
     * This indicates that previous plugin settings have been saved and can be used.
     *
     * If `localEnabledList` does not exist, it means the settings are not initialized
     * and no previous plugin settings have been saved. In this case, default the plugins
     * to being disabled to allow users to turn on their desired plugins.
     */
    if (localEnabledList) {
      pluginsEnabledMap = JSON.parse(localEnabledList) as Record<string, boolean>;
    } else {
      pluginsEnabledMap = pluginData.reduce((acc, p) => {
        acc[p.name] = !!p.isEnabled;
        return acc;
      }, {} as Record<string, boolean>);

      dispatch(setEnablePlugin(pluginsEnabledMap));
      dispatch(reloadPage());
    }
  }

  return (
    <PluginSettingsPure
      plugins={pluginData}
      pluginsEnabledMap={pluginsEnabledMap}
      onSave={() => {}}
    />
  );
}
