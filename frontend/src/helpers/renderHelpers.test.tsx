import { MuiThemeProvider } from '@material-ui/core/styles';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { theme } from '../components/TestHelpers/theme';
import uiReducer, { UIState } from '../redux/reducers/ui';
import DetailsViewPluginRenderer from './renderHelpers';

function NodeDummyComponent(props: { resource: any }) {
  const { resource } = props;
  return <div>I am a dummy detail view {resource.kind} component</div>;
}
describe('renders a detail view present in store', () => {
  const sectionTitle = 'Plugin Appended Details View';
  const initialState: UIState = {
    sidebar: {
      selected: null,
      isVisible: false,
      entries: {},
    },
    routes: {
      // path -> component
    },
    views: {
      details: {
        headerActions: {
          // action-name -> action-callback
        },
        pluginAppendedDetailViews: [
          {
            sectionName: 'dummy details view',
            sectionFunc: (resource: any) => {
              if (resource.kind === 'Node') {
                return {
                  title: sectionTitle,
                  component: props => <NodeDummyComponent {...props} />,
                };
              }
              return null;
            },
          },
        ],
      },
      appBar: {
        actions: {
          // action-name -> action-callback
        },
      },
    },
    theme: {
      name: '',
    },
  };
  const mockStore = createStore(
    combineReducers({
      ui: uiReducer,
    }),
    { ui: initialState }
  );
  it('should correctly render a detail view', () => {
    render(
      <Provider store={mockStore}>
        <MuiThemeProvider theme={theme}>
          <DetailsViewPluginRenderer resource={{ kind: 'Node' }} />
        </MuiThemeProvider>
      </Provider>
    );
    expect(screen.getByText(sectionTitle)).toBeInTheDocument();
    expect(screen.getByText('I am a dummy detail view Node component')).toBeInTheDocument();
  });

  it('should not render any details view when a desired resource is not passed', () => {
    render(
      <Provider store={mockStore}>
        <MuiThemeProvider theme={theme}>
          <DetailsViewPluginRenderer resource={{ kind: 'ConfigMap' }} />
        </MuiThemeProvider>
      </Provider>
    );
    expect(screen.queryByText(sectionTitle)).not.toBeInTheDocument();
  });
});
