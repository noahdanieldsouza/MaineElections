const { spawn } = require('child_process');

const processes = [];

function start(command, args) {
  const child = spawn(command, args, {
    stdio: 'inherit',
  });

  processes.push(child);

  child.on('exit', (code, signal) => {
    if (signal || (typeof code === 'number' && code !== 0)) {
      for (const childProcess of processes) {
        if (childProcess.pid !== child.pid) {
          childProcess.kill();
        }
      }

      process.exit(code ?? 0);
    }
  });

  return child;
}

start('node', ['server/index.js']);
start('npm', ['start', '--prefix', 'client']);

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    for (const childProcess of processes) {
      childProcess.kill(signal);
    }

    process.exit(0);
  });
}