import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import HeadOffice from "App/Models/HeadOffice";
import Database from "@ioc:Adonis/Lucid/Database";


export default class HeadOfficeController {
  public async index({ bouncer, view }: HttpContextContract) {
    await bouncer.authorize("access", "view-head-office");
    const headOffices = await HeadOffice.all();

    const state = {
      headOffices: headOffices
    };
    return view.render("pages/head_office/index", state);
  }

  public async create({}: HttpContextContract) {
  }

  public async store({ request, session, response, bouncer }: HttpContextContract) {
    await bouncer.authorize("access", "create-head-office");
    const trx = await Database.transaction();
    try {
      const headOffice = new HeadOffice();
      headOffice.name = request.input("name");
      headOffice.code = request.input("code");
      headOffice.useTransaction(trx);
      await headOffice.save();
      await trx.commit();
      session.flash("success", {
        title: "Success",
        message: "Head Office Created Successfully"
      });
      return response.redirect().toRoute("master.ho.index");
    } catch (error) {
      await trx.rollback();
      session.flash("errors", {
        title: "Failed",
        message: "Head Office Created Failed"
      });
      return response.redirect().toRoute("master.ho.index");
    }
  }

  public async show({}: HttpContextContract) {
  }

  public async edit({ params, response, bouncer }: HttpContextContract) {
    await bouncer.authorize("access", "edit-head-office");
    const id = params.id;
    const headOffice = await HeadOffice.find(id);
    return response.send(headOffice);
  }

  public async update({ params, request, session, response, bouncer }: HttpContextContract) {
    await bouncer.authorize("access", "edit-head-office");
    const id = params.id;
    const trx = await Database.transaction();
    try {
      const headOffice = await HeadOffice.findOrFail(id);
      headOffice.name = request.input("name");
      headOffice.code = request.input("code");
      headOffice.useTransaction(trx);
      await headOffice.save();
      await trx.commit();
      session.flash("success", {
        title: "Success",
        message: "Head Office Updated Successfully"
      });
      return response.redirect().toRoute("master.ho.index");
    } catch (error) {
      await trx.rollback();
      session.flash("errors", {
        title: "Failed",
        message: "Head Office Updated Failed"
      });
      return response.redirect().toRoute("master.ho.index");
    }
  }

  public async destroy({ params, session, response, bouncer }: HttpContextContract) {
    await bouncer.authorize("access", "delete-head-office");
    const id = params.id;
    const trx = await Database.transaction();
    try {
      const headOffice = await HeadOffice.findOrFail(id);
      headOffice.useTransaction(trx);
      await headOffice.delete();
      await trx.commit();
      session.flash("success", {
        title: "Success",
        message: "Head Office Deleted Successfully"
      });
      return response.redirect().toRoute("master.ho.index");
    } catch (error) {
      await trx.rollback();
      session.flash("errors", {
        title: "Failed",
        message: "Head Office Deleted Failed"
      });
      return response.redirect().toRoute("master.ho.index");
    }
  }
}
