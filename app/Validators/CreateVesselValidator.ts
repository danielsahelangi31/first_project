import { schema,rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateVesselValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    "no-imo": schema.number.optional([
      rules.unique({
        table: 'request_vessel_general_infos',
        column: 'no_imo',
        where: {
          status: ['REQUEST','COMPLETED',],
        }
      })
    ]),
    "call-sign": schema.string.optional([
      rules.alphaNum(),
      rules.maxLength(10),
      rules.unique({
        table: 'request_vessel_general_infos',
        column: 'call_sign',
        where: {
          status: ['REQUEST','COMPLETED'],
        }
      })
    ]),
    "mmsi": schema.string([
      rules.alphaNum(),
      rules.unique({
        table: 'request_vessel_general_infos',
        column: 'mmsi',
        where: {
          status: ['REQUEST','COMPLETED'],
        }
      })
    ])

  })
  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'mmsi.unique': 'MMSI sudah aktif atau diajukan',
    'call-sign.unique': 'Call Sign sudah aktif atau diajukan',
    'no-imo.unique': 'No-IMO sudah aktif atau diajukan',

  }
}
