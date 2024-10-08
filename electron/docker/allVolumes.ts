import Docker from "dockerode"

const docker = new Docker()

export const allVolumes = async () => {
    return (await docker.listVolumes()).Volumes
        .filter(volume => volume.Name.includes('database-center'))
            .map(volume => volume.Name)
}