import Database from '@ioc:Adonis/Lucid/Database';
import RequestVendorBankAccount from 'App/Models/RequestVendorBankAccount';
import RequestVendorInformation from 'App/Models/RequestVendorInformation';
import VendorBankAccount from 'App/Models/VendorBankAccount';
import VendorInformation from 'App/Models/VendorInformation';
import { VendorBankAccountPayload, VendorInformationPayload } from 'App/Services/MasterVendor/InterfaceVendor.interface';



class DataManipulationVendor {

    public async createRequestVendor(vendorInfoPayload:VendorInformationPayload,bankAccountPayload:VendorBankAccountPayload[]){
        let vendorInfo:VendorInformationPayload = vendorInfoPayload
        let vendorBankAcc: VendorBankAccountPayload[] = bankAccountPayload
        let result:string = "success" 
        const vendor    =  new RequestVendorInformation()
        const trx = await Database.transaction();
        try {
            const dataVendor    = await vendor.useTransaction(trx).fill(vendorInfo).save()
            const vendorRelated = await RequestVendorInformation.query({client:trx}).where("id",dataVendor?.id).first()
            await vendorRelated?.related('bankAccount').createMany(vendorBankAcc)
            await trx.commit()
            
            return result
        } catch (error) {
            await trx.rollback()
            console.log(error)
            result = "failed"
            return result
        }
    }

    public async updateRequestVendor(idData:string,vendorInfoPayload:VendorInformationPayload,bankAccountPayload:VendorBankAccountPayload[]) {
        let vendorInfo:VendorInformationPayload = vendorInfoPayload
        let vendorBankAcc: VendorBankAccountPayload[] = bankAccountPayload
        let result:string = "success"  
        const id:string = idData

        const vendor      = await RequestVendorInformation.findByOrFail("id",id)

        vendor.nm_perusahaan = vendorInfo.nm_perusahaan
        vendor.kd_vendor = vendorInfo.kd_vendor
        vendor.no_npwp = vendorInfo.no_npwp
        vendor.address = vendorInfo.address
        vendor.phone = vendorInfo.phone
        vendor.email = vendorInfo.email
        vendor.city_id = vendorInfo.city_id
        vendor.jn_vendor_id = vendorInfo.jn_vendor_id
        vendor.status = vendorInfo.status
        vendor.submitter = vendorInfo.submitter
        vendor.reference_id =  vendorInfo.reference_id

        const trx = await Database.transaction();
        try {
            const data = await vendor.useTransaction(trx).save();            
            const vendorRelated = await RequestVendorInformation.query({client:trx}).where("id",data?.id).first();
            await RequestVendorBankAccount.query().useTransaction(trx).where("request_vendor_id",id).delete();
            await vendorRelated?.related('bankAccount').createMany(vendorBankAcc);
            // await bankAccount.useTransaction(trx).merge(vendorBankAcc).save() 

            if (!trx.isCompleted) {
                await trx.commit()
            }

            return result
        } catch (error) {
            await trx.rollback()
            console.log(error)
            result = "failed"
            return result
        }

    }

    public async approveDataVendor(idData:string){
        const [vendor,bankAccount]      = await Promise.all([
         RequestVendorInformation.findByOrFail("id",idData),
         RequestVendorBankAccount.query().where("request_vendor_id",idData)
        ])    
        let result:string = "success"
        let dataBankAccount: VendorBankAccountPayload[] = [];
        const vendorInfoPayload = {
            kd_vendor: vendor.kd_vendor,
            nm_perusahaan: vendor.nm_perusahaan,
            no_npwp: vendor.no_npwp,
            address: vendor.address,
            phone: vendor.phone,
            email: vendor.email,
            city_id: vendor.city_id,
            jn_vendor_id: vendor.jn_vendor_id,
            status: "ACTIVE",
            submitter: vendor.submitter,
            entity_id: vendor.entity_id,
            master_type_id: vendor.master_type_id,
            is_edit: 0,
        }

        bankAccount?.forEach((val)=>{
            dataBankAccount.push({
              nm_bank: val?.nm_bank ? val?.nm_bank : "",
              account_holder: val?.account_holder ? val?.account_holder : "",
              no_rek: val?.no_rek ? val?.no_rek : "",
              buku_tabungan: val?.buku_tabungan ? val?.buku_tabungan : "",
            })
        })
        console.log(dataBankAccount);
        
        const vendorApproved =  new VendorInformation()
        const trx = await Database.transaction();
        try {
            const dataVendor    = await vendorApproved.useTransaction(trx).fill(vendorInfoPayload).save()
            const vendorRelated = await VendorInformation.query({client:trx}).where("id",dataVendor?.id).first()
            await vendorRelated?.related('bankAccount').createMany(dataBankAccount)
            // change status completed data
            vendor.status = "COMPLETED";
            await vendor.useTransaction(trx).save();
            
            await trx.commit()
            
            return result
        } catch (error) {
            await trx.rollback()
            console.log(error)
            result = "failed"
            return result
        }
    }

    public async renewalDataVendor(idData:string){
        const [vendor,bankAccount]      = await Promise.all([
            RequestVendorInformation.findByOrFail("id",idData),
            RequestVendorBankAccount.query().where("request_vendor_id",idData)
           ])    
           let result:string = "success"
           let dataBankAccount: VendorBankAccountPayload[] = [];
           const vendorInfoPayload = {
               kd_vendor: vendor.kd_vendor,
               nm_perusahaan: vendor.nm_perusahaan,
               no_npwp: vendor.no_npwp,
               address: vendor.address,
               phone: vendor.phone,
               email: vendor.email,
               city_id: vendor.city_id,
               jn_vendor_id: vendor.jn_vendor_id,
               status: "ACTIVE",
               submitter: vendor.submitter,
               entity_id: vendor.entity_id,
               master_type_id: vendor.master_type_id,
               is_edit: 0,
           }
   
           bankAccount?.forEach((val)=>{
               dataBankAccount.push({
                 nm_bank: val?.nm_bank ? val?.nm_bank : "",
                 account_holder: val?.account_holder ? val?.account_holder : "",
                 no_rek: val?.no_rek ? val?.no_rek : "",
                 buku_tabungan: val?.buku_tabungan ? val?.buku_tabungan : "",
               })
           })
           console.log(dataBankAccount);
           
           const idVendorActive:string = vendor?.reference_id ? vendor?.reference_id : ""
           const vendorApproved =  await VendorInformation.findBy("id",idVendorActive)
           const trx = await Database.transaction();
           try {
               const dataVendor    = await vendorApproved?.useTransaction(trx).merge(vendorInfoPayload).save()
               const idVendorRelated:string = dataVendor?.id ? dataVendor?.id : "";
               const vendorRelated = await VendorInformation.query({client:trx}).where("id",idVendorRelated).first()
               await VendorBankAccount.query().useTransaction(trx).where("vendor_id",idVendorRelated).delete();
               await vendorRelated?.related('bankAccount').createMany(dataBankAccount)
               // change status completed data
               vendor.status = "COMPLETED";
               await vendor.useTransaction(trx).save();
               
               await trx.commit()
               
               return result
           } catch (error) {
               await trx.rollback()
               console.log(error)
               result = "failed"
               return result
           }
    }
}

export default new DataManipulationVendor();
