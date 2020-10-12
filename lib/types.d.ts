import HtmlWebpackPlugin from 'html-webpack-plugin';

// https://developer.mozilla.org/fr/docs/Web/Manifest
interface ManifestOptions {
  lang: string;
  dir: 'ltr' | 'rtl' | 'auto';
  name: string;
  short_name: string;
  description: string;
  icons: { src: string; sizes: string; type: string }[];
  scope: string;
  start_url: string;
  display: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
  orientation:
    | 'any'
    | 'natural'
    | 'landscape'
    | 'landscape-primary'
    | 'landscape-secondary'
    | 'portrait'
    | 'portrait-primary'
    | 'portrait-secondary';
  theme_color: string;
  background_color: string;
  prefer_related_applications?: 'true' | 'false';
  related_application?: [{ platform: string; url: string; id?: string }];
}

interface PluginOpts {
  publicPath?: string;
  emitMetadata?: boolean;
  manifest?: {
    filename?: string;
    outputPath?: string;
    options?: ManifestOptions;
  };
  icons?: {
    favicon?: string; // svg icon for generating the other icons
    outputPath?: string;
    // see https://www.pikpng.com/pngl/m/112-1128234_the-preview-shown-before-your-site-is-ready.png
    backgroundColor?: string; // background color for the splash screen
    themeColor?: string; // theme color
    use?: {
      favicons?: boolean;
      android?: boolean;
      apple?: boolean;
      appleStartup?: boolean;
      windows?: boolean;
      safari?: boolean;
      coast?: boolean;
    };
  };
}

type IconGroup =
  | 'favicons'
  | 'android'
  | 'apple'
  | 'appleStartup'
  | 'windows'
  | 'safari'
  | 'coast';

type RelType =
  | 'icon'
  | 'apple-touch-icon'
  | 'apple-touch-startup-image'
  | 'shortcut icon';

type MimeType = 'image/gif' | 'image/jpeg' | 'image/png' | 'image/svg+xml';

type IconProps = {
  width?: number;
  height?: number;
  dwidth?: number;
  dheight?: number;
  ratio?: number;
  rel?: RelType;
  type?: MimeType;
  color?: string;
  transparent?: boolean;
  mask?: boolean;
  shadow?: boolean;
  emitTag?: boolean;
};
