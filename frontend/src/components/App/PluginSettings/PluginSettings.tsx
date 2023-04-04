import { Switch } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionBox, SimpleTable } from '../../common';

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

/** PluginInfo is the shape of the metadata information for individual plugin objects. */
type PluginInfo = {
  /**
   * The "name" field contains the plugin's name,
   * and must be lowercase and one word, and may contain hyphens and underscores.
   *
   * @see https://docs.npmjs.com/creating-a-package-json-file#required-name-and-version-fields
   */
  name: string;
  /** description text of the plugin from npm with same restrictions as package.json description
   *
   * @see https://docs.npmjs.com/cli/v9/configuring-npm/package-json?v=true#description
   */
  description: string;
  /** homepage is the URL link address for the plugin defined from the package.json */
  homepage: string;
  /** isEnable is true when the plugin is enabled */
  isEnabled: boolean;
};

/** PluginSettingsPure is the main component to where we render the plugin data. */
export function PluginSettingsPure(props: PluginSettingsPureProps) {
  const classes = useStyles();
  const { t } = useTranslation(['frequent', 'settings']);

  const settingsPlugins = useTypedSelector(state => state.config.settings.plugins);

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
      <SectionBox title={t('settings|Plugins')}>
        <SimpleTable
          columns={[
            {
              label: 'Name',
              datum: 'name',
            },
            {
              label: 'Description',
              datum: 'description',
            },
            {
              label: 'Homepage',
              datum: 'homepage',
            },
            {
              label: 'Enable',
              getter: plugin => {
                return (
                  <Switch
                    aria-label={`Toggle ${plugin.name}`}
                    checked={plugin.isEnabled}
                    onChange={() => switchChangeHanlder(plugin)}
                    color="primary"
                    name={plugin.name}
                  />
                );
              },
            },
          ]}
          data={pluginChanges}
        />
      </SectionBox>
      <div>{settingsPlugins.length}</div>
      {enableSave && (
        <Box className={classes.saveButtonBox}>
          <Button
            variant="contained"
            color="primary"
            className={classes.saveButton}
            onClick={() => onSaveButtonHandler()}
          >
            {t('frequent|Save & Apply')}
          </Button>
        </Box>
      )}
    </>
  );
}

/** Container function for the PluginSettingsPure, onSave prop returns plugins */
export default function PluginSettings() {
  return (
    <PluginSettingsPure
      plugins={[]}
      onSave={plugins => {
        plugins;
      }}
    />
  );
}
