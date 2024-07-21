import util from 'util'
import { mkdir } from 'fs/promises'


export async function ensureDirExists(dir: string) {
    try {
        await mkdir(dir)
    } catch(err) {
        if (err && err.code !== 'EEXIST')
            console.log(err)
    }
}

global.logObject = function (obj: any) {
  console.log(util.inspect(obj, { depth: null }))
}
