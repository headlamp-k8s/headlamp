import { error } from 'console';
import fs from 'fs';
import glob from 'glob';
import mdiIcons from './icons';

// the usedIcons array is used to check that all icons are used in the frontend
// we take the keys from the mdiIcons and add the prefix to it as a string
const usedIcons = Object.keys(mdiIcons.icons).map(icon => `${mdiIcons.prefix}:${icon}`);
const usedAliases = Object.keys(mdiIcons.aliases).map(alias => `${mdiIcons.prefix}:${alias}`);

const checkIcons = async () => {
  const files = glob.sync('./**/*.tsx', { ignore: './node_modules/**' });

  const unusedIcons = [];

  for (const file of files) {
    const content = await fs.readFileSync(file, 'utf8');
    // this will find all matches of a word starting with 'mdi:' and includes a dash
    const regex = /mdi:[\w-]+/g;

    let match: any;
    while ((match = regex.exec(content)) !== null) {
      if (!usedIcons.includes(match[0]) && !usedAliases.includes(match[0])) {
        unusedIcons.push({
          icon: match[0],
          file,
        });
      }
    }
  }

  for (let i = 0; i < unusedIcons.length; i++) {
    error(
      `Icon ${unusedIcons[i].icon} from file ${unusedIcons[i].file} is not cached for offline use `
    );
  }

  return unusedIcons.length === 0;
};

describe('Icon tests', () => {
  test('Check icon', async () => {
    const result = await checkIcons();
    expect(result).toBe(true);
  });
});
