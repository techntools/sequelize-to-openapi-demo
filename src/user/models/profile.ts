import { NotEmpty, ForeignKey, BelongsTo, Column, Table, Model } from 'sequelize-typescript'

import User, { UserData } from './user'


@Table
export default class Profile extends Model {
    @NotEmpty
    @Column
    name: string

    @ForeignKey(() => User)
    @Column({ allowNull: false, unique: 'userId' })
    userId: number;

    @BelongsTo(() => User, { onDelete: 'CASCADE' })  // onDelete was set to RESTRICT before setting explicitly
    user: User
}


export type ProfileData = Omit<Profile, keyof Model | 'documents' | 'profile' | 'company' | 'friends'> & { user: UserData }
