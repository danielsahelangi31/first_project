// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
// import MasterCompany from "App/Models/MasterCompany";
import Notification from "App/Models/Notification";
// import { CONNREFUSED } from "dns";
import Route from "@ioc:Adonis/Core/Route";


export default class NotificationsController {

  public async list({ response, request, auth }: HttpContextContract) {

    const notification = await Notification.query().where("to", auth.user.id).preload("masterType").orderBy("created_at", "desc");
    let result: any = [];
    notification.forEach(function(value) {
      let title = "";
      if (value.status.trim() == "APPROVED") {
        title = "Request Approval";
      } else if(value.status.trim() == "DRAFT"){
        title = "Request Submit";
      } else {
        title = "Rejected";
      }

      let uri = "";

      if (value.master_type_id.trim() == "a7c03e4f-e1f5-4c80-a3cd-f4b4929cbed7") {
        if (value.status.trim() == "REJECTED") {
          uri = Route.makeUrl("master.terminal.index") + "?status=REJECT";
        } else {
          uri = Route.makeUrl("master.terminal.index") + "?status=REQUEST";
        }

      } else if (value.master_type_id.trim() == "66c094e6-f39e-4671-b69a-e64b81a264c2") {
        if (value.status.trim() == "REJECTED") {
          uri = Route.makeUrl("master.branch.index") + "?status=REJECT";
        } else {
          uri = Route.makeUrl("master.branch.index") + "?status=REQUEST";
        }
      } else if (value.master_type_id.trim() == "c59d4ff5-djc8-4fa4-bb07-f6fc508506cd") {
        if (value.status.trim() == "REJECTED") {
          uri = Route.makeUrl("MasterBongkarMuatsController.index") + "ditolak/?";
        } else {
          uri = Route.makeUrl("MasterBongkarMuatsController.index") + "diajukan/?";
        }
      } else if (value.master_type_id.trim() == "c59d42f5-d9c8-4fa4-bb0b-f6fc548506cd") {
        if (value.status.trim() == "REJECTED") {
          uri = Route.makeUrl("MasterApungsController.index") + "ditolak/?";
        } else {
          uri = Route.makeUrl("MasterApungsController.index") + "diajukan/?";
        }
      } else if (value.master_type_id.trim() == "a41588f8-97bf-4cc0-8a9f-2f252c0b54a2") {
        if (value.status.trim() == "REJECTED") {
          // uri = Route.makeUrl("MasterCustomerController.index") + "?status=REJECT";

          uri = Route.makeUrl("MasterCustomerV2sController.index") + "?request=outstanding&status=REJECT";
        } else if(value.status.trim() == "DRAFT"){
          uri = Route.makeUrl("MasterCustomerV2sController.index") + "?request=outstanding&status=DRAFT";
        } else {
          // uri = Route.makeUrl("MasterCustomerController.index") + "?status=REQUEST";
          
          uri = Route.makeUrl("MasterCustomerV2sController.index") + "?request=outstanding&status=REQUEST";
        }
      } else if (value.master_type_id.trim() == "ec964b7c-2350-40ef-8cea-656204df5f2e") {
        if (value.status.trim() == "REJECTED") {
          uri = Route.makeUrl("MasterDermagasController.index") + "ditolak/?";
        } else {
          uri = Route.makeUrl("MasterDermagasController.index") + "diajukan/?";
        }
      } else if (value.master_type_id.trim() == "70150798-2aed-4b9e-b3fa-b9fe00bbe3f3") {
        if (value.status.trim() == "REJECTED") {
          uri = Route.makeUrl("MasterVesselsController.index") + "?request=outstanding&status=REJECT";
        } else if (value.status.trim() == "DRAFT"){
          uri = Route.makeUrl("MasterVesselsController.index") + "?request=outstanding&status=DRAFT";
        } else {
          uri = Route.makeUrl("MasterVesselsController.index") + "?request=outstanding&status=REQUEST";
        }
      }
      result.push({
        title: title,
        message: value.masterType.master_name + " " + value.request_no,
        date: value.created_at,
        status: value.status,
        uri: uri,
        read:value.read,
        id:value.id,
        request_no:value.request_no,
      });
    });
    return response.send(result);
  }


  public async unread({ response, request, auth }: HttpContextContract) {
    const notification = await Notification.query().where("to", auth.user.id).whereNull('read');
    return response.send(notification.length);
  }

  public async setRead({ response, params, auth }: HttpContextContract) {
    await Notification.query().where("id",params.id).update({read:1});
    return response.send('ok');
  }

}
