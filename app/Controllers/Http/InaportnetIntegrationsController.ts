import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Country from 'App/Models/Country';
import InaportnetLog from 'App/Models/InaportnetLog';
import Notification from 'App/Models/Notification';
import RequestVesselGeneralInfo from 'App/Models/RequestVesselGeneralInfo';
import RequestVesselSpecific from 'App/Models/RequestVesselSpecific';
import RequestVesselSupportDocument from 'App/Models/RequestVesselSupportDocument';
import SchemaAplication from 'App/Models/SchemaAplication';
// import SchemaApprovalList from 'App/Models/SchemaApprovalList';
import User from 'App/Models/User';
import VesselGeneralInfo from 'App/Models/VesselGeneralInfo';
import VesselType from 'App/Models/VesselType';
import MasterVessel from 'App/Services/MasterVessel';
import Ws from 'App/Services/Ws';
import ApiInaportnetVesselValidator from 'App/Validators/ApiInaportnetVesselValidator';

export default class InaportnetIntegrationsController {
    public async index({ view }: HttpContextContract) {
        
        return view.render("pages/sap_log/index");
    }

    public async createKapal({request,response,auth}: HttpContextContract){
        await auth.use('api').authenticate()
        
        const {
                // kd_kapal_inaportnet,
                no_pendaftaran_inaportnet,
                prefix_nama_kapal,
                nama_kapal,
                no_imo,
                call_sign,
                kd_bendera,
                tahun_pembuatan,
                jenis_pelayaran,
                trayek,
                nama_pemilik,
                jml_derek,
                loa,
                gt,
                dwt,
                draft_max,
                draft_depan,
                draft_belakang,
                jml_palka,
                no_surat_ukur,
                jenis_kapal,
                
            } = request.body()
        
        const master_type_id:string = '70150798-2aed-4b9e-b3fa-b9fe00bbe3f3';
        const trx = await Database.transaction()
        try {
            // const payload =
            await request.validate(ApiInaportnetVesselValidator)
            const schema = await SchemaAplication.query().where("master_type_id",master_type_id).first();
            const jn_kapal = await VesselType.query().where('kode',jenis_kapal ? jenis_kapal : "").first();
            const country = await Country.query().where('country_code',kd_bendera ? kd_bendera : "").first();
            const checkData = await VesselGeneralInfo.query()
            .where("no_tanda_pendaftaran", no_pendaftaran_inaportnet ? no_pendaftaran_inaportnet : "")
            .orWhere("no_imo",no_imo ? no_imo : "")
            .orWhere("call_sign",call_sign ? call_sign : "").first()
            // return console.log(checkData)
            if(!checkData?.no_tanda_pendaftaran && !checkData?.no_imo && !checkData?.call_sign ){
                const checkDataDraft = await RequestVesselGeneralInfo.query()
                .where((query) => {
                    query
                    .andWhereIn("status",["DRAFT","REQUEST"])
                    .andWhereNotNull('status_inaportnet')
                })
                .andWhere((query) => {
                    query                    
                    .where('no_tanda_pendaftaran',no_pendaftaran_inaportnet ? no_pendaftaran_inaportnet:"")
                    .orWhere("no_imo",no_imo ? no_imo : "")
                    .orWhere("call_sign",call_sign ? call_sign : "")
                })
                .first()

                // return console.log(checkDataDraft)
                if(!checkDataDraft?.no_tanda_pendaftaran && !checkDataDraft?.no_imo && !checkDataDraft?.call_sign){
                    const requestNumber = await RequestVesselGeneralInfo.query().max('no_request').whereRaw(`TRUNC("created_at") = TRUNC(SYSDATE + 7/24)`).first();
                    
                    const generalInfo = new RequestVesselGeneralInfo()
                    const spesification = new RequestVesselSpecific()
                    const supportDocument = new RequestVesselSupportDocument()
                    generalInfo.kd_nm_kapal = prefix_nama_kapal
                    generalInfo.nm_kapal = nama_kapal
                    // generalInfo.kd_kapal_inaportnet = kd_kapal_inaportnet
                    generalInfo.no_tanda_pendaftaran = no_pendaftaran_inaportnet
                    generalInfo.no_imo = no_imo
                    generalInfo.call_sign = call_sign
                    generalInfo.country_id = country ? country?.country_code_3_digits : ""
                    generalInfo.nm_pemilik = nama_pemilik
                    generalInfo.th_pembuatan = tahun_pembuatan
                    generalInfo.jn_pelayaran = this.pelayaranConverter(jenis_pelayaran)
                    generalInfo.trayek = this.trayekConverter(trayek)
                    generalInfo.status_inaportnet = "I"
                    generalInfo.status = "DRAFT"
                    generalInfo.master_type_id = master_type_id
                    generalInfo.vessel_type_id = jenis_kapal ? jn_kapal?.id : ""
                    generalInfo.no_request = MasterVessel.requestNumber(requestNumber?.$extras['MAX("NO_REQUEST")'] ? requestNumber?.$extras['MAX("NO_REQUEST")'] : '0')
                    spesification.kp_loa = loa
                    spesification.kp_gt = gt
                    spesification.kp_dwt  = dwt
                    spesification.dr_maximum = draft_max
                    spesification.dr_depan = draft_depan
                    spesification.dr_belakang = draft_belakang            
                    spesification.jm_derek = jml_derek
                    spesification.jm_palka = jml_palka
                    supportDocument.no_surat_ukur = no_surat_ukur
        
                    const dataVessel = await generalInfo.useTransaction(trx).save()
                    const vesselReference = await RequestVesselGeneralInfo.query({client: trx}).where("id",dataVessel?.id).first()
                    await vesselReference?.related('specificVessel').save(spesification)
                    await vesselReference?.related('supportDocumentVessel').save(supportDocument)
        
                    const data = {
                        nama_kapal: dataVessel?.kd_nm_kapal +". " + dataVessel.nm_kapal,
                        no_pendaftaran_inaportnet: dataVessel?.no_tanda_pendaftaran,
                        no_imo: dataVessel?.no_imo,
                        call_sign: dataVessel?.call_sign 
                    }
    
                    let result = {
                        message: "Create Data Success",
                        data: data
                    }
                    // log inaportnet
                    const log = new InaportnetLog()
                    log.action = "INSERT"
                    log.payload = JSON.stringify(request.body())
                    log.response = JSON.stringify(result)
                    await log.useTransaction(trx).save()
    
                    await trx.commit()
                    
                    const nextUserApproval = await User.query().where("role_id", `${schema?.role_id}`);
                    let notificationData: any = [];
                    nextUserApproval.forEach(function(value) {
                        notificationData.push({
                            from: "INAPORTNET",
                            to: value.id,
                            request_no: vesselReference?.nm_kapal,
                            master_type_id: master_type_id,
                            status: "DRAFT"
                        });
                        Ws.io.emit("receive-notif", { userId: value.id, message: "Request Submit Master Data Kapal" });
                    });
                    // console.log(notificationData);
                    await Notification.createMany(notificationData);
                    
                    return response.status(200).send(result)

                } else {
                    const data = {
                        nama_kapal: `${checkDataDraft?.kd_nm_kapal ? checkDataDraft?.kd_nm_kapal + '. ' :'' }`  + checkDataDraft.nm_kapal,
                        no_pendaftaran_inaportnet: checkDataDraft?.no_tanda_pendaftaran,
                        no_imo: checkDataDraft?.no_imo,
                        call_sign: checkDataDraft?.call_sign 
                    }

                    let result = {
                        message: "This Data in Approval Stage",
                        data: data
                    }
                    return response.status(400).send(result)
                }

            }else{
                const checkDataDraft = await RequestVesselGeneralInfo.query()
                .where((query) => {
                    query
                    .andWhereNot("status","COMPLETED")
                    .andWhereNotNull('status_inaportnet')
                })
                .andWhere((query) => {
                    query                    
                    .where('no_tanda_pendaftaran',no_pendaftaran_inaportnet ? no_pendaftaran_inaportnet:"")
                    .orWhere("no_imo",no_imo ? no_imo : "")
                    .orWhere("call_sign",call_sign ? call_sign : "")
                })
                .first()
                // return console.log(checkDataDraft)
                const data = {
                    nama_kapal: `${checkDataDraft?.kd_nm_kapal ? checkDataDraft?.kd_nm_kapal + '. ' :'' }`  + checkDataDraft?.nm_kapal,
                    no_pendaftaran_inaportnet: checkDataDraft?.no_tanda_pendaftaran,
                    no_imo: checkDataDraft?.no_imo,
                    call_sign: checkDataDraft?.call_sign 
                }

                var resultDuplicate = {
                    message: "This Updated Data in Approval Stage",
                    data: data
                }
                
                if(checkData?.no_tanda_pendaftaran){
                    
                    if(checkDataDraft?.no_tanda_pendaftaran || checkDataDraft?.no_imo ||checkDataDraft?.call_sign)
                    return response.status(400).send(resultDuplicate)

                    const dataGeneralInfo = await VesselGeneralInfo?.findByOrFail("no_tanda_pendaftaran",checkData?.no_tanda_pendaftaran)
                    const requestNumber = await RequestVesselGeneralInfo.query().max('no_request').whereRaw(`TRUNC("created_at") = TRUNC(SYSDATE + 7/24)`).first();
                    const generalInfo = new RequestVesselGeneralInfo()
                    const spesification = new RequestVesselSpecific()
                    const supportDocument = new RequestVesselSupportDocument()


                    generalInfo.kd_nm_kapal = prefix_nama_kapal
                    generalInfo.nm_kapal = nama_kapal
                    // generalInfo.kd_kapal_inaportnet = kd_kapal_inaportnet
                    generalInfo.no_tanda_pendaftaran = no_pendaftaran_inaportnet
                    generalInfo.no_imo = no_imo
                    generalInfo.call_sign = call_sign
                    generalInfo.country_id = country ? country?.country_code_3_digits : ""
                    generalInfo.th_pembuatan = tahun_pembuatan
                    generalInfo.jn_pelayaran = this.pelayaranConverter(jenis_pelayaran)
                    generalInfo.nm_pemilik = nama_pemilik
                    generalInfo.trayek = this.trayekConverter(trayek)
                    generalInfo.status_inaportnet = "U"
                    generalInfo.status = "DRAFT"
                    generalInfo.master_type_id = master_type_id
                    generalInfo.vessel_type_id = jenis_kapal ? jn_kapal?.id : ""
                    generalInfo.no_request = MasterVessel.requestNumber(requestNumber?.$extras['MAX("NO_REQUEST")'] ? requestNumber?.$extras['MAX("NO_REQUEST")'] : '0')
                    generalInfo.reference_id = dataGeneralInfo?.id
                    spesification.kp_loa = loa
                    spesification.kp_gt = gt
                    spesification.kp_dwt  = dwt
                    spesification.dr_maximum = draft_max
                    spesification.dr_depan = draft_depan
                    spesification.dr_belakang = draft_belakang            
                    spesification.jm_derek = jml_derek
                    spesification.jm_palka = jml_palka
                    supportDocument.no_surat_ukur = no_surat_ukur           
                    
                    const dataVessel = await generalInfo.useTransaction(trx).save()
                    const vesselReference = await RequestVesselGeneralInfo.query({client: trx}).where("id",dataVessel?.id).first()
                    await vesselReference?.related('specificVessel').save(spesification)
                    await vesselReference?.related('supportDocumentVessel').save(supportDocument)
                    // is Edit
                    dataGeneralInfo.isedit = 1
                    await dataGeneralInfo.useTransaction(trx).save()
                    
                    const data = {
                        nama_kapal: dataVessel?.kd_nm_kapal +". " + dataVessel.nm_kapal,
                        no_pendaftaran_inaportnet: dataVessel?.no_tanda_pendaftaran,
                        no_imo: dataVessel?.no_imo,
                        call_sign: dataVessel?.call_sign 
                    }

                    let result = {
                        message: "Updated Data Success",
                        data: data
                    }
                    // log inaportnet
                    const log = new InaportnetLog()
                    log.action = "UPDATE"
                    log.payload = JSON.stringify(request.body())
                    log.response = JSON.stringify(result)
                    await log.useTransaction(trx).save()

                    await trx.commit()

                    const nextUserApproval = await User.query().where("role_id", `${schema?.role_id}`);
                    let notificationData: any = [];
                    nextUserApproval.forEach(function(value) {
                        notificationData.push({
                            from: "INAPORTNET",
                            to: value.id,
                            request_no: vesselReference?.nm_kapal,
                            master_type_id: master_type_id,
                            status: "DRAFT"
                        });
                        Ws.io.emit("receive-notif", { userId: value.id, message: "Request Submit Master Data Kapal" });
                    });
                    // console.log(notificationData);
                    await Notification.createMany(notificationData);

                    return response.status(200).send(result)
                } else if(checkData?.no_imo){
                    if(checkDataDraft?.no_tanda_pendaftaran || checkDataDraft?.no_imo ||checkDataDraft?.call_sign)
                    return response.status(400).send(resultDuplicate)

                    const dataGeneralInfo = await VesselGeneralInfo?.findByOrFail("no_imo",checkData?.no_imo)
                    const requestNumber = await RequestVesselGeneralInfo.query().max('no_request').whereRaw(`TRUNC("created_at") = TRUNC(SYSDATE + 7/24)`).first();

                    const generalInfo = new RequestVesselGeneralInfo()
                    const spesification = new RequestVesselSpecific()
                    const supportDocument = new RequestVesselSupportDocument()

                    generalInfo.kd_nm_kapal = prefix_nama_kapal
                    generalInfo.nm_kapal = nama_kapal
                    // generalInfo.kd_kapal_inaportnet = kd_kapal_inaportnet
                    generalInfo.no_tanda_pendaftaran = no_pendaftaran_inaportnet
                    generalInfo.no_imo = no_imo
                    generalInfo.call_sign = call_sign
                    generalInfo.country_id = country ? country?.country_code_3_digits : ""
                    generalInfo.th_pembuatan = tahun_pembuatan
                    generalInfo.nm_pemilik = nama_pemilik
                    generalInfo.jn_pelayaran = this.pelayaranConverter(jenis_pelayaran)
                    generalInfo.trayek = this.trayekConverter(trayek)
                    generalInfo.status_inaportnet = "U"
                    generalInfo.status = "DRAFT"
                    generalInfo.master_type_id = master_type_id
                    generalInfo.vessel_type_id = jenis_kapal ? jn_kapal?.id : ""
                    generalInfo.no_request = MasterVessel.requestNumber(requestNumber?.$extras['MAX("NO_REQUEST")'] ? requestNumber?.$extras['MAX("NO_REQUEST")'] : '0')
                    generalInfo.reference_id = dataGeneralInfo?.id
                    spesification.kp_loa = loa
                    spesification.kp_gt = gt
                    spesification.kp_dwt  = dwt
                    spesification.dr_maximum = draft_max
                    spesification.dr_depan = draft_depan
                    spesification.dr_belakang = draft_belakang            
                    spesification.jm_derek = jml_derek
                    spesification.jm_palka = jml_palka
                    supportDocument.no_surat_ukur = no_surat_ukur           
                    
                    const dataVessel = await generalInfo.useTransaction(trx).save()
                    const vesselReference = await RequestVesselGeneralInfo.query({client: trx}).where("id",dataVessel?.id).first()
                    await vesselReference?.related('specificVessel').save(spesification)
                    await vesselReference?.related('supportDocumentVessel').save(supportDocument)
                    // is Edit
                    dataGeneralInfo.isedit = 1
                    await dataGeneralInfo.useTransaction(trx).save()
                    
                    const data = {
                        nama_kapal: dataVessel?.kd_nm_kapal +". " + dataVessel.nm_kapal,
                        no_pendaftaran_inaportnet: dataVessel?.no_tanda_pendaftaran,
                        no_imo: dataVessel?.no_imo,
                        call_sign: dataVessel?.call_sign 
                    }

                    let result = {
                        message: "Updated Data Success",
                        data: data
                    }
                    // log inaportnet
                    const log = new InaportnetLog()
                    log.action = "UPDATE"
                    log.payload = JSON.stringify(request.body())
                    log.response = JSON.stringify(result)
                    await log.useTransaction(trx).save()

                    await trx.commit()

                    const nextUserApproval = await User.query().where("role_id", `${schema?.role_id}`);
                    let notificationData: any = [];
                    nextUserApproval.forEach(function(value) {
                        notificationData.push({
                            from: "INAPORTNET",
                            to: value.id,
                            request_no: vesselReference?.nm_kapal,
                            master_type_id: master_type_id,
                            status: "DRAFT"
                        });
                        Ws.io.emit("receive-notif", { userId: value.id, message: "Request Submit Master Data Kapal" });
                    });
                    // console.log(notificationData);
                    await Notification.createMany(notificationData);

                    return response.status(200).send(result)
                } else if(checkData?.call_sign){
                    if(checkDataDraft?.no_tanda_pendaftaran || checkDataDraft?.no_imo ||checkDataDraft?.call_sign)
                    return response.status(400).send(resultDuplicate)

                    const dataGeneralInfo = await VesselGeneralInfo?.findByOrFail("call_sign",checkData?.call_sign)
                    const requestNumber = await RequestVesselGeneralInfo.query().max('no_request').whereRaw(`TRUNC("created_at") = TRUNC(SYSDATE + 7/24)`).first();

                    const generalInfo = new RequestVesselGeneralInfo()
                    const spesification = new RequestVesselSpecific()
                    const supportDocument = new RequestVesselSupportDocument()

                    generalInfo.kd_nm_kapal = prefix_nama_kapal
                    generalInfo.nm_kapal = nama_kapal
                    // generalInfo.kd_kapal_inaportnet = kd_kapal_inaportnet
                    generalInfo.no_tanda_pendaftaran = no_pendaftaran_inaportnet
                    generalInfo.no_imo = no_imo
                    generalInfo.call_sign = call_sign
                    generalInfo.country_id = country ? country?.country_code_3_digits : ""
                    generalInfo.th_pembuatan = tahun_pembuatan
                    generalInfo.nm_pemilik = nama_pemilik
                    generalInfo.jn_pelayaran = this.pelayaranConverter(jenis_pelayaran)
                    generalInfo.trayek = this.trayekConverter(trayek)
                    generalInfo.status_inaportnet = "U"
                    generalInfo.status = "DRAFT"
                    generalInfo.master_type_id = master_type_id
                    generalInfo.vessel_type_id = jenis_kapal ? jn_kapal?.id : ""
                    generalInfo.no_request = MasterVessel.requestNumber(requestNumber?.$extras['MAX("NO_REQUEST")'] ? requestNumber?.$extras['MAX("NO_REQUEST")'] : '0')
                    generalInfo.reference_id = dataGeneralInfo?.id
                    spesification.kp_loa = loa
                    spesification.kp_gt = gt
                    spesification.kp_dwt  = dwt
                    spesification.dr_maximum = draft_max
                    spesification.dr_depan = draft_depan
                    spesification.dr_belakang = draft_belakang            
                    spesification.jm_derek = jml_derek
                    spesification.jm_palka = jml_palka
                    supportDocument.no_surat_ukur = no_surat_ukur           
                    
                    const dataVessel = await generalInfo.useTransaction(trx).save()
                    const vesselReference = await RequestVesselGeneralInfo.query({client: trx}).where("id",dataVessel?.id).first()
                    await vesselReference?.related('specificVessel').save(spesification)
                    await vesselReference?.related('supportDocumentVessel').save(supportDocument)
                    // is Edit
                    dataGeneralInfo.isedit = 1
                    await dataGeneralInfo.useTransaction(trx).save()

                    const data = {
                        nama_kapal: dataVessel?.kd_nm_kapal +". " + dataVessel.nm_kapal,
                        no_pendaftaran_inaportnet: dataVessel?.no_tanda_pendaftaran,
                        no_imo: dataVessel?.no_imo,
                        call_sign: dataVessel?.call_sign 
                    }

                    let result = {
                        message: "Updated Data Success",
                        data: data
                    }
                    // log inaportnet
                    const log = new InaportnetLog()
                    log.action = "UPDATE"
                    log.payload = JSON.stringify(request.body())
                    log.response = JSON.stringify(result)
                    await log.useTransaction(trx).save()

                    await trx.commit()

                    const nextUserApproval = await User.query().where("role_id", `${schema?.role_id}`);
                    let notificationData: any = [];
                    nextUserApproval.forEach(function(value) {
                        notificationData.push({
                            from: "INAPORTNET",
                            to: value.id,
                            request_no: vesselReference?.nm_kapal,
                            master_type_id: master_type_id,
                            status: "DRAFT"
                        });
                        Ws.io.emit("receive-notif", { userId: value.id, message: "Request Submit Master Data Kapal" });
                    });
                    // console.log(notificationData);
                    await Notification.createMany(notificationData);

                    return response.status(200).send(result)
                }

            }   
        } catch (error) {
            console.log(error)
            await trx.rollback()
            let result = {
                message: "Create Data Failed",
                detail: error?.messages
            }
            return response.status(500).send(result)
            // response.badRequest(error.messages)
        }
    }

    private trayekConverter(name:string|null|undefined){
        const trayek = {
            "LINER": "1",
            "TRAMPER": "2"
        }
        
        if (name === null || name === undefined) {
            return "";
        }

        if(name in trayek){
            return trayek[`${name}`]
        } else {
          return ""
        }
    }

    private pelayaranConverter(name:string|null|undefined){
        const pelayaran = {
            "Dalam Negeri": "1",
            "Luar Negeri": "2",
            "Rakyat": "3",
            "Perintis": "4"
        }
        
        if (name === null || name === undefined) {
            return "";
        }

        if(name in pelayaran){
            return pelayaran[`${name}`]
        } else {
          return ""
        }
    }
}
