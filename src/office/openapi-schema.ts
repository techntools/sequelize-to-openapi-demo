import { SchemaManager, OpenApiStrategy } from '@techntools/sequelize-to-openapi'

import Jupyter from './models/jupyter'
import Mars from './models/mars'
import Venus from './models/venus'

import envConfig from '../config'


export default function () {
    const schemaManager = new SchemaManager
    const strategy = new OpenApiStrategy

    const options = {
        exclude: envConfig.autoAttributes,
    }

    const CreateJupyterSchema = {
        ...schemaManager.generate(Jupyter, strategy, options),
        example: {
            a_notIn: 'A',
            a_notIn_arged: 'a',
        }
    }
    const CreateMarsSchema = {
        ...schemaManager.generate(Mars, strategy, options),
        example: {
            a_not_string: 'Abc',
            a_not_regexp: 'Abc',
            a_not_array: 'Abc',
            a_not_arged: 'Abc',
            a_not_arged_regexp: 'Abc',
            a_not_arged_string: 'Abc',
        }
    }
    const CreateVenusSchema = {
        ...schemaManager.generate(Venus, strategy, options),
        example: {
            a_is_string: 'Abc',
            a_is_regexp: 'Abc',
            a_is_array: 'Abc',
            a_is_arged: 'Abc',
            a_is_arged_regexp: 'Abc',
            a_is_arged_string: 'Abc',
        },
    }

    return {
        CreateJupyterSchema,
        CreateMarsSchema,
        CreateVenusSchema,
    }
}
