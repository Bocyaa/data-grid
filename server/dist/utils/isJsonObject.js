"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isJsonObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
exports.default = isJsonObject;
