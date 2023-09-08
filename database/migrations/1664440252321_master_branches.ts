import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "branches";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary();
      table.uuid("regional_id");
      table.string("name");
      table.string('code')
      table.string("luas_perairan");
      table.string("luas_daratan");
      table.string("kode_area_pelabuhan");
      table.string("kode_area_labuh");
      table.string("kode_perairan");
      table.string("kode_kemenhub");
      table.string("lng");
      table.string("lat");
      table.string("kedalaman_min");
      table.string("kedalaman_max");
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true }).nullable();
      table.timestamp("updated_at", { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
