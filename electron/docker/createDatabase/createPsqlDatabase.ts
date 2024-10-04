import Docker from 'dockerode';
import type { CreateDatabasePayload } from '~/types/dockerApi';
import { convertToKebabCase } from '../../functions/convertToKebabCase';
const docker = new Docker();

export const createPsqlDatabase = async (volumeName: string, db: CreateDatabasePayload) => {
    // Pull mysql image if not existing
    try {
        await docker.pull(`postgres:${db.version.value}`, (err: any, stream: any) => {
            if (err) {
              console.error('Error pulling postgres image:', err);
              return;
            }
            docker.modem.followProgress(stream, (err, res) => {
              if (err) {
                console.error('Pull postgres progress error:', err)
                return 'Failed to pull postgres image'
              };
            });
        });
    } catch (error) {
        return {
            success: false,
            message: 'Failed to create database.'
        }
    }
    console.log('downloaded');
    

    // Create volume
    try {
        const res = await docker.createVolume({
            Name: volumeName,
        })
    } catch (error) {
        return {
            success: false,
            message: 'Failed to create database.'
        }
    }

    // Create mysql container
    try {
        const container = await docker.createContainer({
            Image: `postgres:${db.version.value}`,
            name: convertToKebabCase(db.databaseName as string),
            Env: [
              `POSTGRES_DB=tables`,         // Database name
              `POSTGRES_USER=${db.databaseUser}`,    // MySQL user
              `POSTGRES_PASSWORD=${db.databasePassword}`  // MySQL user password
            ],
            ExposedPorts: {
              '5432/tcp': {}
            },
            HostConfig: {
              PortBindings: {
                '5432/tcp': [{ HostPort: `${db.databasePort}` }]
              },
              Binds: [`${volumeName}:/var/lib/postgresql/data`]
            },
        });

        await container.start()
        // try{
        //     await waitForMysql('127.0.0.1', Number(db.databasePort))
        // }catch(err){
        //     console.log('err: ', err);
        // }
        await container.stop()
        await container.remove()

        return {
            success: true,
            message: 'Successfully created database',
            data: {
              volumeName,
            }
        }
    } catch (err: any) {
        let error: string = 'Failed to create db';
    
        if(err.message.includes('Conflict. The container name')){
        // Set custom error
        error = `Container named ${db.databaseName} already exists.`

        // remove volume again
        const volume = docker.getVolume(volumeName)
        await volume.remove()
        }

        return {
            success: false,
            message: error
        }
    }
}