"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCsv = parseCsv;
const papaparse_1 = __importDefault(require("papaparse"));
function parseCsv(buffer) {
    const csvContent = buffer.toString('utf-8');
    const parsed = papaparse_1.default.parse(csvContent, {
        header: true,
        dynamicTyping: true,
    });
    if (!Array.isArray(parsed.data) || parsed.data.length === 0) {
        throw new Error('CSV parsing failed or empty data');
    }
    return parsed.data;
}
