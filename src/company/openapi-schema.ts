import { SchemaManager, OpenApiStrategy } from '@techntools/sequelize-to-openapi'

import Company from './models/company'

import envConfig from '../config'


export default function () {
    const schemaManager = new SchemaManager
    const strategy = new OpenApiStrategy

    const CreateCompanySchema = schemaManager.generate(Company, strategy, {
        exclude: envConfig.autoAttributes,
        associations: false
    })

    const GetCompanySchema = schemaManager.generate(Company, strategy, {
        associations: false
    })

    const UpdateCompanySchema = structuredClone(CreateCompanySchema)

    return {
        CreateCompanySchema,
        GetCompanySchema,
        UpdateCompanySchema
    }
}
