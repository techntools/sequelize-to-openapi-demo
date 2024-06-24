import { Request, Response, NextFunction } from 'express'

import { plainToClass } from 'class-transformer'

import companyService from './service'
import generate from './openapi-schema'

import AppController from '../lib/app-controller'
import { PageOptions } from '../lib/pagination'

import oapi, { oapiPathDef, paginatedResponse } from '../lib/openapi'


export class CompanyController extends AppController {
    init() {
        const schemas = generate()

        const CreateCompanySchema = schemas.CreateCompanySchema
        const UpdateCompanySchema = schemas.UpdateCompanySchema
        const GetCompanySchema = schemas.GetCompanySchema

        this.basePath = '/company'

        this.router.post(
            '/',
            oapi.validPath(oapiPathDef({
                requestBodySchema: CreateCompanySchema,
                summary: 'Create Company'
            })),
            AppController.asyncHandler(this.create),
        )

        this.router.get(
            '/',
            oapi.validPath(oapiPathDef({
                includePaginationParams: true,
                includeSearchParam: true,
                responseData: paginatedResponse(GetCompanySchema),
                summary: 'Get Companies'
            })),
            AppController.asyncHandler(this.findAll),
        )

        this.router.get(
            '/:id',
            oapi.validPath(oapiPathDef({
                responseData: GetCompanySchema,
                summary: 'Get Company'
            })),
            AppController.asyncHandler(this.findById),
        )

        this.router.patch(
            '/:id',
            oapi.validPath(oapiPathDef({
                requestBodySchema: UpdateCompanySchema,
                summary: 'Update Company'
            })),
            AppController.asyncHandler(this.update),
        )

        this.router.delete(
            '/:id',
            oapi.validPath(oapiPathDef({
                summary: 'Delete Company'
            })),
            AppController.asyncHandler(this.remove),
        )

        return this
    }

    create = async (req: Request) => {
        return companyService.create(req.body)
    }

    findAll = async (req: Request) => {
        return companyService.findAll(
            plainToClass(PageOptions, req.query),
            req.query.q as string
        )
    }

    findById = async (req: Request) => {
        return companyService.findById(parseInt(req.params.id))
    }

    update = async (req: Request) => {
        return companyService.update(parseInt(req.params.id), req.body)
    }

    remove = async (req: Request) => {
        return companyService.remove(parseInt(req.params.id))
    }
}


export default new CompanyController
