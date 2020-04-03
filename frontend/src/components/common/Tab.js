import Tab from '@material-ui/core/Tab';
import MuiTabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import React from 'react';

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function Tabs(props) {
  const {tabs, tabProps = {}, onTabChanged = null} = props;
  const [tabIndex, setTabIndex] = React.useState(0);

  function handleTabChange(event, newValue) {
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

export function TabPanel(props) {
  const { label, children, tabIndex, index, ...other } = props;

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
