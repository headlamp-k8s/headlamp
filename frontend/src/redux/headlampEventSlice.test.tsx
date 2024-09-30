import { configureStore } from '@reduxjs/toolkit';
import eventCallbackReducer, { addEventCallback, eventAction } from './headlampEventSlice';
import { listenerMiddleware } from './headlampEventSlice';

function getStore() {
  return configureStore({
    reducer: {
      eventCallbackReducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).prepend(listenerMiddleware.middleware),
  });
}

describe('eventsSlice', () => {
  let store = getStore();

  beforeEach(() => {
    store = getStore();
  });

  describe('addEventCallback', () => {
    it('should add a new event callback', () => {
      const eventCallback = () => {};
      store.dispatch(addEventCallback(eventCallback));

      const storedCb = store.getState().eventCallbackReducer.trackerFuncs[0];
      expect(storedCb).toEqual(eventCallback);
    });

    it('should run event callback', () => {
      const eventCallback = vi.fn(async () => {});
      store.dispatch(addEventCallback(eventCallback));

      store.dispatch(
        eventAction({
          type: 'test',
          data: {},
        })
      );

      expect(eventCallback).toHaveBeenCalled();
    });

    it('should run multiple event callbacks sequentially', () => {
      const callbackResponses: number[] = [];
      const eventCallback = vi.fn(async () => {
        callbackResponses.push(0);
      });
      store.dispatch(addEventCallback(eventCallback));

      const eventCallback1 = vi.fn(async () => {
        callbackResponses.push(1);
      });
      store.dispatch(addEventCallback(eventCallback1));

      store.dispatch(
        eventAction({
          type: 'test',
          data: {},
        })
      );

      expect(callbackResponses).toEqual([0, 1]);
    });
  });
});
