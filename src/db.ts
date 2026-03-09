import { Database } from "bun:sqlite";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";


export const DATA_DIR = "./data";
export const DB_PATH = join(DATA_DIR, "reposentinel.sqlite");

if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
}

export const db = new Database(DB_PATH);