import CustomerBilling from "App/Models/CustomerBilling";
import CustomerContact from "App/Models/CustomerContact";
import CustomerDocument from "App/Models/CustomerDocument";
import CustomerExpDocument from "App/Models/CustomerExpDocument";
import CustomerInfo from "App/Models/CustomerInfo";
import CustomerNpwpv2 from "App/Models/CustomerNpwpv2";
import PivotCargoOwner from "App/Models/PivotCargoOwner";
import PivotContactCustomerLocation from "App/Models/PivotContactCustomerLocation";
import PivotPaymentType from "App/Models/PivotPaymentType";
import PivotServiceType from "App/Models/PivotServiceType";
import PivotShippingLine from "App/Models/PivotShippingLine";
import PivotUsahaMitra from "App/Models/PivotUsahaMitra";
import PivotUsahaPelanggan from "App/Models/PivotUsahaPelanggan";
import RequestCustomerBilling from "App/Models/RequestCustomerBilling";
import RequestCustomerContact from "App/Models/RequestCustomerContact";
import RequestCustomerDocument from "App/Models/RequestCustomerDocument";
import RequestCustomerExpDocument from "App/Models/RequestCustomerExpDocument";
import RequestCustomerInfo from "App/Models/RequestCustomerInfo";
import RequestCustomerNpwp from "App/Models/RequestCustomerNpwp";
import User from "App/Models/User";
import InsertLogDocumentFunction, {LogDocument,LogSktd} from "./MasterCustomer/InsertLogDocument.function";

class MasterCustomer {
    
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

        requestNumber = 'CUST'+ currentDate + sequenceRequestNumber;

        return requestNumber
    }

    /**
     * customerNumber
     */
    public customerNumber(count?:number | null) {
        let customerNumber:string = '';
        let sequenceCustomerNumber:string = '';
        const customerNumberCode:string = '11';
        let countData:any;

        if (count == undefined || null) {
            return '';
        };

        if(count != 0){
            let countRaw:any = count.toString();
            countRaw = countRaw.substring("2","8");
            countRaw = parseInt(countRaw);
            countData = countRaw + 1;
        }else{
            countData = count + 1;
        }

        let strongCountData = countData.toString();

        for (let i = 5; i>=0; i--) {
            if(strongCountData.length > i) {
                sequenceCustomerNumber += strongCountData;
                break;
            }
            sequenceCustomerNumber += "0";
        };

        customerNumber = customerNumberCode + sequenceCustomerNumber;

        return customerNumber;
    }

    /**
     * affiliateNumber
     */
    public affiliateNumber(customerNumber:string,count?:number) {
        let affiliateNumber:string = '';
        let sequenceAffiliateNumber:string = '';
        let countData:any;
        const affiliateNumberCode:string = '2';
        
        if (count == undefined || null) {
            return '';
        };

        if(count != 0){
            let countRaw:any = count.toString();
            countRaw = countRaw.substring("9","12");
            countRaw = parseInt(countRaw);
            countData = countRaw + 1;
        }else{
            countData = count + 1;
        }

        let stringCountData = countData.toString();

        for (let i = 2; i>=0; i--) {
            if(stringCountData.length > i) {
                sequenceAffiliateNumber += stringCountData;
                break;
            }
            sequenceAffiliateNumber += "0";
        };
        affiliateNumber = affiliateNumberCode + customerNumber + sequenceAffiliateNumber;
        console.log(affiliateNumber)
        return affiliateNumber;
    }

    public async approvedData(no_request:string) {
        console.log(no_request)
        const customerStagging = await RequestCustomerInfo.query().where("no_request",no_request).preload('user').first()
        const npwpStagging = await RequestCustomerNpwp.query().where("request_customer_id",`${customerStagging?.id}`).first()
        const documentStagging = await RequestCustomerDocument.query().where("request_customer_id",`${customerStagging?.id}`).first()
        const expDocumentStagging = await RequestCustomerExpDocument.query().where("customer_document_id",`${documentStagging?.id}`).first()
        let date = new Date();
        date.setHours(date.getHours()+7);
        let timestamp = date;

        const contactStagging = await RequestCustomerContact.query().where("request_customer_id",`${customerStagging?.id}`)
        const billingStagging = await RequestCustomerBilling.query().where("request_customer_id",`${customerStagging?.id}`)
        let contactPayload:any[] = []
        let billingPayload:any[] = []
        let contactId:any[] = []
        contactStagging.forEach((contact)=>{
            contactId?.push(contact.id)
        })

        const cabangContact = await PivotContactCustomerLocation.query().whereIn("request_contact_id",contactId)
        // const paymentType = await PivotPaymentType.query().whereIn("request_billing_id",billingId)
        // let billingId:any[] = []
        // billingStagging.forEach((billing)=>{
        //     billingId?.push(billing.id)
        // })
        // const paymentType = await PivotPaymentType.query().whereIn("request_billing_id",billingId)
        
        // pivot data
        const usahaPelanggan = await PivotUsahaPelanggan.query().where("request_customer_id",`${customerStagging?.id}`)
        const mitra = await PivotUsahaMitra.query().where("request_customer_id",`${customerStagging?.id}`)
        const shippingLine = await PivotShippingLine.query().where("request_customer_id",`${customerStagging?.id}`)
        const cargoOwner = await PivotCargoOwner.query().where("request_customer_id",`${customerStagging?.id}`)
        const serviceType = await PivotServiceType.query().where("request_customer_id",`${customerStagging?.id}`)
        let usahaPelangganPayload:any[] = []
        let mitraPayload:any[] = []
        let shippingLinePayload:any[] = []
        let cargoOwnerPayload:any[] = []
        let serviceTypePayload:any[] = []
        let contactCabangPayload:any[] = []
        // let paymentTypePayload:any[] = []

        const customer_info = new CustomerInfo()
        customer_info.no_customer = customerStagging?.no_customer
        customer_info.no_affiliasi = customerStagging?.no_affiliasi
        customer_info.nm_perusahaan = customerStagging?.nm_perusahaan
        customer_info.email = customerStagging?.email
        customer_info.phone = customerStagging?.phone
        customer_info.address = customerStagging?.address
        customer_info.nm_pemimpin = customerStagging?.nm_pemimpin
        customer_info.parent_customer = customerStagging?.parent_customer
        customer_info.principle = customerStagging?.principle
        customer_info.join_date = customerStagging?.join_date
        customer_info.establish_date = customerStagging?.establish_date 
        customer_info.birthday_date = customerStagging?.birthday_date
        customer_info.birthday_pemimpin_date = customerStagging?.birthday_pemimpin_date
        customer_info.group_customer_id = customerStagging?.group_customer_id
        customer_info.customer_type_id = customerStagging?.customer_type_id
        customer_info.bentuk_usaha_id = customerStagging?.bentuk_usaha_id
        customer_info.branch_id = customerStagging?.branch_id
        customer_info.country_id = customerStagging?.country_id
        customer_info.area_id = customerStagging?.area_id
        customer_info.is_bebas_pajak = customerStagging?.is_bebas_pajak
        customer_info.tp_company = customerStagging?.tp_company
        customer_info.tp_nm_perusahaan = customerStagging?.tp_nm_perusahaan
        customer_info.no_pmku = customerStagging?.no_pmku
        customer_info.no_sktd = customerStagging?.no_sktd
        customer_info.status = 'ACTIVE'
        customer_info.sap_code = customerStagging?.sap_code
        customer_info.submitter = customerStagging?.submitter
        customer_info.entity_id = customerStagging?.entity_id
        customer_info.master_type_id = customerStagging?.master_type_id
        customer_info.schema_id = customerStagging?.schema_id
        customer_info.is_edit = 0
        customer_info.flag_mdm_r3 = customerStagging?.flag_mdm_r3
        customer_info.submitted_by = customerStagging?.user?.name
        customer_info.last_update_by = customerStagging?.user?.name
        customer_info.submitted_date = timestamp
        customer_info.last_update_date = timestamp

        const npwp = new CustomerNpwpv2()
        npwp.no_npwp = npwpStagging?.no_npwp
        npwp.name = npwpStagging?.name
        npwp.address = npwpStagging?.address
        npwp.type = npwpStagging?.type

        const document = new CustomerDocument()
        document.spmp = documentStagging?.spmp
        document.ket_domisili = documentStagging?.ket_domisili
        document.ktp_pemimpin_perusahaan = documentStagging?.ktp_pemimpin_perusahaan
        document.ktp_pic = documentStagging?.ktp_pic
        document.siupal_siupkk = documentStagging?.siupal_siupkk
        document.siupbm = documentStagging?.siupbm
        document.siup_nib = documentStagging?.siup_nib
        document.pmku = documentStagging?.pmku
        document.akta_perusahaan = documentStagging?.akta_perusahaan
        document.ref_bank = documentStagging?.ref_bank
        document.npwp = documentStagging?.npwp
        document.pkp_non_pkp = documentStagging?.pkp_non_pkp
        document.rek_asosiasi = documentStagging?.rek_asosiasi
        document.sktd = documentStagging?.sktd
        document.cor_dgt = documentStagging?.cor_dgt
        document.surat_izin_pengelolaan = documentStagging?.surat_izin_pengelolaan
        document.skpt = documentStagging?.skpt
        document.siopsus = documentStagging?.siopsus 

        const expDocument = new CustomerExpDocument()
        expDocument.exp_ket_domisili = expDocumentStagging?.exp_ket_domisili
        expDocument.exp_siupal_siupkk = expDocumentStagging?.exp_siupal_siupkk
        expDocument.exp_siupbm = expDocumentStagging?.exp_siupbm
        expDocument.exp_siup_nib = expDocumentStagging?.exp_siup_nib
        expDocument.exp_sktd = expDocumentStagging?.exp_sktd
        expDocument.exp_cor_dgt = expDocumentStagging?.exp_cor_dgt
        expDocument.exp_surat_izin_pengelolaan = expDocumentStagging?.exp_surat_izin_pengelolaan
        expDocument.exp_skpt = expDocumentStagging?.exp_skpt
        expDocument.exp_siopsus = expDocumentStagging?.exp_siopsus
        expDocument.start_date_sktd = expDocumentStagging?.start_date_sktd;

        contactStagging.forEach((contact) => {
            contactPayload?.push({
                nm_contact: contact?.nm_contact,
                email_contact: contact?.email_contact,
                job_title: contact?.job_title,
                mobilephone: contact?.mobilephone,
                phone: contact?.phone,
                address: contact?.address,
                location_id: contact?.location_id
            })
        })

        billingStagging.forEach((billing) => {
            billingPayload?.push({
                // nm_account: billing?.nm_account,
                // no_bank_account: billing?.no_bank_account,
                // nm_bank: billing?.nm_bank,
                no_npwp: billing?.no_npwp,
                npwp_address: billing?.npwp_address,
                // location_id: billing?.location_id,
                flag_npwp_billing: billing?.flag_npwp_billing,
                kd_npwp: billing?.kd_npwp
            })
        })
        
        // payload for pivot table
        if(usahaPelanggan.length > 0){
        usahaPelanggan.forEach((data) => {
            usahaPelangganPayload?.push({
                usaha_pelanggan_id: data?.usaha_pelanggan_id
            })
        })
        }

        if(mitra.length > 0){
        mitra.forEach((data) => {
            mitraPayload?.push({
                mitra_id: data?.mitra_id
            })
        })
        }

        if(shippingLine.length > 0){
        shippingLine.forEach((data) => {
            shippingLinePayload?.push({
                shipping_line_id: data?.shipping_line_id
            })
        })
        }

        if(cargoOwner.length > 0){
        cargoOwner.forEach((data) => {
            cargoOwnerPayload?.push({
                cargo_owner_id: data?.cargo_owner_id
            })
        })
        }
        
        if(serviceType.length > 0){
        serviceType.forEach((data) => {
            serviceTypePayload?.push({
                service_type_id: data?.service_type_id
            })
        })
        }

        if(cabangContact.length > 0){
            let currentIdContact: string | null = null;
            cabangContact?.forEach((data) => {
                if (data.request_contact_id !== currentIdContact) {
                    contactCabangPayload?.push([]);
                    currentIdContact = data.request_contact_id;
                }
                contactCabangPayload[contactCabangPayload.length - 1]?.push(
                    {
                        cabang_id: data.cabang_id
                    }
                );
            })
        }

        // if(paymentType.length > 0){
        //     let currentIdBilling: string | null = null;
        //     paymentType?.forEach((data) => {
        //         if (data.request_billing_id !== currentIdBilling) {
        //             paymentTypePayload?.push([]);
        //             currentIdBilling = data.request_billing_id;
        //         }
        //         paymentTypePayload[paymentTypePayload.length - 1]?.push(
        //             {
        //                 payment_types_id: data.payment_types_id
        //             }
        //         );
        //     })
        // }

        try {
            const data = await customer_info.save()
            const relatedCustomer = await CustomerInfo.findBy("id",data.id)
            await relatedCustomer?.related('npwp').save(npwp)
            await relatedCustomer?.related('document').save(document)
            //pivot data
            await relatedCustomer?.related('usahaPelanggan').createMany(usahaPelangganPayload ? usahaPelangganPayload : [])
            await relatedCustomer?.related('mitra').createMany(mitraPayload ? mitraPayload : [])
            await relatedCustomer?.related('shippingLine').createMany(shippingLinePayload ? shippingLinePayload : [])
            await relatedCustomer?.related('cargoOwner').createMany(cargoOwnerPayload ? cargoOwnerPayload : [])
            await relatedCustomer?.related('serviceType').createMany(serviceTypePayload ? serviceTypePayload : [])
            
            const relatedDocument = await CustomerDocument.findBy("customer_id",data.id)
            await relatedDocument?.related('expDocument').save(expDocument)
            // contact and billing
            const contact = await relatedCustomer?.related('contact').createMany(contactPayload)
            const billing = await relatedCustomer?.related('billing').createMany(billingPayload)
            
            const idContact:string[] = contact ? contact?.map(data => data?.id) : []
            const contact_related = await CustomerContact.query().whereIn("id",idContact)
            contact_related.forEach(async function(contact,index){
                await contact?.related('cabang').createMany(contactCabangPayload.length > 0 ? contactCabangPayload[index] : [])
            })
            // const idBilling:string[] = billing ? billing?.map(data => data?.id) : []
            // const billing_related = await CustomerBilling.query().whereIn("id",idBilling)
            // billing_related.forEach(async function(billing,index){
            //     await billing?.related('paymentType').createMany(paymentTypePayload.length > 0 ? paymentTypePayload[index] : [])
            // })

            let response = {
                message : "success",
                customer_id : data?.id
            }
            return response
        } catch (error) {
            console.log(error)
            let response = {
                message : "failed",
                detail: error
            }
            
            return response
        }
    }

    public async approvedRenewal(no_request:string) {
        
        const customerStagging = await RequestCustomerInfo.query().where("no_request",no_request).preload('user').first()
        const npwpStagging = await RequestCustomerNpwp.query().where("request_customer_id",`${customerStagging?.id}`).first()
        const documentStagging = await RequestCustomerDocument.query().where("request_customer_id",`${customerStagging?.id}`).first()
        const expDocumentStagging = await RequestCustomerExpDocument.query().where("customer_document_id",`${documentStagging?.id}`).first()
        let date = new Date();
        date.setHours(date.getHours()+7);
        let timestamp = date;

        const contactStagging = await RequestCustomerContact.query().where("request_customer_id",`${customerStagging?.id}`)
        const billingStagging = await RequestCustomerBilling.query().where("request_customer_id",`${customerStagging?.id}`)
        let contactPayload:any[] = []
        let billingPayload:any[] = []
        let contactId:any[] = []
        contactStagging.forEach((contact)=>{
            contactId?.push(contact.id)
        })

        const cabangContact = await PivotContactCustomerLocation.query().whereIn("request_contact_id",contactId)
        // let billingId:any[] = []
        // billingStagging.forEach((billing)=>{
        //     billingId.push(billing.id)
        // })
        // const paymentType = await PivotPaymentType.query().whereIn("request_billing_id",billingId)
       
        // pivot data
        const usahaPelanggan = await PivotUsahaPelanggan.query().where("request_customer_id",`${customerStagging?.id}`)
        const mitra = await PivotUsahaMitra.query().where("request_customer_id",`${customerStagging?.id}`)
        const shippingLine = await PivotShippingLine.query().where("request_customer_id",`${customerStagging?.id}`)
        const cargoOwner = await PivotCargoOwner.query().where("request_customer_id",`${customerStagging?.id}`)
        const serviceType = await PivotServiceType.query().where("request_customer_id",`${customerStagging?.id}`)
        const LogDocument = await InsertLogDocumentFunction.getDocumentCustomer(customerStagging?.reference_id)
        let usahaPelangganPayload:any[] = []
        let mitraPayload:any[] = []
        let shippingLinePayload:any[] = []
        let cargoOwnerPayload:any[] = []
        let serviceTypePayload:any[] = []
        let contactCabangPayload:any[] = []
        let logSktdload:LogSktd
        let LogDocumentPayload:LogDocument[] = []
        // let paymentTypePayload:any[] = []

        const customer_info = await CustomerInfo.findByOrFail("id",customerStagging?.reference_id)
        customer_info.no_customer = customerStagging?.no_customer
        customer_info.no_affiliasi = customerStagging?.no_affiliasi
        customer_info.nm_perusahaan = customerStagging?.nm_perusahaan
        customer_info.email = customerStagging?.email
        customer_info.phone = customerStagging?.phone
        customer_info.address = customerStagging?.address
        customer_info.nm_pemimpin = customerStagging?.nm_pemimpin
        customer_info.parent_customer = customerStagging?.parent_customer
        customer_info.principle = customerStagging?.principle
        customer_info.join_date = customerStagging?.join_date
        customer_info.establish_date = customerStagging?.establish_date 
        customer_info.birthday_date = customerStagging?.birthday_date
        customer_info.birthday_pemimpin_date = customerStagging?.birthday_pemimpin_date
        customer_info.group_customer_id = customerStagging?.group_customer_id
        customer_info.customer_type_id = customerStagging?.customer_type_id
        customer_info.bentuk_usaha_id = customerStagging?.bentuk_usaha_id
        customer_info.branch_id = customerStagging?.branch_id
        customer_info.country_id = customerStagging?.country_id
        customer_info.area_id = customerStagging?.area_id
        customer_info.sap_code = customerStagging?.sap_code
        customer_info.is_bebas_pajak = customerStagging?.is_bebas_pajak
        customer_info.tp_company = customerStagging?.tp_company
        customer_info.tp_nm_perusahaan = customerStagging?.tp_nm_perusahaan
        customer_info.no_pmku = customerStagging?.no_pmku
        customer_info.no_sktd = customerStagging?.no_sktd
        customer_info.status = "ACTIVE"
        customer_info.is_edit = 0
        customer_info.flag_mdm_r3 = customerStagging?.flag_mdm_r3
        customer_info.last_update_by = customerStagging?.user?.name
        customer_info.last_update_date = timestamp

        const npwp = await CustomerNpwpv2.findByOrFail("customer_id",customerStagging?.reference_id)
        npwp.no_npwp = npwpStagging?.no_npwp
        npwp.name = npwpStagging?.name
        npwp.address = npwpStagging?.address
        npwp.type = npwpStagging?.type

        const document = await CustomerDocument.findByOrFail("customer_id",customerStagging?.reference_id)
        document.spmp = documentStagging?.spmp
        document.ket_domisili = documentStagging?.ket_domisili
        document.ktp_pemimpin_perusahaan = documentStagging?.ktp_pemimpin_perusahaan
        document.ktp_pic = documentStagging?.ktp_pic
        document.siupal_siupkk = documentStagging?.siupal_siupkk
        document.siupbm = documentStagging?.siupbm
        document.siup_nib = documentStagging?.siup_nib
        document.pmku = documentStagging?.pmku
        document.akta_perusahaan = documentStagging?.akta_perusahaan
        document.ref_bank = documentStagging?.ref_bank
        document.npwp = documentStagging?.npwp
        document.pkp_non_pkp = documentStagging?.pkp_non_pkp
        document.rek_asosiasi = documentStagging?.rek_asosiasi
        document.sktd = documentStagging?.sktd
        document.cor_dgt = documentStagging?.cor_dgt
        document.surat_izin_pengelolaan = documentStagging?.surat_izin_pengelolaan
        document.skpt = documentStagging?.skpt
        document.siopsus = documentStagging?.siopsus 

        const expDocument = await CustomerExpDocument.findByOrFail("customer_document_id",document?.id)
        expDocument.exp_ket_domisili = expDocumentStagging?.exp_ket_domisili
        expDocument.exp_siupal_siupkk = expDocumentStagging?.exp_siupal_siupkk
        expDocument.exp_siupbm = expDocumentStagging?.exp_siupbm
        expDocument.exp_siup_nib = expDocumentStagging?.exp_siup_nib
        expDocument.exp_sktd = expDocumentStagging?.exp_sktd
        expDocument.exp_cor_dgt = expDocumentStagging?.exp_cor_dgt
        expDocument.exp_surat_izin_pengelolaan = expDocumentStagging?.exp_surat_izin_pengelolaan
        expDocument.exp_skpt = expDocumentStagging?.exp_skpt
        expDocument.exp_siopsus = expDocumentStagging?.exp_siopsus
        expDocument.start_date_sktd = expDocumentStagging?.start_date_sktd;

        contactStagging.forEach((contact) => {
            contactPayload.push({
                nm_contact: contact?.nm_contact,
                email_contact: contact?.email_contact,
                job_title: contact?.job_title,
                mobilephone: contact?.mobilephone,
                phone: contact?.phone,
                address: contact?.address,
                location_id: contact?.location_id
            })
        })

        billingStagging.forEach((billing) => {
            billingPayload.push({
                // nm_account: billing?.nm_account,
                // no_bank_account: billing?.no_bank_account,
                // nm_bank: billing?.nm_bank,
                no_npwp: billing?.no_npwp,
                npwp_address: billing?.npwp_address,
                // location_id: billing?.location_id,
                flag_npwp_billing: billing?.flag_npwp_billing,
                kd_npwp: billing?.kd_npwp
            })
        })


    // payload for pivot table
    if(usahaPelanggan.length > 0){
        usahaPelanggan.forEach((data) => {
            usahaPelangganPayload?.push({
                usaha_pelanggan_id: data?.usaha_pelanggan_id
            })
        })
        }

        if(mitra.length > 0){
        mitra.forEach((data) => {
            mitraPayload?.push({
                mitra_id: data?.mitra_id
            })
        })
        }

        if(shippingLine.length > 0){
        shippingLine.forEach((data) => {
            shippingLinePayload?.push({
                shipping_line_id: data?.shipping_line_id
            })
        })
        }

        if(cargoOwner.length > 0){
        cargoOwner.forEach((data) => {
            cargoOwnerPayload?.push({
                cargo_owner_id: data?.cargo_owner_id
            })
        })
        }
        
        if(serviceType.length > 0){
        serviceType.forEach((data) => {
            serviceTypePayload?.push({
                service_type_id: data?.service_type_id
            })
        })
        }

        if(cabangContact.length > 0){
            let currentIdContact: string | null = null;
            cabangContact?.forEach((data) => {
                if (data.request_contact_id !== currentIdContact) {
                    contactCabangPayload?.push([]);
                    currentIdContact = data.request_contact_id;
                }
                contactCabangPayload[contactCabangPayload.length - 1]?.push(
                    {
                        cabang_id: data.cabang_id
                    }
                );
            })
        }
        // if(paymentType.length > 0){
        //     let currentIdBilling: string | null = null;
        //     paymentType?.forEach((data) => {
        //         if (data.request_billing_id !== currentIdBilling) {
        //             paymentTypePayload?.push([]);
        //             currentIdBilling = data.request_billing_id;
        //         }
        //         paymentTypePayload[paymentTypePayload.length - 1]?.push(
        //             {
        //                 payment_types_id: data.payment_types_id
        //             }
        //         );
        //     })
        // }

        try {
            const data = await customer_info.save()
            const relatedCustomer = await CustomerInfo.findBy("id",data.id)
            await relatedCustomer?.related('npwp').save(npwp)
            await relatedCustomer?.related('document').save(document)

            //pivot data
            await relatedCustomer?.related('usahaPelanggan').createMany(usahaPelangganPayload)
            await relatedCustomer?.related('mitra').createMany(mitraPayload)
            await relatedCustomer?.related('shippingLine').createMany(shippingLinePayload)
            await relatedCustomer?.related('cargoOwner').createMany(cargoOwnerPayload)
            await relatedCustomer?.related('serviceType').createMany(serviceTypePayload)
            
            const relatedDocument = await CustomerDocument.findBy("customer_id",data.id)
            await relatedDocument?.related('expDocument').save(expDocument)
            // payload sktd
            logSktdload = {
                customer_id: document.customer_id,
                document_id: document.id,
                no_sktd: customerStagging?.no_sktd,
                start_date: expDocumentStagging?.start_date_sktd,
                exp_date:expDocumentStagging?.exp_sktd,
                created_at: relatedDocument?.created_at
            }
            // insert log sktd 
            await InsertLogDocumentFunction.createLogSktd(logSktdload)
            // await InsertLogDocumentFunction.createLogDocument(LogDocumentPayload)

            await this.deleteForUpdate(customerStagging?.reference_id)
            // pivot
            await relatedCustomer?.related('usahaPelanggan').createMany(usahaPelangganPayload ? usahaPelangganPayload : [])
            await relatedCustomer?.related('mitra').createMany(mitraPayload ? mitraPayload : [])
            await relatedCustomer?.related('shippingLine').createMany(shippingLinePayload ? shippingLinePayload : [])
            await relatedCustomer?.related('cargoOwner').createMany(cargoOwnerPayload ? cargoOwnerPayload : [])
            await relatedCustomer?.related('serviceType').createMany(serviceTypePayload ? serviceTypePayload : [])
            // contact and billing
            
            const contact = await relatedCustomer?.related('contact').createMany(contactPayload)
            const billing = await relatedCustomer?.related('billing').createMany(billingPayload)
            
            const idContact:string[] = contact ? contact?.map(data => data?.id) : []
            const contact_related = await CustomerContact.query().whereIn("id",idContact)
            contact_related.forEach(async function(contact,index){
                await contact?.related('cabang').createMany(contactCabangPayload.length > 0 ? contactCabangPayload[index] : [])
            })
            // const idBilling:string[] = billing ? billing?.map(data => data?.id) : []
            // const billing_related = await CustomerBilling.query().whereIn("id",idBilling)
            // billing_related.forEach(async function(billing,index){
            //     await billing?.related('paymentType').createMany(paymentTypePayload.length > 0 ? paymentTypePayload[index]: [])
            // })

            let response = {
                message : "success",
                customer_id : data?.id
            }
            return response
        } catch (error) {
            let response = {
                message : "failed",
                detail: error
            }
            
            return response
        }
    }

    private async deleteForUpdate(customer_id:string | null) {
        try {
            // const billing = await CustomerBilling.query().where('customer_id', customer_id)
            // const billingId:string[] = billing.length > 0 ? billing?.map(data => data?.id) : []            
            const usahaPelanggan = await PivotUsahaPelanggan.query().where('customer_id', customer_id ? customer_id : "")
            const mitra = await PivotUsahaMitra.query().where('customer_id', customer_id ? customer_id : "")
            const shippingLine = await PivotShippingLine.query().where('customer_id', customer_id ? customer_id : "")
            const cargoOwner = await PivotCargoOwner.query().where('customer_id', customer_id ? customer_id : "")
            const serviceType = await PivotServiceType.query().where('customer_id', customer_id ? customer_id : "")

            if(usahaPelanggan.length > 0){
                await PivotUsahaPelanggan.query().where('customer_id', customer_id ? customer_id : "").delete()
            }

            if(mitra.length > 0){
                await PivotUsahaMitra.query().where('customer_id', customer_id ? customer_id : "").delete()
            }

            if(shippingLine.length > 0){
                await PivotShippingLine.query().where('customer_id', customer_id ? customer_id : "").delete()
            }

            if(cargoOwner.length > 0){
                await PivotCargoOwner.query().where('customer_id', customer_id ? customer_id : "").delete()
            }

            if(serviceType.length > 0){
                await PivotServiceType.query().where('customer_id', customer_id ? customer_id : "").delete()
            }

            if(usahaPelanggan.length > 0){
                await PivotUsahaPelanggan.query().where('customer_id', customer_id ? customer_id : "").delete()
            }

            await CustomerContact.query().where('customer_id', customer_id ? customer_id : "").delete()
            await CustomerBilling.query().where('customer_id', customer_id ? customer_id : "").delete()
            
            const response = {
                message: "success"
            }

            return response
        } catch (error) {
            const response = {
                message: "failed",
                detail: error
            }

            return response
        }
    }
}

export default new MasterCustomer();