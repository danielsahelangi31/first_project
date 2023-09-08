import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import HeadOffice from "App/Models/HeadOffice";
import Regional from "App/Models/Regional";
import Database from "@ioc:Adonis/Lucid/Database";

export default class RegionalController {
  public async index({ bouncer, view }: HttpContextContract) {
    await bouncer.authorize("access", "view-regional");
    const regionals = await Regional.query().preload("headOffice");
    const headOffices = await HeadOffice.all();
    const state = {
      regionals: regionals,
      headOffices: headOffices
    };
    console.log(state);
    
    return view.render("pages/regional/index", state);
  }

  public async create({}: HttpContextContract) {
  }

  public async store({ request, session, response, bouncer }: HttpContextContract) {
    await bouncer.authorize("access", "create-regional");
    const trx = await Database.transaction();
    try {
      const regional = new Regional();
      regional.name = request.input("name");
      regional.code = request.input("code");
      regional.head_office_id = request.input("head_office_id");
      regional.useTransaction(trx);
      await regional.save();
      await trx.commit();
      session.flash("success", {
        title: "Success",
        message: "Regional Created Successfully"
      });
      return response.redirect().toRoute("master.regional.index");
    } catch (error) {
      await trx.rollback();
      session.flash("errors", {
        title: "Failed",
        message: "Regional Created Failed"
      });
      return response.redirect().toRoute("master.regional.index");
    }
  }

  public async show({}: HttpContextContract) {
  }

  public async edit({ params, response, bouncer }: HttpContextContract) {
    await bouncer.authorize("access", "edit-regional");
    const id = params.id;
    const regional = await Regional.find(id);
    return response.send(regional);
  }

  public async update({ params, request, session, response, bouncer }: HttpContextContract) {
    await bouncer.authorize("access", "edit-regional");
    const id = params.id;
    const trx = await Database.transaction();
    try {
      const regional = await Regional.findOrFail(id);
      regional.name = request.input("name");
      regional.code = request.input("code");
      regional.head_office_id = request.input("head_office_id");
      regional.useTransaction(trx);
      await regional.save();
      await trx.commit();
      session.flash("success", {
        title: "Success",
        message: "Regional Updated Successfully"
      });
      return response.redirect().toRoute("master.regional.index");
    } catch (error) {
      await trx.rollback();
      session.flash("errors", {
        title: "Failed",
        message: "Regional Updated Failed"
      });
      return response.redirect().toRoute("master.regional.index");
    }
  }

  public async destroy({params, session, response, bouncer}: HttpContextContract) {
    await bouncer.authorize("access", "delete-regional");
    const id = params.id;
    const trx = await Database.transaction();
    try {
      const regional = await Regional.findOrFail(id);
      regional.useTransaction(trx);
      await regional.delete();
      await trx.commit();
      session.flash("success", {
        title: "Success",
        message: "Regional Deleted Successfully"
      });
      return response.redirect().toRoute("master.regional.index");
    } catch (error) {
      await trx.rollback();
      session.flash("errors", {
        title: "Failed",
        message: "Regional Deleted Failed"
      });
      return response.redirect().toRoute("master.regional.index");
    }
  }
}
