import CustomerInfo from "App/Models/CustomerInfo";
import LogsMdmR3 from "App/Models/LogsMdmR3";
import VesselGeneralInfo from "App/Models/VesselGeneralInfo";
import axios from "axios";
import Env from '@ioc:Adonis/Core/Env'

class MdmR3 {
    // customer
    public async customerToMdmR3(customerId){
        const id = customerId
        const customer = await CustomerInfo.query()
                .preload('customerType')
                .preload('customerGroup')
                .preload('bentukUsaha')
                .preload('country')
                .preload('postalCode')
                .preload('branch')
                .preload('usahaPelanggan',(query)=>{
                    query.preload('usahaPelanggan')
                })
                .preload('mitra',(query)=>{
                    query.preload('mitra')
                })
                .preload('shippingLine',(query)=>{
                    query.preload('shippingLine')
                })
                .preload('cargoOwner',(query)=>{
                    query.preload('cargoOwner')
                })
                .preload('serviceType',(query)=>{
                    query.preload('serviceType')
                })
                .preload('npwp')
                .preload('contact',(query)=>{
                    query.preload('branch')
                })
                .preload('billing',(query)=>{
                    query.preload('paymentType',(query)=>{
                        query.preload('payment')
                    })
                })
                .preload('document',(query)=>{
                    query.preload('expDocument')
                })
                .where("id",id).first()

        let container:any = []
        let npwp:string[]|null|undefined = customer?.billing?.map((data) => {return {no: data?.no_npwp, address: data?.npwp_address, kd: data?.kd_npwp}}) 
        npwp = npwp?.filter((data,index) => {
            return npwp?.indexOf(data) == index        
        })
        let usaha_pelanggan = customer?.usahaPelanggan?.map(el => el.usahaPelanggan?.name?.toUpperCase())

        const url = `${Env.get('MDMR3_ENDPOINT')}/api/Pelanggan/AddPelangganSingleMDM`
        let payload = {
            "KD_CABANG": "1",
            "KD_TERMINAL": "1",
            "MPLG_KODE": "",
            "MPLG_KODE_SAP": customer?.sap_code ? customer?.sap_code : "",
            "MPLG_KODE_INDUK": customer?.no_affiliasi ? customer?.no_affiliasi : "" ,
            "MPLG_KODE_SMDM": customer?.no_customer,
            "MPLG_GRUP_LEVEL": "",
            "MPLG_NAMA": customer?.nm_perusahaan?.toUpperCase(),
            "MPLG_ALAMAT": customer?.address?.toUpperCase() + `${customer?.postalCode? 
                customer?.postalCode?.village?.toUpperCase()+","+customer?.postalCode.subdistrict?.toUpperCase()+","+customer?.postalCode.city?.toUpperCase()+","
                +customer?.postalCode.province?.toUpperCase()+"("+customer?.postalCode.post_code+")" : "" }` ,
            "MPLG_KOTA": customer?.postalCode ? customer?.postalCode?.city?.toUpperCase() : "",
            "MPLG_NPWP": "",
            "MPLG_TELEPON": customer?.phone,
            "MPLG_EMAIL_ADDRESS": customer?.email?.toUpperCase(),
            "MPLG_NEGARA": customer?.country?.country_code?.toLocaleUpperCase(),
            // "MPLG_TIPE_USAHA_PELANGGAN": usaha_pelanggan ,
            "MPLG_SIUP": "",
            "MPLG_TGL_SIUP": customer?.document?.expDocument?.exp_siup_nib ? customer?.document?.expDocument?.exp_siup_nib : "",
            "MPLG_TIPE": customer?.is_bebas_pajak == 1 ? "BUT" : ""  ,
            "MPLG_NO_KTP": "",
            "MPLG_JENIS_USAHA": usaha_pelanggan,
            "MPLG_BADAN_USAHA": customer?.bentukUsaha?.name?.toUpperCase(),
            "MPLG_CONT_PERSON": "",
            "MPLG_PROFIT_CENTER": "",
        };

        const headers = {
            headers: {
                // "Content-Type": "application/json",
                "Authorization":`${Env.get('MDMR3_AUTH')}`
            }
        };

        npwp?.forEach((npwp) => {
            let newPayload = {
                ...payload,
                MPLG_KODE: npwp.kd ? customer?.no_customer + npwp.kd: customer?.no_customer ,
                MPLG_NPWP : npwp.no ? npwp.no : "" ,
                MPLG_ALAMAT : npwp.address ? npwp.address : "" 
              }
              container.push(newPayload)
        })
        // console.log(npwp)    
        // return console.log(container)
        container?.forEach(async(data) => { 
            try {
                let response:any = []
                    let remoteResponse = await axios.post(url,data,headers)
                    response.push(remoteResponse.data)
                    // log inaportnet
                    const log = new LogsMdmR3()
                    log.customer_name = customer?.nm_perusahaan ? customer?.nm_perusahaan : "" 
                    log.action = "INSERT"
                    log.payload = JSON.stringify(data)
                    log.response = JSON.stringify(remoteResponse.data)
                    log.customer_id = id
                    await log.save()
                return response
                
            } catch (error) {
                // log inaportnet
                const log = new LogsMdmR3()
                log.customer_name = customer?.nm_perusahaan ? customer?.nm_perusahaan : ""
                log.action = "INSERT"
                log.payload = JSON.stringify(payload)
                log.response = JSON.stringify(error)
                log.customer_id = id
                await log.save()
                
                let result = {
                    status: 500,
                    message: error
                }
                return result
            }
        })


    }

    async kapalToMDMR3(vesselId){
        const id = vesselId
        const vessel  =await VesselGeneralInfo.query()
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

        const url = ""
        const payload = {
            "MKPL_KODE": "string",
            "MKPL_GRT": vessel?.specificVessel?.kp_gt ,
            "MKPL_DWT": vessel?.specificVessel?.kp_dwt,
            "MKPL_LOA": vessel?.specificVessel?.kp_loa,
            "MKPL_CALL_SIGN": vessel?.call_sign,
            "MKPL_NAMA": vessel?.nm_kapal,
            "MKPL_BENDERA": vessel?.kdBendera?.country_code_3_digits,
            "MKPL_THN_DIBUAT": vessel?.th_pembuatan,
            "MKPL_JENIS": vessel?.spesifikKapal?.jn_kapal,
            "MKPL_JNS_PELAYARAN": vessel?.jenisPelayaran?.name,
            "MKPL_JNS_TRAYEK": "string",
            "MSI_CODE": vessel?.mmsi
        }

        const headers = {
            headers: {
                "Content-Type": "json/application; charset=utf-8"
            },
            auth: {
                username: "",
                password: ""
            }
        };

        let remoteResponse = await axios.post(url,payload,headers)
        return remoteResponse
    }
};

export default new MdmR3();