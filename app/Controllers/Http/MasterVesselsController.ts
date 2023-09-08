import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import excel from 'exceljs';
import Country from 'App/Models/Country';
import RequestVesselGeneralInfo from 'App/Models/RequestVesselGeneralInfo';
import RequestVesselSpecific from 'App/Models/RequestVesselSpecific';
import RequestVesselSupportDocument from 'App/Models/RequestVesselSupportDocument';
import Role from 'App/Models/Role';
import SchemaAplication from 'App/Models/SchemaAplication';
import VesselType from 'App/Models/VesselType';
import MasterVessel from 'App/Services/MasterVessel';
import Application from '@ioc:Adonis/Core/Application'
import ApprovalLog from 'App/Models/ApprovalLog';
import SchemaApprovalList from 'App/Models/SchemaApprovalList';
import User from 'App/Models/User';
import Ws from 'App/Services/Ws';
import SendMail from 'App/Services/SendMail';
import Notification from 'App/Models/Notification';
import ApprovalHeader from 'App/Models/ApprovalHeader';
import ApprovalDetail from 'App/Models/ApprovalDetail';
import VesselTypeAdditional from 'App/Models/VesselTypeAdditional';
import JenisPelayaran from 'App/Models/JenisPelayaran'; 
import StatusKapal from 'App/Models/StatusKapal';
import JenisSuratUkur from 'App/Models/JenisSuratUkur';
import JenisNamaKapal from 'App/Models/JenisNamaKapal';
import Drive from '@ioc:Adonis/Core/Drive';
import { Exception } from '@adonisjs/core/build/standalone';
import VesselGeneralInfo from 'App/Models/VesselGeneralInfo';
import VesselSpecification from 'App/Models/VesselSpesification';
import VesselSupportDocument from 'App/Models/VesselSupportDocument';
import CreateVesselValidator from 'App/Validators/CreateVesselValidator';
import RenewalVesselValidator from 'App/Validators/RenewalVesselValidator';
import SapIntegration from 'App/Util/SapIntegration';
import VesselTrayek from 'App/Models/VesselTrayek';
import Env from '@ioc:Adonis/Core/Env'
// import AWS from 'aws-sdk';
import {S3Client,PutObjectCommand} from '@aws-sdk/client-s3';
import fs from 'fs';
import VesselAdditionalPivot from 'App/Models/VesselAdditionalPivot';
export default class MasterVesselsController {
    public async index({view, request}: HttpContextContract) {
        let requestData = request.input('request')
        let status = request.input('status')
        // let testingData = await RequestVesselGeneralInfo.query().preload('additionalInfo', (query) => {
        //     query.leftJoin('vessel_type_additionals', 'vessel_additional_pivots.kd_additional_info', '=', 'vessel_type_additionals.kd_additonal_info')
        // }).where('id', '12e7ba1a-e2cf-494c-a9d1-519f82cd4e09').first()
        // let testingData = await RequestVesselGeneralInfo.query().preload('additionalInfo', (query) => {
        //     query.preload('additionalInfo')
        // }).where('id', '12e7ba1a-e2cf-494c-a9d1-519f82cd4e09').first()
        // let val = testingData?.additionalInfo?.map(el => el.kd_additional_info)
        // return console.log(val);
        
        // return console.log(testingData);
        
        let vesselArray:any = []
        let vessels
        let statusData
        if (requestData == undefined || requestData == 'active') {
            statusData = 'ACTIVE'
            if (status == 'ACTIVE' || status == undefined) {
                vessels = await VesselGeneralInfo
                .query()
                .preload('specificVessel')
                .preload('supportDocumentVessel')
                .preload('kdBendera')
                .preload('spesifikKapal')
                .leftJoin('countries','vessel_general_infos.country_id','=','countries.country_code_3_digits')
                .where('status', 'ACTIVE')
                .orderBy('created_at', 'desc')
            } else if(status == 'INACTIVE') {
                vessels = await VesselGeneralInfo
                .query()
                .preload('specificVessel')
                .preload('supportDocumentVessel')
                .preload('kdBendera')
                .preload('spesifikKapal')
                .leftJoin('countries','vessel_general_infos.country_id','=','countries.country_code_3_digits')
                .where('status', 'INACTIVE')
                .orderBy('created_at', 'desc')
                } else if(status == 'all') {
                vessels = await VesselGeneralInfo
                .query()
                .preload('specificVessel')
                .preload('supportDocumentVessel')
                .preload('kdBendera')
                .preload('spesifikKapal')
                .leftJoin('countries','vessel_general_infos.country_id','=','countries.country_code_3_digits')
                .orderBy('created_at', 'desc')
                }
        } else if(requestData == 'outstanding') {
            statusData = 'OUTSTANDING'
            if(status == 'REQUEST') {
                vessels = await RequestVesselGeneralInfo
                .query()
                .preload('specificVessel')
                .preload('supportDocumentVessel')
                .preload('kdBendera')
                .preload('spesifikKapal')
                .leftJoin('countries','request_vessel_general_infos.country_id','=','countries.country_code_3_digits')
                .where('status', 'REQUEST')
                .orderBy('updated_at', 'desc')
            } else if(status == 'REJECT') {
                vessels = await RequestVesselGeneralInfo
                .query()
                .preload('specificVessel')
                .preload('supportDocumentVessel')
                .preload('kdBendera')
                .preload('spesifikKapal')
                .leftJoin('countries','request_vessel_general_infos.country_id','=','countries.country_code_3_digits')
                .where('status', 'REJECT')
                .orderBy('updated_at', 'desc')
            } else if(status == 'DRAFT') {
                vessels = await RequestVesselGeneralInfo
                .query()
                .preload('specificVessel')
                .preload('supportDocumentVessel')
                .preload('kdBendera')
                .preload('spesifikKapal')
                .leftJoin('countries','request_vessel_general_infos.country_id','=','countries.country_code_3_digits')
                .where('status', 'DRAFT')
                .orderBy('updated_at', 'desc')
            } else if(status == 'all') {
                vessels = await RequestVesselGeneralInfo
                .query()
                .preload('specificVessel')
                .preload('supportDocumentVessel')
                .preload('kdBendera')
                .preload('spesifikKapal')
                .leftJoin('countries','request_vessel_general_infos.country_id','=','countries.country_code_3_digits')
                .orderBy('updated_at', 'desc')
                .whereNot('status', 'COMPLETED')
            }
        }
        
        let req = await Database.from('request_vessel_general_infos').count(`* as number`).whereRaw(`"status" = 'REQUEST'`);
        let draft = await Database.from('request_vessel_general_infos').count(`* as number`).whereRaw(`"status" = 'DRAFT'`);
        let reject = await Database.from('request_vessel_general_infos').count(`* as number`).whereRaw(`"status" = 'REJECT'`);
        let active = await Database.from('vessel_general_infos').count(`* as number`).whereRaw(`"status" = 'ACTIVE'`);
        let inactive = await Database.from('vessel_general_infos').count(`* as number`).whereRaw(`"status" = 'INACTIVE'`);
        
        let dataCount = {
            request: req[0],
            draft: draft[0],
            reject: reject[0],
            active: active[0],
            inactive: inactive[0]
        }
        
        vessels?.forEach((el) => {
            vesselArray.push({
                id: el?.id,
                no_request: el?.no_request,
                nama: el?.nm_kapal,
                kdNamaKapal: el?.kd_nm_kapal ? el?.kd_nm_kapal : "",
                spesifikasiKapal: el?.spesifikKapal?.spesifik_kapal ? el?.spesifikKapal?.spesifik_kapal : "",
                loa: el?.specificVessel?.kp_loa,
                gt: el?.specificVessel?.kp_gt,
                imo: el?.no_imo,
                callSign: el?.call_sign,
                status: el?.status,
                noRequest: el?.no_request,
                schema_id: el?.schema_id,
                country_id : el?.$extras.country_code,
                isEdit : el?.isedit
            })
        })


        return view.render('pages/master_kapal/index', {data: vesselArray, dataCount, statusData});
    }

    public async add({view}: HttpContextContract) {
        //years list
        let tahun = await this.yearList(1960);
        const country = await Country.all();
        const jenisKapal = await VesselType.query().distinct("jn_kapal");
        const typeAdditional = await VesselTypeAdditional.query();
        const jenisPelayaran = await JenisPelayaran.query();
        const statusKapal = await StatusKapal.query();
        const jenisSuratUkur = await JenisSuratUkur.query();
        const prefixNamaKapal = await JenisNamaKapal.query();
        const vesselTrayek = await VesselTrayek.query();        

        let state = {
            tahun: tahun,
            jenisKapal: jenisKapal?.map(jnKapal => jnKapal?.jn_kapal),
            typeAdditional: typeAdditional,
            jenisPelayaran: jenisPelayaran,
            trayek: vesselTrayek,
            statusKapal: statusKapal,
            jenisSuratUkur: jenisSuratUkur,
            prefixNamaKapal: prefixNamaKapal
        };

        return view.render('pages/master_kapal/create', {data: state,country});
    }

    public async edit({view, params}: HttpContextContract) {
        try {
        let id = params.id
        let prevData
        let prevCountry:any
        let prevPelayaran:any
        let prevTrayek:any
        let state:any
        let kapal:any 
        
        const refId:any = await RequestVesselGeneralInfo.query()
                        .where('id', id)
                        .first()

        if(refId?.status_inaportnet == 'U') {
            kapal = await VesselGeneralInfo.query()
            .preload('supportDocumentVessel')
            .preload('specificVessel')
            .preload('additionalInfo', (query) => {
                query.leftJoin('vessel_type_additionals', 'vessel_additional_pivots.kd_additional_info', '=', 'vessel_type_additionals.kd_additonal_info')
            })
            .where('id', refId?.reference_id)
            .first()

            prevPelayaran = await JenisPelayaran.query().where('kd_jenis_pelayaran', kapal?.jn_pelayaran).first()
            prevTrayek = await VesselTrayek.query().where('kd_trayek', kapal?.trayek).first()
            prevCountry = await Country.query().where('country_code_3_digits', kapal?.country_id).first()
        } else {
            kapal = await RequestVesselGeneralInfo.query()
            .preload('specificVessel')
            .preload('supportDocumentVessel')
            .preload('additionalInfo', (query) => {
                query.leftJoin('vessel_type_additionals', 'vessel_additional_pivots.kd_additional_info', '=', 'vessel_type_additionals.kd_additonal_info')
            })
            .where('id', id)
            .first()
        }

        if(refId?.status_inaportnet == 'U') {
            prevData = await RequestVesselGeneralInfo.query()
                        .preload('supportDocumentVessel')
                        .preload('specificVessel')
                        .where('id', id)
                        .first()

        } 
                
        let tahun = await this.yearList(1960);
        const country = await Country.all();
        const jenisKapal = await VesselType.query().distinct("jn_kapal");
        const typeAdditional = await VesselTypeAdditional.query();
        const jenisPelayaran = await JenisPelayaran.query();
        const statusKapal = await StatusKapal.query();
        const jenisSuratUkur = await JenisSuratUkur.query();
        const prefixNamaKapal = await JenisNamaKapal.query();
        const typeJenisKapal = await VesselType.query().where('id', kapal?.vessel_type_id).first();
        const typeKapal = await VesselType.query().select('tipe_kapal').where('jn_kapal', typeJenisKapal?.jn_kapal ? typeJenisKapal?.jn_kapal : '').distinct('tipe_kapal');
        const spesifikKapal = await VesselType.query().select('id', 'spesifik_kapal').where('tipe_kapal', typeJenisKapal?.tipe_kapal ? typeJenisKapal?.tipe_kapal : '');
        const vesselTrayek = await VesselTrayek.query();
        let spmp = async (fileName) => {
            let url = await Drive.getUrl(fileName)
            return url
        }        
          
        if(refId?.status_inaportnet == 'U') {
            state = {
                statusInaportnet: refId?.status_inaportnet,
                prevPelayaran: prevPelayaran,
                prevTrayek: prevTrayek,
                prevData: prevData,
                prevCountry: `${prevCountry?.country_name} - ${prevCountry?.country_code_3_digits}`,
                tahun: tahun,
                jenisKapal: jenisKapal?.map(jnKapal => jnKapal?.jn_kapal),
                typeAdditional: typeAdditional,
                jenisPelayaran: jenisPelayaran,
                statusKapal: statusKapal,
                jenisSuratUkur: jenisSuratUkur,
                prefixNamaKapal: prefixNamaKapal,
                prefixNama: prevData?.kd_nm_kapal,
                namaKapal: prevData?.nm_kapal,
                call_sign: prevData?.call_sign ? prevData?.call_sign : '',
                trayek: vesselTrayek,
                kd_kapal_inaportnet: kapal?.kd_kapal_inaportnet,
                url_surat_ukur: await spmp(kapal?.supportDocumentVessel.surat_ukur),
                url_surat_ppka: await spmp(kapal?.supportDocumentVessel.surat_ppka),
                url_surat_ppkm: await spmp(kapal?.supportDocumentVessel.surat_ppkm),
                url_surat_mmsi: await spmp(kapal?.supportDocumentVessel.surat_mmsi),
                url_surat_pendaftaran: await spmp(kapal?.supportDocumentVessel.surat_pendaftaran),
                spesifikKapal: spesifikKapal,
                typeKapal: typeKapal,
                typeJenisKapal: typeJenisKapal,
                existTypeKapal: typeJenisKapal?.tipe_kapal,
                existSpesifikKapal: typeJenisKapal?.spesifik_kapal,
                kodeInaportnet: prevData?.kd_kapal_inaportnet,
                noPendaftaran: prevData?.no_tanda_pendaftaran,
                noImo: prevData?.no_imo,
                kdBendera: prevData?.country_id,
                namaPemilik: prevData?.nm_pemilik,
                tahunPembuatan: prevData?.th_pembuatan,
                jnPelayaran: prevData?.jn_pelayaran,
                trayekData: prevData?.trayek,
                jmDerek: prevData?.specificVessel.jm_derek,
                loa: prevData?.specificVessel.kp_loa,
                gt: prevData?.specificVessel.kp_gt,
                dwt: prevData?.specificVessel.kp_dwt,
                drMax: prevData?.specificVessel.dr_maximum,
                drDepan: prevData?.specificVessel.dr_depan,
                drBelakang: prevData?.specificVessel.dr_belakang,
                jmPalka: prevData?.specificVessel.jm_palka,
                noSuratUkur: prevData?.supportDocumentVessel.no_surat_ukur,
                kdAdditional: kapal?.additionalInfo
            };
        } else {
            state = {
                prevPelayaran: prevPelayaran,
                prevTrayek: prevTrayek,
                prevData: prevData,
                prevCountry: `${prevCountry?.country_name} - ${prevCountry?.country_code_3_digits}`,
                tahun: tahun,
                jenisKapal: jenisKapal?.map(jnKapal => jnKapal?.jn_kapal),
                typeAdditional: typeAdditional,
                jenisPelayaran: jenisPelayaran,
                statusKapal: statusKapal,
                jenisSuratUkur: jenisSuratUkur,
                prefixNamaKapal: prefixNamaKapal,
                prefixNama: kapal?.kd_nm_kapal,
                namaKapal: kapal?.nm_kapal,
                call_sign: kapal?.call_sign?kapal?.call_sign : '',
                trayek: vesselTrayek,
                kd_kapal_inaportnet: kapal.kd_kapal_inaportnet,
                url_surat_ukur: await spmp(kapal?.supportDocumentVessel.surat_ukur),
                url_surat_ppka: await spmp(kapal?.supportDocumentVessel.surat_ppka),
                url_surat_ppkm: await spmp(kapal?.supportDocumentVessel.surat_ppkm),
                url_surat_mmsi: await spmp(kapal?.supportDocumentVessel.surat_mmsi),
                url_surat_pendaftaran: await spmp(kapal?.supportDocumentVessel.surat_pendaftaran),
                spesifikKapal: spesifikKapal,
                typeKapal: typeKapal,
                typeJenisKapal: typeJenisKapal,
                existTypeKapal: typeJenisKapal?.tipe_kapal,
                existSpesifikKapal: typeJenisKapal?.spesifik_kapal,
                kodeInaportnet: kapal?.kd_kapal_inaportnet,
                noPendaftaran: kapal?.no_tanda_pendaftaran,
                noImo: kapal?.no_imo,
                kdBendera: kapal?.country_id,
                namaPemilik: kapal?.nm_pemilik,
                tahunPembuatan: kapal?.th_pembuatan,
                jnPelayaran: kapal?.jn_pelayaran,
                trayekData: kapal?.trayek,
                jmDerek: kapal?.specificVessel.jm_derek,
                loa: kapal?.specificVessel.kp_loa,
                gt: kapal?.specificVessel.kp_gt,
                dwt: kapal?.specificVessel.kp_dwt,
                drMax: kapal?.specificVessel.dr_maximum,
                drDepan: kapal?.specificVessel.dr_depan,
                drBelakang: kapal?.specificVessel.dr_belakang,
                jmPalka: kapal?.specificVessel.jm_palka,
                noSuratUkur: kapal?.supportDocumentVessel.no_surat_ukur,
                kdAdditional: kapal?.additionalInfo
            };
        }


        return view.render('pages/master_kapal/page/outstanding/edit', {data: state,country, kapal});
        } catch (error) {
            return error;
        }
    }

    public async store({request,response,auth}:HttpContextContract) {
        
        if (request.input("status") == "DRAFT" || request.input("status") == "REQUEST") {
           await request.validate(CreateVesselValidator)
        }

        const master_type_id:string = '70150798-2aed-4b9e-b3fa-b9fe00bbe3f3';
        const vesselNameAlias:string = request.input('kd-kapal') 
        const schema = await SchemaAplication.query().select('id').where("role_id",`${auth.user?.role_id}`).andWhere("master_type_id",master_type_id).first();
        const entity_id = await Role.query().select('entity_id').where('id', `${auth.user?.role_id}`).first();
        const requestNumber = await RequestVesselGeneralInfo.query().max('no_request').whereRaw(`TRUNC("created_at") = TRUNC(SYSDATE + 7/24)`).first();
        const countVesselName = await RequestVesselGeneralInfo.query().select('kd_kapal').where("nm_kapal_alias",vesselNameAlias).orderBy("created_at","desc").limit(1).first();
        const vesselCode = MasterVessel.vesselCode(countVesselName?.kd_kapal ? countVesselName?.kd_kapal : "0" ,vesselNameAlias)
        // const requestNumber = await RequestVesselGeneralInfo.query().count('* as number').whereRaw(`TRUNC("created_at") = TRUNC(SYSDATE + 7/24)`).first();
        // const countVesselName = await RequestVesselGeneralInfo.query().max('kd_kapal').where("kd_nm_kapal",vesselNameAlias).first()
        const generalInfo = new RequestVesselGeneralInfo()
        generalInfo.kd_kapal = vesselCode
        generalInfo.nm_kapal = request.input('nama-kapal')
        generalInfo.nm_kapal_alias = request.input('kd-kapal')
        generalInfo.kd_nm_kapal = request.input('kd-nama-kapal')
        generalInfo.kd_history_kapal = request.input('kd-history-kapal')
        generalInfo.call_sign = request.input('call-sign')
        generalInfo.no_imo = request.input('no-imo')
        generalInfo.mmsi = request.input('mmsi')
        generalInfo.nm_pemilik = request.input('nama-pemilik')
        generalInfo.nm_pemilik_lama = request.input('pemilik-lama')
        // generalInfo.catatan_jn_kapal = request.input('catatan-jenis')
        // generalInfo.kd_kapal_inaportnet = request.input('kode-kapal-inaportnet')
        generalInfo.no_tanda_pendaftaran = request.input('tanda-pendaftaran')
        generalInfo.jn_pelayaran = request.input('jenis-pelayaran')
        // generalInfo.vessel_type_additional_id = request.input('info-tambahan')
        generalInfo.trayek = request.input('trayek')
        generalInfo.st_kapal = request.input('status-kepemilikan')
        generalInfo.th_pembuatan = request.input('tahun-pembuatan')
        generalInfo.country_id = request.input('country-id')
        generalInfo.vessel_type_id = request.input('spesifik-kapal')
        generalInfo.status = request.input('status')
        generalInfo.submitter = auth.user?.id ? auth.user?.id : ""
        generalInfo.entity_id = entity_id?.entity_id ? entity_id?.entity_id : ""
        generalInfo.master_type_id = master_type_id
        generalInfo.schema_id = schema?.id ? schema?.id : ""
        generalInfo.no_request = MasterVessel.requestNumber(requestNumber?.$extras['MAX("NO_REQUEST")'] ? requestNumber?.$extras['MAX("NO_REQUEST")'] : '0')
        
        const additional_info = request.input('info-tambahan')        

        const specific = new RequestVesselSpecific()
        specific.kp_gt = request.input('kapasitas-gt')
        specific.kp_dwt = request.input('kapasitas-dwt')
        specific.kp_brt = request.input('kapasitas-brt')
        specific.kp_nrt = request.input('kapasitas-nrt')
        specific.kp_loa = request.input('panjang-loa')? this.changeToNumber(request.input('panjang-loa')) : null;
        specific.kp_lebar = request.input('lebar-kapal')? this.changeToNumber(request.input('lebar-kapal')) : null;
        specific.kp_tinggi = request.input('tinggi-kapal') ? this.changeToNumber(request.input('tinggi-kapal')) : null;
        specific.dr_maximum = request.input('draft-maximum')? this.changeToNumber(request.input('draft-maximum')) : null;
        specific.dr_depan = request.input('draft-depan')? this.changeToNumber(request.input('draft-depan')) : null;
        specific.dr_belakang = request.input('draft-belakang')? this.changeToNumber(request.input('draft-belakang')) : null;
        specific.max_speed = request.input('max-speed') ? this.changeToNumber(request.input('max-speed')) : null;
        specific.jm_palka = request.input('jumlah-palka')
        specific.horse_power = request.input('horse-power')
        specific.jm_derek = request.input('jumlah-derek')
        specific.jn_derek = request.input('jenis-derek')

        const supportDocument = new RequestVesselSupportDocument()
        supportDocument.no_surat_ukur = request.input('no-surat-ukur')
        supportDocument.no_ppka = request.input('no-ppka')
        supportDocument.no_ppkm = request.input('no-ppkm')
        supportDocument.jn_surat_ukur = request.input('jenis-surat-ukur')
        supportDocument.surat_ukur = request.input('surat-ukur-file')
        supportDocument.surat_ppka = request.input('surat-ppka-file')
        supportDocument.surat_ppkm = request.input('surat-ppkm-file')
        supportDocument.surat_mmsi = request.input('doc-mmsi-file')
        supportDocument.surat_pendaftaran = request.input('surat-tanda-pendaftaran-file')
        supportDocument.tgl_terbit_ppka = request.input('terbit-ppka')? new Date(request.input('terbit-ppka')) : null;
        supportDocument.tgl_berlaku_ppka = request.input('berlaku-ppka')? new Date(request.input('berlaku-ppka')) : null;
        supportDocument.tgl_terbit_ppkm = request.input('terbit-ppkm')? new Date(request.input('terbit-ppkm')) : null;
        supportDocument.tgl_berlaku_ppkm = request.input('berlaku-ppkm')? new Date(request.input('berlaku-ppkm')) : null;
        supportDocument.tgl_surat_ukur = request.input('tanggal-surat-ukur')? new Date(request.input('tanggal-surat-ukur')) : null;
        const trx = await Database.transaction();

        try {
            const dataGeneralInfo = await generalInfo.useTransaction(trx).save()
            const vesselRelated = await RequestVesselGeneralInfo.query({client: trx}).where("id",dataGeneralInfo?.id).first()
            if(additional_info) {
                await vesselRelated?.related("additionalInfo").createMany(additional_info)
            }
            const dataSpesific = await vesselRelated?.related('specificVessel').save(specific)
            const dataSupportDocument = await vesselRelated?.related('supportDocumentVessel').save(supportDocument)
            
            // console.log(dataSpesific);
            // console.log(dataSupportDocument);
            // NOTIFICATION
            if (request.input("status") == "REQUEST") {
                // create log approval
                const approvalLog = new ApprovalLog();
                approvalLog.request_no = dataGeneralInfo?.no_request;
                approvalLog.action = "SUBMITED";
                approvalLog.remark = request.input("remarks");
                approvalLog.created_by = `${auth.user?.id}`;
                await approvalLog.save();

                const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", `${schema?.id}`).where("approval_order", "1");
                let nextApprovalRoleArray: any = [];
                nextApprovalRole.forEach(function(value) {
                    nextApprovalRoleArray.push(value.role_id);
                });
                const nextUserApproval = await User.query().whereIn("role_id", nextApprovalRoleArray);
                let notificationData: any = [];
                nextUserApproval.forEach(async function(value) {
                notificationData.push({
                    from: auth.user?.id,
                    to: value.id,
                    request_no: dataGeneralInfo?.no_request,
                    master_type_id: master_type_id,
                    status: "APPROVED"
                });
                Ws.io.emit("receive-notif", { userId: value.id, message: "Request Approval Master Data Kapal" });
                // send email notification
                await SendMail.approve(value.id, dataGeneralInfo?.submitter, dataGeneralInfo?.master_type_id, dataGeneralInfo?.no_request);
                });
                await Notification.createMany(notificationData);
            }
            
            await trx.commit()
            let result = {
                "message": "Data Kapal Berhasil Dibuat"
            }

            return response.status(200).send(result)
        } catch (error) {
            console.log(error);
            
            await trx.rollback()
            let result = {
                "message": "Data Kapal Gagal Dibuat",
                "detail": error.message
            }
            return response.status(500).send(result)
        }

    }

    public async updateData({params,request,response,auth}:HttpContextContract){
        const id = params.id

        let kapalAlias = request.input('nama-kapal-alias')
        console.log(kapalAlias);
        let kdHistory = request.input('kd_history_kapal')
        console.log(kdHistory);

        if(request.input('vessel-id') || request.input('status-inaportnet')){
            console.log("renewal")
            await request.validate(RenewalVesselValidator)
        } else {
            console.log("edit")
            await request.validate(CreateVesselValidator)    
        }
        
        const vesselNameAlias:string = request.input('nama-kapal-alias') 
        const master_type_id:string = '70150798-2aed-4b9e-b3fa-b9fe00bbe3f3';
        const schema = await SchemaAplication.query().select('id').where("role_id",`${auth.user?.role_id}`).andWhere("master_type_id",master_type_id).first();
        const entity_id = await Role.query().select('entity_id').where('id', `${auth.user?.role_id}`).first();
        let tmp_kd_kapal:string
        const generalInfo = await RequestVesselGeneralInfo.findByOrFail("id",id)
        const specific = await RequestVesselSpecific.findByOrFail("request_vessel_id",id)
        const supportDocument = await RequestVesselSupportDocument.findByOrFail("request_vessel_id",id)
        const vesselAdditionalPivot = await VesselAdditionalPivot.query().delete().where('request_vessel_id', id)

        if(generalInfo?.kd_kapal){
            tmp_kd_kapal = request.input('kd-kapal')
        } else {
            const countVesselName = await RequestVesselGeneralInfo.query().select('kd_kapal').where("nm_kapal_alias",vesselNameAlias).orderBy("created_at","desc").limit(1).first()
            const vesselCode = MasterVessel.vesselCode(countVesselName?.kd_kapal ? countVesselName?.kd_kapal : "0" ,vesselNameAlias)
            tmp_kd_kapal = vesselCode;
        }
        generalInfo.kd_kapal = tmp_kd_kapal
        generalInfo.nm_kapal = request.input('nama-kapal')
        generalInfo.nm_kapal_alias = request.input('nama-kapal-alias')
        generalInfo.kd_nm_kapal = request.input('kd-nama-kapal')
        generalInfo.kd_history_kapal = request.input('kd-history-kapal')
        generalInfo.call_sign = request.input('call-sign')
        generalInfo.no_imo = request.input('no-imo')
        generalInfo.mmsi = request.input('mmsi')
        generalInfo.jn_pelayaran = request.input('jenis-pelayaran')
        generalInfo.nm_pemilik = request.input('nama-pemilik')
        generalInfo.nm_pemilik_lama = request.input('pemilik-lama')
        // generalInfo.catatan_jn_kapal = request.input('catatan-jenis')
        generalInfo.trayek = request.input('trayek')
        generalInfo.kd_kapal_inaportnet = request.input('kode-kapal-inaportnet')
        generalInfo.st_kapal = request.input('status-kepemilikan')
        generalInfo.no_tanda_pendaftaran = request.input('no-tanda-pendaftaran')
        generalInfo.th_pembuatan = request.input('tahun-pembuatan')
        generalInfo.country_id = request.input('country-id')
        generalInfo.vessel_type_id = request.input('spesifik-kapal')
        // generalInfo.vessel_type_additional_id = request.input('info-tambahan')
        generalInfo.status = request.input('status')
        generalInfo.submitter = auth.user?.id ? auth.user?.id : ""
        generalInfo.entity_id = entity_id?.entity_id ? entity_id?.entity_id : ""
        generalInfo.schema_id = schema?.id ? schema?.id : "" 

        const additional_info = request.input('info-tambahan')

        specific.kp_gt = request.input('kapasitas-gt')
        specific.kp_dwt = request.input('kapasitas-dwt')
        specific.kp_brt = request.input('kapasitas-brt')
        specific.kp_nrt = request.input('kapasitas-nrt')
        specific.kp_loa = request.input('panjang-loa')? this.changeToNumber(request.input('panjang-loa')) : null;
        specific.kp_lebar = request.input('lebar-kapal')? this.changeToNumber(request.input('lebar-kapal')) : null;
        specific.kp_tinggi = request.input('tinggi-kapal') ? this.changeToNumber(request.input('tinggi-kapal')) : null;
        specific.dr_maximum = request.input('draft-maximum')? this.changeToNumber(request.input('draft-maximum')) : null;
        specific.dr_depan = request.input('draft-depan')? this.changeToNumber(request.input('draft-depan')) : null;
        specific.dr_belakang = request.input('draft-belakang')? this.changeToNumber(request.input('draft-belakang')) : null;
        specific.max_speed = request.input('max-speed') ? this.changeToNumber(request.input('max-speed')) : null;
        specific.kp_loa = request.input('panjang-loa')? this.changeToNumber(request.input('panjang-loa')) : null;
        specific.kp_lebar = request.input('lebar-kapal')? this.changeToNumber(request.input('lebar-kapal')) : null;
        specific.kp_tinggi = request.input('tinggi-kapal') ? this.changeToNumber(request.input('tinggi-kapal')) : null;
        specific.dr_maximum = request.input('draft-maximum')? this.changeToNumber(request.input('draft-maximum')) : null;
        specific.dr_depan = request.input('draft-depan')? this.changeToNumber(request.input('draft-depan')) : null;
        specific.dr_belakang = request.input('draft-belakang')? this.changeToNumber(request.input('draft-belakang')) : null;
        specific.max_speed = request.input('max-speed') ? this.changeToNumber(request.input('max-speed')) : null;
        specific.jm_palka = request.input('jumlah-palka')
        specific.horse_power = request.input('horse-power')
        specific.jm_derek = request.input('jumlah-derek')
        specific.jn_derek = request.input('jenis-derek')

        supportDocument.no_surat_ukur = request.input('no-surat-ukur')
        supportDocument.no_ppka = request.input('no-ppka')
        supportDocument.no_ppkm = request.input('no-ppkm')
        supportDocument.jn_surat_ukur = request.input('jenis-surat-ukur')
        supportDocument.surat_ukur = request.input('surat-ukur-file')
        supportDocument.surat_ppka = request.input('surat-ppka-file')
        supportDocument.surat_ppkm = request.input('surat-ppkm-file')
        supportDocument.surat_mmsi = request.input('doc-mmsi-file')
        supportDocument.surat_pendaftaran = request.input('surat-tanda-pendaftaran-file')
        supportDocument.tgl_terbit_ppka = request.input('terbit-ppka')? new Date(request.input('terbit-ppka')) : null
        supportDocument.tgl_berlaku_ppka = request.input('berlaku-ppka')? new Date(request.input('berlaku-ppka')) : null
        supportDocument.tgl_terbit_ppkm = request.input('terbit-ppkm')? new Date(request.input('terbit-ppkm')) : null
        supportDocument.tgl_berlaku_ppkm = request.input('berlaku-ppkm')? new Date(request.input('berlaku-ppkm')) : null
        supportDocument.tgl_surat_ukur = request.input('tanggal-surat-ukur')? new Date(request.input('tanggal-surat-ukur')) : null;
        
        const trx = await Database.transaction();

        try {
            generalInfo.useTransaction(trx)
            specific.useTransaction(trx)
            supportDocument.useTransaction(trx)

            const dataGeneralInfo = await generalInfo.save()
            if(additional_info){
                await dataGeneralInfo?.related("additionalInfo").createMany(additional_info)
            }
            const dataSpecific = await specific.save()
            const dataSupportDocument = await supportDocument.save()

            // NOTIFICATION
            if (request.input("status") == "REQUEST" && request.input("is-reject") != "REJECT") {
                // create log approval
                const approvalLog = new ApprovalLog();
                approvalLog.request_no = dataGeneralInfo?.no_request;
                approvalLog.action = "SUBMITED";
                approvalLog.remark = request.input("remarks");
                approvalLog.created_by = `${auth.user?.id}`;
                await approvalLog.save();

                const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", `${schema?.id}`).where("approval_order", "1");
                let nextApprovalRoleArray: any = [];
                nextApprovalRole.forEach(function(value) {
                    nextApprovalRoleArray.push(value.role_id);
                });
                const nextUserApproval = await User.query().whereIn("role_id", nextApprovalRoleArray);
                let notificationData: any = [];
                nextUserApproval.forEach(async function(value) {
                notificationData.push({
                    from: auth.user?.id,
                    to: value.id,
                    request_no: dataGeneralInfo?.no_request,
                    master_type_id: master_type_id,
                    status: "APPROVED"
                });
                Ws.io.emit("receive-notif", { userId: value.id, message: "Request Approval Master Data Kapal" });
                // send email notification
                await SendMail.approve(value.id, dataGeneralInfo?.submitter, dataGeneralInfo?.master_type_id, dataGeneralInfo?.no_request);
                });
                console.log(notificationData);
                await Notification.createMany(notificationData);
            }

            if (request.input("is-reject") == "REJECT") {
                // create log approval
                const approvalLog = new ApprovalLog();
                approvalLog.request_no = dataGeneralInfo?.no_request;
                approvalLog.action = "UPDATED";
                approvalLog.remark = request.input("remarks");
                approvalLog.created_by = `${auth.user?.id}`;
                await approvalLog.save();

                const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", `${schema?.id}`).where("approval_order", "1");
                let nextApprovalRoleArray: any = [];
                nextApprovalRole.forEach(function(value) {
                    nextApprovalRoleArray.push(value.role_id);
                });
                const nextUserApproval = await User.query().whereIn("role_id", nextApprovalRoleArray);
                let notificationData: any = [];
                nextUserApproval.forEach(async function(value) {
                notificationData.push({
                    from: auth.user?.id,
                    to: value.id,
                    request_no: dataGeneralInfo?.no_request,
                    master_type_id: master_type_id,
                    status: "APPROVED"
                });
                Ws.io.emit("receive-notif", { userId: value.id, message: "Request Approval Master Data Kapal" });
                // send email notification
                await SendMail.approve(value.id, dataGeneralInfo?.submitter, dataGeneralInfo?.master_type_id, dataGeneralInfo?.no_request);
                });
                console.log(notificationData);
                await Notification.createMany(notificationData);
            }
            
            await trx.commit()
            let result = {
                "message": "Data Kapal Berhasil Diubah"
            }

            return response.status(200).send(result)
        } catch (error) {
            console.log(error)
            await trx.rollback()
            let result = {
                "message": "Data Kapal Gagal Diubah"
            }
            return response.status(500).send(result)
        }

    }

    public async viewRenewal({view, params}: HttpContextContract) {
        try {
            let id = params.id
            
            const kapal:any = await VesselGeneralInfo.query()
                .preload('specificVessel')
                .preload('supportDocumentVessel')
                .preload('additionalInfo', (query) => {
                    query.leftJoin('vessel_type_additionals', 'vessel_additional_pivots.kd_additional_info', '=', 'vessel_type_additionals.kd_additonal_info')
                })
                .where('id', id)
                .first()
            
            let tahun = await this.yearList(1960);
            const country = await Country.all();
            const jenisKapal = await VesselType.query().distinct("jn_kapal");
            const typeAdditional = await VesselTypeAdditional.query();
            const jenisPelayaran = await JenisPelayaran.query();
            const statusKapal = await StatusKapal.query();
            const jenisSuratUkur = await JenisSuratUkur.query();
            const prefixNamaKapal = await JenisNamaKapal.query();
            const typeJenisKapal = await VesselType.query().where('id', kapal?.vessel_type_id).first();
            const typeKapal = await VesselType.query().select('tipe_kapal').where('jn_kapal', typeJenisKapal?.jn_kapal ? typeJenisKapal?.jn_kapal : '').distinct('tipe_kapal');
            const spesifikKapal = await VesselType.query().select('id', 'spesifik_kapal').where('tipe_kapal', typeJenisKapal?.tipe_kapal ? typeJenisKapal?.tipe_kapal : '');
            const vesselTrayek = await VesselTrayek.query();
            let spmp = async (fileName) => {
                let url = await Drive.getUrl(fileName)
                return url
            }        
            
            let state = {
                tahun: tahun,
                jenisKapal: jenisKapal?.map(jnKapal => jnKapal?.jn_kapal),
                typeAdditional: typeAdditional,
                jenisPelayaran: jenisPelayaran,
                statusKapal: statusKapal,
                jenisSuratUkur: jenisSuratUkur,
                prefixNamaKapal: prefixNamaKapal,
                prefixNama: kapal?.kd_nm_kapal,
                namaKapal: kapal?.nm_kapal,
                call_sign: kapal?.call_sign?kapal?.call_sign : '',
                trayek: vesselTrayek,
                kd_kapal_inaportnet: kapal?.kd_kapal_inaportnet,
                url_surat_ukur: await spmp(kapal?.supportDocumentVessel.surat_ukur),
                url_surat_ppka: await spmp(kapal?.supportDocumentVessel.surat_ppka),
                url_surat_ppkm: await spmp(kapal?.supportDocumentVessel.surat_ppkm),
                url_surat_mmsi: await spmp(kapal?.supportDocumentVessel.surat_mmsi),
                url_surat_pendaftaran: await spmp(kapal?.supportDocumentVessel.surat_pendaftaran),
                spesifikKapal: spesifikKapal,
                typeKapal: typeKapal,
                typeJenisKapal: typeJenisKapal,
                existTypeKapal: typeJenisKapal?.tipe_kapal,
                existSpesifikKapal: typeJenisKapal?.spesifik_kapal,
                kdAdditional: kapal?.additionalInfo
            };
    
    
            return view.render('pages/master_kapal/page/approved/renewal', {data: state,country, kapal});
            } catch (error) {
                return error;
            }
    }

    public async storeRenewal({request,response,auth}:HttpContextContract) {
        await request.validate(RenewalVesselValidator)
        const master_type_id:string = '70150798-2aed-4b9e-b3fa-b9fe00bbe3f3';
        // const vesselNameAlias:string = request.input('kd-nama-kapal') 
        const schema = await SchemaAplication.query().select('id').where("role_id",`${auth.user?.role_id}`).andWhere("master_type_id",master_type_id).first();
        const entity_id = await Role.query().select('entity_id').where('id', `${auth.user?.role_id}`).first();
        const requestNumber = await RequestVesselGeneralInfo.query().max('no_request').whereRaw(`TRUNC("created_at") = TRUNC(SYSDATE + 7/24)`).first();
        // const countVesselName = await RequestVesselGeneralInfo.query().select('kd_kapal').where("kd_nm_kapal",vesselNameAlias).orderBy("created_at","desc").limit(1).first();
        // const vesselCode = MasterVessel.vesselCode(countVesselName?.kd_kapal ? countVesselName?.kd_kapal : "0" ,vesselNameAlias)
        // const countVesselName = await RequestVesselGeneralInfo.query().max('kd_kapal').where("kd_nm_kapal",vesselNameAlias).first()

        const generalInfo = new RequestVesselGeneralInfo()
        generalInfo.kd_kapal = request.input('kd-kapal')
        generalInfo.nm_kapal = request.input('nama-kapal')
        generalInfo.nm_kapal_alias = request.input('nama-kapal-alias')
        generalInfo.kd_nm_kapal = request.input('kd-nama-kapal')
        generalInfo.kd_history_kapal = request.input('kd-history-kapal')
        generalInfo.call_sign = request.input('call-sign')
        generalInfo.no_imo = request.input('no-imo')
        generalInfo.mmsi = request.input('mmsi')
        generalInfo.kd_kapal_inaportnet = request.input('kode-kapal-inaportnet')
        generalInfo.no_tanda_pendaftaran = request.input('no-tanda-pendaftaran')
        generalInfo.nm_pemilik = request.input('nama-pemilik')
        generalInfo.nm_pemilik_lama = request.input('pemilik-lama')
        generalInfo.status_inaportnet = request.input('status_inaportnet');
        // generalInfo.catatan_jn_kapal = request.input('catatan-jenis')
        generalInfo.jn_pelayaran = request.input('jenis-pelayaran')
        // generalInfo.vessel_type_additional_id = request.input('info-tambahan')
        generalInfo.trayek = request.input('trayek')
        generalInfo.st_kapal = request.input('status-kepemilikan')
        generalInfo.th_pembuatan = request.input('tahun-pembuatan')
        generalInfo.country_id = request.input('country-id')
        generalInfo.vessel_type_id = request.input('spesifik-kapal')
        generalInfo.status = request.input('status')
        generalInfo.submitter = auth.user?.id ? auth.user?.id : ""
        generalInfo.entity_id = entity_id?.entity_id ? entity_id?.entity_id : ""
        generalInfo.master_type_id = master_type_id
        generalInfo.schema_id = schema?.id ? schema?.id : ""
        generalInfo.no_request = MasterVessel.requestNumber(requestNumber?.$extras['MAX("NO_REQUEST")'] ? requestNumber?.$extras['MAX("NO_REQUEST")'] : '0')
        generalInfo.reference_id = request.input('vessel-id')
        
        const additional_info = request.input('info-tambahan') 

        const specific = new RequestVesselSpecific()
        specific.kp_gt = request.input('kapasitas-gt')
        specific.kp_dwt = request.input('kapasitas-dwt')
        specific.kp_brt = request.input('kapasitas-brt')
        specific.kp_nrt = request.input('kapasitas-nrt')
        specific.kp_loa = request.input('panjang-loa')? this.changeToNumber(request.input('panjang-loa')) : null;
        specific.kp_lebar = request.input('lebar-kapal')? this.changeToNumber(request.input('lebar-kapal')) : null;
        specific.kp_tinggi = request.input('tinggi-kapal') ? this.changeToNumber(request.input('tinggi-kapal')) : null;
        specific.dr_maximum = request.input('draft-maximum')? this.changeToNumber(request.input('draft-maximum')) : null;
        specific.dr_depan = request.input('draft-depan')? this.changeToNumber(request.input('draft-depan')) : null;
        specific.dr_belakang = request.input('draft-belakang')? this.changeToNumber(request.input('draft-belakang')) : null;
        specific.max_speed = request.input('max-speed') ? this.changeToNumber(request.input('max-speed')) : null;
        specific.jm_palka = request.input('jumlah-palka')
        specific.jm_derek = request.input('jumlah-derek')
        specific.horse_power = request.input('horse-power')
        specific.jn_derek = request.input('jenis-derek')

        const supportDocument = new RequestVesselSupportDocument()
        supportDocument.no_surat_ukur = request.input('no-surat-ukur')
        supportDocument.no_ppka = request.input('no-ppka')
        supportDocument.no_ppkm = request.input('no-ppkm')
        supportDocument.jn_surat_ukur = request.input('jenis-surat-ukur')
        supportDocument.surat_ukur = request.input('surat-ukur-file')
        supportDocument.surat_ppka = request.input('surat-ppka-file')
        supportDocument.surat_ppkm = request.input('surat-ppkm-file')
        supportDocument.surat_mmsi = request.input('doc-mmsi-file')
        supportDocument.surat_pendaftaran = request.input('surat-tanda-pendaftaran-file')
        supportDocument.tgl_terbit_ppka = request.input('terbit-ppka')? new Date(request.input('terbit-ppka')) : null;
        supportDocument.tgl_berlaku_ppka = request.input('berlaku-ppka')? new Date(request.input('berlaku-ppka')) : null;
        supportDocument.tgl_terbit_ppkm = request.input('terbit-ppkm')? new Date(request.input('terbit-ppkm')) : null;
        supportDocument.tgl_berlaku_ppkm = request.input('berlaku-ppkm')? new Date(request.input('berlaku-ppkm')) : null;
        supportDocument.tgl_surat_ukur = request.input('tanggal-surat-ukur')? new Date(request.input('tanggal-surat-ukur')) : null;

        const trx = await Database.transaction();

        try {
            const dataGeneralInfo = await generalInfo.useTransaction(trx).save()
            const vesselRelated = await RequestVesselGeneralInfo.query({client: trx}).where("id",dataGeneralInfo?.id).first()
            if(additional_info) {
                await vesselRelated?.related("additionalInfo").createMany(additional_info)
            }
            const dataSpesific = await vesselRelated?.related('specificVessel').save(specific)
            const dataSupportDocument = await vesselRelated?.related('supportDocumentVessel').save(supportDocument)
            
            const statusEdit = await VesselGeneralInfo.findByOrFail('id',vesselRelated?.reference_id)
            statusEdit.isedit = 1
            await statusEdit.useTransaction(trx).save()

            console.log(dataSpesific);
            console.log(dataSupportDocument);
            // NOTIFICATION
            if (request.input("status") == "REQUEST") {
                // create log approval
                const approvalLog = new ApprovalLog();
                // approvalLog.request_no = dataGeneralInfo?.no_request;
                // approvalLog.action = "SUBMITED";
                // approvalLog.remark = "";
                // approvalLog.created_by = `${auth.user?.id}`;
                // await approvalLog.save();

                approvalLog.request_no = dataGeneralInfo?.no_request;
                approvalLog.action = "SUBMITED";
                approvalLog.remark = request.input("remarks");
                approvalLog.created_by = `${auth.user?.id}`;
                await approvalLog.save();


                
                const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", `${schema?.id}`).where("approval_order", "1");
                let nextApprovalRoleArray: any = [];
                nextApprovalRole.forEach(function(value) {
                    nextApprovalRoleArray.push(value.role_id);
                });
                const nextUserApproval = await User.query().whereIn("role_id", nextApprovalRoleArray);
                let notificationData: any = [];
                nextUserApproval.forEach(async function(value) {
                notificationData.push({
                    from: auth.user?.id,
                    to: value.id,
                    request_no: dataGeneralInfo?.no_request,
                    master_type_id: master_type_id,
                    status: "APPROVED"
                });
                Ws.io.emit("receive-notif", { userId: value.id, message: "Request Approval Master Data Kapal" });
                // send email notification
                await SendMail.approve(value.id, dataGeneralInfo?.submitter, dataGeneralInfo?.master_type_id, dataGeneralInfo?.no_request);
                });
                console.log(notificationData);
                await Notification.createMany(notificationData);
            }
            
            await trx.commit()
            let result = {
                "message": "Data Kapal Berhasil Dibuat"
            }

            return response.status(200).send(result)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            let result = {
                "message": "Data Kapal Gagal Dibuat"
            }
            return response.status(500).send(result)
        }

    }
    
    public async destroy({ response, params, session, bouncer }: HttpContextContract) {
        // await bouncer.authorize('access', 'delete-vessel')
        const id = params.id
        const trx = await Database.transaction();
        try {
            const vessel  = await RequestVesselGeneralInfo.findBy("id",id)
            
            if(vessel?.reference_id){
                const vesselReal = await VesselGeneralInfo.findByOrFail("id",vessel?.reference_id)
                vesselReal.isedit = 0
                await vesselReal.useTransaction(trx).save()
            }
            
            const approvalHeader = await ApprovalHeader.findBy("no_request",vessel?.no_request);
            const approvalLog = await ApprovalLog.findBy("request_no",vessel?.no_request);
           
            if(approvalHeader){
                const approvalDetail = await ApprovalDetail.findBy("header_id",approvalHeader?.id);
                await approvalDetail?.useTransaction(trx).delete();
                await approvalHeader?.useTransaction(trx).delete();
                await approvalLog?.useTransaction(trx).delete();
                await vessel?.useTransaction(trx).delete();
            }else {
                await vessel?.useTransaction(trx).delete();
            }

            await trx.commit();
            return response.redirect().toRoute('master-kapal')
        } catch (error) {
            await trx.rollback();
            return error
        }
    }

    public async approval({request,response,auth}:HttpContextContract){
        const trx = await Database.transaction()
        try {
            const noRequest = request.input("no_request");
            const remark = request.input("remark");
            
            let approvalSequence = 0;
            let approvalHeaderId = "";
            let dataAdditionalInfo:any

            const requestVessel = await RequestVesselGeneralInfo.query()
            .preload('specificVessel')
            .preload('supportDocumentVessel')
            .preload('additionalInfo', (query) => {
                query.leftJoin('vessel_type_additionals', 'vessel_additional_pivots.kd_additional_info', '=', 'vessel_type_additionals.kd_additonal_info')
            })
            .where("no_request", noRequest).first();
            
            function mapingAdditonalInfo(val) {
            let data = val?.map(el => {
                const value = {
                kd_additional_info: el.kd_additional_info
                }
                return value
            })
            return data
            }

            if(requestVessel?.additionalInfo) {
                dataAdditionalInfo = mapingAdditonalInfo(requestVessel?.additionalInfo)
            }
            
            const masterSchemaId = requestVessel?.schema_id
            const status = requestVessel?.status
            const submitter = requestVessel?.submitter
            const masterType = requestVessel?.master_type_id
            const schema = await SchemaAplication.query().where("id", `${masterSchemaId}`).preload("approvalList").first();
            const SchemaApprovalMax = await SchemaApprovalList.query().where("schema_id", `${schema?.id}`).orderBy("approval_order", "desc").first();
            const approveHeader = await ApprovalHeader.query().where("no_request", noRequest).first();
            const approvalRoleMandatory:any = [];
            const approvalRoleOptional:any = [];
            let step = 1;
    
            if (approveHeader) {
                approvalSequence = approveHeader.approval_sequence;
                step = approveHeader.step;
            }
    
            const nextApprovalSequece = approvalSequence + 1;
            schema?.approvalList.forEach(function (value) {
                if (value.mandatory == "1" && value.approval_order == `${nextApprovalSequece}`) {
                    approvalRoleMandatory.push(value.role_id);
                }
    
                if (value.mandatory == "0" && value.approval_order == `${nextApprovalSequece}`) {
                    approvalRoleOptional.push(value.role_id);
                }
            });
            
            
            if (!schema) {
                throw new Exception("Schema Not Found");
            }
            
            if (status == "REJECT" || status == "DRAFT") {
                throw new Exception("Data Customer Masih Dalam Perbaikan");
            }
            
            if (status == "ACTIVE") {
                throw new Exception("Data Customer Sudah Selesai Prosess Persetujuan");
            }
            
            const userApprove = await SchemaApprovalList.query().where("schema_id", schema.id).where("approval_order", nextApprovalSequece).where("role_id", `${auth.user?.role_id}`).first();    
            if (!userApprove) {
                throw new Exception("Anda Tidak Mempunyai Aksess Untuk Melakukan Approval Selanjutnya");
            }
    
            if (!approveHeader) {
                const approvalHeader = new ApprovalHeader();
                approvalHeader.no_request = noRequest;
                approvalHeader.total_approve = SchemaApprovalMax?.approval_order ? parseInt(SchemaApprovalMax?.approval_order) : 0;
                approvalHeader.id_submitter = `${auth.user?.id}`;
                approvalHeader.approval_sequence = 0;
                approvalHeader.step = 1;
                // approvalHeader.useTransaction(trx)
                await approvalHeader.save();
                approvalHeaderId = approvalHeader.id;
            } else {
                approvalHeaderId = approveHeader.id;
            }
    
    
            const cekApproval = await ApprovalDetail.query().where("header_id", approvalHeaderId).where("step", step).where("sequence", nextApprovalSequece).where("role_id", `${auth.user?.role_id}`).first();
    
            if (cekApproval) {
                throw new Exception("Anda Sudah Melakukan Approval Sebelumnya");
            }
    
            const approvalDetail = new ApprovalDetail();
            approvalDetail.user_id = `${auth.user?.id}`;
            approvalDetail.validation = "APPROVE";
            approvalDetail.header_id = approvalHeaderId;
            approvalDetail.remark = remark;
            approvalDetail.sequence = nextApprovalSequece;
            approvalDetail.role_id = `${auth.user?.role_id}`;
            approvalDetail.step = step;
            // approvalDetail.useTransaction(trx)
            await approvalDetail.save();
    
            let allowedOptional = true;
            const isMandatory = await ApprovalDetail.query().where("header_id", approvalHeaderId).whereIn("role_id", approvalRoleMandatory).where("step", step).where("sequence", nextApprovalSequece);
            if (approvalRoleOptional.length > 0) {
                const isOptional = await ApprovalDetail.query().where("header_id", approvalHeaderId).whereIn("role_id", approvalRoleOptional).where("step", step).where("sequence", nextApprovalSequece);
                if (isOptional.length == 0) {
                    allowedOptional = false;
                }
            }
            
            if (isMandatory.length == approvalRoleMandatory.length && allowedOptional){
                const approvalHeader = await ApprovalHeader.findOrFail(approvalHeaderId);
                approvalHeader.approval_sequence = nextApprovalSequece;
                // approvalHeader.useTransaction(trx)
                await approvalHeader.save();

                if (`${nextApprovalSequece}` == SchemaApprovalMax?.approval_order){
                    let generalInfo:any = null
                    let specificaction:any = null
                    let supportDocument:any = null
                    let vesselId:any = null

                    if(requestVessel?.reference_id){
                        generalInfo = await VesselGeneralInfo.findByOrFail("id",requestVessel?.reference_id)
                        specificaction = await VesselSpecification.findByOrFail("vessel_id",requestVessel?.reference_id)
                        supportDocument = await VesselSupportDocument.findByOrFail("vessel_id",requestVessel?.reference_id)
                        const vesselAdditionalPivot = await VesselAdditionalPivot.query().delete().where('vessel_id', requestVessel?.reference_id)
                    }else{
                        generalInfo = new VesselGeneralInfo()
                        specificaction = new VesselSpecification()
                        supportDocument = new VesselSupportDocument()
                    }

                    generalInfo.kd_kapal = requestVessel?.kd_kapal
                    generalInfo.kd_history_kapal = requestVessel?.kd_history_kapal
                    generalInfo.kd_kapal_inaportnet = requestVessel?.kd_kapal_inaportnet
                    generalInfo.no_tanda_pendaftaran = requestVessel?.no_tanda_pendaftaran
                    generalInfo.nm_kapal = requestVessel?.nm_kapal
                    generalInfo.nm_kapal_alias = requestVessel?.nm_kapal_alias
                    generalInfo.kd_nm_kapal = requestVessel?.kd_nm_kapal
                    generalInfo.call_sign = requestVessel?.call_sign
                    generalInfo.no_imo = requestVessel?.no_imo
                    generalInfo.mmsi = requestVessel?.mmsi
                    generalInfo.nm_pemilik = requestVessel?.nm_pemilik
                    generalInfo.nm_pemilik_lama = requestVessel?.nm_pemilik_lama
                    generalInfo.catatan_jn_kapal = requestVessel?.catatan_jn_kapal
                    generalInfo.jn_pelayaran = requestVessel?.jn_pelayaran
                    generalInfo.trayek = requestVessel?.trayek
                    generalInfo.st_kapal = requestVessel?.st_kapal
                    generalInfo.th_pembuatan = requestVessel?.th_pembuatan
                    generalInfo.country_id = requestVessel?.country_id
                    generalInfo.vessel_type_id = requestVessel?.vessel_type_id
                    generalInfo.vessel_type_additional_id = requestVessel?.vessel_type_additional_id
                    generalInfo.status_inaportnet = requestVessel?.status_inaportnet
                    generalInfo.status = "ACTIVE"
                    generalInfo.submitter = requestVessel?.submitter
                    generalInfo.entity_id = requestVessel?.entity_id
                    generalInfo.master_type_id = requestVessel?.master_type_id
                    generalInfo.schema_id = requestVessel?.schema_id
                    generalInfo.isedit = 0
                    if(requestVessel?.reference_id){
                        generalInfo.last_update_by = requestVessel?.user?.name
                    }else{
                        generalInfo.submitted_by = requestVessel?.user?.name
                        generalInfo.last_update_by = requestVessel?.user?.name
                    }

                    specificaction.kp_gt = requestVessel?.specificVessel?.kp_gt
                    specificaction.kp_dwt = requestVessel?.specificVessel?.kp_dwt
                    specificaction.kp_brt = requestVessel?.specificVessel?.kp_brt
                    specificaction.kp_nrt = requestVessel?.specificVessel?.kp_nrt
                    specificaction.kp_loa = requestVessel?.specificVessel?.kp_loa
                    specificaction.kp_lebar = requestVessel?.specificVessel?.kp_lebar
                    specificaction.kp_tinggi = requestVessel?.specificVessel?.kp_tinggi
                    specificaction.dr_maximum = requestVessel?.specificVessel?.dr_maximum
                    specificaction.dr_depan = requestVessel?.specificVessel?.dr_depan
                    specificaction.dr_belakang = requestVessel?.specificVessel?.dr_belakang
                    specificaction.max_speed = requestVessel?.specificVessel?.max_speed
                    specificaction.jm_palka = requestVessel?.specificVessel?.jm_palka
                    specificaction.jm_derek = requestVessel?.specificVessel?.jm_derek
                    specificaction.jn_derek = requestVessel?.specificVessel?.jn_derek
                    specificaction.horse_power = requestVessel?.specificVessel?.horse_power
                    
                    supportDocument.no_surat_ukur = requestVessel?.supportDocumentVessel?.no_surat_ukur
                    supportDocument.no_ppka = requestVessel?.supportDocumentVessel?.no_ppka
                    supportDocument.no_ppkm = requestVessel?.supportDocumentVessel?.no_ppkm
                    supportDocument.jn_surat_ukur = requestVessel?.supportDocumentVessel?.jn_surat_ukur
                    supportDocument.surat_ukur = requestVessel?.supportDocumentVessel?.surat_ukur
                    supportDocument.surat_ppka = requestVessel?.supportDocumentVessel?.surat_ppka
                    supportDocument.surat_ppkm = requestVessel?.supportDocumentVessel?.surat_ppkm
                    supportDocument.surat_mmsi = requestVessel?.supportDocumentVessel?.surat_mmsi
                    supportDocument.tgl_terbit_ppka = requestVessel?.supportDocumentVessel?.tgl_terbit_ppka
                    supportDocument.tgl_berlaku_ppka = requestVessel?.supportDocumentVessel?.tgl_berlaku_ppka
                    supportDocument.tgl_terbit_ppkm = requestVessel?.supportDocumentVessel?.tgl_terbit_ppkm
                    supportDocument.tgl_berlaku_ppkm = requestVessel?.supportDocumentVessel?.tgl_berlaku_ppkm
                    supportDocument.tgl_surat_ukur = requestVessel?.supportDocumentVessel?.tgl_surat_ukur
                    
                    const dataGeneralInfo = await generalInfo.save()
                    const vesselRelated = await VesselGeneralInfo.query().where("id",dataGeneralInfo?.id).first()
                    if(requestVessel?.additionalInfo) {
                        await vesselRelated?.related("additionalInfo").createMany(dataAdditionalInfo)
                    }
                    specificaction.vessel_id = vesselRelated?.id
                    supportDocument.vessel_id = vesselRelated?.id
                    vesselId = vesselRelated?.id
                    const dataspesification = await specificaction.save()
                    const dataSupportDocument = await supportDocument.save()


                    const updateRequestVessel = await RequestVesselGeneralInfo.findOrFail(requestVessel?.id);
                    updateRequestVessel.status = "COMPLETED";
                    await updateRequestVessel.save();
                    
                    if(!requestVessel?.reference_id) {
                        await SapIntegration.createKapal(vesselId)
                        await MasterVessel.phinnisiIntegrate(vesselId)                        
                    } else if (requestVessel?.reference_id) {
                        await MasterVessel.phinnisiUpdate(vesselId,null)
                        await SapIntegration.createKapal(vesselId)                        
                    }

                    
                }
            }

            //NOTIFICATION
            const approvalLog = new ApprovalLog();
            approvalLog.request_no = noRequest;
            approvalLog.action = "APPROVED";
            approvalLog.remark = remark ;
            approvalLog.created_by = `${auth.user?.id}`;
            approvalLog.useTransaction(trx)
            await approvalLog.save();

            const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", schema?.id).where("approval_order", nextApprovalSequece + 1);
            let nextApprovalRoleArray: any = [];
            nextApprovalRole.forEach(function(value) {
                nextApprovalRoleArray.push(value.role_id);
            });
            const nextUserApproval = await User.query().whereIn("role_id", nextApprovalRoleArray);
            let notificationData: any = [];
            nextUserApproval.forEach(async function(value) {
                notificationData.push({
                    from: `${auth.user?.id}`,
                    to: value.id,
                    request_no: noRequest,
                    master_type_id: masterType,
                    status:'APPROVED'
                });
                Ws.io.emit('receive-notif', { userId: value.id,message:'Request Approval Master Data Customer' });
                // await SendMail.approve(value.id, submitter, masterType, noRequest);
            });
            await Notification.createMany(notificationData);

            await trx.commit()
            let result = {
                message : "Berhasil Disetujui",
            }
    
            return response.status(200).send(result);        
        } catch (error) {
            console.log(error)
            await trx.rollback()
            let result = {
            "message": error.message
            };
            return response.status(500).send(result); 
        }
    }

    public async reject({request,response,auth}:HttpContextContract){
        const trx = await Database.transaction()

        try {
            const noRequest = request.input("no_request");
            const remark = request.input("remark");
            let approvalSequence = 0;
            let approvalHeaderId = "";
            
            const requestVessel = await RequestVesselGeneralInfo.query().where("no_request", noRequest).first();
            const masterSchemaId = requestVessel?.schema_id
            const status = requestVessel?.status
            const submitter = requestVessel?.submitter
            const masterType = requestVessel?.master_type_id
            const schema = await SchemaAplication.query().where("id", `${masterSchemaId}`).preload("approvalList").first();

            if (status == "REJECT" || status == "DRAFT") {
            throw new Exception("Data Kapal Masih Dalam Perbaikan");
            }
            if (status == "COMPLETED") {
            throw new Exception("Data Kapal Sudah Selesai Prosess Persetujuan");
            }
            const approveHeader = await ApprovalHeader.query().where("no_request", noRequest).first();
            const approvalRoleMandatory:any = [];
    
    
            if (approveHeader) {
            approvalSequence = approveHeader.approval_sequence;
            }
    
            const nextApprovalSequece = approvalSequence + 1;
            schema?.approvalList.forEach(function(value) {
            if (value.mandatory == "1" && value.approval_order == `${nextApprovalSequece}`) {
                approvalRoleMandatory.push(value.role_id);
            }
            });
            if (!schema) {
            throw new Exception("Schema Not Found");
            }
    
            const userApprove = await SchemaApprovalList.query().where("schema_id", schema.id).where("approval_order", nextApprovalSequece).where("role_id", `${auth?.user?.role_id}`).first();
    
            if (!userApprove) {
            throw new Exception("Anda Tidak Mempunyai Aksess Untuk Melakukan Approval Selanjutnya");
            }
    
            if (approveHeader) {
                approvalHeaderId = approveHeader.id;
        
                const cekApproval = await ApprovalDetail.query().where("header_id", approvalHeaderId).where("step", approveHeader.step).where("sequence", nextApprovalSequece).where("role_id", `${auth?.user?.role_id}`).first();
        
                if (cekApproval) {
                    throw new Exception("Anda Sudah Melakukan Approval Sebelumnya");
                }
        
                const approvalDetail = new ApprovalDetail();
                approvalDetail.user_id = `${auth?.user?.id}`;
                approvalDetail.validation = "REJECT";
                approvalDetail.header_id = approvalHeaderId;
                approvalDetail.remark = remark;
                approvalDetail.sequence = nextApprovalSequece;
                approvalDetail.role_id = `${auth?.user?.role_id}`;
                approvalDetail.step = approveHeader.step;
                approvalDetail.useTransaction(trx)
                await approvalDetail.save();
        
                const UpdateRequestVessel = await RequestVesselGeneralInfo.findOrFail(requestVessel?.id);
                UpdateRequestVessel.status = "REJECT";
                UpdateRequestVessel.useTransaction(trx)
                await UpdateRequestVessel.save();
        
                const approvalHeader2 = await ApprovalHeader.findOrFail(approvalHeaderId);
                approvalHeader2.approval_sequence = 0;
                approvalHeader2.step = approveHeader.step + 1;
                approvalHeader2.useTransaction(trx)
                await approvalHeader2.save();
    
            } else {
                const SchemaApprovalMax = await SchemaApprovalList.query().where("schema_id", schema.id).orderBy("approval_order", "desc").first();
                const approvalHeader = new ApprovalHeader();
                approvalHeader.no_request = noRequest;
                // @ts-ignore
                approvalHeader.total_approve = SchemaApprovalMax.approval_order;
                approvalHeader.id_submitter = `${auth?.user?.id}`;
                approvalHeader.approval_sequence = 0;
                approvalHeader.step = 2;
                approvalHeader.useTransaction(trx)
                await approvalHeader.save();
                approvalHeaderId = approvalHeader.id;
        
                const approvalDetail = new ApprovalDetail();
                approvalDetail.user_id = `${auth?.user?.id}`;
                approvalDetail.validation = "REJECT";
                approvalDetail.header_id = approvalHeaderId;
                approvalDetail.remark = remark;
                approvalDetail.sequence = 1;
                approvalDetail.role_id = `${auth?.user?.role_id}`;
                approvalDetail.step = 1;
                approvalDetail.useTransaction(trx)
                await approvalDetail.save();
        
                const UpdateRequestVessel = await RequestVesselGeneralInfo.findOrFail(requestVessel?.id);
                UpdateRequestVessel.status = "REJECT";
                UpdateRequestVessel.useTransaction(trx)
                await UpdateRequestVessel.save();
            }
            //NOTIFICATION
            const approvalLog = new ApprovalLog();
            approvalLog.request_no = `${requestVessel?.no_request}`;
            approvalLog.action = "REJECTED";
            approvalLog.remark = remark;
            approvalLog.created_by = `${auth?.user?.id}`;
            approvalLog.useTransaction(trx)
            await approvalLog.save();
    
            const notification = new Notification();
            notification.from = `${auth?.user?.id}`;
            notification.to = `${submitter}`;
            notification.request_no = `${requestVessel?.no_request}`;
            notification.master_type_id = `${masterType}`;
            notification.status = "REJECTED";
            notification.useTransaction(trx)
            await notification.save();
            Ws.io.emit("receive-notif", { userId: submitter, message: "Rejected Master Data Terminal" });
            await SendMail.reject(submitter, `${auth?.user?.id}`, masterType, requestVessel?.no_request);
            
            await trx.commit()
            let result = {
            "message": "Berhasil Ditolak"
            };
            
            return response.status(200).send(result);
            
        } catch (error) {
            console.log(error)
            await trx.rollback()
            let result = {
            "message": error.message
            };
            return response.status(500).send(result);
        }
    }

    public async view({view, params}: HttpContextContract) {
        try {
            let id = params.id
            const kapal:any = await RequestVesselGeneralInfo.query()
            .preload('specificVessel')
            .preload('supportDocumentVessel')
            .preload('additionalInfo', (query) => {
                query.leftJoin('vessel_type_additionals', 'vessel_additional_pivots.kd_additional_info', '=', 'vessel_type_additionals.kd_additonal_info')
            })
            .where('id', id)
            .first()            
        
            let tahun = await this.yearList(1960);
            const country = await Country.all();
            const jenisKapal = await VesselType.query().distinct("jn_kapal");
            const typeAdditional = await VesselTypeAdditional.query();
            const jenisPelayaran = await JenisPelayaran.query();
            const statusKapal = await StatusKapal.query();
            const jenisSuratUkur = await JenisSuratUkur.query();
            const prefixNamaKapal = await JenisNamaKapal.query();
            const typeJenisKapal = await VesselType.query().where('id', kapal?.vessel_type_id).first();
            const typeKapal = await VesselType.query().select('tipe_kapal').where('jn_kapal', typeJenisKapal?.jn_kapal ? typeJenisKapal?.jn_kapal : '').distinct('tipe_kapal');
            const spesifikKapal = await VesselType.query().select('id', 'spesifik_kapal').where('tipe_kapal', typeJenisKapal?.tipe_kapal ? typeJenisKapal?.tipe_kapal : '');
            const vesselTrayek = await VesselTrayek.query();
            let spmp = async (fileName) => {
                let url = await Drive.getUrl(fileName)
                return url
            } 
            
            let state = {
                tahun: tahun,
                jenisKapal: jenisKapal?.map(jnKapal => jnKapal?.jn_kapal),
                typeAdditional: typeAdditional,
                jenisPelayaran: jenisPelayaran,
                statusKapal: statusKapal,
                jenisSuratUkur: jenisSuratUkur,
                prefixNamaKapal: prefixNamaKapal,
                prefixNama: kapal?.kd_nm_kapal,
                namaKapal: kapal?.nm_kapal,
                call_sign: kapal?.call_sign?kapal?.call_sign : '',
                trayek: vesselTrayek,
                kd_kapal_inaportnet: kapal?.kd_kapal_inaportnet,
                url_surat_ukur: await spmp(kapal?.supportDocumentVessel.surat_ukur),
                url_surat_ppka: await spmp(kapal?.supportDocumentVessel.surat_ppka),
                url_surat_ppkm: await spmp(kapal?.supportDocumentVessel.surat_ppkm),
                url_surat_mmsi: await spmp(kapal?.supportDocumentVessel.surat_mmsi),
                url_surat_pendaftaran: await spmp(kapal?.supportDocumentVessel.surat_pendaftaran),
                spesifikKapal: spesifikKapal,
                typeKapal: typeKapal,
                typeJenisKapal: typeJenisKapal,
                existTypeKapal: typeJenisKapal?.tipe_kapal,
                existSpesifikKapal: typeJenisKapal?.spesifik_kapal,
                kdAdditional: kapal?.additionalInfo
            };

            console.log(kapal.specificVessel);
            

        return view.render('pages/master_kapal/page/outstanding/view', {data: state,country, kapal});
        } catch (error) {
            return error
        }
    }

    public async viewApproved({view, params}: HttpContextContract) {
        try {
            let id = params.id
            const kapal:any = await VesselGeneralInfo.query()
            .preload('specificVessel')
            .preload('supportDocumentVessel')
            .preload('additionalInfo', (query) => {
                query.leftJoin('vessel_type_additionals', 'vessel_additional_pivots.kd_additional_info', '=', 'vessel_type_additionals.kd_additonal_info')
            })
            .where('id', id)
            .first()
        
            let tahun = await this.yearList(1960);
            const country = await Country.all();
            const jenisKapal = await VesselType.query().distinct("jn_kapal");
            const typeAdditional = await VesselTypeAdditional.query();
            const jenisPelayaran = await JenisPelayaran.query();
            const statusKapal = await StatusKapal.query();
            const jenisSuratUkur = await JenisSuratUkur.query();
            const prefixNamaKapal = await JenisNamaKapal.query();
            const typeJenisKapal = await VesselType.query().where('id', kapal?.vessel_type_id).first();
            const typeKapal = await VesselType.query().select('tipe_kapal').where('jn_kapal', typeJenisKapal?.jn_kapal ? typeJenisKapal?.jn_kapal : '').distinct('tipe_kapal');
            const spesifikKapal = await VesselType.query().select('id', 'spesifik_kapal').where('tipe_kapal', typeJenisKapal?.tipe_kapal ? typeJenisKapal?.tipe_kapal : '');
            const vesselTrayek = await VesselTrayek.query();
            let spmp = async (fileName) => {
                let url = await Drive.getUrl(fileName)
                return url
            }        
            
            let state = {
                tahun: tahun,
                jenisKapal: jenisKapal?.map(jnKapal => jnKapal?.jn_kapal),
                typeAdditional: typeAdditional,
                jenisPelayaran: jenisPelayaran,
                statusKapal: statusKapal,
                jenisSuratUkur: jenisSuratUkur,
                prefixNamaKapal: prefixNamaKapal,
                prefixNama: kapal?.kd_nm_kapal,
                namaKapal: kapal?.nm_kapal,
                call_sign: kapal?.call_sign?kapal?.call_sign : '',
                trayek: vesselTrayek,
                kd_kapal_inaportnet: kapal?.kd_kapal_inaportnet,
                url_surat_ukur: await spmp(kapal?.supportDocumentVessel.surat_ukur),
                url_surat_ppka: await spmp(kapal?.supportDocumentVessel.surat_ppka),
                url_surat_ppkm: await spmp(kapal?.supportDocumentVessel.surat_ppkm),
                url_surat_mmsi: await spmp(kapal?.supportDocumentVessel.surat_mmsi),
                url_surat_pendaftaran: await spmp(kapal?.supportDocumentVessel.surat_pendaftaran),
                spesifikKapal: spesifikKapal,
                typeKapal: typeKapal,
                typeJenisKapal: typeJenisKapal,
                existTypeKapal: typeJenisKapal?.tipe_kapal,
                existSpesifikKapal: typeJenisKapal?.spesifik_kapal,
                kdAdditional: kapal?.additionalInfo
            };

        return view.render('pages/master_kapal/page/approved/view', {data: state,country, kapal});
        } catch (error) {
            return error
        }
    }


    public async uploadFile({ request, response }: HttpContextContract) {
        const client = new S3Client({
            region: Env.get('S3_REGION'),
            endpoint: Env.get('S3_ENDPOINT'),
            credentials: {
                accessKeyId: Env.get('S3_KEY'),
                secretAccessKey: Env.get('S3_SECRET'),
            }
        })
        // const s3 = new AWS.S3({
        //     accessKeyId: Env.get('S3_KEY'),
        //     secretAccessKey: Env.get('S3_SECRET'),
        //     region: Env.get('S3_REGION')
        // })
        
        // const params = {
        //     ACL: 'public-read',
        //     Bucket: Env.get('S3_BUCKET'),
        //     Body: fs.createReadStream(path?.tmpPath!),
        //     Key: `${nameFile}`
        // };
        let path = request.file('inputFile',{
            size: '2mb',
            extnames: ['pdf','PDF'],
                
        });
        let file = fs.readFileSync(path?.tmpPath!)
        const fieldName = request.input('fieldInput')
        const nameFile = new Date().getTime().toString() + `-` + `${fieldName}` + '.pdf'
        const command = new PutObjectCommand({
            ACL: 'public-read',
            Bucket: Env.get('S3_BUCKET'),
            Body: file,
            Key: `${nameFile}`
            // Body: fs.createReadStream(path?.tmpPath!),
        })
        try {
            if (!path?.isValid) {
                const data = {
                    error : path?.hasErrors,
                    message: path?.errors[0].message
                }
                return response.send(data)
            }
            // const result = await s3.upload(params).promise()
            const result = await client.send(command)
            return response.send(nameFile)
        }catch(error){
            return response.send(error)
        }
            
    }

    public async createExcelData({response}: HttpContextContract){
        try {
            const workbook = new excel.Workbook()
            workbook.creator = 'PT Pelabuhan Indonesia (Persero)';
            const worksheet = workbook.addWorksheet("General Information");
            // const worksheet2 = workbook.addWorksheet("Spesifikasi");
            // const worksheet3 = workbook.addWorksheet("Dokumen Pendukung");

            
            worksheet.columns = [
              { header: 'Kode Kapal', key: 'kd_kapal', width: 25},
              { header: 'Kode Kapal Inaportnet', key: 'kd_kapal_inaportnet', width: 25},
              { header: 'Kode History Kapal', key: 'kd_history_kapal', width: 25},
              { header: 'Nama Negara', key: 'country_id', width: 25},
              { header: 'Kode Bendera', key: 'country_flag', width: 25},
              { header: 'Nama Kapal', key: 'nm_kapal', width: 25},
              { header: 'Call Sign', key: 'call_sign', width: 25},
              { header: 'No. IMO', key: 'no_imo', width: 25},
              { header: 'MMSI', key: 'mmsi', width: 25},
              { header: 'Nama Pemilik', key: 'nm_pemilik', width: 25},
              { header: 'Nama Pemilik Lama', key: 'nm_pemilik_lama', width: 25},
              { header: 'Jenis Kapal', key: 'jn_kapal', width: 25},
              { header: 'Tipe Kapal', key: 'tipe_kapal', width: 25},
              { header: 'Spesifik Kapal', key: 'spesifikasi_kapal', width: 25},
              { header: 'Additional Info', key: 'additional_info', width: 25 },
              { header: 'Catatan Jenis Kapal', key: 'catatan_jn_kapal', width: 25},
              { header: 'Jenis Pelayaran', key: 'jn_pelayaran', width: 25},
              { header: 'Trayek', key: 'trayek', width: 25},
              { header: 'Status Kepemilikan Kapal', key: 'st_kapal', width: 25},
              { header: 'Tahun Pembuatan', key: 'th_pembuatan', width: 25},
              { header: 'Kapasitas GT', key: 'kp_gt', width: 25},
              { header: 'Kapasitas DWT', key: 'kp_dwt', width: 25},
              { header: 'Kapasitas BRT', key: 'kp_brt', width: 25},
              { header: 'Kapasitas NRT', key: 'kp_nrt', width: 25},
              { header: 'Panjang Kapal/LOA', key: 'kp_loa', width: 25},
              { header: 'Lebar Kapal', key: 'kp_lebar', width: 25},
              { header: 'Tinggi Kapal', key: 'kp_tinggi', width: 25},
              { header: 'Draft Maximum', key: 'dr_maximum', width: 25},
              { header: 'Draft Depan', key: 'dr_depan', width: 25},
              { header: 'Draft Belakan', key: 'dr_belakang', width: 25},
              { header: 'Max Speed', key: 'max_speed', width: 25},
              { header: 'Jumlah Palka', key: 'jm_palka', width: 25},
              { header: 'Jumlah Derek', key: 'jm_derek', width: 25},
              { header: 'Jenis Derek', key: 'jn_derek', width: 25},
              { header: 'No. Surat Ukur', key: 'no_surat_ukur', width: 25},
              { header: 'Jenis Surat Ukur', key: 'jn_surat_ukur', width: 25},
              { header: 'Tanggal Surat Ukur', key: 'tgl_surat_ukur', width: 25},
              { header: 'No. PPKM', key: 'no_ppkm', width: 25},
              { header: 'Tanggal Terbit PPKM', key: 'tgl_terbit_ppkm', width: 25},
              { header: 'Tanggal Berlaku PPKM', key: 'tgl_berlaku_ppkm', width: 25},
              { header: 'No. PPKA', key: 'no_ppka', width: 25},
              { header: 'Tanggal Terbit PPKA', key: 'tgl_terbit_ppka', width: 25},
              { header: 'Tanggal Berlaku PPKA', key: 'tgl_berlaku_ppka', width: 25},
            ];
  
            // worksheet2.columns = [
            //   { header: 'Kapasitas GT', key: 'kp_gt', width: 25},
            //   { header: 'Kapasitas DWT', key: 'kp_dwt', width: 25},
            //   { header: 'Kapasitas BRT', key: 'kp_brt', width: 25},
            //   { header: 'Kapasitas NRT', key: 'kp_nrt', width: 25},
            //   { header: 'Panjang Kapal/LOA', key: 'kp_loa', width: 25},
            //   { header: 'Lebar Kapal', key: 'kp_lebar', width: 25},
            //   { header: 'Tinggi Kapal', key: 'kp_tinggi', width: 25},
            //   { header: 'Draft Maximum', key: 'dr_maximum', width: 25},
            //   { header: 'Draft Depan', key: 'dr_depan', width: 25},
            //   { header: 'Draft Belakan', key: 'dr_belakang', width: 25},
            //   { header: 'Max Speed', key: 'max_speed', width: 25},
            //   { header: 'Jumlah Palka', key: 'jm_palka', width: 25},
            //   { header: 'Jumlah Derek', key: 'jm_derek', width: 25},
            //   { header: 'Jenis Derek', key: 'jn_derek', width: 25},
              
            // ];
      
            // worksheet3.columns = [
            //     { header: 'No. Surat Ukur', key: 'no_surat_ukur', width: 25},
            //     { header: 'Jenis Surat Ukur', key: 'jn_surat_ukur', width: 25},
            //     { header: 'Tanggal Surat Ukur', key: 'tgl_surat_ukur', width: 25},
            //     { header: 'No. PPKM', key: 'no_ppkm', width: 25},
            //     { header: 'Tanggal Terbit PPKM', key: 'tgl_terbit_ppkm', width: 25},
            //     { header: 'Tanggal Berlaku PPKM', key: 'tgl_berlaku_ppkm', width: 25},
            //     { header: 'No. PPKA', key: 'no_ppka', width: 25},
            //     { header: 'Tanggal Terbit PPKA', key: 'tgl_terbit_ppka', width: 25},
            //     { header: 'Tanggal Berlaku PPKA', key: 'tgl_berlaku_ppka', width: 25}, 
            //     // { header: 'File Surat Ukur', key: 'surat_ukur', width: 25},
            //     // { header: 'File PPKM', key: 'surat_ppka', width: 25},
            //     // { header: 'File PPKA', key: 'surat_ppkm', width: 25},
            //     // { header: 'File Penetapan MMSI', key: 'surat_mmsi', width: 25},

            // ];

            let cellArr:any = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T',
                                'U','V','W','X','Y','Z','AA','AB','AC','AD','AE','AF','AG','AH',
                                'AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV'
                             ]
            for (let index = 0; index < cellArr.length; index++) {
              worksheet.getCell(cellArr[index] + '1').border = {
                top: {style:'double', color: {argb:'000000'}},
                left: {style:'double', color: {argb:'000000'}},
                bottom: {style:'double', color: {argb:'000000'}},
                right: {style:'double', color: {argb:'000000'}}
              };
            }
  
            // let cellArr2:any = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N']
            // for (let index = 0; index < cellArr2.length; index++) {
            //   worksheet2.getCell(cellArr2[index] + '1').border = {
            //     top: {style:'double', color: {argb:'000000'}},
            //     left: {style:'double', color: {argb:'000000'}},
            //     bottom: {style:'double', color: {argb:'000000'}},
            //     right: {style:'double', color: {argb:'000000'}}
            //   };
            // }
            
            // let cellArr3:any = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N']
            // for (let index = 0; index < cellArr3.length; index++) {
            //   worksheet3.getCell(cellArr2[index] + '1').border = {
            //     top: {style:'double', color: {argb:'000000'}},
            //     left: {style:'double', color: {argb:'000000'}},
            //     bottom: {style:'double', color: {argb:'000000'}},
            //     right: {style:'double', color: {argb:'000000'}}
            //   };
            // }
            let link = async (fileName) => {
                let url = await Drive.getUrl(fileName)
                return url
            } 
            let vesselDatas:any = []
            const vessels = await VesselGeneralInfo.query()
            .preload('specificVessel')
            .preload('supportDocumentVessel', (query) => {
                query.preload('jenisSuratUkur')
            })
            .preload('spesifikKapal')
            .preload('statusKapal')
            .preload('jenisPelayaran')
            .preload('VesselTypeAdditional')
            .leftJoin('countries','vessel_general_infos.country_id','=','countries.country_code_3_digits')
            .leftJoin('jenis_pelayarans','vessel_general_infos.jn_pelayaran','=','jenis_pelayarans.kd_jenis_pelayaran')
            .leftJoin('vessel_trayeks','vessel_general_infos.trayek','=','vessel_trayeks.kd_trayek')
            .where('status','ACTIVE')

            vessels.forEach(function(vessel){
                vesselDatas.push({
                    kd_kapal: vessel?.kd_kapal,
                    kd_kapal_inaportnet: vessel?.kd_kapal_inaportnet,
                    kd_history_kapal: vessel?.kd_history_kapal,
                    country_id: vessel?.$extras?.country_name,
                    country_flag: vessel?.$extras?.country_code,
                    nm_kapal: vessel?.kd_nm_kapal+". "+vessel?.nm_kapal,
                    call_sign: vessel?.call_sign,
                    no_imo: vessel?.no_imo,
                    mmsi: vessel?.mmsi,
                    nm_pemilik: vessel?.nm_pemilik,
                    nm_pemilik_lama: vessel?.nm_pemilik_lama,
                    jn_kapal: vessel?.spesifikKapal?.jn_kapal,
                    tipe_kapal: vessel?.spesifikKapal?.tipe_kapal,
                    spesifikasi_kapal: vessel?.spesifikKapal?.spesifik_kapal,
                    additional_info: vessel?.VesselTypeAdditional?.name,
                    catatan_jn_kapal: vessel?.catatan_jn_kapal,
                    jn_pelayaran: vessel?.$extras?.name,
                    trayek: vessel?.$extras?.name_1,
                    st_kapal: vessel?.statusKapal?.name,
                    th_pembuatan: vessel?.th_pembuatan,
                    kp_gt: vessel?.specificVessel?.kp_gt,
                    kp_dwt: vessel?.specificVessel?.kp_dwt,
                    kp_brt: vessel?.specificVessel?.kp_brt,
                    kp_nrt: vessel?.specificVessel?.kp_nrt,
                    kp_loa: vessel?.specificVessel?.kp_loa,
                    kp_lebar: vessel?.specificVessel?.kp_lebar,
                    kp_tinggi: vessel?.specificVessel?.kp_tinggi,
                    dr_maximum: vessel?.specificVessel?.dr_maximum,
                    dr_depan: vessel?.specificVessel?.dr_depan,
                    dr_belakang: vessel?.specificVessel?.dr_belakang,
                    max_speed: vessel?.specificVessel?.max_speed,
                    jm_palka: vessel?.specificVessel?.jm_palka,
                    jm_derek: vessel?.specificVessel?.jm_derek,
                    jn_derek: vessel?.specificVessel?.jn_derek,
                    no_surat_ukur: vessel?.supportDocumentVessel?.no_surat_ukur,
                    jn_surat_ukur: vessel?.supportDocumentVessel?.jenisSuratUkur?.name,
                    tgl_surat_ukur: vessel?.supportDocumentVessel?.tgl_surat_ukur,                    
                    no_ppkm: vessel?.supportDocumentVessel?.no_ppkm,
                    tgl_terbit_ppkm: vessel?.supportDocumentVessel?.tgl_terbit_ppkm,
                    tgl_berlaku_ppkm: vessel?.supportDocumentVessel?.tgl_berlaku_ppkm,
                    no_ppka: vessel?.supportDocumentVessel?.no_ppka,
                    tgl_terbit_ppka: vessel?.supportDocumentVessel?.tgl_terbit_ppka,
                    tgl_berlaku_ppka: vessel?.supportDocumentVessel?.tgl_berlaku_ppka,
                    // surat_ukur: vessel?.supportDocumentVessel?.surat_ukur ? await link(vessel?.supportDocumentVessel?.surat_ukur ) : "",
                    // surat_ppka: vessel?.supportDocumentVessel?.surat_ppka ? await link(vessel?.supportDocumentVessel?.surat_ppka ) : "",
                    // surat_ppkm: vessel?.supportDocumentVessel?.surat_ppkm ? await link(vessel?.supportDocumentVessel?.surat_ppkm ) : "",
                    // surat_mmsi: vessel?.supportDocumentVessel?.surat_mmsi ? await link(vessel?.supportDocumentVessel?.surat_mmsi ) : "",
                })
            })
            
            vesselDatas.forEach(function(vessel){
                worksheet.addRow({
                    kd_kapal: vessel?.kd_kapal,
                    kd_kapal_inaportnet: vessel?.kd_kapal_inaportnet,
                    kd_history_kapal: vessel?.kd_history_kapal,
                    country_id: vessel?.country_id,
                    country_flag: vessel?.country_flag,
                    nm_kapal: vessel?.nm_kapal,
                    call_sign: vessel?.call_sign,
                    no_imo: vessel?.no_imo,
                    mmsi: vessel?.mmsi,
                    nm_pemilik: vessel?.nm_pemilik,
                    nm_pemilik_lama: vessel?.nm_pemilik_lama,
                    jn_kapal: vessel?.jn_kapal,
                    tipe_kapal: vessel?.tipe_kapal,
                    spesifikasi_kapal: vessel?.spesifikasi_kapal,
                    additional_info: vessel?.additional_info,
                    catatan_jn_kapal: vessel?.catatan_jn_kapal,
                    jn_pelayaran: vessel?.jn_pelayaran,
                    trayek: vessel?.trayek,
                    st_kapal: vessel?.st_kapal,
                    th_pembuatan: vessel?.th_pembuatan,
                    kp_gt: vessel?.kp_gt,
                    kp_dwt: vessel?.kp_dwt,
                    kp_brt: vessel?.kp_brt,
                    kp_nrt: vessel?.kp_nrt,
                    kp_loa: vessel?.kp_loa,
                    kp_lebar: vessel?.kp_lebar,
                    kp_tinggi: vessel?.kp_tinggi,
                    dr_maximum: vessel?.dr_maximum,
                    dr_depan: vessel?.dr_depan,
                    dr_belakang: vessel?.dr_belakang,
                    max_speed: vessel?.max_speed,
                    jm_palka: vessel?.jm_palka,
                    jm_derek: vessel?.jm_derek,
                    jn_derek: vessel?.jn_derek,
                    no_surat_ukur: vessel?.no_surat_ukur,
                    jn_surat_ukur: vessel?.jn_surat_ukur,
                    tgl_surat_ukur: vessel?.tgl_surat_ukur,                    
                    no_ppkm: vessel?.no_ppkm,
                    tgl_terbit_ppkm: vessel?.tgl_terbit_ppkm,
                    tgl_berlaku_ppkm: vessel?.tgl_berlaku_ppkm,
                    no_ppka: vessel?.no_ppka,
                    tgl_terbit_ppka: vessel?.tgl_terbit_ppka,
                    tgl_berlaku_ppka: vessel?.tgl_berlaku_ppka,
                    
                })
                // worksheet2.addRow({
                //     kp_gt: vessel?.kp_gt,
                //     kp_dwt: vessel?.kp_dwt,
                //     kp_brt: vessel?.kp_brt,
                //     kp_nrt: vessel?.kp_nrt,
                //     kp_loa: vessel?.kp_loa,
                //     kp_lebar: vessel?.kp_lebar,
                //     kp_tinggi: vessel?.kp_tinggi,
                //     dr_maximum: vessel?.dr_maximum,
                //     dr_depan: vessel?.dr_depan,
                //     dr_belakang: vessel?.dr_belakang,
                //     max_speed: vessel?.max_speed,
                //     jm_palka: vessel?.jm_palka,
                //     jm_derek: vessel?.jm_derek,
                //     jn_derek: vessel?.jm_derek
                // })
                // worksheet3.addRow({
                //     no_surat_ukur: vessel?.no_surat_ukur,
                //     jn_surat_ukur: vessel?.jn_surat_ukur,
                //     tgl_surat_ukur: vessel?.tgl_surat_ukur,                    
                //     no_ppkm: vessel?.no_ppkm,
                //     tgl_terbit_ppkm: vessel?.tgl_terbit_ppkm,
                //     tgl_berlaku_ppkm: vessel?.tgl_berlaku_ppkm,
                //     no_ppka: vessel?.no_ppka,
                //     tgl_terbit_ppka: vessel?.tgl_terbit_ppka,
                //     tgl_berlaku_ppka: vessel?.tgl_berlaku_ppka,
                //     surat_ukur: vessel?.surat_ukur, 
                //     surat_ppka: vessel?.surat_ppka,
                //     surat_ppkm: vessel?.surat_ppkm,
                //     surat_mmsi: vessel?.surat_mmsi
                // })
            })
            await workbook.xlsx.writeFile('public/media/template_excel_master/data_master_kapal.xlsx');
            const filePath = Application.publicPath('media/template_excel_master/data_master_kapal.xlsx');
            return response.download(filePath);
          } catch (error) {
            console.log(error);
            return response.status(500).send(error)
          }
    }

    public async updateStatus({ params, request, response }: HttpContextContract) {
        // await bouncer.authorize('access', 'activate-customer')    
        const id = params.id;
        const status = request.input('status');

        const trx = await Database.transaction()
        // const test = await MasterVessel.phinnisiIntegrate('c3deed57-a063-4034-86b4-f3a84b319df7')
        // return console.log(test);
        
        try{
            const updateStatus = await VesselGeneralInfo.findByOrFail('id', id);
            updateStatus.status = status;
            await updateStatus.useTransaction(trx).save();

            if (!trx.isCompleted) {
                await trx.commit()
                await MasterVessel.phinnisiUpdate(id,status);
            }
            // await trx.commit()
            let result = {
                message: "Status data berhasil diubah"
            }
            return response.status(200).send(result)
        } catch(error){
            await trx.rollback()
            let result = {
                message: "Status data gagal diubah"
            }

            return response.status(500).send(result)
        }
    }

        
    private async yearList(input:number){
        let years = function(startYear) {
            var currentYear = new Date().getFullYear()
            let years:any = [];
            startYear = startYear;  
            while ( startYear <= currentYear ) {
                years.push(startYear++);
            }   
            return years;
        }

        return years(input)
    }

    private changeToNumber(string: string) {
        string = string ? string : "0"
        string = string ? string : "0"
        console.log(string);
        let number: any = Number(string?.replace(/,/g, '.'))
        console.log(number);
        
        return number
    }

    public async modalData({request}: HttpContextContract) {
        try {
            let requestNumber = request.input('request_number')
            let kapal:any = await RequestVesselGeneralInfo.query()
                        .preload('kdBendera')
                        .preload('specificVessel')
                        .preload('supportDocumentVessel', function(query){
                            query.preload('jenisSuratUkur')
                        }) 
                        .preload('spesifikKapal')
                        .leftJoin('countries','request_vessel_general_infos.country_id','=','countries.country_code_3_digits')
                        .where('no_request', `${requestNumber}`)
                        .preload('jenisPelayaran')
                        .preload('statusKapal')
                        .preload('vesselTypeAdditional')
                        .preload('additionalInfo', (query) => {
                            query.leftJoin('vessel_type_additionals', 'vessel_additional_pivots.kd_additional_info', '=', 'vessel_type_additionals.kd_additonal_info')
                        })
                        .preload('user', function(query){
                            query.preload('role')
                        })
                        .first()
                        
            let jenisPelayaran = await JenisPelayaran.query().where('kd_jenis_pelayaran', kapal?.jn_pelayaran).first();
            let vesselTrayek = await VesselTrayek.query().where('kd_trayek', kapal?.trayek).first();
            let spmp = async (fileName) => {
                let url = await Drive.getUrl(fileName)
                return url
            }

            let urlPpka = await spmp(kapal?.supportDocumentVessel.surat_ppka)
            let urlPpkm = await spmp(kapal?.supportDocumentVessel.surat_ppkm)
            let urlSuratUkur = await spmp(kapal?.supportDocumentVessel.surat_ukur)
            let urlSuratMmsi = await spmp(kapal?.supportDocumentVessel.surat_mmsi)
            let urlSuratPendaftaran = await spmp(kapal?.supportDocumentVessel.surat_pendaftaran)
            let date = await this.formatDate(kapal?.created_at)

            let state = {
                kapal : kapal,
                urlPpka : urlPpka,
                urlPpkm : urlPpkm,
                urlSuratUkur : urlSuratUkur,
                urlSuratMmsi : urlSuratMmsi,
                urlSuratPendaftaran : urlSuratPendaftaran,
                country_code : kapal?.$extras.country_code,
                country_name : kapal?.$extras.country_name,
                name_request : kapal?.user.name,
                dept_request : kapal?.user.role.name,
                date_request : date,
                jenisPelayaran: jenisPelayaran,
                trayek: vesselTrayek,
                additionalInfo: kapal?.additionalInfo?.map(el => el?.$extras.name)
            }            
            
            
            return state
            
        } catch (error) {
            return error
        }
    }

    private async formatDate(date) {
        let strTanggal = date.toString();
        const strDay = strTanggal.substring(8, 10);
        let bulan:any;
        switch(strTanggal.substring(4,7)) {
        case "Jan": bulan = "Januari"; break;
        case "Feb": bulan = "Febuari"; break;
        case "Mar": bulan = "Maret"; break;
        case "Apr": bulan = "April"; break;
        case "May": bulan = "Mei"; break;
        case "Jun": bulan = "Juni"; break;
        case "Jul": bulan = "Juli"; break;
        case "Aug": bulan = "Agustus"; break;
        case "Sep": bulan = "September"; break;
        case "Okt": bulan = "Oktober"; break;
        case "Nov": bulan = "November"; break;
        case "Dec": bulan = "Desember"; break;
        }
        let year = strTanggal.substring(11, 15);
        let jam = strTanggal.substring(16, 18);
        let menit = strTanggal.substring(19, 21);
        let resultDate = `${strDay} ${bulan} ${year} ${jam}.${menit}`;
        return resultDate
    }
}