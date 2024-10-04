import Docker from 'dockerode';
import { waitForMysql } from '../../functions/waitForMysql';
import type { CreateDatabasePayload } from '~/types/dockerApi';
import { convertToKebabCase } from '../../functions/convertToKebabCase';

const docker = new Docker();

export const createMysqlDatabase = async (volumeName: string, db: CreateDatabasePayload) => {
    // Pull mysql image if not existing
    try {
        await docker.pull(`mysql:${db.version.value}`, (err: any, stream: any) => {
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
            message: 'Failed to create database.'
        }
    }

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
            Image: `mysql:${db.version.value}`,
            name: convertToKebabCase(db.databaseName) as string,
            Env: [
              `MYSQL_ROOT_PASSWORD=${db.databasePassword}`, // Root password
              `MYSQL_DATABASE=tables`,         // Database name
              `MYSQL_USER=${db.databaseUser}`,    // MySQL user
              `MYSQL_PASSWORD=${db.databasePassword}`  // MySQL user password
            ],
            ExposedPorts: {
              '3306/tcp': {}
            },
            HostConfig: {
              PortBindings: {
                '3306/tcp': [{ HostPort: `${db.databasePort}` }]
              },
              Binds: [`${volumeName}:/var/lib/mysql`] // Bind the volume to MySQL's data directory
            },
            Volumes: {
              '/var/lib/mysql': {} // Specify the mount point inside the container
            }
        });

        await container.start()
        try{
            await waitForMysql('127.0.0.1', Number(db.databasePort))
        }catch(err){
            console.log('err: ', err);
        }
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