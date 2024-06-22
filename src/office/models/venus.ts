import { Column, Table, Model } from 'sequelize-typescript'


@Table
export default class Venus extends Model {
    @Column({
        validate: {
            is: 'Abc'
        }
    })
    a_is_string: string

    @Column({
        validate: {
            is: /Abc/i
        }
    })
    a_is_regexp: string

    @Column({
        validate: {
            is: ['Abc', 'i']
        }
    })
    a_is_array: string

    @Column({
        validate: {
            is: {
                args: ['Abc', 'i'],
                msg: 'Should be Abc'
            }
        }
    })
    a_is_arged: string

    @Column({
        validate: {
            is: {
                args: 'Abc',
                msg: 'Should be Abc'
            }
        }
    })
    a_is_arged_string: string

    @Column({
        validate: {
            is: {
                args: /Abc/i,
                msg: 'Should be Abc'
            }
        }
    })
    a_is_arged_regexp: string
}
