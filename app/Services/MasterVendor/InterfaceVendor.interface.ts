interface VendorInformationPayload {
    id:string,
    kd_vendor: string,
    nm_perusahaan: string,
    no_npwp: string,
    address: string,
    phone: string,
    email: string,
    city_id: string,
    jn_vendor_id: string,
    status: string,
    submitter: string,
    entity_id: string,
    master_type_id: string
    schema_id: string,
    no_request: string,
    reference_id: string,
    created_at: Date,
    updated_at: Date,
}

interface VendorBankAccountPayload {
    account_holder: string,
    nm_bank: string,
    no_rek: string,
    buku_tabungan: string,
}

interface VendorPICPayload {
    nm_pic:string,
    jabatan_pic:string,
    email_pic:string,
    mobile_pic:string,
    file_ktp:string
}

interface VendorDokPendukungPayload {
    surat_pernyataan:string,
    surat_kuasa:string,
    ktp_pemberi_kuasa:string,
    ktp_penerima_kuasa:string    
}

interface VendorIncotermPayload {
    incoterm_1:string,
    incoterm_2:string,
}

interface VendorIjinUsahaPayload {
    no_ijin:string,
    tgl_ijin:Date,
    tgl_berakhir:Date,
    instansi_pemberi:string,
    dok_ijin_usaha:string,
    bidang_usaha:string,
    dok_bidang_usaha:string,
    tipe_ijin:string
}

interface VendorSertifikatBadanUsahaPayload{
    no_sertifikat:string,
    tgl_sertifikat:Date,
    tgl_berakhir:Date,
    penanda_tangan:string,
    link_lpjk:string,
    bidang_usaha:string
}

interface VendorSahamPayload {
    nm_pemegang:string,
    no_ktp:string,
    address:string,
    jml_saham:number
}

interface VendorPengurusPayload {
    nm_pengurus:string,
    no_ktp:string,
    jabatan:string,
    file:string,
}

interface VendorLandasanHukumPayload {
    no_ijin:string,
    tgl_ijin:Date,
    tgl_berakhir:Date,
    nm_notaris:string,
    file:string,
    file_sk_pengesahan:string,
    link_barcode:string,
    tipe_landasan_hukum:string
}

interface VendorPKPPayload {
    no_surat:string,
    tgl_pkp:Date,
    no_npwp:string,
    file_dok_pendukung:string,
    file_pkp:string,
    file_npwp:string   
}

interface VendorSPTPayload {
    tahun:Date,
    tgl_spt:Date,
    no_spt:string,
    file:string,
}

interface VendorNeracaPayload {
    tahun:Date,
    modal:number,
}

interface VendorAuditorPayload {
    auditor:string,
    no_audit:string,
    tgl_audit:Date,
    kesimpulan:string,
    file:string
}

interface VendorAhliPayload {
    nm_ahli:string,
    tgl_lahir_ahli:Date,
    file:string,
}

interface VendorPengalamanPayload {
    nm_pekerjaan:string,
    bidang_jasa:string,
    lokasi:string,
    kategori:string,
    file_spk:string,
    file_ba:string,
}

interface VendorPeralatanPayload {
    jn_alat:string,
    jml_alat:number,
    kapasitas:number,
    merk:string,
    tahun_pembuatan:Date,
    lokasi:string,
    kepemilikan:string,
    file:string
}

interface VendorSertifikatLainPayload {
    nm_sertifikat:string,
    no_sertifikat:string,
    tgl_terbit:Date,
    tgl_berakhir:Date,
    tahun_pembuatan:Date,
    file:string
}

interface VendorDokHistoryPayload {
    jenis:string,
    deskripsi:string,
    file:string
}



export {
    VendorInformationPayload,
    VendorBankAccountPayload,
    VendorPICPayload,
    VendorDokPendukungPayload,
    VendorIncotermPayload,
    VendorIjinUsahaPayload,
    VendorSertifikatBadanUsahaPayload,
    VendorSahamPayload,
    VendorPengurusPayload,
    VendorLandasanHukumPayload,
    VendorPKPPayload,
    VendorSPTPayload,
    VendorNeracaPayload,
    VendorAuditorPayload,
    VendorAhliPayload,
    VendorPengalamanPayload,
    VendorPeralatanPayload,
    VendorSertifikatLainPayload,
    VendorDokHistoryPayload,
};