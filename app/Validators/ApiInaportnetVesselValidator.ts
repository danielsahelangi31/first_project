import { schema,rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ApiInaportnetVesselValidator {
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
    no_pendaftaran_inaportnet: schema.string.optional([
      rules.maxLength(100)
    ]),
    prefix_nama_kapal: schema.string.optional([
      rules.maxLength(4)
    ]),
    nama_kapal: schema.string([
      rules.maxLength(255)
    ]),
    no_imo: schema.string.optional([
      rules.maxLength(20)
    ]),
    call_sign: schema.string.optional([
      rules.maxLength(10)
    ]),
    kd_bendera: schema.string.optional([
      rules.maxLength(3)
    ]),
    tahun_pembuatan: schema.number.optional([
      rules.range(1900,2100)
    ]),
    jenis_pelayaran:schema.string.optional([
      rules.maxLength(100)
    ]),
    trayek:schema.string.optional([
      rules.maxLength(100)
    ]),  
    nama_pemilik: schema.string.optional(),
    jml_derek:schema.number.optional(),
    loa:schema.number.optional(),
    gt:schema.number.optional(),
    dwt:schema.number.optional(),
    draft_max:schema.number.optional(),
    draft_depan:schema.number.optional(),
    draft_belakang:schema.number.optional(),
    jml_palka:schema.number.optional(),
    no_surat_ukur: schema.string.optional(),
    jenis_kapal: schema.string.optional([
      rules.maxLength(50)
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
  public messages: CustomMessages = {}
}
