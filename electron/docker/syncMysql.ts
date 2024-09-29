import Docker from "dockerode"

const docker = new Docker()

export const syncMysql = async () => {
    const allVolumes = await docker.listVolumes()
    
    return allVolumes
}