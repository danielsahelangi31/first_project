import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import { DateTime } from "luxon";
import RequestVendorInformation from 'App/Models/RequestVendorInformation';
import Role from 'App/Models/Role';
import DataManipulationVendor from 'App/Services/MasterVendor/DataManipulationVendor.function';
import { VendorAhliPayload, VendorAuditorPayload, VendorBankAccountPayload, VendorDokHistoryPayload, VendorDokPendukungPayload, VendorIjinUsahaPayload, VendorIncotermPayload, VendorInformationPayload, VendorLandasanHukumPayload, VendorNeracaPayload, VendorPICPayload, VendorPKPPayload, VendorPengalamanPayload, VendorPengurusPayload, VendorPeralatanPayload, VendorSPTPayload, VendorSahamPayload, VendorSertifikatBadanUsahaPayload, VendorSertifikatLainPayload } from 'App/Services/MasterVendor/InterfaceVendor.interface';
import SchemaAplication from 'App/Models/SchemaAplication';
import VendorInformation from 'App/Models/VendorInformation';
import Bank from 'App/Models/Bank';
import JenisVendor from 'App/Models/JenisVendor';
import ApprovalFunction from 'App/Services/Approval/Approval.function';
import IntegrationVendorFunction from 'App/Services/MasterVendor/IntegrationVendor.function';

// import {v4 as uuidv4} from 'uuid'

export default class MasterVendorsController {
    public async index({ request,view }: HttpContextContract) {
        let requestData:string = request.input("request");
        let status:string = request.input("status");
        let statusData:string = '';
        let vendors:any[] = []

        if(requestData == 'outstanding'){
            statusData = 'OUTSTANDING'
            if(status == "REQUEST"){
                vendors = await RequestVendorInformation.query()
                .select(
                    'id',
                    'kd_vendor',
                    'nm_perusahaan',
                    'no_npwp',
                    'address',
                    'phone',
                    'email',
                    'city_id',
                    'jn_vendor_id',
                    'status',
                    'submitter',
                    'schema_id',
                    'no_request',
                    'reference_id'
                )
                .preload('bankAccount')
                .preload('jenisVendor')
                .preload('postalCode')
                .where('status', 'REQUEST')
                .orderBy('created_at','desc')
            } else if (status == "DRAFT") {
                vendors = await RequestVendorInformation.query()
                .select(
                    'id',
                    'kd_vendor',
                    'nm_perusahaan',
                    'no_npwp',
                    'address',
                    'phone',
                    'email',
                    'city_id',
                    'jn_vendor_id',
                    'status',
                    'submitter',
                    'schema_id',
                    'no_request',
                    'reference_id'
                )
                .preload('bankAccount')
                .preload('jenisVendor')
                .preload('postalCode')
                .where('status', 'DRAFT')
                .orderBy('updated_at','desc')
            } else if (status == "REJECT") {
                vendors = await RequestVendorInformation.query()
                .select(
                    'id',
                    'kd_vendor',
                    'nm_perusahaan',
                    'no_npwp',
                    'address',
                    'phone',
                    'email',
                    'city_id',
                    'jn_vendor_id',
                    'status',
                    'submitter',
                    'schema_id',
                    'no_request',
                    'reference_id'
                )
                .preload('bankAccount')
                .preload('jenisVendor')
                .preload('postalCode')
                .where('status', 'REJECT')
                .orderBy('updated_at','desc')
            }
        } else if (requestData == undefined || requestData == 'active') {
            statusData = 'ACTIVE';
            if (status == 'ACTIVE' || status == undefined) {
                vendors = await VendorInformation.query()
                .select(
                    'id',
                    'kd_vendor',
                    'nm_perusahaan',
                    'no_npwp',
                    'address',
                    'phone',
                    'email',
                    'city_id',
                    'jn_vendor_id',
                    'status',
                    'submitter',
                    'schema_id',
                    'is_edit'
                )
                .preload('bankAccount')
                .preload('jenisVendor', (query) => {
                    query.select('name')
                })
                .where('status', 'ACTIVE')
                .orderBy('created_at','desc')
            } else if (status == 'INACTIVE') {
                vendors = await VendorInformation.query()
                .select(
                    'id',
                    'kd_vendor',
                    'nm_perusahaan',
                    'no_npwp',
                    'address',
                    'phone',
                    'email',
                    'city_id',
                    'jn_vendor_id',
                    'status',
                    'submitter',
                    'schema_id',
                    'is_edit'
                )
                .preload('bankAccount')
                .preload('jenisVendor', (query) => {
                    query.select('name')
                })
                .where('status', 'INACTIVE')
                .orderBy('created_at','desc')
            }
        }

        const [req, draft, reject, active, inactive,jn_vendor] = await Promise.all([
            Database.from('request_vendor_informations').count(`* as number`).whereRaw(`"status" = 'REQUEST'`),
            Database.from('request_vendor_informations').count(`* as number`).whereRaw(`"status" = 'DRAFT'`),
            Database.from('request_vendor_informations').count(`* as number`).whereRaw(`"status" = 'REJECT'`),
            Database.from('vendor_informations').count(`* as number`).whereRaw(`"status" = 'ACTIVE'`),
            Database.from('vendor_informations').count(`* as number`).whereRaw(`"status" = 'INACTIVE'`),
            JenisVendor.query().select("id","name")
        ]);

        const dataCount = {
            request: req[0],
            draft: draft[0],
            reject: reject[0],
            active: active[0],
            inactive: inactive[0]
        };

        return view.render("pages/master_vendor/index",
        {
            vendor: vendors,
            statusData,dataCount,jn_vendor
        })
    }

    public async add({ view }: HttpContextContract) {
        const jn_vendor = await JenisVendor.query().select("id","name").where('name','Vendor Bussiness Partner (BP)');
        return view.render("pages/master_vendor/create",{
            jn_vendor
        })
    }

    public async edit({ view,params }: HttpContextContract) {
        const id = params.id;
        const [vendor,bank,jn_vendor] = await Promise.all([
            RequestVendorInformation.query()
                .select(
                    'id',
                    'kd_vendor',
                    'nm_perusahaan',
                    'no_npwp',
                    'address',
                    'phone',
                    'email',
                    'city_id',
                    'jn_vendor_id',
                    'status',
                    'submitter',
                    'schema_id',
                    'no_request',
                    'reference_id'
                )
                .preload('bankAccount',(query) => {query.select('id','account_holder','nm_bank','no_rek','buku_tabungan')})
                .preload('postalCode')
                .preload('jenisVendor')
                .where("id",id).first(),
            Bank.query().select('id','name','created_at').orderBy("created_at","desc"),
            JenisVendor.query().select("id","name")
        ])

        return view.render("pages/master_vendor/pages/outstanding/edit",{
            vendor,bank,jn_vendor
        })
    }

    public async renewal({ view,params }: HttpContextContract) {
        const id = params.id;
        const [vendor,jn_vendor] = await Promise.all ([
            VendorInformation.query()
            .select(
                'id',
                'kd_vendor',
                'nm_perusahaan',
                'no_npwp',
                'address',
                'phone',
                'email',
                'city_id',
                'jn_vendor_id',
                'status',
                'submitter',
                'schema_id',
            )
            .preload('bankAccount',(query) => {query.select('id','account_holder','nm_bank','no_rek','buku_tabungan')})
            .preload('postalCode',(query) => {
                query.select('id','city')
            })
            .preload('jenisVendor',(query) => {
                query.select('name')
            })
            .where("id",id).first(),
            await JenisVendor.query().select("id","name")
        ])
        return view.render("pages/master_vendor/pages/approved/renewal",{
            vendor,jn_vendor
        })
    }

    public async view({ view,params }: HttpContextContract) {
        const id = params.id;
        const [vendor,bank,jn_vendor] = await Promise.all([
            RequestVendorInformation.query()
                .select(
                    'id',
                    'kd_vendor',
                    'nm_perusahaan',
                    'no_npwp',
                    'address',
                    'phone',
                    'email',
                    'city_id',
                    'jn_vendor_id',
                    'status',
                    'submitter',
                    'schema_id',
                    'no_request',
                    'reference_id'
                )
                .preload('bankAccount',(query) => {query.select('id','account_holder','nm_bank','no_rek','buku_tabungan')})
                .preload('postalCode')
                .preload('jenisVendor')
                .where("id",id).first(),
            Bank.query().select('id','name','created_at').orderBy("created_at","desc"),
            JenisVendor.query().select("id","name")
        ])

        return view.render("pages/master_vendor/pages/outstanding/view",{
            vendor,bank,jn_vendor
        })
    }

    public async viewApproved({ view, params }: HttpContextContract) {
        const id = params.id;
        const [vendor,jn_vendor] = await Promise.all ([
            VendorInformation.query()
                .select(
                    'id',
                    'kd_vendor',
                    'nm_perusahaan',
                    'no_npwp',
                    'address',
                    'phone',
                    'email',
                    'city_id',
                    'jn_vendor_id',
                    'status',
                    'submitter',
                    'schema_id',
                )
                .preload('bankAccount',(query) => {query.select('id','account_holder','nm_bank','no_rek','buku_tabungan')})
                .preload('postalCode',(query) => {
                    query.select('id','city')
                })
                .preload('jenisVendor',(query) => {
                    query.select('name')
                })
                .where("id",id).first(),
                await JenisVendor.query().select("id","name").where('name','Vendor Bussiness Partner (BP)')
        ])
        return view.render("pages/master_vendor/pages/outstanding/view",{
            vendor,jn_vendor
        })
    }

    public async store({request,response, auth}: HttpContextContract) {
        const masterTypeId:string = "6beea343-467f-47ff-9526-e042bfe2e279"
        const roleId:string = auth.user?.role_id ? auth.user?.role_id : ""
        const userId:string = auth.user?.id ? auth.user?.id : ""
        const zeroPad = (num, places) => String(num).padStart(places, "0");
        const currentDate = String(DateTime.now().year) + String(DateTime.now().month) + String(DateTime.now().day);
        const [
            entity,
            schema,
            requestVendor

        ] = await Promise.all([
            Role.query().select('entity_id').where('id',roleId).first(),
            SchemaAplication.query().select('id').where('role_id',roleId).andWhere('master_type_id',masterTypeId).first(),
            Database.rawQuery("select * from (select SUBSTR(\"no_request\" ,12,3) AS \"no_request\" from \"request_vendor_informations\" where SUBSTR(??,4,8) = ? order by \"created_at\" desc) where rownum <= 1", ["no_request", currentDate])
        ])

        const lastNo = requestVendor.length > 0 ? requestVendor[0].no_request : 0;
        const noRequest = "VDR" + currentDate + zeroPad(parseInt(lastNo) + 1, 3);
        const payloadVendor:VendorInformationPayload = {
            id: "",
            kd_vendor: request.input("kd_vendor"),
            nm_perusahaan: request.input("nm_perusahaan"),
            no_npwp: request.input("no_npwp"),
            address: request.input("address"),
            email: request.input("email"),
            phone: request.input("phone"),
            city_id: request.input("city_id"),
            jn_vendor_id: request.input("jn_vendor_id"),
            status: request.input("status"),
            submitter: userId,
            entity_id: entity?.entity_id ? entity?.entity_id :"",
            master_type_id: masterTypeId,
            schema_id: schema?.id ? schema?.id :"",
            no_request: noRequest,
            reference_id: request.input("reference_id"),
            created_at: new Date(),
            updated_at: new Date(),
        }

        const payloadBankAcc:VendorBankAccountPayload[] = request.input('bank_account') ? request.input('bank_account') : [];
        // console.log(payloadVendor);
        // return console.log(payloadBankAcc)
        try {
            await DataManipulationVendor.createRequestVendor(payloadVendor,payloadBankAcc)

            let result = {
                "status": "success",
                "message": request.input('status') == "REQUEST" ? "Data Customer Berhasil Dibuat" : "Data Berhasil Disimpan Sebagai Draft",
            }

            return response.status(200).send(result)
        } catch (error) {
            let result = {
                "status": "failed",
                "message": "Data Vendor Gagal Dibuat",
                "detail": error.message
            }
            return response.status(500).send(result)
        }
    }

    public async update({request,params,response,auth}: HttpContextContract){
        const id = params.id
        const masterTypeId:string = "6beea343-467f-47ff-9526-e042bfe2e279"
        const roleId:string = auth.user?.role_id ? auth.user?.role_id : ""
        const userId:string = auth.user?.id ? auth.user?.id : ""
        const [
            entity,
            schema,
        ] = await Promise.all([
            Role.query().select('entity_id').where('id',roleId).first(),
            SchemaAplication.query().select('id').where('role_id',roleId).andWhere('master_type_id',masterTypeId).first(),
        ])

        const payloadVendor:VendorInformationPayload = {
            id: id,
            kd_vendor: request.input("kd_vendor"),
            nm_perusahaan: request.input("nm_perusahaan"),
            no_npwp: request.input("no_npwp"),
            address: request.input("address"),
            email: request.input("email"),
            phone: request.input("phone"),
            city_id: request.input("city_id"),
            jn_vendor_id: request.input("jn_vendor_id"),
            status: request.input("status"),
            submitter: userId ? userId : "",
            entity_id: entity?.id ? entity?.id : "",
            master_type_id: masterTypeId,
            schema_id: schema?.id ? schema?.id :"",
            no_request: "",
            reference_id: request.input("reference_id"),
            created_at: new Date(),
            updated_at: new Date(),
        }

        const payloadBankAcc:VendorBankAccountPayload[] = request.input("bank_account") ? request.input("bank_account") : []

        try {
            await DataManipulationVendor.updateRequestVendor(id,payloadVendor,payloadBankAcc)
            let result = {
                "message": request.input('status') == "REQUEST" ? "Data Customer Berhasil Dibuat" : "Data Berhasil Disimpan Sebagai Draft",
            }

            return response.status(200).send(result)
        } catch (error) {
            let result = {
                "message": "Data Vendor Gagal Dibuat",
                "detail": error.message
            }
            return response.status(500).send(result)
        }
    }

    public async storeRenewal({request,params,response,auth}: HttpContextContract){
        const id:string = params.id

        const masterTypeId:string = "6beea343-467f-47ff-9526-e042bfe2e279"
        const roleId:string = auth.user?.role_id ? auth.user?.role_id : ""
        const userId:string = auth.user?.id ? auth.user?.id : ""
        const zeroPad = (num, places) => String(num).padStart(places, "0");
        const currentDate = String(DateTime.now().year) + String(DateTime.now().month) + String(DateTime.now().day);
        const [
            entity,
            schema,
            requestVendor

        ] = await Promise.all([
            Role.query().select('entity_id').where('id',roleId).first(),
            SchemaAplication.query().select('id').where('role_id',roleId).andWhere('master_type_id',masterTypeId).first(),
            Database.rawQuery("select * from (select SUBSTR(\"no_request\" ,12,3) AS \"no_request\" from \"request_vendor_informations\" where SUBSTR(??,4,8) = ? order by \"created_at\" desc) where rownum <= 1", ["no_request", currentDate])
        ])

        const lastNo = requestVendor.length > 0 ? requestVendor[0].no_request : 0;
        const noRequest = "VDR" + currentDate + zeroPad(parseInt(lastNo) + 1, 3);
        const payloadVendor:VendorInformationPayload = {
            id: "",
            kd_vendor: request.input("kd_vendor"),
            nm_perusahaan: request.input("nm_perusahaan"),
            no_npwp: request.input("no_npwp"),
            address: request.input("address"),
            email: request.input("email"),
            phone: request.input("phone"),
            city_id: request.input("city_id"),
            jn_vendor_id: request.input("jn_vendor_id"),
            status: request.input("status"),
            submitter: userId,
            entity_id: entity?.entity_id ? entity?.entity_id :"",
            master_type_id: masterTypeId,
            schema_id: schema?.id ? schema?.id :"",
            no_request: noRequest,
            reference_id: request.input("reference_id"),
            created_at: new Date(),
            updated_at: new Date(),
        }
        const payloadBankAcc:VendorBankAccountPayload[] = request.input('bank_account') ? request.input('bank_account') : [];

        const vendorActive = await VendorInformation.findBy("id",id)
        const trx = await Database.transaction()
        try {
            await DataManipulationVendor.createRequestVendor(payloadVendor,payloadBankAcc)

            await vendorActive?.useTransaction(trx).merge({ is_edit: 1 }).save()
            await trx.commit()
            
            let result = {
                "message": request.input('status') == "REQUEST" ? "Data Customer Berhasil Dibuat" : "Data Berhasil Disimpan Sebagai Draft",
            }

            return response.status(200).send(result)
        } catch (error) {
            await trx.rollback()
            console.log(error)
            let result = {
                "message": "Data Vendor Gagal Dibuat",
                "detail": error.message
            }
            return response.status(500).send(result)
        }
    }

    public async updateStatus({request,response, params}: HttpContextContract){
        const id = params.id;
        const status = request.input('status');

        const trx = await Database.transaction();
        try {
            const vendor = await VendorInformation.findByOrFail('id',id);
            vendor.status = status;
            await vendor.useTransaction(trx).save();
            await trx.commit()
            let result = {
                message: "Status data berhasil diubah",
                data: {
                    nama: vendor.nm_perusahaan,
                    status: vendor.status
                }
            }
            return response.status(200).send(result)
        } catch (error) {
            await trx.rollback()
            let result = {
                message: "Status data gagal diubah"
            }

            return response.status(500).send(result)
        }
    }

    public async destroy({params,response}: HttpContextContract){
        const id = params.id
        const trx = await Database.transaction()
        try {
            const vendor = await RequestVendorInformation.findBy("id",id)

            await vendor?.useTransaction(trx).delete()

            await trx.commit()
            return response.redirect().toRoute('master-vendor')
        } catch (error) {
            await trx.rollback()
            return error
        }
    }

    public async approval({ request,response,auth }: HttpContextContract){
        const noRequest = request.input("no_request");
        const remark = request.input("remark");
        let result = {
            message : "Berhasil Disetujui",
        }

        try {
            const vendorRequest = await RequestVendorInformation.query()
            .select("id","master_type_id","submitter","schema_id","status","reference_id")
            .where("no_request", noRequest).first();

            const schemaId = vendorRequest?.schema_id ? vendorRequest?.schema_id : "";
            const status = vendorRequest?.status ? vendorRequest?.status : "";
            const submitter = vendorRequest?.submitter ? vendorRequest?.submitter : "";
            const masterType = vendorRequest?.master_type_id ? vendorRequest?.master_type_id : "";
            const roleId = auth.user?.role_id ? auth.user?.role_id : ""
            
            const approval = await ApprovalFunction.approveData(noRequest,schemaId,status,roleId,submitter,remark)
            console.log(approval);

            if (approval.isFinalApprove && approval.status ) {
                let data:string = '';
                
                if(!vendorRequest?.reference_id){
                    data = await DataManipulationVendor.approveDataVendor(vendorRequest?.id ? vendorRequest?.id : "")
                } else{
                    data = await DataManipulationVendor.renewalDataVendor(vendorRequest?.id ? vendorRequest?.id : "")
                }
                await ApprovalFunction.notifApproval(noRequest,submitter,remark,"APPROVED",masterType,schemaId,approval.nextApproval,"Request Approval Master Data Vendor")
                if (data == 'success'){
                    return response.status(200).send(result);
                } else {
                    return response.status(500).send(result);
                }
            } else if(!approval.isFinalApprove && approval.status ) {
                return response.status(200).send(result);
            } else {
                result.message = approval.message
                return response.status(200).send(result);
            }

        } catch (error){
            console.log(error)
            result.message = "Terjadi Kesalahan System"
            return response.status(500).send(result);
        }
    }

    public async reject({ request,response,auth }: HttpContextContract){
        const noRequest = request.input("no_request");
        const remark = request.input("remark");
        let result = {
            message : "Berhasil Ditolak",
        }

        try {
            const vendorRequest = await RequestVendorInformation.query()
            .select("id","master_type_id","submitter","schema_id","status","reference_id")
            .where("no_request", noRequest).first();

            const schemaId = vendorRequest?.schema_id ? vendorRequest?.schema_id : "";
            const status = vendorRequest?.status ? vendorRequest?.status : "";
            const submitter = vendorRequest?.submitter ? vendorRequest?.submitter : "";
            const masterType = vendorRequest?.master_type_id ? vendorRequest?.master_type_id : "";
            const roleId = auth.user?.role_id ? auth.user?.role_id : ""
            
            const approval = await ApprovalFunction.approveData(noRequest,schemaId,status,roleId,submitter,remark)
            
            if (approval.isFinalApprove && approval.status ) {
                await ApprovalFunction.notifApproval(noRequest,submitter,remark,"REJECT",masterType,schemaId,approval.nextApproval,"Request Approval Master Data Vendor")
                await vendorRequest?.merge({status: "REJECT"}).save()
                return response.status(200).send(result);  
            } else {
                await ApprovalFunction.notifApproval(noRequest,submitter,remark,"REJECT",masterType,schemaId,approval.nextApproval,"Request Approval Master Data Vendor")
                await vendorRequest?.merge({status: "REJECT"}).save()
                result.message = approval.message
                return response.status(200).send(result);
            }

        } catch (error){
            console.log(error)
            result.message = "Terjadi Kesalahan Sistem"
            return response.status(500).send(result);
        }
    }

    public async modalData({ request,response}: HttpContextContract){
        const noRequest:string = request.input('no_request') ? request.input('no_request') : "";
        try {
            const vendor = await RequestVendorInformation.query()
            .select(
                'id',
                'kd_vendor',
                'nm_perusahaan',
                'no_npwp',
                'address',
                'phone',
                'email',
                'city_id',
                'jn_vendor_id',
                'status',
                'submitter',
                'no_request',
                'created_at'
            )
            .preload('bankAccount',(query)=>{
                query.select('account_holder','nm_bank','no_rek','buku_tabungan')
            })
            .preload('jenisVendor', (query)=>{ 
                query.select('name');
            })
            .preload('postalCode',(query)=>{
                query.select('city');
            })
            .preload('user', (query) => {
                query.select('name');
                // query.preload('role',(query) => {
                //     query.select('name');
                // })
            })
            .where('no_request', noRequest)
            .first();

            return response.status(200).send(vendor);
        } catch (error){
            console.log(error)
            return response.status(500).send('Failed Fetch Data');
        }
        
    }

    public async integration({request,response,auth}: HttpContextContract){
        //DATA UMUM 
        let payloadBankAcc:VendorBankAccountPayload[] = []         
        let payloadPIC:VendorPICPayload[] = []
        let payloadIjinUsaha:VendorIjinUsahaPayload[] = []
        let payloadSertifikasiBadanUsaha:VendorSertifikatBadanUsahaPayload[] = []
        let payloadSaham:VendorSahamPayload[] = []
        let payloadPengurus:VendorPengurusPayload[]= []
        let payloadLandasanHukum:VendorLandasanHukumPayload[] = []
        // DATA PERPAJAKAN
        let payloadSPT:VendorSPTPayload[] = []
        let payloadNeraca:VendorNeracaPayload[] = []
        let payloadAuditor:VendorAuditorPayload[] = []
        // DATA TEKNIS
        let payloadAhli:VendorAhliPayload[] = []
        let payloadPengalaman: VendorPengalamanPayload[] = []
        let payloadPeralatan: VendorPeralatanPayload[] = []
        let payloadSertifikatLain: VendorSertifikatLainPayload[] = []
        // DATA HISTORIS DOKUMEN
        let payloadHistoryDok: VendorDokHistoryPayload[] = []        
        const masterTypeId:string = "6beea343-467f-47ff-9526-e042bfe2e279"
        const roleId:string = auth.user?.role_id ? auth.user?.role_id : ""
        const userId:string = auth.user?.id ? auth.user?.id : ""
        const [
            entity,
            schema,
        ] = await Promise.all([
            Role.query().select('entity_id').where('id',roleId).first(),
            SchemaAplication.query().select('id').where('role_id',roleId).andWhere('master_type_id',masterTypeId).first()
        ])

        // Data Umum
        const vendorInfoPayload: VendorInformationPayload = {
            id: "",
            kd_vendor: request.input("KD_VENDOR"),
            nm_perusahaan: request.input("NM_PERUSAHAAN"),
            no_npwp: request.input("NO_NPWP"),
            address: request.input("ADDRESS"),
            phone: request.input("PHONE"),
            email: request.input("EMAIL"),
            city_id: request.input("POSTAL_CODE"),
            jn_vendor_id: "9412b26f-5090-44f0-9dba-688a497d3d2c",
            status: "ACTIVE",
            submitter: userId,
            entity_id: entity?.id ? entity?.id : "",
            master_type_id: masterTypeId,
            schema_id: schema?.id ? schema?.id :"",
            no_request: "",
            reference_id: "",
            created_at: new Date(),
            updated_at: new Date(),
        }
        const payloadIncoterm:VendorIncotermPayload = {
            incoterm_1: request.input("INCOTERM")["INCOTERM_1"],
            incoterm_2: request.input("INCOTERM")["INCOTERM_2"],
        }
        const payloadDokPendukung:VendorDokPendukungPayload = {
            surat_pernyataan: request.input("DOK_PENDUKUNG")["SURAT_PERNYATAAN"],
            ktp_pemberi_kuasa: request.input("DOK_PENDUKUNG")["KTP_PEMBERI_KUASA"],
            ktp_penerima_kuasa: request.input("DOK_PENDUKUNG")["KTP_PENERIMA_KUASA"],
            surat_kuasa: request.input("DOK_PENDUKUNG")["SURAT_KUASA"]
        }
        // DATA PERPAJAKAN
        const payloadPKP:VendorPKPPayload = {
            no_surat: request.input("PKP")["NO_SURAT"],
            tgl_pkp: request.input("PKP")["TGL_PKP"],
            no_npwp: request.input("PKP")["NO_NPWP"],
            file_dok_pendukung: request.input("PKP")["FILE_DOK_PENDUKUNG"],
            file_pkp: request.input("PKP")["FILE_PKP"],
            file_npwp: request.input("PKP")["FILE_NPWP"],
        }

        // DATA UMUM
        for(const bankAccount in request.input("BANK_ACCOUNT")) {
            payloadBankAcc.push({
                nm_bank: bankAccount["NM_BANK"],
                account_holder: bankAccount["ACCOUNT_HOLDER"],
                no_rek: bankAccount["NO_REK"],
                buku_tabungan: bankAccount["BUKU_TABUNGAN"]
            })
        }

        for(const pic in request.input("PIC")) {
            payloadPIC.push({
                nm_pic: pic["NM_PIC"],
                email_pic: pic["EMAIL_PIC"],
                jabatan_pic: pic["JABATAN_PIC"],
                mobile_pic: pic["MOBILE_PIC"],
                file_ktp: pic["FILE_KTP"]
            })
        }

        for(const ijinUsaha in request.input("IJIN_USAHA")){
            payloadIjinUsaha.push({
                no_ijin: ijinUsaha["NO_IJIN"],
                tgl_ijin: ijinUsaha["TGL_IJIN"],
                tgl_berakhir: ijinUsaha["TGL_BERAKHIR"],
                instansi_pemberi: ijinUsaha["INSTANSI_PEMBERI"],
                bidang_usaha: ijinUsaha["BIDANG_USAHA"],
                dok_ijin_usaha: ijinUsaha["DOK_IJIN_USAHA"],
                dok_bidang_usaha: ijinUsaha["DOK_BIDANG_USAHA"],
                tipe_ijin: ijinUsaha["TIPE_IJIN"]
            })
        }

        for(const sertifikasiBadanUsaha in request.input("SERTIFIKASI_BADAN_USAHA")){
            payloadSertifikasiBadanUsaha.push({
                no_sertifikat: sertifikasiBadanUsaha["NO_SERTIFIKAT"],
                tgl_sertifikat: sertifikasiBadanUsaha["TGL_SERTIFIKAT"],
                tgl_berakhir: sertifikasiBadanUsaha["TGL_BERAKHIR"],
                penanda_tangan: sertifikasiBadanUsaha["PENANDA_TANGAN"],
                link_lpjk: sertifikasiBadanUsaha["LINK_LPJK"],
                bidang_usaha: sertifikasiBadanUsaha["BIDANG_USAHA"]
            })
        } 

        for(const saham in request.input("PEMEGANG_SAHAM")){
            payloadSaham.push({
                nm_pemegang: saham["NM_PEMEGANG"],
                no_ktp: saham["NO_KTP"],
                jml_saham: saham["JML_SAHAM"],
                address: saham["ADDRESS"]
            })
        }

        for(const pengurus in request.input("PENGURUS_PERUSAHAAN")){
            payloadPengurus.push({
                nm_pengurus: pengurus["NM_PENGURUS"],
                no_ktp: pengurus["NO_KTP"],
                jabatan: pengurus["JABATAN"],
                file: pengurus["FILE"]
            })
        }

        for(const landasanHukum in request.input("LANDASAN_HUKUM")){
            payloadLandasanHukum.push({
                no_ijin: landasanHukum["NO_IJIN"],
                tgl_ijin: landasanHukum["TGL_IJIN"],
                tgl_berakhir: landasanHukum["TGL_BERAKHIR"],
                nm_notaris: landasanHukum["NM_NOTARIS"],
                file: landasanHukum["FILE"],
                file_sk_pengesahan: landasanHukum["FILE_PENGESAHAN"],
                link_barcode: landasanHukum["LINK_BARCODE"],
                tipe_landasan_hukum: landasanHukum["TIPE_LANDASAN_HUKUM"]
            })
        }

        // DATA PERPAJAKAN
        for(const spt in request.input("SPT")){
            payloadSPT.push({
                tahun: spt["TAHUN"],
                no_spt: spt["NO_SPT"],
                tgl_spt: spt["TGL_SPT"],
                file: spt["FILE"]
            });
        };

        for(const neraca in request.input("NERACA")){
            payloadNeraca.push({
                tahun: neraca["TAHUN"],
                modal: neraca["MODAL"]
            });
        };

        for(const audit in request.input("AUDIT")){
            payloadAuditor.push({
                auditor: audit["AUDITOR"],
                no_audit: audit["NO_AUDIT"],
                tgl_audit: audit["TGL_AUDIT"],
                kesimpulan: audit["KESIMPULAN"],
                file: audit["FILE"]
            })
        }

        // DATA TEKNIS
        for(const teknis in request.input("AHLI_TEKNIS")){
            payloadAhli.push({
                nm_ahli: teknis["NM_AHLI"],
                tgl_lahir_ahli: teknis["TGL_LAHIR_AHLI"],
                file: teknis["FILE"]
            })
        }

        for(const pengalaman in request.input("PENGALAMAN")){
            payloadPengalaman.push({
                nm_pekerjaan: pengalaman["NM_PEKERJAAN"],
                bidang_jasa: pengalaman["BIDANG_JASA"],
                lokasi: pengalaman["LOKASI"],
                file_spk: pengalaman["FILE_SPK"],
                file_ba: pengalaman["FILE_BA"],
                kategori: pengalaman["KATEGORI"]
            })
        }

        for(const peralatan in request.input("PERALATAN")){
            payloadPeralatan.push({
                jn_alat: peralatan["JN_ALAT"],
                jml_alat: peralatan["JML_ALAT"],
                kapasitas: peralatan["KAPASITAS"],
                merk: peralatan["MERK"],
                tahun_pembuatan: peralatan["TAHUN_PEMBUATAN"],
                lokasi: peralatan["LOKASI"],
                kepemilikan: peralatan["KEPEMILIKAN"],
                file: peralatan["FILE"]
            })
        }

        for(const sertifikatLain in request.input("SERTIFIKAT_LAIN")){
            payloadSertifikatLain.push({
                nm_sertifikat: sertifikatLain["NM_SERTIFIKAT"],
                no_sertifikat: sertifikatLain["NO_SERTIFIKAT"],
                tahun_pembuatan: sertifikatLain["TAHUN_PEMBUATAN"],
                tgl_terbit: sertifikatLain["TGL_TERBIT"],
                tgl_berakhir: sertifikatLain["TGL_BERAKHIR"],
                file: sertifikatLain["FILE"],
            })
        }

        // DATA HISTORI
        for(const dokHistory in request.input("DOK_HISTORY")){
            payloadHistoryDok.push({
                file: dokHistory["FILE"],
                deskripsi: dokHistory["DESKRIPSI"],
                jenis: dokHistory["JENIS"]
            })
        }

        try {
            const data = await IntegrationVendorFunction.createDataVendor(
                vendorInfoPayload,
                payloadBankAcc,
                payloadPIC,
                payloadIncoterm,
                payloadIjinUsaha,
                payloadSertifikasiBadanUsaha,
                payloadSaham,
                payloadPengurus,
                payloadLandasanHukum,
                payloadDokPendukung,
                payloadSPT,
                payloadPKP,
                payloadNeraca,
                payloadAuditor,
                payloadAhli,
                payloadPengalaman,
                payloadPeralatan,
                payloadSertifikatLain,
                payloadHistoryDok
                )
            
            let result = {
                status: "success",
                messages:"data berhasil dibuat"
            }
            if(data){
                return response.status(200).send(result);
            } else {
                result.status = "failed"
                result.messages = "data gagal dibuat"
                return response.status(400).send(result);
            }
        } catch (error) {
            console.log(error);
            let result = {
                status: "failed",
                messages:"data gagal dibuat"
            }
            return response.status(500).send(result);
        }
    }
}
