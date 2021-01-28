import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import prettier from 'prettier';
import sharp from 'sharp';
import Jimp from 'jimp';
import safeRequire from 'safe-require';
import webpack, { Compiler, sources } from 'webpack';

import { adjustSvg, deepMerge } from './utils';
import { IconGroup, IconProps, PluginOpts } from './types';

const HtmlWebpackPlugin = safeRequire('../../../html-webpack-plugin');
const customIconsConfig = safeRequire('../../../../icons.json');
export const defaultIconsConfig = require('./icons.json');

const iconsMap = customIconsConfig ? customIconsConfig : defaultIconsConfig;

if (customIconsConfig) {
  console.log(
    chalk.green('Custom configuration file are detected to generate the icons.')
  );
}

// Default manifest options
const defaultManifest = {
  lang: 'en',
  dir: 'auto',
  name: null,
  short_name: null,
  description: null,
  icons: [],
  scope: '/',
  start_url: '/?utm_source=homescreen',
  display: 'standalone',
  orientation: 'any',
  theme_color: '#ffffff',
  background_color: '#ffffff',
};

// Device              Portrait size      Landscape size     Screen size        Pixel ratio
// iPhone SE            640px × 1136px    1136px ×  640px     320px ×  568px    2
// iPhone 8             750px × 1334px    1334px ×  750px     375px ×  667px    2
// iPhone 7             750px × 1334px    1334px ×  750px     375px ×  667px    2
// iPhone 6s            750px × 1334px    1334px ×  750px     375px ×  667px    2
// iPhone XR            828px × 1792px    1792px ×  828px     414px ×  896px    2
// iPhone XS           1125px × 2436px    2436px × 1125px     375px ×  812px    3
// iPhone X            1125px × 2436px    2436px × 1125px     375px ×  812px    3
// iPhone 8 Plus       1242px × 2208px    2208px × 1242px     414px ×  736px    3
// iPhone 7 Plus       1242px × 2208px    2208px × 1242px     414px ×  736px    3
// iPhone 6s Plus      1242px × 2208px    2208px × 1242px     414px ×  736px    3
// iPhone XS Max       1242px × 2688px    2688px × 1242px     414px ×  896px    3
// 9.7" iPad           1536px × 2048px    2048px × 1536px     768px × 1024px    2
// 10.2" iPad          1620px × 2160px    2160px x 1620px     810px × 1080px    2
// 7.9" iPad mini 4    1536px × 2048px    2048px × 1536px     768px × 1024px    2
// 10.5" iPad Pro      1668px × 2224px    2224px × 1668px     834px × 1112px    2
// 11" iPad Pro        1668px × 2388px    2388px × 1668px     834px × 1194px    2
// 12.9" iPad Pro      2048px × 2732px    2732px × 2048px    1024px × 1366px    2

class PWAPlugin {
  options: PluginOpts;
  hasRunned: boolean;

  constructor(args?: PluginOpts) {
    this.hasRunned = false;
    this.options = deepMerge(
      {
        publicPath: '/',
        emitMetadata: true,
        manifest: {
          filename: 'manifest.json',
          outputPath: '/',
          options: defaultManifest,
        },
        icons: {
          outputPath: '/assets/icons',
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
      },
      args || {}
    );
  }

  /**
   * Add an asset to the compilation
   * @param buffer - The buffer of the asset
   * @param relativePath - The relative path to the asset
   * @param compilation - The webpack compilation object
   */
  addAssetToCompilation(
    buffer: Buffer,
    relativePath: string,
    compilation: webpack.Compilation
  ) {
    const options = {
      name: 'PWAPlugin',
      stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
    };

    compilation.hooks.processAssets.tapPromise(options, () => {
      return new Promise<void>((resolve) => {
        compilation.emitAsset(relativePath, new sources.RawSource(buffer));
        resolve();
      });
    });
  }

  /**
   * Create the manifest file
   * @param compilation - The webpack compilation
   */
  createManifest(compilation: webpack.Compilation) {
    const {
      publicPath,
      manifest: { filename, outputPath: outputManifest, options },
      icons: { outputPath: outputIcons },
    } = this.options;

    // Manifest relative path from the public path
    const outputFile = path.join(outputManifest, filename).slice(1); // remove the first slash

    // Add the icons
    Object.entries(iconsMap.android).forEach(([iconName, props]: any) => {
      options.icons.push(
        Object.assign(
          {
            src: path.join(publicPath, outputIcons, iconName),
            sizes: `${props.width}x${props.height}`,
            type: 'image/png',
          },
          props.mask === true ? { purpose: 'maskable' } : {}
        )
      );
    });

    // Manifest content
    const content = prettier.format(JSON.stringify(options), {
      parser: 'json',
    });

    const buffer = Buffer.from(content, 'utf-8');
    this.addAssetToCompilation(buffer, outputFile, compilation);
  }

  /**
   * Create the file browserconfig.xml for Windows 10
   * @param compilation - The webpack compilation
   */
  createBrowserConfig(compilation: webpack.Compilation) {
    const {
      publicPath,
      manifest: { outputPath: outputManifest },
      icons: { use, outputPath: outputIcons, themeColor },
    } = this.options;

    if (use.windows === true) {
      const relativePath = path.join(publicPath, outputIcons);

      // Relative path from the public path
      const outputFile = path
        .join(outputManifest, 'browserconfig.xml')
        .slice(1); // remove the first slash

      const source = prettier.format(
        `
      <?xml version="1.0" encoding="utf-8"?>
      <browserconfig>
        <msapplication>
          <tile>
            <square70x70logo src="${relativePath}/mstile-70x70.png"/>
            <square150x150logo src="${relativePath}/mstile-270x270.png"/>
            <square310x310logo src="${relativePath}/mstile-310x310.png"/>
            <wide310x150logo src="${relativePath}/mstile-310x150.png"/>
            <TileColor>${themeColor}</TileColor>
          </tile>
        </msapplication>
      </browserconfig>
      `,
        { parser: 'html' }
      );

      const buffer = Buffer.from(source, 'utf-8');
      this.addAssetToCompilation(buffer, outputFile, compilation);
    }
  }

  /**
   * Generate all the icons for a group
   * @param buffer - The buffer of the favicon provided to generate the icons
   * @param group - The group of the icons to generate
   */
  generateGroupIcons(buffer: Buffer, group: IconGroup): Array<Promise<any>> {
    const {
      favicon,
      outputPath,
      backgroundColor,
      themeColor,
    } = this.options.icons;

    return Object.entries(iconsMap[group]).map(
      ([iconName, props]: [string, IconProps]) => {
        const relativePath = path.join(outputPath, iconName);

        if (String(props.type) === 'image/svg+xml') {
          return new Promise((resolve, reject) => {
            adjustSvg(fs.readFileSync(favicon), {
              width: props.width,
              height: props.height,
              color: props.color,
            })
              .then((buffer: Buffer) => {
                resolve([relativePath, buffer]);
              })
              .catch((err) => {
                reject(err);
              });
          });
        }

        if (String(props.type) === 'image/png') {
          return new Promise((resolve, reject) => {
            Jimp.read(buffer, (err, logo) => {
              if (err) reject(err);

              const width = props.width || props.dwidth * props.ratio;
              const height = props.height || props.dheight * props.ratio;

              // Create a background image
              // eslint-disable-next-line no-new
              new Jimp(
                width,
                height,
                group === 'appleStartup' ? backgroundColor : themeColor,
                async (err: Error, background: Jimp) => {
                  if (err) reject(err);

                  // Resize the logo
                  const dim =
                    group === 'appleStartup'
                      ? Math.min(0.8 * width, 800)
                      : width !== height
                      ? Math.min(0.9 * width, 0.9 * height)
                      : width;

                  // For maskable icon, the safe area corresponds to 80% of the dim
                  const padding = props.mask ? (7 * dim) / 20 : dim / 10; // padding for mask = dim/4 + dim/10
                  logo.resize(dim - padding, dim - padding);

                  // Position of the logo
                  const x = (width - dim) / 2 + padding / 2;
                  const y = (height - dim) / 2 + padding / 2;

                  // Make a composite image with the background and the logo
                  background.composite(logo, x, y, {
                    mode: Jimp.BLEND_SOURCE_OVER,
                    opacitySource: 1,
                    opacityDest: props.transparent ? 0 : 1, // Transparency of the background
                  });

                  Jimp.read(path.join(__dirname, 'mask.png'), (err, mask) => {
                    if (err) reject(err);

                    // https://css-tricks.com/maskable-icons-android-adaptive-icons-for-your-pwa/
                    if (props.mask === true) {
                      mask.resize(width, height);
                      background.mask(mask, 0, 0);
                    }

                    if (props.shadow === true) {
                      background.shadow({
                        size: 1.02,
                        x: 0,
                        y: 0,
                        opacity: 0.5,
                        blur: 3,
                      });
                    }

                    background.getBufferAsync(Jimp.MIME_PNG).then((buffer) => {
                      resolve([relativePath, buffer]);
                    });
                  });
                }
              );
            });
          });
        }

        return Promise.reject(
          new Error(`The provided image type is note supported : ${props.type}`)
        );
      }
    );
  }

  /**
   * Generate all the icons needed for the application to be supported with all platforms
   * @param compilation - The webpack compilation
   */
  generateIcons(compilation: webpack.Compilation) {
    const { favicon, use } = this.options.icons;

    if (!favicon || !fs.existsSync(favicon)) {
      console.warn(
        chalk.yellowBright(
          chalk.bold('ERROR') +
            ' Something went wrong generating the asset icons. No icons was gererated.'
        )
      );
      return Promise.resolve();
    }

    if (path.extname(favicon) !== '.svg') {
      console.warn(
        chalk.yellowBright(
          chalk.bold('ERROR') +
            ' You must use a svg file for your favicon. No icons was gererated.'
        )
      );
      return Promise.resolve();
    }

    // Do not emit icons during watch mode
    if (this.hasRunned) return Promise.resolve();

    const promises: Array<Promise<void>> = [];

    promises.push(
      new Promise((resolve, reject) => {
        // Resize the svg
        adjustSvg(fs.readFileSync(favicon), { width: 2000, height: 2000 })
          .then((svg: Buffer) => {
            // Convert to png
            return sharp(svg).png().toBuffer();
          })
          .then((png: Buffer) => {
            const promises = [];

            // Generation of all png files
            Object.keys(use)
              .filter((group) => use[group] === true)
              .forEach((group: IconGroup) => {
                const groupPromises = this.generateGroupIcons(png, group);

                if (!groupPromises)
                  throw new Error(
                    `An unexpected error occured when generating the icons for the group ${group}.`
                  );

                groupPromises.forEach((promise) => {
                  promises.push(
                    Promise.resolve(promise).then(([relativePath, buffer]) => {
                      this.addAssetToCompilation(
                        buffer,
                        relativePath,
                        compilation
                      );
                    })
                  );
                });
              });

            return Promise.all(promises);
          })
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      })
    );

    this.hasRunned = true;
    return Promise.all(promises);
  }

  /**
   * Add the metadata to the headtags of the html template file
   * @param compilation compilation - The webpack compilation
   */
  generateMetadata(compilation: webpack.Compilation) {
    const {
      publicPath,
      manifest: { filename, outputPath: outputManifest },
      icons: { use, outputPath: outputIcons },
    } = this.options;

    if (!HtmlWebpackPlugin) {
      console.log(
        chalk.yellowBright(
          'You do not have installed html-webpack-plugin in your project. The metadata cannot be generated.'
        )
      );
      return;
    }

    // https://github.com/jantimon/html-webpack-plugin#events
    HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
      'PWAPlugin',
      (data, callback) => {
        // Generate the meta tag for the manifest file and browserconfig
        data.assetTags.meta.push(
          HtmlWebpackPlugin.createHtmlTagObject('link', {
            rel: 'manifest',
            href: path.join(outputManifest, filename),
          })
        );

        // Generate the meta tag for the browserconfig file
        data.assetTags.meta.push(
          HtmlWebpackPlugin.createHtmlTagObject('meta', {
            name: 'msapplication-config',
            href: path.join(outputManifest, 'browserconfig.xml'),
          })
        );

        // Generate the links foreach icons
        Object.keys(use)
          .filter((group) => use[group] === true)
          .forEach((group) => {
            const groupLinks = Object.entries(iconsMap[group])
              .filter(([, props]: [string, IconProps]) => props.emitTag)
              .map(([iconName, props]: [string, IconProps]) => {
                // The path to the image
                const href = path.join(publicPath, outputIcons, iconName);

                // Default attributes for the links
                const attributes = {
                  rel: props.rel,
                  type: props.type,
                  href,
                } as any;

                if (String(props.type) === 'image/png') {
                  if (props.dwidth && props.dheight) {
                    const media = `(device-width: ${props.dwidth}px) and (device-height: ${props.dheight}px) and (-webkit-device-pixel-ratio: ${props.ratio})`;
                    Object.assign(attributes, { media });
                  }

                  if (props.width && props.height) {
                    Object.assign(attributes, {
                      sizes: `${props.width}x${props.height}`,
                    });
                  }
                }

                return HtmlWebpackPlugin.createHtmlTagObject(
                  'link',
                  attributes
                );
              });
            data.assetTags.meta = data.assetTags.meta.concat(groupLinks);
          });

        callback(null, data);
      }
    );
  }

  apply(compiler: Compiler) {
    const compilation = compiler.hooks.thisCompilation;
    compilation.tap('PWAPlugin', this.createManifest.bind(this));
    compilation.tap('PWAPlugin', this.createBrowserConfig.bind(this));
    compilation.tap('PWAPlugin', this.generateIcons.bind(this));
    if (this.options.emitMetadata) {
      compilation.tap('PWAPlugin', this.generateMetadata.bind(this));
    }
  }
}

export default PWAPlugin;
