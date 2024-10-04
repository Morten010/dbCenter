import { randomBytes } from "crypto"
import Docker from "dockerode"
import type { CreateDatabasePayload } from "~/types/dockerApi"
import { createMysqlDatabase } from "./createMysqlDatabase"
import { createPsqlDatabase } from "./createPsqlDatabase"

const docker = new Docker()

export const createDatabase = async (db: CreateDatabasePayload) => {
    const volumeName = `database-center-${db.database}-${randomBytes(8).toString('hex')}`
    console.log(volumeName);
    
    switch (db.database) {
        case 'mysql':
            const mysqlRes = await createMysqlDatabase(
                volumeName, 
                db
            )
            return mysqlRes
        case 'psql':
            const psqlRes = await createPsqlDatabase(
                volumeName,
                db
            )
            
            return psqlRes
        case 'redis':

            return {
                success: false,
                message: 'Redis is not added yet'
            }
    
        default:
            console.error(`Cannot create a volume from database type ${db.database} must be mysql, psql or redis`)
            return {
                success: false,
                message: 'Failed to create database'
            }
    }
}