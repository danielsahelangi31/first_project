import Database from "@ioc:Adonis/Lucid/Database";
import VendorInformation from "App/Models/VendorInformation";
import { 
    VendorAhliPayload, VendorAuditorPayload, VendorBankAccountPayload, VendorDokHistoryPayload, VendorDokPendukungPayload, VendorIjinUsahaPayload, 
    VendorIncotermPayload,VendorInformationPayload, VendorLandasanHukumPayload, VendorNeracaPayload, VendorPICPayload,
    VendorPKPPayload, VendorPengalamanPayload, VendorPengurusPayload, VendorPeralatanPayload, VendorSPTPayload, 
    VendorSahamPayload, VendorSertifikatBadanUsahaPayload, VendorSertifikatLainPayload 
} from "./InterfaceVendor.interface";

class IntegrationVendor {
    /**
     * createDataVendor
     */
    public async createDataVendor(
        vendorInfoPayload:VendorInformationPayload,
        bankAccountPayload:VendorBankAccountPayload[],
        picPayload:VendorPICPayload[],
        incotermPayload:VendorIncotermPayload,
        ijinUsahaPayload:VendorIjinUsahaPayload[],
        sertifikasiBadanUsahaPayload:VendorSertifikatBadanUsahaPayload[],
        sahamPayload:VendorSahamPayload[],
        pengurusPayload:VendorPengurusPayload[],
        landasanHukumPayload:VendorLandasanHukumPayload[],
        dokPendukungPayload:VendorDokPendukungPayload,
        SPTPayload:VendorSPTPayload[],
        PKPPayload:VendorPKPPayload,
        neracaPayload:VendorNeracaPayload[],
        auditPayload:VendorAuditorPayload[],
        ahliPayload:VendorAhliPayload[],
        pengalamanPayload:VendorPengalamanPayload[],
        peralatanPayload:VendorPeralatanPayload[],
        sertifikatLainPayload:VendorSertifikatLainPayload[],
        dokHistoryPayload:VendorDokHistoryPayload[]
    ) {
        const vendorInfo = new VendorInformation();

        vendorInfo.kd_vendor = vendorInfoPayload.kd_vendor;
        vendorInfo.nm_perusahaan = vendorInfoPayload.nm_perusahaan;
        vendorInfo.no_npwp = vendorInfoPayload.no_npwp;
        vendorInfo.address = vendorInfoPayload.address;
        vendorInfo.phone = vendorInfoPayload.phone;
        vendorInfo.email = vendorInfoPayload.email;
        vendorInfo.city_id = vendorInfoPayload.city_id;
        vendorInfo.jn_vendor_id = vendorInfoPayload.jn_vendor_id;
        vendorInfo.status = vendorInfoPayload.status;
        vendorInfo.master_type_id = vendorInfoPayload.master_type_id;
        vendorInfo.submitter = vendorInfoPayload.submitter;
        vendorInfo.entity_id = vendorInfoPayload.entity_id;
        vendorInfo.schema_id = vendorInfoPayload.schema_id;
        vendorInfo.is_edit = 0;


        const trx = await Database.transaction();
        try {
            const vendorActive = await vendorInfo.useTransaction(trx).save();
            const vendorRelated = await VendorInformation.query({client:trx}).where("id",vendorActive?.id).first();
            // data umum
            await vendorRelated?.related('bankAccount').createMany(bankAccountPayload);
            // await vendorRelated?.related('pic').createMany(picPayload);
            // await vendorRelated?.related('incoterm').create(incotermPayload);
            // await vendorRelated?.related('dokPendukung').create(dokPendukungPayload);
            // await vendorRelated?.related('ijinUsaha').createMany(ijinUsahaPayload);
            // await vendorRelated?.related('landasanHukum').createMany(landasanHukumPayload)
            // await vendorRelated?.related('sertifikatBadanUsaha').createMany(sertifikasiBadanUsahaPayload)
            // await vendorRelated?.related('kepemilikanSaham').createMany(sahamPayload);
            // await vendorRelated?.related('pengurusPerusahaan').createMany(pengurusPayload);
            // // data perpajakan
            // await vendorRelated?.related('pkp').create(PKPPayload);
            // await vendorRelated?.related('spt').createMany(SPTPayload); 
            // await vendorRelated?.related('neraca').createMany(neracaPayload); 
            // await vendorRelated?.related('auditor').createMany(auditPayload); 
            // // data teknis
            // await vendorRelated?.related('tenagaAhli').createMany(ahliPayload);
            // await vendorRelated?.related('pengalaman').createMany(pengalamanPayload); 
            // await vendorRelated?.related('peralatan').createMany(peralatanPayload); 
            // await vendorRelated?.related('sertifikatLain').createMany(sertifikatLainPayload); 
            // // data historis dokumen
            // await vendorRelated?.related('historyDokumen').createMany(dokHistoryPayload); 

            await trx.commit();

            if(trx.isCompleted) {
                return true;
            } else {
                return false;
            };
        } catch (error) {
            console.log(error)
            await trx.rollback();
            return false
        }
    }

}

export default new IntegrationVendor();