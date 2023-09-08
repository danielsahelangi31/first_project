import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Branch from "App/Models/Branch";
import HeadOffice from "App/Models/HeadOffice";
import Location from "App/Models/Location";
import MasterType from "App/Models/MasterType";
import Regional from "App/Models/Regional";
import Role from "App/Models/Role";
import RoleEntitesView from "App/Models/RoleEntitesView";
import SchemaAplication from "App/Models/SchemaAplication";
import SchemaApprovalList from "App/Models/SchemaApprovalList";
import Terminal from "App/Models/Terminal";
import JobTitle from "App/Models/JobTitle";
import Entity from "App/Models/Entity";
import { Exception } from "@poppinss/utils";
import EntityLocationView from "App/Models/EntityLocationView";
import StrukturBranchView from "App/Models/StrukturBranchView";
import StrukturTerminalView from "App/Models/StrukturTerminalView";


export default class ScemaAplicationsController {

  public async index({ view }) {
    const schema = await SchemaAplication
      .query()
      .preload("masterType")
      .preload("role");
    return view.render("pages/schema/index", { schema });
  }

  public async create({ view, bouncer }: HttpContextContract) {
    await bouncer.authorize('access', 'create-schema')
    const roleEntity = await Role.query().preload("entity").whereNotNull("entity_id");
    const master_type = await MasterType.all();
    const location = await Location.query().select("id", "name");
    const jobTitles = await JobTitle.all();
    return view.render("pages/schema/create", { master_type, roleEntity, location, jobTitles });
  }

  public async store({ response, request, session, bouncer }: HttpContextContract) {
    await bouncer.authorize('access', 'create-schema')
    // const payload = await request.validate(CreateSchemaValidator)
    const { schema_name, master_type_id, role_id, role_id_sl } = request.body();
    const schemaTipe = request.input("placement");
    const trx = await Database.transaction();
    try {
      const cekExists = await SchemaAplication.query()
        .where("master_type_id", master_type_id)
        .where("role_id", role_id_sl)
        .first();
      if (cekExists) {
        session.flash("errors", {
          title: "Error",
          message: "Schema Dengan Master Atau Role Tersebut Sudah Ada"
        });
        return response.redirect().back();
      }

      const SchemaCreate = await SchemaAplication.create({
        schema_name: schema_name,
        master_type_id: master_type_id,
        role_id: role_id_sl
      });

      await trx.commit();
      session.flash("success", {
        title: "Successfully",
        message: "Data Has been Save"
      });
      return response.redirect().toRoute("schema.edit", { id: SchemaCreate.id });


    } catch (error) {
      session.flash("errors", {
        title: "Error",
        message: error.message
      });
      await trx.rollback();
      return response.redirect().back();
    }


  }


  public async multiStore({ response, request, session }: HttpContextContract) {
    console.log(request.all());
    const submitter = request.input("submitterMl");
    const master_type_id = request.input("master_type_id");
    const id_job_title_submitter = request.input("id_job_title_submitter");
    const schema_name = request.input("schema_name");
    const approval = request.input("approval");
    const locationSchema = request.input("location");
    let entityData: any = null;
    try {
      for (const value of submitter) {
        const entityLocation = await EntityLocationView.query().where("entity_location_id", value).first();
        if (!entityLocation) {
          throw new Exception("Entitiy location Not Found");
        }
        const entitiy = await Entity.query().where("id_entity", value).where("id_job_title", id_job_title_submitter).first();
        if (!entitiy) {
          throw new Exception("Entitiy Not Found");
        }
        const role = await Role.query().where("entity_id", entitiy.id).first();
        if (!role) {
          throw new Exception("Role Submitter Not Found");
        }
        const cekExists = await SchemaAplication.query()
          .where("master_type_id", master_type_id)
          .where("role_id", role.id)
          .first();
        if (cekExists) {
          throw new Exception("Schema Dengan Master Atau Role Tersebut Sudah Ada");
        }
        const schemaApp = await SchemaAplication.create({
          schema_name: schema_name + " " + entityLocation.entity_name,
          master_type_id: master_type_id,
          role_id: role.id
        });
        let approvalData: any = [];
        for (const approvalItem of approval) {
          let locationEntity: any;
          if (approvalItem.location_id == locationSchema) {
            locationEntity = value;
          } else {

            //regional
            if (approvalItem.location_id == "8fc7acd6-bf12-42a8-a907-f9fa4025efc1" || approvalItem.location_id == "cadbd8bd-df2e-4367-86e7-1d7a6bea2613") {
              entityData = await Regional.findOrFail(value);
            }
            //branch
            if (approvalItem.location_id == "07192587-1b4e-4c84-bab4-0b5d2b69c66a") {
              entityData = await StrukturBranchView.query().where("branch_id", value).first();
            }
            //terminal
            if (approvalItem.location_id == "22a31ae7-5e6e-457f-a3b8-2d2fbc9f27e0") {
              entityData = await StrukturTerminalView.query().where("terminal_id", value).first();
            }

            //GET LOCATION ENTITY

            if (approvalItem.location_id == "cadbd8bd-df2e-4367-86e7-1d7a6bea2613") {
              locationEntity = entityData.head_office_id;
            }

            if (approvalItem.location_id == "8fc7acd6-bf12-42a8-a907-f9fa4025efc1") {
              locationEntity = entityData.regional_id;
            }

            if (approvalItem.location_id == "07192587-1b4e-4c84-bab4-0b5d2b69c66a") {
              locationEntity = entityData.branch_id;
            }

            if (approvalItem.location_id == "22a31ae7-5e6e-457f-a3b8-2d2fbc9f27e0") {
              locationEntity = entityData.terminal_id;
            }

          }


          const entitiyApproval = await Entity.query().where("id_entity", locationEntity).where("id_job_title", approvalItem.id_job_title).first();
          if (!entitiyApproval) {
            throw new Exception("Entitiy Approval Not Found");
          }
          const roleApproval = await Role.query().where("entity_id", entitiy.id).first();
          if (!roleApproval) {
            throw new Exception("Role Approval Submitter Not Found");
          }

          const mandatory = approvalItem.mandatory ? 1 : null;

          approvalData.push({
            schema_id: schemaApp.id,
            approval_order: approvalItem.approval_order,
            role_id: roleApproval.id,
            mandatory: mandatory
          });
        }

        await SchemaApprovalList.createMany(approvalData);

        // session.flash("success", {
        //   title: "Success",
        //   message: "Schema Created Successfully"
        // });
        // return response.redirect().toRoute("schema.index");
      }
    } catch (error) {
      session.flash("errors", {
        title: "Error",
        message: error.message
      });

      return response.redirect().back();
    }


  }

  public async show({}: HttpContextContract) {
  }

  public async updateSchema({ request, response, session }: HttpContextContract) {


    const { schema_name, master_type_id, role, schema_id } = request.body();
    const approval = request.input("approval");

    try {
      await SchemaApprovalList.query().where("schema_id", schema_id).delete();
      await SchemaApprovalList.createMany(approval);
      await SchemaAplication.query().where("id", schema_id)
        .update({
          schema_name: schema_name,
          role_id: role,
          master_type_id: master_type_id
        });

      session.flash("success", {
        title: "Successfully",
        message: "Data Has been Save"
      });

      return response.redirect().back();
    } catch (error) {
      session.flash("errors", {
        title: "Error",
        message: error
      });
      return response.redirect().back();
    }


  }

  public async getEntity({ params }: HttpContextContract) {

    const locationId = params.id;

    if (locationId == "8fc7acd6-bf12-42a8-a907-f9fa4025efc1") {
      const roleEntity = Regional.all();
      return roleEntity;
    } else if (locationId == "22a31ae7-5e6e-457f-a3b8-2d2fbc9f27e0") {
      const roleEntity = Terminal.all();
      return roleEntity;
    } else if (locationId == "cadbd8bd-df2e-4367-86e7-1d7a6bea2613") {
      const roleEntity = HeadOffice.all();
      return roleEntity;
    } else {
      const roleEntity = Branch.all();
      return roleEntity;
    }


  }

  public async edit({ view, params }: HttpContextContract) {
    const id = params.id;
    const schema = await SchemaAplication.query().where("id", id).first();
    const master_type = await MasterType.all();
    const roleEntity = await Role.query().preload("entity", (query) => {
      query.preload("jobTitle").preload("masterCompany");
    }).whereNotNull("entity_id");
    const appovalList = await SchemaApprovalList
      .query()
      .preload("role", (query) => {
        query.preload("entity", (query2) => {
          query2.preload("jobTitle").preload("masterCompany");
        });
      })
      .where("schema_approval_lists.schema_id", id)
      .orderBy("schema_approval_lists.approval_order", "asc");
    return view.render("pages/schema/edit", { schema, id, master_type, appovalList, roleEntity });
  }


  public async deleteSchema({ response, params, bouncer }: HttpContextContract) {
    await bouncer.authorize('access', 'delete-schema')
    const id = params.id;
    const schema = await SchemaAplication.findOrFail(id);
    await schema.delete();

    return response.redirect().toPath("/schema");
  }


}


