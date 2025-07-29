import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { prisma } from 'lib/prisma';

(async () => {
  const filePath = path.join(__dirname, '../data/ElectricCarData.csv');
  const csv = fs.readFileSync(filePath, 'utf8');

  const parsed = Papa.parse(csv, {
    header: true,
    dynamicTyping: true,
  });

  await prisma.dataset.create({
    data: {
      name: 'Electric Car Dataset',
      rows: parsed.data as object[],
    },
  });

  console.log('CSV data imported into database.');
  await prisma.$disconnect();
})();
