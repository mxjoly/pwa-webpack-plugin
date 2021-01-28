[![License](https://img.shields.io/github/license/mxjoly/pwa-webpack-plugin.svg)](https://github.com/mxjoly/pwa-webpack-plugin)
[![devDependency Status](https://img.shields.io/david/dev/mxjoly/pwa-webpack-plugin.svg)](https://david-dm.org/mxjoly/pwa-webpack-plugin#info=devDependencies)

# PWA Webpack Plugin

## Summary

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [Options](#options)
- [Configuration](#configuration)
- [Metada](#metadata)
- [License](#license)

## Installation

`npm install @mxjoly/pwa-webpack-plugin --save-dev`

This package must be used with [html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin) and [webpack-manifest-plugin](https://www.npmjs.com/package/webpack-manifest-plugin) :

`npm install html-webpack-plugin webpack-manifest-plugin --save-dev`

## Features

This plugin:

- Generates all icons and splash screens for your application to be supported with all platforms (android, safari, apple, coast, windows)
- Creates the `manifest.json`
- Creates the `browserconfig.xml`
- Generates and injects the metadata to the html template file (with [html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin))

## Usage

1. Create a configuration file at the root of your project with the options for your manifest file:

**app.json**

```
{
  "lang": "en",
  "dir": "auto",
  "name": "Progressive Web App",
  "short_name": "PWA",
  "description": "This is a progressive web application",
  "scope": "/",
  "start_url": "/?utm_source=homescreen",
  "display": "standalone",
  "orientation": "any",
  "theme_color": "#323232",
  "background_color": "#ffffff"
}
```

2. Add the plugin to the webpack config file:

**webpack.config.js**

```javascript
const fs = require('fs');
const HtmlPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const PWAPlugin = require('@mxjoly/pwa-webpack-plugin');

const appDirectory = fs.realpathSync(process.cwd());
const faviconPath = path.resolve(appDirectory, 'src/favicon.svg');
const manifestOptions = require('./app.json');

module.exports = {
  plugins: [
    new HtmlPlugin({
      publicPath: '/',
    }),
    new PWAPlugin({
      publicPath: '/',
      emitMetadata: true,
      manifest: {
        options: manifestOptions,
      },
      icons: {
        favicon: faviconPath,
        outputPath: 'assets/icons',
        backgroundColor: '#ffffff',
        themeColor: '#ffffff',
        use: {
          favicons: true,
          android: true,
          apple: true,
          appleStartup: true,
          windows: true,
          safari: true,
          coast: true,
        },
      },
    }),
    new ManifestPlugin({
      fileName: 'assets-manifest.json',
      publicPath: '/',
    }),
  ],
};
```

## Icons configuration

You can import the icons configuration used by the plugin.

```javascript
const { defaultIconsConfig } = require('@mxjoly/pwa-webpack-plugin');
```

## Options

### publicPath

The publicPath used for script and link tags. By default `"/"`.

### emitMetadata

Used to inject the metadata in your html template file. By default `true`.

### manifest

#### filename

The filename of your manifest file. By default `"manifest.json"`.

#### outputPath

The output path for your manifest file from the public path. By default `"/"`.

#### options

An object with the options to use for your manifest file:

| Key                | Default                   | Description                                                                       |
| ------------------ | ------------------------- | --------------------------------------------------------------------------------- |
| `name`             | `null`                    | Your application's name.                                                          |
| `short_name`       | `null`                    | Your application's short_name.                                                    |
| `description`      | `null`                    | Your application's description.                                                   |
| `lang`             | `en`                      | Primary language for name and short_name                                          |
| `dir`              | `auto`                    | The base direction in which to display direction-capable members of the manifest. |
| `background_color` | `#ffffff`                 | Background colour for flattened icons.                                            |
| `theme_color`      | `#ffffff`                 | Theme color user for example in Android's task switcher.                          |
| `display`          | `standalone`              | Display mode: `fullscreen`, `standalone`, `minimal-ui` or `browser`.              |
| `scope`            | `/`                       | set of URLs that the browser considers within your app                            |
| `start_url`        | `/?utm_source=homescreen` | Start URL when launching the application from a device.                           |
| `orientation`      | `any`                     | The orientation to use                                                            |

You can add more properties. For more informations see https://developer.mozilla.org/en-US/docs/Web/Manifest.

### icons

The icons options allows you to control which icons will be generated during the webpack compilation.

#### favicon

The resolve path to your favicon. This favicon must have an svg format to generate the other icons.

#### outputPath

The ouput path of the icons from the public path. By default `"/assets/icons"`.

#### backgroundColor

The background color used for the splash icons. By default `"#ffffff"`.

#### themeColor

The theme color for your common icons. By default `"#ffffff"`.

#### use

An object with the icon types to generate:

| Key            | Default | Description                                                    |
| -------------- | ------- | -------------------------------------------------------------- |
| `favicons`     | `true`  | The default favicons with sizes 16x16, 32x32, 48x48 and 96x96. |
| `android`      | `true`  | The chrome icons specified in the `manifest.json`.             |
| `apple`        | `true`  | The apple touch icons.                                         |
| `appleStartup` | `true`  | The apple icons used for the splash screen.                    |
| `windows`      | `true`  | The msapplication tiles for `browserconfig.xml`.               |
| `safari`       | `true`  | The mask icon used with safari.                                |
| `coast`        | `true`  | The specific icons used in coast.                              |

## Configuration

You can configure the icons that will be generated by creating `icons.json` at the root of your project with the following schema:

```json
{
  "favicons": {
    "favicon-16x16.png": {
      "width": 16,
      "height": 16,
      "rel": "icon",
      "type": "image/png",
      "transparent": true,
      "mask": false,
      "shadow": false,
      "emitTag": true
    }
  },
  "appleStartup": {
    "iphone5-splash.png": {
      "dwidth": 320,
      "dheight": 568,
      "ratio": 2,
      "rel": "apple-touch-startup-image",
      "type": "image/png",
      "transparent": false,
      "mask": false,
      "shadow": false,
      "emitTag": true
    }
  },
  "apple": {},
  "android": {},
  "windows": {},
  "safari": {},
  "coast": {}
}
```

Add some keys (name of the file that will be generated) to the categories to generate new icons. These keys must have as values an object with the following properties (some properties can only be used with certain categories):

| Properties    | Type       | Categorie                 | Description                                      |
| ------------- | ---------- | ------------------------- | ------------------------------------------------ |
| `width`       | `number`   | all except `appleStartup` | The width of the icon.                           |
| `height`      | `number`   | all except `appleStartup` | The height of the icon.                          |
| `dwidth`      | `number`   | only `appleStartup`       | The screen width of the device.                  |
| `dheight`     | `number`   | only `appleStartup`       | The screen height of the device.                 |
| `ratio`       | `number`   | only `appleStartup`       | The pixel ratio of the screen.                   |
| `rel`         | `string`   | all                       | The value of the rel attribute for the html tag. |
| `type`        | `mimetype` | all                       | The mime type for the output image.              |
| `transparent` | `boolean`  | all                       | Set the bakcground transparent.                  |
| `mask`        | `boolean`  | all                       | To get a mask icon.                              |
| `shadow`      | `boolean`  | all                       | Use shadow for the icon.                         |
| `emitTag`     | `boolean`  | all                       | Emit the tag to the html header.                 |

## Metadata

The generated metadata are the following tags:

```html
<link rel="manifest" href="/manifest.json" />
<meta name="msapplication-config" href="/browserconfig.xml" />
<link
  rel="icon"
  type="image/png"
  href="/assets/icons/favicon-16x16.png"
  sizes="16x16"
/>
<link
  rel="icon"
  type="image/png"
  href="/assets/icons/favicon-32x32.png"
  sizes="32x32"
/>
<link
  rel="icon"
  type="image/png"
  href="/assets/icons/favicon-48x48.png"
  sizes="48x48"
/>
<link
  rel="icon"
  type="image/png"
  href="/assets/icons/favicon-96x96.png"
  sizes="96x96"
/>
<link
  rel="apple-touch-icon"
  type="image/png"
  href="/assets/icons/apple-touch-icon.png"
  sizes="180x180"
/>
<link
  rel="apple-touch-startup-image"
  type="image/png"
  href="/assets/icons/iphone5-splash.png"
  media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
/>
<link
  rel="apple-touch-startup-image"
  type="image/png"
  href="/assets/icons/iphone6-splash.png"
  media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
/>
<link
  rel="apple-touch-startup-image"
  type="image/png"
  href="/assets/icons/iphoneplus-splash.png"
  media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)"
/>
<link
  rel="apple-touch-startup-image"
  type="image/png"
  href="/assets/icons/iphonex-splash.png"
  media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
/>
<link
  rel="apple-touch-startup-image"
  type="image/png"
  href="/assets/icons/iphonexr-splash.png"
  media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
/>
<link
  rel="apple-touch-startup-image"
  type="image/png"
  href="/assets/icons/iphonexsmax-splash.png"
  media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
/>
<link
  rel="apple-touch-startup-image"
  type="image/png"
  href="/assets/icons/ipad-splash.png"
  media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
/>
<link
  rel="apple-touch-startup-image"
  type="image/png"
  href="/assets/icons/ipadpro1-splash.png"
  media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
/>
<link
  rel="apple-touch-startup-image"
  type="image/png"
  href="/assets/icons/ipadpro2-splash.png"
  media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
/>
<link
  rel="apple-touch-startup-image"
  type="image/png"
  href="/assets/icons/ipadpro3-splash.png"
  media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
/>
<link
  rel="mask-icon"
  type="image/svg+xml"
  href="/assets/icons/safari-pinned-tab.svg"
/>
<link
  rel="icon"
  type="image/png"
  href="/assets/icons/coast-228x228.png"
  sizes="228x228"
/>
```

## License

[MIT.](https://github.com/mxjoly/pwa-webpack-plugin/blob/master/LICENSE)
