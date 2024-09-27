import type { databaseStoreProps } from "~/types/store";
import Docker from "dockerode";

const docker = new Docker();

const stopMysqlDatabase = async (containerId: string) => {
    try{

        console.log(containerId);
        
        const container = docker.getContainer(containerId)

        await container.stop()
        await container.remove()

        return {
            success: true,
            message: 'Database shutdown🛬'
        }

    }catch(error){
        
        console.log(error);
        
        return {
            success: false,
            message: 'Failed to shutdown database⛓️‍💥'
        }
    }
}

export default stopMysqlDatabase