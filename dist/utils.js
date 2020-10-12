"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustSvg = void 0;
var xml2js_1 = __importDefault(require("xml2js"));
/**
 * Set all the properties of object
 * @param {Object} obj - The object to change
 * @param {string} attrName - The key name
 * @param {string|number} attrVal - The new value for the key
 */
var setAllObjectProperty = function (obj, attrName, attrVal) {
    Object.entries(obj).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (typeof value === 'object') {
            setAllObjectProperty(value, attrName, attrVal);
        }
        else if (Array.isArray(value)) {
            value.forEach(function (val) { return setAllObjectProperty(val, attrName, attrVal); });
        }
        else if (key === attrName) {
            obj[key] = attrVal;
        }
    });
};
/**
 * Update the width, height and fill color of the svg
 * @param {string} svg - The content of the svg file as string
 * @param {Object} props - The props to set for the svg
 */
exports.adjustSvg = function (svg, props) {
    var parser = new xml2js_1.default.Parser();
    var builder = new xml2js_1.default.Builder();
    return new Promise(function (resolve, reject) {
        parser.parseString(svg.toString(), function (err, obj) {
            if (err)
                reject(err);
            // Set the attributes width and height to svg node
            if (props.width)
                obj.svg['$'].width = props.width;
            if (props.height)
                obj.svg['$'].height = props.height;
            // Set the fill color
            if (props.color)
                setAllObjectProperty(obj, 'fill', props.color);
            // Update the svg
            var svg = builder.buildObject(obj);
            resolve(Buffer.from(svg));
        });
    });
};
