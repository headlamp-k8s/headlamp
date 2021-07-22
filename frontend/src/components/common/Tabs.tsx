import MuiTab from '@material-ui/core/Tab';
import MuiTabs from '@material-ui/core/Tabs';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';

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

export interface TabsProps {
  tabs: Tab[];
  tabProps?: {
    [propName: string]: any;
  };
  defaultIndex?: number | null | boolean;
  onTabChanged?: (tabIndex: number) => void;
}

export default function Tabs(props: TabsProps) {
  const { tabs, tabProps = {}, defaultIndex = 0, onTabChanged = null } = props;
  const [tabIndex, setTabIndex] = React.useState<TabsProps['defaultIndex']>(
    defaultIndex && Math.min(defaultIndex as number, 0)
  );
  const { t } = useTranslation('glossary');

  function handleTabChange(event: any, newValue: number) {
    setTabIndex(newValue);

    if (onTabChanged !== null) {
      onTabChanged(newValue);
    }
  }

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

  return (
    <React.Fragment>
      <MuiTabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        aria-label={t('tabs')}
        variant="scrollable"
        scrollButtons="auto"
        {...tabProps}
      >
        {tabs.map(({ label }, i) => (
          <MuiTab key={i} label={label} {...a11yProps(i)} />
        ))}
      </MuiTabs>
      {tabs.map(({ component }, i) => (
        <TabPanel key={i} tabIndex={Number(tabIndex)} index={i}>
          {component}
        </TabPanel>
      ))}
    </React.Fragment>
  );
}

interface TabPanelProps extends TypographyProps {
  tabIndex: number;
  index: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, tabIndex, index } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={tabIndex !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
    >
      {children}
    </Typography>
  );
}
