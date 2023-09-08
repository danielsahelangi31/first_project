// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import RequestApi from "App/Models/RequestApi";
import Database from "@ioc:Adonis/Lucid/Database";
import User from "App/Models/User";
import PermissionApi from "App/Models/PermissionApi";
import SendMail from "App/Services/SendMail";

export default class ApiRequestController {

  public async index({ view, bouncer }: HttpContextContract) {
    await bouncer.authorize("access", "view-request-api");
    const requestApi = await RequestApi.query().preload("masterType").orderBy("created_at", "desc");
    const state = {
      requestApi: requestApi
    };
    return view.render("pages/api_request/index", state);
  }

  public async approve({ session, response, params, auth }: HttpContextContract) {
    const trx = await Database.transaction();
    try {
      const requestId = params.id;
      const requestApi: any = await RequestApi.query()
        .preload("masterType")
        .where("id", requestId)
        .first();
      const permissionData: any = [];
      let userId: any = null;
      let userEmail: any = null;
      let userPassword: any = "Bism1ll4h";
      let token: any = null;

      let user = await User.query({ client: trx }).where("email", requestApi.email).first();
      const permissionApi = await PermissionApi.query().where("master_type_id", requestApi.master_type_id);
      if (user) {
        // @ts-ignore
        userId = user.id;
        userEmail = user.email;
        userPassword = user.password;
        token = user;

        requestApi.useTransaction(trx);
        requestApi.status = 1;
        await requestApi.save();
        await trx.commit();


        let subject = `Request API Single Master Data`;
        let state: any = {
          message: "API yang anda ajukan telah disetujui: ",
          token: token.token,
          masterData: requestApi.masterType.master_name,
          institusi: requestApi.institusi,
          appName: requestApi.app_name,
          name: requestApi.name,
          email: requestApi.email,
          phone: requestApi.phone,
          status: true
        };

        await SendMail.sendMailApiRequest(userEmail, subject, state);

        return response.redirect().toRoute("api.request.index");
      } else {
        user = await new User();
        user.name = requestApi.name;
        user.email = requestApi.email;
        user.user_api = 1;
        user.password = "Bism1ll4h";
        user.useTransaction(trx);
        await user.save();
        // @ts-ignore
        userId = user.id;
        userEmail = user.email;
      }
      permissionApi.forEach(function(value) {
        permissionData.push({
          user_id: userId,
          permission_api_id: value.id
        });
      });

      // @ts-ignore
      await user.related("permissionApi").createMany(permissionData);
      requestApi.useTransaction(trx);
      requestApi.status = 1;
      await requestApi.save();
      await trx.commit();

      token = await auth.use("api").attempt(userEmail, userPassword);
      await User.query()
        .where("id", userId)
        .update("token", token.token);

      let subject = `Request API Single Master Data`;
      let state: any = {
        message: "API yang anda ajukan telah disetujui: ",
        token: token.token,
        masterData: requestApi.masterType.master_name,
        institusi: requestApi.institusi,
        appName: requestApi.app_name,
        name: requestApi.name,
        email: requestApi.email,
        phone: requestApi.phone,
        status: true
      };

      await SendMail.sendMailApiRequest(userEmail, subject, state);

      return response.redirect().toRoute("api.request.index");
    } catch (error) {
      await trx.rollback();
      session.flash("errors", {
        title: "Failed",
        message: "Approve API Failed Approve (" + error.message + ")"
      });
      return response.redirect().toRoute("api.request.index");
    }
  }

  public async reject({ session, response, params, request }: HttpContextContract) {
    const trx = await Database.transaction();
    const requestId = params.id;
    const messages = request.input("message");
    try {
      const requestApi: any = await RequestApi.query()
        .preload("masterType")
        .where("id", requestId)
        .first();

      requestApi.useTransaction(trx);
      requestApi.status = 0;
      await requestApi.save();
      await trx.commit();
      session.flash("success", {
        title: "Success",
        message: "Request API Rejected"
      });


      let subject: string = "Request API Single Master Data";
      let state: any = {
        message: "API yang anda ajukan ditolak: ",
        token: "-",
        masterData: requestApi.masterType.master_name,
        institusi: requestApi.institusi,
        appName: requestApi.app_name,
        name: requestApi.name,
        email: requestApi.email,
        phone: requestApi.phone,
        messages: messages,
        status: false
      };

      await SendMail.sendMailApiRequest(requestApi.email, subject, state);
      return response.redirect().toRoute("api.request.index");
    } catch (error) {
      await trx.rollback();
      session.flash("errors", {
        title: "Failed",
        message: "Approve API Failed Reject (" + error.message + ")"
      });
      return response.redirect().toRoute("api.request.index");
    }
  }

  public async store({ request, session, response }: HttpContextContract) {
    const trx = await Database.transaction();
    try {
      const requestAPi = new RequestApi();
      requestAPi.master_type_id = request.input("master_type_id");
      requestAPi.institusi = request.input("institusi");
      requestAPi.app_name = request.input("app_name");
      requestAPi.name = request.input("name");
      requestAPi.email = request.input("email");
      requestAPi.phone = request.input("phone");
      requestAPi.useTransaction(trx);
      await requestAPi.save();
      await trx.commit();
      return response.redirect().toRoute("login");
    } catch (error) {
      session.flash("errors", {
        title: "Failed",
        message: "Request API Failed to Create (" + error.message + ")"
      });
      await trx.rollback();
      return response.redirect().toRoute("login");
    }
  }


  public async findDuplicateData({ request }: HttpContextContract) {
    try {
      let email: string = request.input("email");
      let masterType: string = request.input("masterType");
      let statusApprove: string = "1";
      let requestApi: any = await RequestApi.query()
        .where("email", email)
        .where("master_type_id", masterType)
        .where((query) => {
          query
            .whereNull("status")
            .orWhere("status", statusApprove);
        })
        .first();

      if (requestApi) {
        return true;
      } else {
        return false;
      }

    } catch (error) {
      return error;
    }
  }

  public async testSend({}: HttpContextContract) {

    const nextUserApproval = await User.query().whereIn("role_id", ["c2eacaf2-4c3a-4cf0-8d36-45d2fb3e6496", "de25241c-6044-49f4-bd85-46b5677c5d39"]);
    nextUserApproval.forEach(async function(value) {
      await SendMail.reject("034fb244-407b-4f43-83b0-e4cfb5d9342f", "6ab63831-b646-4bb0-b225-7f91031f833d", "66c094e6-f39e-4671-b69a-e64b81a264c2", "PLB20221222002");
    });

  }
}
