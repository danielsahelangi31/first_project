import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Apilog from 'App/Models/Apilog';

export default class LogRoute {
  public async handle({request, auth}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    var pkgJson = {
      ip : request.ip(),
      url : request.url(),
      method : request.method(),
      userid : auth.user?.id
    }

    var pkgJsons = JSON.stringify(pkgJson);
    await Apilog.create(
      { package : pkgJsons, 
        userid : auth.user?.id, 
        payload : JSON.stringify(request.all()), 
        request_id : request.input('no_request'),
        master_types: request.input('master_types'),
        action: request.input('action')
      });
    await next()
  }
}

/*
- payload isinya request.all()
*/
