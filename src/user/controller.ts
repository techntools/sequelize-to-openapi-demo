import { Request, Response, NextFunction } from 'express'

import { plainToClass } from 'class-transformer'

import userService from './service'
import generate from './openapi-schema'

import AppController from '../lib/app-controller'
import { PageOptions } from '../lib/pagination'
import oapi, { oapiPathDef, paginatedResponse } from '../lib/openapi'
import fileupload from '../lib/file-upload'


export class UserController extends AppController {
    init() {
        const schemas = generate()

        const CreateUserSchema = schemas.CreateUserSchema
        const GetUserSchema = schemas.GetUserSchema
        const UpdateUserSchema = schemas.UpdateUserSchema
        const AddFriendsSchema = schemas.AddFriendsSchema
        const GetFriendsSchema = schemas.GetFriendsSchema
        const RemoveFriendsSchema = schemas.RemoveFriendsSchema
        const GetDocumentsSchema = schemas.GetDocumentsSchema
        const RemoveDocumentsSchema = schemas.RemoveDocumentsSchema
        const UploadDocumentSchema = schemas.UploadDocumentSchema

        const CreateProfileSchema = schemas.CreateProfileSchema

        this.basePath = '/user'

        userService.init()

        this.router.post(
            '/',
            oapi.validPath(oapiPathDef({
                requestBodySchema: CreateUserSchema,
                summary: 'Create User'
            })),
            this.create
        )

        this.router.get(
            '/:id',
            oapi.validPath(oapiPathDef({
                summary: 'Get User'
            })),
            this.findOne
        )

        this.router.get(
            '/',
            oapi.validPath(oapiPathDef({
                includePaginationParams: true,
                includeSearchParam: true,
                responseData: paginatedResponse(GetUserSchema),
                summary: 'Get Users'
            })),
            this.findAll
        )

        this.router.patch(
            '/:id',
            oapi.validPath(oapiPathDef({
                requestBodySchema: UpdateUserSchema,
                summary: 'Update User'
            })),
            this.update
        )

        this.router.delete(
            '/:id',
            oapi.validPath(oapiPathDef({
                summary: 'Delete User'
            })),
            this.remove
        )

        this.router.post(
            '/:id/profile',
            oapi.validPath(oapiPathDef({
                requestBodySchema: CreateProfileSchema,
                summary: 'Update Profile'
            })),
            this.updateProfile
        )

        this.router.post(
            '/:id/friends',
            oapi.validPath(oapiPathDef({
                requestBodySchema: AddFriendsSchema,
                summary: 'Add Friends'
            })),
            this.addFriends
        )

        this.router.delete(
            '/:id/friends',
            oapi.validPath(oapiPathDef({
                requestBodySchema: RemoveFriendsSchema,
                summary: 'Remove Friends'
            })),
            this.removeFriends
        )

        this.router.get(
            '/:id/friends',
            oapi.validPath(oapiPathDef({
                includePaginationParams: true,
                includeSearchParam: true,
                responseData: paginatedResponse(GetFriendsSchema),
                summary: 'Get Friends'
            })),
            this.findFriends
        )

        this.router.get(
            '/:id/documents',
            oapi.validPath(oapiPathDef({
                includePaginationParams: true,
                includeSearchParam: true,
                responseData: paginatedResponse(GetDocumentsSchema),
                summary: 'Get Documents'
            })),
            this.findDocuments
        )

        this.router.delete(
            '/:id/documents',
            oapi.validPath(oapiPathDef({
                requestBodySchema: RemoveDocumentsSchema,
                summary: 'Remove Documents'
            })),
            this.removeFriends
        )

        this.router.post(
            '/:id/document/upload',
            oapi.validPath(oapiPathDef({
                multipart: true,
                requestBodySchema: UploadDocumentSchema,
                summary: 'Upload Document'
            })),
            AppController.asyncHandler(fileupload),
            this.uploadDocument
        )

        return this
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        res.success(userService.create(req.body), next)
    }

    findAll = async (req: Request, res: Response, next: NextFunction) => {
        res.success(userService.findAll(
            plainToClass(PageOptions, req.query),
            req.query.q as string
        ), next)
    }

    findOne = async (req: Request, res: Response, next: NextFunction) => {
        res.success(userService.findById(parseInt(req.params.id)), next)
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        res.success(userService.update(parseInt(req.params.id), req.body), next)
    }

    remove = async (req: Request, res: Response, next: NextFunction) => {
        res.success(userService.remove(parseInt(req.params.id)), next)
    }

    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        res.success(userService.updateProfile(parseInt(req.params.id), req.body), next)
    }

    addFriends = async (req: Request, res: Response, next: NextFunction) => {
        res.success(userService.addFriends(parseInt(req.params.id), req.body), next)
    }

    removeFriends = async (req: Request, res: Response, next: NextFunction) => {
        res.success(userService.removeFriends(parseInt(req.params.id), req.body), next)
    }

    findFriends = async (req: Request, res: Response, next: NextFunction) => {
        res.success(userService.findFriends(
            parseInt(req.params.id),
            plainToClass(PageOptions, req.query),
            req.query.q as string
        ), next)
    }

    findDocuments = async (req: Request, res: Response, next: NextFunction) => {
        res.success(userService.findDocuments(
            parseInt(req.params.id),
            plainToClass(PageOptions, req.query),
            req.query.q as string
        ), next)
    }

    removeDocuments = async (req: Request, res: Response, next: NextFunction) => {
        res.success(userService.removeDocuments(parseInt(req.params.id), req.body), next)
    }

    uploadDocument = async (req: Request, res: Response, next: NextFunction) => {
        res.success(userService.uploadDocument(parseInt(req.params.id), req['files']), next)
    }
}


export default new UserController
