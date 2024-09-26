import { toast } from "vue-sonner"
import type { CreateMysqlPayload } from "~/types/dockerApi"
import type { databaseStoreProps } from "~/types/store"

export const useDbStore = defineStore('dbStore', {
    state: () => ({
        databases: useLocalStorage('db', [] as databaseStoreProps[])
    }),
    getters: {
        allDatabases: (state) => {
            return state.databases
        },
        getSpecificContainer: (state) => {
            return (volumeName: string) => {
                return state.databases.find(db => db.volumeName === volumeName)
            }
        },
        getSpecificContainerByContainerID: (state) => {
            return (containerId: string) => {
                return state.databases.find(db => db.containerId === containerId)
            }
        },
    },
    actions: {
        async addDatabase(db: CreateMysqlPayload) {
            console.log(db);
            
            const res = await useDocker.createMysqlContainer(JSON.stringify(db)) 
            
            console.log(db);
            console.log(res);
            
            if(!res.success) return toast.error(res.message)

            toast.success('You are invited to the diddy freak off')
             this.databases = [...this.databases, {
                database: 'mysql',
                name: db.databaseName,
                password: db.databasePassword,
                port: db.databasePort.toString(),
                status: 'off',
                user: db.databaseUser,
                version: '9.0.0',
                volumeName: res.data.volumeName,
                containerId: null
            }]

            return true
        },
       async startDatabase(volumeName: string){
            const db = this.getSpecificContainer(volumeName)
            console.log('db: '+db);
            
            if(!db) return toast.error('Failed to find database')
            
            this.updateDatabase({
                ...db,
                status: 'loading'
            })

            await new Promise(resolve => setTimeout(resolve, 1000))


            const res =  await useDocker.startContainer(JSON.stringify(db))

            if(!res.success) {
                toast.error('failed to start database')
                this.updateDatabase({
                    ...db,

                })
                return
            }

            this.updateDatabase({
                ...db,
                status: 'on',
                containerId: res.data.containerId
            })
            toast.success('Successfully started db')
        },
        async stopDatabase(containerId: string){
            // Get database
            const db = this.getSpecificContainerByContainerID(containerId)

            if(!db) return toast.error('Failed to find db')

            // set loading
            this.updateDatabase({
                ...db,
                status: 'loading'
            })


            const res = await useDocker.stopContainer(containerId)
            
            if(!res.success) {
                toast.error(res.message)
                // remove loading
                this.updateDatabase({
                    ...db,
                    status: 'on'
                })
                return
            }

            toast.success(res.message)
            // set loading
            this.updateDatabase({
                ...db,
                status: 'off'
            })
            return
        },
        updateDatabase(updatedDb: databaseStoreProps) {
            this.databases = [...this.databases.map((database) => {
                if(database.volumeName !== updatedDb.volumeName) return database

                return updatedDb
            })]
        },
        deleteDatabase(volumeName: string) {
            // ! remove database volume

            this.databases = this.databases.filter(db => db.volumeName === volumeName)
        },
    }
})