import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateTerminalValidator {
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
    branch_id: schema.string(),
    name: schema.string(),
    address: schema.string(),
    jenis_terminal_id: schema.string(),
    jumlah_tambat: schema.number(),
    kedalaman_max: schema.number(),
    kedalaman_min: schema.number(),
    izin_operasi_file: schema.file.optional({
      size: '2mb',
      extnames: ['pdf'],
    }),
    bast_file: schema.file.optional({
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
