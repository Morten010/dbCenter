import Docker from 'dockerode'

const docker = new Docker()

const getContainerFromVolumeName = async (volumeId: string) => {
    const containers = await docker.listContainers()

    for(const container of containers){
        for(const mount of container.Mounts){
            if(mount.Name === volumeId) return {
                data: container.Id,
                success: true
            }
        }
    }
    return {
        success: false
    }
}

export default getContainerFromVolumeName