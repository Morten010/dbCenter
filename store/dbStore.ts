import { toast } from "vue-sonner"
import type { CreateDatabasePayload } from "~/types/dockerApi"
import type { databaseStoreProps } from "~/types/store"

export const useDbStore = defineStore('dbStore', {
    state: () => ({
        databases: useLocalStorage('db', [] as databaseStoreProps[])
    }),
    getters: {
        allDatabases: (state) => {
            return state.databases
        },
        allDatabasesNames: (state) => {
            return state.databases.map(db => db.volumeName)
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
        allQueries: (state => {
            return (volumeId: string) => {
                return state.databases.find(db => db.volumeName == volumeId)?.queries
            } 
        })
    },
    actions: {
        async addExistingDatabase(volumeName: string) {
            this.databases = [...this.databases, {
                database: 'mysql',
                name: 'Unknown-database',
                password: 'mypassword',
                port: '3306',
                status: 'off',
                user: 'admin',
                version: '9.0.0',
                volumeName: volumeName,
                containerId: null,
                queries: []
            }]

            toast.success('Found unknown database', {
                description: 'You can check the content and rename it properly or delete it.'
            })

        },
        async addDatabase(db: CreateDatabasePayload) {
            
            const res = await useDocker.createDatabase(JSON.stringify(db)) 
            
            if(!res.success) {
                toast.error(res.message)
                return false
            }

            toast.success('Successfully created database💥')
             this.databases = [...this.databases, {
                database: db.database,
                name: db.databaseName,
                password: db.databasePassword,
                port: db.databasePort.toString(),
                status: 'off',
                user: db.databaseUser,
                version: db.version.value,
                volumeName: res.data.volumeName,
                containerId: null,
                queries: []
            }]

            return true
        },
       async startDatabase(volumeName: string){
            const db = this.getSpecificContainer(volumeName)
            
            if(!db) return toast.error('Failed to find database')
            
            this.updateDatabase({
                ...db,
                status: 'loading'
            })

            await new Promise(resolve => setTimeout(resolve, 1000))


            const res =  await useDocker.startDatabase(JSON.stringify(db))

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


            const res = await useDocker.stopDatabase(db.volumeName)
            
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
                status: 'off',
                containerId: null
            })
            return
        },
        updateDatabase(updatedDb: databaseStoreProps) {
            this.databases = [...this.databases.map((database) => {
                if(database.volumeName !== updatedDb.volumeName) return database

                return updatedDb
            })]
        },
        async deleteDatabase(volumeName: string) {
            console.log('Volume name: ' + volumeName);
            console.log('Volume name');
            
            const db = this.getSpecificContainer(volumeName)

            if(!db) return toast('Failed to find database🔍')

            const payload = JSON.stringify(db)

            const res = await useDocker.deleteMysqlContainer(payload)

            if(!res.success) return toast.error('Failed to delete database😵')

            toast.success('Successfully deleted🥇')

            
            this.databases = this.databases.filter(db => db.volumeName !== volumeName)
        },
        async deleteMissingDb(volumeName: string) {
            this.databases = [
                ...this.databases.filter(db => db.volumeName !== volumeName)
            ]
        },

        // queries
        addQuery({
            query,
            name,
            volumeId
        }: {
            query: string;
            name: string;
            volumeId: string
        }) {
            const db = this.getSpecificContainer(volumeId)

            if(!db) return toast.error('Failed to save query.')
            this.updateDatabase({
                ...db,
                queries: [
                    ...db.queries,
                    {
                        query,
                        name
                    }
                ]
            })
        },
        removeQuery() {
            return 'add this'
        },
        getQuery(queryName: string, volumeName: string) {
            const db = this.getSpecificContainer(volumeName)

            if(!db || !db.queries) return ''

            const query = db.queries?.find(query => query.name === queryName)

            if(query) return query?.query

            return ''
        },
    }
})