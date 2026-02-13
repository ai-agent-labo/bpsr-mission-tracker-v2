import type { Mission, RenderType, SubItem } from '../types';

export async function fetchMissionsFromSheet(
  sheetUrl: string
): Promise<Mission[]> {
  try {
    const csvUrl = sheetUrl.includes('/export?format=csv')
      ? sheetUrl
      : sheetUrl
          .replace(/\/edit.*$/, '/export?format=csv')
          .replace(/\/usp=sharing.*$/, '/export?format=csv');

    const response = await fetch(csvUrl);
    if (!response.ok) throw new Error('Failed to fetch sheet');

    const csvText = await response.text();
    const rows = csvText.split('\n').map((row) => {
      const cells: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < row.length; i++) {
        if (row[i] === '"') inQuotes = !inQuotes;
        else if (row[i] === ',' && !inQuotes) {
          cells.push(current.trim());
          current = '';
        } else {
          current += row[i];
        }
      }
      cells.push(current.trim());
      return cells;
    });

    const dataRows = rows.slice(1);
    return dataRows
      .filter((row) => row.length >= 5)
      .map((row) => {
        const subItemsRaw = row[7] || '';
        const subItems: SubItem[] = subItemsRaw
          ? subItemsRaw.split(';').map((item) => {
              const [id, name] = item.split(':');
              return { id: id || item, name: name || item };
            })
          : [];

        const metadataRaw = row[8] || '';
        const metadata: Record<string, unknown> = {};
        if (metadataRaw) {
          metadataRaw.split(';').forEach((pair) => {
            const [k, v] = pair.split(':');
            if (k) metadata[k] = Number(v) === Number(v) ? Number(v) : v;
          });
        }

        return {
          id: row[0],
          name: row[1],
          type: row[2] as Mission['type'],
          category: row[3] as Mission['category'],
          image: row[4],
          description: row[5] || '',
          renderType: (row[6] as RenderType) || undefined,
          subItems: subItems.length > 0 ? subItems : undefined,
          metadata:
            Object.keys(metadata).length > 0 ? metadata : undefined
        };
      });
  } catch (error) {
    console.error('Error fetching missions:', error);
    return [];
  }
}
