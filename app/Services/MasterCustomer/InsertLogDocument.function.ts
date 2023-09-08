import Database from '@ioc:Adonis/Lucid/Database';
import {v4 as uuidv4} from 'uuid'

interface LogSktd {
    customer_id: string;
    document_id: string;
    no_sktd?: string | null;
    start_date?: Date | null;
    exp_date?: Date | null;
    created_at?: Date | null;
}

interface LogDocument {
    id: string,
    customer_id: string;
    document_id: string;
    path: string;
    doc_name: string;
    created_at: Date;
}

class InsertLogDocument {

    public async createLogSktd(payload:LogSktd) {
        let newPayload = payload
        try {
            const [data] = await Database
            .table('log_sktd_document')
            .returning(['id','no_sktd'])
            .insert({
                id: uuidv4(),
                customer_id: newPayload.customer_id,
                document_id: newPayload.document_id,
                no_sktd: newPayload.no_sktd,
                start_date: newPayload.start_date,
                exp_date: newPayload.exp_date,
                created_at: newPayload.created_at
            })
            console.log(data);
            // DECLARE 
            // tmp_id	char(36);
            // BEGIN
            // const data = await Database.rawQuery(`
            // INSERT INTO "log_sktd_document"
            // (
            //     "id",
            //     "customer_id",
            //     "document_id",
            //     "no_sktd",
            //     "start_date",
            //     "exp_date",
            //     "created_at"
            // ) VALUES 
            // (   :id,
            //     :customer_id,
            //     :document_id,
            //     :no_sktd,
            //     TO_DATE(TO_CHAR(:start_date,'YYYY-MM-DD hh24.mi.ss'),'YYYY-MM-DD hh24.mi.ss'),
            //     TO_DATE(TO_CHAR(:exp_date,'YYYY-MM-DD hh24.mi.ss'),'YYYY-MM-DD hh24.mi.ss'),
            //     TO_DATE(TO_CHAR(:created_at,'YYYY-MM-DD hh24.mi.ss'),'YYYY-MM-DD hh24.mi.ss')
            // ); 
            // `,
            // {
            //     id: uuidv4(),
            //     customer_id: newPayload.customer_id,
            //     document_id: newPayload.document_id,
            //     no_sktd: newPayload.no_sktd,
            //     start_date: newPayload.start_date,
            //     exp_date: newPayload.exp_date,
            //     created_at: newPayload.created_at,
            // })
                
            return data
        } catch (error) {
            console.log(error)
        }
    }

    public async createLogDocument(payload:LogDocument[]){
        let newPayload = payload
        
        try {
            const [data] = await Database
            .table('log_sktd_document')
            .returning(['id','no_sktd'])
            .multiInsert(newPayload)
            // .insert({
            //     id: uuidv4(),
            //     customer_id: newPayload.customer_id,
            //     document_id: newPayload.document_id,
            //     path: newPayload.path,
            //     doc_name: newPayload.doc_name,
            //     created_at: newPayload.created_at
            // })
    
            return data.id
            
        } catch (error) {
            console.log(error)
        }
    }

    // public async updateLogDocument(payload:LogDocument[]){
    //     let newPayload = payload
        
    //     try {
    //         const [data] = await Database
    //         .table('log_sktd_document')
    //         .where('customer_id',)
    //         .update({
    //             id: uuidv4(),
    //             customer_id: newPayload.customer_id,
    //             document_id: newPayload.document_id,
    //             path: newPayload.path,
    //             doc_name: newPayload.doc_name,
    //             created_at: newPayload.created_at
    //         })
    
    //         return data.id
            
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    public async getDocumentCustomer(customer_id?:string|null){
        let id = customer_id

        try {
            const data = await Database.rawQuery(`
            SELECT "customer_id", "id" AS "document_id", "doc_name"  FROM (
                SELECT * FROM "customer_documents"
                WHERE "customer_id" = :id_customer
            )UNPIVOT INCLUDE NULLS  (
                "doc_name" FOR "doc_column" IN(
                "spmp" ,"ket_domisili" ,"ktp_pemimpin_perusahaan" ,"ktp_pic" ,"siupal_siupkk" ,"siupbm" ,
                "siup_nib" ,"pmku" ,"akta_perusahaan" ,"ref_bank" , "npwp" ,"pkp_non_pkp" ,"rek_asosiasi" ,
                "sktd" ,"cor_dgt" ,"surat_izin_pengelolaan" ,"skpt" ,"siopsus" 
            ))
            `,
            {
                id_customer: `${id}`
            }
            );
        
            return data;
        } catch (error) {
            console.log(error);
            return []
        }
    }
}
export {LogSktd,LogDocument}
export default new InsertLogDocument();