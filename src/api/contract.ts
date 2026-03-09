import type { RunKind } from "./db-actions";

function isAcceptedUpload(kind: RunKind, file: File): boolean {
    const name = file.name.toLowerCase();

    switch (kind) {
        case "archive":
            return name.endsWith(".zip");

        case "dockerfile":
            return name === "dockerfile" || name.endsWith(".dockerfile") || name.endsWith(".txt");

        case "k8s_manifest":
            return name.endsWith(".yaml") || name.endsWith(".yml") || name.endsWith(".json");

        default:
            return false;
    }
}