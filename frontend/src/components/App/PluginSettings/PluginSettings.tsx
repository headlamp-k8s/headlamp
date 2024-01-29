import { Switch, SwitchProps, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import { useEffect, useState } from 'react';
import { isValidElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { deletePlugin } from '../../../lib/k8s/apiProxy';
import { useFilterFunc } from '../../../lib/util';
import { PluginInfo, reloadPage, setPluginSettings } from '../../../plugin/pluginsSlice';
// import {ConfigStore}  from '../../../plugin/pluginStore';
import { useTypedSelector } from '../../../redux/reducers/reducers';
import NotFoundComponent from '../../404';
import { Link as HeadlampLink, SectionBox, SimpleTable } from '../../common';
import { ConfirmDialog } from '../../common/Dialog';
import ErrorBoundary from '../../common/ErrorBoundary';
import SectionFilterHeader from '../../common/SectionFilterHeader';
import GenericInput from '../../common/Settings/Input';

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

  {
    /*interface testconf {
    name: string;
    url: string;
  }

  interface testconf2 {
    name: string;
    url: string;
    age: number;
  }

  const store = new ConfigStore<testconf>("test")
  // store.update({name:"chatgpt"})

  const store2 = new ConfigStore<testconf2>("test2")

  useEffect(()=>{
    store.set({name:"water",url:"https://water.com"})
    store.update({name:"chatgpt"})
    store.set({name:"fire",url:"https://fire.com"})
  
    store2.set({name:"water",url:"https://water.com",age:10})
    store2.update({name:"chatgpt"})
    store2.set({name:"fire",url:"https://fire.com",age:20})  
  },[])

  const useMyConfig = store.get()
  const conf = useMyConfig();
console.log("conf",conf)*/
  }

  // const history = useHistory();

  // const store = new ConfigStore(plugin.name);
  // const config = store.get() as {[key:string]:any};
  const config = { test: 'test' };
  const [data, setData] = useState<{ [key: string]: any }>(config);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    // if the data is changed by the user, enable the save button
    if (JSON.stringify(data) !== JSON.stringify(config)) {
      setSaveEnabled(true);
    } else {
      setSaveEnabled(false);
    }
  }, [data]);

  function onDataChange(data: any) {
    setData(data);
  }

  function handleSave() {
    console.log('handleSave', data);
    // store.set(data);
  }

  function handleCancel() {
    setData({});
  }

  function handleDelete() {
    setOpenAlert(true);
  }

  const handleDeleteConfirm = async () => {
    // delete the plugin
    deletePlugin(plugin.name)
      .then(() => {
        // update the plugin list
        const dispatch = useDispatch();
        const pluginSettings = useTypedSelector(state => state.plugins.pluginSettings);
        const plugins = pluginSettings.filter(p => p.name !== plugin.name);
        dispatch(setPluginSettings(plugins));
        dispatch(reloadPage());
      })
      .finally(() => {
        // redirect /plugins page
        // history.push isn't updating the plugins list so we're using window.location.pathname
        window.location.pathname = '/settings/plugins';
        // history.push("/settings/plugins")
      });
  };

  let component;
  if (isValidElement(plugin.settingsComponent)) {
    component = plugin.settingsComponent;
  } else if (typeof plugin.settingsComponent === 'function') {
    const Comp = plugin.settingsComponent;
    if (plugin.settingsAutoSave) {
      component = <Comp />;
    } else {
      component = <Comp onDataChange={onDataChange} data={data} />;
    }
    console.log('plugin.component', component);
  } else {
    component = null;
  }

  return (
    <>
      <SectionBox aria-live="polite" title={plugin.name} backLink={'/settings/plugins'}>
        {plugin.description}
        <ScrollableBox style={{ height: '70vh' }} py={0}>
          <ConfirmDialog
            open={openAlert}
            title={'Delete Plugin'}
            description={'Are you sure you want to delete this plugin?'}
            handleClose={() => setOpenAlert(false)}
            onConfirm={() => handleDeleteConfirm()}
          />
          {/* {JSON.stringify(conf)} */}
          <ErrorBoundary>
            <GenericInput
              title={'test'}
              validationRegex={
                new RegExp(
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )
              }
            />
            {component}
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
            {!plugin.settingsAutoSave && (
              <>
                <Button
                  variant="contained"
                  disabled={saveEnabled}
                  style={{ backgroundColor: 'silver', color: 'black' }}
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button style={{ color: 'silver' }} onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            )}
          </Stack>

          <Button variant="text" color="error" onClick={handleDelete}>
            Delete Plugin
          </Button>
        </Stack>
      </Box>
    </>
  );
}
