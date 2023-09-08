import Database from "@ioc:Adonis/Lucid/Database";
import AsetHeader from "App/Models/AsetHeader";

// import {HeaderAset} from './InterfaceAset'
class ActionAset {
    
    // public async createRequestAset (asetHeaderPayload:HeaderAset) {
    //     let asetHeader:HeaderAset = asetHeaderPayload;        
    // }
    public async getAllAset (asetName:String,startDate:String,endDate:String) {
        try {
            const dataAset = await AsetHeader.query()
            .select('id','no_aset','nama_aset','aset_kelas','nama_cabang','tgl_perolehan','hrg_perolehan','akumulasi_penyusutan','nilai_buku','created_at')
            .preload('asetBuktiKepemilikan',(query) => {
                query.select('no_kepemilikan','tgl_kepemilikan','waktu_berlaku','keterangan','fisik_dokumen','scan')
            })
            .preload('asetAsuransi',(query) => {
                query.select('rincian','no_polis','tgl_asuransi','scan_polis','nilai_premi','waktu_keterangan','alasan_tidak_asuransi')
            })
            .preload('asetDetail',(query) => {
                query.select('lokasi','koordinat','kondisi_fisik','tindak_lanjut','merek','tipe','status_perolehan','asuransi','foto_fisik_utuh','foto_dekat')
            })
            .preload('asetDetailPengelolaan',(query) => {
                query.select('status_pengelolaan','bukti_kepemilikan','waktu_berlaku','tgl_kepemilikan','keterangan','fisik_dokumen','scan')
            })
            .preload('asetInformasiPbb',(query) => {
                query.select('no_pbb','nilai_njop','nilai_pbb','tgl_pbb','keterangan')
            })
            .preload('asetInformasiPenyewaan',(query) => {
                query.select('nama_penyewa','no_kontak','perjanjian_awal','perjanjian_akhir')
            })
            .preload('asetKjpp',(query) => {
                query.select('tgl_kjpp','nomor','pelaksana','umur_manfaat','nilai_wajar')
            })
            .preload('asetProsesHukum',(query) => {
                query.select('no_tgl_surat','keterangan','rincian','scan')
            })
            .preload('asetStatusPengelolaan',(query) => {
                query.select('rincian','pihak_menempati')
            })
            .preload('asetUsulanPenghapusan',(query) => {
                query.select('no_tgl_surat','rincian','usulan_penghapusan','keterangan','scan')
            })
            .where((builder) => {
                if(startDate && endDate) {
                    builder.whereBetween('created_at', [stratDate,endDate])
                }

                if(asetName) {
                    builder.where('nama_aset','like', `%${asetName}%`);
                }
            });

            return dataAset
        } catch (error) {
            console.log(error);
            
            return error.message;
        }
    }

    public async getDataAset (id:string) {
        try {
            const dataAset = await AsetHeader.query()
            .preload('asetBuktiKepemilikan')
            .preload('asetAsuransi')
            .preload('asetDetail')
            .preload('asetDetailPengelolaan')
            .preload('asetInformasiPbb')
            .preload('asetInformasiPenyewaan')
            .preload('asetKjpp')
            .preload('asetProsesHukum')
            .preload('asetStatusPengelolaan')
            .preload('asetUsulanPenghapusan')
            .where('id', id)
            .first();            
            
            const buktiKepemilikanPromise = this.separated(dataAset?.asetBuktiKepemilikan);
            const informasiPenyewaanPromise = this.separated(dataAset?.asetInformasiPenyewaan);
            const kjppPromise = this.separated(dataAset?.asetKjpp);

            const [buktiKepemilikan, informasiPenyewaan, kjpp] = await Promise.all([
                buktiKepemilikanPromise,
                informasiPenyewaanPromise,
                kjppPromise,
            ]);
            
            let state:any = {
                asetHeader : dataAset,
                asetBuktiKepemilikan : {
                    detail : buktiKepemilikan['1'],
                    pengelolaan : buktiKepemilikan['2']
                },
                asetAsuransi : dataAset?.asetAsuransi,
                asetDetail : dataAset?.asetDetail,
                asetDetailPengelolaan : dataAset?.asetDetailPengelolaan,
                asetInformasiPbb : dataAset?.asetInformasiPbb,
                asetInformasiPenyewaan : {
                    penyewaanTanah : informasiPenyewaan['1'],
                    penyewaan : informasiPenyewaan['2']
                },
                asetKjpp : {
                    pengelolaan : kjpp['1'],
                    penghapusan : kjpp['2']
                },
                asetProsesHukum : dataAset?.asetProsesHukum,
                asetStatusPengelolaan : dataAset?.asetStatusPengelolaan,
                asetUsulanPenghapusan : dataAset?.asetUsulanPenghapusan
            }
            
            return state;
        } catch (error) {
            return error;
        }
        
    }

    public async updateStatus(id:string, status:string) {
        try {
            const query = `UPDATE "aset_headers" SET "status" = :recent_status WHERE "id" = :id_aset_headers`;
            const updateStatus = await Database.rawQuery(query,{id_aset_headers: id, recent_status: status});
            return updateStatus;
        } catch (error) {
            return error;
        }
    }

    private async separated(array:any) {
        const separatedByType = array.reduce((result:any, item:any) => {
            if (!result[item.tipe]) {
                result[item.tipe] = [];
            }
            result[item.tipe] = item;
            return result;
        }, {});
        
        return separatedByType;
    }
}

export default new ActionAset();