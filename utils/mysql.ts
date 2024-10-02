import { useDbStore } from "~/store/dbStore"

export const useMysql = async () => {
    const route = useRoute()
    const { getSpecificContainer } = useDbStore()
    const id = route.params?.id as string

    if(!id) throw new Error('useMysql cannot be used outside the editor route')

    const db = getSpecificContainer(id)

    const mysqlApi = window.mysql

    return {
        ...mysqlApi,
        query: async (query: string) => {
            const payload = JSON.stringify({
                db: db,
                query
            })

            return await mysqlApi.query(payload)
        },
        liveQuery: () => {

        }
    }
}