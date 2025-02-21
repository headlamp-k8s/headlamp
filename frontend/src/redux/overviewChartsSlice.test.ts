import overviewChartsReducer, {
  addOverviewChartsProcessor,
  OverviewChartsProcessor,
} from './overviewChartsSlice';
import { OverviewChart } from './overviewChartsSlice';

describe('overviewChartsSlice', () => {
  const initialState = {
    processors: [],
  };

  it('should handle initial state', () => {
    expect(overviewChartsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should add a processor to the state', () => {
    const processor: OverviewChartsProcessor = {
      id: 'testProcessor',
      processor: (charts: OverviewChart[]) => charts,
    };

    const nextState = overviewChartsReducer(initialState, addOverviewChartsProcessor(processor));

    expect(nextState.processors).toEqual([processor]);
  });

  it('should add multiple processors to the state', () => {
    const processor1: OverviewChartsProcessor = {
      id: 'testProcessor1',
      processor: (charts: OverviewChart[]) => charts,
    };

    const processor2: OverviewChartsProcessor = {
      id: 'testProcessor2',
      processor: (charts: OverviewChart[]) => charts,
    };

    let nextState = overviewChartsReducer(initialState, addOverviewChartsProcessor(processor1));
    nextState = overviewChartsReducer(nextState, addOverviewChartsProcessor(processor2));

    expect(nextState.processors).toEqual([processor1, processor2]);
  });

  it('should not modify the original state', () => {
    const processor: OverviewChartsProcessor = {
      id: 'testProcessor',
      processor: (charts: OverviewChart[]) => charts,
    };

    overviewChartsReducer(initialState, addOverviewChartsProcessor(processor));

    expect(initialState.processors).toEqual([]);
  });
});
