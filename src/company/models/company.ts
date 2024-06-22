import { NotEmpty, Column, Table, Model } from 'sequelize-typescript'


@Table
export default class Company extends Model {
    @NotEmpty
    @Column
    name: string
}


export type CompanyData = Omit<Company, keyof Model>
