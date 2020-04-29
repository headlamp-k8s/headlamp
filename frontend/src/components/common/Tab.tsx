import Tab from '@material-ui/core/Tab';
import MuiTabs from '@material-ui/core/Tabs';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import React from 'react';

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export interface Tab {
  label: string;
  component: JSX.Element | JSX.Element[];
}

interface TabsProps {
  tabs: Tab[];
  tabProps?: {
    [propName: string]: any;
  };
  onTabChanged?: (tabIndex: number) => void;
}

export default function Tabs(props: TabsProps) {
  const {tabs, tabProps = {}, onTabChanged = null} = props;
  const [tabIndex, setTabIndex] = React.useState(0);

  function handleTabChange(event: any, newValue: number) {
    setTabIndex(newValue);

    if (onTabChanged !== null) {
      onTabChanged(newValue);
    }
  };

  return (
    <React.Fragment>
      <MuiTabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        aria-label="full width tabs example"
        {...tabProps}
      >
        {tabs.map(({label}, i) =>
          <Tab
            key={i}
            label={label}
            {...a11yProps(i)}
          />
        )}
      </MuiTabs>
      {tabs.map(({component}, i) =>
        <TabPanel
          key={i}
          tabIndex={tabIndex}
          index={i}
        >
          {component}
        </TabPanel>
      )}
    </React.Fragment>
  );
}

interface TabPanelProps extends TypographyProps {
  tabIndex: number;
  index: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, tabIndex, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={tabIndex !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {children}
    </Typography>
  );
}
