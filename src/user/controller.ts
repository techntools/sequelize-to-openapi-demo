import { Request } from 'express'

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
            AppController.asyncHandler(this.create),
        )

        this.router.get(
            '/:id',
            oapi.validPath(oapiPathDef({
                summary: 'Get User'
            })),
            AppController.asyncHandler(this.findOne),
        )

        this.router.get(
            '/',
            oapi.validPath(oapiPathDef({
                includePaginationParams: true,
                includeSearchParam: true,
                responseData: paginatedResponse(GetUserSchema),
                summary: 'Get Users'
            })),
            AppController.asyncHandler(this.findAll),
        )

        this.router.patch(
            '/:id',
            oapi.validPath(oapiPathDef({
                requestBodySchema: UpdateUserSchema,
                summary: 'Update User'
            })),
            AppController.asyncHandler(this.update),
        )

        this.router.delete(
            '/:id',
            oapi.validPath(oapiPathDef({
                summary: 'Delete User'
            })),
            AppController.asyncHandler(this.remove),
        )

        this.router.post(
            '/:id/profile',
            oapi.validPath(oapiPathDef({
                requestBodySchema: CreateProfileSchema,
                summary: 'Update Profile'
            })),
            AppController.asyncHandler(this.updateProfile),
        )

        this.router.post(
            '/:id/friends',
            oapi.validPath(oapiPathDef({
                requestBodySchema: AddFriendsSchema,
                summary: 'Add Friends'
            })),
            AppController.asyncHandler(this.addFriends),
        )

        this.router.delete(
            '/:id/friends',
            oapi.validPath(oapiPathDef({
                requestBodySchema: RemoveFriendsSchema,
                summary: 'Remove Friends'
            })),
            AppController.asyncHandler(this.removeFriends),
        )

        this.router.get(
            '/:id/friends',
            oapi.validPath(oapiPathDef({
                includePaginationParams: true,
                includeSearchParam: true,
                responseData: paginatedResponse(GetFriendsSchema),
                summary: 'Get Friends'
            })),
            AppController.asyncHandler(this.findFriends),
        )

        this.router.get(
            '/:id/documents',
            oapi.validPath(oapiPathDef({
                includePaginationParams: true,
                includeSearchParam: true,
                responseData: paginatedResponse(GetDocumentsSchema),
                summary: 'Get Documents'
            })),
            AppController.asyncHandler(this.findDocuments),
        )

        this.router.delete(
            '/:id/documents',
            oapi.validPath(oapiPathDef({
                requestBodySchema: RemoveDocumentsSchema,
                summary: 'Remove Documents'
            })),
            AppController.asyncHandler(this.removeFriends),
        )

        this.router.post(
            '/:id/document/upload',
            oapi.path(oapiPathDef({
                multipart: true,
                requestBodySchema: UploadDocumentSchema,
                summary: 'Upload Document'
            })),
            AppController.asyncMiddleware(fileupload),
            AppController.asyncHandler(this.uploadDocument),
        )

        return this
    }

    create = async (req: Request) => {
        return userService.create(req.body)
    }

    findAll = async (req: Request) => {
        return userService.findAll(
            plainToClass(PageOptions, req.query),
            req.query.q as string
        )
    }

    findOne = async (req: Request) => {
        return userService.findById(parseInt(req.params.id))
    }

    update = async (req: Request) => {
        return userService.update(parseInt(req.params.id), req.body)
    }

    remove = async (req: Request) => {
        return userService.remove(parseInt(req.params.id))
    }

    updateProfile = async (req: Request) => {
        return userService.updateProfile(parseInt(req.params.id), req.body)
    }

    addFriends = async (req: Request) => {
        return userService.addFriends(parseInt(req.params.id), req.body)
    }

    removeFriends = async (req: Request) => {
        return userService.removeFriends(parseInt(req.params.id), req.body)
    }

    findFriends = async (req: Request) => {
        return userService.findFriends(
            parseInt(req.params.id),
            plainToClass(PageOptions, req.query),
            req.query.q as string
        )
    }

    findDocuments = async (req: Request) => {
        return userService.findDocuments(
            parseInt(req.params.id),
            plainToClass(PageOptions, req.query),
            req.query.q as string
        )
    }

    removeDocuments = async (req: Request) => {
        return userService.removeDocuments(parseInt(req.params.id), req.body)
    }

    uploadDocument = async (req: Request) => {
        return userService.uploadDocument(parseInt(req.params.id), req['files'])
    }
}


export default new UserController
