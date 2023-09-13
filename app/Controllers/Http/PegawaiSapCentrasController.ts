import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import CauseOfDeath from 'App/Models/CauseOfDeath';
import CutiSppd from 'App/Models/CutiSppd';
import Disability from 'App/Models/Disability';
import PelaksanaHarian from 'App/Models/PelaksanaHarian';
import SafmPegawai from 'App/Models/SafmPegawai';
import SafmPegawaiAction from 'App/Models/SafmPegawaiAction';
import SafmPegawaiAddress from 'App/Models/SafmPegawaiAddress';
import SafmPegawaiDiscipline from 'App/Models/SafmPegawaiDiscipline';
import SafmPegawaiEducation from 'App/Models/SafmPegawaiEducation';
import SafmPegawaiFamily from 'App/Models/SafmPegawaiFamily';
import SafmPegawaiPreviousEmployment from 'App/Models/SafmPegawaiPreviousEmployment';
import SafmPegawaiSecondAssignment from 'App/Models/SafmPegawaiSecondAssignment';
import SafmPerubahanOrganisasi from 'App/Models/SafmPerubahanOrganisasi';
import SafmStrukturOrganisasi from 'App/Models/SafmStrukturOrganisasi';
import Parser from "App/Util/parser";

export default class PegawaiSapCentrasController {
    
    public async insertPegawaiNew({ request, auth }: HttpContextContract) {
        
        await auth.use('api').authenticate();
        
        try {
            let payload = await Parser.convertXMLToJSON(request.raw());
            
            // cek apakah payload yang diterima sesuai dengan servisnya
            for(let i = 1; i < Object.keys(payload).length; i++) {
                if(!SafmPegawai.$hasColumn(String(Object.keys(payload)[i]).toLowerCase())) {
                    throw new Error("Data tidak valid");
                }
            }

            let action = 'either insert & update';
            let saved: boolean[] = [];
            let inserted = false, updated = false;
            const pernr = [...new Set(payload.PERNR.map(item => item))];
            const company_code = [...new Set(payload.COMPANY_CODE.map(item => item))];
            const pernrLength = Object.keys(payload.PERNR).length;

            for(let i = 0; i < pernrLength; i++) {
                const data = await SafmPegawai.query()
                                    .where('pernr', String(payload.PERNR[i]))
                                    .andWhere('company_code', String(payload.COMPANY_CODE[i]));
    
                if(data.length == 0) {
                    // insert
                    var insert = new SafmPegawai();
                    if('COMPANY_CODE' in payload) insert.pernr = String(payload.PERNR[i] == undefined ? '' : payload.PERNR[i]);
                    if('COMPANY_CODE' in payload) insert.company_code = String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                    if('CNAME' in payload) insert.cname = String(payload.CNAME[i] == undefined ? '' : payload.CNAME[i]);
                    if('PNALT' in payload) insert.pnalt = String(payload.PNALT[i] == undefined ? '' : payload.PNALT[i]);
                    if('GESCH' in payload) insert.gesch = String(payload.GESCH[i] == undefined ? '' : payload.GESCH[i]);
                    if('GENDE' in payload) insert.gende = String(payload.GENDE[i] == undefined ? '' : payload.GENDE[i]);
                    if('GBORT' in payload) insert.gbort = String(payload.GBORT[i] == undefined ? '' : payload.GBORT[i]);
                    if('GBDAT' in payload) {
                        if(payload.GBDAT[i] != undefined) insert.gbdat = new Date(String(payload.GBDAT[i]));
                    }
                    if('FAMST' in payload) insert.famst = String(payload.FAMST[i] == undefined ? '' : payload.FAMST[i]);
                    if('FATXT' in payload) insert.fatxt = String(payload.FATXT[i] == undefined ? '' : payload.FATXT[i]);
                    if('ICNUM' in payload) insert.icnum = String(payload.ICNUM[i] == undefined ? '' : payload.ICNUM[i]);
                    if('TAXID' in payload) insert.taxid = String(payload.TAXID[i] == undefined ? '' : payload.TAXID[i]);
                    if('MARRD' in payload) insert.marrd = String(payload.MARRD[i] == undefined ? '' : payload.MARRD[i]);
                    if('DEPND' in payload) insert.depnd = String(payload.DEPND[i] == undefined ? '' : payload.DEPND[i]);
                    if('OFFICMAIL' in payload) insert.officmail = String(payload.OFFICMAIL[i] == undefined ? '' : payload.OFFICMAIL[i]);
                    if('PHNUMBER' in payload) insert.phnumber = String(payload.PHNUMBER[i] == undefined ? '' : payload.PHNUMBER[i]);
                    insert.program_name = 'WS MDM';
                    insert.kd_aktif = 'A';
                    if('PNALT_NEW' in payload) insert.pnalt_new = String(payload.PNALT_NEW[i] == undefined ? '' : payload.PNALT_NEW[i]);
                    if('PAYSCALETYPE' in payload) insert.payscaletype = String(payload.PAYSCALETYPE[i] == undefined ? '' : payload.PAYSCALETYPE[i]);
                    if('PAYSCALETYPETEXT' in payload) insert.payscaletypetext = String(payload.PAYSCALETYPETEXT[i] == undefined ? '' : payload.PAYSCALETYPETEXT[i]);
                    if('PAYROLLAREA' in payload) insert.payrollarea = String(payload.PAYROLLAREA[i] == undefined ? '' : payload.PAYROLLAREA[i]);
                    if('PAYROLLAREATEXT' in payload) insert.payrollareatext = String(payload.PAYROLLAREATEXT[i] == undefined ? '' : payload.PAYROLLAREATEXT[i]);
                    if('CONTRACTTYPE' in payload) insert.contracttype = String(payload.CONTRACTTYPE[i] == undefined ? '' : payload.CONTRACTTYPE[i]);
                    if('CONTRACTTYPETEXT' in payload) insert.contracttypetext = String(payload.CONTRACTTYPETEXT[i] == undefined ? '' : payload.CONTRACTTYPETEXT[i]);
                    if('BLOODTYPE' in payload) insert.bloodtype = String(payload.BLOODTYPE[i] == undefined ? '' : payload.BLOODTYPE[i]);
                    if('SOCIALMEDIA' in payload) insert.socialmedia = String(payload.SOCIALMEDIA[i] == undefined ? '' : payload.SOCIALMEDIA[i]);
                    if('RELIGION' in payload) insert.religion = String(payload.RELIGION[i] == undefined ? '' : payload.RELIGION[i]);
                    if('RELIGIONTEXT' in payload) insert.religiontext = String(payload.RELIGIONTEXT[i] == undefined ? '' : payload.RELIGIONTEXT[i]);
                    if('TMTMULAIBEKERJA' in payload) {
                        if(payload.TMTMULAIBEKERJA[i] != undefined) insert.tmtmulaibekerja = new Date(String(payload.TMTMULAIBEKERJA[i]));
                    }
                    if('TMTDIANGKATPEGAWAI' in payload) {
                        if(payload.TMTDIANGKATPEGAWAI[i] != undefined) insert.tmtdiangkatpegawai = new Date(String(payload.TMTDIANGKATPEGAWAI[i]));
                    }
                    if('TMTKELASJABATAN' in payload) {
                        if(payload.TMTKELASJABATAN[i] != undefined) insert.tmtkelasjabatan = new Date(String(payload.TMTKELASJABATAN[i]));
                    }
                    if('TMTJABATAN' in payload) {
                        if(payload.TMTJABATAN[i] != undefined) insert.tmtjabatan = new Date(String(payload.TMTJABATAN[i]));
                    }
                    if('TMTPENSIUN' in payload) {
                        if(payload.TMTPENSIUN[i] != undefined) insert.tmtpensiun = new Date(String(payload.TMTPENSIUN[i]));
                    }
                    if('BPJSKETENAGAKERJAAN' in payload) insert.bpjsketenagakerjaan = String(payload.BPJSKETENAGAKERJAAN[i] == undefined ? '' : payload.BPJSKETENAGAKERJAAN[i]);
                    if('BPJSKESEHATAN' in payload) insert.bpjskesehatan = String(payload.BPJSKESEHATAN[i] == undefined ? '' : payload.BPJSKESEHATAN[i]);
                    if('TANGGUNGAN' in payload) insert.tanggungan = String(payload.TANGGUNGAN[i] == undefined ? '' : payload.TANGGUNGAN[i]);
                    if('PASSPOR' in payload) insert.passpor = String(payload.PASSPOR[i] == undefined ? '' : payload.PASSPOR[i]);
                    if('PRIVATEMAIL' in payload) insert.privatemail = String(payload.PRIVATEMAIL[i] == undefined ? '' : payload.PRIVATEMAIL[i]);
                    if('TITLE' in payload) insert.title = String(payload.TITLE[i] == undefined ? '' : payload.TITLE[i]);
                    if('TITLE2' in payload) insert.title2 = String(payload.TITLE2[i] == undefined ? '' : payload.TITLE2[i]);
                    if('ADDTITLE' in payload) insert.addtitle = String(payload.ADDTITLE[i] == undefined ? '' : payload.ADDTITLE[i]);
                    if('ETHNICITY' in payload) insert.ethnicity = String(payload.ETHNICITY[i] == undefined ? '' : payload.ETHNICITY[i]);
                    if('TMT_GOLONGAN' in payload) {
                        if(payload.TMT_GOLONGAN[i] != undefined) insert.tmt_golongan = new Date(String(payload.TMT_GOLONGAN[i]));
                    }
                    if('JENIS_PEKERJA' in payload) insert.jenis_pekerja = String(payload.JENIS_PEKERJA[i] == undefined ? '' : payload.JENIS_PEKERJA[i]); 
                    if('CREATED_BY' in payload) insert.created_by = String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                    if('LAST_UPDATED_BY' in payload) insert.last_updated_by = String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);
                    await insert.save();
    
                    if(insert.$isPersisted) saved.push(true);
                    inserted = true;
                } else { 
                    // update
                    const param = {};

                    if('COMPANY_CODE' in payload) param['company_code'] = String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                    if('CNAME' in payload) param['cname'] = String(payload.CNAME[i] == undefined ? '' : payload.CNAME[i]);
                    if('PNALT' in payload) param['pnalt'] = String(payload.PNALT[i] == undefined ? '' : payload.PNALT[i]);
                    if('GESCH' in payload) param['gesch'] = String(payload.GESCH[i] == undefined ? '' : payload.GESCH[i]);
                    if('GENDE' in payload) param['gende'] = String(payload.GENDE[i] == undefined ? '' : payload.GENDE[i]);
                    if('GBORT' in payload) param['gbort'] = String(payload.GBORT[i] == undefined ? '' : payload.GBORT[i]);
                    if('GBDAT' in payload) {
                        if(payload.GBDAT[i] != undefined) param['gbdat'] = new Date(String(payload.GBDAT[i]));
                    }
                    if('FAMST' in payload) param['famst'] = String(payload.FAMST[i] == undefined ? '' : payload.FAMST[i]);
                    if('FATXT' in payload) param['fatxt'] = String(payload.FATXT[i] == undefined ? '' : payload.FATXT[i]);
                    if('ICNUM' in payload) param['icnum'] = String(payload.ICNUM[i] == undefined ? '' : payload.ICNUM[i]);
                    if('TAXID' in payload) param['taxid'] = String(payload.TAXID[i] == undefined ? '' : payload.TAXID[i]);
                    if('MARRD' in payload) param['marrd'] = String(payload.MARRD[i] == undefined ? '' : payload.MARRD[i]);
                    if('DEPND' in payload) param['depnd'] = String(payload.DEPND[i] == undefined ? '' : payload.DEPND[i]);
                    if('OFFICMAIL' in payload) param['officmail'] = String(payload.OFFICMAIL[i] == undefined ? '' : payload.OFFICMAIL[i]);
                    if('PHNUMBER' in payload) param['phnumber'] = String(payload.PHNUMBER[i] == undefined ? '' : payload.PHNUMBER[i]);
                    param['program_name'] = 'WS MDM';
                    param['kd_aktif'] = 'A';
                    if('PNALT_NEW' in payload) param['pnalt_new'] = String(payload.PNALT_NEW[i] == undefined ? '' : payload.PNALT_NEW[i]);
                    if('PAYSCALETYPE' in payload) param['payscaletype'] = String(payload.PAYSCALETYPE[i] == undefined ? '' : payload.PAYSCALETYPE[i]);
                    if('PAYSCALETYPETEXT' in payload) param['payscaletypetext'] = String(payload.PAYSCALETYPETEXT[i] == undefined ? '' : payload.PAYSCALETYPETEXT[i]);
                    if('PAYROLLAREA' in payload) param['payrollarea'] = String(payload.PAYROLLAREA[i] == undefined ? '' : payload.PAYROLLAREA[i]);
                    if('PAYROLLAREATEXT' in payload) param['payrollareatext'] = String(payload.PAYROLLAREATEXT[i] == undefined ? '' : payload.PAYROLLAREATEXT[i]);
                    if('CONTRACTTYPE' in payload) param['contracttype'] = String(payload.CONTRACTTYPE[i] == undefined ? '' : payload.CONTRACTTYPE[i]);
                    if('CONTRACTTYPETEXT' in payload) param['contracttypetext'] = String(payload.CONTRACTTYPETEXT[i] == undefined ? '' : payload.CONTRACTTYPETEXT[i]);
                    if('BLOODTYPE' in payload) param['bloodtype'] = String(payload.BLOODTYPE[i] == undefined ? '' : payload.BLOODTYPE[i]);
                    if('SOCIALMEDIA' in payload) param['socialmedia'] = String(payload.SOCIALMEDIA[i] == undefined ? '' : payload.SOCIALMEDIA[i]);
                    if('RELIGION' in payload) param['religion'] = String(payload.RELIGION[i] == undefined ? '' : payload.RELIGION[i]);
                    if('RELIGIONTEXT' in payload) param['religiontext'] = String(payload.RELIGIONTEXT[i] == undefined ? '' : payload.RELIGIONTEXT[i]);
                    if('TMTMULAIBEKERJA' in payload) {
                        if(payload.TMTMULAIBEKERJA[i] != undefined) param['tmtmulaibekerja'] = new Date(String(payload.TMTMULAIBEKERJA[i]));
                    }
                    if('TMTDIANGKATPEGAWAI' in payload) {
                        if(payload.TMTDIANGKATPEGAWAI[i] != undefined) param['tmtdiangkatpegawai'] = new Date(String(payload.TMTDIANGKATPEGAWAI[i]));
                    }
                    if('TMTKELASJABATAN' in payload) {
                        if(payload.TMTKELASJABATAN[i] != undefined) param['tmtkelasjabatan'] = new Date(String(payload.TMTKELASJABATAN[i]));
                    }
                    if('TMTJABATAN' in payload) {
                        if(payload.TMTJABATAN[i] != undefined) param['tmtjabatan'] = new Date(String(payload.TMTJABATAN[i]));
                    }
                    if('TMTPENSIUN' in payload) {
                        if(payload.TMTPENSIUN[i] != undefined) param['tmtpensiun'] = new Date(String(payload.TMTPENSIUN[i]));
                    }
                    if('BPJSKETENAGAKERJAAN' in payload) param['bpjsketenagakerjaan'] = String(payload.BPJSKETENAGAKERJAAN[i] == undefined ? '' : payload.BPJSKETENAGAKERJAAN[i]);
                    if('BPJSKESEHATAN' in payload) param['bpjskesehatan'] = String(payload.BPJSKESEHATAN[i] == undefined ? '' : payload.BPJSKESEHATAN[i]);
                    if('TANGGUNGAN' in payload) param['tanggungan'] = String(payload.TANGGUNGAN[i] == undefined ? '' : payload.TANGGUNGAN[i]);
                    if('PASSPOR' in payload) param['passpor'] = String(payload.PASSPOR[i] == undefined ? '' : payload.PASSPOR[i]);
                    if('PRIVATEMAIL' in payload) param['privatemail'] = String(payload.PRIVATEMAIL[i] == undefined ? '' : payload.PRIVATEMAIL[i]);
                    if('TITLE' in payload) param['title'] = String(payload.TITLE[i] == undefined ? '' : payload.TITLE[i]);
                    if('TITLE2' in payload) param['title2'] = String(payload.TITLE2[i] == undefined ? '' : payload.TITLE2[i]);
                    if('ADDTITLE' in payload) param['addtitle'] = String(payload.ADDTITLE[i] == undefined ? '' : payload.ADDTITLE[i]);
                    if('ETHNICITY' in payload) param['ethnicity'] = String(payload.ETHNICITY[i] == undefined ? '' : payload.ETHNICITY[i]);
                    if('TMT_GOLONGAN' in payload) {
                        if(payload.TMT_GOLONGAN[i] != undefined) param['tmt_golongan'] = new Date(String(payload.TMT_GOLONGAN[i]));
                    }
                    if('JENIS_PEKERJA' in payload) param['jenis_pekerja'] = String(payload.JENIS_PEKERJA[i] == undefined ? '' : payload.JENIS_PEKERJA[i]); 
                    if('CREATED_BY' in payload) param['created_by'] = String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                    if('LAST_UPDATED_BY' in payload) param['last_updated_by'] = String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);

                    await SafmPegawai.query()
                        .where('pernr', String(payload.PERNR[i]))
                        .andWhere('company_code', String(payload.COMPANY_CODE[i]))
                        .update(param)
                    
                    saved.push(true);
                    updated = true;
                }
            }

            if(inserted && updated) {
                action = "insert & update"
            } else if (inserted || updated) {
                action = inserted ? 'insert' : 'update';
            }
            

            if(saved.length == pernrLength) {
                const respon = {
                    status_code : 200,
                    message : `Success to ${action} pegawai new`,
                    pernr: String(pernr),
                    company_code: String(company_code)
                }
    
                return respon;
            } else {
                throw new Error(`Fail to ${action} pegawai new`);
            }

        } catch (error) {
            const respon = {
                status_code : 500,
                message : String(error)
            }

            return respon;
        }

    }


    public async insertPegawaiSecondaryAssignment({ request, auth }: HttpContextContract) {

        await auth.use('api').authenticate();
        
        try {
            let payload = await Parser.convertXMLToJSON(request.raw());

            // cek apakah payload yang diterima sesuai dengan servisnya
            for(let i = 1; i < Object.keys(payload).length; i++) {
                if(!SafmPegawaiSecondAssignment.$hasColumn(String(Object.keys(payload)[i]).toLowerCase())) {
                    throw new Error("Data tidak valid");
                }
            }
            
            let action = 'either insert & update';
            let saved: boolean[] = [];
            let inserted = false, updated = false;
            const pernr = [...new Set(payload.PERNR.map(item => item))];
            const company_code = [...new Set(payload.COMPANY_CODE.map(item => item))];
            const pernrLength = Object.keys(payload.PERNR).length;
            
            for(let i = 0; i < pernrLength; i++) {
                const exist = await Database.from('safm_pegawai_second_assignment')
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]));
                if(exist.length != 0) {
                    updated = true;
                } else {
                    inserted = true;
                }
            }

            for(let i = 0; i < pernrLength; i++) {
                const exist = await Database.from('safm_pegawai_second_assignment')
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]));
                if(exist.length != 0) {
                    await Database.from('safm_pegawai_second_assignment')
                        .where('pernr', String(payload.PERNR[i]))
                        .andWhere('company_code', String(payload.COMPANY_CODE[i]))
                        .delete();
                }
            }

            for(let i = 0; i < pernrLength; i++) {
                const insert = new SafmPegawaiSecondAssignment();
                insert.pernr = String(payload.PERNR[i] == undefined ? '' : payload.PERNR[i]);
                if('COMPANY_CODE' in payload) insert.company_code = String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                if('BEGDA' in payload) {
                    if(payload.BEGDA[i] != undefined) insert.begda = new Date(String(payload.BEGDA[i]));
                }
                if('ENDDA' in payload) {
                    if(payload.ENDDA[i] != undefined) insert.endda = new Date(String(payload.ENDDA[i]));
                }
                if('CNAME' in payload) insert.cname = String(payload.CNAME[i] == undefined ? '' : payload.CNAME[i]);
                if('MASSN' in payload) insert.massn = String(payload.MASSN[i] == undefined ? '' : payload.MASSN[i]);
                if('MNTXT' in payload) insert.mntxt = String(payload.MNTXT[i] == undefined ? '' : payload.MNTXT[i]);
                if('MASSG' in payload) insert.massg = String(payload.MASSG[i] == undefined ? '' : payload.MASSG[i]);
                if('MGTXT' in payload) insert.mgtxt = String(payload.MGTXT[i] == undefined ? '' : payload.MGTXT[i]);
                if('SOBID' in payload) insert.sobid = String(payload.SOBID[i] == undefined ? '' : payload.SOBID[i]);
                if('NAMA_JABATAN' in payload) insert.nama_jabatan = String(payload.NAMA_JABATAN[i] == undefined ? '' : payload.NAMA_JABATAN[i]);
                if('DOC_TYPE' in payload) insert.doc_type = String(payload.DOC_TYPE[i] == undefined ? '' : payload.DOC_TYPE[i]);
                if('STEXT' in payload) insert.stext = String(payload.STEXT[i] == undefined ? '' : payload.STEXT[i]);
                if('ISSUE_DATE' in payload) {
                    if(payload.ISSUE_DATE[i] != undefined) insert.issue_date = new Date(String(payload.ISSUE_DATE[i]));
                }
                if('EFFECTIVE_DATE' in payload) {
                    if(payload.EFFECTIVE_DATE[i] != undefined) insert.effective_date = new Date(String(payload.EFFECTIVE_DATE[i]));
                }
                if('PERSA' in payload) insert.persa = String(payload.PERSA[i] == undefined ? '' : payload.PERSA[i]);
                if('PBTXT' in payload) insert.pbtxt = String(payload.PBTXT[i] == undefined ? '' : payload.PBTXT[i]);
                if('BTRTL' in payload) insert.btrtl = String(payload.BTRTL[i] == undefined ? '' : payload.BTRTL[i]);
                if('LGTXT' in payload) insert.lgtxt = String(payload.LGTXT[i] == undefined ? '' : payload.LGTXT[i]);
                if('PERSG' in payload) insert.persg = String(payload.PERSG[i] == undefined ? '' : payload.PERSG[i]);
                if('PGTXT' in payload) insert.pgtxt = String(payload.PGTXT[i] == undefined ? '' : payload.PGTXT[i]);
                if('PERSK' in payload) insert.persk = String(payload.PERSK[i] == undefined ? '' : payload.PERSK[i]);
                if('PKTXT' in payload) insert.pktxt = String(payload.PKTXT[i] == undefined ? '' : payload.PKTXT[i]);
                if('ORGID' in payload) insert.orgid = String(payload.ORGID[i] == undefined ? '' : payload.ORGID[i]);
                if('NAMA_ORG' in payload) insert.nama_org = String(payload.NAMA_ORG[i] == undefined ? '' : payload.NAMA_ORG[i]);
                if('GENERAL_TEXTORG' in payload) insert.general_textorg = String(payload.GENERAL_TEXTORG[i] == undefined ? '' : payload.GENERAL_TEXTORG[i]);
                if('DIREKTORAT' in payload) insert.direktorat = String(payload.DIREKTORAT[i] == undefined ? '' : payload.DIREKTORAT[i]);
                if('DIREKTORAT_TEXT' in payload) insert.direktorat_text = String(payload.DIREKTORAT_TEXT[i] == undefined ? '' : payload.DIREKTORAT_TEXT[i]);
                if('SUBDIT' in payload) insert.subdit = String(payload.SUBDIT[i] == undefined ? '' : payload.SUBDIT[i]);
                if('SUBDIT_TEXT' in payload) insert.subdit_text = String(payload.SUBDIT_TEXT[i] == undefined ? '' : payload.SUBDIT_TEXT[i]);
                if('SEKSI' in payload) insert.seksi = String(payload.SEKSI[i] == undefined ? '' : payload.SEKSI[i]);
                if('SEKSI_TEXT' in payload) insert.seksi_text = String(payload.SEKSI_TEXT[i] == undefined ? '' : payload.SEKSI_TEXT[i]);
                if('SUBSEKSI' in payload) insert.subseksi = String(payload.SUBSEKSI[i] == undefined ? '' : payload.SUBSEKSI[i]);
                if('SUBSEKSI_TEXT' in payload) insert.subseksi_text = String(payload.SUBSEKSI_TEXT[i] == undefined ? '' : payload.SUBSEKSI_TEXT[i]);
                if('TRAVEL_CCTR' in payload) insert.travel_cctr = String(payload.TRAVEL_CCTR[i] == undefined ? '' : payload.TRAVEL_CCTR[i]);
                if('TRFAR' in payload) insert.trfar = String(payload.TRFAR[i] == undefined ? '' : payload.TRFAR[i]);
                if('TARTX' in payload) insert.tartx = String(payload.TARTX[i] == undefined ? '' : payload.TARTX[i]);
                if('SELESAI_PENUGASAN' in payload) {
                    if(payload.SELESAI_PENUGASAN[i] != undefined) insert.selesai_penugasan = new Date(String(payload.SELESAI_PENUGASAN[i]));
                }
                if('DOC_NUMBER' in payload) insert.doc_number = String(payload.DOC_NUMBER[i] == undefined ? '' : payload.DOC_NUMBER[i]);
                if('CREATED_BY' in payload) insert.created_by = String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                if('LAST_UPDATED_BY' in payload) insert.last_updated_by = String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);
                await insert.save();

                if(insert.$isPersisted) saved.push(true);
            }

            if(inserted && updated) {
                action = 'insert & update';
            } else if(inserted || updated) {
                action = inserted ? 'insert' : 'update';
            }
            
            if(saved.length == pernrLength) {
                const respon = {
                    status_code : 200,
                    message : `Success to ${action} Pegawai Secondary Assignment`,
                    pernr : String(pernr),
                    company_code : String(company_code)
                }

                return respon;
            } else {
                throw new Error(`Fail to ${action} Pegawai Secodary Assignment`);
            }

        } catch(error) {
            const respon = {
                status_code : 500,
                message : String(error)
            }

            return respon;
        }

    }


    public async insertPegawaiAction({ request, auth }: HttpContextContract) {
        
        await auth.use('api').authenticate();
        
        try {
            const payload = await Parser.convertXMLToJSON(request.raw());

            // cek apakah payload yang diterima sesuai dengan servisnya
            for(let i = 1; i < Object.keys(payload).length; i++) {
                if(!SafmPegawaiAction.$hasColumn(String(Object.keys(payload)[i]).toLowerCase())) {
                    throw new Error("Data tidak valid");
                }
            }

            let action = 'either insert & update';
            let saved: boolean[] = [];  
            let inserted = false, updated = false;
            const pernr = [...new Set(payload.PERNR.map(item => item))];
            const company_code = [...new Set(payload.COMPANY_CODE.map(item => item))];
            const pernrLength = Object.keys(payload.PERNR).length;
            
            for(let i = 0; i < pernrLength; i++) {
                const exist = await SafmPegawaiAction.query()
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]));
                if(exist.length != 0) {
                    updated = true;
                } else {
                    inserted = true;
                }
            }

            for(let i = 0; i < pernrLength; i++) {
                const exist = await SafmPegawaiAction.query()
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]));
                if(exist.length != 0) {
                    await SafmPegawaiAction.query()
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]))
                            .delete();
                }
            }

            for(let i = 0; i < pernrLength; i++) {
                const insert = new SafmPegawaiAction();
                insert.pernr = String(payload.PERNR[i] == undefined ? '' : payload.PERNR[i]);
                if('COMPANY_CODE' in payload) insert.company_code = String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                if('BEGDA' in payload) {
                    if(payload.BEGDA[i] != undefined) insert.begda = new Date(String(payload.BEGDA[i]));
                }
                if('ENDDA' in payload) {
                    if(payload.ENDDA[i] != undefined) insert.endda = new Date(String(payload.ENDDA[i]));
                } 
                if('MASSN' in payload) insert.massn = String(payload.MASSN[i] == undefined ? '' : payload.MASSN[i]);
                if('MNTXT' in payload) insert.mntxt = String(payload.MNTXT[i] == undefined ? '' : payload.MNTXT[i]);
                if('MASSG' in payload) insert.massg = String(payload.MASSG[i] == undefined ? '' : payload.MASSG[i]);
                if('MGTXT' in payload) insert.mgtxt = String(payload.MGTXT[i] == undefined ? '' : payload.MGTXT[i]);
                if('STAT2' in payload) insert.stat2 = String(payload.STAT2[i] == undefined ? '' : payload.STAT2[i]);
                if('TEXT1' in payload) insert.text1 = String(payload.TEXT1[i] == undefined ? '' : payload.TEXT1[i]);
                if('WERKS' in payload) insert.werks = String(payload.WERKS[i] == undefined ? '' : payload.WERKS[i]);
                if('NAME1' in payload) insert.name1 = String(payload.NAME1[i] == undefined ? '' : payload.NAME1[i]);
                if('BTRTL' in payload) insert.btrtl = String(payload.BTRTL[i] == undefined ? '' : payload.BTRTL[i]);
                if('LGTXT' in payload) insert.lgtxt = String(payload.LGTXT[i] == undefined ? '' : payload.LGTXT[i]);
                if('PLANS' in payload) insert.plans = String(payload.PLANS[i] == undefined ? '' : payload.PLANS[i]);
                if('PLANS_DESC' in payload) insert.plans_desc = String(payload.PLANS_DESC[i] == undefined ? '' : payload.PLANS_DESC[i]);
                if('PERSG' in payload) insert.persg = String(payload.PERSG[i] ==  undefined ? '' : payload.PERSG[i]); 
                if('PTEXT' in payload) insert.ptext = String(payload.PTEXT[i] ==  undefined ? '' : payload.PTEXT[i]);
                if('PERSK' in payload) insert.persk = String(payload.PERSK[i] ==  undefined ? '' : payload.PERSK[i]);
                if('PKTXT' in payload) insert.pktxt = String(payload.PKTXT[i] ==  undefined ? '' : payload.PKTXT[i]);
                if('ANSVH' in payload) insert.ansvh = String(payload.ANSVH[i] ==  undefined ? '' : payload.ANSVH[i]);
                if('ATX' in payload) insert.atx = String(payload.ATX[i] ==  undefined ? '' : payload.ATX[i]);
                if('DOC_TYPE' in payload) insert.doc_type = String(payload.DOC_TYPE[i] ==  undefined ? '' : payload.DOC_TYPE[i]);
                if('STEXT' in payload) insert.stext = String(payload.STEXT[i] ==  undefined ? '' : payload.STEXT[i]);
                if('DOC_NUMBER' in payload) insert.doc_number = String(payload.DOC_NUMBER[i] ==  undefined ? '' : payload.DOC_NUMBER[i]);
                if('ISSUE_DATE' in payload) {
                    if(payload.ISSUE_DATE[i] != undefined) insert.issue_date = new Date(String(payload.ISSUE_DATE[i]));
                }
                if('EFFECTIVE_DATE' in payload) {
                    if(payload.EFFECTIVE_DATE[i] != undefined) insert.effective_date = new Date(String(payload.EFFECTIVE_DATE[i]));
                }
                if('CREATED_BY' in payload) insert.created_by = String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                if('LAST_UPDATED_BY' in payload) insert.last_updated_by = String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);
                await insert.save();

                if(insert.$isPersisted) saved.push(true);
            }

            if(inserted && updated) {
                action = 'insert & update';
            } else if(inserted || updated) {
                action = inserted ? 'insert' : 'update';
            }

            if(saved.length == pernrLength) {
                const respon = {
                    status_code : 200,
                    message : `Success to ${action} Pegawai Action`,
                    pernr : String(pernr),
                    company_code : String(company_code)
                }
                
                return respon;
            } else {
                throw new Error(`Failed to ${action} Pegawai Action`);
            }
            
        } catch(error) {
            const respon = {
                status_code : 500,
                message : String(error)
            }

            return respon;
        }
        
    }


    public async insertPegawaiPreviousEmployment({ request, auth }: HttpContextContract) {
        
        await auth.use('api').authenticate();
        
        try {
            const payload = await Parser.convertXMLToJSON(request.raw());

            // cek apakah payload yang diterima sesuai dengan servisnya
            for(let i = 1; i < Object.keys(payload).length; i++) {
                if(!SafmPegawaiPreviousEmployment.$hasColumn(String(Object.keys(payload)[i]).toLowerCase())) {
                    throw new Error("Data tidak valid");
                }
            }

            let action = 'either insert & update';
            let saved: boolean[] = [];  
            let inserted = false, updated = false;
            const pernr = [...new Set(payload.PERNR.map(item => item))];
            const company_code = [...new Set(payload.COMPANY_CODE.map(item => item))];
            const pernrLength = Object.keys(payload.PERNR).length;
            
            for(let i = 0; i < pernrLength; i++) {
                const exist = await SafmPegawaiPreviousEmployment.query()
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]));
                if(exist.length != 0) {
                    updated = true;
                } else {
                    inserted = true;
                }
            }

            for(let i = 0; i < pernrLength; i++) {
                const exist = await SafmPegawaiPreviousEmployment.query()
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]));
                if(exist.length != 0) {
                    await SafmPegawaiPreviousEmployment.query()
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]))
                            .delete();
                }
            }

            for(let i = 0; i < pernrLength; i++) {
                // region insert
                const insert = new SafmPegawaiPreviousEmployment();
                insert.pernr = String(payload.PERNR[i] == undefined ? '' : payload.PERNR[i]);
                if('BEGDA' in payload) {
                    if(payload.BEGDA[i] != undefined) insert.begda = new Date(String(payload.BEGDA[i]));
                }
                if('ENDDA' in payload) {
                    if(payload.ENDDA[i] != undefined) insert.endda = new Date(String(payload.ENDDA[i]));
                }
                if('ARBGB' in payload) insert.arbgb = String(payload.ARBGB[i] == undefined ? '' : payload.ARBGB[i]);
                if('ORT01' in payload) insert.ort01 = String(payload.ORT01[i] == undefined ? '' : payload.ORT01[i]);
                if('LAND1' in payload) insert.land1 = String(payload.LAND1[i] == undefined ? '' : payload.LAND1[i]);
                if('BRANC' in payload) insert.branc = String(payload.BRANC[i] == undefined ? '' : payload.BRANC[i]);
                if('BRTXT' in payload) insert.brtxt = String(payload.BRTXT[i] == undefined ? '' : payload.BRTXT[i]);
                if('TAETE' in payload) insert.taete = String(payload.TAETE[i] == undefined ? '' : payload.TAETE[i]);
                if('LTEXT' in payload) insert.ltext = String(payload.LTEXT[i] == undefined ? '' : payload.LTEXT[i]);
                if('ANSVX' in payload) insert.ansvx = String(payload.ANSVX[i] == undefined ? '' : payload.ANSVX[i]);
                if('ANSTX' in payload) insert.anstx = String(payload.ANSTX[i] == undefined ? '' : payload.ANSTX[i]);
                if('JOB_DETAIL' in payload) insert.job_detail = String(payload.JOB_DETAIL[i] == undefined ? '' : payload.JOB_DETAIL[i]);
                if('SALARY' in payload) insert.salary = String(payload.SALARY[i] == undefined ? '' : payload.SALARY[i]);
                if('CURRENCY' in payload) insert.currency = String(payload.CURRENCY[i] == undefined ? '' : payload.CURRENCY[i]);
                if('EX_REASON' in payload) insert.ex_reason = String(payload.EX_REASON[i] == undefined ? '' : payload.EX_REASON[i]);
                if('COMPANY_CODE' in payload) insert.company_code = String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                if('CREATED_BY' in payload) insert.created_by = String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                if('LAST_UPDATED_BY' in payload) insert.last_updated_by = String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);
                await insert.save();

                if(insert.$isPersisted) saved.push(true);
            }

            if(inserted && updated) {
                action = 'insert & update';
            } else if(inserted || updated) {
                action = inserted ? 'insert' : 'update';
            }
            
            if(saved.length == pernrLength) {
                const respon = {
                    status_code : 200,
                    message : `Success to ${action} Pegawai Previous Employment`,
                    pernr : String(pernr),
                    company_code : String(company_code)
                }
    
                return respon;
            } else {
                throw new Error(`Fail to ${action} Pegawai Previous Employment`)
            }

        } catch(error) {
            const respon = {
                status_code : 500,
                message : String(error)
            }

            return respon;
        }

    }


    public async insertPegawaiFamily({ request, auth }: HttpContextContract) {
        
        await auth.use('api').authenticate();
        
        try {
            const payload = await Parser.convertXMLToJSON(request.raw());

            // cek apakah payload yang diterima sesuai dengan servisnya
            for(let i = 1; i < Object.keys(payload).length; i++) {
                if(!SafmPegawaiFamily.$hasColumn(String(Object.keys(payload)[i]).toLowerCase())) {
                    throw new Error("Data tidak valid");
                }
            }

            let action = 'either insert & update';
            let saved: boolean[] = [];  
            let inserted = false, updated = false;
            const pernr = [...new Set(payload.PERNR.map(item => item))];
            const company_code = [...new Set(payload.COMPANY_CODE.map(item => item))];
            const pernrLength = Object.keys(payload.PERNR).length;

            for(let i = 0; i < pernrLength; i++) {
                const exist = await SafmPegawaiFamily.query()
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]));
                if(exist.length != 0) {
                    updated = true;
                } else {
                    inserted = true;
                }
            }

            for(let i = 0; i < pernrLength; i++) {
                const exist = await SafmPegawaiFamily.query()
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]));
                if(exist.length != 0) {
                    await SafmPegawaiFamily.query()
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]))
                            .delete();
                }
            }

            for(let i = 0; i < pernrLength; i++) {
                // region insert
                const insert = new SafmPegawaiFamily();
                insert.pernr = String(payload.PERNR[i] == undefined ? '' : payload.PERNR[i]);
                if('COMPANY_CODE' in payload) insert.company_code = String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                if('FULL_NAME' in payload) insert.full_name = String(payload.FULL_NAME[i] == undefined ? '' : payload.FULL_NAME[i]);
                if('FAMILY_TYPE' in payload) insert.family_type = String(payload.FAMILY_TYPE[i] == undefined ? '' : payload.FAMILY_TYPE[i]);
                if('FAMILY_TYPE_DESC' in payload) insert.family_type_desc = String(payload.FAMILY_TYPE_DESC[i] == undefined ? '' : payload.FAMILY_TYPE_DESC[i]);
                if('START_DATE' in payload) {
                    if(payload.START_DATE[i] != undefined) insert.start_date = new Date(String(payload.START_DATE[i]));
                }
                if('END_DATE' in payload) {
                    if(payload.END_DATE[i] != undefined) insert.end_date = new Date(String(payload.END_DATE[i]));
                }
                if('CHANGE_DATE' in payload) {
                    if(payload.CHANGE_DATE[i] != undefined) insert.change_date = new Date(String(payload.CHANGE_DATE[i]));
                }
                if('CHANGE_BY' in payload) insert.change_by = String(payload.CHANGE_BY[i] == undefined ? '' : payload.CHANGE_BY[i]);
                if('NAME' in payload) insert.name = String(payload.NAME[i] == undefined ? '' : payload.NAME[i]);
                if('GENDER_KEY' in payload) insert.gender_key = String(payload.GENDER_KEY[i] == undefined ? '' : payload.GENDER_KEY[i]);
                if('GENDER' in payload) insert.gender = String(payload.GENDER[i] == undefined ? '' : payload.GENDER[i]);
                if('BIRTH_PLACE' in payload) insert.birth_place = String(payload.BIRTH_PLACE[i] == undefined ? '' : payload.BIRTH_PLACE[i]);
                if('BIRTH_DATE' in payload) {
                    if(payload.BIRTH_DATE[i] != undefined) insert.birth_date = new Date(String(payload.BIRTH_DATE[i]));
                }
                if('NATIONALITY' in payload) insert.nationality = String(payload.NATIONALITY[i] == undefined ? '' : payload.NATIONALITY[i]);
                if('COUNTRY_OF_BIRTH' in payload) insert.country_of_birth = String(payload.COUNTRY_OF_BIRTH[i] == undefined ? '' : payload.COUNTRY_OF_BIRTH[i]);
                if('ID_CARD_NO' in payload) insert.id_card_no = String(payload.ID_CARD_NO[i] == undefined ? '' : payload.ID_CARD_NO[i]);
                if('ID_CARD_TYPE' in payload) insert.id_card_type = String(payload.ID_CARD_TYPE[i] == undefined ? '' : payload.ID_CARD_TYPE[i]);
                if('DATE_OF_ISSUE' in payload) {
                    if(payload.DATE_OF_ISSUE[i] != undefined) insert.date_of_issue = new Date(String(payload.DATE_OF_ISSUE[i]));
                }
                if('PLACE_OF_ISSUE' in payload) insert.place_of_issue = String(payload.PLACE_OF_ISSUE[i] == undefined ? '' : payload.PLACE_OF_ISSUE[i]);
                if('RELATIVES' in payload) insert.relatives = String(payload.RELATIVES[i] == undefined ? '' : payload.RELATIVES[i]);
                if('PASSPORT_NO' in payload) insert.passport_no = String(payload.PASSPORT_NO[i] == undefined ? '' : payload.PASSPORT_NO[i]);
                if('PASS_EXPIRY_DATE' in payload) {
                    if(payload.PASS_EXPIRY_DATE[i] != undefined) insert.pass_expiry_date = new Date(String(payload.PASS_EXPIRY_DATE[i]));
                }
                if('JOB_TITLE' in payload) {
                    insert.job_title = String(payload.JOB_TITLE[i] == undefined ? '' : payload.JOB_TITLE[i]);
                }
                if('EMPLOYER' in payload) insert.employer = String(payload.EMPLOYER[i] == undefined ? '' : payload.EMPLOYER[i]);
                if('MARRIED_STATUS_DATE' in payload) {
                    if(payload.MARRIED_STATUS_DATE[i] != undefined) insert.married_status_date = new Date(String(payload.MARRIED_STATUS_DATE[i]));
                }
                if('TANGDINAS' in payload) insert.tangdinas = String(payload.TANGDINAS[i] == undefined ? '' : payload.TANGDINAS[i]);
                if('OBJECT_IDENT' in payload) insert.object_ident = String(payload.OBJECT_IDENT[i] == undefined ? '' : payload.OBJECT_IDENT[i]);
                if('CREATED_BY' in payload) insert.created_by = String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                if('LAST_UPDATED_BY' in payload) insert.last_updated_by = String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);
                await insert.save();

                if(insert.$isPersisted) saved.push(true);
            }

            if(inserted && updated) {
                action = 'insert & update';
            } else if(inserted || updated) {
                action = inserted ? 'insert' : 'update';
            }
             
            if(saved.length == pernrLength) {
                const respon = {
                    status_code : 200,
                    message : `Success to ${action} Pegawai Family`,
                    pernr : String(pernr),
                    company_code : String(company_code)
                }
    
                return respon;
            } else {
                throw new Error(`Fail to ${action} Pegawai Family`);
            }

        } catch(error) {
            const respon = {
                status_code : 500,
                message : String(error)
            }

            return respon;
        }

    }


    public async insertPegawaiEducation({ request, auth }: HttpContextContract) {
        
        await auth.use('api').authenticate();
        
        try {
            const payload = await Parser.convertXMLToJSON(request.raw());

            // cek apakah payload yang diterima sesuai dengan servisnya
            for(let i = 1; i < Object.keys(payload).length; i++) {
                if(!SafmPegawaiEducation.$hasColumn(String(Object.keys(payload)[i]).toLowerCase())) {
                    throw new Error("Data tidak valid");
                }
            }

            let action = 'either insert & update';
            let saved: boolean[] = [];  
            let inserted = false, updated = false;
            const pernr = [...new Set(payload.PERNR.map(item => item))];
            const company_code = [...new Set(payload.COMPANY_CODE.map(item => item))];
            const pernrLength = Object.keys(payload.PERNR).length;

            for(let i = 0; i < pernrLength; i++) {
                const exist = await SafmPegawaiEducation.query()
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]));
                if(exist.length != 0) {
                    updated = true;
                } else {
                    inserted = true;
                }
            }

            for(let i = 0; i < pernrLength; i++) {
                const exist = await SafmPegawaiEducation.query()
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]));
                if(exist.length != 0) {
                    await SafmPegawaiEducation.query()
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]))
                            .delete();
                }
            }

            for(let i = 0; i < pernrLength; i++) {
                // region insert
                const insert = new SafmPegawaiEducation();
                insert.pernr = String(payload.PERNR[i] == undefined ? '' : payload.PERNR[i]);
                if('COMPANY_CODE' in payload) insert.company_code = String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                if('FULL_NAME' in payload) insert.full_name = String(payload.FULL_NAME[i] == undefined ? '' : payload.FULL_NAME[i]);
                if('EDUCATION_EST' in payload) insert.education_est = String(payload.EDUCATION_EST[i] == undefined ? '' : payload.EDUCATION_EST[i]);
                if('EDUCATION_EST_DESC' in payload) insert.education_est_desc = String(payload.EDUCATION_EST_DESC[i] == undefined ? '' : payload.EDUCATION_EST_DESC[i]);
                if('START_DATE' in payload) {
                    if(payload.START_DATE[i] != undefined) insert.start_date = new Date(String(payload.START_DATE[i]));
                }
                if('END_DATE' in payload) {
                    if(payload.END_DATE[i] != undefined) insert.end_date = new Date(String(payload.END_DATE[i]));
                }
                if('CHANGE_DATE' in payload) {
                    if(payload.CHANGE_DATE[i] != undefined) insert.change_date = new Date(String(payload.CHANGE_DATE[i]));
                } 
                if('CHANGE_BY' in payload) insert.change_by = String(payload.CHANGE_BY[i] == undefined ? '' : payload.CHANGE_BY[i]);
                if('EDU_TRAINING' in payload) insert.edu_training = String(payload.EDU_TRAINING[i] == undefined ? '' : payload.EDU_TRAINING[i]);
                if('ET_CATEGORIES' in payload) insert.et_categories = String(payload.ET_CATEGORIES[i] == undefined ? '' : payload.ET_CATEGORIES[i]);
                if('ET_CATEGORIES_TEXT' in payload) insert.et_categories_text = String(payload.ET_CATEGORIES_TEXT[i] == undefined ? '' : payload.ET_CATEGORIES_TEXT[i]);
                if('INST_LOCATION' in payload) insert.inst_location = String(payload.INST_LOCATION[i] == undefined ? '' : payload.INST_LOCATION[i]);
                if('COUNTRY_REGION_KEY' in payload) insert.country_region_key = String(payload.COUNTRY_REGION_KEY[i] == undefined ? '' : payload.COUNTRY_REGION_KEY[i]);
                if('CERTIFICATE' in payload) insert.certificate = String(payload.CERTIFICATE[i] == undefined ? '' : payload.CERTIFICATE[i]);
                if('CERTIFICATE_TEXT' in payload) insert.certificate_text = String(payload.CERTIFICATE_TEXT[i] == undefined ? '' : payload.CERTIFICATE_TEXT[i]);
                if('DURATION_NO' in payload) insert.duration_no = String(payload.DURATION_NO[i] == undefined ? '' : payload.DURATION_NO[i]);
                if('DURATION_TIME' in payload) insert.duration_time = String(payload.DURATION_TIME[i] == undefined ? '' : payload.DURATION_TIME[i]);
                if('FINAL_GRADE' in payload) insert.final_grade = String(payload.FINAL_GRADE[i] == undefined ? '' : payload.FINAL_GRADE[i]);
                if('BRANCH_OF_STUDY_1' in payload) insert.branch_of_study_1 = String(payload.BRANCH_OF_STUDY_1[i] == undefined ? '' : payload.BRANCH_OF_STUDY_1[i]);
                if('BRANCH_OF_STUDY_1T' in payload) insert.branch_of_study_1t = String(payload.BRANCH_OF_STUDY_1T[i] == undefined ? '' : payload.BRANCH_OF_STUDY_1T[i]);
                if('BRANCH_OF_STUDY_2' in payload) insert.branch_of_study_2 = String(payload.BRANCH_OF_STUDY_2[i] == undefined ? '' : payload.BRANCH_OF_STUDY_2[i]);
                if('BRANCH_OF_STUDY_2T' in payload) insert.branch_of_study_2t = String(payload.BRANCH_OF_STUDY_2T[i] == undefined ? '' : payload.BRANCH_OF_STUDY_2T[i]);
                if('COURSE_SUBJECT' in payload) insert.course_subject = String(payload.COURSE_SUBJECT[i] == undefined ? '' : payload.COURSE_SUBJECT[i]);
                if('KATEGORI_PELATIHAN' in payload) insert.kategori_pelatihan = String(payload.KATEGORI_PELATIHAN[i] == undefined ? '' : payload.KATEGORI_PELATIHAN[i]);
                if('LEVEL_PELATIHAN' in payload) insert.level_pelatihan = String(payload.LEVEL_PELATIHAN[i] == undefined ? '' : payload.LEVEL_PELATIHAN[i]);
                if('CERTIFICATE_TYPE' in payload) insert.certificate_type = String(payload.CERTIFICATE_TYPE[i] == undefined ? '' : payload.CERTIFICATE_TYPE[i]);
                if('CERTI_START_DATE' in payload) {
                    if(payload.CERTI_START_DATE[i] != undefined) insert.certi_start_date = new Date(String(payload.CERTI_START_DATE[i]));
                }
                if('CERTI_EXPIRE_DATE' in payload) {
                    if(payload.CERTI_EXPIRE_DATE[i] != undefined) insert.certi_expire_date = new Date(String(payload.CERTI_EXPIRE_DATE[i]));
                }
                if('KATEGORI_PELATIHAN_TEXT' in payload) insert.kategori_pelatihan_text = String(payload.KATEGORI_PELATIHAN_TEXT[i] == undefined ? '' : payload.KATEGORI_PELATIHAN_TEXT[i]);
                if('LEVEL_PELATIHAN_TEXT' in payload) insert.level_pelatihan_text = String(payload.LEVEL_PELATIHAN_TEXT[i] == undefined ? '' : payload.LEVEL_PELATIHAN_TEXT[i]);
                if('CERTIFICATE_TYPE_TEXT' in payload) insert.certificate_type_text = String(payload.CERTIFICATE_TYPE_TEXT[i] == undefined ? '' : payload.CERTIFICATE_TYPE_TEXT[i]);
                if('PEND_AWAL_PENERIMAAN' in payload) insert.pend_awal_penerimaan = String(payload.PEND_AWAL_PENERIMAAN[i] == undefined ? '' : payload.PEND_AWAL_PENERIMAAN[i]);
                if('NOMOR_IJAZAH' in payload) insert.nomor_ijazah = String(payload.NOMOR_IJAZAH[i] == undefined ? '' : payload.NOMOR_IJAZAH[i]); 
                if('FAKULTAS' in payload) insert.fakultas = String(payload.FAKULTAS[i] == undefined ? '' : payload.FAKULTAS[i]); 
                if('KONSENTRASI' in payload) insert.konsentrasi = String(payload.KONSENTRASI[i] == undefined ? '' : payload.KONSENTRASI[i]);
                if('CREATED_BY' in payload) insert.created_by = String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                if('LAST_UPDATED_BY' in payload) insert.last_updated_by = String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);
                await insert.save();

                if(insert.$isPersisted) saved.push(true);
            }

            if(inserted && updated) {
                action = 'insert & update';
            } else if(inserted || updated) {
                action = inserted ? 'insert' : 'update';
            }

            if(saved.length == pernrLength) {
                const respon = {
                    status_code : 200,
                    message : `Success ${action} Pegawai Education`,
                    pernr : String(pernr),
                    company_code : String(company_code)
                }
    
                return respon;
            } else {
                throw new Error(`Fail to ${action} Pegawai Education`);
            }
            
        } catch(error) {
            const respon = {
                status_code : 500,
                message : String(error)
            }

            return respon;
        }

    }


    public async insertPegawaiDiscipline({ request, auth }: HttpContextContract) {
        
        await auth.use('api').authenticate();
        
        try {
            const payload = await Parser.convertXMLToJSON(request.raw());

            // cek apakah payload yang diterima sesuai dengan servisnya
            for(let i = 1; i < Object.keys(payload).length; i++) {
                if(!SafmPegawaiDiscipline.$hasColumn(String(Object.keys(payload)[i]).toLowerCase())) {
                    throw new Error("Data tidak valid");
                }
            }

            let action = 'either insert & update';
            let saved: boolean[] = [];  
            let inserted = false, updated = false;
            const pernr = [...new Set(payload.PERNR.map(item => item))];
            const company_code = [...new Set(payload.COMPANY_CODE.map(item => item))];
            const pernrLength = Object.keys(payload.PERNR).length;
            
            for(let i = 0; i < pernrLength; i++) {
                const exist = await SafmPegawaiDiscipline.query()
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]));
                if(exist.length != 0) {
                    updated = true;
                } else {
                    inserted = true;
                }
            }

            for(let i = 0; i < pernrLength; i++) {
                const exist = await SafmPegawaiDiscipline.query()
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]));
                if(exist.length != 0) {
                    await SafmPegawaiDiscipline.query()
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]))
                            .delete();
                }
            }

            for(let i = 0; i < pernrLength; i++) {
                // region insert
                const insert = new SafmPegawaiDiscipline();
                insert.pernr = String(payload.PERNR[i] == undefined ? '' : payload.PERNR[i]);
                if('COMPANY_CODE' in payload) insert.company_code = String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                if('FULL_NAME' in payload) insert.full_name = String(payload.FULL_NAME[i] == undefined ? '' : payload.FULL_NAME[i]);
                if('SUBTYPE' in payload) insert.subtype = String(payload.SUBTYPE[i] == undefined ? '' : payload.SUBTYPE[i]);
                if('SUBTYPE_TEXT' in payload) insert.subtype_text = String(payload.SUBTYPE_TEXT[i] == undefined ? '' : payload.SUBTYPE_TEXT[i]);
                if('START_DATE' in payload) {
                    if(payload.START_DATE[i] != undefined) insert.start_date = new Date(String(payload.START_DATE[i]));
                }
                if('END_DATE' in payload) {
                    if(payload.END_DATE[i] != undefined) insert.end_date = new Date(String(payload.END_DATE[i]));
                }
                if('CHANGE_DATE' in payload) {
                    if(payload.CHANGE_DATE[i] != undefined) insert.change_date = new Date(String(payload.CHANGE_DATE[i]));
                } 
                if('CHANGE_BY' in payload) insert.change_by = String(payload.CHANGE_BY[i] == undefined ? '' : payload.CHANGE_BY[i]);
                if('COMPANY_POLICY' in payload) insert.company_policy = String(payload.COMPANY_POLICY[i] == undefined ? '' : payload.COMPANY_POLICY[i]);
                if('REASON' in payload) insert.reason = String(payload.REASON[i] == undefined ? '' : payload.REASON[i]);
                if('REASON_TEXT' in payload) insert.reason_text = String(payload.REASON_TEXT[i] == undefined ? '' : payload.REASON_TEXT[i]);
                if('DATE_ENTERED' in payload) {
                    if(payload.DATE_ENTERED[i] != undefined) insert.date_entered = new Date(String(payload.DATE_ENTERED[i]));
                }
                if('RESULT' in payload) insert.result = String(payload.RESULT[i] == undefined ? '' : payload.RESULT[i]);
                if('RESULT_TEXT' in payload) insert.result_text = String(payload.RESULT_TEXT[i] == undefined ? '' : payload.RESULT_TEXT[i]);
                if('DATE_SETTELED' in payload) {
                    if(payload.DATE_SETTLED[i] != undefined) insert.date_settled = new Date(String(payload.DATE_SETTLED[i]));
                }
                if('TUNTUTAN_GANTI_RUGI' in payload) insert.tuntutan_ganti_rugi = String(payload.TUNTUTAN_GANTI_RUGI[i] == undefined ? '' : payload.TUNTUTAN_GANTI_RUGI[i]);
                if('NO_DOCUMENT_SK' in payload) insert.no_document_sk = String(payload.NO_DOCUMENT_SK[i] == undefined ? '' : payload.NO_DOCUMENT_SK[i]);
                if('GRIEVANCE_TEXT' in payload) insert.grievance_text = String(payload.GRIEVANCE_TEXT[i] == undefined ? '' : payload.GRIEVANCE_TEXT[i]);
                if('CREATED_BY' in payload) insert.created_by = String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                if('LAST_UPDATED_BY' in payload) insert.last_updated_by = String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);
                await insert.save();

                if(insert.$isPersisted) saved.push(true);
            }

            if(inserted && updated) {
                action = 'inserted & update';
            } else if(inserted || updated) {
                action = inserted ? 'insert' : 'update';
            }

            if(saved.length == pernrLength) {
                const respon = {
                    status_code : 200,
                    message : `Success to ${action} Pegawai Discipline`,
                    pernr : String(pernr),
                    company_code : String(company_code)
                }
    
                return respon;
            } else {
                throw new Error(`Fail to ${action} Pegawai Discipline`);
            }
            
        } catch(error) {
            const respon = {
                status_code : 500,
                message : String(error)
            }

            return respon;
        }

    }


    public async insertPegawaiAddresses({ request, auth }: HttpContextContract) {
        
        await auth.use('api').authenticate();
        
        try {
            const payload = await Parser.convertXMLToJSON(request.raw());

            // cek apakah payload yang diterima sesuai dengan servisnya
            for(let i = 1; i < Object.keys(payload).length; i++) {
                if(!SafmPegawaiAddress.$hasColumn(String(Object.keys(payload)[i]).toLowerCase())) {
                    throw new Error("Data tidak valid");
                }
            }

            let action = 'either insert & update';
            let saved: boolean[] = [];  
            let inserted = false, updated = false;
            const pernr = [...new Set(payload.PERNR.map(item => item))];
            const company_code = [...new Set(payload.COMPANY_CODE.map(item => item))];
            const pernrLength = Object.keys(payload.PERNR).length;

            for(let i = 0; i < pernrLength; i++) {
                const exist = await SafmPegawaiAddress.query()
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]));
                if(exist.length != 0) {
                    updated = true;
                } else {
                    inserted = true;
                }
            }

            for(let i = 0; i < pernrLength; i++) {
                const exist = await SafmPegawaiAddress.query()
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]));
                if(exist.length != 0) {
                    await SafmPegawaiAddress.query()
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]))
                            .delete();
                }
            }

            for(let i = 0; i < pernrLength; i++) {
                const insert = new SafmPegawaiAddress();
                insert.pernr = String(payload.PERNR[i] == undefined ? '' : payload.PERNR[i]);
                if('COMPANY_CODE' in payload) insert.company_code = String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                if('FULL_NAME' in payload) insert.full_name = String(payload.FULL_NAME[i] == undefined ? '' : payload.FULL_NAME[i]);
                if('ADDRESS_TYPE' in payload) insert.address_type = String(payload.ADDRESS_TYPE[i] == undefined ? '' : payload.ADDRESS_TYPE[i]);
                if('ADDRESS_TYPE_TEXT' in payload) insert.address_type_text = String(payload.ADDRESS_TYPE_TEXT[i] == undefined ? '' : payload.ADDRESS_TYPE_TEXT[i]);
                if('START_DATE' in payload) {
                    if(payload.START_DATE[i] != undefined) insert.start_date = new Date(String(payload.START_DATE[i]));
                }
                if('END_DATE' in payload) {
                    if(payload.END_DATE[i] != undefined) insert.end_date = new Date(String(payload.END_DATE[i]));
                }
                if('CHANGE_DATE' in payload) {
                    if(payload.CHANGE_DATE[i] != undefined) insert.change_date = new Date(String(payload.CHANGE_DATE[i]));
                }
                if('CHANGE_BY' in payload) insert.change_by = String(payload.CHANGE_BY[i] == undefined ? '' : payload.CHANGE_BY[i]);
                if('STREET_AND_HOUSE_NO' in payload) insert.street_and_house_no = String(payload.STREET_AND_HOUSE_NO[i] == undefined ? '' : payload.STREET_AND_HOUSE_NO[i]);
                if('CONTACT_NAME' in payload) insert.contact_name = String(payload.CONTACT_NAME[i] == undefined ? '' : payload.CONTACT_NAME[i]);
                if('SECOND_ADDRESS_LINE' in payload) insert.second_address_line = String(payload.SECOND_ADDRESS_LINE[i] == undefined ? '' : payload.SECOND_ADDRESS_LINE[i]);
                if('DISTRICT' in payload) insert.district = String(payload.DISTRICT[i] == undefined ? '' : payload.DISTRICT[i]);
                if('CITY' in payload) insert.city = String(payload.CITY[i] == undefined ? '' : payload.CITY[i]);
                if('POSTAL_CODE' in payload) insert.postal_code = String(payload.POSTAL_CODE[i] == undefined ? '' : payload.POSTAL_CODE[i]);
                if('REGION' in payload) insert.region = String(payload.REGION[i] == undefined ? '' : payload.REGION[i]);
                if('REGION_TEXT' in payload) insert.region_text = String(payload.REGION_TEXT[i] == undefined ? '' : payload.REGION_TEXT[i]);
                if('COUNTRY' in payload) insert.country = String(payload.COUNTRY[i] == undefined ? '' : payload.COUNTRY[i]);
                if('COUNTRY_TEXT' in payload) insert.country_text = String(payload.COUNTRY_TEXT[i] == undefined ? '' : payload.COUNTRY_TEXT[i]);
                if('CREATED_BY' in payload) insert.created_by = String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                if('LAST_UPDATED_BY' in payload) insert.last_updated_by = String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);
                await insert.save();

                if(insert.$isPersisted) saved.push(true);
            }

            if(inserted && updated) {
                action = 'inserted & update';
            } else if(inserted || updated) {
                action = inserted ? 'insert' : 'update';
            }

            if(saved.length == pernrLength) {
                const respon = {
                    status_code : 200,
                    message : `Success to ${action} Pegawai Addresses`,
                    pernr : String(pernr),
                    company_code : String(company_code)
                }
    
                return respon;
            } else {
                throw new Error(`Fail to ${action} Pegawai Addresses`);
            }

        } catch(error) {
            const respon = {
                status_code : 500,
                message : String(error)
            }

            return respon;
        }

    }


    public async insertStrukturOrganisasiNew({ request, auth }: HttpContextContract) {
        
        await auth.use('api').authenticate();
        
        try {
            const payload = await Parser.convertXMLToJSON(request.raw());
            
            // cek apakah payload yang diterima sesuai dengan servisnya
            for(let i = 1; i < Object.keys(payload).length; i++) {
                if(!SafmStrukturOrganisasi.$hasColumn(String(Object.keys(payload)[i]).toLowerCase())) {
                    throw new Error("Data tidak valid");
                }
            }
            
            let action = 'either insert & update';
            let saved: boolean[] = [];
            let inserted = false, updated = false;
            const objid = [...new Set(payload.OBJID.map(item => item))];
            const company_code = [...new Set(payload.COMPANY_CODE.map(item => item))];
            const objidLength = Object.keys(payload.OBJID).length;

            for(let i = 0; i < objidLength; i++) {

                const data = await SafmStrukturOrganisasi.query()
                                .where('objid', String(payload.OBJID[i]))
                                .andWhere('company_code', String(payload.COMPANY_CODE[i]));
    
                if(data.length == 0) {
                    // insert
                    const insert = new SafmStrukturOrganisasi();
                    insert.objid = String(payload.OBJID[i] == undefined ? '' : payload.OBJID[i]);
                    if('COMPANY_CODE' in payload) insert.company_code = String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                    if('PLVAR' in payload) insert.plvar = String(payload.PLVAR[i] == undefined ? '' : payload.PLVAR[i]);
                    if('OTYPE' in payload) insert.otype = String(payload.OTYPE[i] == undefined ? '' : payload.OTYPE[i]);
                    if('PAROT' in payload) insert.parot = String(payload.PAROT[i] == undefined ? '' : payload.PAROT[i]);
                    if('PARID' in payload) insert.parid = String(payload.PARID[i] == undefined ? '' : payload.PARID[i]);
                    if('BEGDA' in payload) {
                        if(payload.BEGDA[i] != undefined) insert.begda = new Date(String(payload.BEGDA[i]));
                    }
                    if('ENDDA' in payload) {
                        if(payload.ENDDA[i] != undefined) insert.endda = new Date(String(payload.ENDDA[i]));
                    }
                    if('SHORT' in payload) insert.short = String(payload.SHORT[i][1] == undefined ? '' : payload.SHORT[i][1]);
                    if('STEXT' in payload) insert.stext = String(payload.STEXT[i] == undefined ? '' : payload.STEXT[i]);
                    if('VBEG' in payload) {
                        if(payload.VBEG[i] != undefined) insert.vbeg = new Date(String(payload.VBEG[i]));
                    }
                    if('VEND' in payload) {
                        if(payload.VEND[i] != undefined) insert.vend = new Date(String(payload.VEND[i]));
                    }
                    if('TLEVEL' in payload) insert.tlevel = Number(payload.TLEVEL[i] == undefined ? '' : payload.TLEVEL[i]);
                    if('FLAG_CHIEF' in payload) insert.flag_chief = String(payload.FLAG_CHIEF[i] == undefined ? '' : payload.FLAG_CHIEF[i]);
                    if('KOSTENSTELLE' in payload) insert.kostenstelle = String(payload.KOSTENSTELLE[i] == undefined ? '' : payload.KOSTENSTELLE[i]);
                    if('PERSA' in payload) insert.persa = String(payload.PERSA[i] == undefined ? '' : payload.PERSA[i]);
                    if('PERSA_NEW' in payload) insert.persa_new = String(payload.PERSA_NEW[i] == undefined ? '' : payload.PERSA_NEW[i]);
                    if('BTRTL' in payload) insert.btrtl = String(payload.BTRTL[i] == undefined ? '' : payload.BTRTL[i]);
                    if('BTRTL_NEW' in payload) insert.btrtl_new = String(payload.BTRTL_NEW[i] == undefined ? '' : payload.BTRTL_NEW[i]);
                    if('PERSG' in payload) insert.persg = String(payload.PERSG[i] == undefined ? '' : payload.PERSG[i]);
                    if('PERSK' in payload) insert.persk = String(payload.PERSK[i] == undefined ? '' : payload.PERSK[i]);
                    insert.program_name = "WS MDM";
                    if('KD_AKTIF' in payload) insert.kd_aktif = String(payload.KD_AKTIF[i] == undefined ? '' : payload.KD_AKTIF[i]);
                    if('PIN' in payload) insert.pin = String(payload.PIN[i] == undefined ? '' : payload.PIN[i]);
                    if('WERKS' in payload) insert.werks = String(payload.WERKS[i] == undefined ? '' : payload.WERKS[i]);
                    if('KODEUNITKERJA' in payload) insert.kodeunitkerja = String(payload.KODEUNITKERJA[i] == undefined ? '' : payload.KODEUNITKERJA[i]);
                    if('KODEREGIONAL' in payload) insert.koderegional = String(payload.KODEREGIONAL[i] == undefined ? '' : payload.KODEREGIONAL[i]);
                    if('KODEACTIVITY' in payload) insert.kodeactivity = String(payload.KODEACTIVITY[i] == undefined ? '' : payload.KODEACTIVITY[i]);
                    if('DESCACTIVITY' in payload) insert.descactivity = String(payload.DESCACTIVITY[i] == undefined ? '' : payload.DESCACTIVITY[i]);
                    if('DESCBOBOTORGANISASI' in payload) insert.descbobotorganisasi = String(payload.DESCBOBOTORGANISASI[i] == undefined ? '' : payload.DESCBOBOTORGANISASI[i]);
                    if('LEVELORGANISASI' in payload) insert.levelorganisasi = String(payload.LEVELORGANISASI[i] == undefined ? '' : payload.LEVELORGANISASI[i]);
                    if('PERSAREATEXT' in payload) insert.persareatext = String(payload.PERSAREATEXT[i] == undefined ? '' : payload.PERSAREATEXT[i]);
                    if('PERSSUBAREATEXT' in payload) insert.perssubareatext = String(payload.PERSSUBAREATEXT[i] == undefined ? '' : payload.PERSSUBAREATEXT[i]);
                    if('GENERALTEXT' in payload) insert.generaltext = String(payload.GENERALTEXT[i] == undefined ? '' : payload.GENERALTEXT[i]);
                    if('GENERALTEXTPAR' in payload) insert.generaltextpar = String(payload.GENERALTEXTPAR[i] == undefined ? '' : payload.GENERALTEXTPAR[i]);
                    if('COSTCENTER' in payload) insert.costcenter = String(payload.COSTCENTER[i] == undefined ? '' : payload.COSTCENTER[i]);
                    if('COSTCENTERTEXT' in payload) insert.costcentertext = String(payload.COSTCENTERTEXT[i] == undefined ? '' : payload.COSTCENTERTEXT[i]);
                    if('CHIEFPOSITION' in payload) insert.chiefposition = String(payload.CHIEFPOSITION[i] == undefined ? '' : payload.CHIEFPOSITION[i]);
                    if('KODE_JOBSTREAM' in payload) insert.kode_jobstream = String(payload.KODE_JOBSTREAM[i] == undefined ? '' : payload.KODE_JOBSTREAM[i]);
                    if('DESC_JOBSTREAM' in payload) insert.desc_jobstream = String(payload.DESC_JOBSTREAM[i] == undefined ? '' : payload.DESC_JOBSTREAM[i]);
                    if('JOBID' in payload) insert.jobid = String(payload.JOBID[i] == undefined ? '' : payload.JOBID[i]);
                    if('JOBNAME' in payload) insert.jobname = String(payload.JOBNAME[i] == undefined ? '' : payload.JOBNAME[i]);
                    if('KJ_POSISI' in payload) insert.kj_posisi = String(payload.KJ_POSISI[i] == undefined ? '' : payload.KJ_POSISI[i]);
                    if('KJ_POSISI_NEW' in payload) insert.kj_posisi_new = String(payload.KJ_POSISI_NEW[i] == undefined ? '' : payload.KJ_POSISI_NEW[i]);
                    if('JOB_POINT' in payload) insert.job_point = String(payload.JOB_POINT[i] == undefined ? '' : payload.JOB_POINT[i]);
                    if('CREATED_BY' in payload) insert.created_by = String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                    if('LAST_UPDATED_BY' in payload) insert.last_updated_by = String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);
                    await insert.save();
    
                    if(insert.$isPersisted) saved.push(true);
                    inserted = true;
                } else {
                    // update
                    const param = {};

                    if('COMPANY_CODE' in payload) param['company_code'] = String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                    if('PLVAR' in payload) param['plvar'] = String(payload.PLVAR[i] == undefined ? '' : payload.PLVAR[i]);
                    if('OTYPE' in payload) param['otype'] = String(payload.OTYPE[i] == undefined ? '' : payload.OTYPE[i]);
                    if('PAROT' in payload) param['parot'] = String(payload.PAROT[i] == undefined ? '' : payload.PAROT[i]);
                    if('PARID' in payload) param['parid'] = String(payload.PARID[i] == undefined ? '' : payload.PARID[i]);
                    if('BEGDA' in payload) {
                        if(payload.BEGDA[i] != undefined) param['begda'] = new Date(String(payload.BEGDA[i]));
                    }
                    if('ENDDA' in payload) {
                        if(payload.ENDDA[i] != undefined) param['endda'] = new Date(String(payload.ENDDA[i]));
                    }
                    if('SHORT' in payload) param['short'] = String(payload.SHORT[i][1] == undefined ? '' : payload.SHORT[i][1]);
                    if('STEXT' in payload) param['stext'] = String(payload.STEXT[i] == undefined ? '' : payload.STEXT[i]);
                    if('VBEG' in payload) {
                        if(payload.VBEG[i] != undefined) param['vbeg'] = new Date(String(payload.VBEG[i]));
                    }
                    if('VEND' in payload) {
                        if(payload.VEND[i] != undefined) param['vend'] = new Date(String(payload.VEND[i]));
                    }
                    if('TLEVEL' in payload) param['tlevel'] = Number(payload.TLEVEL[i] == undefined ? '' : payload.TLEVEL[i]);
                    if('FLAG_CHIEF' in payload) param['flag_chief'] = String(payload.FLAG_CHIEF[i] == undefined ? '' : payload.FLAG_CHIEF[i]);
                    if('KOSTENSTELLE' in payload) param['kostenstelle'] = String(payload.KOSTENSTELLE[i] == undefined ? '' : payload.KOSTENSTELLE[i]);
                    if('PERSA' in payload) param['persa'] = String(payload.PERSA[i] == undefined ? '' : payload.PERSA[i]);
                    if('PERSA_NEW' in payload) param['persa_new'] = String(payload.PERSA_NEW[i] == undefined ? '' : payload.PERSA_NEW[i]);
                    if('BTRTL' in payload) param['btrtl'] = String(payload.BTRTL[i] == undefined ? '' : payload.BTRTL[i]);
                    if('BTRTL_NEW' in payload) param['btrtl_new'] = String(payload.BTRTL_NEW[i] == undefined ? '' : payload.BTRTL_NEW[i]);
                    if('PERSG' in payload) param['persg'] = String(payload.PERSG[i] == undefined ? '' : payload.PERSG[i]);
                    if('PERSK' in payload) param['persk'] = String(payload.PERSK[i] == undefined ? '' : payload.PERSK[i]);
                    param['program_name'] = "WS MDM";
                    if('KD_AKTIF' in payload) param['kd_aktif'] = String(payload.KD_AKTIF[i] == undefined ? '' : payload.KD_AKTIF[i]);
                    if('PIN' in payload) param['pin'] = String(payload.PIN[i] == undefined ? '' : payload.PIN[i]);
                    if('WERKS' in payload) param['werks'] = String(payload.WERKS[i] == undefined ? '' : payload.WERKS[i]);
                    if('KODEUNITKERJA' in payload) param['kodeunitkerja'] = String(payload.KODEUNITKERJA[i] == undefined ? '' : payload.KODEUNITKERJA[i]);
                    if('KODEREGIONAL' in payload) param['koderegional'] = String(payload.KODEREGIONAL[i] == undefined ? '' : payload.KODEREGIONAL[i]);
                    if('KODEACTIVITY' in payload) param['kodeactivity'] = String(payload.KODEACTIVITY[i] == undefined ? '' : payload.KODEACTIVITY[i]);
                    if('DESCACTIVITY' in payload) param['descactivity'] = String(payload.DESCACTIVITY[i] == undefined ? '' : payload.DESCACTIVITY[i]);
                    if('DESCBOBOTORGANISASI' in payload) param['descbobotorganisasi'] = String(payload.DESCBOBOTORGANISASI[i] == undefined ? '' : payload.DESCBOBOTORGANISASI[i]);
                    if('LEVELORGANISASI' in payload) param['levelorganisasi'] = String(payload.LEVELORGANISASI[i] == undefined ? '' : payload.LEVELORGANISASI[i]);
                    if('PERSAREATEXT' in payload) param['persareatext'] = String(payload.PERSAREATEXT[i] == undefined ? '' : payload.PERSAREATEXT[i]);
                    if('PERSSUBAREATEXT' in payload) param['perssubareatext'] = String(payload.PERSSUBAREATEXT[i] == undefined ? '' : payload.PERSSUBAREATEXT[i]);
                    if('GENERALTEXT' in payload) param['generaltext'] = String(payload.GENERALTEXT[i] == undefined ? '' : payload.GENERALTEXT[i]);
                    if('GENERALTEXTPAR' in payload) param['generaltextpar'] = String(payload.GENERALTEXTPAR[i] == undefined ? '' : payload.GENERALTEXTPAR[i]);
                    if('COSTCENTER' in payload) param['costcenter'] = String(payload.COSTCENTER[i] == undefined ? '' : payload.COSTCENTER[i]);
                    if('COSTCENTERTEXT' in payload) param['costcentertext'] = String(payload.COSTCENTERTEXT[i] == undefined ? '' : payload.COSTCENTERTEXT[i]);
                    if('CHIEFPOSITION' in payload) param['chiefposition'] = String(payload.CHIEFPOSITION[i] == undefined ? '' : payload.CHIEFPOSITION[i]);
                    if('KODE_JOBSTREAM' in payload) param['kode_jobstream'] = String(payload.KODE_JOBSTREAM[i] == undefined ? '' : payload.KODE_JOBSTREAM[i]);
                    if('DESC_JOBSTREAM' in payload) param['desc_jobstream'] = String(payload.DESC_JOBSTREAM[i] == undefined ? '' : payload.DESC_JOBSTREAM[i]);
                    if('JOBID' in payload) param['jobid'] = String(payload.JOBID[i] == undefined ? '' : payload.JOBID[i]);
                    if('JOBNAME' in payload) param['jobname'] = String(payload.JOBNAME[i] == undefined ? '' : payload.JOBNAME[i]);
                    if('KJ_POSISI' in payload) param['kj_posisi'] = String(payload.KJ_POSISI[i] == undefined ? '' : payload.KJ_POSISI[i]);
                    if('KJ_POSISI_NEW' in payload) param['kj_posisi_new'] = String(payload.KJ_POSISI_NEW[i] == undefined ? '' : payload.KJ_POSISI_NEW[i]);
                    if('JOB_POINT' in payload) param['job_point'] = String(payload.JOB_POINT[i] == undefined ? '' : payload.JOB_POINT[i]);
                    if('CREATED_BY' in payload) param['created_by'] = String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                    if('LAST_UPDATED_BY' in payload) param['last_updated_by'] = String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);

                    await SafmStrukturOrganisasi.query()
                        .where('company_code', String(payload.COMPANY_CODE[i]))
                        .where('objid', String(payload.OBJID[i]))
                        .update(param);
    
                    saved.push(true);
                    updated = true;
                }
            }

            if(inserted && updated) {
                action = 'insert & update';
            } else if(inserted || updated) {
                action = inserted ? 'insert' : 'update';
            } else {
                action = 'either insert and update';
            }

            if(saved.length == objidLength) {
                const respon = {
                    status_code : 200,
                    message : `Success to ${action} Struktur Organisasi`,
                    objid : String(objid),
                    company_code : String(company_code)
                }
    
                return respon;
            } else {
                throw new Error(`Fail to ${action} Struktur Organisasi`);
            }

        } catch(error) {
            const respon = {
                status_code : 500,
                message : String(error)
            }

            return respon;
        }
    }


    public async insertPerubahanOrganisasiNew({ request, auth }: HttpContextContract) {

        await auth.use('api').authenticate();
        
        try {
            const payload = await Parser.convertXMLToJSON(request.raw());
            
            // penyesuaian nama endda
            if('ENDDA' in payload) {
                payload['ENDA'] = payload['ENDDA'];
                delete payload['ENDDA'];
            }
            
            // cek apakah payload yang diterima sesuai dengan servisnya
            for(let i = 1; i < Object.keys(payload).length; i++) {
                if(!SafmPerubahanOrganisasi.$hasColumn(String(Object.keys(payload)[i]).toLowerCase())) {
                    throw new Error("Data tidak valid");
                }
            }

            let action = 'either insert & update';
            let saved: boolean[] = [];
            let inserted = false, updated = false;
            const pernr = [...new Set(payload.PERNR.map(item => item))];
            const company_code = [...new Set(payload.COMPANY_CODE.map(item => item))];
            const pernrLength = Object.keys(payload.PERNR).length;

            for(let i = 0; i < pernrLength; i++) {
                const exist = await SafmPerubahanOrganisasi.query()
                            .where('pernr', String(payload.PERNR[i]))
                            .andWhere('company_code', String(payload.COMPANY_CODE[i]));
                if(exist.length != 0) {
                    updated = true;
                } else {
                    inserted = true;
                }
            }
            
            for(let i = 0; i < pernrLength; i++) {
                const sql_perub = `SELECT * FROM "safm_perubahan_organisasi" 
                                   WHERE "pernr" = '${String(payload.PERNR[i])}'
                                   AND "company_code" = '${String(payload.COMPANY_CODE[i])}' 
                                   ORDER BY "created_date" ASC`;
                
                const perub = await Database.rawQuery(sql_perub);

                const begda = new Date(String(payload.BEGDA[i]));
                let enddaDay = begda.getDate() - 1;
                let enddaMonth = begda.getMonth() + 1;
                let enddaYear = Number(begda.getFullYear());
    
                if(enddaDay == 0) {    
                    if(enddaMonth == 1) {
                        enddaMonth = 12;
                        enddaYear -= 1; 
                    } else {
                        enddaMonth -= 1;
                    }
                    
                    if(enddaMonth / 2 == 0) {
                        if(enddaMonth == 2) {
                            enddaDay = 28;
                        } else {
                            enddaDay = 30;
                        }
                    } else if (enddaMonth / 2 != 0) {
                        enddaDay = 31;
                    }
                }
    
                let endda: any;
                if(enddaMonth > 9){
                    endda = `${enddaYear}-${enddaMonth}-${enddaDay}`;
                } else {
                    endda = `${enddaYear}-0${enddaMonth}-${enddaDay}`;
                }
                
                if(perub.length != 0) {
                    // jika begda baru lebih kecil atau besar dari begda data existing
                    if(begda < new Date(perub[perub.length - 1].begda)) {
                        if(String(payload.ENDA[i]).substring(0, 4) == '9999') {
                            // delete data existing
                            await SafmPerubahanOrganisasi.query()
                                .where('pernr', String(payload.PERNR[i]))
                                .andWhere('company_code', String(payload.COMPANY_CODE[i]))
                                .delete()
                        }
                    } else if(begda > new Date(perub[perub.length - 1].begda)) {
                        // update endda data existing -1 begda data input
                        const begda_existing = new Date(perub[perub.length - 1].begda);
                        let begda_existing_day = begda_existing.getDate();
                        let begda_existing_month = begda_existing.getMonth() + 1;
                        let begda_existing_year = Number(begda_existing.getFullYear());
    
                        if(begda_existing_day == 0) {    
                            if(begda_existing_month == 1) {
                                begda_existing_month = 12;
                                begda_existing_year -= 1; 
                            } else {
                                begda_existing_month -= 1;
                            }
                            
                            if(begda_existing_month / 2 == 0) {
                                if(begda_existing_month == 2) {
                                    begda_existing_day = 28;
                                } else {
                                    begda_existing_day = 30;
                                }
                            } else if (begda_existing_month / 2 != 0) {
                                begda_existing_day = 31;
                            }
                        }
    
                        let begda_existing_new: any;
                        if(begda_existing_month > 9){
                            begda_existing_new = `${begda_existing_year}-${begda_existing_month}-${begda_existing_day}`;
                        } else {
                            begda_existing_new = `${begda_existing_year}-0${begda_existing_month}-${begda_existing_day}`;
                        }
    
                        const sql = `UPDATE "safm_perubahan_organisasi" 
                                     SET "enda" = TO_DATE('${endda}', 'yyyy/mm/dd') 
                                     WHERE "pernr" = '${String(payload.PERNR[i])}' 
                                     AND "company_code" = '${String(payload.COMPANY_CODE[i])}' 
                                     AND TRUNC("begda") = TO_DATE('${begda_existing_new}', 'yyyy/mm/dd')`;
    
                        await Database.rawQuery(sql);
                    }
                
                }

                if(perub.length != 0 && begda.toISOString().substring(0, 10) == new Date(perub[perub.length - 1].begda).toISOString().substring(0, 10)) {
                    // update data input
                    const param = {};

                    if('COMPANY_CODE' in payload) param['company_code'] =  String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                    if('CNAME' in payload) param['cname'] = String(payload.CNAME[i] == undefined ? '' : payload.CNAME[i]);
                    if('PNALT' in payload) param['pnalt'] = String(payload.PNALT[i] == undefined ? '' : payload.PNALT[i]);
                    if('WERKS' in payload) param['werks'] = String(payload.WERKS[i] == undefined ? '' : payload.WERKS[i]);
                    if('PBTXT' in payload) param['pbtxt'] = String(payload.PBTXT[i] == undefined ? '' : payload.PBTXT[i]);
                    if('BTRTL' in payload) param['btrtl'] = String(payload.BTRTL[i] == undefined ? '' : payload.BTRTL[i]);
                    if('BTRTX' in payload) param['btrtx'] = String(payload.BTRTX[i] == undefined ? '' : payload.BTRTX[i]);
                    if('ANSVH' in payload) param['ansvh'] = String(payload.ANSVH[i] == undefined ? '' : payload.ANSVH[i]);
                    if('ANSTX' in payload) param['anstx'] = String(payload.ANSTX[i] == undefined ? '' : payload.ANSTX[i]);
                    if('PERSG' in payload) param['persg'] = String(payload.PERSG[i] == undefined ? '' : payload.PERSG[i]);
                    if('PGTXT' in payload) param['pgtxt'] = String(payload.PGTXT[i] == undefined ? '' : payload.PGTXT[i]);
                    if('PERSK' in payload) param['persk'] = String(payload.PERSK[i] == undefined ? '' : payload.PERSK[i]);
                    if('PKTXT' in payload) param['pktxt'] = String(payload.PKTXT[i] == undefined ? '' : payload.PKTXT[i]);
                    if('TRFG0' in payload) param['trfg0'] = String(payload.TRFG0[i] == undefined ? '' : payload.TRFG0[i]);
                    if('TRFS0' in payload) param['trfs0'] = String(payload.TRFS0[i] == undefined ? '' : payload.TRFS0[i]);
                    if('TRFS0' in payload) param['gol'] = String(payload.GOL[i] == undefined ? '' : payload.GOL[i]);
                    if('SHORT' in payload) param['short'] = String(payload.SHORT[i] == undefined ? '' : payload.SHORT[i]);
                    if('GOL_MKG' in payload) param['gol_mkg'] = String(payload.GOL_MKG[i] == undefined ? '' : payload.GOL_MKG[i]);
                    if('PLANS' in payload) param['plans'] = String(payload.PLANS[i] == undefined ? '' : payload.PLANS[i]);
                    if('DIREK' in payload) param['direk'] = String(payload.DIREK[i] == undefined ? '' : payload.DIREK[i]);
                    if('DIREK_TEXT' in payload) param['direk_text'] = String(payload.DIREK_TEXT[i] == undefined ? '' : payload.DIREK_TEXT[i]);
                    if('SUBDI' in payload) param['subdi'] = String(payload.SUBDI[i] == undefined ? '' : payload.SUBDI[i]);
                    if('SUBDI_TEXT' in payload) param['subdi_text'] = String(payload.SUBDI_TEXT[i] == undefined ? '' : payload.SUBDI_TEXT[i]);
                    if('SEKSI' in payload) param['seksi'] = String(payload.SEKSI[i] == undefined ? '' : payload.SEKSI[i]);
                    if('SEKSI_TEXT' in payload) param['seksi_text'] = String(payload.SEKSI_TEXT[i] == undefined ? '' : payload.SEKSI_TEXT[i]);
                    if('SUBSI' in payload) param['subsi'] = String(payload.SUBSI[i] == undefined ? '' : payload.SUBSI[i]);
                    if('SUBSI_TEXT' in payload) param['subsi_text'] = String(payload.SUBSI_TEXT[i] == undefined ? '' : payload.SUBSI_TEXT[i]);
                    if('PLVAR' in payload) param['plvar'] = String(payload.PLVAR[i] == undefined ? '' : payload.PLVAR[i]);
                    param['program_name'] = 'WS_MDM';
                    if('KD_AKTIF' in payload) param['kd_aktif'] = String(payload.KD_AKTIF[i] == undefined ? '' : payload.KD_AKTIF[i]);
                    if('BEGDA' in payload) {
                        if(payload.BEGDA[i] != undefined) param['begda'] = new Date(String(payload.BEGDA[i]));
                    }
                    if('ENDA' in payload) {
                        if(payload.ENDA[i] != undefined) param['enda'] = new Date(String(payload.ENDA[i]));
                    }
                    if('PIN' in payload) param['pin'] =  String(payload.PIN[i] == undefined ? '' : payload.PIN[i]);
                    if('BEGDA_PIN' in payload) {
                        if(payload.BEGDA_PIN[i] != undefined) param['begda_pin'] = new Date(String(payload.BEGDA_PIN[i]));
                    }
                    if('ENDDA_PIN' in payload) {
                        if(payload.ENDDA_PIN[i] != undefined) param['endda_pin'] = new Date(String(payload.ENDDA_PIN[i]));
                    }
                    if('WERKS_PIN' in payload) param['werks_pin'] = String(payload.WERKS_PIN[i] == undefined ? '' : payload.WERKS_PIN[i]);
                    if('COST_CENTER' in payload) param['cost_center'] = String(payload.COST_CENTER[i] == undefined ? '' : payload.COST_CENTER[i]);
                    if('LO_ID' in payload) param['lo_id'] = String(payload.LO_ID[i] == undefined ? '' : payload.LO_ID[i]);
                    if('BANK_KEY' in payload) param['bank_key'] = String(payload.BANK_KEY[i] == undefined ? '' : payload.BANK_KEY[i]);
                    if('BANK_NAME' in payload) param['bank_name'] = String(payload.BANK_NAME[i] == undefined ? '' : payload.BANK_NAME[i]);
                    if('BANK_ACCOUNT' in payload) param['bank_account'] = String(payload.BANK_ACCOUNT[i] == undefined ? '' : payload.BANK_ACCOUNT[i]);
                    if('PNALT_NEW' in payload) param['pnalt_new'] = String(payload.PNALT_NEW[i] == undefined ? '' : payload.PNALT_NEW[i]);
                    if('WERKS_NEW' in payload) param['werks_new'] = String(payload.WERKS_NEW[i] == undefined ? '' : payload.WERKS_NEW[i]);
                    if('PBTXT_NEW' in payload) param['pbtxt_new'] = String(payload.PBTXT_NEW[i] == undefined ? '' : payload.PBTXT_NEW[i]);
                    if('BTRTL_NEW' in payload) param['btrtl_new'] = String(payload.BTRTL_NEW[i] == undefined ? '' : payload.BTRTL_NEW[i]);
                    if('BTRTX_NEW' in payload) param['btrtx_new'] = String(payload.BTRTX_NEW[i] == undefined ? '' : payload.BTRTX_NEW[i]);
                    if('PAYSCALETYPE' in payload) param['payscaletype'] = String(payload.PAYSCALETYPE[i] == undefined ? '' : payload.PAYSCALETYPE[i]);
                    if('PAYSCALETYPETEXT' in payload) param['payscaletypetext'] = String(payload.PAYSCALETYPETEXT[i] == undefined ? '' : payload.PAYSCALETYPETEXT[i]);
                    if('PAYROLLAREA' in payload) param['payrollarea'] = String(payload.PAYROLLAREA[i] == undefined ? '' : payload.PAYROLLAREA[i]);
                    if('PAYROLLAREATEXT' in payload) param['payrollareatext'] = String(payload.PAYROLLAREATEXT[i] == undefined ? '' : payload.PAYROLLAREATEXT[i]);
                    if('TRAVELCOSTCENTER' in payload) param['travelcostcenter'] = String(payload.TRAVELCOSTCENTER[i] == undefined ? '' : payload.TRAVELCOSTCENTER[i]);
                    if('TMTMULAIBEKERJA' in payload) {
                        if(payload.TMTMULAIBEKERJA[i] != undefined) param['tmtmulaibekerja'] = new Date(String(payload.TMTMULAIBEKERJA[i]));
                    }
                    if('TMTDIANGKATPEGAWAI' in payload) {
                        if(payload.TMTDIANGKATPEGAWAI[i] != undefined) param['tmtdiangkatpegawai'] = new Date(String(payload.TMTDIANGKATPEGAWAI[i]));
                    }
                    if('TMTKELASJABATAN' in payload) {
                        if(payload.TMTKELASJABATAN[i] != undefined) param['tmtkelasjabatan'] = new Date(String(payload.TMTKELASJABATAN[i]));
                    }
                    if('TMTJABATAN' in payload) {
                        if(payload.TMTJABATAN[i] != undefined) param['tmtjabatan'] = new Date(String(payload.TMTJABATAN[i]));
                    }
                    if('TMTPENSIUN' in payload) {
                        if(payload.TMTPENSIUN[i] != undefined) param['tmtpensiun'] = new Date(String(payload.TMTPENSIUN[i]));
                    }
                    if('GENERALTEXTORG' in payload) param['generaltextorg'] = String(payload.GENERALTEXTORG[i] == undefined ? '' : payload.GENERALTEXTORG[i]);
                    if('GENERALTEXTPOS' in payload) param['generaltextpos'] = String(payload.GENERALTEXTPOS[i] == undefined ? '' : payload.GENERALTEXTPOS[i]);
                    if('GENERAL_TEXT_POS' in payload) param['general_text_pos'] = String(payload.GENERAL_TEXT_POS[i] == undefined ? '' : payload.GENERAL_TEXT_POS);
                    if('TMT_GOLONGAN' in payload) {
                        if(payload.TMT_GOLONGAN[i] != undefined) param['tmt_golongan'] = new Date(String(payload.TMT_GOLONGAN[i]));
                    }
                    if('NOMOR_SK' in payload) param['nomor_sk'] = String(payload.NOMOR_SK[i] == undefined ? '' : payload.NOMOR_SK[i]);
                    if('TANGGAL_SK' in payload) {
                        if(payload.TANGGAL_SK[i] != undefined) param['tanggal_sk'] = new Date(String(payload.TANGGAL_SK[i]));
                    } 
                    if('POSISI_2021' in payload) param['posisi_2021'] = String(payload.POSISI_2021[i] == undefined ? '' : payload.POSISI_2021[i]); 
                    if('KJPOSISI_2021' in payload) param['kjposisi_2021'] = String(payload.KJPOSISI_2021[i] == undefined ? '' : payload.KJPOSISI_2021[i]);
                    if('TMT_PERIODIK' in payload) {
                        if(payload.TMT_PERIODIK[i] != undefined) param['tmt_periodik'] = new Date(String(payload.TMT_PERIODIK[i]));
                    }
                    if('JOBID' in payload) param['jobid'] = String(payload.JOBID[i] == undefined ? '' : payload.JOBID[i]);
                    if('JOBNAME' in payload) param['jobname'] = String(payload.JOBNAME[i] == undefined ? '' : payload.JOBNAME[i]);
                    if('KJ_POSISI' in payload) param['kj_posisi'] = String(payload.KJ_POSISI[i] == undefined ? '' : payload.KJ_POSISI[i]);
                    if('KJ_POSISI_NEW' in payload) param['kj_posisi_new'] = String(payload.KJ_POSISI_NEW[i] == undefined ? '' : payload.KJ_POSISI_NEW[i]);
                    if('KJ_NEW' in payload) param['kj_new'] = String(payload.KJ_NEW[i] == undefined ? '' : payload.KJ_NEW[i]);
                    if('JOB_POINT' in payload) param['job_point'] = String(payload.JOB_POINT[i] == undefined ? '' : payload.JOB_POINT[i]);
                    if('JENIS_PEKERJA' in payload) param['jenis_pekerja'] = String(payload.JENIS_PEKERJA[i] == undefined ? '' : payload.JENIS_PEKERJA[i]);
                    if('PERSG_PARENT_CONSOL' in payload) param['persg_parent_consol'] = String(payload.PERSG_PARENT_CONSOL[i] == undefined ? '' : payload.PERSG_PARENT_CONSOL[i]);
                    if('PERSK_PARENT_CONSOL' in payload) param['persk_parent_consol'] = String(payload.PERSK_PARENT_CONSOL[i] == undefined ? '' : payload.PERSK_PARENT_CONSOL[i]);
                    if('PERSG_CHILD_CONSOL' in payload) param['persg_child_consol'] = String(payload.PERSG_CHILD_CONSOL[i] == undefined ? '' : payload.PERSG_CHILD_CONSOL[i]);
                    if('PERSK_CHILD_CONSOL' in payload) param['persk_child_consol'] = String(payload.PERSK_CHILD_CONSOL[i] == undefined ? '' : payload.PERSK_CHILD_CONSOL[i]);
                    if('EMPSTAT_PARENT_CONSOL' in payload) param['empstat_parent_consol'] = String(payload.EMPSTAT_PARENT_CONSOL[i] == undefined ? '' : payload.EMPSTAT_PARENT_CONSOL[i]);
                    if('EMPSTAT_CHILD_CONSOL' in payload) param['empstat_child_consol'] = String(payload.EMPSTAT_CHILD_CONSOL[i] == undefined ? '' : payload.EMPSTAT_CHILD_CONSOL[i]);
                    if('TRFG0_SOURCE' in payload) param['trfg0_source'] = String(payload.TRFG0_SOURCE[i] == undefined ? '' : payload.TRFG0_SOURCE[i]);
                    if('TRFS0_SOURCE' in payload) param['trfs0_source'] = String(payload.TRFS0_SOURCE[i] == undefined ? '' : payload.TRFS0_SOURCE[i]);
                    if('CREATED_BY' in payload) param['created_by'] =  String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                    if('LAST_UPDATED_BY' in payload) param['last_updated_by'] =  String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);
                    if('LAST_UPDATED_DATE' in payload) {
                        if(payload.LAST_UPDATED_DATE[i] != undefined) param['last_updated_date'] = new Date(String(payload.LAST_UPDATED_DATE[i]));
                    }
                    
                    await SafmPerubahanOrganisasi.query()
                        .where('pernr', String(payload.PERNR[i]))
                        .andWhere('company_code', String(payload.COMPANY_CODE[i]))
                        .andWhereRaw(`TRUNC("begda") = TO_DATE(?, 'yyyy/mm/dd')`, [String(payload.BEGDA[i]).replace(/-/g, "/")])
                        .update(param);

                    saved.push(true);
                } else {
                    // insert data input
                    const insert = new SafmPerubahanOrganisasi();
                    insert.pernr = String(payload.PERNR[i] == undefined ? '' : payload.PERNR[i]);
                    if('COMPANY_CODE' in payload) insert.company_code =  String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                    if('CNAME' in payload) insert.cname = String(payload.CNAME[i] == undefined ? '' : payload.CNAME[i]);
                    if('PNALT' in payload) insert.pnalt = String(payload.PNALT[i] == undefined ? '' : payload.PNALT[i]);
                    if('WERKS' in payload) insert.werks = String(payload.WERKS[i] == undefined ? '' : payload.WERKS[i]);
                    if('PBTXT' in payload) insert.pbtxt = String(payload.PBTXT[i] == undefined ? '' : payload.PBTXT[i]);
                    if('BTRTL' in payload) insert.btrtl = String(payload.BTRTL[i] == undefined ? '' : payload.BTRTL[i]);
                    if('BTRTX' in payload) insert.btrtx = String(payload.BTRTX[i] == undefined ? '' : payload.BTRTX[i]);
                    if('ANSVH' in payload) insert.ansvh = String(payload.ANSVH[i] == undefined ? '' : payload.ANSVH[i]);
                    if('ANSTX' in payload) insert.anstx = String(payload.ANSTX[i] == undefined ? '' : payload.ANSTX[i]);
                    if('PERSG' in payload) insert.persg = String(payload.PERSG[i] == undefined ? '' : payload.PERSG[i]);
                    if('PGTXT' in payload) insert.pgtxt = String(payload.PGTXT[i] == undefined ? '' : payload.PGTXT[i]);
                    if('PERSK' in payload) insert.persk = String(payload.PERSK[i] == undefined ? '' : payload.PERSK[i]);
                    if('PKTXT' in payload) insert.pktxt = String(payload.PKTXT[i] == undefined ? '' : payload.PKTXT[i]);
                    if('TRFG0' in payload) insert.trfg0 = String(payload.TRFG0[i] == undefined ? '' : payload.TRFG0[i]);
                    if('TRFS0' in payload) insert.trfs0 = String(payload.TRFS0[i] == undefined ? '' : payload.TRFS0[i]);
                    if('TRFS0' in payload) insert.gol = String(payload.GOL[i] == undefined ? '' : payload.GOL[i]);
                    if('SHORT' in payload) insert.short = String(payload.SHORT[i] == undefined ? '' : payload.SHORT[i]);
                    if('GOL_MKG' in payload) insert.gol_mkg = String(payload.GOL_MKG[i] == undefined ? '' : payload.GOL_MKG[i]);
                    if('PLANS' in payload) insert.plans = String(payload.PLANS[i] == undefined ? '' : payload.PLANS[i]);
                    if('DIREK' in payload) insert.direk = String(payload.DIREK[i] == undefined ? '' : payload.DIREK[i]);
                    if('DIREK_TEXT' in payload) insert.direk_text = String(payload.DIREK_TEXT[i] == undefined ? '' : payload.DIREK_TEXT[i]);
                    if('SUBDI' in payload) insert.subdi = String(payload.SUBDI[i] == undefined ? '' : payload.SUBDI[i]);
                    if('SUBDI_TEXT' in payload) insert.subdi_text = String(payload.SUBDI_TEXT[i] == undefined ? '' : payload.SUBDI_TEXT[i]);
                    if('SEKSI' in payload) insert.seksi = String(payload.SEKSI[i] == undefined ? '' : payload.SEKSI[i]);
                    if('SEKSI_TEXT' in payload) insert.seksi_text = String(payload.SEKSI_TEXT[i] == undefined ? '' : payload.SEKSI_TEXT[i]);
                    if('SUBSI' in payload) insert.subsi = String(payload.SUBSI[i] == undefined ? '' : payload.SUBSI[i]);
                    if('SUBSI_TEXT' in payload) insert.subsi_text = String(payload.SUBSI_TEXT[i] == undefined ? '' : payload.SUBSI_TEXT[i]);
                    if('PLVAR' in payload) insert.plvar = String(payload.PLVAR[i] == undefined ? '' : payload.PLVAR[i]);
                    insert.program_name = 'WS_MDM';
                    if('KD_AKTIF' in payload) insert.kd_aktif = String(payload.KD_AKTIF[i] == undefined ? '' : payload.KD_AKTIF[i]);
                    if('BEGDA' in payload) {
                        if(payload.BEGDA[i] != undefined) insert.begda = new Date(String(payload.BEGDA[i]));
                    }
                    if('ENDA' in payload) {
                        if(payload.ENDA[i] != undefined) insert.enda = new Date(String(payload.ENDA[i]));
                    }
                    if('PIN' in payload) insert.pin =  String(payload.PIN[i] == undefined ? '' : payload.PIN[i]);
                    if('BEGDA_PIN' in payload) {
                        if(payload.BEGDA_PIN[i] != undefined) insert.begda_pin = new Date(String(payload.BEGDA_PIN[i]));
                    }
                    if('ENDDA_PIN' in payload) {
                        if(payload.ENDDA_PIN[i] != undefined) insert.endda_pin = new Date(String(payload.ENDDA_PIN[i]));
                    }
                    if('WERKS_PIN' in payload) insert.werks_pin = String(payload.WERKS_PIN[i] == undefined ? '' : payload.WERKS_PIN[i]);
                    if('COST_CENTER' in payload) insert.cost_center = String(payload.COST_CENTER[i] == undefined ? '' : payload.COST_CENTER[i]);
                    if('LO_ID' in payload) insert.lo_id = String(payload.LO_ID[i] == undefined ? '' : payload.LO_ID[i]);
                    if('BANK_KEY' in payload) insert.bank_key = String(payload.BANK_KEY[i] == undefined ? '' : payload.BANK_KEY[i]);
                    if('BANK_NAME' in payload) insert.bank_name = String(payload.BANK_NAME[i] == undefined ? '' : payload.BANK_NAME[i]);
                    if('BANK_ACCOUNT' in payload) insert.bank_account = String(payload.BANK_ACCOUNT[i] == undefined ? '' : payload.BANK_ACCOUNT[i]);
                    if('PNALT_NEW' in payload) insert.pnalt_new = String(payload.PNALT_NEW[i] == undefined ? '' : payload.PNALT_NEW[i]);
                    if('WERKS_NEW' in payload) insert.werks_new = String(payload.WERKS_NEW[i] == undefined ? '' : payload.WERKS_NEW[i]);
                    if('PBTXT_NEW' in payload) insert.pbtxt_new = String(payload.PBTXT_NEW[i] == undefined ? '' : payload.PBTXT_NEW[i]);
                    if('BTRTL_NEW' in payload) insert.btrtl_new = String(payload.BTRTL_NEW[i] == undefined ? '' : payload.BTRTL_NEW[i]);
                    if('BTRTX_NEW' in payload) insert.btrtx_new = String(payload.BTRTX_NEW[i] == undefined ? '' : payload.BTRTX_NEW[i]);
                    if('PAYSCALETYPE' in payload) insert.payscaletype = String(payload.PAYSCALETYPE[i] == undefined ? '' : payload.PAYSCALETYPE[i]);
                    if('PAYSCALETYPETEXT' in payload) insert.payscaletypetext = String(payload.PAYSCALETYPETEXT[i] == undefined ? '' : payload.PAYSCALETYPETEXT[i]);
                    if('PAYROLLAREA' in payload) insert.payrollarea = String(payload.PAYROLLAREA[i] == undefined ? '' : payload.PAYROLLAREA[i]);
                    if('PAYROLLAREATEXT' in payload) insert.payrollareatext = String(payload.PAYROLLAREATEXT[i] == undefined ? '' : payload.PAYROLLAREATEXT[i]);
                    if('TRAVELCOSTCENTER' in payload) insert.travelcostcenter = String(payload.TRAVELCOSTCENTER[i] == undefined ? '' : payload.TRAVELCOSTCENTER[i]);
                    if('TMTMULAIBEKERJA' in payload) {
                        if(payload.TMTMULAIBEKERJA[i] != undefined) insert.tmtmulaibekerja = new Date(String(payload.TMTMULAIBEKERJA[i]));
                    }
                    if('TMTDIANGKATPEGAWAI' in payload) {
                        if(payload.TMTDIANGKATPEGAWAI[i] != undefined) insert.tmtdiangkatpegawai = new Date(String(payload.TMTDIANGKATPEGAWAI[i]));
                    }
                    if('TMTKELASJABATAN' in payload) {
                        if(payload.TMTKELASJABATAN[i] != undefined) insert.tmtkelasjabatan = new Date(String(payload.TMTKELASJABATAN[i]));
                    }
                    if('TMTJABATAN' in payload) {
                        if(payload.TMTJABATAN[i] != undefined) insert.tmtjabatan = new Date(String(payload.TMTJABATAN[i]));
                    }
                    if('TMTPENSIUN' in payload) {
                        if(payload.TMTPENSIUN[i] != undefined) insert.tmtpensiun = new Date(String(payload.TMTPENSIUN[i]));
                    }
                    if('GENERALTEXTORG' in payload) insert.generaltextorg = String(payload.GENERALTEXTORG[i] == undefined ? '' : payload.GENERALTEXTORG[i]);
                    if('GENERALTEXTPOS' in payload) insert.generaltextpos = String(payload.GENERALTEXTPOS[i] == undefined ? '' : payload.GENERALTEXTPOS[i]);
                    if('GENERAL_TEXT_POS' in payload) insert.general_text_pos = String(payload.GENERAL_TEXT_POS[i] == undefined ? '' : payload.GENERAL_TEXT_POS);
                    if('TMT_GOLONGAN' in payload) {
                        if(payload.TMT_GOLONGAN[i] != undefined) insert.tmt_golongan = new Date(String(payload.TMT_GOLONGAN[i]));
                    }
                    if('NOMOR_SK' in payload) insert.nomor_sk = String(payload.NOMOR_SK[i] == undefined ? '' : payload.NOMOR_SK[i]);
                    if('TANGGAL_SK' in payload) {
                        if(payload.TANGGAL_SK[i] != undefined) insert.tanggal_sk = new Date(String(payload.TANGGAL_SK[i]));
                    } 
                    if('POSISI_2021' in payload) insert.posisi_2021 = String(payload.POSISI_2021[i] == undefined ? '' : payload.POSISI_2021[i]); 
                    if('KJPOSISI_2021' in payload) insert.kjposisi_2021 = String(payload.KJPOSISI_2021[i] == undefined ? '' : payload.KJPOSISI_2021[i]);
                    if('TMT_PERIODIK' in payload) {
                        if(payload.TMT_PERIODIK[i] != undefined) insert.tmt_periodik = new Date(String(payload.TMT_PERIODIK[i]));
                    }
                    if('JOBID' in payload) insert.jobid = String(payload.JOBID[i] == undefined ? '' : payload.JOBID[i]);
                    if('JOBNAME' in payload) insert.jobname = String(payload.JOBNAME[i] == undefined ? '' : payload.JOBNAME[i]);
                    if('KJ_POSISI' in payload) insert.kj_posisi = String(payload.KJ_POSISI[i] == undefined ? '' : payload.KJ_POSISI[i]);
                    if('KJ_POSISI_NEW' in payload) insert.kj_posisi_new = String(payload.KJ_POSISI_NEW[i] == undefined ? '' : payload.KJ_POSISI_NEW[i]);
                    if('KJ_NEW' in payload) insert.kj_new = String(payload.KJ_NEW[i] == undefined ? '' : payload.KJ_NEW[i]);
                    if('JOB_POINT' in payload) insert.job_point = String(payload.JOB_POINT[i] == undefined ? '' : payload.JOB_POINT[i]);
                    if('JENIS_PEKERJA' in payload) insert.jenis_pekerja = String(payload.JENIS_PEKERJA[i] == undefined ? '' : payload.JENIS_PEKERJA[i]);
                    if('PERSG_PARENT_CONSOL' in payload) insert.persg_parent_consol = String(payload.PERSG_PARENT_CONSOL[i] == undefined ? '' : payload.PERSG_PARENT_CONSOL[i]);
                    if('PERSK_PARENT_CONSOL' in payload) insert.persk_parent_consol = String(payload.PERSK_PARENT_CONSOL[i] == undefined ? '' : payload.PERSK_PARENT_CONSOL[i]);
                    if('PERSG_CHILD_CONSOL' in payload) insert.persg_child_consol = String(payload.PERSG_CHILD_CONSOL[i] == undefined ? '' : payload.PERSG_CHILD_CONSOL[i]);
                    if('PERSK_CHILD_CONSOL' in payload) insert.persk_child_consol = String(payload.PERSK_CHILD_CONSOL[i] == undefined ? '' : payload.PERSK_CHILD_CONSOL[i]);
                    if('EMPSTAT_PARENT_CONSOL' in payload) insert.empstat_parent_consol = String(payload.EMPSTAT_PARENT_CONSOL[i] == undefined ? '' : payload.EMPSTAT_PARENT_CONSOL[i]);
                    if('EMPSTAT_CHILD_CONSOL' in payload) insert.empstat_child_consol = String(payload.EMPSTAT_CHILD_CONSOL[i] == undefined ? '' : payload.EMPSTAT_CHILD_CONSOL[i]);
                    if('TRFG0_SOURCE' in payload) insert.trfg0_source = String(payload.TRFG0_SOURCE[i] == undefined ? '' : payload.TRFG0_SOURCE[i]);
                    if('TRFS0_SOURCE' in payload) insert.trfs0_source = String(payload.TRFS0_SOURCE[i] == undefined ? '' : payload.TRFS0_SOURCE[i]);
                    if('CREATED_BY' in payload) insert.created_by =  String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                    if('LAST_UPDATED_BY' in payload) insert.last_updated_by =  String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);
                    await insert.save();
    
                    if(insert.$isPersisted) saved.push(true);
                }
            }

            if(inserted && updated) {
                action = 'insert & update';
            } else if(inserted || updated) {
                action = inserted ? 'insert' : 'update'; 
            }
            
            if(saved.length == pernrLength) {
                const respon = {
                    status_code : 200,
                    message : `Success to ${action} Perubahan Organisasi New`,
                    pernr : String(pernr),
                    company_code : String(company_code)
                }
    
                return respon;
            } else {
                throw new Error(`Fail to ${action} Perubahan Organisasi new`);
            }

        } catch(error) {
            const respon = {
                status_code : 500,
                message : String(error)
            }

            return respon;
        }

    }


    public async insertDisability({ request, auth }: HttpContextContract) {
        
        await auth.use('api').authenticate();
        
        try {
            
            const payload = await Parser.convertXMLToJSON(request.raw());
            
            // cek apakah payload yang diterima sesuai dengan servisnya
            for(let i = 1; i < Object.keys(payload).length; i++) {
                if(!Disability.$hasColumn(String(Object.keys(payload)[i]).toLowerCase())) {
                    throw new Error("Data tidak valid");
                }
            }

            let action = 'either insert & update';
            let saved: boolean[] = [];
            let inserted = false, updated = false;
            const pernr = [...new Set(payload.PERNR.map(item => item))];
            const company_code = [...new Set(payload.COMPANY_CODE.map(item => item))];
            const pernrLength = Object.keys(payload.PERNR).length;
            
            for(let i = 0; i < pernrLength; i++) {
                const data = await Disability.query()
                                .where('pernr', String(payload.PERNR[i]))
                                .andWhere('company_code', String(payload.COMPANY_CODE[i]));
                                // .andWhereRaw(`TRUNC("tmt_mulai") = TO_DATE(?, 'yyyy/mm/dd')`, [String(payload.TMT_MULAI[i]).replace(/-/g, "/")]);
                
                if(data.length == 0) {
                    // insert
                    const insert = new Disability();
                    insert.pernr = String(payload.PERNR[i] == undefined ? '' : payload.PERNR[i]);
                    if('NIPP' in payload) insert.nipp = String(payload.NIPP[i] == undefined ? '' : payload.NIPP[i]);
                    if('GENDER' in payload) insert.gender = String(payload.GENDER[i] == undefined ? '' : payload.GENDER[i]);
                    if('TMT_MULAI' in payload) {
                        if(payload.TMT_MULAI[i] != undefined) insert.tmt_mulai = new Date(String(payload.TMT_MULAI[i]));
                    }
                    if('PERSG' in payload) insert.persg = String(payload.PERSG[i] == undefined ? '' : payload.PERSG[i]);
                    if('PERSG_TXT' in payload) insert.persg_txt = String(payload.PERSG_TXT[i] == undefined ? '' : payload.PERSG_TXT[i]);
                    if('PERSK' in payload) insert.persk = String(payload.PERSK[i] == undefined ? '' : payload.PERSK[i]);
                    if('PERSK_TXT' in payload) insert.persk_txt = String(payload.PERSK_TXT[i] == undefined ? '' : payload.PERSK_TXT[i]);
                    if('WERKS' in payload) insert.werks = String(payload.WERKS[i] == undefined ? '' : payload.WERKS[i]);
                    if('WERKS_TXT' in payload) insert.werks_txt = String(payload.WERKS_TXT[i] == undefined ? '' : payload.WERKS_TXT[i]);
                    if('BTRTL' in payload) insert.btrtl = String(payload.BTRTL[i] == undefined ? '' : payload.BTRTL[i]);
                    if('BTRTL_TXT' in payload) insert.btrtl_txt = String(payload.BTRTL_TXT[i] == undefined ? '' : payload.BTRTL_TXT[i]);
                    if('PLANS' in payload) insert.plans = String(payload.PLANS[i] == undefined ? '' : payload.PLANS[i]);
                    if('PLANS_TXT' in payload) insert.plans_txt = String(payload.PLANS_TXT[i] == undefined ? '' : payload.PLANS_TXT[i]);
                    if('ANSVH' in payload) insert.ansvh = String(payload.ANSVH[i] == undefined ? '' : payload.ANSVH[i]);
                    if('ANSVH_TXT' in payload) insert.ansvh_txt = String(payload.ANSVH_TXT[i] == undefined ? '' : payload.ANSVH_TXT[i]);
                    if('EXDAT' in payload) {
                        if(payload.EXDAT[i] != undefined) insert.exdat = new Date(String(payload.EXDAT[i]));
                    }
                    if('DISAB' in payload) insert.disab = String(payload.DISAB[i] == undefined ? '' : payload.DISAB[i]);
                    if('DISAB_TXT' in payload) insert.disab_txt = String(payload.DISAB_TXT[i] == undefined ? '' : payload.DISAB_TXT[i]);
                    if('DISAB_DESC' in payload) insert.disab_desc = String(payload.DISAB_DESC[i] == undefined ? '' : payload.DISAB_DESC[i]);
                    if('ORG_PATH' in payload) insert.org_path = String(payload.ORG_PATH[i] == undefined ? '' : payload.ORG_PATH[i]);
                    if('COMPANY_CODE' in payload) insert.company_code = String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                    if('CREATED_BY' in payload) insert.created_by = String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                    if('LAST_UPDATED_BY' in payload) insert.last_updated_by = String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);
                    await insert.save();
    
                    if(insert.$isPersisted) saved.push(true);
                    inserted = true;
                } else {
                    // update
                    const param = {}

                    if('NIPP' in payload) param['nipp'] = String(payload.NIPP[i] == undefined ? '' : payload.NIPP[i]);
                    if('GENDER' in payload) param['gender'] = String(payload.GENDER[i] == undefined ? '' : payload.GENDER[i]);
                    if('TMT_MULAI' in payload) {
                        if(payload.TMT_MULAI[i] != undefined) param['tmt_mulai'] = new Date(String(payload.TMT_MULAI[i]));
                    }
                    if('PERSG' in payload) param['persg'] = String(payload.PERSG[i] == undefined ? '' : payload.PERSG[i]);
                    if('PERSG_TXT' in payload) param['persg_txt'] = String(payload.PERSG_TXT[i] == undefined ? '' : payload.PERSG_TXT[i]);
                    if('PERSK' in payload) param['persk'] = String(payload.PERSK[i] == undefined ? '' : payload.PERSK[i]);
                    if('PERSK_TXT' in payload) param['persk_txt'] = String(payload.PERSK_TXT[i] == undefined ? '' : payload.PERSK_TXT[i]);
                    if('WERKS' in payload) param['werks'] = String(payload.WERKS[i] == undefined ? '' : payload.WERKS[i]);
                    if('WERKS_TXT' in payload) param['werks_txt'] = String(payload.WERKS_TXT[i] == undefined ? '' : payload.WERKS_TXT[i]);
                    if('BTRTL' in payload) param['btrtl'] = String(payload.BTRTL[i] == undefined ? '' : payload.BTRTL[i]);
                    if('BTRTL_TXT' in payload) param['btrtl_txt'] = String(payload.BTRTL_TXT[i] == undefined ? '' : payload.BTRTL_TXT[i]);
                    if('PLANS' in payload) param['plans'] = String(payload.PLANS[i] == undefined ? '' : payload.PLANS[i]);
                    if('PLANS_TXT' in payload) param['plans_txt'] = String(payload.PLANS_TXT[i] == undefined ? '' : payload.PLANS_TXT[i]);
                    if('ANSVH' in payload) param['ansvh'] = String(payload.ANSVH[i] == undefined ? '' : payload.ANSVH[i]);
                    if('ANSVH_TXT' in payload) param['ansvh_txt'] = String(payload.ANSVH_TXT[i] == undefined ? '' : payload.ANSVH_TXT[i]);
                    if('EXDAT' in payload) {
                        if(payload.EXDAT[i] != undefined) param['exdat'] = new Date(String(payload.EXDAT[i]));
                    }
                    if('DISAB' in payload) param['disab'] = String(payload.DISAB[i] == undefined ? '' : payload.DISAB[i]);
                    if('DISAB_TXT' in payload) param['disab_txt'] = String(payload.DISAB_TXT[i] == undefined ? '' : payload.DISAB_TXT[i]);
                    if('DISAB_DESC' in payload) param['disab_desc'] = String(payload.DISAB_DESC[i] == undefined ? '' : payload.DISAB_DESC[i]);
                    if('ORG_PATH' in payload) param['org_path'] = String(payload.ORG_PATH[i] == undefined ? '' : payload.ORG_PATH[i]);
                    if('COMPANY_CODE' in payload) param['company_code'] = String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                    if('CREATED_BY' in payload) param['created_by'] = String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                    if('LAST_UPDATED_BY' in payload) param['last_updated_by'] = String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);

                    await Disability.query()
                        .where('pernr', String(payload.PERNR[i]))
                        .andWhere('company_code', String(payload.COMPANY_CODE[i]))
                        .update(param);
    
                    saved.push(true);
                    updated = true;
                }
            }

            if(inserted && updated) {
                action = 'insert & update';
            } else if(inserted || updated) {
                action = inserted ? 'insert' : 'update';
            }

            if(saved.length == pernrLength) {
                const respon = {
                    status_code : 200,
                    message : `Success ${action} Disabilty`,
                    pernr : String(pernr),
                    company_code : String(company_code)
                }
    
                return respon;
            } else {
                throw new Error(`Fail ${action} Disability`);
            }

        } catch(error) {
            const respon = {
                status_code : 500,
                message : String(error)
            }

            return respon;
        }

    }


    public async insertCutiSppd({ request, auth }: HttpContextContract) {
        
        await auth.use('api').authenticate();
        
        try {
            const payload = await Parser.convertXMLToJSON(request.raw());
            
            // cek apakah payload yang diterima sesuai dengan servisnya
            for(let i = 1; i < Object.keys(payload).length; i++) {
                if(!CutiSppd.$hasColumn(String(Object.keys(payload)[i]).toLowerCase())) {
                    throw new Error("Data tidak valid");
                }
            }

            let action = 'either insert & update';
            let saved: boolean[] = [];
            let inserted = false, updated = false;
            const pernr = [...new Set(payload.PERNR.map(item => item))];
            const company_code = [...new Set(payload.COMPANY_CODE.map(item => item))];
            const pernrLength = Object.keys(payload.PERNR).length;
            
            for(let i = 0; i < pernrLength; i++) {
                const data = await CutiSppd.query()
                                .where('pernr', String(payload.PERNR[i]))
                                .andWhere('company_code', String(payload.COMPANY_CODE[i]))
                                .andWhereRaw(`TRUNC("start_date") = TO_DATE(?, 'yyyy/mm/dd')`, [String(payload.START_DATE[i]).replace(/-/g, "/")]);

                if(data.length == 0) {
                    // insert
                    const insert = new CutiSppd();
                    insert.pernr = String(payload.PERNR[i] == undefined ? '' : payload.PERNR[i]);
                    if('FULL_NAME' in payload) insert.full_name = String(payload.FULL_NAME[i] == undefined ? '' : payload.FULL_NAME[i]);
                    if('PERSONEL_AREA' in payload) insert.personel_area = String(payload.PERSONEL_AREA[i] == undefined ? '' : payload.PERSONEL_AREA[i]);
                    if('PERSONEL_SUB_AREA' in payload) insert.personel_sub_area = String(payload.PERSONEL_SUB_AREA[i] == undefined ? '' : payload.PERSONEL_SUB_AREA[i]);
                    if('ATT_ABSENCE_TYPE' in payload) insert.att_absence_type = String(payload.ATT_ABSENCE_TYPE[i] == undefined ? '' : payload.ATT_ABSENCE_TYPE[i]);
                    if('ATT_TYPE_TEXT' in payload) insert.att_type_text = String(payload.ATT_TYPE_TEXT[i] == undefined ? '' : payload.ATT_TYPE_TEXT[i]);
                    if('STATUS' in payload) insert.status = String(payload.STATUS[i] == undefined ? '' : payload.STATUS[i]);
                    if('START_DATE' in payload) {
                        if(payload.START_DATE[i] != undefined) insert.start_date = new Date(String(payload.START_DATE[i]));
                    }
                    if('END_DATE' in payload) {
                        if(payload.END_DATE[i] != undefined) insert.end_date = new Date(String(payload.END_DATE[i]));
                    }
                    if('PLH' in payload) insert.plh = String(payload.PLH[i] == undefined ? '' : payload.PLH[i]);
                    if('PLHNAME' in payload) insert.plhname = String(payload.PLHNAME[i] == undefined ? '' : payload.PLHNAME[i]);
                    if('COMPANY_CODE' in payload) insert.company_code = String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                    if('CREATED_BY' in payload) insert.created_by = String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                    if('LAST_UPDATED_BY' in payload) insert.last_updated_by = String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);
                    await insert.save();
    
                    if(insert.$isPersisted) saved.push(true);
                    inserted = true;
                } else {
                    const param = {};

                    if('FULL_NAME' in payload) param['full_name'] = String(payload.FULL_NAME[i] == undefined ? '' : payload.FULL_NAME[i]);
                    if('PERSONEL_AREA' in payload) param['personel_area'] = String(payload.PERSONEL_AREA[i] == undefined ? '' : payload.PERSONEL_AREA[i]);
                    if('PERSONEL_SUB_AREA' in payload) param['personel_sub_area'] = String(payload.PERSONEL_SUB_AREA[i] == undefined ? '' : payload.PERSONEL_SUB_AREA[i]);
                    if('ATT_ABSENCE_TYPE' in payload) param['att_absence_type'] = String(payload.ATT_ABSENCE_TYPE[i] == undefined ? '' : payload.ATT_ABSENCE_TYPE[i]);
                    if('ATT_TYPE_TEXT' in payload) param['att_type_text'] = String(payload.ATT_TYPE_TEXT[i] == undefined ? '' : payload.ATT_TYPE_TEXT[i]);
                    if('STATUS' in payload) param['status'] = String(payload.STATUS[i] == undefined ? '' : payload.STATUS[i]);
                    if('START_DATE' in payload) {
                        if(payload.START_DATE[i] != undefined) param['start_date'] = new Date(String(payload.START_DATE[i]));
                    }
                    if('END_DATE' in payload) {
                        if(payload.END_DATE[i] != undefined) param['end_date'] = new Date(String(payload.END_DATE[i]));
                    }
                    if('PLH' in payload) param['plh'] = String(payload.PLH[i] == undefined ? '' : payload.PLH[i]);
                    if('PLHNAME' in payload) param['plhname'] = String(payload.PLHNAME[i] == undefined ? '' : payload.PLHNAME[i]);
                    if('COMPANY_CODE' in payload) param['company_code'] = String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                    if('CREATED_BY' in payload) param['created_by'] = String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                    if('LAST_UPDATED_BY' in payload) param['last_updated_by'] = String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);

                    await CutiSppd.query()
                        .where('pernr', String(payload.PERNR[i]))
                        .andWhere('company_code', String(payload.COMPANY_CODE[i]))
                        .andWhereRaw(`TRUNC("start_date") = TO_DATE(?, 'yyyy/mm/dd')`, [String(payload.START_DATE[i]).replace(/-/g, "/")])
                        .update(param);
    
                    saved.push(true);
                    updated = true;
                }

            }

            if(inserted && updated) {
                action = 'insert & update';
            } else if(inserted || updated) {
                action = inserted ? 'insert' : 'update';
            }

            if(saved.length == pernrLength) {
                const respon = {
                    status_code : 200,
                    message : `Success ${action} Cuti & SPPD`,
                    pernr : String(pernr),
                    company_code : String(company_code)
                }
    
                return respon;
            } else {
                throw new Error(`Fail ${action} Cuti & SPPD`);
            }

        } catch(error) {
            const respon = {
                status_code :500,
                message : String(error)
            }

            return respon;
        }

    }


    public async insertPelaksanaHarian({request, auth }: HttpContextContract) {
        
        await auth.use('api').authenticate();
        
        try {
            
            const payload = await Parser.convertXMLToJSON(request.raw());
            
            // cek apakah payload yang diterima sesuai dengan servisnya
            for(let i = 1; i < Object.keys(payload).length; i++) {
                if(!PelaksanaHarian.$hasColumn(String(Object.keys(payload)[i]).toLowerCase())) {
                    throw new Error("Data tidak valid");
                }
            }

            let action = 'either insert & update';
            let saved: boolean[] = [];
            let inserted = false, updated = false;
            const pernr = [...new Set(payload.PERNR.map(item => item))];
            const company_code = [...new Set(payload.COMPANY_CODE.map(item => item))];
            const pernrLength = Object.keys(payload.PERNR).length;

            for(let i = 0; i < pernrLength; i++) {
                const data = await PelaksanaHarian.query()
                                .where('pernr', String(payload.PERNR[i]))
                                .andWhere('company_code', String(payload.COMPANY_CODE[i]))
                                .andWhereRaw(`TRUNC("begda") = TO_DATE(?, 'yyyy/mm/dd')`, [String(payload.BEGDA[i]).replace(/-/g, "/")]);

                if(data.length == 0) {
                    // insert
                    const insert = new PelaksanaHarian();
                    insert.pernr = String(payload.PERNR[i] == undefined ? '' : payload.PERNR[i]);
                    if('NIPP' in payload) insert.nipp = String(payload.NIPP[i] == undefined ? '' : payload.NIPP[i]);
                    if('CNAME' in payload) insert.cname = String(payload.CNAME[i] == undefined ? '' : payload.CNAME[i]);
                    if('SUBTY' in payload) insert.subty = String(payload.SUBTY[i] == undefined ? '' : payload.SUBTY[i]);
                    if('SUBTY_TXT' in payload) insert.subty_txt = String(payload.SUBTY_TXT[i] == undefined ? '' : payload.SUBTY_TXT[i]);
                    if('BEGDA' in payload) {
                        if(payload.BEGDA[i] != undefined) insert.begda = new Date(String(payload.BEGDA[i]));
                    }
                    if('ENDDA' in payload) {
                        if(payload.ENDDA[i] != undefined) insert.endda = new Date(String(payload.ENDDA[i]));
                    }
                    if('PLANS' in payload) insert.plans = String(payload.PLANS[i] == undefined ? '' : payload.PLANS[i]);
                    if('PLANS_TXT' in payload) insert.plans_txt = String(payload.PLANS_TXT[i] == undefined ? '' : payload.PLANS_TXT[i]);
                    if('DPERNR' in payload) insert.dpernr = String(payload.DPERNR[i] == undefined ? '' : payload.DPERNR[i]);
                    if('DNIPP' in payload) insert.dnipp = String(payload.DNIPP[i] == undefined ? '' : payload.DNIPP[i]);
                    if('DCNAME' in payload) insert.dcname = String(payload.DCNAME[i] == undefined ? '' : payload.DCNAME[i]);
                    if('DPLANS' in payload) insert.dplans = String(payload.DPLANS[i] == undefined ? '' : payload.DPLANS[i]);
                    if('DPLANS_TXT' in payload) insert.dplans_txt = String(payload.DPLANS_TXT[i] == undefined ? '' : payload.DPLANS_TXT[i]);
                    if('WORKITEM_ID' in payload) insert.workitem_id = String(payload.WORKITEM_ID[i] == undefined ? '' : payload.WORKITEM_ID[i]);
                    if('COMPANY_CODE' in payload) insert.company_code = String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                    if('CREATED_BY' in payload) insert.created_by = String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                    if('LAST_UPDATED_BY' in payload) insert.last_updated_by = String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);
                    await insert.save();
    
                    if(insert.$isPersisted) saved.push(true);
                    inserted = true;
                } else {
                    // update
                    const param = {};

                    if('NIPP' in payload) param['nipp'] = String(payload.NIPP[i] == undefined ? '' : payload.NIPP[i]);
                    if('CNAME' in payload) param['cname'] = String(payload.CNAME[i] == undefined ? '' : payload.CNAME[i]);
                    if('SUBTY' in payload) param['subty'] = String(payload.SUBTY[i] == undefined ? '' : payload.SUBTY[i]);
                    if('SUBTY_TXT' in payload) param['subty_txt'] = String(payload.SUBTY_TXT[i] == undefined ? '' : payload.SUBTY_TXT[i]);
                    if('BEGDA' in payload) {
                        if(payload.BEGDA[i] != undefined) param['begda'] = new Date(String(payload.BEGDA[i]));
                    }
                    if('ENDDA' in payload) {
                        if(payload.ENDDA[i] != undefined) param['endda'] = new Date(String(payload.ENDDA[i]));
                    }
                    if('PLANS' in payload) param['plans'] = String(payload.PLANS[i] == undefined ? '' : payload.PLANS[i]);
                    if('PLANS_TXT' in payload) param['plans_txt'] = String(payload.PLANS_TXT[i] == undefined ? '' : payload.PLANS_TXT[i]);
                    if('DPERNR' in payload) param['dpernr'] = String(payload.DPERNR[i] == undefined ? '' : payload.DPERNR[i]);
                    if('DNIPP' in payload) param['dnipp'] = String(payload.DNIPP[i] == undefined ? '' : payload.DNIPP[i]);
                    if('DCNAME' in payload) param['dcname'] = String(payload.DCNAME[i] == undefined ? '' : payload.DCNAME[i]);
                    if('DPLANS' in payload) param['dplans'] = String(payload.DPLANS[i] == undefined ? '' : payload.DPLANS[i]);
                    if('DPLANS_TXT' in payload) param['dplans_txt'] = String(payload.DPLANS_TXT[i] == undefined ? '' : payload.DPLANS_TXT[i]);
                    if('WORKITEM_ID' in payload) param['workitem_id'] = String(payload.WORKITEM_ID[i] == undefined ? '' : payload.WORKITEM_ID[i]);
                    if('COMPANY_CODE' in payload) param['company_code'] = String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                    if('CREATED_BY' in payload) param['created_by'] = String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                    if('LAST_UPDATED_BY' in payload) param['last_updated_by'] = String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);

                    await PelaksanaHarian.query()
                        .where('pernr', String(payload.PERNR[i]))
                        .andWhere('company_code', String(payload.COMPANY_CODE[i]))
                        .andWhereRaw(`TRUNC("begda") = TO_DATE(?, 'yyyy/mm/dd')`, [String(payload.BEGDA[i]).replace(/-/g, "/")])
                        .update(param);
    
                    saved.push(true);
                    updated = true;
                }
            }

            if(inserted && updated) {
                action = 'insert & update';
            } else if(inserted || updated) {
                action = inserted ? 'insert' : 'update';
            }

            if(saved.length == pernrLength) {
                const respon = {
                    status_code : 200,
                    message : `Success ${action} Pelaksana Harian`,
                    pernr : String(pernr),
                    company_code : String(company_code)
                }
    
                return respon;
            } else {
                throw new Error(`Fail ${action} Pelaksana Harian`)
            }

        } catch(error) {
            const respon = {
                status_code : 500,
                message : String(error)
            }

            return respon;
        }

    }


    public async insertCauseOfDeath({request, auth }: HttpContextContract) {
        
        await auth.use('api').authenticate();
        
        try {
            const payload = await Parser.convertXMLToJSON(request.raw());

            if('ASL' in payload) {
                payload['ASAL'] = payload['ASL'];
                delete payload['ASL']
            }
            
            // cek apakah payload yang diterima sesuai dengan servisnya
            for(let i = 1; i < Object.keys(payload).length; i++) {
                if(!CauseOfDeath.$hasColumn(String(Object.keys(payload)[i]).toLowerCase())) {
                    throw new Error("Data tidak valid");
                }
            }

            let action = 'either insert & update';
            let saved: boolean[] = [];
            let inserted = false, updated = false;
            const pernr = [...new Set(payload.PERNR.map(item => item))];
            const company_code = [...new Set(payload.COMPANY_CODE.map(item => item))];
            const pernrLength = Object.keys(payload.PERNR).length;

            for(let i = 0; i < pernrLength; i++) {

                const data = await CauseOfDeath.query()
                                .where('pernr', String(payload.PERNR[i]))
                                .andWhere('company_code', String(payload.COMPANY_CODE[i]));
                
                if(data.length == 0) {
                    // insert
                    const insert = new CauseOfDeath();
                    insert.pernr = String(payload.PERNR[i] == undefined ? '' : payload.PERNR[i]);
                    if('NIPP' in payload) insert.nipp = String(payload.NIPP[i] == undefined ? '' : payload.NIPP[i]);
                    if('GENDER' in payload) insert.gender = String(payload.GENDER[i] == undefined ? '' : payload.GENDER[i]);
                    if('TMT_MULAI' in payload) {
                        if(payload.TMT_MULAI[i] != undefined) insert.tmt_mulai = new Date(String(payload.TMT_MULAI[i]));
                    }
                    if('PERSG' in payload) insert.persg = String(payload.PERSG[i] == undefined ? '' : payload.PERSG[i]);
                    if('PERSG_TXT' in payload) insert.persg_txt = String(payload.PERSG_TXT[i] == undefined ? '' : payload.PERSG_TXT[i]);
                    if('PERSK' in payload) insert.persk = String(payload.PERSK[i] == undefined ? '' : payload.PERSK[i]);
                    if('PERSK_TXT' in payload) insert.persk_txt = String(payload.PERSK_TXT[i] == undefined ? '' : payload.PERSK_TXT[i]);
                    if('WERKS' in payload) insert.werks = String(payload.WERKS[i] == undefined ? '' : payload.WERKS[i]);
                    if('WERKS_TXT' in payload) insert.werks_txt = String(payload.WERKS_TXT[i] == undefined ? '' : payload.WERKS_TXT[i]);
                    if('BTRTL' in payload) insert.btrtl = String(payload.BTRTL[i] == undefined ? '' : payload.BTRTL[i]);
                    if('BTRTL_TXT' in payload) insert.btrtl_txt = String(payload.BTRTL_TXT[i] == undefined ? '' : payload.BTRTL_TXT[i]);
                    if('ASAL' in payload) insert.asal = String(payload.ASAL[i] == undefined ? '' : payload.ASAL[i]);
                    if('KJ' in payload) insert.kj = String(payload.KJ[i] == undefined ? '' : payload.KJ[i]);
                    if('GOLONGAN' in payload) insert.golongan = String(payload.GOLONGAN[i] == undefined ? '' : payload.GOLONGAN[i]);
                    if('GBDAT' in payload) {
                        if(payload.GBDAT[i] != undefined) insert.gbdat = new Date(String(payload.GBDAT[i]));
                    }
                    if('CARTO' in payload) insert.carto = String(payload.CARTO[i] == undefined ? '' : payload.CARTO[i]);
                    if('CDEAT' in payload) insert.cdeat = String(payload.CDEAT[i] == undefined ? '' : payload.CDEAT[i]);
                    if('DEATH' in payload) {
                        if(payload.DEATH[i] != undefined) insert.death = new Date(String(payload.DEATH[i]));
                    }
                    if('CDEAT' in payload) insert.caude = String(payload.CAUDE[i] == undefined ? '' : payload.CAUDE[i]);
                    if('CAUDE_DESC') insert.caude_desc = String(payload.CAUDE_DESC[i] == undefined ? '' : payload.CAUDE_DESC[i]);
                    if('DOCNR' in payload) insert.docnr = String(payload.DOCNR[i] == undefined ? '' : payload.DOCNR[i]);
                    if('ORG_PATH' in payload) insert.org_path = String(payload.ORG_PATH[i] == undefined ? '' : payload.ORG_PATH[i]);
                    if('COMPANY_CODE' in payload) insert.company_code = String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                    if('CREATED_BY' in payload) insert.created_by = String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                    if('LAST_UPDATED_BY' in payload) insert.last_updated_by = String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);
                    await insert.save();
    
                    if(insert.$isPersisted) saved.push(true);
                    inserted = true;
                } else {
                    // update
                    const param = {};

                    if('NIPP' in payload) param['nipp'] = String(payload.NIPP[i] == undefined ? '' : payload.NIPP[i]);
                    if('GENDER' in payload) param['gender'] = String(payload.GENDER[i] == undefined ? '' : payload.GENDER[i]);
                    if('TMT_MULAI' in payload) {
                        if(payload.TMT_MULAI[i] != undefined) param['tmt_mulai'] = new Date(String(payload.TMT_MULAI[i]));
                    }
                    if('PERSG' in payload) param['persg'] = String(payload.PERSG[i] == undefined ? '' : payload.PERSG[i]);
                    if('PERSG_TXT' in payload) param['persg_txt'] = String(payload.PERSG_TXT[i] == undefined ? '' : payload.PERSG_TXT[i]);
                    if('PERSK' in payload) param['persk'] = String(payload.PERSK[i] == undefined ? '' : payload.PERSK[i]);
                    if('PERSK_TXT' in payload) param['persk_txt'] = String(payload.PERSK_TXT[i] == undefined ? '' : payload.PERSK_TXT[i]);
                    if('WERKS' in payload) param['werks'] = String(payload.WERKS[i] == undefined ? '' : payload.WERKS[i]);
                    if('WERKS_TXT' in payload) param['werks_txt'] = String(payload.WERKS_TXT[i] == undefined ? '' : payload.WERKS_TXT[i]);
                    if('BTRTL' in payload) param['btrtl'] = String(payload.BTRTL[i] == undefined ? '' : payload.BTRTL[i]);
                    if('BTRTL_TXT' in payload) param['btrtl_txt'] = String(payload.BTRTL_TXT[i] == undefined ? '' : payload.BTRTL_TXT[i]);
                    if('ASAL' in payload) param['asal'] = String(payload.ASAL[i] == undefined ? '' : payload.ASAL[i]);
                    if('KJ' in payload) param['kj'] = String(payload.KJ[i] == undefined ? '' : payload.KJ[i]);
                    if('GOLONGAN' in payload) param['golongan'] = String(payload.GOLONGAN[i] == undefined ? '' : payload.GOLONGAN[i]);
                    if('GBDAT' in payload) {
                        if(payload.GBDAT[i] != undefined) param['gbdat'] = new Date(String(payload.GBDAT[i]));
                    }
                    if('CARTO' in payload) param['carto'] = String(payload.CARTO[i] == undefined ? '' : payload.CARTO[i]);
                    if('CDEAT' in payload) param['cdeat'] = String(payload.CDEAT[i] == undefined ? '' : payload.CDEAT[i]);
                    if('DEATH' in payload) {
                        if(payload.DEATH[i] != undefined) param['death'] = new Date(String(payload.DEATH[i]));
                    }
                    if('CDEAT' in payload) param['caude'] = String(payload.CAUDE[i] == undefined ? '' : payload.CAUDE[i]);
                    if('CAUDE_DESC') param['caude_desc'] = String(payload.CAUDE_DESC[i] == undefined ? '' : payload.CAUDE_DESC[i]);
                    if('DOCNR' in payload) param['docnr'] = String(payload.DOCNR[i] == undefined ? '' : payload.DOCNR[i]);
                    if('ORG_PATH' in payload) param['org_path'] = String(payload.ORG_PATH[i] == undefined ? '' : payload.ORG_PATH[i]);
                    if('COMPANY_CODE' in payload) param['company_code'] = String(payload.COMPANY_CODE[i] == undefined ? '' : payload.COMPANY_CODE[i]);
                    if('CREATED_BY' in payload) param['created_by'] = String(payload.CREATED_BY[i] == undefined ? '' : payload.CREATED_BY[i]);
                    if('LAST_UPDATED_BY' in payload) param['last_updated_by'] = String(payload.LAST_UPDATED_BY[i] == undefined ? '' : payload.LAST_UPDATED_BY[i]);
                    
                    await CauseOfDeath.query()
                        .where('pernr', String(payload.PERNR[i]))
                        .andWhere('company_code', String(payload.COMPANY_CODE[i]))
                        .update(param);

                    saved.push(true);
                    updated = true;
                }

            }

            if(inserted && updated) {
                action = 'insert & update';
            } else if(inserted || updated) {
                action = inserted ? 'insert' : 'update'
            }

            if(saved.length == pernrLength) {
                const respon = {
                    status_code : 200,
                    message : `Success ${action} Cause of Death`,
                    pernr : String(pernr),
                    company_code : String(company_code)
                }
    
                return respon;
            } else {
                throw new Error(`Fail ${action} Cause of Death`);
            }

        } catch(error) {
            const respon = {
                status_code : 500,
                message : String(error)
            }

            return respon;
        }

    }

}
