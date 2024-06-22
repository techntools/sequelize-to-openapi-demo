import { Sequelize, Op } from 'sequelize'

import AppService from '../lib/app-service'

import User, { UserData } from './models/user'
import Profile, { ProfileData } from './models/profile'
import Document, { DocumentData } from './models/document'
import Friendship from './models/friendship'

import { Page, PageOptions } from '../lib/pagination'


export class UserService extends AppService {
    init() {
        return this
    }

    async create(data: UserData) {
        return User.create(data, {
            include: [Profile]
        })
    }

    async findAll(
        pageOptions: PageOptions,
        q?: string
    ) {
        const where: { [key: string | symbol]: any } = {}
        const include: any[] = [
            { model: Profile }
        ]

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
                        { '_': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Profile.name')), 'LIKE', '%' + q + '%') },
                    ]
                }
            ]
        }

        const result = await User.findAndCountAll(query)

        return new Page(result.rows, result.count, pageOptions)
    }

    async findById(id: number) {
        return User.findByPk(id, {
            include: [Profile]
        })
    }

    async update(id: number, data: UserData) {
        return User.update(data, { where: { id }})
    }

    async remove(id: number) {
        return User.destroy({ where: { id } })
    }

    async updateProfile(userId: number, data: ProfileData) {
        return Profile.update({ ...data, userId }, { where: { userId } })
    }

    async addFriends(userId: number, data: { friendId: number }[]) {
        for (const f of data)
            if (userId == f.friendId)
                throw new Error('You have befriended yourself already')

        const exist = await Friendship.findOne({
            where: {
                [Op.or]: [
                    {
                        userId,
                        friendId: data.map(f => f.friendId)
                    },
                    {
                        friendId: userId,
                        userId: data.map(f => f.friendId)
                    }
                ]
            }
        })
        if (exist)
            throw new Error('You are already friends with some of them')

        return Friendship.bulkCreate(data.map(f => { return { ...f, userId } }))
    }

    async removeFriends(userId: number, data: number[]) {
        return Friendship.destroy({
            where: {
                [Op.or]: [
                    {
                        userId,
                        friendId: data
                    },
                    {
                        friendId: userId,
                        userId: data
                    }
                ]
            }
        })
    }

    async findFriends(
        id: number,
        pageOptions: PageOptions,
        q?: string
    ) {
        const where: { [key: string | symbol]: any } = {}
        const include: any[] = [
            {
                model: User,
                as: 'friendsWith',
                include: [Profile]
            },
            {
                model: User,
                as: 'friendsTo',
                include: [Profile]
            }
        ]

        const query = {
            where,
            include,
            offset: pageOptions.offset,
            limit: pageOptions.limit,
            distinct: true,
        }

        if (q) {
            query.where[Op.and] = [{
                [Op.or]: [
                    {
                        [Op.and]: {
                            '_': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('friendsWith.profile.name')), 'LIKE', '%' + q + '%'),
                            userId: { [Op.ne]: id }
                        }
                    },
                    {
                        [Op.and]: {
                            '_': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('friendsTo.profile.name')), 'LIKE', '%' + q + '%'),
                            friendId: { [Op.ne]: id }
                        }
                    }
                ]
            }]
        }

        query.where[Op.and] = [
            ...(query.where[Op.and] ?? []),
            {
                [Op.or]: {
                    userId: id,
                    friendId: id,
                }
            }
        ]

        const result = await Friendship.findAndCountAll(query)

        const friends = []
        for (const res of result.rows) {
            if (res.userId == id)
                friends.push(res.friendsTo)
            else
                friends.push(res.friendsWith)
        }

        return new Page(friends, result.count, pageOptions)
    }

    async findDocuments(
        userId: number,
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
                    '_': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('originalname')), 'LIKE', '%' + q + '%'),
                },
            ]
        }

        query.where[Op.and] = [
            ...(query.where[Op.and] ?? []),
            { userId }
        ]

        const result = await Document.findAndCountAll(query)

        return new Page(result.rows, result.count, pageOptions)
    }

    async removeDocuments(userId: number, data: number[]) {
        return Document.destroy({
            where: { userId, id: data }
        })
    }

    async uploadDocument(userId: number, data: DocumentData[]) {
        return Document.bulkCreate(
            data.map(d => {
                return {
                    ...d,
                    userId
                }
            })
        )
    }
}


export default new UserService
