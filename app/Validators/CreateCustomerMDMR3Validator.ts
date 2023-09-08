import { schema,rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class createCustomerMDMR3Validator {
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
    // kd_kapal_inaportnet: schema.string(),
    no_npwp: schema.string([
      rules.maxLength(30)
    ]),
    npwp_name: schema.string.optional([
      rules.maxLength(100)
    ]),
    npwp_address: schema.string.optional([
      rules.maxLength(255)
    ]),
    nm_perusahaan: schema.string([
      rules.maxLength(50)
    ]),
    email: schema.string.optional([
      rules.maxLength(50)
    ]),
    phone: schema.string.optional([
      rules.maxLength(50)
    ]),
    address: schema.string([
      rules.maxLength(200)
    ]),
    nm_pemimpin_perusahaan:schema.string.optional([
      rules.maxLength(50)
    ]),
    customer_group:schema.string.optional([
      rules.maxLength(100)
    ]),
    sap_code:schema.string.optional([
      rules.maxLength(50)
    ]),  
    join_date: schema.string.optional(),
    establish_date:schema.string.optional(),
    birthday_date:schema.string.optional(),
    birthday_pemimpin_date:schema.string.optional(),
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
  public messages: CustomMessages = {}
}
