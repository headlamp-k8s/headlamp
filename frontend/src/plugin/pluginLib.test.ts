import './index'; // this import will init window.pluginLib
import { describe, expect, it } from 'vitest';

describe('pluginLib variable', () => {
  it('should stay the same for plugin compatibility', async () => {
    await expect(window.pluginLib).toMatchFileSnapshot('__snapshots__/pluginLib.snapshot');
  });
});
