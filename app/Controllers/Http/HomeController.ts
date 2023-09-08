import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Ws from 'App/Services/Ws'
export default class HomeController {

  public async index({  view }: HttpContextContract) {

    return view.render("pages/home/index");
  }

}
