import { Request, Response, NextFunction } from 'express'
import Ajv, { type ValidateFunction } from 'ajv'
import addKeywords from 'ajv-keywords'
import httpErrors from 'http-errors'

import generate from './openapi-schema'

import AppController from '../lib/app-controller'
import oapi, { oapiPathDef } from '../lib/openapi'


export class OfficeController extends AppController {
    init() {
        const ajv = new Ajv({ strict: 'log' })
        addKeywords(ajv, "regexp")

        const schemas = generate()

        const CreateJupyterSchema = schemas.CreateJupyterSchema
        const CreateMarsSchema = schemas.CreateMarsSchema
        const CreateVenusSchema = schemas.CreateVenusSchema

        this.basePath = '/sequelize'

        this.router.post(
            '/notin',
            oapi.validPath(oapiPathDef({
                requestBodySchema: CreateJupyterSchema,
                summary: 'Test Sequelize notIn'
            })),
            this.create
        )

        this.router.post(
            '/not',
            oapi.path(oapiPathDef({
                requestBodySchema: CreateMarsSchema,
                summary: 'Test Sequelize not'
            })),
            this.validate.bind(null, ajv.compile(CreateMarsSchema)),
            this.create
        )

        this.router.post(
            '/is',
            oapi.path(oapiPathDef({
                requestBodySchema: CreateVenusSchema,
                summary: 'Test Sequelize is'
            })),
            this.validate.bind(null, ajv.compile(CreateVenusSchema)),
            this.create
        )
    }

    validate = async (validate: ValidateFunction, req: Request, _: Response, next: NextFunction) => {
        const valid = validate(req.body)
        if (!valid) {
            const err = new Error('Request validation failed')
            err.validationErrors = validate.errors
            err.validationSchema = validate.schema
            return next(httpErrors(400, err))
        }

        next()
    }

    create = async (_: Request, res: Response) => {
        res.end()
    }
}


export default new OfficeController
