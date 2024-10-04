export type databaseStoreProps = {
    name: string; // Project name
    password: string; // Db password
    port: string; // db port
    user: string; // db user
    database: string; // Add others later like postgresql
    version: string; // 
    volumeName: string;
    status: 'loading' | 'off' | 'on'
    containerId: string | null;
    queries:  {
        name: string,
        query: string,
    }[]
}