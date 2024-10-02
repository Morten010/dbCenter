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
        liveQuery: (query: string, intervalTime = 2500) => {
            const result = ref<{
                success: boolean;
                data?: any;
                fields?: any;
                message: string;
                error?: string;
            }>({
                success: true,
                data: [],
                message: 'Loading...',
            })
            let intervalId: number | undefined
            
            const fetchData = async () => {
                const payload = JSON.stringify({
                    db: db,
                    query
                })
    
                const response = await mysqlApi.query(payload)
                
                result.value = response
            }

            // Set up the interval for live querying
            setInterval(async () => {
               await fetchData()
            }, intervalTime)
            console.log(result);
            
            // fetch data on mount
            onMounted(() => {
                fetchData()
            })
    
            // Clear the interval when the component is destroyed
            onUnmounted(() => {
                if (intervalId) {
                    clearInterval(intervalId)
                }
            })
    
            return result
        }
    }
}