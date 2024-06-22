import { ForeignKey, HasMany, HasOne, IsEmail, BelongsTo, Column, Table, Model } from 'sequelize-typescript'

import Profile, { ProfileData } from './profile'
import Document, { DocumentData } from './document'
import { FriendshipData } from './friendship'
import Company, { CompanyData } from '../../company/models/company'


@Table
export default class User extends Model {
    @IsEmail
    @Column({ allowNull: false, unique: 'email' })
    email: string

    @HasMany(() => Document)
    documents: Document[] | []

    @HasOne(() => Profile)
    profile: number

    @ForeignKey(() => Company)
    @Column({ allowNull: false })
    companyId: number;

    @BelongsTo(() => Company)
    company: Company
}


type _UserData = Omit<User, keyof Model | 'documents' | 'profile' | 'company' | 'friends'> & { profile?: ProfileData } & { documents?: DocumentData[] } & { company: CompanyData }

type _FriendData = Array<_UserData & { friendship: FriendshipData }>

export type UserData = _UserData & { friends?: _FriendData }
