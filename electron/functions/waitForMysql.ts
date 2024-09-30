import net from 'net';

export const waitForMysql = (host: string, port: number, retries: number = 15, delay: number = 10000): Promise<void> => {
  return new Promise((resolve, reject) => {
    const tryConnecting = (attempts: number) => {
      if (attempts <= 0) {
        return reject(new Error('MySQL service not ready after several retries'));
      }

      const client = net.createConnection({ host, port }, () => {
        console.log('MySQL is ready!');
        client.end();
        resolve();
      });

      client.on('error', () => {
        console.log(`Waiting for MySQL service... retries left: ${attempts}`);
        client.destroy();
        setTimeout(() => tryConnecting(attempts - 1), delay);
      });
    };

    tryConnecting(retries);
  });
};

