import { $ } from "bun";
import { dockerRun } from "./docker";
import { markRunDone, markRunDoneQuery, type Run } from "./update-runs";
import { DATA_DIR } from "../db";

export async function processDockerfile(run: Run) {
    const dockerfilePath = `${DATA_DIR}/runs/${run.id}/Dockerfile`;

    // 1. Locate the Dockerfile
    const exists = await Bun.file(dockerfilePath).exists();
    if (!exists) {
        throw new Error(`Dockerfile not found for run ${run.id}`);
    }

    // 2. Basic validity checks
    const dockerfileContent = await Bun.file(dockerfilePath).text();
    const trimmed = dockerfileContent.trim();

    const redflags = [
        !/\bFROM\b/i.test(dockerfileContent) && "Missing FROM instruction",
        (trimmed.startsWith("{") || trimmed.startsWith("[")) && "Looks like JSON, not a Dockerfile",
        (trimmed.startsWith("---") || /^[\w-]+\s*:/m.test(dockerfileContent)) && "Looks like YAML, not a Dockerfile",
        /[\x00-\x08\x0E-\x1F\x7F]/.test(dockerfileContent) && "Contains binary/control data, not a valid Dockerfile",
    ].filter(Boolean) as string[];

    if (redflags.length > 0) {
        throw new Error(`Invalid Dockerfile for run ${run.id}: ${redflags.join(", ")} `);
    }

    // 3. Analyze with Semgrep
    const findings: unknown[] = [];

    try {
        const proc = dockerRun(
            ["--config", "p/ci", "--json", "--no-git-ignore", "/data"],
            "returntocorp/semgrep:latest",
            { [`${$.cwd()} /data/${run.id} `]: "/data" }
        );

        const outputText = await proc.stdout.text();

        // optional: inspect exit code
        const exitCode = await proc.exited;
        if (exitCode !== 0) {
            const errText = proc.stderr ?? "";
            throw new Error(`Semgrep failed with exit code ${exitCode}: ${errText} `);
        }

        const parsed = JSON.parse(outputText);
        findings.push(...(parsed.results ?? []));
    } catch (err) {
        console.error(`Error running Semgrep for run ${run.id}: `, err);
        throw new Error(`Error analyzing Dockerfile for run ${run.id}`);
    }

    markRunDone(run.id, JSON.stringify(findings), JSON.stringify({}));
}