import type { CreateMysqlPayload } from "~/types/dockerApi";
import Docker from "dockerode"
import { randomBytes } from "crypto";
import { waitForMysql } from "../functions/waitForMysql";

const docker = new Docker()

export const createMysqlContainer = async (payload: string) => {
  const {
    databaseName,
    databasePort,
    databasePassword,
    databaseUser,
  }: CreateMysqlPayload = JSON.parse(payload)
  const volumeName = `database-center-mysql-${randomBytes(8).toString('hex')}`

  // check if correct data is recieved
  if (!databaseName) return {
    success: false,
    message: 'Database name is wrong'
  }
  if (!databasePort) return {
    success: false,
    message: 'Database port is wrong'
  }
  if (!databasePassword) return {
    success: false,
    message: 'Database password is wrong'
  }
  if (!databaseUser) return {
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
  try {
    const res = await docker.createVolume({
      Name: volumeName,
    })

  } catch (error) {
    console.log('failed to create volume');
  }

  // Create container
  try {
    const container = await docker.createContainer({
      Image: 'mysql:latest',
      name: databaseName as string,
      Env: [
        `MYSQL_ROOT_PASSWORD=${databasePassword}`, // Root password
        `MYSQL_DATABASE=tables`,         // Database name
        `MYSQL_USER=${databaseUser}`,    // MySQL user
        `MYSQL_PASSWORD=${databasePassword}`  // MySQL user password
      ],
      ExposedPorts: {
        '3306/tcp': {}
      },
      HostConfig: {
        PortBindings: {
          '3306/tcp': [{ HostPort: `${databasePort}` }]
        },
        Binds: [`${volumeName}:/var/lib/mysql`] // Bind the volume to MySQL's data directory
      },
      Volumes: {
        '/var/lib/mysql': {} // Specify the mount point inside the container
      }
    });
    await container.start()
    try{
      await waitForMysql('127.0.0.1', databasePort)
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
      error = `Container named ${databaseName} already exists.`

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