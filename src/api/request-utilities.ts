import { type RunKind, RUN_KINDS } from "./db-actions"


export function isValidKind(value: unknown): value is RunKind {
    return typeof value === "string" && RUN_KINDS.includes(value as RunKind);
}
export function rowToApi(row: any) {
    return {
        ...row,
        findings_json: row?.findings_json ? JSON.parse(row.findings_json) : null,
        decision_json: row?.decision_json ? JSON.parse(row.decision_json) : null,
    };
}

type CreateRunInput = {
    kind: unknown;
    input_ref?: unknown;
    file?: File | null;
};

export async function parseCreateRunRequest(c: any): Promise<CreateRunInput | Response> {
    const contentType = (c.req.header("content-type") ?? "").toLowerCase();

    if (contentType.includes("application/json")) {
        const body = await c.req.json();

        if (!body || typeof body !== "object") {
            return c.json({ error: "Invalid JSON body" }, 400);
        }

        return body as CreateRunInput;
    }

    if (contentType.includes("multipart/form-data")) {
        const form = await c.req.formData();

        return {
            kind: form.get("kind"),
            input_ref: form.get("input_ref"),
            file: form.get("file") as File | null,
        };
    }

    return c.json(
        { error: "Unsupported Content-Type. Use application/json or multipart/form-data" },
        415
    );
}