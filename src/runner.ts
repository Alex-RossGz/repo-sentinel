import { claimNextPendingRun, markRunDone, markRunFailed } from "./runner/update-runs";

while (true) {
  const run = claimNextPendingRun();
  if (!run) {
    await Bun.sleep(1000);
    continue;
  }

  try {
    switch (run.kind) {
      /*       case "dockerfile":
              await processDockerfile(run);
              break;
            case "image":
              await processImage(run);
              break;
            case "repo":
            case "archive":
              await processRepoOrArchive(run);
              break;
            case "k8s_manifest":
              await processK8sManifest(run);
              break; */
      default:
    }
    markRunDone(run.id);
  } catch (err) {
    markRunFailed(run.id, String(err));
  }
}