import Docker from "dockerode";

const docker = new Docker()

export const CheckStatus = async (volumeId: string) => {
    // Check if volume exists
    let volume: Docker.Volume;
    try{
        volume = docker.getVolume(volumeId)
        const insp = await volume.inspect()
        console.log(volume);
        console.log(insp);
        
    }catch(err){
        return 'VOLUME_DELETED'
    }

    // Check if volume has any containers connected
    try {
        const containers = await docker.listContainers()

        for(const container of containers){
            for(const mount of container.Mounts){
                
            }
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
    return 'nothing'
}