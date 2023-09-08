import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import axios from "axios";
import Env from '@ioc:Adonis/Core/Env'
import InaportnetLog from 'App/Models/InaportnetLog';
import parser from 'App/Util/parser';

export default class MdmPhinnisiController {
    public async index({ view }: HttpContextContract) {
        let data:any = await Database.rawQuery(`
        SELECT il."action", il."payload", il."response", il."created_at" FROM "inaportnet_logs" il
        where il."action" LIKE '%SEND%' ORDER BY il."created_at" DESC`); 
        
        let state = {
            logs : data
        }
        
        return view.render("pages/mdm_phinnisi_log/index", state);
    }

    public async resend({request,response}:HttpContextContract){
        const data = request.input("payload");
        const payload = JSON.parse(data)
        const url = `${Env.get('PHINNISI_ENDPOINT')}/api/suronding/mdm`
        const headers = {
            headers: {
                "access-token": `${Env.get('PHINNISI_TOKEN')}`
            },
        };

        try {
            let remoteResponse = await axios.post(url,payload,headers)
            // console.log(remoteResponse.data)
            // log inaportnet
            const log = new InaportnetLog()
            log.action = "SEND"
            log.payload = JSON.stringify(payload)
            log.response = remoteResponse.data
            await log.save()
    
            return response.status(200).send("Success")
            
        } catch (error) {
            console.log(error)
            // log inaportnet
            const log = new InaportnetLog()
            log.action = "SEND"
            log.payload = JSON.stringify(payload)
            log.response = error.message
            await log.save()
    
            return response.status(500).send("Failed")
        }
    }
}