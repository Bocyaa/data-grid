import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { prisma } from 'lib/prisma';

(async () => {
  try {
    const filePath = path.join(__dirname, 'data/ElectricCarData.csv');
    const csv = fs.readFileSync(filePath, 'utf8');

    const parsed = Papa.parse(csv, {
      header: true,
      dynamicTyping: true,
    });

    if (!parsed.data || !Array.isArray(parsed.data)) {
      throw new Error('CSV parsing failed or data is invalid.');
    }

    // Step 1: Create the dataset entry
    const dataset = await prisma.dataset.create({
      data: {
        name: 'Electric Car Dataset',
      },
    });

    // Step 2: Insert each CSV row as a Row linked to the Dataset
    const rowsToInsert = parsed.data as object[];

    await prisma.$transaction(
      rowsToInsert.map((row) =>
        prisma.row.create({
          data: {
            datasetId: dataset.id,
            data: row,
          },
        })
      )
    );

    console.log(
      `✅ Imported ${rowsToInsert.length} rows into dataset '${dataset.name}' (ID: ${dataset.id})`
    );
  } catch (error) {
    console.error('❌ Error importing CSV:', error);
  } finally {
    await prisma.$disconnect();
  }
})();
