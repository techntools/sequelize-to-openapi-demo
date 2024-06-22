import { Column, Table, Model } from 'sequelize-typescript'


@Table
export default class Jupyter extends Model {
    @Column({
        validate: {
            notIn: [['a', 'b']]
        }
    })
    a_notIn: string

    @Column({
        validate: {
            notIn: {
                args: [['a', 'b']],
                msg: 'should not be a or b'
            }
        }
    })
    a_notIn_arged: string
}
