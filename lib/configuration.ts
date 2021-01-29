import safeRequire from 'safe-require';
import jsonschema from 'json-schema';
import chalk from 'chalk';

const customIconsConfig = safeRequire('../../../../icons.json');
const defaultIconsConfig = require('./icons.json');

export function getConfigurationFile() {
  if (customIconsConfig) {
    const { valid } = jsonschema.validate(
      customIconsConfig,
      require('./schema.json')
    );

    if (valid) {
      console.log(
        chalk.green(
          'PWA Webpack Plugin: icons.json file has been detected to generate the icons.'
        )
      );
      return customIconsConfig;
    } else {
      console.log(
        chalk.yellowBright(
          'PWA Webpack Plugin: icons.json has an invalid json schema, the default configuration has been used instead. See https://github.com/mxjoly/pwa-webpack-plugin#configuration to get more informations.'
        )
      );
      return defaultIconsConfig;
    }
  } else {
    return defaultIconsConfig;
  }
}
