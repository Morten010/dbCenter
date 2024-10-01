import Docker from "dockerode";

const docker = new Docker()

export const CheckStatus = async (volumeId: string) => {
    // Check if volume exists
    let volume: Docker.Image;
    try{
        volume = docker.getImage(volumeId)
    }catch(err){
        return 'VOLUME_DELETED'
    }

    // Check if volume has any containers connected
    try {
        const containers = await docker.listContainers()

        for(const container of containers){
            console.log(container.Mounts);
        }
        
    } catch (err) {
        console.log('----- err\n');
        console.log(err);
        console.log('----- err\n');
        
    }
    
    
    
    
    // check if container is still alive
    // if still alive but not running close it

    // check if volumeId is connected to an open container

    // Check if container...
}