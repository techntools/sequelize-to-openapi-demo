import express, { NextFunction } from 'express'
import busboy from 'connect-busboy'

import compression from 'compression'
import bodyParser from 'body-parser'
import logger from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import { apiReference } from '@scalar/express-api-reference'

import { SuccessResponse, ResponseData } from '../lib/server-response'
import oapi, { errorHandler as oapiErrorHandler } from '../lib/openapi'

import envConfig from '../config'

import defaultErrorHandler from './error'
import storeErrorHandler from '../store/error'

import user from '../user'
import company from '../company'
import office from '../office'


export class Web {
    private app: express.Application
    private apiPrefix: string

    async init() {
        this.app = express()

        this.apiPrefix = (() => {
            if (!envConfig.apiPrefix.startsWith('/'))
                return '/' + envConfig.apiPrefix

            return envConfig.apiPrefix
        })()

        this.addMany([
            compression(),
            logger("dev"),
            bodyParser.json(),
            bodyParser.urlencoded({ extended: true }),
            helmet({
                contentSecurityPolicy: {
                    directives: {
                        'script-src': ["'self'", "cdnjs.cloudflare.com", "cdn.jsdelivr.net", "'unsafe-inline'", "'unsafe-eval'"]
                    }
                }
            }),
            cors(),
            busboy({
                highWaterMark: 2 * 1024 * 1024,
                limits: {
                    fileSize: 10 * 1024 * 1024,
                }
            })
        ])

        this.app.get(
            this.apiPrefix + '/docs',
            apiReference({
                theme: 'default',
                spec: {
                    url: '/openapi.json',
                },
            })
        )

        user.init()
        company.init()
        office.init()

        this.add(oapi)

        this.add(user.router, user.basePath)
        this.add(company.router, company.basePath)
        this.add(office.router, office.basePath)

        this.add(storeErrorHandler)
        this.add(oapiErrorHandler)
        this.add(defaultErrorHandler)

        express.response.success = async function(dataOrPromise: Promise<ResponseData | undefined> | ResponseData, next: NextFunction) {
            let result: ResponseData

            if (dataOrPromise instanceof Promise) {
                try {
                    result = await dataOrPromise
                } catch(err) {
                    return next(err)
                }
            } else
                result = dataOrPromise

            this.json(new SuccessResponse(result))
        }

        return this
    }

    public add(middleware: any, basePath?: string) {
        if (basePath)
            return this.app.use(this.apiPrefix + basePath, middleware)

        this.app.use(middleware)
    }

    public addMany(middlewares: any[]) {
        middlewares.forEach(mw => {
            this.app.use(mw)
        })
    }

    public getRequestListener() {
        return this.app
    }
}


export default new Web
