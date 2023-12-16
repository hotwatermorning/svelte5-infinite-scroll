import { error, json, type RequestHandler } from '@sveltejs/kit';
import sqlite3 from 'sqlite3';

export const GET: RequestHandler = async ({ request, url, params }) => {
	console.log(`${request.method} ${url.pathname}`);

	const id = parseInt(params.id ?? '0');
	if (id < 1) {
		throw error(400, 'invalid id');
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
		const row = await new Promise<any>(function (resolve, reject) {
			db.get('SELECT * FROM Companies WHERE id = ?', [id], (err, row) => {
				if (err == null) {
					resolve(row);
				} else {
					reject(err);
				}
			});
		});

		return json(row);
	} catch (e) {
		throw error(503, `DB error: ${e}`);
	}
};
