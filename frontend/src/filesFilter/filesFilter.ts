import { walkSync } from '@nodelib/fs.walk';
import * as path from 'node:path';

interface Options {
  /**
   * A regex pattern to ignore files or directories.
   */
  ignore: RegExp | RegExp[];
}

/**
 * Synchronously matches files based on the provided regex pattern and options.
 *
 * @param regexPattern - The regex pattern to match files against.
 * @param options - An object containing options for the glob operation.
 * @param options.ignore - A regex pattern to ignore files or directories.
 * @returns An array of file paths that match the pattern and do not match the ignore pattern.
 */
export function sync(regexPattern: string, options: Options): string[] {
  const entries: string[] = [];
  const baseDir = path.resolve(__dirname);
  const filePattern = new RegExp(regexPattern);

  walkSync(baseDir, {
    entryFilter: entry => {
      const relativePath = path.relative(baseDir, entry.path);
      // Normalize path to handle windows paths.
      const normalizedPath = relativePath.replace(/\\/g, '/');
      const fileTest = filePattern.test(normalizedPath);
      const ignoreTest = Array.isArray(options.ignore)
        ? options.ignore.some(ignore => ignore.test(normalizedPath))
        : options.ignore.test(normalizedPath);

      return fileTest && !ignoreTest;
    },
    errorFilter: error => {
      console.error(error);
      return false;
    },
  }).forEach(entry => entries.push(entry.path));

  return entries;
}
