"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var chalk_1 = __importDefault(require("chalk"));
var prettier_1 = __importDefault(require("prettier"));
var sharp_1 = __importDefault(require("sharp"));
var jimp_1 = __importDefault(require("jimp"));
var safe_require_1 = __importDefault(require("safe-require"));
var merge_1 = __importDefault(require("lodash/merge"));
var utils_1 = require("./utils");
var HtmlWebpackPlugin = safe_require_1.default('../../../html-webpack-plugin');
var iconsMap = require('./icons.json');
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
var PWAPlugin = /** @class */ (function () {
    function PWAPlugin(args) {
        this._emit = true;
        this.options = merge_1.default({
            publicPath: '/',
            emitMetadata: true,
            htmlPlugin: null,
            manifest: {
                filename: 'manifest.json',
                outputPath: '/',
                options: {
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
                },
            },
            icons: {
                outputPath: '/assets/icons',
                splashColor: '#ffffff',
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
        }, args || {});
    }
    /**
     * Create the manifest file
     * @param compilation - The webpack compilation
     */
    PWAPlugin.prototype.createManifest = function (compilation) {
        var _a = this.options, publicPath = _a.publicPath, _b = _a.manifest, filename = _b.filename, outputManifest = _b.outputPath, options = _b.options, outputIcons = _a.icons.outputPath;
        // Manifest relative path from the public path
        var outputFile = path_1.default.join(outputManifest, filename).slice(1); // remove the first slash
        // Add the icons
        Object.entries(iconsMap.android).forEach(function (_a) {
            var iconName = _a[0], props = _a[1];
            options.icons.push(Object.assign({
                src: path_1.default.join(publicPath, outputIcons, iconName),
                sizes: props.width + "x" + props.height,
                type: 'image/png',
            }, props.mask === true ? { purpose: 'maskable' } : {}));
        });
        // Manifest content
        var content = prettier_1.default.format(JSON.stringify(options), {
            parser: 'json',
        });
        var buffer = Buffer.from(content, 'utf-8');
        // Add file to the compilation assets
        compilation.assets[outputFile] = {
            source: function () { return buffer; },
            size: function () { return buffer.length; },
        };
    };
    /**
     * Create the file browserconfig.xml for Windows 10
     * @param compilation - The webpack compilation
     */
    PWAPlugin.prototype.createBrowserConfig = function (compilation) {
        var _a = this.options, publicPath = _a.publicPath, outputManifest = _a.manifest.outputPath, _b = _a.icons, use = _b.use, outputIcons = _b.outputPath, themeColor = _b.themeColor;
        if (use.windows === true) {
            var relativePath = path_1.default.join(publicPath, outputIcons);
            // Relative path from the public path
            var outputFile = path_1.default
                .join(outputManifest, 'browserconfig.xml')
                .slice(1); // remove the first slash
            var source = prettier_1.default.format("\n      <?xml version=\"1.0\" encoding=\"utf-8\"?>\n      <browserconfig>\n        <msapplication>\n          <tile>\n            <square70x70logo src=\"" + relativePath + "/mstile-70x70.png\"/>\n            <square150x150logo src=\"" + relativePath + "/mstile-270x270.png\"/>\n            <square310x310logo src=\"" + relativePath + "/mstile-310x310.png\"/>\n            <wide310x150logo src=\"" + relativePath + "/mstile-310x150.png\"/>\n            <TileColor>" + themeColor + "</TileColor>\n          </tile>\n        </msapplication>\n      </browserconfig>\n      ", { parser: 'html' });
            var buffer_1 = Buffer.from(source, 'utf-8');
            compilation.assets[outputFile] = {
                source: function () { return buffer_1; },
                size: function () { return buffer_1.length; },
            };
        }
    };
    /**
     * Generate all the icons for a group
     * @param buffer - The buffer of the favicon provided to generate the icons
     * @param group - The group of the icons to generate
     */
    PWAPlugin.prototype.generateGroupIcons = function (buffer, group) {
        var _this = this;
        var _a = this.options.icons, favicon = _a.favicon, outputPath = _a.outputPath, backgroundColor = _a.backgroundColor, themeColor = _a.themeColor;
        return Object.entries(iconsMap[group]).map(function (_a) {
            var iconName = _a[0], props = _a[1];
            var relativePath = path_1.default.join(outputPath, iconName);
            if (String(props.type) === 'image/svg+xml') {
                return new Promise(function (resolve, reject) {
                    utils_1.adjustSvg(fs_1.default.readFileSync(favicon), {
                        width: props.width,
                        height: props.height,
                        color: props.color,
                    })
                        .then(function (buffer) {
                        resolve([relativePath, buffer]);
                    })
                        .catch(function (err) {
                        reject(err);
                    });
                });
            }
            if (String(props.type) === 'image/png') {
                return new Promise(function (resolve, reject) {
                    jimp_1.default.read(buffer, function (err, logo) {
                        if (err)
                            reject(err);
                        var width = props.width || props.dwidth * props.ratio;
                        var height = props.height || props.dheight * props.ratio;
                        // Create a background image
                        new jimp_1.default(width, height, group === 'appleStartup' ? backgroundColor : themeColor, function (err, background) { return __awaiter(_this, void 0, void 0, function () {
                            var dim, padding, x, y;
                            return __generator(this, function (_a) {
                                if (err)
                                    reject(err);
                                dim = group === 'appleStartup'
                                    ? Math.min(0.8 * width, 800)
                                    : width !== height
                                        ? Math.min(0.9 * width, 0.9 * height)
                                        : width;
                                padding = props.mask ? (7 * dim) / 20 : dim / 10;
                                logo.resize(dim - padding, dim - padding);
                                x = (width - dim) / 2 + padding / 2;
                                y = (height - dim) / 2 + padding / 2;
                                // Make a composite image with the background and the logo
                                background.composite(logo, x, y, {
                                    mode: jimp_1.default.BLEND_SOURCE_OVER,
                                    opacitySource: 1,
                                    opacityDest: props.transparent ? 0 : 1,
                                });
                                jimp_1.default.read(path_1.default.join(__dirname, 'mask.png'), function (err, mask) {
                                    if (err)
                                        reject(err);
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
                                    background.getBufferAsync(jimp_1.default.MIME_PNG).then(function (buffer) {
                                        resolve([relativePath, buffer]);
                                    });
                                });
                                return [2 /*return*/];
                            });
                        }); });
                    });
                });
            }
            return Promise.reject(new Error("The provided image type is note supported : " + props.type));
        });
    };
    /**
     * Generate all the icons needed for the application to be supported with all platforms
     * @param compilation - The webpack compilation
     */
    PWAPlugin.prototype.generateIcons = function (compilation) {
        var _this = this;
        var _a = this.options.icons, favicon = _a.favicon, use = _a.use;
        if (!favicon || !fs_1.default.existsSync(favicon)) {
            console.warn(chalk_1.default.yellowBright(chalk_1.default.bold('ERROR') +
                ' Something went wrong generating the asset icons. No icons was gererated.'));
            return Promise.resolve();
        }
        if (path_1.default.extname(favicon) !== '.svg') {
            console.warn(chalk_1.default.yellowBright(chalk_1.default.bold('ERROR') +
                ' You must use a svg file for your favicon. No icons was gererated.'));
            return Promise.resolve();
        }
        // Do not emit icons during watch mode
        if (!this._emit)
            return Promise.resolve();
        var promises = [];
        promises.push(new Promise(function (resolve, reject) {
            // Resize the svg
            utils_1.adjustSvg(fs_1.default.readFileSync(favicon), { width: 2000, height: 2000 })
                .then(function (svg) {
                // Convert to png
                return sharp_1.default(svg).png().toBuffer();
            })
                .then(function (png) {
                var promises = [];
                // Generation of all png files
                Object.keys(use)
                    .filter(function (group) { return use[group] === true; })
                    .forEach(function (group) {
                    var groupPromises = _this.generateGroupIcons(png, group);
                    if (!groupPromises)
                        throw new Error("An unexpected error occured when generating the icons for the group " + group + ".");
                    groupPromises.forEach(function (promise) {
                        promises.push(Promise.resolve(promise).then(function (_a) {
                            var relativePath = _a[0], buffer = _a[1];
                            compilation.assets[relativePath] = {
                                source: function () { return buffer; },
                                size: function () { return buffer.length; },
                            };
                        }));
                    });
                });
                return Promise.all(promises);
            })
                .then(function () {
                resolve();
            })
                .catch(function (err) {
                reject(err);
            });
        }));
        this._emit = false;
        return Promise.all(promises);
    };
    /**
     * Add the metadata to the headtags of the html template file
     * @param compilation compilation - The webpack compilation
     */
    PWAPlugin.prototype.generateMetadata = function (compilation) {
        var _a = this.options, publicPath = _a.publicPath, _b = _a.manifest, filename = _b.filename, outputManifest = _b.outputPath, _c = _a.icons, use = _c.use, outputIcons = _c.outputPath;
        if (!HtmlWebpackPlugin) {
            console.log(chalk_1.default.yellowBright('You do not have installed html-webpack-plugin in your project. The metadata cannot be generated.'));
            return;
        }
        // https://github.com/jantimon/html-webpack-plugin#events
        HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync('PWAPlugin', function (data, callback) {
            // Generate the meta tag for the manifest file and browserconfig
            data.assetTags.meta.push(HtmlWebpackPlugin.createHtmlTagObject('link', {
                rel: 'manifest',
                href: path_1.default.join(outputManifest, filename),
            }));
            // Generate the meta tag for the browserconfig file
            data.assetTags.meta.push(HtmlWebpackPlugin.createHtmlTagObject('meta', {
                name: 'msapplication-config',
                href: path_1.default.join(outputManifest, 'browserconfig.xml'),
            }));
            // Generate the links foreach icons
            Object.keys(use)
                .filter(function (group) { return use[group] === true; })
                .forEach(function (group) {
                var groupLinks = Object.entries(iconsMap[group])
                    .filter(function (_a) {
                    var props = _a[1];
                    return props.emitTag;
                })
                    .map(function (_a) {
                    var iconName = _a[0], props = _a[1];
                    // The path to the image
                    var href = path_1.default.join(publicPath, outputIcons, 'icons', iconName);
                    // Default attributes for the links
                    var attributes = {
                        rel: props.rel,
                        type: props.type,
                        href: href,
                    };
                    if (String(props.type) === 'image/png') {
                        if (props.dwidth && props.dheight) {
                            var media = "(device-width: " + props.dwidth + "px) and (device-height: " + props.dheight + "px) and (-webkit-device-pixel-ratio: " + props.ratio + ")";
                            Object.assign(attributes, { media: media });
                        }
                        if (props.width && props.height) {
                            Object.assign(attributes, {
                                sizes: props.width + "x" + props.height,
                            });
                        }
                    }
                    return HtmlWebpackPlugin.createHtmlTagObject('link', attributes);
                });
                data.assetTags.meta = data.assetTags.meta.concat(groupLinks);
            });
            callback(null, data);
        });
    };
    PWAPlugin.prototype.apply = function (compiler) {
        compiler.hooks.emit.tap('PWAPlugin', this.createManifest.bind(this));
        compiler.hooks.emit.tap('PWAPlugin', this.createBrowserConfig.bind(this));
        compiler.hooks.emit.tapPromise('PWAPlugin', this.generateIcons.bind(this));
        if (this.options.emitMetadata) {
            compiler.hooks.compilation.tap('PWAPlugin', this.generateMetadata.bind(this));
        }
    };
    return PWAPlugin;
}());
exports.default = PWAPlugin;
