import { Dialect } from 'sequelize'

import { validateOrReject, IsArray, IsInt, IsString } from 'class-validator'


export class DatabaseConfig {
    @IsString()
    dialect: Dialect

    @IsString()
    name: string

    @IsString()
    username: string

    @IsString()
    password: string
}


export class EnvConfig {
    @IsInt()
    port: number

    @IsString()
    debug: string

    @IsString()
    apiPrefix: string

    @IsString()
    serviceName: string

    @IsArray()
    autoAttributes: string[]

    dbConfig: DatabaseConfig

    async init() {
        this.port = parseInt(process.env.PORT)
        this.debug = String(process.env.DEBUG)

        this.apiPrefix = process.env.API_PREFIX

        this.serviceName = process.env.SERVICE_NAME

        this.autoAttributes = [
            'id',
            'createdAt',
            'updatedAt',
        ]

        this.dbConfig = new DatabaseConfig
        this.dbConfig.dialect = process.env.DB_DIALECT as Dialect
        this.dbConfig.name = process.env.DB_NAME
        this.dbConfig.username = process.env.DB_USERNAME
        this.dbConfig.password = process.env.DB_PASSWORD

        Object.freeze(this)

        await validateOrReject(this.dbConfig)
        await validateOrReject(this)
    }
}


export default new EnvConfig;
