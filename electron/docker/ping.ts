import Docker from 'dockerode';

const docker = new Docker()

export const pingDocker = async () => {
    try {
        // Ping docker to check connection
        const ping = await docker.ping();
    
        // turn binary into string
        const pingstr = Buffer.from(ping).toString("utf-8");
    
        return pingstr === "OK";
      } catch (error) {
        return false
      }
} 