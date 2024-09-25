import Docker from "dockerode"

const docker = new Docker()

const createMysqlContainer = async ({
    databaseName,
    databasePort,
    databasePassword,
    databaseUser
}: {
    databaseName: string,
    databasePort: string,
    databasePassword: string,
    databaseUser: string
}) => {
    console.log("check");
    

    try {
        // pull mysql image if not there
        const res1 = await docker.pull('mysql:latest', (err: any, stream: any) => {
            if (err) {
              console.error('Error pulling MySQL image:', err);
              return;
            }
            docker.modem.followProgress(stream, (err, res) => {
              if (err) {
                console.error('Pull progress error:', err)
                return 'Failed to pull mysql image'
            };
              console.log('Image pulled:', res);
              return 'Successfully pulled image'
            });
        });
        console.log(`res2: ${res1}`);
        

        const res2 = await docker.createContainer({
            Image: 'mysql:latest',
            name: databaseName as string,
            Env: [
              `MYSQL_ROOT_PASSWORD=${databasePassword}`, // Root password
              `MYSQL_DATABASE=${databaseName}`,         // Database name
              `MYSQL_USER=${databaseUser}`,                 // MySQL user
              `MYSQL_PASSWORD=${databasePassword}`          // MySQL user password
            ],
            ExposedPorts: {
              '3306/tcp': {}
            },
            HostConfig: {
              PortBindings: {
                '3306/tcp': [{ HostPort: databasePort }]
              }
            }
        })

        console.log(`res2: ${res2}`);
        

        console.log("success");
        return true
    } catch (error) {
        console.log(error);
        
        console.log("failed: " + error);
        
        return false
    }

}

export default createMysqlContainer