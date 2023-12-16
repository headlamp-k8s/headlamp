import MuiTab from '@mui/material/Tab';
import MuiTabs from '@mui/material/Tabs';
import Typography, { TypographyProps } from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { useId } from '../../lib/util';

/**
 * Custom styles for the Tabs component.
 */
const useStyle = makeStyles(() => ({
  tab: {
    minWidth: 150, // allows 8 tabs to show like on pods
  },
}));

/**
 * Represents an individual tab in the Tabs component.
 */
export interface Tab {
  /**
   * The label to be displayed on the tab.
   */
  label: string;
  
  /**
   * The content to be displayed when the tab is selected.
   */
  component: JSX.Element | JSX.Element[];
}

/**
 * Props for the Tabs component.
 */
export interface TabsProps {
  /**
   * An array of tab objects containing labels and components.
   */
  tabs: Tab[];

  /**
   * Additional properties for the MuiTabs component.
   */
  tabProps?: {
    [propName: string]: any;
  };

  /**
   * The default index of the selected tab.
   */
  defaultIndex?: number | null | boolean;

  /**
   * Callback function triggered when the selected tab changes.
   * @param tabIndex - The index of the selected tab.
   */
  onTabChanged?: (tabIndex: number) => void;

  /**
   * Additional CSS class for styling purposes.
   */
  className?: string;

  /**
   * Aria label for accessibility.
   */
  ariaLabel: string;
}

/**
 * A customizable Tabs component.
 */
export default function Tabs(props: TabsProps) {
  const { tabs, tabProps = {}, defaultIndex = 0, onTabChanged = null, ariaLabel } = props;
  const [tabIndex, setTabIndex] = React.useState<TabsProps['defaultIndex']>(
    defaultIndex && Math.min(defaultIndex as number, 0)
  );
  const classes = useStyle();

  /**
   * Handles the tab change event.
   * @param event - The tab change event.
   * @param newValue - The new tab index.
   */
  function handleTabChange(event: any, newValue: number) {
    setTabIndex(newValue);

    // Call the onTabChanged callback if provided
    if (onTabChanged !== null) {
      onTabChanged(newValue);
    }
  }

  // Update the tab index when defaultIndex changes
  React.useEffect(
    () => {
      if (defaultIndex === null) {
        setTabIndex(false);
        return;
      }
      setTabIndex(defaultIndex);
    },
    // eslint-disable-next-line
    [defaultIndex]
  );

  // Generate a unique identifier suffix for accessibility
  const uniqueIdSuffix = useId('tabs-');

  return (
    <React.Fragment>
      <MuiTabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        aria-label={ariaLabel}
        variant="scrollable"
        centered={false}
        scrollButtons="auto"
        className={props.className}
        {...tabProps}
      >
        {tabs.map(({ label }, i) => (
          <MuiTab
            key={i}
            label={label}
            className={tabs?.length > 7 ? classes.tab : ''}
            id={`full-width-tab-${i}-${ariaLabel.replace(' ', '')}-${uniqueIdSuffix}`}
            aria-controls={`full-width-tabpanel-${i}-${ariaLabel.replace(
              ' ',
              ''
            )}-${uniqueIdSuffix}`}
          />
        ))}
      </MuiTabs>
      {tabs.map(({ component }, i) => (
        <TabPanel
          key={i}
          tabIndex={Number(tabIndex)}
          index={i}
          id={`full-width-tabpanel-${i}-${ariaLabel.replace(' ', '')}-${uniqueIdSuffix}`}
          labeledBy={`full-width-tab-${i}-${ariaLabel.replace(' ', '')}-${uniqueIdSuffix}`}
        >
          {component}
        </TabPanel>
      ))}
    </React.Fragment>
  );
}

/**
 * Props for the TabPanel component.
 */
interface TabPanelProps extends TypographyProps {
  /**
   * The index of the selected tab.
   */
  tabIndex: number;

  /**
   * The index of the tab panel.
   */
  index: number;

  /**
   * The ID of the tab panel.
   */
  id: string;

  /**
   * The ID of the element that labels the tab panel.
   */
  labeledBy: string;
}

/**
 * A panel that displays the content of a specific tab.
 */
export function TabPanel(props: TabPanelProps) {
  const { children, tabIndex, index, id, labeledBy } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={tabIndex !== index}
      id={id}
      aria-labelledby={labeledBy}
    >
      {children}
    </Typography>
  );
}
