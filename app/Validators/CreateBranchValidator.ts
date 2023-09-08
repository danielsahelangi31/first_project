import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateBranchValidator {
  constructor(protected ctx: HttpContextContract) {
  }

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
    country_id: schema.string(),
    postalcode_id: schema.string(),
    regional_id: schema.string(),
    jenis_pelabuhan_id: schema.string(),
    perairan_pelabuhan_id: schema.string(),
    header_branch_id: schema.string(),
    port_name: schema.string(),
     //kode_perairan: schema.string(),
    lng: schema.string(),
    lat: schema.string(),
    address: schema.string(),
    kode_kemenhub: schema.string(),
    kedalaman_min: schema.number(),
    kedalaman_max: schema.number(),
    luas_perairan: schema.number.nullable(),
    luas_daratan: schema.number.nullable(),
    rencana_induk_file: schema.file.optional({
      size: '2mb',
      extnames: ['pdf'],
    }),
  });

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
  public messages: CustomMessages = {};
}
