export type updateApiProps = {
    check: () => Promise<{
        success: boolean;
        message: string;
        data?: any,
        currentVersion: string
    }>
    run: () => Promise<{
        success: boolean,
        message: string
    }>
}