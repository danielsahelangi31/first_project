import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import excel from 'exceljs';
import Database from '@ioc:Adonis/Lucid/Database';
import AsetAsuransi from 'App/Models/AsetAsuransi';
import AsetBuktiKepemilikan from 'App/Models/AsetBuktiKepemilikan';
import AsetDetail from 'App/Models/AsetDetail';
import Application from '@ioc:Adonis/Core/Application'
import AsetDetailPengelolaan from 'App/Models/AsetDetailPengelolaan';
import AsetHeader from 'App/Models/AsetHeader';
import AsetInformasiPbb from 'App/Models/AsetInformasiPbb';
import AsetInformasiPenyewaan from 'App/Models/AsetInformasiPenyewaan';
import AsetKjpp from 'App/Models/AsetKjpp';
import AsetProsesHukum from 'App/Models/AsetProsesHukum';
import AsetStatusPengelolaan from 'App/Models/AsetStatusPengelolaan';
import AsetUsulanPenghapusan from 'App/Models/AsetUsulanPenghapusan';
import { v4 as uuidv4 } from "uuid";

// import {HeaderAset} from 'app/Services/MasterAset/InterfaceAset';
import ActionAset from 'App/Services/MasterAset/ActionAset';

export default class MasterAssetsController {
    public async index({view}: HttpContextContract) {
        try {
            let totalData = await Database.rawQuery(`
            SELECT 
            (SELECT COUNT(*) from "aset_headers" WHERE "status" = 'ACTIVE') AS "active",
            (SELECT COUNT(*) from "aset_headers" WHERE "status" = 'INACTIVE') AS "inactive"
            FROM dual
            `)

            let active = totalData[0].active;
            let inactive = totalData[0].inactive;
            
            let aset = await AsetHeader.query()
            .select(
                'id',
                'no_aset',
                'nama_aset',
                'aset_kelas',
                'nama_cabang',
                'tgl_perolehan',
                'hrg_perolehan',
                'nilai_buku',
                'akumulasi_penyusutan',
                'status'
            )
            .orderBy('created_at', 'desc');
            
            return view.render('pages/master_asset/pages/index.edge', {
                aset,
                active,
                inactive
            })
        } catch (error) {
            return error
        }
    }

    public async view({view, params}: HttpContextContract) {
        let id = params.id;        
        try {
            let dataAset = await ActionAset.getDataAset(id);            
        return view.render('pages/master_asset/pages/view.edge', {
            data : dataAset
        });
        } catch (error) {
            return error
        }
    }

    public async create({request, response}: HttpContextContract) {
        let dataAset = request.body();
        dataAset.tgl_perolehan = new Date();
        dataAset.status = "ACTIVE";
        let result = "success insert data asset";
        const aset = new AsetHeader();
        const trx = await Database.transaction();
        try {
            await aset.useTransaction(trx).fill(dataAset).save();
            await trx.commit();
            return response.status(201).send({message: result})
        } catch (error) {
            await trx.rollback();            
            result = "Bad request";
            return response.status(400).send({message: result})
        }

    }

    public async update({request, response}: HttpContextContract) {
        let dataAset = request.body();
        let asetId = await AsetHeader.findBy('no_aset', dataAset.no_aset);

        if(!asetId) {
            return response.status(404).send({message: "No asset not found"});
        }
        
        let result = "Success update data aset";    
        dataAset.aset_detail.header_id = asetId?.id;
        dataAset.aset_bukti_kepemilikan.header_id = asetId?.id;
        dataAset.aset_bukti_kepemilikan.tipe = 1;
        dataAset.aset_bukti_kepemilikan.tgl_kepemilikan = new Date(String(dataAset.aset_bukti_kepemilikan.tgl_kepemilikan));
        dataAset.detail_pengelolaan.header_id = asetId?.id;
        dataAset.detail_pengelolaan.tgl_kepemilikan = new Date(String(dataAset.detail_pengelolaan.tgl_kepemilikan)); 
        dataAset.detail_tindak_lanjut_proses_hukum.header_id = asetId?.id;
        dataAset.detail_status_pengelolaan.header_id = asetId?.id;
        dataAset.detail_informasi_PBB.header_id = asetId?.id;
        dataAset.detail_informasi_PBB.tgl_pbb = new Date(String(dataAset.detail_informasi_PBB.tgl_pbb));
        dataAset.detail_asuransi.header_id = asetId?.id;
        dataAset.detail_informasi_bukti_kepemilikan.header_id = asetId?.id;
        dataAset.usulan_penghapusan.header_id = asetId?.id;
        dataAset.detail_data_kjpp.header_id = asetId?.id;
        dataAset.detail_data_kjpp.id = uuidv4();
        dataAset.detail_data_kjpp.tipe = 1;
        dataAset.detail_data_kjpp.tgl_kjpp = new Date(String(dataAset.detail_data_kjpp.tgl_kjpp));
        dataAset.usulan_hapus_kjpp.header_id = asetId?.id;
        dataAset.usulan_hapus_kjpp.id = uuidv4();
        dataAset.usulan_hapus_kjpp.tipe = 2;
        dataAset.usulan_hapus_kjpp.tgl_kjpp = new Date(String(dataAset.usulan_hapus_kjpp.tgl_kjpp));
        dataAset.detail_informasi_penyewaan_tanah.header_id = asetId?.id;
        dataAset.detail_informasi_penyewaan_tanah.perjanjian_awal = new Date(String(dataAset.detail_informasi_penyewaan_tanah.perjanjian_awal));
        dataAset.detail_informasi_penyewaan_tanah.perjanjian_akhir = new Date(String(dataAset.detail_informasi_penyewaan_tanah.perjanjian_akhir));
        dataAset.detail_informasi_penyewaan_tanah.id = uuidv4();
        dataAset.detail_informasi_penyewaan_tanah.tipe = 1;
        dataAset.detail_informasi_penyewaan.header_id = asetId?.id;
        dataAset.detail_informasi_penyewaan.id = uuidv4();
        dataAset.detail_informasi_penyewaan.tipe = 2;
        dataAset.detail_informasi_penyewaan.perjanjian_awal = new Date(String(dataAset.detail_informasi_penyewaan.perjanjian_awal));
        dataAset.detail_informasi_penyewaan.perjanjian_akhir = new Date(String(dataAset.detail_informasi_penyewaan.perjanjian_akhir));
        dataAset.aset_bukti_kepemilikan.id = uuidv4();
        dataAset.detail_informasi_bukti_kepemilikan.id = uuidv4();
        dataAset.detail_informasi_bukti_kepemilikan.tipe = 2;
        dataAset.detail_informasi_bukti_kepemilikan.tgl_kepemilikan = new Date(String(dataAset.detail_informasi_bukti_kepemilikan.tgl_kepemilikan));
        
        const modelInstances = {
            asetDetail: new AsetDetail(),
            asetKepemilikan: new AsetBuktiKepemilikan(),
            asetPengelolaan: new AsetDetailPengelolaan(),
            asetProsesHukum: new AsetProsesHukum(),
            asetKjpp: new AsetKjpp(),
            asetStatusPengelolaan: new AsetStatusPengelolaan(),
            asetInformasiPenyewaan: new AsetInformasiPenyewaan(),
            asetInformasiPbb: new AsetInformasiPbb(),
            asetDetailAsuransi: new AsetAsuransi(),
            asetUsulanPenghapusan: new AsetUsulanPenghapusan(),
        }
        const trx = await Database.transaction();        
        try {
            await modelInstances.asetDetail.useTransaction(trx).fill(dataAset.aset_detail).save();
            await modelInstances.asetPengelolaan.useTransaction(trx).fill(dataAset.detail_pengelolaan).save();
            await modelInstances.asetProsesHukum.useTransaction(trx).fill(dataAset.detail_tindak_lanjut_proses_hukum).save();
            // await modelInstances.asetKjpp.useTransaction(trx).fill(dataAset.detail_data_kjpp).save();
            await modelInstances.asetStatusPengelolaan.useTransaction(trx).fill(dataAset.detail_status_pengelolaan).save();
            await modelInstances.asetInformasiPbb.useTransaction(trx).fill(dataAset.detail_informasi_PBB).save();
            await modelInstances.asetDetailAsuransi.useTransaction(trx).fill(dataAset.detail_asuransi).save();
            await Database.table("aset_informasi_penyewaan").useTransaction(trx).multiInsert([dataAset.detail_informasi_penyewaan,dataAset.detail_informasi_penyewaan_tanah]);
            // await modelInstances.asetKepemilikan.useTransaction(trx).fill(dataAset.detail_informasi_bukti_kepemilikan).save();
            await Database.table("aset_informasi_bukti_kepemilikan").useTransaction(trx).multiInsert([dataAset.aset_bukti_kepemilikan,dataAset.detail_informasi_bukti_kepemilikan]);
            await modelInstances.asetUsulanPenghapusan.useTransaction(trx).fill(dataAset.usulan_penghapusan).save();
            await Database.table("aset_kjpp").useTransaction(trx).multiInsert([dataAset.detail_data_kjpp,dataAset.usulan_hapus_kjpp]);            
            // await modelInstances.asetKjpp.useTransaction(trx).fill(dataAset.usulan_hapus_kjpp).save();
            // await modelInstances.asetInformasiPenyewaan.useTransaction(trx).fill(dataAset.detail_informasi_penyewaan_tanah).save();
            // await modelInstances.asetInformasiPenyewaan.useTransaction(trx).fill(dataAset.detail_informasi_penyewaan).save();
            await trx.commit();
            return response.status(200).send({message: result});
        } catch (error) {
            await trx.rollback()
            console.log(error);
            
            result = "failed update data asset";
            return response.status(400).send({message: result});
        }
    }

    public async updateStatus({params, request}: HttpContextContract) {
        const id = params.id;
        const status = request.input('status');        
        try {
            await ActionAset.updateStatus(id, status);
        } catch (error) {
            return error;
        }
    }

    public async createExcelData({response}: HttpContextContract) {
        const workbook = new excel.Workbook();
        workbook.creator = 'PT Pelabuhan Indonesia (Persero)';
        const worksheet = workbook.addWorksheet("Data Aset");

        worksheet.columns = [
            { header:'No Aset', key:"no_aset", width : 37},
            { header:'Nama Aset', key:"nama_aset", width: 37},
            { header:'Aset Kelas', key:"aset_kelas", width: 37},
            { header:'Cabang', key:"cabang", width: 37},
            { header:'Tanggal Perolehan', key:"tanggal_perolehan", width: 37},
            { header:'Harga Perolehan', key:"harga_perolehan", width: 37},
            { header:'Akumulasi Penyusutan', key:"akumulasi_penyusutan", width: 37},
            { header:'Nilai Buku', key:"nilai_buku", width: 37},
        ];

        let cellArr:any = ['A','B','C','D','E','F','G','H'];
        for (let index = 0; index < cellArr.length; index++) {
            worksheet.getCell(cellArr[index] + '1').border = {
                top: {style:'double', color: {argb:'000000'}},
                left: {style:'double', color: {argb:'000000'}},
                bottom: {style:'double', color: {argb:'000000'}},
                right: {style:'double', color: {argb:'000000'}}
            };
        };

        let asetArray:any = [];
        const aset = await AsetHeader.query().where('status','ACTIVE');
        aset.forEach(function(aset) {
            asetArray.push({
                no_aset: aset?.no_aset,
                nama_aset: aset?.nama_aset,
                aset_kelas: aset?.aset_kelas,
                cabang: aset?.nama_cabang,
                tanggal_perolehan: aset?.tgl_perolehan,
                harga_perolehan: aset?.hrg_perolehan,
                akumulasi_penyusutan: aset?.akumulasi_penyusutan,
                nilai_buku: aset?.nilai_buku,
            });
        });

        asetArray.forEach(function(aset){
            worksheet.addRow({
                no_aset: aset?.no_aset,
                nama_aset: aset?.nama_aset,
                aset_kelas: aset?.aset_kelas,
                cabang: aset?.cabang,
                tanggal_perolehan: aset?.tanggal_perolehan,
                harga_perolehan: aset?.harga_perolehan,
                akumulasi_penyusutan: aset?.akumulasi_penyusutan,
                nilai_buku: aset?.nilai_buku,
            });
        });
        await workbook.xlsx.writeFile('public/media/template_excel_master/data_master_aset.xlsx');
        const filePath = Application.publicPath('media/template_excel_master/data_master_aset.xlsx');
        return response.download(filePath);
    }
    
}
