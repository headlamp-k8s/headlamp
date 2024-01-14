import { Switch, SwitchProps, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useFilterFunc } from '../../../lib/util';
import { PluginInfo, reloadPage, setPluginSettings } from '../../../plugin/pluginsSlice';
import { useTypedSelector } from '../../../redux/reducers/reducers';
import NotFoundComponent from '../../404';
import { Link as HeadlampLink, SectionBox, SimpleTable } from '../../common';
import ErrorBoundary from '../../common/ErrorBoundary';
import SectionFilterHeader from '../../common/SectionFilterHeader';
/**
 * useStyles css for alignment of the save button
 *
 * saveButtonBox: css styling to align the save box to the right of the page.
 */
const useStyles = makeStyles(() => ({
  saveButtonBox: {
    display: `flex`,
    justifyContent: `flex-end`,
    margin: `5px`,
  },
  saveButton: {
    margin: `5px`,
  },
}));

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
  onSave: (plugins: PluginInfo[]) => void;
  saveAlwaysEnable?: boolean;
}

/** PluginSettingsProp intentially left empty to remain malleable */
export interface PluginSettingsProps {}

const CustomSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
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
      color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
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
}));

/** PluginSettingsPure is the main component to where we render the plugin data. */
export function PluginSettingsPure(props: PluginSettingsPureProps) {
  const classes = useStyles();
  const { t } = useTranslation(['translation']);

  /** Plugin arr to be rendered to the page from prop data */
  const pluginArr: any = props.plugins ? props.plugins : [];

  /** enableSave state enables the save button when changes are made to the plugin list */
  const [enableSave, setEnableSave] = useState(false);

  /** pluginChanges state is the array of plugin data and any current changes made by the user to a plugin's "Enable" field via toggler */
  const [pluginChanges, setPluginChanges] = useState(() => pluginArr.map((p: any) => p));

  /**
   * useEffect to control the rendering of the save button.
   * By default, the enableSave is set to false.
   * If props.plugins matches pluginChanges enableSave is set to false, disabling the save button.
   */
  useEffect(() => {
    /** This matcher function compares the fields of name and isEnabled of each object in props.plugins to each object in pluginChanges */
    function matcher(objA: PluginInfo, objB: PluginInfo) {
      return objA.name === objB.name && objA.isEnabled === objB.isEnabled;
    }

    /**
     * arrayComp returns true if each object in both arrays are identical by name and isEnabled.
     * If both arrays are identical in this scope, then no changes need to be saved.
     * If they do not match, there are changes in the pluginChanges array that can be saved and thus enableSave should be enabled.
     */
    const arrayComp = props.plugins.every((val, key) => matcher(val, pluginChanges[key]));

    /** For storybook usage, determines if the save button should be enabled by default */
    if (props.saveAlwaysEnable) {
      setEnableSave(true);
    } else {
      if (arrayComp) {
        setEnableSave(false);
      }
      if (!arrayComp) {
        setEnableSave(true);
      }
    }
  }, [pluginChanges]);

  /**
   * onSaveButton function to be called once the user clicks the Save button.
   * This function then takes the current state of the pluginChanges array and inputs it to the onSave prop function.
   */
  function onSaveButtonHandler() {
    props.onSave(pluginChanges);
  }

  /**
   * On change function handler to control the enableSave state and update the pluginChanges state.
   * This function is called on every plugin toggle action and recreates the state for pluginChanges.
   * Once the user clicks a toggle, the Save button is also rendered via setEnableSave.
   */
  function switchChangeHanlder(plug: { name: any }) {
    const plugName = plug.name;

    setPluginChanges((currentInfo: any[]) =>
      currentInfo.map((p: { name: any; isEnabled: any }) => {
        if (p.name === plugName) {
          return { ...p, isEnabled: !p.isEnabled };
        }
        return p;
      })
    );
  }

  return (
    <>
      <SectionBox
        title={<SectionFilterHeader title={t('translation|Plugins')} noNamespaceFilter />}
      >
        <SimpleTable
          columns={[
            {
              label: 'Name',
              getter: plugin => {
                return (
                  <>
                    <Typography variant="subtitle1">
                      <HeadlampLink
                        routeName={'pluginDetails'}
                        params={{ name: plugin.name }}
                        align="right"
                      >
                        {plugin.name}
                      </HeadlampLink>
                    </Typography>
                    <Typography variant="caption">{plugin.version}</Typography>
                  </>
                );
              },
              sort: (a, b) => a.name.localeCompare(b.name),
            },
            {
              label: 'Description',
              datum: 'description',
              sort: true,
            },
            {
              label: 'Origin',
              getter: plugin => {
                const url = plugin?.homepage || plugin?.repository?.url;
                console.log(plugin.name, plugin?.origin, url);
                return plugin?.origin ? (
                  url ? (
                    <Link href={url}>{plugin?.origin}</Link>
                  ) : (
                    plugin?.origin
                  )
                ) : (
                  'Community'
                );
              },
              sort: true,
            },
            // TODO: Fetch the plugin status from the plugin settings store
            {
              label: 'Status',
              getter: plugin => {
                return plugin.isEnabled ? 'Enabled' : 'Disabled';
              },
              sort: true,
            },
            {
              label: 'Enable',
              getter: plugin => {
                return (
                  <CustomSwitch
                    aria-label={`Toggle ${plugin.name}`}
                    checked={plugin.isEnabled}
                    onChange={() => switchChangeHanlder(plugin)}
                    color="primary"
                    name={plugin.name}
                  />
                );
              },
              sort: (a, b) => (a.isEnabled === b.isEnabled ? 0 : a.isEnabled ? -1 : 1),
            },
          ]}
          data={pluginChanges}
          filterFunction={useFilterFunc<PluginInfo>(['.name'])}
        />
      </SectionBox>
      {enableSave && (
        <Box className={classes.saveButtonBox}>
          <Button
            variant="contained"
            color="primary"
            className={classes.saveButton}
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

  const pluginSettings = useTypedSelector(state => state.plugins.pluginSettings);

  return (
    <PluginSettingsPure
      plugins={pluginSettings}
      onSave={plugins => {
        dispatch(setPluginSettings(plugins));
        dispatch(reloadPage());
      }}
    />
  );
}

const ScrollableBox = withStyles(() => ({
  root: {
    overflowY: 'scroll',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
}))(Box);

export function PluginDetail() {
  const pluginSettings = useTypedSelector(state => state.plugins.pluginSettings);
  const { name } = useParams<{ name: string }>();
  const decodedName = decodeURIComponent(name);
  const plugin = pluginSettings.find(p => p.name === decodedName);
  if (!plugin) {
    return <NotFoundComponent />;
  }
  return <PluginDetailPure plugin={plugin} />;
}

export function PluginDetailPure(props: { plugin: PluginInfo }) {
  const plugin = props.plugin;
  return (
    <>
      <SectionBox aria-live="polite" title={plugin.name} backLink={'/settings/plugins'}>
        {plugin.description}
        <ScrollableBox style={{ height: '70vh' }} py={0}>
          <ErrorBoundary>
            {plugin.component
              ? typeof plugin.component === 'function'
                ? plugin.component()
                : plugin.component
              : null}
          </ErrorBoundary>
        </ScrollableBox>
      </SectionBox>
      <Box py={0}>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          sx={{ borderTop: '2px solid', borderColor: 'silver', padding: '10px' }}
        >
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              disabled={!plugin.component}
              style={{ backgroundColor: 'silver', color: 'black' }}
            >
              Save
            </Button>
            <Button style={{ color: 'silver' }}>Cancel</Button>
          </Stack>
          <Button variant="text" color="error">
            Delete Plugin
          </Button>
        </Stack>
      </Box>
    </>
  );
}
