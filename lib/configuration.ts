import safeRequire from 'safe-require';
import chalk from 'chalk';
import Ajv from 'ajv';

const customIconsConfig = safeRequire('../../../../icons.json');
const defaultIconsConfig = require('./icons.json');
const schema = require('./schema.json');
const ajv = new Ajv();
const validate = ajv.compile(schema);

export function getConfigurationFile() {
  if (customIconsConfig) {
    const valid = validate(customIconsConfig);

    if (valid) {
      console.log(
        chalk.green(
          "PWA Webpack Plugin: './icons.json' is used to generate your icons."
        )
      );
      return customIconsConfig;
    } else {
      console.log(
        chalk.yellowBright(
          "PWA Webpack Plugin: './icons.json' has an invalid json schema, the default configuration has been used instead. See https://github.com/mxjoly/pwa-webpack-plugin#configuration to get more informations."
        )
      );
      console.log(validate.errors);
      return defaultIconsConfig;
    }
  } else {
    return defaultIconsConfig;
  }
}
