import { mkdir } from 'fs/promises'


export async function ensureDirExists(dir: string) {
    try {
        await mkdir(dir)
    } catch(err) {
        if (err && err.code !== 'EEXIST')
            console.log(err)
    }
}
