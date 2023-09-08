import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Role from "App/Models/Role";
import Menu from "App/Models/Menu";
import Entity from "App/Models/Entity";
import Database from "@ioc:Adonis/Lucid/Database";
import RolePermission from "App/Models/RolePermission";
import EntityLocationView from "App/Models/EntityLocationView";
import { Exception } from "@poppinss/utils";


export default class RoleController {
  public async index({ view,bouncer }: HttpContextContract) {
    await bouncer.authorize('access','view-role')
    const active=await Role.query().where('flag','1')
    const inActive=await Role.query().where('flag','0')
    const roleData = await Role.query().preload("permissionRole", (query) => {
      query.preload("permission");
    }).preload("entity");
    const menuParent = await Menu.query().has("permissions").withScopes((scopes) => scopes.parent()).preload("childMenu").preload("permissions").preload("childMenu", (query) => {
      query.preload("permissions");
    });
    const entityData = await Entity.query().preload('masterCompany').preload('jobTitle');

    const state = {
      roleData: roleData,
      menuParent: menuParent,
      entityData: entityData,
      total:roleData.length,
      active:active.length,
      inActive:inActive.length,
    };
    return view.render("pages/role/index", state);
  }

  public async create({}: HttpContextContract) {
  }

  public async store({ request, session, response,bouncer }: HttpContextContract) {
    await bouncer.authorize('access','create-role')
    const trx = await Database.transaction();
    try {
      let permission = request.input("permission");
      const roleExist=await Role.query().where('entity_id',request.input("entity_id")).first();
      if (roleExist){
        throw new Exception('Entity Role Already Set');
      }
      const role = new Role();
      role.name = request.input("name");
      role.flag = request.input("flag");
      role.portal_id = request.input("portal_id");
      role.entity_id = request.input("entity_id");
      role.useTransaction(trx);
      await role.save();

      let permissionData: any = [];
      permission.forEach(function(value) {
        permissionData.push({
          role_id: role.id,
          permission_id: value
        });
      });

      await role.related("permissionRole").createMany(permissionData);
      await trx.commit();
      let result = {
        "message": "Data role Berhasil Dibuat"
      };

      return response.status(200).send(result);
    } catch (error) {
      await trx.rollback();
      let result = {
        "message": error.message
      };
      return response.status(500).send(result);
    }


  }

  public async show({}: HttpContextContract) {
  }

  public async edit({ params, response,bouncer }: HttpContextContract) {
    await bouncer.authorize('access','edit-role')
    const id = params.id;
    const roleData = await Role.query().where("id", id).preload("permissionRole").first();
    response.send(roleData);
  }

  public async update({ params, request, session, response,bouncer }: HttpContextContract) {
    await bouncer.authorize('access','edit-role')
    const id = params.id;
    const trx = await Database.transaction();
    try {
      if (request.input("entity_id")){
        const roleExist=await Role.query().where('entity_id',request.input("entity_id")).whereNot('id',id).first();
        if (roleExist){
          throw new Exception('Entity Role Already Set');
        }
      }

      let permission = request.input("permission");
      const role = await Role.findOrFail(id);
      // role.name = request.input("name");
      role.portal_id = request.input("portal_id");
      role.flag = request.input("flag");
      role.entity_id = request.input("entity_id");
      role.useTransaction(trx);
      await role.save();

      let permissionData: any = [];
      permission.forEach(function(value) {
        permissionData.push({
          role_id: id,
          permission_id: value
        });
      });
      await RolePermission.query().where("role_id", id).delete();
      await role.related("permissionRole").createMany(permissionData);
      await trx.commit();
      let result = {
        "message": "Data role Berhasil Diubah"
      };

      return response.status(200).send(result);
    } catch (error) {
      await trx.rollback();
      let result = {
        "message": error.message
      };
      return response.status(500).send(result);
    }
  }

  public async destroy({ params, session, response,bouncer }: HttpContextContract) {
    await bouncer.authorize('access','delete-role')
    const id = params.id;
    const trx = await Database.transaction();
    try {
      await RolePermission.query().where("role_id", id).delete();
      const role = await Role.findOrFail(id);
      role.delete();
      await trx.commit();
      session.flash("success", {
        title: "Success",
        message: "Role Deleted Successfully"
      });
      return response.redirect().toRoute("admin.role.index");
    } catch (error) {
      session.flash("errors", {
        title: "Success",
        message: "Role Failed to Delete (" + error.message + ")"
      });
      await trx.rollback();
      return response.redirect().toRoute("admin.role.index");
    }
  }
}
