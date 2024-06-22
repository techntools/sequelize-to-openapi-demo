import { NotEmpty, IsUUID, Min, Max, ForeignKey, BelongsTo, Column, Table, Model } from 'sequelize-typescript'

import User, { UserData } from './user'


@Table
export default class Document extends Model {
    @IsUUID(4)
    @Column({
        allowNull: false,
    })
    filename: string;

    @NotEmpty
    @Column({
        allowNull: false,
    })
    originalname: string;

    @Min(1)
    @Max(10 * 1024 * 1024)
    @Column({
        allowNull: false,
    })
    size: number;

    @NotEmpty
    @Column({
        allowNull: false,
    })
    mimeType: string;

    @ForeignKey(() => User)
    @Column({ allowNull: false })
    userId: number;

    @BelongsTo(() => User, { onDelete: 'CASCADE' })  // onDelete was set to RESTRICT before setting explicitly
    user: User
}


export type DocumentData = Omit<Document, keyof Model | 'user'> & { user: UserData }
