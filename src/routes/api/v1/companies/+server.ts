import { error, json, type RequestHandler } from '@sveltejs/kit';
import sqlite3 from 'sqlite3';

export const GET: RequestHandler = async ({ request, url }) => {
  const query = url.searchParams.get('q');
  const pageNumber = parseInt(url.searchParams.get('page') ?? '1'); // 1-origin
  const perPage = (() => {
    const tmp = parseInt(url.searchParams.get('perPage') ?? '0');
    return Math.min(100, Math.max(10, tmp));
  })();

  if (pageNumber < 1) {
    throw error(400, 'invalid page number');
  }

  try {
    let db: sqlite3.Database;

    await new Promise<void>((resolve, reject) => {
      db = new sqlite3.Database(`./src/assets/data.sqlite3`, sqlite3.OPEN_READONLY, (err) => {
        if (err == null) {
          resolve();
        } else {
          reject(err);
        }
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await new Promise<any[]>(function (resolve, reject) {
      db.all(
        'SELECT *, count(id) over() as count FROM Companies WHERE name LIKE ? ORDER BY id LIMIT ? OFFSET ?',
        [`%${query}%`, perPage, (pageNumber - 1) * perPage],
        (err, rows) => {
          if (err == null) {
            resolve(rows);
          } else {
            reject(err);
          }
        }
      );
    });

    return json({
      companies: rows.map((x) => ({ id: x.id, name: x.name, url: x.url })),
      total: rows.length === 0 ? 0 : rows[0].count
    });
  } catch (e) {
    throw error(503, `DB error: ${e}`);
  }
};
