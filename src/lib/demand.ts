import { get as httpGet } from 'superagent'


export class Demand {
    readonly headers: {}

    constructor(headers = {}) {
        this.headers = headers
    }

    async get(url: string, headers = {}) {
        return httpGet(url).set({ ...this.headers, ...headers })
    }
}
