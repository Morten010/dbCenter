import Docker from "dockerode";
import getContainerFromVolumeName from "../functions/getContainerFromVolumeName";

const docker = new Docker();

const stopMysqlDatabase = async (volumeName: string) => {
    const {
        success,
        data
    } = await getContainerFromVolumeName(volumeName)
    
    if(!success) return {
        success: false,
        message: 'Failed to shutdown database⛓️‍💥'
    }

    try{

        const container = docker.getContainer(data!)

        await container.stop()
        await container.remove()

        return {
            success: true,
            message: 'Database shutdown🛬'
        }

    }catch(error){
        
        return {
            success: false,
            message: 'Failed to shutdown database⛓️‍💥'
        }
    }
}

export default stopMysqlDatabase