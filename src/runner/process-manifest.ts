import type { Run } from "./update-runs";

type Finding = {
    id: string;
    description: string;
    severity: string;
};

type Decision = {
    action: string;
    reason: string;
};

export async function processManifest(
    run: Run
): Promise<[Finding[], Decision]> {
    console.log(`Processing manifest run with input_ref: ${run.input_ref}`);
    await Bun.sleep(2000);
    console.log(`Finished processing manifest run with id: ${run.id}`);

    const findings: Finding[] = [
        {
            id: "finding-1",
            description: "Example finding from manifest processing",
            severity: "medium",
        },
    ];

    const decision: Decision = {
        action: "review",
        reason: "Manifest contains potential issues that require manual review.",
    };

    return [findings, decision];
}