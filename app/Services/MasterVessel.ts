import JenisPelayaran from "App/Models/JenisPelayaran";
import VesselGeneralInfo from "App/Models/VesselGeneralInfo";
import VesselTrayek from "App/Models/VesselTrayek";
import axios from "axios";
import Env from '@ioc:Adonis/Core/Env'
import Country from "App/Models/Country";
import InaportnetLog from "App/Models/InaportnetLog";
class MasterVessel {
    
    /**
     * requestNumber
     */
    public requestNumber(count?: string | null) {
        let requestNumber:string = '';
        let sequenceRequestNumber:string = '';
        const currentDate = new Date().toLocaleDateString('sv').replace("-", "").replace("-", "");
        let countData:any;
        
        if (count == undefined || null) {
            return '';
        };
        if(count != "0"){
            let countRaw:any = count;
            countRaw = parseInt(countRaw?.substring("12","15"))
            countData = countRaw;
        }else{
            countData = parseInt(count);
        }
        const number = countData + 1;
        let stringData = number.toString();
        
        for (var i = 2; i >= 0; i--) {
            if (stringData.length > i) {
                sequenceRequestNumber += stringData;
                break;
            }
            sequenceRequestNumber += "0";
        };

        requestNumber = 'VESS'+ currentDate + sequenceRequestNumber;

        return requestNumber
    }

    /**
     * VesselCode
     */
    public vesselCode(count?:string | null, vesselCode?:string | null) {
        let vesselNumber:string = '';
        let sequencevesselNumber:string = '';
        const vesselNumberCode:string|null = vesselCode ? vesselCode : '';
        let countData:any;

        if (count == undefined || null) {
            return '';
        };

        if(count != "0"){
            let countRaw:any = count;
            countRaw = countRaw.substring("4","7");
            countRaw = parseInt(countRaw);
            countData = countRaw + 1;
        }else{
            countData = parseInt(count) + 1;
        }

        let strongCountData = countData.toString();

        for (let i = 2; i>=0; i--) {
            if(strongCountData.length > i) {
                sequencevesselNumber += strongCountData;
                break;
            }
            sequencevesselNumber += "0";
        };

        vesselNumber = vesselNumberCode + sequencevesselNumber;

        return vesselNumber;
    }

    public async phinnisiIntegrate(vesselId:string) {
        const id = vesselId
        const vessel  = await VesselGeneralInfo.query()
        .preload('specificVessel')
        .preload('supportDocumentVessel', (query) => {
            query.preload('jenisSuratUkur')
        })
        .preload('kdBendera')
        .preload('additionalInfo', (query) => {
            query.leftJoin('vessel_type_additionals', 'vessel_additional_pivots.kd_additional_info', '=', 'vessel_type_additionals.kd_additonal_info')
        })
        .preload('spesifikKapal')
        .preload('statusKapal')
        .preload('jenisPelayaran')
        .preload('VesselTypeAdditional')
        .where("id",id).first()

        let trayek =  await VesselTrayek.query().where('kd_trayek', vessel?.trayek ? vessel?.trayek : "").first();
        let jenisPelayaran = await JenisPelayaran.query().where('kd_jenis_pelayaran', vessel?.jn_pelayaran ? vessel?.jn_pelayaran : "").first();
        let country = await Country.query().where('country_code_3_digits',vessel?.country_id ? vessel?.country_id :'').first()

        // const url = "https://phinnisi-dev.pelindo.co.id:9017/api/suronding/mdm"
        const url = `${Env.get('PHINNISI_ENDPOINT')}/api/suronding/mdm`
        const payload = {
            kd_kapal_inaportnet: vessel?.kd_kapal_inaportnet,
            no_tanda_pendaftaran: vessel?.no_tanda_pendaftaran ? vessel?.no_tanda_pendaftaran : "",
            kd_kapal: vessel?.kd_kapal,
            // vessel_code: vessel?.kd_kapal,
            prefix_nama_kapal: vessel?.kd_nm_kapal,
            nm_kapal: vessel?.nm_kapal,
            kd_history_kapal: vessel?.kd_history_kapal,
            call_sign: vessel?.call_sign,
            no_imo: vessel?.no_imo,
            mmsi: vessel?.mmsi,
            nm_pemilik: vessel?.nm_pemilik,
            nm_pemilik_lama: vessel?.nm_pemilik_lama,
            catatan_jn_kapal: vessel?.catatan_jn_kapal,
            jn_pelayaran: jenisPelayaran?.name,
            trayek: trayek?.name,
            st_kapal: vessel?.statusKapal?.name,
            th_pembuatan: vessel?.th_pembuatan,
            country_id: country?.country_code,
            jn_kapal: vessel?.spesifikKapal?.jn_kapal,
            tipe_kapal: vessel?.spesifikKapal?.tipe_kapal,
            spesifik_kapal: vessel?.spesifikKapal?.spesifik_kapal,
            vessel_type_additional_id: vessel?.VesselTypeAdditional?.name ? vessel?.VesselTypeAdditional?.name : null,
            status: "ACTIVE",
            kp_gt: vessel?.specificVessel.kp_gt,
            kp_dwt: vessel?.specificVessel.kp_dwt,
            kp_brt: vessel?.specificVessel.kp_brt,
            kp_nrt: vessel?.specificVessel.kp_nrt,
            panjang_kapal: vessel?.specificVessel.kp_loa,
            lebar_kapal: vessel?.specificVessel.kp_lebar,
            tinggi_kapal: vessel?.specificVessel.kp_tinggi,
            draft_maximum: vessel?.specificVessel.dr_maximum,
            draft_depan: vessel?.specificVessel.dr_depan,
            draft_belakang: vessel?.specificVessel.dr_belakang,
            max_speed: vessel?.specificVessel.max_speed,
            jm_palka: vessel?.specificVessel.jm_palka,
            jm_derek: vessel?.specificVessel.jm_derek,
            jn_derek: vessel?.specificVessel.jn_derek,
            horse_power: vessel?.specificVessel.horse_power,
            no_surat_ukur: vessel?.supportDocumentVessel?.no_surat_ukur,
            kode_tipe_kapal: vessel?.spesifikKapal?.kode,
            country_id_2_digit: country?.country_code
        }
        // return console.log(payload);
        
        // console.log(JSON.stringify(payload))
        const headers = {
            headers: {
                "access-token": `${Env.get('PHINNISI_TOKEN')}`
                // "access-token":`eyJhbGciOiJIUzI1NiJ9.VTJGc2RHVmtYMThNM251OFZTbzYrcWd5L2JSK3Rvc3NGVkgxSEFYMEx3bU9mSEJjWHJGQWpadC9ON1VMdFo0M3RHQVpiMStzeW1hNEhHU2RwemdJNzJYQUpHaXNaUkFWc1pvQi81MVRRNjgzL0Q2T2ZHV0xYTkZHSllHdGhibWUvN3dIV2MwMnhIanFZeHZZeEt5azhqODRZdlBaVFpyYjJSeGVKTjdSRUVXTGJrOTRoOHEzVGRLclhSVkZZZ3o4aEw5L01oeFRaM0xIa0ZYaGpZcE91Y0dkQ1dGbWhIQWFTcUYzdjJxa2s1eklsMkttaVZJWkV6U0ZKY3Q5V1l1MUxZQkxhc0FKZmdReWViYXBJb25vK3c9PQ.Njo7HhUD0xRcpeSC9exZlMVl4KX89MI-ihWqSqno2ZY`
            },
            // auth: {
            //     username: "",
            //     password: ""
            // }
        };
        try {
            let remoteResponse = await axios.post(url,payload,headers)
            // log inaportnet
            const log = new InaportnetLog()
            log.action = "SEND"
            log.payload = JSON.stringify(payload)
            log.response = remoteResponse.data
            await log.save()
    
            return remoteResponse.data
            
        } catch (error) {
            console.log(error)
            // log inaportnet
            const log = new InaportnetLog()
            log.action = "SEND"
            log.payload = JSON.stringify(payload)
            log.response = error.message
            await log.save()
    
        }

    }

    public async phinnisiUpdate(vesselId:string,statusVessel:string|null) {
        const id = vesselId
        const status:string = statusVessel ? statusVessel : ""
        const vessel  = await VesselGeneralInfo.query()
        .preload('specificVessel')
        .preload('supportDocumentVessel', (query) => {
            query.preload('jenisSuratUkur')
        })
        .preload('kdBendera')
        .preload('additionalInfo', (query) => {
            query.leftJoin('vessel_type_additionals', 'vessel_additional_pivots.kd_additional_info', '=', 'vessel_type_additionals.kd_additonal_info')
        })
        .preload('spesifikKapal')
        .preload('statusKapal')
        .preload('jenisPelayaran')
        .preload('VesselTypeAdditional')
        .where("id",id).first()

        let trayek =  await VesselTrayek.query().where('kd_trayek', vessel?.trayek ? vessel?.trayek : "").first();
        let jenisPelayaran = await JenisPelayaran.query().where('kd_jenis_pelayaran', vessel?.jn_pelayaran ? vessel?.jn_pelayaran : "").first();
        let country = await Country.query().where('country_code_3_digits',vessel?.country_id ? vessel?.country_id :'').first()

        const url = `${Env.get('PHINNISI_ENDPOINT')}/api/suronding/mdm`
        const payload = {
            kd_kapal_inaportnet: vessel?.kd_kapal_inaportnet,
            no_tanda_pendaftaran: vessel?.no_tanda_pendaftaran ? vessel?.no_tanda_pendaftaran : "",
            kd_kapal: vessel?.kd_kapal,
            // vessel_code: vessel?.kd_kapal,
            prefix_nama_kapal: vessel?.kd_nm_kapal,
            nm_kapal: vessel?.nm_kapal,
            kd_history_kapal: vessel?.kd_history_kapal,
            call_sign: vessel?.call_sign,
            no_imo: vessel?.no_imo,
            mmsi: vessel?.mmsi,
            nm_pemilik: vessel?.nm_pemilik,
            nm_pemilik_lama: vessel?.nm_pemilik_lama,
            catatan_jn_kapal: vessel?.catatan_jn_kapal,
            jn_pelayaran: jenisPelayaran?.name,
            trayek: trayek?.name,
            st_kapal: vessel?.statusKapal?.name,
            th_pembuatan: vessel?.th_pembuatan,
            country_id: country?.country_code,
            jn_kapal: vessel?.spesifikKapal?.jn_kapal,
            tipe_kapal: vessel?.spesifikKapal?.tipe_kapal,
            spesifik_kapal: vessel?.spesifikKapal?.spesifik_kapal,
            vessel_type_additional_id: vessel?.VesselTypeAdditional?.name ? vessel?.VesselTypeAdditional?.name : null,
            status: status ? status : vessel?.status,
            kp_gt: vessel?.specificVessel.kp_gt,
            kp_dwt: vessel?.specificVessel.kp_dwt,
            kp_brt: vessel?.specificVessel.kp_brt,
            kp_nrt: vessel?.specificVessel.kp_nrt,
            panjang_kapal: vessel?.specificVessel.kp_loa,
            lebar_kapal: vessel?.specificVessel.kp_lebar,
            tinggi_kapal: vessel?.specificVessel.kp_tinggi,
            draft_maximum: vessel?.specificVessel.dr_maximum,
            draft_depan: vessel?.specificVessel.dr_depan,
            draft_belakang: vessel?.specificVessel.dr_belakang,
            max_speed: vessel?.specificVessel.max_speed,
            jm_palka: vessel?.specificVessel.jm_palka,
            jm_derek: vessel?.specificVessel.jm_derek,
            jn_derek: vessel?.specificVessel.jn_derek,
            horse_power: vessel?.specificVessel.horse_power,
            no_surat_ukur: vessel?.supportDocumentVessel?.no_surat_ukur,
            kode_tipe_kapal: vessel?.spesifikKapal?.kode,
            country_id_2_digit: country?.country_code
        }
        // return console.log(payload);
        
        // console.log(JSON.stringify(payload))
        const headers = {
            headers: {
                "access-token": `${Env.get('PHINNISI_TOKEN')}`
            },
        };
        try {
            let remoteResponse = await axios.post(url,payload,headers)
            console.log(remoteResponse.data)
            // log inaportnet
            const log = new InaportnetLog()
            log.action = "SEND"
            log.payload = JSON.stringify(payload)
            log.response = remoteResponse.data
            await log.save()
    
            return remoteResponse.data
            
        } catch (error) {
            console.log(error)
            // log inaportnet
            const log = new InaportnetLog()
            log.action = "SEND"
            log.payload = JSON.stringify(payload)
            log.response = error.message
            await log.save()
    
        }

    }

}

export default new MasterVessel();