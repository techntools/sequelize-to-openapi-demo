import { pipeline } from 'stream/promises'
import * as fs from 'fs'
import { extname, join } from 'path'

import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'

import { BadRequest, InternalServerError } from './error'


function filename(originalname: string) {
    const randomName = uuidv4()
    return `${randomName}${extname(originalname)}`
}

function fileFilter(name: string) {
    return name.match(/\.(pdf|doc)$/i)
}

export default async function (req: Request, _: Response, next: NextFunction) {
    await new Promise(async (res, rej) => {
        const files = []
        const fields = []

        req.busboy.on('file', (_, file, info) => {
            const p = new Promise(async (res, _) => {
                if(!fileFilter(info.filename))
                    return rej(new BadRequest('Some of file types are not allowed!'))

                const uniqueName = filename(info.filename)
                const saveTo = join(process.cwd(), './files/' + uniqueName)

                let size = 0
                file.on('data', (data) => {
                    size += data.length
                })

                try {
                    await pipeline(file, fs.createWriteStream(saveTo))
                } catch(err) {
                    return rej(new InternalServerError)
                }

                res({
                    ...info,
                    originalname: info.filename,
                    filename: uniqueName,
                    size
                })
            })

            files.push(p)
        })

        req.busboy.on('field', (name, value, _info) => {
            fields.push({ [name]: value })
        })

        req.busboy.on('finish', async () => {
            req['files'] = await Promise.all(files)
            req['fields'] = fields

            res(1)
        })

        req.busboy.on('error', err => {
            rej(err)
        })

        await pipeline(req, req.busboy)
    })

    next()
}
