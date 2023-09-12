import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MasterBarangController {
    public async index({view}) {
        try {
            return view.render('pages/master_barang/pages/index.edge');
        } catch (error) {
            return error;
        }
    }

    public async add({view}) {
        try {
            return view.render('pages/master_barang/pages/create.edge');
        } catch (error) {
            return error.message;
        }
    }
}
