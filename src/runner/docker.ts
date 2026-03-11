const dockerRun = (cmd: string[], image: string, volumes: Record<string, string>) => {
    const volumeArgs = Object.entries(volumes).flatMap(([hostPath, containerPath]) => ['-v', `${hostPath}:${containerPath}`]);
    const fullCmd = ['docker', 'run', '--rm', ...volumeArgs, image, ...cmd];
    console.log(`Running command: ${fullCmd.join(' ')}`);
    return Bun.spawn(fullCmd);
};

export { dockerRun };