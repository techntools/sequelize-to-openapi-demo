/*
 * Implementing friendship with many to many won't work if pagination along with
 * search support is needed.
 */

import { DataType, BelongsTo, ForeignKey, Column, Table, Model } from 'sequelize-typescript'

import User from './user'


@Table({
    indexes: [
        { fields: ['userId', 'friendId'], unique: true }
    ]
})
export default class Friendship extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number

    @ForeignKey(() => User)
    @Column({ allowNull: false })
    userId: number

    @BelongsTo(() => User, { foreignKey: 'userId' })
    friendsWith: User

    @ForeignKey(() => User)
    @Column({ allowNull: false })
    friendId: number

    @BelongsTo(() => User, { foreignKey: 'friendId' })
    friendsTo: User
}


export type FriendshipData = Omit<Friendship, keyof Model>
