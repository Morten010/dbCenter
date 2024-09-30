export type MysqlApiProps = {
    query: (payload: string) => Promise<{
        success: boolean,
        data?: any,
        fields?: any,
        message: string
      } >;
}