"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const papaparse_1 = __importDefault(require("papaparse"));
const prisma_1 = require("lib/prisma");
(async () => {
    try {
        const filePath = path_1.default.join(__dirname, 'data/ElectricCarData.csv');
        const csv = fs_1.default.readFileSync(filePath, 'utf8');
        const parsed = papaparse_1.default.parse(csv, {
            header: true,
            dynamicTyping: true,
        });
        if (!parsed.data || !Array.isArray(parsed.data)) {
            throw new Error('CSV parsing failed or data is invalid.');
        }
        // Step 1: Create the dataset entry
        const dataset = await prisma_1.prisma.dataset.create({
            data: {
                name: 'Electric Car Dataset',
            },
        });
        // Step 2: Insert each CSV row as a Row linked to the Dataset
        const rowsToInsert = parsed.data;
        await prisma_1.prisma.$transaction(rowsToInsert.map((row) => prisma_1.prisma.row.create({
            data: {
                datasetId: dataset.id,
                data: row,
            },
        })));
        console.log(`✅ Imported ${rowsToInsert.length} rows into dataset '${dataset.name}' (ID: ${dataset.id})`);
    }
    catch (error) {
        console.error('❌ Error importing CSV:', error);
    }
    finally {
        await prisma_1.prisma.$disconnect();
    }
})();
