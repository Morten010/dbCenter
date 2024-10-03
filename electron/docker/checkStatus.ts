import Docker from "dockerode";

const docker = new Docker()

export const CheckStatus = async (volumeId: string) => {
    // Check if volume exists
    let volume: Docker.Volume;
    try{
        volume = docker.getVolume(volumeId)
        await volume.inspect()
    }catch(err){
        return 'VOLUME_DELETED'
    }

    // Check if volume has any containers connected
    try {
        const AllContainers = await docker.listContainers({
            all: true,
        })
        const containers = AllContainers.filter(c => {
            let pass = false
            for(const mount of c.Mounts){
                if(mount.Name?.includes('database-center')){
                    pass = true
                }
            }

            return pass
        })
        
        for(const container of containers){
            if(container.State !== 'running'){
                const c = docker.getContainer(container.Id)

                await c.remove()
                return 'OFF'
            }
            
            for(const mount of container.Mounts){
                if(mount.Name === volumeId){
                    return 'ON'
                }
            }
        }
        
        return 'OFF'
    } catch (err) {
        console.log(err);
    }
    
    
    // check if container is still alive
    // if still alive but not running close it

    // check if volumeId is connected to an open container

    // Check if container...
    return 'nothing'
}