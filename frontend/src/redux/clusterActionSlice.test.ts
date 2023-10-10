import { AnyAction } from 'redux';
import configureStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';
import clusterActionSliceReducer, {
  CallbackAction,
  cancelClusterAction,
  CLUSTER_ACTION_GRACE_PERIOD,
  executeClusterAction,
  // initialState,
  updateClusterAction,
} from './clusterActionSlice';
import { RootState } from './stores/store';

const middlewares = [thunk];

type DispatchType = ThunkDispatch<RootState, undefined, AnyAction>;
const mockStore = configureStore<RootState, DispatchType>(middlewares);

jest.setTimeout(10000);

describe('clusterActionSlice', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    // Reset the store after each test
    store = mockStore();
  });

  it('should execute cluster action', async () => {
    const callback = jest.fn(() => Promise.resolve());

    const action: CallbackAction = {
      callback,
      startMessage: 'Starting',
      successMessage: 'Success',
      errorMessage: 'Error',
      cancelledMessage: 'Cancelled',
      startOptions: {},
      successOptions: { variant: 'success' },
      errorOptions: { variant: 'error' },
      cancelledOptions: {},
    };

    jest.useFakeTimers();
    const dispatchedAction = store.dispatch(executeClusterAction(action));
    jest.advanceTimersByTime(CLUSTER_ACTION_GRACE_PERIOD);
    await dispatchedAction;
    const actions = store.getActions();
    expect(actions[0].type).toBe('clusterAction/execute/pending');
    expect(callback).toHaveBeenCalledTimes(1);

    // sucess action is done
    expect(actions).toContainEqual(
      expect.objectContaining({
        type: updateClusterAction.type,
        payload: expect.objectContaining({
          message: 'Success',
        }),
      })
    );
  });

  it('should dispatch a cancelled action if is cancelled within grace period', async () => {
    const callback = jest.fn(() => Promise.resolve());

    const action: CallbackAction = {
      callback,
      startMessage: 'Starting',
      successMessage: 'Success',
      errorMessage: 'Error',
      cancelledMessage: 'Cancelled',
      startOptions: {},
      successOptions: { variant: 'success' },
      errorOptions: { variant: 'error' },
      cancelledOptions: {},
    };

    jest.useFakeTimers();
    const dispatchedAction = store.dispatch(executeClusterAction(action));

    jest.advanceTimersByTime(CLUSTER_ACTION_GRACE_PERIOD / 2);

    const actionKey = store.getActions().find(action => action.payload?.id !== undefined)
      ?.payload?.id;

    clusterActionSliceReducer(undefined, cancelClusterAction(actionKey));
    await dispatchedAction;

    // cancelled action is done
    const actions = store.getActions();
    expect(actions).toContainEqual(
      expect.objectContaining({
        type: updateClusterAction.type,
        payload: expect.objectContaining({
          message: 'Cancelled',
        }),
      })
    );

    // The callback wasn't called.
    expect(callback).not.toHaveBeenCalled();
  });

  afterEach(() => {
    jest.useRealTimers();
  });
});
