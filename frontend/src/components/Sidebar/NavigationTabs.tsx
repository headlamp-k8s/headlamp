import { Divider } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { generatePath, useHistory } from 'react-router';
import { createRouteURL } from '../../lib/router';
import { getCluster, getClusterPrefixedPath } from '../../lib/util';
import { useTypedSelector } from '../../redux/reducers/reducers';
import Tabs from '../common/Tabs';
import { SidebarItemProps } from '../Sidebar';
import prepareRoutes from './prepareRoutes';

const useStyle = makeStyles(() => ({
  tabs: {
    maxWidth: '85vw',
  },
}));

function searchNameInSubList(sublist: SidebarItemProps['subList'], name: string): boolean {
  if (!sublist) {
    return false;
  }
  for (let i = 0; i < sublist.length; i++) {
    if (sublist[i].name === name) {
      return true;
    }
  }
  return false;
}

function findParentOfSubList(
  list: SidebarItemProps[],
  name: string | null
): SidebarItemProps | null {
  if (!name) {
    return null;
  }

  let parent = null;
  for (let i = 0; i < list.length; i++) {
    if (searchNameInSubList(list[i].subList, name)) {
      parent = list[i];
    }
  }
  return parent;
}

export default function NavigationTabs() {
  const history = useHistory();
  const classes = useStyle();
  const sidebar = useTypedSelector(state => state.ui.sidebar);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isSmallSideBar = useMediaQuery(theme.breakpoints.only('sm'));
  const { t } = useTranslation();

  // Always show the navigation tabs when the sidebar is the small version
  if (!isSmallSideBar && (sidebar.isSidebarOpen || isMobile)) {
    return null;
  }

  let defaultIndex = null;
  const listItems = prepareRoutes(t);
  let navigationItem = listItems.find(item => item.name === sidebar.selected);
  if (!navigationItem) {
    const parent = findParentOfSubList(listItems, sidebar.selected);
    if (!parent) {
      return null;
    }
    navigationItem = parent;
  }

  const subList = navigationItem.subList;
  if (!subList) {
    return null;
  }

  function tabChangeHandler(index: number) {
    if (!subList) {
      return;
    }
    let pathname;

    const url = subList[index].url;
    if (url) {
      pathname = generatePath(getClusterPrefixedPath(url), { cluster: getCluster()! });
    } else {
      pathname = createRouteURL(subList[index].name);
    }
    history.push({ pathname });
  }

  if (createRouteURL(navigationItem.name)) {
    subList.unshift(navigationItem);
  }

  const tabRoutes = subList.map((item: any) => {
    return { label: item.label, component: <></> };
  });

  defaultIndex = subList.findIndex(item => item.name === sidebar.selected);
  return (
    <Box mb={2} component="nav">
      <Tabs
        tabs={tabRoutes}
        onTabChanged={index => {
          tabChangeHandler(index);
        }}
        defaultIndex={defaultIndex}
        className={classes.tabs}
      />
      <Divider />
    </Box>
  );
}
