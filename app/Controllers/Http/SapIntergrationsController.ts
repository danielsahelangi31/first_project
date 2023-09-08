import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import SapIntegration from "App/Util/SapIntegration";
import RequestTerminal from "App/Models/RequestTerminal";
import Terminal from "App/Models/Terminal";
import SapLog from "App/Models/SapLog";


export default class SapIntergrationsController {
  public async index({ view }: HttpContextContract) {
    const sapLogs= await SapLog.query().preload("CustomerInfo").whereNull('vessel_id').orderBy('created_at','desc');
    const state = {
      sapLogs:sapLogs,
    };

    return view.render("pages/sap_log/index", state);
  }

  public async indexKapal({ view }: HttpContextContract) {
    const sapLogs= await SapLog.query().preload("vesselGeneralInfo").whereNull('id_basic_info').orderBy('created_at','desc');
    const state = {
      sapLogs:sapLogs,
    };

    return view.render("pages/sap_log/indexKapal", state);
  }

  public async create({ params, response }: HttpContextContract) {
    try {
      await SapIntegration.create(params.id);
      let result = {
        "message": "Berhasil Dikirim"
      };
      return response.status(200).send(result);
    } catch (error) {
      let result = {
        "message": error.message
      };
      return response.status(500).send(result);
    }
  }


  public async update({ params, response }: HttpContextContract) {
    try {
      await SapIntegration.update(params.id);
      let result = {
        "message": "Berhasil Dikirim"
      };
      return response.status(200).send(result);
    } catch (error) {
      let result = {
        "message": error.message
      };
      return response.status(500).send(result);
    }
  }

  public async createKapal({ params, response }: HttpContextContract) {
    try {
      await SapIntegration.createKapal(params.id);
      let result = {
        "message": "Berhasil Dikirim"
      };
      return response.status(200).send(result);
    } catch (error) {
      let result = {
        "message": error.message
      };
      return response.status(500).send(result);
    }
  }
}
