// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Application from "@ioc:Adonis/Core/Application";
import Drive from "@ioc:Adonis/Core/Drive";


export default class FileDownloadsController {

  public async download({ params,response }: HttpContextContract) {
    const  url=await Drive.getUrl(params.id);
    return response.redirect(url)
  }
}
