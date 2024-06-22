import { SchemaManager, OpenApiStrategy } from '@techntools/sequelize-to-openapi'

import User from './models/user'
import Profile from './models/profile'
import Document from './models/document'
import Friendship from './models/friendship'

import Company from '../company/models/company'

import envConfig from '../config'


export default function () {
    const schemaManager = new SchemaManager
    const strategy = new OpenApiStrategy

    const CreateProfileSchema = schemaManager.generate(Profile, strategy, {
        exclude: ['userId', ...envConfig.autoAttributes],
        associations: false
    })

    const GetUserSchema = schemaManager.generate(User, strategy, {
        associations: false
    })
    GetUserSchema.properties['profile'] = schemaManager.generate(Profile, strategy, { associations: false })
    GetUserSchema.properties['company'] = schemaManager.generate(Company, strategy, { associations: false })
    GetUserSchema.properties['documents'] = { items: schemaManager.generate(Document, strategy, { associations: false }) }
    GetUserSchema.properties['friends'] = { items: schemaManager.generate(User, strategy, { associations: false }) }

    const CreateUserSchema = schemaManager.generate(User, strategy, {
        exclude: envConfig.autoAttributes,
        associations: false
    })

    CreateUserSchema.properties['profile'] = CreateProfileSchema

    const UpdateUserSchema = CreateUserSchema
    UpdateUserSchema.properties['profile'] = CreateProfileSchema

    const AddFriendsSchema = {
        type: 'array',
        items: schemaManager.generate(Friendship, strategy, {
            include: ['friendId'],
            associations: false
        })
    }

    const GetFriendsSchema = (() => {
        const GetFriendsSchema = structuredClone(GetUserSchema)

        delete GetFriendsSchema.properties['documents']
        delete GetFriendsSchema.properties['friends']

        return GetFriendsSchema
    })()

    const RemoveFriendsSchema = {
        type: 'array',
        items: {
            type: 'integer',
            minimum: 1
        }
    }

    const GetDocumentsSchema = GetUserSchema.properties['documents']['items']

    const RemoveDocumentsSchema = {
        type: 'array',
        items: {
            type: 'integer',
            minimum: 1
        }
    }

    const UploadDocumentSchema = {
        type: 'object',
        properties: {
            file: {
                type: 'string',
                format: 'binary'
            }
        }
    }

    return {
        CreateUserSchema,
        GetUserSchema,
        UpdateUserSchema,

        CreateProfileSchema,

        AddFriendsSchema,
        GetFriendsSchema,
        RemoveFriendsSchema,

        GetDocumentsSchema,
        RemoveDocumentsSchema,

        UploadDocumentSchema
    }
}
