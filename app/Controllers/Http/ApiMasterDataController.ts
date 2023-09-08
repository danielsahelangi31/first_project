import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import HeadOffice from "App/Models/HeadOffice";
import CompanyView from 'App/Models/CompanyView';
import Terminal from 'App/Models/Terminal';
import AlatApungApproved from 'App/Models/AlatApungApproved';
import AlatbmApproved from 'App/Models/AlatbmApproved';
import RequestApi from 'App/Models/RequestApi';
import BranchView from 'App/Models/BranchView';
import VesselGeneralInfo from 'App/Models/VesselGeneralInfo';
import CustomerInfo from 'App/Models/CustomerInfo';
import DermagaApproved from 'App/Models/DermagaApproved';
import VesselTrayek from 'App/Models/VesselTrayek';
import JenisPelayaran from 'App/Models/JenisPelayaran';
import RequestVesselGeneralInfo from 'App/Models/RequestVesselGeneralInfo';
import Country from 'App/Models/Country';
import ActionAset from 'App/Services/MasterAset/ActionAset';

// import CustomerBasicInfo from 'App/Models/CustomerBasicInfo';
// import Branch from 'App/Models/Branch';
// import RequestBasicInfoCustomer from 'App/Models/RequestBasicInfoCustomer';
// import KodePerairan from 'App/Models/KodePerairan';
// import City from 'App/Models/City';
// import { base64 } from '@ioc:Adonis/Core/Helpers'


export default class ApiMasterDataController {
    public async MasterCompany({request, response, auth}: HttpContextContract) {
        await auth.use('api').authenticate()
        let masterType:string = 'Master Company'
        let email:any = auth.use('api').user?.email
        let accessApi:boolean = await this.authAccess(email, masterType)

        if(accessApi === true) {
            try {
                const {code, fromDate, toDate} = request.body()
                let findBy:any = "code_company"
                let data:any 
    
                if (code == "" && fromDate == "" && toDate == "") {
                    return response.json({
                        status: "input parameter",
                        code: 401   
                    })
                } else if (fromDate && code && toDate) {
                    data = await CompanyView.query()
                    .whereRaw(`
                    "${findBy}" = ${code} AND "created_at" BETWEEN TO_DATE('${fromDate} 12:00:00 am', 'DD/MM/YYYY HH:MI:SS am') AND TO_DATE('${toDate} 11:59:59 pm', 'DD/MM/YYYY HH:MI:SS pm')
                    `)
                    .where('status', 'active')    
                } else if (fromDate && toDate && code == "") {
                    data = await CompanyView.query()
                    .whereRaw(`
                    "created_at" BETWEEN TO_DATE('${fromDate} 12:00:00 am', 'DD/MM/YYYY HH:MI:SS am') AND TO_DATE('${toDate} 11:59:59 pm', 'DD/MM/YYYY HH:MI:SS pm')
                    `)
                    .where('status', 'active')    
                } else if (fromDate == "" && toDate == "" && code) {
                    data = await CompanyView.query()
                    .where(findBy, code)
                    .where('status', 'active')    
                }
    
                data = data.map((el:any) => {
                    return {
                        id : el.id,
                        name_parent : el.id_parent,
                        code_parent : el.code_parent,
                        code_company : el.code_company,
                        company_name : el.company_name,
                        company_group : el.company_group,
                        status : el.status,
                        profit_center : el.profit_center,
                        sap_code : el.sap_code,
                        created_at : el.created_at.toLocaleString()
                    }
                })
                
                return response.json({
                    status: "request data success",
                    code: 200,
                    data: data
                })
            } catch (error) {
                return error
            }
        } else if (accessApi === false) {
            return response.json({
                status: "Access Forbidden",
                code: 403
            })
        }
    }

    // public async MasterCustomer({response,request,auth}: HttpContextContract){
    //     await auth.use('api').authenticate()
    //     let masterType:string = 'Master Customer'
    //     let email:any = auth.use('api').user?.email
    //     let accessApi:boolean = await this.authAccess(email, masterType)

    //     if(accessApi === true) {
    //         try {
    //             const {code, fromDate, toDate} = request.body()
    //             let data:any
    
    //             if (code == "" && fromDate == "" && toDate == "") {
    //                 return response.json({
    //                     status: "input parameter",
    //                     code: 401
    //                 })
    //             } else if (fromDate && code && toDate) {
    //                 data = await CustomerBasicInfo.query()
    //                 .preload('npwp')
    //                 .preload('customerGroup')
    //                 .preload('customerEtc')
    //                 .preload('customerType')
    //                 .preload('bentukUsaha')
    //                 .preload('postalCode')
    //                 .preload('branch')
    //                 .preload('id_customer',function(query){
    //                     query.preload('customerBusiness');
    //                 })
    //                 .preload('id_mitra',function(query){
    //                     query.preload('mitra')
    //                 })
    //                 .preload('id_shipping_line',function(query){
    //                     query.preload('shippingLine')
    //                 })
    //                 .preload('id_cargo_owner',function(query){
    //                     query.preload('cargoOwner')
    //                 })
    //                 .preload('id_service_type',function(query){
    //                     query.preload('serviceType')
    //                 })
    //                 .preload('contact')
    //                 .preload('billing')
    //                 .where('status', 'ACTIVE')
    //                 .whereRaw(`
    //                 "customer_number" = '${code}' AND "created_at" BETWEEN TO_DATE('${fromDate} 12:00:00 am', 'DD/MM/YYYY HH:MI:SS am') AND TO_DATE('${toDate} 11:59:59 pm', 'DD/MM/YYYY HH:MI:SS pm')
    //                 `)  
    //             } else if (fromDate && toDate && code == "") {
    //                 data = await CustomerBasicInfo.query()
    //                 .preload('npwp')
    //                 .preload('customerGroup')
    //                 .preload('customerEtc')
    //                 .preload('customerType')
    //                 .preload('bentukUsaha')
    //                 .preload('postalCode')
    //                 .preload('branch')
    //                 .preload('id_customer',function(query){
    //                     query.preload('customerBusiness');
    //                 })
    //                 .preload('id_mitra',function(query){
    //                     query.preload('mitra')
    //                 })
    //                 .preload('id_shipping_line',function(query){
    //                     query.preload('shippingLine')
    //                 })
    //                 .preload('id_cargo_owner',function(query){
    //                     query.preload('cargoOwner')
    //                 })
    //                 .preload('id_service_type',function(query){
    //                     query.preload('serviceType')
    //                 })
    //                 .preload('contact')
    //                 .preload('billing')
    //                 .where('status', 'ACTIVE')
    //                 .whereRaw(`
    //                 "created_at" BETWEEN TO_DATE('${fromDate} 12:00:00 am', 'DD/MM/YYYY HH:MI:SS am') AND TO_DATE('${toDate} 11:59:59 pm', 'DD/MM/YYYY HH:MI:SS pm')
    //                 `)
    //                 .orderBy('created_at','desc')
    //             } else if (fromDate == "" && toDate == "" && code) {
    //                 data = await CustomerBasicInfo.query()
    //                 .preload('npwp')
    //                 .preload('customerGroup')
    //                 .preload('customerEtc')
    //                 .preload('customerType')
    //                 .preload('bentukUsaha')
    //                 .preload('postalCode')
    //                 .preload('branch')
    //                 .preload('id_customer',function(query){
    //                     query.preload('customerBusiness');
    //                 })
    //                 .preload('id_mitra',function(query){
    //                     query.preload('mitra')
    //                 })
    //                 .preload('id_shipping_line',function(query){
    //                     query.preload('shippingLine')
    //                 })
    //                 .preload('id_cargo_owner',function(query){
    //                     query.preload('cargoOwner')
    //                 })
    //                 .preload('id_service_type',function(query){
    //                     query.preload('serviceType')
    //                 })
    //                 .preload('contact')
    //                 .preload('billing')
    //                 .where('status', 'ACTIVE')
    //                 .where("customer_number", `${code}`)
    //                 .orderBy('created_at','desc')
                    
    //             }
    
                                
    //             // data = data.map((data:any) => {
    //             //     return {
    //             //         id: data.id_basic_info,
    //             //         customer_number: data.customer_number,
    //             //         affiliate_number: data.affiliate_number,
    //             //         company_name: data.company_name,
    //             //         email: data.email,
    //             //         phone: data.phone,
    //             //         address: data.address,
    //             //         joining_since: data.joining_since,
    //             //         company_birthday: data.company_birthday,
    //             //         company_est: data.company_est,
    //             //         company_head: data.company_head,
    //             //         company_head_birthday: data.company_head_birthday,
    //             //         parent_company: data.parent_company,
    //             //         pmku_number: data.pmku_number,
    //             //         customer_group: data.customerGroup.name,
    //             //         postal_code: data.postal_code,
    //             //         status: data.status,
    //             //         created_at: data.created_at.toLocaleString(),
    //             //         npwp: {
    //             //             npwp: data.npwp.npwp,
    //             //             npwp_name: data.npwp.npwp_name,
    //             //             npwp_address: data.npwp.npwp_address
    //             //         },
    //             //         customerGroup: {
    //             //             name: data.customerGroup.name
    //             //         },
    //             //         customerBusinessType: data.id_customer.map((el:any) => el.customerBusiness.name),
    //             //         mitra: data.id_mitra.map((el:any) => el.mitra.name),
    //             //         shipingLine: data.id_shipping_line.map((el:any) => el.shippingLine.name),
    //             //         cargoOwner: data.id_cargo_owner.map((el:any) => el.cargoOwner.name),
    //             //         serviceType: data.id_service_type.map((el:any) => el.serviceType.name),
    //             //         contacts: data.contact,
    //             //         billings: data.billing,
    //             //         customerType: data.customerType
    //             //     }
    //             // })


    //             data = data.map((el:any) => {                    
    //                 return {
    //                     id: el.id_basic_info,
    //                     customer_number: el.customer_number,
    //                     affiliate_number: el.affiliate_number,
    //                     company_name: el.company_name,
    //                     email: el.email,
    //                     phone: el.phone,
    //                     address: el.address,
    //                     joining_since: el.joining_since,
    //                     company_birthday: el.company_birthday,
    //                     company_est: el.company_est,
    //                     company_head: el.company_head,
    //                     company_head_birthday: el.company_head_birthday,
    //                     parent_company: el.parent_company,
    //                     pmku_number: el.pmku_number,
    //                     id_postal_code: el.id_postal_code,
    //                     status: el.status,
    //                     created_at: el.created_at.toLocaleString(),
    //                     customerGroup: {
    //                         name: el.customerGroup?.name === "Lainnya" ? el.customerEtc.name : el.customerGroup?.name,
    //                     },
    //                     bentukUsaha: {
    //                         name: el.bentukUsaha.name,
    //                     },
    //                     postalCode: el.postalCode,
    //                     customerType: {
    //                         name_type: el.customerType.name,
    //                     },
    //                     branch: el.branch,
    //                     contact: el.contact,
    //                     billing: el.billing,
    //                     id_mitra: el.id_mitra.map((el:any) => el.mitra.name),
    //                     id_service_type: el.id_service_type.map((el:any) => el.serviceType.name),
    //                     cargoOwner: el.id_cargo_owner.map((el:any) => el.cargoOwner.name),
    //                     shipingLine: el.id_shipping_line.map((el:any) => el.shippingLine.name),
    //                     npwp: {
    //                         npwp: el.npwp.npwp,
    //                         npwp_name: el.npwp.npwp_name,
    //                         npwp_address: el.npwp.npwp_address,
    //                         type: el.npwp.type
    //                     }
    //                 }
    //             })
    
    
    //             return response.json({
    //                 status: "request data success",
    //                 code: 200,
    //                 data: data
    //             })
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     } else if (accessApi === false) {
    //         return response.json({
    //             status: "Access Forbidden",
    //             code: 403
    //         })
    //     }
    // }

    public async MasterCustomer({response,request,auth}: HttpContextContract){
        await auth.use('api').authenticate()
        let masterType:string = 'Master Customer'
        let email:any = auth.use('api').user?.email
        let accessApi:boolean = await this.authAccess(email, masterType)

        if(accessApi === true) {
            try {
                const { code, 
                        to,
                        from,
                        last_update_from,
                        last_update_to
                    } = request.body()
                let data:any
    
                if (code == "" && from?.Date == "" && to?.Date == "" && last_update_from == "" && last_update_to == "") {
                    return response.json({
                        status: "input parameter",
                        code: 401
                    })
                } else if (from?.Date && code && to?.Date && last_update_from == "" && last_update_to == "") {
                    data = await CustomerInfo.query()
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
                    .where('status', 'ACTIVE')
                    .whereRaw(`
                    "no_customer" = '${code}' AND 
                    "created_at" BETWEEN TO_DATE('${from?.Date} ${from?.Hour ? from?.Hour : "12"}:${from?.Minutes ? from?.Minutes : "00" }:00 ${from?.Type ? from?.Type : "am" }', 'DD/MM/YYYY HH:MI:SS ${from?.Type ? from?.Type : "am"}')
                     AND TO_DATE('${to?.Date} ${to?.Hour ? to?.Hour:"11"}:${to?.Minutes ? to?.Minutes : "59"}:59 ${to?.Type ? from?.Type : "pm"}', 'DD/MM/YYYY HH:MI:SS ${to?.Type ? from?.Type : "pm"}')
                    `)
                    .orderBy('created_at','desc')

                    // .whereRaw(`
                    // "no_customer" = '${code}' AND "created_at" BETWEEN TO_DATE('${from?.Date} 12:00:00 am', 'DD/MM/YYYY HH:MI:SS am') AND TO_DATE('${toDate} 11:59:59 pm', 'DD/MM/YYYY HH:MI:SS pm')
                    // `)  
                } else if (from?.Date && to?.Date && code == "") {
                    data = await CustomerInfo.query()
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
                    .where('status', 'ACTIVE')
                    .whereRaw(`
                    "created_at" BETWEEN TO_DATE('${from?.Date} ${from?.Hour ? from?.Hour : "12"}:${from?.Minutes ? from?.Minutes : "00" }:00 ${from?.Type ? from?.Type : "am" }', 'DD/MM/YYYY HH:MI:SS ${from?.Type ? from?.Type : "am"}')
                     AND TO_DATE('${to?.Date} ${to?.Hour ? to?.Hour:"11"}:${to?.Minutes ? to?.Minutes : "59"}:59 ${to?.Type ? from?.Type : "pm"}', 'DD/MM/YYYY HH:MI:SS ${to?.Type ? from?.Type : "pm"}')
                    `)
                    .orderBy('created_at','desc')

                    // .whereRaw(`
                    // "created_at" BETWEEN TO_DATE('${fromDate} 12:00:00 am', 'DD/MM/YYYY HH:MI:SS am') AND TO_DATE('${toDate} 11:59:59 pm', 'DD/MM/YYYY HH:MI:SS pm')
                    // `)
                } else if (from?.Date == "" && to?.Date == "" && last_update_from == "" && last_update_to == "" && code) {
                    data = await CustomerInfo.query()
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
                    .where("no_customer", `${code}`)
                    .orderBy('created_at','desc')
                } else if (last_update_from && last_update_to  && code) {
                    data = await CustomerInfo.query()
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
                    .where('status', 'ACTIVE')
                    .whereRaw(`
                    "no_customer" = '${code}' AND 
                    "updated_at" BETWEEN TO_DATE('${last_update_from} 12:00:00 am', 'DD/MM/YYYY HH:MI:SS am')
                     AND TO_DATE('${last_update_to} 11:59:59 pm', 'DD/MM/YYYY HH:MI:SS pm')
                    `)
                    .orderBy('updated_at','desc')
                } else if (from?.Date == "" && to?.Date == "" && last_update_from && last_update_to  && code == "") {
                    data = await CustomerInfo.query()
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
                    .where('status', 'ACTIVE')
                    .whereRaw(` 
                    "updated_at" BETWEEN TO_DATE('${last_update_from} 12:00:00 am', 'DD/MM/YYYY HH:MI:SS am')
                     AND TO_DATE('${last_update_to} 11:59:59 pm', 'DD/MM/YYYY HH:MI:SS pm')
                    `)
                    .orderBy('updated_at','desc')
                }
                // const data = await CustomerInfo.query()
                    // .preload('customerType')
                    // .preload('customerGroup')
                    // .preload('bentukUsaha')
                    // .preload('country')
                    // .preload('postalCode')
                    // .preload('branch')
                    // .preload('usahaPelanggan',(query)=>{
                    //     query.preload('usahaPelanggan')
                    // })
                    // .preload('mitra',(query)=>{
                    //     query.preload('mitra')
                    // })
                    // .preload('shippingLine',(query)=>{
                    //     query.preload('shippingLine')
                    // })
                    // .preload('cargoOwner',(query)=>{
                    //     query.preload('cargoOwner')
                    // })
                    // .preload('serviceType',(query)=>{
                    //     query.preload('serviceType')
                    // })
                    // .preload('npwp')
                    // .preload('contact',(query)=>{
                    //     query.preload('branch')
                    // })
                    // .preload('billing',(query)=>{
                    //     query.preload('paymentType',(query)=>{
                    //         query.preload('payment')
                    //     })
                    // })
                    // .preload('document',(query)=>{
                    //     query.preload('expDocument')
                    // })
                    // .where('status', 'ACTIVE')
                    // .whereRaw(`
                    // "no_customer" = '${code}' AND "created_at" BETWEEN TO_DATE('${fromDate} 12:00:00 am', 'DD/MM/YYYY HH:MI:SS am') AND TO_DATE('${toDate} 11:59:59 pm', 'DD/MM/YYYY HH:MI:SS pm')
                    // `)


                data = data.map((el:any) => {                    
                    return {
                        id: el.id,
                        no_customer: el.no_customer,
                        no_affiliasi: el.no_affiliasi,
                        nm_perusahaan: el.nm_perusahaan,
                        email: el.email,
                        phone: el.phone,
                        address: el.address + `${el?.postalCode? 
                                 el?.postalCode.village+","+el?.postalCode.subdistrict+","+el?.postalCode.city+","
                                 +el?.postalCode.province+"("+el?.postalCode.post_code+")" : "" }` ,
                        join_date: el.join_date?.toLocaleString(),
                        establish_date: el.establish_date?.toLocaleString(),
                        birthday_date: el.birthday_date?.toLocaleString(),
                        birthday_pemimpin_date: el.birthday_pemimpin_date?.toLocaleString(),
                        nm_pemimpin: el.nm_pemimpin,
                        parent_customer: el.parent_customer,
                        country: el?.country?.country_name,
                        area: {
                            province: el?.postalCode?.province,
                            city: el?.postalCode?.city,
                            subdistrict: el?.postalCode?.subdistrict,
                            village: el?.postalCode?.village,
                            post_code: el?.postalCode?.post_code,
                        },
                        first_registration_branch: el?.branch?.name ? el?.branch?.name : null,
                        bebas_pajak: el?.is_bebas_pajak == 1 ? "Y" : "N",
                        erp_id: el?.sap_code,
                        status: el.status,
                        submitted_by: el?.submitted_by,
                        last_update_by: el?.last_update_by,
                        last_update_date: el?.last_update_date.toLocaleString(),
                        created_at: el.created_at.toLocaleString(),
                        customer_type: el?.customerType?el.customerType?.name_type:"",
                        customer_group: el?.customerGroup?el.customerGroup?.name:"",
                        bentuk_usaha: el?.bentukUsaha?el.bentukUsaha?.name : "",
                        usaha_pelanggan: el?.usahaPelanggan?.map((el:any) => el.usahaPelanggan.name),
                        mitra: el?.mitra?.map((el:any) => el.mitra.name),
                        shiping_line: el?.shippingLine?.map((el:any) => el.shippingLine.name),
                        cargo_owner: el?.cargoOwner?.map((el:any) => el.cargoOwner.name),
                        service_type: el?.serviceType?.map((el:any) => el.serviceType.name),
                        npwp_customer: {
                            no_npwp: el.npwp.no_npwp,
                            name: el.npwp.name,
                            address: el.npwp.address
                        },
                        contacts: el.contact?.map((el:any)=> {
                            return({
                                nm_contact: el?.nm_contact,
                                email_contact: el?.email_contact,
                                job_title: el?.job_title,
                                mobilephone: el?.mobilephone,
                                phone: el?.phone,
                                address: el?.address,
                                location: el?.branch?.name
                            })
                        }),
                        npwp_account: el?.billing.map((el:any)=>{
                            return({
                                no_npwp: el?.no_npwp,
                                npwp_address: el?.npwp_address
                            })
                        }),
                        // billing: el?.billing?.map((el:any)=> {
                        //     return({
                        //         nm_account: el?.nm_account,
                        //         no_bank_account: el?.no_bank_account,
                        //         nm_bank: el?.nm_bank,
                        //         no_npwp: el?.no_npwp,
                        //         payment_type: el?.paymentType?.map((el:any) => el?.payment?.name)
                        //     })
                        // }),
                        surat_permohonan: {
                            FLAG : el?.document?.spmp ? "Y" : "N",
                            NO_SURAT: "",
                            start_date: "",
                            end_date: ""
                        },
                        ket_domisili: {
                            FLAG : el?.document?.ket_domisili ? "Y" : "N",
                            NO_SURAT: "",
                            start_date: "",
                            end_date: el?.document?.expDocument?.exp_ket_domisili?.toLocaleString()
                        },
                        ktp_pemimpin_perusahaan: {
                            FLAG : el?.document?.ktp_pemimpin_perusahaan ? "Y" : "N",
                            NO_SURAT: "",
                            start_date: "",
                            end_date: ""
                        },
                        ktp_pic: {
                            FLAG : el?.document?.ktp_pic ? "Y" : "N",
                            NO_SURAT: "",
                            start_date: "",
                            end_date: ""
                        },
                        siupal_siupkk: {
                            FLAG : el?.document?.siupal_siupkk ? "Y" : "N",
                            NO_SURAT: "",
                            start_date: "",
                            end_date: el?.document?.expDocument?.exp_siupal_siupkk?.toLocaleString()
                        },
                        siupbm: {
                            FLAG : el?.document?.siupbm ? "Y" : "N",
                            NO_SURAT: "",
                            start_date: "",
                            end_date: el?.document?.expDocument?.exp_siupbm?.toLocaleString()
                        },
                        siup_nib: {
                            FLAG : el?.document?.siup_nib ? "Y" : "N",
                            NO_SURAT: "",
                            start_date: "",
                            end_date: el?.document?.expDocument?.exp_siup_nib?.toLocaleString()
                        },
                        pmku: {
                            FLAG : el?.document?.pmku ? "Y" : "N",
                            NO_SURAT: el?.no_pmku,
                            start_date: "",
                            end_date: ""
                        },
                        akta_perusahaan: {
                            FLAG : el?.document?.akta_perusahaan ? "Y" : "N",
                            NO_SURAT: "",
                            start_date: "",
                            end_date: ""
                        },
                        ref_bank: {
                            FLAG : el?.document?.ref_bank ? "Y" : "N",
                            NO_SURAT: "",
                            start_date: "",
                            end_date: ""
                        },
                        npwp: {
                            FLAG : el?.document?.npwp ? "Y" : "N",
                            NO_SURAT: "",
                            start_date: "",
                            end_date: ""
                        },
                        rek_asosiasi: {
                            FLAG : el?.document?.rek_asosiasi ? "Y" : "N",
                            NO_SURAT: "",
                            start_date: "",
                            end_date: ""
                        },
                        sktd: {
                            FLAG : el?.document?.sktd ? "Y" : "N",
                            NO_SURAT: el?.no_sktd,
                            start_date: el?.document?.expDocument?.start_date_sktd ? el?.document?.expDocument?.start_date_sktd?.toLocaleString() :"",
                            end_date: el?.document?.expDocument?.exp_sktd ? el?.document?.expDocument?.exp_sktd?.toLocaleString() : ""
                        },
                        cor_dgt: {
                            FLAG : el?.document?.cor_dgt ? "Y" : "N",
                            NO_SURAT: "",
                            start_date: "",
                            end_date: el?.document?.expDocument?.exp_cor_dgt?.toLocaleString()
                        },
                        surat_izin_pengelolaan: {
                            FLAG : el?.document?.surat_izin_pengelolaan ? "Y" : "N",
                            NO_SURAT: "",
                            start_date: "",
                            end_date: el?.document?.expDocument?.exp_surat_izin_pengelolaan?.toLocaleString()
                        },
                        skpt: {
                            FLAG : el?.document?.skpt ? "Y" : "N",
                            NO_SURAT: "",
                            start_date: "",
                            end_date: el?.document?.expDocument?.exp_skpt?.toLocaleString()
                        },
                        siopsus: {
                            FLAG : el?.document?.siopsus ? "Y" : "N",
                            NO_SURAT: "",
                            start_date: "",
                            end_date: el?.document?.expDocument?.exp_siopsus?.toLocaleString()
                        },
                    }
                })
    
    
                return response.json({
                    status: "request data success",
                    code: 200,
                    data: data
                })
            } catch (error) {
                console.log(error)
            }
        } else if (accessApi === false) {
            return response.json({
                status: "Access Forbidden",
                code: 403
            })
        }
    }

    public async MasterAlatApung({request,response,auth}: HttpContextContract) {
        await auth.use('api').authenticate()
        let masterType:string = 'Master Peralatan Apung'
        let email:any = auth.use('api').user?.email
        let accessApi:boolean = await this.authAccess(email, masterType)

        if(accessApi === true) {
            try {
                const {code, fromDate, toDate} = request.body()
                let findBy:any = "kode_alat"
                let data:any
                
                if (code == "" && fromDate == "" && toDate == "") {
                    return response.json({
                        status: "input parameter",
                        code: 401
                    })
                } else if (fromDate && code && toDate) {
                    data = await AlatApungApproved.query()
                    .whereRaw(`
                    "${findBy}" = '${code}' AND "created_at" TO_DATE('${fromDate} 12:00:00 am', 'DD/MM/YYYY HH:MI:SS am') AND TO_DATE('${toDate} 11:59:59 pm', 'DD/MM/YYYY HH:MI:SS pm')
                    `)
                    .where('status', 'AKTIF')    
                } else if (fromDate && toDate && code == "") {
                    data = await AlatApungApproved.query()
                    .whereRaw(`
                    "created_at" BETWEEN TO_DATE('${fromDate} 12:00:00 am', 'DD/MM/YYYY HH:MI:SS am') AND TO_DATE('${toDate} 11:59:59 pm', 'DD/MM/YYYY HH:MI:SS pm')
                    `)
                    .where('status', 'AKTIF')    
                } else if (fromDate == "" && toDate == "" && code) {
                    data = await AlatApungApproved.query()
                    .where(findBy, code)
                    .where('status', 'AKTIF')    
                }
    
                data = data.map((el:any) => {
                    return {
                        id: el.id,
                        entity: el.entity,
                        kepemilikan_aset: el.kepemilikan_aset,
                        lokasi_kepemilikan: el.lokasi_kepemilikan,
                        klasifikasi: el.klasifikasi,
                        jenis_kapal: el.jenis_kapal,
                        nama_kapal: el.nama_kapal,
                        equipment_description: el.equipment_description,
                        kode_alat: el.kode_alat,
                        local_asset_number: el.local_asset_number,
                        manufacturer: el.manufacturer,
                        country_of_origin : el.country_of_origin,
                        manufacturer_year: el.manufacturer_year,
                        acquisition_year: el.acquisition_year,
                        "tipe_me/merk_me": el.tipe_me,
                        "tipe_ae/merk_ae": el.tipe_ae,
                        daya_me: el.daya_me,
                        daya_ae: el.daya_ae,
                        jenis_propulsi: el.jenis_propulsi,
                        merk_propulsi: el.merk_propulsi,
                        status: el.status,
                        created_at: el.created_at.toLocaleString()
                    }
                })
    
                return response.json({
                    status: "request data success",
                    code: 200,
                    data: data
                })
            } catch (error) {
                return error
            }
        } else if(accessApi === false) {
            return response.json({
                status: "Access Forbidden",
                code: 403
            })
        }
    }

    public async MasterAlatBongkarMuat({response, request, auth}: HttpContextContract) {
        await auth.use('api').authenticate()
        let masterType:string = 'Master Peralatan Bongkar Muat'
        let email:any = auth.use('api').user?.email
        let accessApi:boolean = await this.authAccess(email, masterType)

        if(accessApi === true) {
            try {
                const {code, fromDate, toDate} = request.body()
    
                let findBy:any = "equipment_number"
                let data:any
                
                if (code == "" && fromDate == "" && toDate == "") {
                    return response.json({
                        status: "input parameter",
                        code: 401
                    })
                } else if (fromDate && code && toDate) {
                    data = await AlatbmApproved.query()
                    .whereRaw(`
                    "${findBy}" = '${code}' AND "created_at" BETWEEN TO_DATE('${fromDate} 12:00:00 am', 'DD/MM/YYYY HH:MI:SS am') AND TO_DATE('${toDate} 11:59:59 pm', 'DD/MM/YYYY HH:MI:SS pm')
                    `)
                    .where('status', 'AKTIF')    
                } else if (fromDate && toDate && code == "") {
                    data = await AlatbmApproved.query()
                    .whereRaw(`
                    "created_at" BETWEEN TO_DATE('${fromDate} 12:00:00 am', 'DD/MM/YYYY HH:MI:SS am') AND TO_DATE('${toDate} 11:59:59 pm', 'DD/MM/YYYY HH:MI:SS pm')
                    `)
                    .where('status', 'AKTIF')    
                } else if (fromDate == "" && toDate == "" && code) {
                    data = await AlatbmApproved.query()
                    .where(findBy, code)
                    .where('status', 'AKTIF')    
                }
    
                data = data.map((el:any) => {
                    return {
                        id: el.id,
                        entity: el.entity,
                        kepemilikan_aset: el.kepemilikan_aset,
                        kode_kepemilikan_aset: el.kode_aset,
                        lokasi_kepemilikan: el.lokasi_kepemilikan,
                        lokasi_fisik: el.lokasi_fisik,
                        class_code: el.class_code,
                        class_description: el.class_description,
                        kategori_alat: el.kategori_alat,
                        nomor_sap: el.nomor_sap,
                        local_equipment: el.local_equipment,
                        equipment_number: el.equipment_number,
                        manufacturer: el.manufacturer,
                        country_origin: el.country_origin,
                        manufacturer_year: el.manufacturer_year,
                        acquisition_year: el.acquisition_year,
                        model: el.model,
                        equipment_serial: el.equipment_serial,
                        kapasitas: el.kapasitas,
                        satuan_kapasitas: el.satuan_kapasitas,
                        power_source: el.power_source,
                        power_capacity: el.power_capacity,
                        equipment_description: el.equipment_description,
                        span: el.span,
                        outreach: el.outreach,
                        lifting_above: el.lifting_above,
                        lifting_below: el.lifting_below,
                        tier_type: el.tier_type,
                        status : el.status,
                        created_at: el.created_at.toLocaleString()
                    }
                })
    
                return response.json({
                    status: "request data success",
                    code: 200,
                    data: data
                })
            } catch (error) {
                return error
            }
        } else if (accessApi === false) {
            return response.json({
                status: "Access Forbidden",
                code: 403
            })
        }
    }

    public async MasterHeadOffice({response}: HttpContextContract) {
        const headOffices = await HeadOffice.all()

        let data:any = headOffices.map(el => {
            return {
                name : el.name,
                code : el.code
            }
        })

        return response.json({
            status: "request data seccess",
            code: 200,
            data: data
        })
    }

    public async MasterRegional({response}: HttpContextContract) {
        const regional = await Database.from('regionals')
        .innerJoin(
            'head_offices',
            'head_offices.id',
            '=',
            'regionals.head_office_id'
            )

        
        let data:any = regional.map(el => {
            return {
                name : el.name,
                code : el.code,
                head_office : el.name_1,
                head_office_code : el.code_1
            }
        })

        return response.json({
            status : 'request data success',
            code : 200,
            data : data
        })
    }

    public async MasterBranch({response, request, auth}: HttpContextContract) {
        await auth.use('api').authenticate()
        let masterType:string = 'Master Pelabuhan'
        let email:any = auth.use('api').user?.email
        let accessApi:boolean = await this.authAccess(email, masterType)

        if(accessApi === true) {
            try {
                const {code, fromDate, toDate} = request.body()
                let data:any 
                if (code == "" && fromDate == "" && toDate == "") {
                    return response.json({
                        status: "input parameter",
                        code: 401
                    })
                } else if (fromDate && code && toDate) {   
                    data = await BranchView.query()
                    .where('status', 'ACTIVE')
                    .whereRaw(`
                    "port_code" = '${code}' AND "created_at" BETWEEN TO_DATE('${fromDate} 12:00:00 am', 'DD/MM/YYYY HH:MI:SS am') AND TO_DATE('${toDate} 11:59:59 pm', 'DD/MM/YYYY HH:MI:SS pm')
                    `)    
                }
                else if (fromDate && toDate && code == "") {
                    data = await BranchView.query()
                    .where('status', 'ACTIVE')
                    .whereRaw(`
                    "created_at" BETWEEN TO_DATE('${fromDate} 12:00:00 am', 'DD/MM/YYYY HH:MI:SS am') AND TO_DATE('${toDate} 11:59:59 pm', 'DD/MM/YYYY HH:MI:SS pm')
                    `)
                } else if (fromDate == "" && toDate == "" && code) {
                    data = await BranchView.query()
                    .where('status', 'ACTIVE')
                    .where('port_code', code)
                }


                data = data.map((el:any) => {
                    return {
                        id: el.id,
                        regional: el.regional,
                        name: el.name,
                        DLKR: el.luas_perairan,
                        DLKP: el.luas_daratan,
                        kode_perairan: el.kode_perairan,
                        "kode_UN/LOCODE": el.kode_kemenhub,
                        lng: el.lng,
                        lat: el.lat,
                        kedalaman_min: el.kedalaman_min,
                        kedalaman_max: el.kedalaman_max,
                        created_at: el.created_at.toLocaleString(),
                        country_name: el.country_name,
                        country_code: el.country_code,
                        province: el.province,
                        port_name: el.port_name,
                        port_code: el.port_code,
                        kelas_pelabuhan: el.kelas_pelabuhan,
                        jenis_pelabuhan: el.jenis_pelabuhan,
                        perairan_pelabuhan: el.perairan_pelabuhan,
                        header_branch: el.header_branch,
                        header_branch_code: el.header_branch_code,
                        status: el.status
                    }
                })
    
                return response.json({
                    status: "request data success",
                    code: 200,
                    data: data
                })
            } catch (error) {
                return response.json(error)
            }
        } else if (accessApi === false) {
            return response.json({
                status: "Access Forbidden",
                code: 403
            })
        }
        
    }

    public async MasterTerminal({response, request, auth}: HttpContextContract) {
        await auth.use('api').authenticate()
        let masterType:string = 'Master Terminal'
        let email:any = auth.use('api').user?.email
        let accessApi:boolean = await this.authAccess(email, masterType)

        if(accessApi === true) {
            try {
                const {code, fromDate, toDate} = request.body()
                let findBy:any = "code"
                let data:any 
    
                if (code == "" && fromDate == "" && toDate == "") {
                    return response.json({
                        status: "input parameter",
                        code: 401
                    })
                } else if (fromDate && code && toDate) {
                    data = await Terminal.query()
                    .preload('branch')
                    .preload('subPengelola')
                    .preload("jenisTerminal")
                    .whereRaw(`
                    "${findBy}" = '${code}' AND "created_at" BETWEEN TO_DATE('${fromDate} 12:00:00 am', 'DD/MM/YYYY HH:MI:SS am') AND TO_DATE('${toDate} 11:59:59 pm', 'DD/MM/YYYY HH:MI:SS pm')
                    `)
                    .where('status', 'ACTIVE')    
                } else if (fromDate && toDate && code == "") {
                    data = await Terminal.query()
                    .preload('branch')
                    .preload('subPengelola')
                    .preload("jenisTerminal")
                    .whereRaw(`
                    "created_at" BETWEEN TO_DATE('${fromDate} 12:00:00 am', 'DD/MM/YYYY HH:MI:SS am') AND TO_DATE('${toDate} 11:59:59 pm', 'DD/MM/YYYY HH:MI:SS pm')
                    `)
                    .where('status', 'ACTIVE')    
                } else if (fromDate == "" && toDate == "" && code) {
                    data = await Terminal.query()
                    .preload('branch')
                    .preload('subPengelola')
                    .preload("jenisTerminal")
                    .where(findBy, code)
                    .where('status', 'ACTIVE')    
                }
    
                data = data.map((el:any) => {
                    return {
                        id: el.id,
                        name: el.name,
                        code: el.code,
                        Panjang_dermaga: el.jumlah_tambat,
                        luas: el.luas,
                        kedalaman_max: el.kedalaman_max,
                        kedalaman_min: el.kedalaman_min,
                        created_at: el.created_at.toLocaleString(),
                        status: el.status,
                        branch: {
                            name: el.branch.name,
                            luas_perairan: el.branch.luas_perairan,
                            luas_daratan: el.branch.luas_daratan,
                            kode_area_labuh: el.branch.kode_area_labuh,
                            kode_kemenhub: el.branch.kode_kemenhub,
                            lng: el.branch.lng,
                            lat: el.branch.lat,
                            kedalaman_min: el.branch.kedalaman_min,
                            kedalaman_max: el.branch.kedalaman_max,
                        },
                        jenisTerminal: {
                            name: el.jenisTerminal.name,
                        }
                    }
                })
    
                return response.json({
                    status: "request data success",
                    code: 200,
                    data: data
                })
            } catch (error) {
                return response.json(error)
            }
        } else if(accessApi === false) {
            return response.json({
                status: "Access Forbidden",
                code: 403
            })
        }
    }

    public async MasterKapal({response, request, auth}: HttpContextContract) {
        let masterType:string = 'Master Kapal'
        let email:any = auth.use('api').user?.email
        let accessApi:boolean = await this.authAccess(email, masterType)

        let data:any
        if(accessApi == true) {
            try {
            const {vessel_code, no_registrasi_inaportnet, fromDate, toDate} = request.body()
            if (vessel_code == "" && fromDate == "" && toDate == "" && no_registrasi_inaportnet == "") {
                return response.json({
                    status: "input parameter",
                    code: 401
                })
            } else if (no_registrasi_inaportnet &&  vessel_code) {
                data =  await VesselGeneralInfo.query()
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
                        .where('status','ACTIVE')
                        .andWhere('no_tanda_pendaftaran', no_registrasi_inaportnet)
                        .andWhere('kd_kapal', vessel_code)
                        // console.log(data.length);
                        
                        if(data.length < 1) {
                            data =  await VesselGeneralInfo.query()
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
                                    .where('status','ACTIVE')
                                    .andWhere('no_tanda_pendaftaran', no_registrasi_inaportnet)
                                    .orWhere('kd_kapal', vessel_code)
                        }

                        
                        // .whereRaw(`
                        // "kd_kapal" = '${vessel_code}' AND "created_at" BETWEEN TO_DATE('${fromDate} 12:00:00 am', 'DD/MM/YYYY HH:MI:SS am') AND TO_DATE('${toDate} 11:59:59 pm', 'DD/MM/YYYY HH:MI:SS pm')
                        // `)
            } else if (vessel_code == "") {
                data = await VesselGeneralInfo.query()
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
                        .where('status','ACTIVE')
                        .andWhere('no_tanda_pendaftaran', no_registrasi_inaportnet)
            } else if (no_registrasi_inaportnet == "") {
                data = await VesselGeneralInfo.query()
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
                        .where('status','ACTIVE')
                        .andWhere('kd_kapal', vessel_code)
            } else if (fromDate == "" && toDate == "") {
                data = await VesselGeneralInfo.query()
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
                        .where('status','ACTIVE')
                        .whereRaw(`
                        "kd_kapal" = '${vessel_code}'
                        `)
            }
            
            
            data = await Promise.all(
                data.map(async (el) => {
                    let trayek =  await VesselTrayek.query().where('kd_trayek', el.trayek).first();
                    let jenisPelayaran = await JenisPelayaran.query().where('kd_jenis_pelayaran', el.jn_pelayaran).first();
                    let kdBendera = await Country.query().where('country_code_3_digits', el.country_id).first();
                    return {
                        kd_kapal_inaportnet: el.kd_kapal_inaportnet,
                        no_pendaftaran_inaportnet: el.no_tanda_pendaftaran,
                        kd_kapal: el.kd_kapal,
                        prefix_nama_kapal: el.kd_nm_kapal,
                        nm_kapal: el.nm_kapal,
                        kd_history_kapal: el.kd_history_kapal,
                        call_sign: el.call_sign,
                        no_imo: el.no_imo,
                        mmsi: el.mmsi,
                        nm_pemilik: el.nm_pemilik,
                        nm_pemilik_lama: el.nm_pemilik_lama,
                        catatan_jn_kapal: el.catatan_jn_kapal,
                        jn_pelayaran: jenisPelayaran?.name,
                        trayek: trayek?.name,
                        st_kapal: el?.statusKapal?.name,
                        th_pembuatan: el.th_pembuatan,
                        country_id: el.country_id,
                        country_id_2_digits: kdBendera?.country_code,
                        jn_kapal: el.spesifikKapal?.jn_kapal,
                        tipe_kapal: el.spesifikKapal?.tipe_kapal,
                        spesifik_kapal: el.spesifikKapal?.spesifik_kapal,
                        kode_tipe_kapal: el.spesifikKapal?.kode,
                        vessel_type_additional_id: el.VesselTypeAdditional?.name ? el.VesselTypeAdditional?.name : null,
                        status: el.status,
                        kp_gt: el.specificVessel.kp_gt,
                        kp_dwt: el.specificVessel.kp_dwt,
                        kp_brt: el.specificVessel.kp_brt,
                        kp_nrt: el.specificVessel.kp_nrt,
                        panjang_kapal: el.specificVessel.kp_loa,
                        lebar_kapal: el.specificVessel.kp_lebar,
                        tinggi_kapal: el.specificVessel.kp_tinggi,
                        draft_maximum: el.specificVessel.dr_maximum,
                        draft_depan: el.specificVessel.dr_depan,
                        draft_belakang: el.specificVessel.dr_belakang,
                        max_speed: el.specificVessel.max_speed,
                        jm_palka: el.specificVessel.jm_palka,
                        jm_derek: el.specificVessel.jm_derek,
                        jn_derek: el.specificVessel.jn_derek,
                        horse_power: el.specificVessel.horse_power,
                        no_surat_ukur: el.supportDocumentVessel?.no_surat_ukur
                    }
                })
            )
            
            return data.length > 0 ? data : response.json({
                status: 'Vessel not found',
                Code : 200
            })
        } catch (error) {
            return error
        }
        } else if(accessApi === false) {
            return response.json({
                status: "Access Forbidden",
                code: 200
            })
        }
    }

    public async MasterDermaga({response, request, auth}: HttpContextContract) {
        await auth.use('api').authenticate()
        let masterType:string = 'Master Dermaga'
        let email:any = auth.use('api').user?.email
        let accessApi:boolean = await this.authAccess(email, masterType)

        let data:any
        if(accessApi === true) {
            try {
            const {code, fromDate, toDate} = request.body()
            if (code == "" && fromDate == "" && toDate == "") {
                return response.json({
                    status: "input parameter",
                    code: 401
                })
            } else if (fromDate && code && toDate) {
                data =  await DermagaApproved.query()
                        .where('status','AKTIF')
                        .whereRaw(`
                        "kode_dermaga" = '${code}' AND "created_at" BETWEEN TO_DATE('${fromDate} 12:00:00 am', 'DD/MM/YYYY HH:MI:SS am') AND TO_DATE('${toDate} 11:59:59 pm', 'DD/MM/YYYY HH:MI:SS pm')
                        `)
            } else if (fromDate && toDate && code == "") {
                data = await DermagaApproved.query()
                        .where('status','AKTIF')
                        .whereRaw(`
                        "created_at" BETWEEN TO_DATE('${fromDate} 12:00:00 am', 'DD/MM/YYYY HH:MI:SS am') AND TO_DATE('${toDate} 11:59:59 pm', 'DD/MM/YYYY HH:MI:SS pm')
                        `)
            } else if (fromDate == "" && toDate == "" && code) {
                data = await DermagaApproved.query()
                        .where('status','AKTIF')
                        .whereRaw(`
                        "kode_dermaga" = '${code}'
                        `)
            }
            
            data = data.map(el => {
                return {
                    kode_pelabuhan: el.kode_pelabuhan,
                    kode_dermaga: el.kode_dermaga,
                    nama_pelabuhan: el.nama_pelabuhan,
                    kode_terminal: el.kode_terminal,
                    nama_terminal: el.nama_terminal,
                    nama_dermaga: el.nama_dermaga,
                    jenis_dermaga: el.jenis_dermaga,
                    jenis_konstruksi: el.jenis_konstruksi,
                    pemilik: el.pemilik,
                    status_milik: el.status_milik,
                    kode_area_labuh: el.kode_area_labuh,
                    jenis_perairan: el.jenis_perairan,
                    tipe_layanan_utama: el.tipe_layanan_utama,
                    zonasi: el.zonasi,
                    layanan_labuh: el.layanan_labuh,
                    layanan_tambat: el.layanan_tambat,
                    longitude: el.longitude,
                    latitude: el.latitude,
                    kode_dermaga_inaportnet: el.kode_dermaga_inaportnet,
                    panjang: el.panjang,
                    lebar: el.lebar,
                    kade_meter_awal: el.kade_meter_awal,
                    kade_meter_akhir: el.kade_meter_akhir,
                    kedalaman_minimal: el.kedalaman_minimal,
                    kedalaman_maximal: el.kedalaman_maximal,
                    elevasi_dermaga_minimal: el.elevasi_dermaga_minimal,
                    elevasi_dermaga_maximal: el.elevasi_dermaga_maximal,
                    jarak_station_tunda: el.jarak_station_tunda,
                    jarak_station_pandu: el.jarak_station_pandu,
                    overhang_at_start: el.overhang_at_start,
                    overhang_at_end: el.overhang_at_end,
                    status: el.status,
                }
            })

            return data
        } catch (error) {
            return error
        }
        } else if(accessApi === false) {
            return response.json({
                status: "Access Forbidden",
                code: 403
            })
        }
    }

    public async MasterAset({response}:HttpContextContract) {
        let errorCode = 500;

        try {
            let asetName = "Supra";
            let startDate = "08-31-2023";
            let endDate = "12-12-2023";
            let dataAset = await ActionAset.getAllAset(asetName,startDate,endDate);
            if(!dataAset || dataAset.length < 1){
                errorCode = 404
                throw new Error("Data aset not found");
            }

            return dataAset;
        } catch (error) {
            return response.status(errorCode).send({message: `${error.message}`});
        }
    }

    public async GenerateToken({request, response, auth}: HttpContextContract) {
        try {
            const email:any = "admin@gmail.com"
            const password:any = '123456'
            
            const token = await auth.use('api').attempt(email, password)
            return response.json(token)
            
        } catch (error) {
            console.log(error);
        }
        
    }


    public async authAccess(email:any, masterType:any) {
        let masterTypeArray:any = []
        let access:boolean
        let status:number = 1
        let masterData:any = await RequestApi.query().preload('masterType').where('email', email).andWhere('status', status)

        masterData = masterData.forEach((el:any) => {
            masterTypeArray.push(el.masterType.master_name)
        })

        access = masterTypeArray.includes(masterType)

        return access
    }

    private convert24To12(time: string | undefined | null, format: string = 'HH:mm'): object {
        let result = {
            hour: ``,
            period: ``
        }
        if (!time) {
          return result;
        }
      
        const hourIndex = format.indexOf('H');
        const minuteIndex = format.indexOf('m');
      
        if (hourIndex === -1 || minuteIndex === -1) {
          return result
        }
      
        const hour = parseInt(time.slice(hourIndex, hourIndex + 2), 10);
      
        if (isNaN(hour)) {
          return result
        }
      
        const meridiem = hour >= 12 ? 'PM' : 'AM';
        const convertedHour = hour % 12 || 12;
        const minute = time.slice(minuteIndex, minuteIndex + 2);
        result.hour = `${convertedHour}:${minute}`,
        result.period = `${meridiem}`
        
        return result;
      }
      
}
