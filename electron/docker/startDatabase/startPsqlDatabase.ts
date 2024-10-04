import type { databaseStoreProps } from "~/types/store";
import Docker from 'dockerode';
import { convertToKebabCase } from "../../functions/convertToKebabCase";

const docker = new Docker()

export const startPsqlDatabase = async (db: databaseStoreProps) => {
    try {
        
        const container = await docker.createContainer({
            Image: `postgres:${db.version}`,
            name: convertToKebabCase(db.name as string),
            Env: [
              `POSTGRES_DB=tables`,         // Database name
              `POSTGRES_USER=${db.user}`,    // MySQL user
              `POSTGRES_PASSWORD=${db.password}`  // MySQL user password
            ],
            ExposedPorts: {
              '5432/tcp': {}
            },
            HostConfig: {
              PortBindings: {
                '5432/tcp': [{ HostPort: `${db.port}` }]
              },
              Binds: [`${db.volumeName}:/var/lib/postgresql/data`]
            },
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