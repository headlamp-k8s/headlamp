import { TestContext } from '../../test';
import { GlobalSearch } from './GlobalSearch';

export default {
  title: 'GlobalSearch',
  component: GlobalSearch,
  argTypes: {},
  parameters: {},
};

export const BasicExample = () => (
  <TestContext>
    <GlobalSearch />
  </TestContext>
);
BasicExample.args = {};
