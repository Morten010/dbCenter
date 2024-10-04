export const editorTopNavConst = [
    {
        title: 'Queries',
        icon: 'tabler:sql',
        view: 'query'
    },
    {
        title: 'Table',
        icon: 'heroicons:table-cells',
        view: 'table'
    },
    {
        title: 'Diagram',
        icon: 'bi:diagram-2',
        view: 'diagram'
    }
]

export const databaseChoicesConst = [
    {
        name: 'mysql',
        icon: 'fontisto:mysql'
    },
    {
        name: 'psql',
        icon: 'simple-icons:postgresql'
    },
    {
        name: 'redis',
        icon: 'cib:redis'
    }
]

export const databaseVersionConst = {
    mysql: [
        {
            title: '9.0.0 (latest)',
            value: '9'
        },
        {
            title: '8.4.2',
            value: '8.4.2'
        },
        {
            title: '8.4.0',
            value: '8.4'
        },
        {
            title: '8.0.0',
            value: '8.0'
        },
    ],
    psql: [
        {
            title: '9.0.0 (latest)',
            value: '9'
        },
    ],
    redis: [
        {
            title: '7.4.0 (latest)',
            value: '7.4.0'
        },
    ]
}