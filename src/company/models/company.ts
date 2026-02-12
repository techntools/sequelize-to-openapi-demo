import { DataType, NotEmpty, Column, Table, Model } from 'sequelize-typescript'


@Table
export default class Company extends Model {
    @NotEmpty
    @Column
    name: string

    @Column({
        type: DataType.RANGE(DataType.INTEGER)
    })
    capacity: string

    @Column({
        type: DataType.GEOGRAPHY
    })
    headquarterLocation: string

    @Column({
        type: DataType.HSTORE
    })
    management: {
        founder: string,
        cto: string,
        ceo: string,
        coo: string,
    }
}


export type CompanyData = Omit<Company, keyof Model>
