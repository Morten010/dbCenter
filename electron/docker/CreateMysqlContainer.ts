import type { CreateMysqlPayload } from "~/types/dockerApi";
import Docker from "dockerode"

const docker = new Docker()

export const createMysqlContainer = async (payload: string) => {
    const {
        databaseName,
        databasePort,
        databasePassword,
        databaseUser,
    }: CreateMysqlPayload = JSON.parse(payload);

    
    // check if correct data is recieved
    if(!databaseName) return {
        success: false,
        message: 'Database name is wrong'
    }
    if(!databasePort) return {
        success: false,
        message: 'Database port is wrong'
    }
    if(!databasePassword) return {
        success: false,
        message: 'Database password is wrong'
    }
    if(!databaseUser) return {
        success: false,
        message: 'Database user is wrong'
    }

    // pull mysql instance if it dosen't exist
    try {
        await docker.pull('mysql:latest', (err: any, stream: any) => {
            if (err) {
              console.error('Error pulling MySQL image:', err);
              return;
            }
            docker.modem.followProgress(stream, (err, res) => {
              if (err) {
                console.error('Pull progress error:', err)
                return 'Failed to pull mysql image'
            };
            });
          });
    } catch (error) {
        return {
            success: false,
            message: 'Something went wrong trying to create the database'
        }
    }

    // Create volume

    // Create container
    try {
        await docker.createContainer({
            Image: 'mysql:latest',
            name: databaseName as string,
            Env: [
              `MYSQL_ROOT_PASSWORD=${databasePassword}`, // Root password
              `MYSQL_DATABASE=tables`,         // Database name
              `MYSQL_USER=${databaseUser}`,                 // MySQL user
              `MYSQL_PASSWORD=${databasePassword}`          // MySQL user password
            ],
            ExposedPorts: {
              '3306/tcp': {}
            },
            HostConfig: {
              PortBindings: {
                '3306/tcp': [{ HostPort: `${databasePort}` }]
              }
            }
          });
        return "success"
    } catch (error) {
        return `error: ${error}`
    }
}