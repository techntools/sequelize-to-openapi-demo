import { Request, Response } from 'express'

import generate from './openapi-schema'

import AppController from '../lib/app-controller'
import oapi, { oapiPathDef } from '../lib/openapi'


export class OfficeController extends AppController {
    init() {
        const schemas = generate()

        const CreateJupyterSchema = schemas.CreateJupyterSchema
        const CreateMarsSchema = schemas.CreateMarsSchema
        const CreateVenusSchema = schemas.CreateVenusSchema

        this.basePath = '/sequelize'

        this.router.post(
            '/notin',
            oapi.validPath(
                oapiPathDef({
                    requestBodySchema: CreateJupyterSchema,
                    summary: 'Test Sequelize notIn'
                }),
                { keywords: ['regexp'] }
            ),
            this.handleReq
        )

        this.router.post(
            '/not',
            oapi.validPath(
                oapiPathDef({
                    requestBodySchema: CreateMarsSchema,
                    summary: 'Test Sequelize not'
                }),
                { keywords: ['regexp'] }
            ),
            this.handleReq
        )

        this.router.post(
            '/is',
            oapi.validPath(
                oapiPathDef({
                    requestBodySchema: CreateVenusSchema,
                    summary: 'Test Sequelize is'
                }),
                { keywords: ['regexp'] }
            ),
            this.handleReq
        )
    }

    handleReq = (_: Request, res: Response) => {
        res.end()
    }
}


export default new OfficeController
