export type databaseStoreProps = {
    name: string; // Project name
    password: string; // Db password
    port: string; // db port
    user: string; // db user
    database: 'mysql'; // Add others later like postgresql
    version: '9.0.0' |'8.4.1'; // 
    volumeName: string;
    status: 'loading' | 'off' | 'on'
    containerId: string | null;
}