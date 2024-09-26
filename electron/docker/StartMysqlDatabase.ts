import type { databaseStoreProps } from "~/types/store";
import Docker from "dockerode";

const docker = new Docker();

const StartMysqlDatabase = async (db: databaseStoreProps) => {
    // Create container
    try {
        const container = await docker.createContainer({
            Image: 'mysql:latest',
            name: db.name as string,
            Env: [
                `MYSQL_ROOT_PASSWORD=${db.password}`, // Root password
                `MYSQL_DATABASE=tables`,         // Database name
                `MYSQL_USER=${db.user}`,    // MySQL user
                `MYSQL_PASSWORD=${db.password}`  // MySQL user password
            ],
            ExposedPorts: {
                '3306/tcp': {}
            },
            HostConfig: {
                PortBindings: {
                    '3306/tcp': [{ HostPort: `${db.port}` }]
                },
                Binds: [`${db.volumeName}:/var/lib/mysql`] // Bind the volume to MySQL's data directory
            },
            Volumes: {
                '/var/lib/mysql': {} // Specify the mount point inside the container
            }
        });

        await container.start()

        return {
            success: true,
            message: 'Successfully Started database',
            data: {
                containerId: container.id,
            }
        }
    } catch (error) {
        return {
            success: false,
            message: 'Failed to start database',
            error: JSON.stringify(error)
        }
    }
}

export default StartMysqlDatabase