import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import axios from "axios";
import Parser from 'App/Util/parser';
import MdmPegawaiFormatter from 'App/Util/MdmPegawaiFormatter';
import SafmPegawai from 'App/Models/SafmPegawai';
import SafmPegawaiSecondAssignment from 'App/Models/SafmPegawaiSecondAssignment';
import SafmPegawaiAction from 'App/Models/SafmPegawaiAction';
import SafmPegawaiPreviousEmployment from 'App/Models/SafmPegawaiPreviousEmployment';
import SafmPegawaiFamily from 'App/Models/SafmPegawaiFamily';
import SafmPegawaiEducation from 'App/Models/SafmPegawaiEducation';
import SafmPegawaiDiscipline from 'App/Models/SafmPegawaiDiscipline';
import SafmPegawaiAddress from 'App/Models/SafmPegawaiAddress';
import SafmStrukturOrganisasi from 'App/Models/SafmStrukturOrganisasi';
import SafmPerubahanOrganisasi from 'App/Models/SafmPerubahanOrganisasi';

export default class PegawaiSyncsController {
    
    public async SyncPegawaiNew({ request, params }: HttpContextContract) {
       const url = "";
       
       const headers = {
        headers: {
            "Content-type": "application/xml"
        }
       }

       try {
           const pegawai = await SafmPegawai.findByOrFail('pernr', params.id);
           // let payloadJson = new Object();
           let body = 
               `{
                   "PERNR": "${pegawai.pernr}",
                   "CNAME": "${pegawai.cname}",
                   "PNALT": "${pegawai.pnalt}",
                   "GESCH": "${pegawai.gesch}",
                   "GENDE": "${pegawai.gende}",
                   "GBORT": "${pegawai.gbort}",
                   "GBDAT": "${pegawai.gbdat}",
                   "FAMST": "${pegawai.famst}",
                   "FATXT": "${pegawai.fatxt}",
                   "ICNUM": "${pegawai.icnum}",
                   "TAXID": "${pegawai.taxid}",
                   "MARRD": "${pegawai.marrd}",
                   "DEPND": "${pegawai.depnd}",
                   "OFFICMAIL": "${pegawai.officmail}",
                   "PHNUMBER": "${pegawai.phnumber}",
                   "PROGRAM_NAME": "${pegawai.program_name}",
                   "KD_AKTIF": "${pegawai.kd_aktif}",
                   "PNALT_NEW": "${pegawai.pnalt_new}",
                   "COMPANY_CODE": "${pegawai.company_code}",
                   "PAYSCALETYPE": "${pegawai.payscaletype}",
                   "PAYSCALETYPETEXT": "${pegawai.payscaletypetext}",
                   "PAYROLLAREA": "${pegawai.payrollarea}",
                   "PAYROLLAREATEXT": "${pegawai.payrollareatext}",
                   "CONTRACTTYPE": "${pegawai.contracttype}",
                   "CONTRACTTYPETEXT": "${pegawai.contracttypetext}",
                   "BLOODTYPE": "${pegawai.bloodtype}",
                   "SOCIALMEDIA": "${pegawai.socialmedia}",
                   "RELIGION": "${pegawai.religion}",
                   "RELIGIONTEXT": "${pegawai.religiontext}",
                   "TMTMULAIBERKERJA": "${pegawai.tmtmulaibekerja}",
                   "TMTDIANGKATPEGAWAI": "${pegawai.tmtdiangkatpegawai}",
                   "TMTKELASJABATAN": "${pegawai.tmtkelasjabatan}",
                   "TMTJABATAN": "${pegawai.tmtjabatan}",
                   "TMTPENSIUN": "${pegawai.tmtpensiun}",
                   "BPJSKETENAGAKERJAAN": "${pegawai.bpjsketenagakerjaan}",
                   "BPJSKESEHATAN": "${pegawai.bpjskesehatan}",
                   "TANGGUNGAN": "${pegawai.tanggungan}",
                   "PASSPOR": "${pegawai.passpor}",
                   "PRIVATEMAIL": "${pegawai.privatemail}",
                   "TITLE": "${pegawai.title}",
                   "TITLE2": "${pegawai.title2}",
                   "ADDTITLE": "${pegawai.addtitle}",
                   "ETHNICITY": "${pegawai.ethnicity}",
                   "TMT_GOLONGAN": "${pegawai.tmt_golongan}",
                   "CREATED_BY": "${pegawai.created_by}",
                   "LAST_UPDATED_BY": "${pegawai.last_updated_by}",
                   "CREATED_DATE": "${await this.IsoDate(pegawai.created_date)}",
                   "LAST_UPDATED_DATE": "${await this.IsoDate(pegawai.last_updated_date)}"
               }`
            // pegawai.forEach(function(item, i) {
            //   payloadJson[`DATA-${i+1}`] = JSON.parse(stringObj);
            // );
           
           let args = MdmPegawaiFormatter.createPayloads(body);
           return args;
       } catch {
         return "Data tidak ditemukan";
       }

    //    await axios.post(url, args, headers);
    }

    public async SyncPegawaiSecondaryAssignment({ params }: HttpContextContract) {
       const url = "";
       
       const headers = {
        headers: {
            "Content-type": "application/xml"
        }
       }

       try {

           const pegawai = await SafmPegawaiSecondAssignment.findByOrFail('pernr', params.id);
           // let payloadJson = new Object();
           let body = 
               `{
                   "PERNR": "${pegawai.pernr}",
                   "BEGDA": "${pegawai.begda}",
                   "ENDDA": "${pegawai.endda}",
                   "CNAME": "${pegawai.cname}",
                   "MASSN": "${pegawai.massn}",
                   "MNTXT": "${pegawai.mntxt}",
                   "MASSG": "${pegawai.massg}",
                   "MGTXT": "${pegawai.mgtxt}",
                   "SOBID": "${pegawai.sobid}",
                   "NAMA_JABATAN": "${pegawai.nama_jabatan}",
                   "DOC_TYPE": "${pegawai.doc_type}",
                   "STEXT": "${pegawai.stext}",
                   "ISSUE_DATE": "${pegawai.issue_date}",
                   "EFFECTIVE_DATE": "${pegawai.effective_date}",
                   "COMPANY_CODE": "${pegawai.company_code}",
                   "CREATED_BY": "${pegawai.created_by}",
                   "LAST_UPDATED_BY": "${pegawai.last_updated_by}",
                   "CREATED_DATE": "${pegawai.created_date}",
                   "LAST_UPDATED_DATE": "${pegawai.last_updated_date}",
                   "PERSA": "${pegawai.persa}",
                   "PBTXT": "${pegawai.pbtxt}",
                   "BTRTL": "${pegawai.btrtl}",
                   "LGTXT": "${pegawai.lgtxt}",
                   "PERSG": "${pegawai.persg}",
                   "PGTXT": "${pegawai.pgtxt}",
                   "PERSK": "${pegawai.persk}",
                   "PKTXT": "${pegawai.pktxt}",
                   "ORGID": "${pegawai.orgid}",
                   "NAMA_ORG": "${pegawai.nama_org}",
                   "GENERAL_TEXTORG": "${pegawai.general_textorg}",
                   "DIREKTORAT": "${pegawai.direktorat}",
                   "DIREKTORAT_TEXT": "${pegawai.direktorat_text}",
                   "SUBDIT": "${pegawai.subdit}",
                   "SUBDI_TEXT": "${pegawai.subdi_text}",
                   "SEKSI": "${pegawai.seksi}",
                   "SEKSI_TEXT": "${pegawai.seksi_text}",
                   "SUBSEKSI": "${pegawai.subseksi}",
                   "SUBSEKSI_TEXT": "${pegawai.subseksi_text}",
                   "TRAVEL_CCTR": "${pegawai.travel_cctr}",
                   "TRFAR": "${pegawai.trfar}",
                   "TARTX": "${pegawai.tartx}",
                   "SELESAI_PENUGASAN": "${pegawai.selesai_penugasan}",
                   "DOC_NUMBER": "${pegawai.doc_number}",
                   "CREATED_BY": "${pegawai.created_by}",
                   "LAST_UPDATED_BY": "${pegawai.last_updated_by}",
                   "CREATED_DATE": "${await this.IsoDate(pegawai.created_date)}",
                   "LAST_UPDATED_DATE": "${await this.IsoDate(pegawai.last_updated_date)}"
               }`
            // pegawai.forEach(function(item, i) {
            //   payloadJson[`DATA-${i+1}`] = JSON.parse(stringObj);
            // );
           
           let args = MdmPegawaiFormatter.createPayloads(body);
           return args;
       } catch {
         return "Data tidak ditemukan";
       }

    //    await axios.post(url, args, headers);
    }

    public async SyncPegawaiAction({ params }: HttpContextContract) {
       const url = "";
       
       const headers = {
        headers: {
            "Content-type": "application/xml"
        }
       }

       try {
           const pegawai = await SafmPegawaiAction.findByOrFail('pernr', params.id);
           // let payloadJson = new Object();
           let body = 
               `{
                   "PERNR": "${pegawai.pernr}",
                   "BEGDA": "${pegawai.begda}",
                   "ENDDA": "${pegawai.endda}",
                   "MASSN": "${pegawai.massn}",
                   "MNTXT": "${pegawai.mntxt}",
                   "MASSG": "${pegawai.massg}",
                   "MGTXT": "${pegawai.mgtxt}",
                   "STAT2": "${pegawai.stat2}",
                   "TEXT1": "${pegawai.text1}",
                   "WERKS": "${pegawai.werks}",
                   "NAME1": "${pegawai.name1}",
                   "BTRTL": "${pegawai.btrtl}",
                   "LGTXT": "${pegawai.lgtxt}",
                   "PLANS": "${pegawai.plans}",
                   "PLANS_DESC": "${pegawai.plans_desc}",
                   "PERSG": "${pegawai.persg}",
                   "PTEXT": "${pegawai.ptext}",
                   "PERSK": "${pegawai.persk}",
                   "PKTXT": "${pegawai.pktxt}",
                   "ANSVH": "${pegawai.ansvh}",
                   "ATX": "${pegawai.atx}",
                   "DOC_TYPE": "${pegawai.doc_type}",
                   "STEXT": "${pegawai.stext}",
                   "DOC_NUMBER": "${pegawai.doc_number}",
                   "ISSUE_DATE": "${pegawai.issue_date}",
                   "EFFECTIVE_DATE": "${pegawai.effective_date}",
                   "COMPANY_CODE": "${pegawai.company_code}",
                   "CREATED_BY": "${pegawai.created_by}",
                   "LAST_UPDATED_BY": "${pegawai.last_updated_by}",
                   "CREATED_DATE": "${await this.IsoDate(pegawai.created_date)}",
                   "LAST_UPDATED_DATE": "${await this.IsoDate(pegawai.last_updated_date)}"
               }`
            // pegawai.forEach(function(item, i) {
            //   payloadJson[`DATA-${i+1}`] = JSON.parse(stringObj);
            // );
           
           let args = MdmPegawaiFormatter.createPayloads(body);
           return args;
       } catch {
         return "Data tidak ditemukan";
       }
    //    await axios.post(url, args, headers);
    }

    public async SyncPegawaiPreviousEmployment({ params }: HttpContextContract) {
       const url = "";
       
       const headers = {
        headers: {
            "Content-type": "application/xml"
        }
       }

       try {
           const pegawai = await SafmPegawaiPreviousEmployment.findByOrFail('pernr', params.id);
           // let payloadJson = new Object();
           let body = 
               `{
                   "PERNR": "${pegawai.pernr}",
                   "BEGDA": "${pegawai.begda}",
                   "ENDDA": "${pegawai.endda}",
                   "ARBGB": "${pegawai.arbgb}",
                   "ORT01": "${pegawai.ort01}",
                   "LAND1": "${pegawai.land1}",
                   "BRANC": "${pegawai.branc}",
                   "BRTXT": "${pegawai.brtxt}",
                   "TAETE": "${pegawai.taete}",
                   "LTEXT": "${pegawai.ltext}",
                   "ANSVX": "${pegawai.ansvx}",
                   "ANSTX": "${pegawai.anstx}",
                   "JOB_DETAIL": "${pegawai.job_detail}",
                   "SALARY": "${pegawai.salary}",
                   "CURRENCY": "${pegawai.currency}",
                   "EX_REASON": "${pegawai.ex_reason}",
                   "COMPANY_CODE": "${pegawai.company_code}",
                   "CREATED_BY": "${pegawai.created_by}",
                   "LAST_UPDATED_BY": "${pegawai.last_updated_by}",
                   "CREATED_DATE": "${await this.IsoDate(pegawai.created_date)}",
                   "LAST_UPDATED_DATE": "${await this.IsoDate(pegawai.last_updated_date)}"
               }`
            // pegawai.forEach(function(item, i) {
            //   payloadJson[`DATA-${i+1}`] = JSON.parse(stringObj);
            // );
           
           let args = MdmPegawaiFormatter.createPayloads(body);
           return args;
       } catch {
         return "Data tidak ditemukan";
       }

    //    await axios.post(url, args, headers);
    }

    public async SyncPegawaiFamily({ params }: HttpContextContract) {
       const url = "";
       
       const headers = {
        headers: {
            "Content-type": "application/xml"
        }
       }

       try {
           const pegawai = await SafmPegawaiFamily.findByOrFail('pernr', params.id);
           // let payloadJson = new Object();
           let body = 
               `{
                   "PERNR": "${pegawai.pernr}",
                   "FULL_NAME": "${pegawai.full_name}",
                   "FAMILY_TYPE": "${pegawai.family_type}",
                   "FAMILY_TYPE_DESC": "${pegawai.family_type_desc}",
                   "START_DATE": "${pegawai.start_date}",
                   "END_DATE": "${pegawai.end_date}",
                   "CAHNGE_DATE": "${pegawai.change_date}",
                   "CHANGE_BY": "${pegawai.change_by}",
                   "NAME": "${pegawai.name}",
                   "GENDER_KEY": "${pegawai.gender_key}",
                   "GENDER": "${pegawai.gender}",
                   "BIRTH_PLACE": "${pegawai.birth_place}",
                   "BIRTH_DATE": "${pegawai.birth_date}",
                   "NATIONALITY": "${pegawai.nationality}",
                   "COUNTRY_OF_BIRTH": "${pegawai.country_of_birth}",
                   "ID_CARD_NO": "${pegawai.id_card_no}",
                   "ID_CARD_TYPE": "${pegawai.id_card_type}",
                   "DATE_OF_ISSUE": "${pegawai.date_of_issue}",
                   "PLACE_OF_ISSUE": "${pegawai.place_of_issue}",
                   "RELATIVES": "${pegawai.relatives}",
                   "COMPANY_CODE": "${pegawai.company_code}",
                   "PASSPORT_NO": "${pegawai.passport_no}",
                   "PASS_EXPIRY_DATE": "${pegawai.pass_expiry_date}",
                   "JOB_TITLE": "${pegawai.job_title}",
                   "EMPLOYER": "${pegawai.employer}",
                   "MARRIED_STATUS_DATE": "${pegawai.married_status_date}",
                   "TANGDINAS": "${pegawai.tangdinas}",
                   "CREATED_BY": "${pegawai.created_by}",
                   "LAST_UPDATED_BY": "${pegawai.last_updated_by}",
                   "CREATED_DATE": "${await this.IsoDate(pegawai.created_date)}",
                   "LAST_UPDATED_DATE": "${await this.IsoDate(pegawai.last_updated_date)}"
               }`
            // pegawai.forEach(function(item, i) {
            //   payloadJson[`DATA-${i+1}`] = JSON.parse(stringObj);
            // );
           
           let args = MdmPegawaiFormatter.createPayloads(body);
           return args;
       } catch {
         return "Data tidak ditemukan"
       }

    //    await axios.post(url, args, headers);
    }

    public async SyncPegawaiEducation({ params }: HttpContextContract) {
       const url = "";
       
       const headers = {
        headers: {
            "Content-type": "application/xml"
        }
       }

       try {
           const pegawai = await SafmPegawaiEducation.findByOrFail('pernr', params.id);
           // let payloadJson = new Object();
           let body = 
               `{
                   "PERNR": "${pegawai.pernr}",
                   "FULL_NAME": "${pegawai.full_name}",
                   "EDUCATION_EST": "${pegawai.education_est}",
                   "EDUCATION_EST_DESC": "${pegawai.education_est_desc}",
                   "START_DATE": "${pegawai.start_date}",
                   "END_DATE": "${pegawai.end_date}",
                   "CAHNGE_DATE": "${pegawai.change_date}",
                   "CHANGE_BY": "${pegawai.change_by}",
                   "EDU_TRAINING": "${pegawai.edu_training}",
                   "ET_CATEGORIES": "${pegawai.et_categories}",
                   "ET_CATEGORIES_TEXT": "${pegawai.et_categories_text}",
                   "INST_LOCATION": "${pegawai.inst_location}",
                   "COUNTRY_REGION_KEY": "${pegawai.country_region_key}",
                   "CERTIFICATE": "${pegawai.certificate}",
                   "CERTIFICATE_TEXT": "${pegawai.certificate_text}",
                   "DURATION_NO": "${pegawai.duration_no}",
                   "DURATION_TIME": "${pegawai.duration_time}",
                   "FINAL_GRADE": "${pegawai.final_grade}",
                   "BRANCH_OF_STUDY_1": "${pegawai.branch_of_study_1}",
                   "BRANCH_OF_STUDY_1T": "${pegawai.branch_of_study_1t}",
                   "BRANCH_OF_STUDY_2": "${pegawai.branch_of_study_2}",
                   "BRANCH_OF_STUDY_2T": "${pegawai.branch_of_study_2t}",
                   "COURSE_SUBJECT": "${pegawai.course_subject}",
                   "KATEGORI_PELATIHAN": "${pegawai.kategori_pelatihan}",
                   "KATEGORI_PELATIHAN_TEXT": "${pegawai.kategori_pelatihan_text}",
                   "LEVEL_PELATIHAN": "${pegawai.level_pelatihan}",
                   "LEVEL_PELATIHAN_TEXT": "${pegawai.level_pelatihan_text}",
                   "CERTIFICATE_TYPE": "${pegawai.certificate_type}",
                   "CERTIFICATE_TYPE_TEXT": "${pegawai.certificate_type_text}",
                   "CERTI_START_DATE": "${pegawai.certi_start_date}",
                   "CERTI_EXPIRE_DATE": "${pegawai.certi_expire_date}",
                   "COMPANY_CODE": "${pegawai.company_code}",
                   "PEND_AWAL_PENERIMAAN": "${pegawai.pend_awal_penerimaan}",
                   "NOMOR_IJAZAH": "${pegawai.nomor_ijazah}",
                   "FAKULTAS": "${pegawai.fakultas}",
                   "KONSENTRASI": "${pegawai.konsentrasi}",
                   "CREATED_BY": "${pegawai.created_by}",
                   "LAST_UPDATED_BY": "${pegawai.last_updated_by}",
                   "CREATED_DATE": "${await this.IsoDate(pegawai.created_date)}",
                   "LAST_UPDATED_DATE": "${await this.IsoDate(pegawai.last_updated_date)}"
               }`
            // pegawai.forEach(function(item, i) {
            //   payloadJson[`DATA-${i+1}`] = JSON.parse(stringObj);
            // );
           
           let args = MdmPegawaiFormatter.createPayloads(body);
           return args;
       } catch {
         return "Data tidak ditemukan";
       }

    //    await axios.post(url, args, headers);
    }
    
    public async SyncPegawaiDiscipline({ params }: HttpContextContract) {
       const url = "";
       
       const headers = {
        headers: {
            "Content-type": "application/xml"
        }
       }

       try {
           const pegawai = await SafmPegawaiDiscipline.findByOrFail('pernr', params.id);
           // let payloadJson = new Object();
           let body = 
               `{
                   "PERNR": "${pegawai.pernr}",
                   "FULL_NAME": "${pegawai.full_name}",
                   "SUBTYPE": "${pegawai.subtype}",
                   "SUBTYPE_TEXT": "${pegawai.subtype_text}",
                   "START_DATE": "${pegawai.start_date}",
                   "END_DATE": "${pegawai.end_date}",
                   "CAHNGE_DATE": "${pegawai.change_date}",
                   "CHANGE_BY": "${pegawai.change_by}",
                   "COMPANY_POLICY": "${pegawai.company_policy}",
                   "REASON": "${pegawai.reason}",
                   "REASON_TEXT": "${pegawai.reason_text}",
                   "DATE_ENTERED": "${pegawai.date_entered}",
                   "RESULT": "${pegawai.result}",
                   "RESULT_TEXT": "${pegawai.result_text}",
                   "DATE_SETTLED": "${pegawai.date_settled}",
                   "TUNTUTAN_GANTI_RUGI": "${pegawai.tuntutan_ganti_rugi}",
                   "COMPANY_CODE": "${pegawai.company_code}",
                   "NO_DOCUMENT_SK": "${pegawai.no_document_sk}",
                   "GRIEVANCE_TEXT": "${pegawai.grievance_text}",
                   "CREATED_BY": "${pegawai.created_by}",
                   "LAST_UPDATED_BY": "${pegawai.last_updated_by}",
                   "CREATED_DATE": "${await this.IsoDate(pegawai.created_date)}",
                   "LAST_UPDATED_DATE": "${await this.IsoDate(pegawai.last_updated_date)}"
               }`
            // pegawai.forEach(function(item, i) {
            //   payloadJson[`DATA-${i+1}`] = JSON.parse(stringObj);
            // );
           
           let args = MdmPegawaiFormatter.createPayloads(body);
           return args;
       } catch {
         return "Data tidak ditemukan";
       }

    //    await axios.post(url, args, headers);
    }

    public async SyncPegawaiAddresses({ params }: HttpContextContract) {
       const url = "";
       
       const headers = {
        headers: {
            "Content-type": "application/xml"
        }
       }

       try {
           const pegawai = await SafmPegawaiAddress.findByOrFail('pernr', params.id);
           // let payloadJson = new Object();
           let body = 
               `{
                   "PERNR": "${pegawai.pernr}",
                   "FULL_NAME": "${pegawai.full_name}",
                   "ADDRESS_TYPE": "${pegawai.address_type}",
                   "ADDRESS_TYPE_TEXT": "${pegawai.address_type_text}",
                   "START_DATE": "${pegawai.start_date}",
                   "END_DATE": "${pegawai.end_date}",
                   "CAHNGE_DATE": "${pegawai.change_date}",
                   "CHANGE_BY": "${pegawai.change_by}",
                   "STREET_AND_HOUSE_NO": "${pegawai.street_and_house_no}",
                   "CONTACT_NAME": "${pegawai.contact_name}",
                   "SECOND_ADDRESS_LINE": "${pegawai.second_address_line}",
                   "DISTRICT": "${pegawai.district}",
                   "CITY": "${pegawai.city}",
                   "POSTAL_CODE": "${pegawai.postal_code}",
                   "REGION": "${pegawai.region}",
                   "REGION_TEXT": "${pegawai.region_text}",
                   "COUNTRY": "${pegawai.country}",
                   "COUNTRY_TEXT": "${pegawai.country_text}",
                   "COMPANY_CODE": "${pegawai.company_code}",
                   "CREATED_BY": "${pegawai.created_by}",
                   "LAST_UPDATED_BY": "${pegawai.last_updated_by}",
                   "CREATED_DATE": "${await this.IsoDate(pegawai.created_date)}",
                   "LAST_UPDATED_DATE": "${await this.IsoDate(pegawai.last_updated_date)}"
               }`
            // pegawai.forEach(function(item, i) {
            //   payloadJson[`DATA-${i+1}`] = JSON.parse(stringObj);
            // );
           
           let args = MdmPegawaiFormatter.createPayloads(body);
           return args;
       } catch {
         return "Data tidak ditemukan";
       }

    //    await axios.post(url, args, headers);
    }

    public async SyncStrukturOrganisasi({ params }: HttpContextContract) {
        const url = "";
        
        const headers = {
         headers: {
             "Content-type": "application/xml"
         }
        }

        try {
            const organisasi = await SafmStrukturOrganisasi.findByOrFail('objid', params.id);
            // let payloadJson = new Object();
            let body = 
                `{
                    "PLVAR": "${organisasi.plvar}",
                    "OTYPE": "${organisasi.otype}",
                    "OBJID": "${organisasi.objid}",
                    "PAROT": "${organisasi.parot}",
                    "PARID": "${organisasi.parid}",
                    "BEGDA": "${organisasi.begda}",
                    "ENDDA": "${organisasi.endda}",
                    "SHORT": "${organisasi.short}",
                    "STEXT": "${organisasi.stext}",
                    "VBEG": "${organisasi.vbeg}",
                    "VEND": "${organisasi.vend}",
                    "TLEVEL": "${organisasi.tlevel}",
                    "FLAG_CHIEF": "${organisasi.flag_chief}",
                    "KOSTENSTELLE": "${organisasi.kostenstelle}",
                    "PERSA": "${organisasi.persa}",
                    "BTRTL": "${organisasi.btrtl}",
                    "PERSA_NEW": "${organisasi.persa_new}",
                    "BTRTL_NEW": "${organisasi.btrtl_new}",
                    "PERSG": "${organisasi.persg}",
                    "PERSK": "${organisasi.persk}",
                    "COMPANY_CODE": "${organisasi.company_code}",
                    "KODEUNITKERJA": "${organisasi.kodeunitkerja}",
                    "KODEREGIONAL": "${organisasi.koderegional}",
                    "KODEACTIVITY": "${organisasi.kodeactivity}",
                    "DESCACTIVITY": "${organisasi.descactivity}",
                    "DESCBOBOTORGANISASI": "${organisasi.descbobotorganisasi}",
                    "LEVELORGANISASI": "${organisasi.levelorganisasi}",
                    "PERSAREATEXT": "${organisasi.persareatext}",
                    "PERSSUBAREATEXT": "${organisasi.perssubareatext}",
                    "GENERALTEXT": "${organisasi.generaltext}",
                    "GENERALTEXTPAR": "${organisasi.generaltextpar}",
                    "COSTCENTER": "${organisasi.costcenter}",
                    "COSTCENTERTEXT": "${organisasi.costcentertext}",
                    "CHIEFPOSITION": "${organisasi.chiefposition}",
                    "KODE_JOBSTREAM": "${organisasi.kode_jobstream}",
                    "DESC_JOBSTREAM": "${organisasi.desc_jobstream}",
                    "PROGRAM_NAME": "${organisasi.program_name}",
                    "CREATED_BY": "${organisasi.created_by}",
                    "LAST_UPDATED_BY": "${organisasi.last_updated_by}",
                    "CREATED_DATE": "${await this.IsoDate(organisasi.created_date)}",
                    "LAST_UPDATED_DATE": "${await this.IsoDate(organisasi.last_updated_date)}"
                }`
             // pegawai.forEach(function(item, i) {
             //   payloadJson[`DATA-${i+1}`] = JSON.parse(stringObj);
             // );
            
            let args = MdmPegawaiFormatter.createPayloads(body);
            return args;
        } catch {
            return "Data tidak ditemukan";
        }
 
     //    await axios.post(url, args, headers);
    }

    public async SyncPerubahanOrganisasi({ params }: HttpContextContract) {
        const url = "";
        
        const headers = {
         headers: {
             "Content-type": "application/xml"
         }
        }

        try {
            const organisasi = await SafmPerubahanOrganisasi.findByOrFail('pernr', params.id);
            // let payloadJson = new Object();
            let body = 
                `{
                    "PERNR": "${organisasi.pernr}",
                    "CNAME": "${organisasi.cname}",
                    "PNALT": "${organisasi.pnalt}",
                    "WERKS": "${organisasi.werks}",
                    "PBTXT": "${organisasi.pbtxt}",
                    "BTRTL": "${organisasi.btrtl}",
                    "BTRTX": "${organisasi.btrtx}",
                    "ANSVH": "${organisasi.ansvh}",
                    "ANSTX": "${organisasi.anstx}",
                    "PERSG": "${organisasi.persk}",
                    "PKTXT": "${organisasi.pktxt}",
                    "TRFG0": "${organisasi.trfg0}",
                    "TRFS0": "${organisasi.trfs0}",
                    "GOL": "${organisasi.gol}",
                    "GOL_MKG": "${organisasi.gol_mkg}",
                    "SHORT": "${organisasi.short}",
                    "PLANS": "${organisasi.plans}",
                    "DIREK": "${organisasi.direk}",
                    "DIREK_TEXT": "${organisasi.direk_text}",
                    "SUBDI": "${organisasi.subdi}",
                    "SUBDI_TEXT": "${organisasi.subdi_text}",
                    "SEKSI": "${organisasi.seksi_text}",
                    "SEKSI_TEXT": "${organisasi.seksi_text}",
                    "SUBSI": "${organisasi.subsi}",
                    "SUBSI_TEXT": "${organisasi.subsi_text}",
                    "PLVAR": "${organisasi.plvar}",
                    "PROGRAM_NAME": "${organisasi.program_name}",
                    "KD_AKTIF": "${organisasi.kd_aktif}",
                    "BEGDA": "${organisasi.begda}",
                    "ENDDA": "${organisasi.enda}",
                    "PIN": "${organisasi.pin}",
                    "BEGDA_PIN": "${organisasi.begda_pin}",
                    "ENDDA_PIN": "${organisasi.endda_pin}",
                    "WERKS_PIN": "${organisasi.werks_pin}",
                    "COST_CENTER": "${organisasi.cost_center}",
                    "LO_ID": "${organisasi.lo_id}",
                    "BANK_KEY": "${organisasi.bank_key}",
                    "BANK_NAME": "${organisasi.bank_name}",
                    "BANK_ACCOUNT": "${organisasi.bank_account}",
                    "PNALT_NEW": "${organisasi.pnalt_new}",
                    "WERKS_NEW": "${organisasi.werks_new}",
                    "PBTXT_NEW": "${organisasi.pbtxt_new}",
                    "BTRTL_NEW": "${organisasi.btrtl_new}",
                    "BTRTX_NEW": "${organisasi.btrtx_new}",
                    "COMPANY_CODE": "${organisasi.company_code}",
                    "PAYSCALETYPE": "${organisasi.payscaletype}",
                    "PAYSCALETYPETEXT": "${organisasi.payscaletypetext}",
                    "PAYROLLAREA": "${organisasi.payrollarea}",
                    "PAYROLLAREATEXT": "${organisasi.payrollareatext}",
                    "TRAVELCOSTCENTER": "${organisasi.travelcostcenter}",
                    "TMTMULAIBEKERJA": "${organisasi.tmtmulaibekerja}",
                    "TMT_PERIODIK": "${organisasi.tmt_periodik}",
                    "TMTDIANGKATPEGAWAI": "${organisasi.tmtdiangkatpegawai}",
                    "TMTKELASJABATAN": "${organisasi.tmtkelasjabatan}",
                    "TMTJABATAN": "${organisasi.tmtjabatan}",
                    "TMTPENSIUN": "${organisasi.tmtpensiun}",
                    "GENERALTEXTORG": "${organisasi.generaltextorg}",
                    "GENERALTEXTPOS": "${organisasi.generaltextpos}",
                    "GENERAL_TEXT_POS": "${organisasi.general_text_pos}",
                    "TMT_GOLONGAN": "${organisasi.tmt_golongan}",
                    "NOMOR_SK": "${organisasi.nomor_sk}",
                    "TANGGAL_SK": "${organisasi.tanggal_sk}",
                    "POSISI_2021": "${organisasi.posisi_2021}",
                    "KJPOSISI_2021": "${organisasi.kjposisi_2021}",
                    "CREATED_BY": "${organisasi.created_by}",
                    "LAST_UPDATED_BY": "${organisasi.last_updated_by}",
                    "CREATED_DATE": "${await this.IsoDate(organisasi.created_date)}",
                    "LAST_UPDATED_DATE": "${await this.IsoDate(organisasi.last_updated_date)}"
                }`
             // pegawai.forEach(function(item, i) {
             //   payloadJson[`DATA-${i+1}`] = JSON.parse(stringObj);
             // );
            
            let args = MdmPegawaiFormatter.createPayloads(body);
            return args;
        } catch {
            return "Data tidak ditemukan";
        }
 
     //    await axios.post(url, args, headers);
    }

    async IsoDate(date) {
        date = new Date(date);
        date = date.toISOString();
        date = date.substring(0, 10);
        return date;
    }

}