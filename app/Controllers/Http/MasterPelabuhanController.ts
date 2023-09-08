import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MasterPelabuhanController {
  public async index({view}: HttpContextContract) {

    return view.render('pages/master_pelabuhan/index');
  }

  public async create({view}: HttpContextContract) {
    return view.render('pages/master_pelabuhan/create');
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
