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
            this.create
        )

        this.router.get(
            '/',
            oapi.validPath(oapiPathDef({
                includePaginationParams: true,
                includeSearchParam: true,
                responseData: paginatedResponse(GetCompanySchema),
                summary: 'Get Companies'
            })),
            this.findAll
        )

        this.router.get(
            '/:id',
            oapi.validPath(oapiPathDef({
                responseData: GetCompanySchema,
                summary: 'Get Company'
            })),
            this.findById
        )

        this.router.patch(
            '/:id',
            oapi.validPath(oapiPathDef({
                requestBodySchema: UpdateCompanySchema,
                summary: 'Update Company'
            })),
            this.update
        )

        this.router.delete(
            '/:id',
            oapi.validPath(oapiPathDef({
                summary: 'Delete Company'
            })),
            this.remove
        )

        return this
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        res.success(companyService.create(req.body), next)
    }

    findAll = async (req: Request, res: Response, next: NextFunction) => {
        res.success(companyService.findAll(
            plainToClass(PageOptions, req.query),
            req.query.q as string
        ), next)
    }

    findById = async (req: Request, res: Response, next: NextFunction) => {
        res.success(companyService.findById(parseInt(req.params.id)), next)
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        res.success(companyService.update(parseInt(req.params.id), req.body), next)
    }

    remove = async (req: Request, res: Response, next: NextFunction) => {
        res.success(companyService.remove(parseInt(req.params.id)), next)
    }
}


export default new CompanyController
