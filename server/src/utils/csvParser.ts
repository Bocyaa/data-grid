import Papa from 'papaparse';

export function parseCsv(buffer: Buffer): object[] {
  const csvContent = buffer.toString('utf-8');
  const parsed = Papa.parse(csvContent, {
    header: true,
    dynamicTyping: true,
  });

  if (!Array.isArray(parsed.data) || parsed.data.length === 0) {
    throw new Error('CSV parsing failed or empty data');
  }

  return parsed.data as object[];
}
