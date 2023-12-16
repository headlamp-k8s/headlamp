import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { get, set } from 'lodash';
import { KubeObject } from '../../lib/k8s/cluster';
import { DetailsViewSectionType } from './DetailsViewSection';

export type DetailsViewSection = {
  id: string;
  section?: DetailsViewSectionType;
};

export enum DefaultDetailsViewSection {
  METADATA = 'METADATA',
  BACK_LINK = 'BACK_LINK',
  MAIN_HEADER = 'MAIN_HEADER',
  EVENTS = 'EVENTS',
  ERROR = 'ERROR',
  LOADING = 'LOADING',
  CHILDREN = 'CHILDREN',
}

type HeaderActionFuncType = (
  resource: KubeObject | null,
  sections: DetailsViewSection[]
) => DetailsViewSection[];

export type DetailsViewsSectionProcessor = {
  id: string;
  processor: HeaderActionFuncType;
};

export type DetailsViewSectionProcessorArgs = { actions: DetailsViewSection[] };
export type DetailsViewSectionProcessorType = (
  info: DetailsViewSectionProcessorArgs
) => DetailsViewSection[];
export type DetailsViewSectionsProcessor = {
  id: string;
  processor: DetailsViewSectionProcessorType;
};

/**
 * Normalizes a header actions processor by ensuring it has an 'id' and a processor function.
 *
 * If the processor is passed as a function, it will be wrapped in an object with a generated ID.
 *
 * @param action - The payload action containing the header actions processor.
 * @returns The normalized header actions processor.
 */
function _normalizeProcessor<Processor, ProcessorProcessor>(
  action: PayloadAction<Processor | ProcessorProcessor>
) {
  let defailsViewSectionsProcessor: Processor = action.payload as Processor;
  if (
    get(defailsViewSectionsProcessor, 'id') === undefined &&
    typeof defailsViewSectionsProcessor === 'function'
  ) {
    const headerActionsProcessor2: unknown = {
      id: '',
      processor: defailsViewSectionsProcessor,
    };
    defailsViewSectionsProcessor = headerActionsProcessor2 as Processor;
  }
  set(
    defailsViewSectionsProcessor as Object,
    'id',
    get(defailsViewSectionsProcessor, 'id') || `generated-id-${Date.now().toString(36)}`
  );
  return defailsViewSectionsProcessor;
}

export interface DetailsViewSectionState {
  /**
   * List of details views.
   */
  detailViews: DetailsViewSectionType[];
  /**
   * List of details view sections.
   */
  detailsViewSections: DetailsViewSection[];
  /**
   * List of details view sections processors.
   */
  detailsViewSectionsProcessors: DetailsViewsSectionProcessor[];
}

const initialState: DetailsViewSectionState = {
  detailViews: [],
  detailsViewSections: [],
  detailsViewSectionsProcessors: [],
};

const detailsViewSectionSlice = createSlice({
  name: 'detailsViewSection',
  initialState,
  reducers: {
    /**
     * Sets details view.
     */
    setDetailsView(state, action: PayloadAction<DetailsViewSectionType>) {
      state.detailViews.push(action.payload);
    },

    /**
     * Sets details view section.
     *
     * If the processor is passed as a function, it will be wrapped in an object with a generated ID.
     */
    setDetailsViewSection(
      state,
      action: PayloadAction<DetailsViewSectionType | DetailsViewSection>
    ) {
      let section = action.payload as DetailsViewSection;
      if (section.id === undefined) {
        if (section.section === undefined) {
          section = { id: '', section: section };
        } else {
          section = { id: '', section: section.section };
        }
      }
      section.id = section.id || `generated-id-${Date.now().toString(36)}`;

      state.detailsViewSections.push(section);
    },

    /**
     * Adds a details view sections processor.
     *
     * If the processor is passed as a function, it will be wrapped in an object with a generated ID.
     */
    addDetailsViewSectionsProcessor(
      state,
      action: PayloadAction<
        DetailsViewsSectionProcessor | DetailsViewsSectionProcessor['processor']
      >
    ) {
      state.detailsViewSectionsProcessors.push(
        _normalizeProcessor<
          DetailsViewsSectionProcessor,
          DetailsViewsSectionProcessor['processor']
        >(action)
      );
    },
  },
});

export const { addDetailsViewSectionsProcessor, setDetailsView, setDetailsViewSection } =
  detailsViewSectionSlice.actions;
export { detailsViewSectionSlice };
export default detailsViewSectionSlice.reducer;
