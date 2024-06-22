import { Sequelize, Op } from 'sequelize'

import AppService from '../lib/app-service'

import Company, { CompanyData } from './models/company'

import { Page, PageOptions } from '../lib/pagination'


export class CompanyService extends AppService {
    init() {
        return this
    }

    async create(data: CompanyData) {
        return Company.create(data)
    }

    async findAll(
        pageOptions: PageOptions,
        q?: string
    ) {
        const where: { [key: string | symbol]: any } = {}
        const include: any[] = []

        const query = {
            where,
            include,
            offset: pageOptions.offset,
            limit: pageOptions.limit,
            distinct: true,
        }

        if (q) {
            query.where[Op.and] = [
                {
                    [Op.or]: [
                        { '_': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), 'LIKE', '%' + q + '%') },
                    ]
                }
            ]
        }

        const result = await Company.findAndCountAll(query)

        return new Page(result.rows, result.count, pageOptions)
    }

    async findById(id: number) {
        return Company.findByPk(id)
    }

    async update(id: number, data: CompanyData) {
        return Company.update(data, { where: { id }})
    }

    async remove(id: number) {
        return Company.destroy({ where: { id } })
    }
}


export default new CompanyService
