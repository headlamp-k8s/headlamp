import * as fs from 'fs';
import * as path from 'path';

const directoryPath = path.join(__dirname, './locales/');
const currentLocales: string[] = [];

fs.readdirSync(directoryPath).forEach(file => currentLocales.push(file));

export { currentLocales as CURRENT_LOCALES };
export { directoryPath as LOCALES_DIR };
