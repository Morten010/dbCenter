import type { databaseStoreProps } from "~/types/store";
import stopMysqlDatabase from "./StopMysqlDatabase";
import Docker from 'dockerode';

const docker = new Docker()

export const deleteMysqlDatabase = async (db: databaseStoreProps) => {
   try {
     // if database open close it
     if(db.containerId){
        await stopMysqlDatabase(db.containerId)
    }

    // delete volume
    const volume = docker.getVolume(db.volumeName)

    await volume.remove()

    return {
        success: true,
        message: 'Deleted database'
    }
   } catch (error) {
    return {
        success: false,
        message: 'failed to delete database'
    }
   }
}