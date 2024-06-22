import { Column, Table, Model } from 'sequelize-typescript'


@Table
export default class Mars extends Model {
    @Column({
        validate: {
            not: 'Abc'
        }
    })
    a_not_string: string

    @Column({
        validate: {
            not: /Abc/i
        }
    })
    a_not_regexp: string

    @Column({
        validate: {
            not: ['Abc', 'i'],
        }
    })
    a_not_array: string

    @Column({
        validate: {
            not: {
                args: ['Abc', 'i'],
                msg: 'Should not be abc'
            }
        }
    })
    a_not_arged: string

    @Column({
        validate: {
            not: {
                args: /Abc/i,
                msg: 'Should not be abc'
            }
        }
    })
    a_not_arged_regexp: string

    @Column({
        validate: {
            not: {
                args: 'Abc',
                msg: 'Should not be abc'
            }
        }
    })
    a_not_arged_string: string
}
