import { AnyAction } from 'redux';
import configureStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';
import clusterActionSliceReducer, {
  CallbackAction,
  cancelClusterAction,
  CLUSTER_ACTION_GRACE_PERIOD,
  executeClusterAction,
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

  describe('executeClusterAction', () => {
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
      jest.advanceTimersByTime(CLUSTER_ACTION_GRACE_PERIOD);
    });

    it('should dispatch a cancelled action if is cancelled within grace period', async () => {
      const callback = jest.fn(() => Promise.resolve());
      const cancelCallback = jest.fn(() => Promise.resolve());

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
        cancelCallback: cancelCallback,
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

      expect(callback).not.toHaveBeenCalled();
      expect(cancelCallback).toHaveBeenCalled();
    });

    it('should dispatch an error action if the callback throws an error', async () => {
      const callback = jest.fn(() => {
        throw new Error('Something went wrong');
      });

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

      // error action is done
      const actions = store.getActions();
      expect(actions).toContainEqual(
        expect.objectContaining({
          type: updateClusterAction.type,
          payload: expect.objectContaining({
            message: 'Error',
          }),
        })
      );

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('updateClusterAction', () => {
    it('should remove an action from the state if only id is provided', () => {
      const actionKey = 'actionKey';
      // first add an action with something other than id, then remove it.
      const action = updateClusterAction({ id: actionKey, message: 'test' });
      const state1 = clusterActionSliceReducer(undefined, action);
      expect(state1[actionKey]).toBeDefined();

      // now remove it by only passing in the id.
      const action2 = updateClusterAction({ id: actionKey });
      const state = clusterActionSliceReducer(undefined, action2);
      expect(state[actionKey]).toBeUndefined();
    });
  });

  describe('cancelClusterAction', () => {
    it('should cancel an action', () => {
      const actionKey = 'actionKey';
      const action = updateClusterAction({ id: actionKey, message: 'test' });
      const state1 = clusterActionSliceReducer(undefined, action);
      expect(state1[actionKey]).toBeDefined();

      const action2 = cancelClusterAction(actionKey);
      const state = clusterActionSliceReducer(undefined, action2);
      expect(state[actionKey]).toBeUndefined();
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });
});
