import xml2js from 'xml2js';

/**
 * Set all the properties of object
 * @param {Object} obj - The object to change
 * @param {string} attrName - The key name
 * @param {string|number} attrVal - The new value for the key
 */
const setAllObjectProperty = (obj, attrName: string, attrVal: string) => {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'object') {
      setAllObjectProperty(value, attrName, attrVal);
    } else if (Array.isArray(value)) {
      value.forEach((val) => setAllObjectProperty(val, attrName, attrVal));
    } else if (key === attrName) {
      obj[key] = attrVal;
    }
  });
};

/**
 * Update the width, height and fill color of the svg
 * @param {string} svg - The content of the svg file as string
 * @param {Object} props - The props to set for the svg
 */
export const adjustSvg = (
  svg: Buffer,
  props: { width: number; height: number; color?: string }
): Promise<Buffer> => {
  const parser = new xml2js.Parser();
  const builder = new xml2js.Builder();

  return new Promise((resolve, reject) => {
    parser.parseString(svg.toString(), (err, obj) => {
      if (err) reject(err);
      // Set the attributes width and height to svg node
      if (props.width) obj.svg['$'].width = props.width;
      if (props.height) obj.svg['$'].height = props.height;

      // Set the fill color
      if (props.color) setAllObjectProperty(obj, 'fill', props.color);

      // Update the svg
      const svg = builder.buildObject(obj);
      resolve(Buffer.from(svg));
    });
  });
};

/**
 * Simple object check.
 * @param {any} item
 */
function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function deepMerge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}
