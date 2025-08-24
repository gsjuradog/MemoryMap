import { Injectable } from '@angular/core';
import {CapacitorSQLite, CapacitorSQLitePlugin, SQLiteDBConnection} from '@capacitor-community/sqlite';

export interface Pin {
  id: string;
  mapId: string;
  x: number; // 0–1
  y: number; // 0–1
  title?: string;
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  private db: SQLiteDBConnection | null = null;

  constructor() {
    this.initDB();
  }

  async initDB() {
    try {
      const sqlite: CapacitorSQLitePlugin = CapacitorSQLite;
      const dbConn: SQLiteDBConnection = await sqlite.createConnection({
        database: 'memoryPalace',
        version: 1,
        encrypted: false,
        mode: 'no-encryption',
        readonly: false,
      }) as unknown  as SQLiteDBConnection;

      this.db = dbConn;
      await this.db.open();

      const createPins = `
        CREATE TABLE IF NOT EXISTS pins (
          id TEXT PRIMARY KEY,
          mapId TEXT,
          x REAL,
          y REAL,
          title TEXT
        );
      `;
      await this.db.execute(createPins);
    } catch (err) {
      console.error('DB init error:', err);
    }

  }

  async savePin(pin: Pin) {
    if (!this.db) return;
    const stmt = `
      INSERT OR REPLACE INTO pins (id, mapId, x, y, title)
      VALUES (?, ?, ?, ?, ?)
    `;
    await this.db.run(stmt, [pin.id, pin.mapId, pin.x, pin.y, pin.title || '']);
  }

  async loadPins(mapId: string): Promise<Pin[]> {
    if (!this.db) return [];
    const stmt = `SELECT * FROM pins WHERE mapId = ?`;
    const res = await this.db.query(stmt, [mapId]);
    return res.values as Pin[];
  }

  async deletePin(id: string) {
    if (!this.db) return;
    const stmt = `DELETE FROM pins WHERE id = ?`;
    await this.db.run(stmt, [id]);
  }
}
