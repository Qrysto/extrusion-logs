import fs from 'node:fs';
import path from 'node:path';
import extractFromFiles from './intlExtract';

const transDir = path.join(__dirname, '../src/lib/intl');

const locales = ['vi', 'kr'];

/**
 * Load old strings
 * =============================================================================
 */
const oldDicts = {};
locales.forEach((locale) => {
  const json = fs.readFileSync(path.join(transDir, locale + '.json'));
  const oldDict = JSON.parse(json);
  oldDicts[locale] = oldDict;
});
const oldViDict = oldDicts['vi'];

/**
 * Extract new strings
 * =============================================================================
 */
const keys = extractFromFiles([
  'src/**/*.js',
  'src/**/*.jsx',
  'src/**/*.ts',
  'src/**/*.tsx',
]);
// const newEnDict = {};
// keys.forEach(({ key, context }) => {
//   if (!newEnDict[context]) {
//     newEnDict[context] = {};
//   }
//   newEnDict[context][key] = key;
// });

/**
 * Calculate diff
 * =============================================================================
 */
const newTranslations = [];
keys.forEach((text) => {
  if (typeof oldViDict[text] !== 'string') {
    newTranslations.push(text);
  }
});

const obsoleteTranslations = [];
Object.keys(oldViDict).forEach((oldString) => {
  if (!keys.includes(oldString)) {
    obsoleteTranslations.push(oldString);
  }
});

const newDicts = {};
Object.entries(oldDicts).forEach(([locale, oldDict]) => {
  if (locale === 'en') return;
  const newDict = {};
  keys.forEach((newString) => {
    // if (!newDict[context]) {
    //   newDict[context] = {};
    // }
    newDict[newString] = oldDict[newString] || '';
  });
  newDicts[locale] = newDict;
});

/**
 * Report to console
 * =============================================================================
 */
console.log(`${obsoleteTranslations.length} obsolete string(s):\n`);
obsoleteTranslations.forEach((string) => console.log(string));
console.log('\n');
console.log(`${newTranslations.length} new string(s):\n`);
newTranslations.forEach((string) => console.log(string));

/**
 * Write changes to files
 * =============================================================================
 */
// Object.entries(newDicts).forEach(([locale, newDict]) => {
//   fs.writeFileSync(
//     path.join(transDir, locale + '.json'),
//     JSON.stringify(newDict, null, 2)
//   );
// });

Object.entries(newDicts).forEach(([locale, newDict]) => {
  // const lines = [];
  // Object.entries(newDict).forEach(([context, newStrings]) => {
  fs.writeFileSync(
    path.join(transDir, locale + '.json'),
    JSON.stringify(newDict, null, 2)
  );
  // Object.entries(newStrings).forEach(([keyString, translation]) => {
  //   lines.push([keyString, translation, context]);
  // });
  // });
  // stringify(lines, (err, output) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     fs.writeFileSync(path.join(transDir, locale + '.csv'), output);
  //   }
  // });
});

console.log('\nTranslation files updated!');
