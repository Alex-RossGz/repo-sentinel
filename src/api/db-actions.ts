import { db } from "../db";

export const RUN_KINDS = [
  "repo",
  "archive",
  "dockerfile",
  "image",
  "k8s_manifest",
] as const;
export type RunKind = typeof RUN_KINDS[number];

export const RUN_STATUS = [
  "pending",
  "running",
  "done",
  "failed",
  "rejected",
] as const;
export type RunStatus = typeof RUN_STATUS[number];


// Minimal pragmas
db.run(`
  CREATE TABLE IF NOT EXISTS analysis_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kind TEXT NOT NULL CHECK (kind IN (${RUN_KINDS.map(k => `'${k}'`).join(",")})),
    input_ref TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN (${RUN_STATUS.map(k => `'${k}'`).join(",")})) DEFAULT 'pending',
    stage TEXT,
    findings_json TEXT,
    decision_json TEXT,
    error_text TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    started_at TEXT,
    finished_at TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_analysis_runs_status_created_at
  ON analysis_runs(status, created_at);
`);

export const insertRun = db.query(`
  INSERT INTO analysis_runs (kind, input_ref, status)
  VALUES (?1, ?2, 'pending')
  RETURNING
    id, kind, input_ref, status, stage,
    findings_json, decision_json, error_text,
    created_at, started_at, finished_at
`);
export const getRun = db.query(`
  SELECT
    id, kind, input_ref, status, stage,
    findings_json, decision_json, error_text,
    created_at, started_at, finished_at
  FROM analysis_runs
  WHERE id = ?1
`);
export const listRuns = db.query(`
  SELECT
    id, kind, input_ref, status, stage,
    findings_json, decision_json, error_text,
    created_at, started_at, finished_at
  FROM analysis_runs
  ORDER BY id DESC
  LIMIT ?1
`);
