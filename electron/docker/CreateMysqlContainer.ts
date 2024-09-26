import type { CreateMysqlPayload } from "~/types/dockerApi";
import Docker from "dockerode"
import { randomBytes } from "crypto";

const docker = new Docker()

export const createMysqlContainer = async (payload: string) => {
  console.log('create');

  const {
    databaseName,
    databasePort,
    databasePassword,
    databaseUser,
  }: CreateMysqlPayload = JSON.parse(payload)
  const volumeName = `DatabaseCenter-mysql-${randomBytes(8).toString('hex')}`


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
    console.log(res);

  } catch (error) {
    console.log('error');
    console.log(error);
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

    await container.remove()

    console.log('container id: ' + container.id);
    
    return {
      success: true,
      message: 'Successfully created database',
      data: {
        volumeName,
      }
    }
  } catch (error) {
    return `error: ${error}`
  }

}