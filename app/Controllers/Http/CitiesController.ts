import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import City from 'App/Models/City';

export default class CitiesController {

    public async getCity({ params }: HttpContextContract) {

        const id = params.id;

        const country = await  City.query().preload('country').where('country_id', id);
          return country;



      }
}
