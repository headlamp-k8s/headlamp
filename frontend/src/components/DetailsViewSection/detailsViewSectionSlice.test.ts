import { configureStore } from '@reduxjs/toolkit';
import detailsViewSectionReducer, {
  addDetailsViewSectionsProcessor,
  DefaultDetailsViewSection,
  DetailsViewSection,
  DetailsViewSectionProcessorType,
  DetailsViewsSectionProcessor,
  setDetailsView,
  setDetailsViewSection,
} from './detailsViewSectionSlice';

describe('detailsViewSectionSlice', () => {
  let store = configureStore({
    reducer: {
      detailsViewSection: detailsViewSectionReducer,
    },
  });

  beforeEach(() => {
    store = configureStore({
      reducer: {
        detailsViewSection: detailsViewSectionReducer,
      },
    });
  });

  describe('setDetailsView', () => {
    it('should add a new details view', () => {
      store.dispatch(setDetailsView(DefaultDetailsViewSection.METADATA));
      expect(store.getState().detailsViewSection.detailViews).toEqual([
        DefaultDetailsViewSection.METADATA,
      ]);
    });
  });

  describe('setDetailsViewSection', () => {
    it('should generate an ID if not provided and payload is a section type', () => {
      const section = DefaultDetailsViewSection.METADATA;
      store.dispatch(setDetailsViewSection(section));
      const savedSection = store.getState().detailsViewSection.detailsViewSections[0];
      expect(savedSection.id).toMatch(/^generated-id-/);
      expect(savedSection.section).toEqual(DefaultDetailsViewSection.METADATA);
    });

    it('should generate an ID if not provided and payload is an object with a section', () => {
      // @ts-ignore because we are testing the case where id is missing.
      const section: DetailsViewSection = { section: DefaultDetailsViewSection.METADATA };
      store.dispatch(setDetailsViewSection(section));
      const savedSection = store.getState().detailsViewSection.detailsViewSections[0];
      expect(savedSection.id).toMatch(/^generated-id-/);
      expect(savedSection.section).toEqual(DefaultDetailsViewSection.METADATA);
    });

    it('should not generate an ID if it is already provided', () => {
      const section: DetailsViewSection = {
        id: 'test-id',
        section: DefaultDetailsViewSection.METADATA,
      };
      store.dispatch(setDetailsViewSection(section));
      const savedSection = store.getState().detailsViewSection.detailsViewSections[0];
      expect(savedSection.id).toEqual('test-id');
      expect(savedSection.section).toEqual(DefaultDetailsViewSection.METADATA);
    });
  });

  describe('addDetailsViewSectionsProcessor', () => {
    it('should add a new details view sections processor when provided as an object', () => {
      const processor: DetailsViewsSectionProcessor = {
        id: 'test-processor',
        processor: info => info.actions,
      };
      store.dispatch(addDetailsViewSectionsProcessor(processor));
      expect(store.getState().detailsViewSection.detailsViewSectionsProcessors).toEqual([
        processor,
      ]);
    });

    it('should add a new details view sections processor when provided as a function', () => {
      const processorFunc: DetailsViewSectionProcessorType = info => info.actions;
      store.dispatch(addDetailsViewSectionsProcessor(processorFunc));
      const processors = store.getState().detailsViewSection.detailsViewSectionsProcessors;
      expect(processors).toHaveLength(1);
      expect(processors[0].processor).toBe(processorFunc);
      expect(processors[0].id).toMatch(/^generated-id-/);
    });
  });
});
