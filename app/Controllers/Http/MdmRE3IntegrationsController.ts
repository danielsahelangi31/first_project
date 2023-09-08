import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import CustomerInfo from 'App/Models/CustomerInfo';
import CustomerNpwpv2 from 'App/Models/CustomerNpwpv2';
import LogsMdmR3 from 'App/Models/LogsMdmR3';
import Notification from 'App/Models/Notification';
import RequestCustomerBilling from 'App/Models/RequestCustomerBilling';
import RequestCustomerContact from 'App/Models/RequestCustomerContact';
import RequestCustomerDocument from 'App/Models/RequestCustomerDocument';
import RequestCustomerExpDocument from 'App/Models/RequestCustomerExpDocument';
import RequestCustomerInfo from 'App/Models/RequestCustomerInfo';
import RequestCustomerNpwp from 'App/Models/RequestCustomerNpwp';
import SchemaAplication from 'App/Models/SchemaAplication';
import User from 'App/Models/User';
import MasterCustomer from 'App/Services/MasterCustomer';
import Ws from 'App/Services/Ws';
import MdmR3 from 'App/Util/MdmR3';
import createCustomerMDMR3Validator from 'App/Validators/CreateCustomerMDMR3Validator';


export default class MdmRE3IntegrationsController {

    public async index({ view }: HttpContextContract) {
        const log= await LogsMdmR3.query().preload("CustomerInfo").orderBy('created_at','desc');
        const state = {
          Logs:log,
        };
        // return console.log(state.Logs)
        return view.render("pages/mdm_r3_log/index", state);
    }

    public async resend({ params, response }: HttpContextContract) {
        try {
          await MdmR3.customerToMdmR3(params.id);
          let result = {
            "message": "Berhasil Dikirim"
          };
          return response.status(200).send(result);
        } catch (error) {
          let result = {
            "message": error.message
          };
          return response.status(500).send(result);
        }
    }

    public async createCustomer({request,response,auth}:HttpContextContract){
        await auth.use('api').authenticate()

        const {
            no_npwp,
            npwp_name,
            npwp_address,
            nm_perusahaan,
            email,
            phone,
            address,
            nm_pemimpin_perusahaan,
            join_date,
            establish_date,
            birthday_date,
            birthday_pemimpin_date,
            customer_group,
            sap_code
        } = request.body()
        
        const payload = {
            no_npwp : no_npwp,
            npwp_name : npwp_name,
            npwp_address : npwp_address,
            nm_perusahaan : nm_perusahaan,
            email : email,
            phone : phone,
            address : address,
            nm_pemimpin_perusahaan : nm_pemimpin_perusahaan,
            join_date : join_date,
            establish_date : establish_date,
            birthday_date : birthday_date,
            birthday_pemimpin_date : birthday_pemimpin_date,
            customer_group : customer_group,
            sap_code : sap_code
        }

        const master_type_id:string = 'a41588f8-97bf-4cc0-8a9f-2f252c0b54a2';
        const trx = await Database.transaction()
        try {
            await request.validate(createCustomerMDMR3Validator)
            const [
                schema,
                checkNpwp,
                checkNpwpStagging
            ] = await Promise.all([
                await SchemaAplication.query().where("master_type_id",master_type_id).first(),
                await CustomerNpwpv2.query().where("no_npwp",no_npwp).first(),
                await RequestCustomerNpwp.query().where("no_npwp",no_npwp).andWhereHas('RequestCustomerInfo',(query)=>{
                    query.where('status','DRAFT')
                }).first()
            ])


            if (checkNpwp?.no_npwp) {
                let result = {
                    message: "Data already exist in Single MDM system ",
                    detail: {
                        no_npwp: checkNpwp?.no_npwp,
                        npwp_name: checkNpwp?.name,
                        npwp_address: checkNpwp?.address,
                    }
                }
                return response.status(409).send(result) 
            } else {

                if(checkNpwpStagging?.no_npwp){
                    let result = {
                        message: "Data already in approval stage Single MDM system ",
                        detail: {
                            no_npwp: checkNpwp?.no_npwp,
                            npwp_name: checkNpwp?.name,
                            npwp_address: checkNpwp?.address,
                        }
                    }
                    return response.status(409).send(result) 
                } else {
                    const[
                        requestCustomer,
                        customer_number_count
                    ] = await Promise.all([
                        await RequestCustomerInfo.query().max('no_request').whereRaw(`TRUNC("created_at") = TRUNC(SYSDATE+7/24)`).first(),
                        await RequestCustomerInfo.query().max('no_customer').first()
                    ])
                    

                    const customer_info = new RequestCustomerInfo()
                    customer_info.nm_perusahaan = nm_perusahaan
                    customer_info.email = email
                    customer_info.phone = phone
                    customer_info.address = address
                    customer_info.nm_pemimpin = nm_pemimpin_perusahaan
                    customer_info.join_date = join_date
                    customer_info.establish_date = establish_date
                    customer_info.birthday_date = birthday_date
                    customer_info.birthday_pemimpin_date = birthday_pemimpin_date
                    customer_info.sap_code = sap_code
                    customer_info.status = "DRAFT"
                    customer_info.master_type_id = master_type_id
                    customer_info.no_request = MasterCustomer.requestNumber(requestCustomer?.$extras['MAX("NO_REQUEST")'] ? requestCustomer?.$extras['MAX("NO_REQUEST")'] : '0');
                    customer_info.no_customer = MasterCustomer.customerNumber(customer_number_count?.$extras['MAX("NO_CUSTOMER")'] ? customer_number_count?.$extras['MAX("NO_CUSTOMER")'] : 0);
                    customer_info.group_customer_id = this.customerGroupConverter(`${customer_group}`)
                    customer_info.tp_company = 1
                    customer_info.flag_mdm_r3 = 1
                    // return console.log(this.bentukUsahaConverter(`${bentuk_usaha}`))
                    // if(parent_customer){
                    //     const affiliasi_count = await CustomerInfo.query().max('no_affiliasi').where('parent_customer',`${customer_info.parent_customer}`).first()
                    //     const no_affiliasi = await CustomerInfo.query().select('no_customer').where('nm_perusahaan', `${customer_info.parent_customer}`).first()
                    //     const affiliasi_max = affiliasi_count?.$extras['MAX("NO_AFFILIASI")'] ? affiliasi_count?.$extras['MAX("NO_AFFILIASI")'] : 0;
                    //     customer_info.no_affiliasi = MasterCustomer.affiliateNumber(no_affiliasi?.no_customer?.toString(),affiliasi_max)
                    //     customer_info.tp_company = 2
                    // } else {
                    // }

                    const npwp = new RequestCustomerNpwp()
                    npwp.no_npwp = no_npwp
                    npwp.name = npwp_name
                    npwp.address = npwp_address
                    const contact = new RequestCustomerContact()
                    const billing = new RequestCustomerBilling()
                    const document = new RequestCustomerDocument()
                    const exp_document = new RequestCustomerExpDocument()

                    const data = await customer_info.useTransaction(trx).save()
                    const new_customer = await RequestCustomerInfo.query({client:trx}).where("id",data?.id).first()
                    await new_customer?.related('npwp').save(npwp)
                    await new_customer?.related('contact').save(contact)
                    await new_customer?.related('billing').save(billing)
                    await new_customer?.related('document').save(document)
                    
                    const document_related = await RequestCustomerDocument.query({client:trx}).where("request_customer_id", data.id).first() 
                    await document_related?.related('expDocument').save(exp_document)
                    
                    await trx.commit()

                    const response_data = {
                        no_npwp: no_npwp,
                        npwp_name: npwp_name ? npwp_name : "",
                        npwp_address: npwp_address ? npwp_address : "",
                    }

                    let result = {
                        message: "Create Data Success",
                        data: response_data
                    }

                    if(trx.isCompleted){
                        const log = new LogsMdmR3()
                        log.customer_name = nm_perusahaan ? nm_perusahaan : "" 
                        log.action = "RECEIVED"
                        log.payload = JSON.stringify(payload)
                        log.response = JSON.stringify(result)
                        log.customer_id = data?.id ? data?.id : ""
                        await log.save()
                    }

                    const nextUserApproval = await User.query().where("role_id", `${schema?.role_id}`);
                        let notificationData: any = [];
                        nextUserApproval.forEach(function(value) {
                            notificationData.push({
                                from: "MDM RE3",
                                to: value.id,
                                request_no: new_customer?.nm_perusahaan,
                                master_type_id: master_type_id,
                                status: "DRAFT"
                            });
                            Ws.io.emit("receive-notif", { userId: value.id, message: "Request Submit Master Data Customer" });
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

            const log = new LogsMdmR3()
            log.customer_name = nm_perusahaan ? nm_perusahaan : "" 
            log.action = "RECEIVED"
            log.payload = JSON.stringify(payload)
            log.response = JSON.stringify(result)
            log.customer_id = ""
            await log.save()

            return response.status(500).send(result)
        }

    }

    private customerGroupConverter(name:string|null|undefined){
        const customer_group = {
            "BUMN": "f6ce59ef-f1f3-4019-901d-81580fe940fa",
            "SWASTA": "84b5f185-0312-4d19-87fe-8c2673fb113f",
            "TNI/POLRI": "76f0b508-f8ad-4a28-836a-e18a2da82230",
            "INSTANSI PEMERINTAH": "95b2ee1f-4066-4153-9416-176f2d54261d",
            "GRUP BUMN (AFILIASI/BERELASI BUMN)": "5c48d295-875d-405b-9713-460fae0fa223",
            "AFILIASI/BERELASI PELINDO":"1d9bae5b-a102-4f75-8268-73a74f10907e",
            "ASOSIASI":"1d9bae5b-a102-4f75-8268-73a74f10907f",
            "LAINNYA":"1d9bae5b-a102-4f75-8268-73a74f10909a",
        }
        
        if (name === null || name === undefined) {
            return "";
        }

        if(name in customer_group){
            return customer_group[`${name}`]
        } else {
          return ""
        }
    }
}