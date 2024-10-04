import type { databaseStoreProps } from "~/types/store";
import Docker from "dockerode";
import { startMysqlDatabase } from "./startMysqlDatabase";
import { startPsqlDatabase } from "./startPsqlDatabase";

const docker = new Docker();

const StartDatabase = async (db: databaseStoreProps) => {
    // Create container
   switch (db.database) {
    case 'mysql':
        const mysqlRes = await startMysqlDatabase(db)

        return mysqlRes
    case 'psql':
        const psqlRes = await startPsqlDatabase(db)
        
        return psqlRes
    case 'redis':
        
        return {
            success: false,
            message: 'Redis is not added yet'
        }
    default:
        
        return {
            success: false,
            message: 'Could not close database try and restart the app'
        }
   }
}

export default StartDatabase