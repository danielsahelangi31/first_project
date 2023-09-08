import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import { Workbook } from "exceljs";
import fs from "fs";
import {access, constants} from "fs";
import Application from '@ioc:Adonis/Core/Application';
import MasterCompany from 'App/Models/MasterCompany';
import Alatbm from 'App/Models/Alatbm';
import AlatbmApproved from 'App/Models/AlatbmApproved';
import GroupCompany from 'App/Models/GroupCompany';
import SchemaAplication from 'App/Models/SchemaAplication';
import SchemaApprovalList from 'App/Models/SchemaApprovalList';
import ApprovalHeader from 'App/Models/ApprovalHeader';
import ApprovalDetail from 'App/Models/ApprovalDetail';
import { Exception } from "@poppinss/utils";
import Country from 'App/Models/Country';
import User from 'App/Models/User';
import Role from 'App/Models/Role';
import Ws from 'App/Services/Ws';
import Notification from "App/Models/Notification";
import GroupAlat from 'App/Models/GroupAlat';
import PowerSource from 'App/Models/PowerSource';
import KategoriAlat from 'App/Models/KategoriAlat';
import SatuanKapasita from 'App/Models/SatuanKapasita';
import TierType from 'App/Models/TierType';
import Cabang from 'App/Models/Cabang';
import SatuanCapacity from 'App/Models/SatuanCapacity';
import ApprovalLog from 'App/Models/ApprovalLog';
import SendMail from 'App/Services/SendMail';
import Drive from '@ioc:Adonis/Core/Drive';


export default class MasterBongkarMuatsController {

    public async index ({ view, params, auth }: HttpContextContract) {
      let alatbm: any;
      const status = params.id; 
      const statusOut = ["draft", "diajukan", "ditolak"];
      const statusApp = ["aktif", "nonaktif"];
      if(statusOut.includes(params.id)) {
        if(params.id == "draft") {
          alatbm = await Alatbm.query().where('status', status.toUpperCase()).where('submitter', String(auth.user?.id)).orderBy('created_at', 'desc'); 
        } else {
          alatbm = await Alatbm.query().where('status', status.toUpperCase()).orderBy('created_at', 'desc'); 
        }
      } else if(statusApp.includes(params.id)) {
        alatbm = await AlatbmApproved.query().where('status', status.toUpperCase()).orderBy('created_at', 'desc');
      } else if(status == "outstanding") {
        alatbm = await Alatbm.query().whereIn('status', ['DIAJUKAN', 'DRAFT', 'DITOLAK']).orderBy('created_at', 'desc');
      } else {
        alatbm = await AlatbmApproved.query().orderBy('created_at', 'desc');
      }
      const draft = await Alatbm.query().where('status', 'DRAFT').where('submitter', String(auth.user?.id));
      const diajukan = await Alatbm.query().where('status', 'DIAJUKAN');
      const ditolak = await Alatbm.query().where('status', 'DITOLAK');
      const total1 = await Alatbm.all();
      const nonaktif = await AlatbmApproved.query().where('status', 'NONAKTIF');
      const aktif = await AlatbmApproved.query().where('status', 'AKTIF');
      const total2 = await AlatbmApproved.all();
      const submitter = await SchemaAplication.findBy('role_id', auth.user?.role_id);
      const approver = await SchemaApprovalList.findBy('role_id', auth.user?.role_id);

      const data = {
          param: statusOut.includes(status) || status == "outstanding" ? "outstanding" : "",
          draft: draft.length,
          diajukan: diajukan.length,
          ditolak: ditolak.length,
          aktif: aktif.length,
          nonaktif: nonaktif.length, 
          approve : aktif.length + nonaktif.length,
          total: total1.length + total2.length,
          alatbm: alatbm,
          submitter: submitter,
          approver: approver,
          roleId: auth?.user?.role_id
      }

      return view.render('pages/master_peralatan/index_alat_bongkar_muat.edge', data);
    }

    public async add ({ view, bouncer }: HttpContextContract) {
      await bouncer.authorize("access", "create-alat-bongkar-muat");
      return view.render('pages/master_peralatan/add_alat_bongkar_muat.edge');
    }

    public async store ({request, auth, response}: HttpContextContract) {
      try {
        const alatbm = new Alatbm();
        alatbm.entity = request.input('entity');
        alatbm.kode_aset = request.input('kodeAset');
        alatbm.kepemilikan_aset = request.input('aset');  
        alatbm.lokasi_kepemilikan = request.input('lokasiKepemilikanAset');
        alatbm.lokasi_fisik = request.input('lokasiFisikAset');    
        alatbm.class_code = request.input('alatClassCode');
        alatbm.class_description = request.input('alatClassDescription');
        alatbm.kategori_alat = request.input('kategoriAlat');
        alatbm.nomor_sap = request.input('nomorAssetSap');
        alatbm.local_equipment = request.input('localEquipmentNo');
        alatbm.manufacturer = request.input('manufacturer');
        alatbm.country_origin = request.input('countryOfOrigin');
        alatbm.manufacturer_year = request.input('manufacturerYear');
        alatbm.acquisition_year = request.input('acquisitionYear');
        alatbm.model = request.input('model');
        alatbm.equipment_serial = request.input('serialNumber');
        alatbm.kapasitas = request.input('kapasitas');
        alatbm.satuan_kapasitas = request.input('satuanKapasitas');
        alatbm.power_source = request.input('powerSource');
        alatbm.power_capacity = request.input('powerCapacity');
        alatbm.equipment_description = request.input('equipmentDescription');
        alatbm.span = request.input('span');
        alatbm.outreach = request.input('outreach');
        alatbm.lifting_above = request.input('liftingHeightAbove');
        alatbm.lifting_below = request.input('liftingHeightBelow');
        alatbm.tier_type = request.input('tierHeightType');
        alatbm.notes = request.input('notes');
        alatbm.status = request.input('status');
        alatbm.reference_id = request.input('id');
        if(request.input('id') != undefined) {
          const alatbm2 = await AlatbmApproved.findByOrFail('id', request.input('id'));
          alatbm2.is_edit = 1;
          alatbm2.save(); 
        }
        alatbm.submitter = String(auth.user?.id);
        alatbm.entity_id = String(auth.user?.role_id); 
        // const master_type = await MasterType.findByOrFail('master_name', 'Master Peralatan Bongkar Muat');
        alatbm.master_type_id = "c59d4ff5-djc8-4fa4-bb07-f6fc508506cd";
        const schema = await Database.from('schema_aplications').where('role_id', String(auth.user?.role_id)).andWhere('master_type_id', "c59d4ff5-djc8-4fa4-bb07-f6fc508506cd").select('id');
        if([null, 'null', ''].includes(String(schema))) {
          throw new Exception("User tidak memiliki schema approval");
        }
        alatbm.schema_id = schema[0].id;
        alatbm.request_number = request.input("no_request");
        alatbm.satuan_capacity = request.input("satuanCapacity");
        alatbm.file_bast = request.input("fileBastName");
        alatbm.file_lampiran_teknis = request.input("fileLampiranTeknisName");
        alatbm.equipment_number = request.input("equipment_number");
        
        if(request.input('status') == "DIAJUKAN") {
          const approvalLog = new ApprovalLog();
          approvalLog.request_no = alatbm.request_number;
          approvalLog.action = "DIAJUKAN";
          approvalLog.remark = request.input("dataEdited");
          approvalLog.created_by = auth.user.id;
          await approvalLog.save();

          // NOTIFICATION
          const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", schema[0].id).where("approval_order", "1");
          let nextApprovalRoleArray: any = [];
          nextApprovalRole.forEach(function(value) {
            nextApprovalRoleArray.push(value.role_id);
          });
          const nextUserApproval = await User.query().whereIn("role_id", nextApprovalRoleArray);
          let notificationData: any = [];
          nextUserApproval.forEach(async function(value) {
            notificationData.push({
              from: auth.user?.id,
              to: value.id,
              request_no: request.input("no_request"),
              master_type_id: "c59d4ff5-djc8-4fa4-bb07-f6fc508506cd",
              status:'APPROVED'
            });
            Ws.io.emit('receive-notif', { userId: value.id,message:'Request Approval Master Data Peralatan Bongkar Muat' });
            await SendMail.approve(value.id,alatbm.submitter,"c59d4ff5-djc8-4fa4-bb07-f6fc508506cd",alatbm.request_number);
          });
          await Notification.createMany(notificationData);
        }
        
        await alatbm.save();

        let message = "";
        if(request.input('status') == "DRAFT") {
          message = "Data akan disimpan sementara"; 
        } else if(request.input('status') == "DIAJUKAN") {
          message = "Data berhasil terkirim";
        }

        const result = {
          message: message
        }

        return response.status(200).send(result);
      } catch(error) {
        const result = {
          message: error.message
        }

        return response.status(500).send(result);
      }
    }

    public async edit ({ view, params, bouncer }: HttpContextContract) {
      await bouncer.authorize("access", "edit-alat-bongkar-muat");
      const alatbm = await Alatbm.findBy('id', `${params.id}`);
      const alatbm2 = await AlatbmApproved.findBy('id', `${params.id}`);
      const com = await MasterCompany.query().whereNotIn('company_group', ['5a4bfc54-adf3-48bf-8a10-43ba8615327e', 'd47bb444-4b12-4d31-ac18-fad08fba4086', '69d07ab2-8d39-4277-94bd-1d8286798017', '5c46ea27-5fbf-4bbf-b855-98f369c30934']).orderBy('company_name', 'asc');
      const country = await Country.query().orderBy('country_name', 'asc');
      const groupAlat = await GroupAlat.query().orderBy('kode_alat', 'asc');
      const groupCompany = await GroupCompany.query().orderBy('sort_no', 'asc');
      const powerSource = await PowerSource.query().orderBy('sort_no', 'asc');
      const kategoriAlat = await KategoriAlat.query().orderBy('sort_no', 'asc');
      const satuanKapasitas = await SatuanKapasita.query().orderBy('sort_no', 'asc');
      const tierType = await TierType.query().orderBy('sort_no', 'asc');
      const cabang = await MasterCompany.query().whereIn('company_group', ['5a4bfc54-adf3-48bf-8a10-43ba8615327e', 'd47bb444-4b12-4d31-ac18-fad08fba4086', '69d07ab2-8d39-4277-94bd-1d8286798017', '5c46ea27-5fbf-4bbf-b855-98f369c30934']).orderBy('company_name', 'asc');;
      const cabang2 = await Cabang.query().whereRaw(`"name" not like '%Sub%'`).orderBy('name', 'asc');
      const satuanCapacity = await SatuanCapacity.all();
      const all = {
        data: alatbm == null ? alatbm2 : alatbm,
        com: com,
        country: country,
        groupcom: groupCompany,
        groupAlat: groupAlat,
        powerSource: powerSource,
        kategoriAlat: kategoriAlat,
        satuanKapasitas: satuanKapasitas,
        tierType: tierType,
        cabang: cabang,
        cabang2: cabang2,
        satuanCapacity: satuanCapacity
      }
      return view.render('pages/master_peralatan/edit_alat_bongkar_muat.edge', all);
    }

    public async update ({ request, response, auth }: HttpContextContract) {
      try {
        const alatbm = await Alatbm.findByOrFail('id', request.input('id')); 
        alatbm.entity = request.input('entity');
        alatbm.kode_aset = request.input('kodeAset');
        alatbm.kepemilikan_aset = request.input('aset');  
        alatbm.lokasi_kepemilikan = request.input('lokasiKepemilikanAset');
        alatbm.lokasi_fisik = request.input('lokasiFisikAset');    
        alatbm.class_code = request.input('alatClassCode');
        alatbm.class_description = request.input('alatClassDescription'); 
        alatbm.kategori_alat = request.input('kategoriAlat');
        alatbm.nomor_sap = request.input('nomorAssetSap');
        alatbm.local_equipment = request.input('localEquipmentNo');
        alatbm.equipment_number = request.input('equipmentNumber');
        alatbm.manufacturer = request.input('manufacturer');
        alatbm.country_origin = request.input('countryOfOrigin');
        alatbm.manufacturer_year = request.input('manufacturerYear');
        alatbm.acquisition_year = request.input('acquisitionYear');
        alatbm.model = request.input('model');
        alatbm.equipment_serial = request.input('serialNumber');
        alatbm.kapasitas = request.input('kapasitas');
        alatbm.satuan_kapasitas = request.input('satuanKapasitas');
        alatbm.power_source = request.input('powerSource');
        alatbm.power_capacity = request.input('powerCapacity');
        alatbm.equipment_description = request.input('equipmentDescription');
        alatbm.span = request.input('span');
        alatbm.outreach = request.input('outreach');
        alatbm.lifting_above = request.input('liftingHeightAbove');
        alatbm.lifting_below = request.input('liftingHeightBelow');
        alatbm.tier_type = request.input('tierHeightType');
        alatbm.notes = request.input('notes');
        const status = request.input('status');
        alatbm.status = status == "UPDATE" ? "DIAJUKAN" : status;
        alatbm.resubmit = request.input('resubmit');
        alatbm.satuan_capacity = request.input("satuanCapacity");
        alatbm.file_bast = request.input("fileBastName");
        alatbm.file_lampiran_teknis = request.input("fileLampiranTeknisName");
        alatbm.equipment_number = request.input("equipment_number");

        if(request.input('status') == "DIAJUKAN" || request.input('status') == "UPDATE") {
          const approvalLog = new ApprovalLog();
          approvalLog.request_no = alatbm.request_number;
          approvalLog.action = request.input('status');
          approvalLog.remark = request.input("dataEdited");
          approvalLog.created_by = auth.user.id;
          await approvalLog.save();

          alatbm.master_type_id = "c59d4ff5-djc8-4fa4-bb07-f6fc508506cd";
          const schema = await Database.from('schema_aplications').where('role_id', String(auth.user?.role_id)).andWhere('master_type_id', "c59d4ff5-djc8-4fa4-bb07-f6fc508506cd").select('id');

          // NOTIFICATION
          const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", schema[0].id).where("approval_order", "1");
          let nextApprovalRoleArray: any = [];
          nextApprovalRole.forEach(function(value) {
            nextApprovalRoleArray.push(value.role_id);
          });
          const nextUserApproval = await User.query().whereIn("role_id", nextApprovalRoleArray);
          let notificationData: any = [];
          nextUserApproval.forEach(async function(value) {
            notificationData.push({
              from: auth.user?.id,
              to: value.id,
              request_no: request.input("no_request"),
              master_type_id: "c59d4ff5-djc8-4fa4-bb07-f6fc508506cd",
              status:'APPROVED'
            });
            Ws.io.emit('receive-notif', { userId: value.id,message:'Request Approval Master Data Peralatan Bongkar Muat' });
            await SendMail.approve(value.id,alatbm.submitter,"c59d4ff5-djc8-4fa4-bb07-f6fc508506cd",alatbm.request_number);
          });
          await Notification.createMany(notificationData);
        }

        await alatbm.save();
        
        let message = "";
        if(status == "DRAFT") {
          message = "Data akan disimpan sementara"; 
        } else {
          message = "Data berhasil diperbarui";
        }

        const result = {
          message: message
        }

        return response.status(200).send(result);
      } catch(error) {
        const result = {
          message: error.message
        }

        return response.status(500).send(result);
      }
    }

    public async view ({ view, params }: HttpContextContract) {
      const alatbm2 = await AlatbmApproved.findBy('id', params.id);
      const alatbm = await Alatbm.findBy('id', params.id);
      if(alatbm != null) {
        const submitter = await User.findBy('id', alatbm?.submitter);
        const role = await Role.findBy('id', `${submitter?.role_id}`);
        const appHeader = await ApprovalHeader.findBy('no_request', `${alatbm?.request_number}`);
        // const appDetail = await Database.from('approval_detail')
        //                 .join('users', 'users.id', '=', 'approval_detail.user_id')
        //                 .join('roles', 'roles.id', '=', 'approval_detail.role_id')
        //                 .join('entities', 'entities.id', '=', 'roles.entity_id')
        //                 .where('header_id', `${appHeader?.id}`)
        //                 .select('users.name', 'entities.title_alias', 'approval_detail.created_at', 'approval_detail.validation', 'approval_detail.remark', 'approval_detail.sequence');
        const appDetail =await Database.from('approval_log')
                      .join('users', 'users.id', '=', 'approval_log.created_by')
                      .join('roles', 'roles.id', '=', 'users.role_id')
                      .where('request_no', `${alatbm.request_number}`)
                      .orderBy('created_at', 'asc')
                      .select('roles.name', 'users.role_id', 'approval_log.remark', 'approval_log.action', 'approval_log.created_at');
        const appLists = await Database.from('schema_approval_lists')
                        .join('users', 'users.role_id', '=', 'schema_approval_lists.role_id')
                        .where('schema_id', `${alatbm?.schema_id}`)
                        .select('users.name', 'schema_approval_lists.approval_order', 'schema_approval_lists.mandatory', 'schema_approval_lists.approval_order');
        let strTanggal = alatbm?.created_at.toString();
        const strDay = strTanggal.substring(8, 10);
        let bulan;
        switch(strTanggal.substring(4,7)) {
          case "Jan": bulan = "Januari"; break;
          case "Feb": bulan = "Febuari"; break;
          case "Mar": bulan = "Maret"; break;
          case "Apr": bulan = "April"; break;
          case "May": bulan = "Mei"; break;
          case "Jun": bulan = "Juni"; break;
          case "Jul": bulan = "Juli"; break;
          case "Aug": bulan = "Agustus"; break;
          case "Sep": bulan = "September"; break;
          case "Okt": bulan = "Oktober"; break;
          case "Nov": bulan = "November"; break;
          case "Dec": bulan = "Desember"; break;
        }
        let year = strTanggal.substring(11, 15);
        let jam = strTanggal.substring(16, 18);
        let menit = strTanggal.substring(19, 21);
        let resultDate = `${strDay} ${bulan} ${year} ${jam}.${menit}`;
        const data = {
          data: alatbm == null ? alatbm2 : alatbm,
          name_request: submitter?.name, 
          date_request: resultDate, 
          dept_request: role?.name,
          app_detail: appDetail, 
          app_lists: appLists,
          schema_id: alatbm.schema_id
        };
        return view.render('pages/master_peralatan/view_alat_bongkar_muat.edge', data);
      } else {
        const data = {
          data: alatbm == null ? alatbm2 : alatbm
        };
        return view.render('pages/master_peralatan/view_alat_bongkar_muat.edge', data);
      }
    }
    
    public async delete ({ params, bouncer }: HttpContextContract) {
      await bouncer.authorize("access", "delete-alat-bongkar-muat");
      const alatbm = await Alatbm.findByOrFail('id', `${params.id}`);
      
      // hapus detail dari approval 
      const approvalHeader = await ApprovalHeader.findBy('no_request', alatbm.request_number);
      if(approvalHeader) {
        await ApprovalDetail.query().where('header_id', approvalHeader.id).delete(); 
        approvalHeader.delete();
      }

      // hapus history data di log approval
      await ApprovalLog.query().where('request_no', alatbm.request_number).delete();

      // jika yang dihapus adalah data renewal
      if([null, 'null', ''].includes(alatbm.reference_id) == false) {
        const alatbm2 = await AlatbmApproved.findByOrFail('id', alatbm.reference_id);
        alatbm2.is_edit = 0;
        alatbm2.save();
      }

      // hapus file 
      const url1 = await Drive.getUrl(alatbm.file_bast);
      const url2 = await Drive.getUrl(alatbm.file_lampiran_teknis);
      await this.deleteFile(url1);
      await this.deleteFile(url2);

      await alatbm.delete(); 
    }

    public async deleteFile(file) {
      access(file, constants.F_OK, (err) => {
        if(!err) {
          fs.unlinkSync(file);
        }
      });
    }

    public async nonaktif ({ params, bouncer }: HttpContextContract) {
      await bouncer.authorize("access", "activate-alat-bongkar-muat");
      const alatbm = await AlatbmApproved.findByOrFail('id', `${params.id}`); 
      alatbm.status = 'NONAKTIF'; 
      await alatbm.save();
    }

    public async aktif ({ params, bouncer }: HttpContextContract) {
      await bouncer.authorize("access", "activate-alat-bongkar-muat");
      const alatbm = await AlatbmApproved.findByOrFail('id', `${params.id}`); 
      alatbm.status = 'AKTIF'; 
      await alatbm.save();
    }
    
    public async kirim ({ params, auth }: HttpContextContract) {
      const alatbm = await Alatbm.findByOrFail('id', `${params.id}`);
      var isError = false; 
      var listField: string[] = [];
      
      if([null, "null", ""].includes(alatbm.entity)) {
        isError = true;
        listField.push("Entity");
      }

      if([null, "null", ""].includes(alatbm.kepemilikan_aset)) {
        isError = true; 
        listField.push("Kepemilikan Aset");
      }

      if([null, "null", ""].includes(alatbm.lokasi_kepemilikan)) {
        isError = true;
        listField.push("Cabang/Area/Lokasi Kepemilikan Aset");
      }

      if([null, "null", ""].includes(alatbm.lokasi_fisik)) {
        isError = true;
        listField.push("Cabang/Area/Lokasi Fisik Aset");
      }

      if([null, "null", ""].includes(alatbm.kategori_alat)) {
        isError = true;
        listField.push("Kategori Alat");
      } else {
        if([null, "null", ""].includes(alatbm.model)) {
          isError = true;
          listField.push("Model");
        }

        if([null, "null", ""].includes(alatbm.equipment_serial)) {
          isError = true;
          listField.push("Equipment Serial Number");
        }

        if([null, "null", ""].includes(alatbm.kapasitas)) {
          isError = true;
          listField.push("Kapasitas");
        }

        if([null, "null", ""].includes(alatbm.satuan_kapasitas)) {
          isError = true;
          listField.push("Kapasitas");
        }

        const classCode = alatbm.class_code;
        if(["ARG", "ASC", "FJC", "GJC", "GLC", "GSU", "QCC", "RMG", "RTG"].includes(classCode)) {
          if([null, "null", ""].includes(alatbm.span)) {
            isError = true;
            listField.push("Span");
          }
        }

        if(["FJC", "GJC", "GLC", "GSU", "HMC", "MBC", "QCC"].includes(classCode)) {
          if([null, "null", ""].includes(alatbm.outreach)) {
            isError = true;
            listField.push("Outreach");
          }
          
          if([null, "null", ""].includes(alatbm.lifting_above)) {
            isError = true;
            listField.push("Lifting Height Above Rail");
          }
          
          if([null, "null", ""].includes(alatbm.lifting_below)) {
            isError = true;
            listField.push("Lifting Height Below Rail");
          }
        }

        if(["ARG", "ASC", "RMG", "RTG"].includes(classCode)) {
          if([null, "null", ""].includes(alatbm.tier_type)) {
            isError = true;
            listField.push("Tier Height Type");
          }
        } 
      }

      if([null, "null", ""].includes(alatbm.country_origin)) {
        isError = true;
        listField.push("Country of Origin");
      }
      
      if([null, "null", ""].includes(alatbm.manufacturer)) {
        isError = true;
        listField.push("Manufacturer");
      }

      if(alatbm.manufacturer_year ==  null) {
        isError = true;
        listField.push("Manufacturer Year");
      }

      if(alatbm.acquisition_year ==  null) {
        isError = true;
        listField.push("Acquisition Year");
      }
      
      var listPowerSource = ["Listrik", "Engine Diesel", "Baterai Hybrid"]
      if(listPowerSource.includes(alatbm.power_source)) {
        if([null, "null", ""].includes(alatbm.power_capacity)) {
          isError = true;
          listField.push("Power Capacity");
        }

        if([null, "null", ""].includes(alatbm.satuan_capacity)) {
          isError = true;
          listField.push("Satuan Power Capacity");
        }
      }

      if(isError == true) {
        const result = {
          count : 0,
          message: `Ada beberapa field yang harus anda isi seperti berikut : ${listField}`
        }
        return result;
      } else {
        // NOTIFICATION
        const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", alatbm.schema_id).where("approval_order", "1");
        let nextApprovalRoleArray: any = [];
        nextApprovalRole.forEach(function(value) {
          nextApprovalRoleArray.push(value.role_id);
        });
        const nextUserApproval = await User.query().whereIn("role_id", nextApprovalRoleArray);
        let notificationData: any = [];
        nextUserApproval.forEach(function(value) {
          notificationData.push({
            from: auth.user?.id,
            to: value.id,
            request_no: alatbm.request_number,
            master_type_id: alatbm.master_type_id,
            status:'APPROVED'
          });
          Ws.io.emit('receive-notif', { userId: value.id,message:'Request Approval Master Data Peralatan Bongkar Muat' });
        });
        await Notification.createMany(notificationData);

        alatbm.status = 'DIAJUKAN'; 
        await alatbm.save();
        const result = {
          count : 1,
          message: `Data berhasil terkirim`
        }
        return result;
      }
    }

    public async approve ({ request, auth, response }: HttpContextContract) {
      try {
        const noRequest = request.input("no_request");
        const remark = request.input("notes");
        let approvalSequence = 0;
        let approvalHeaderId = "";
  
        const alatbm = await Alatbm.query().where("request_number", noRequest).first();
        const schema = await SchemaAplication.query().where("id", alatbm.schema_id).preload("approvalList").first();
        const SchemaApprovalMax = await SchemaApprovalList.query().where("schema_id", schema.id).orderBy("approval_order", "desc").first();
        let step = 1;
        const approveHeader = await ApprovalHeader.query().where("no_request", noRequest).first();
        const approvalRoleMandatory = [];
        const approvalRoleOptional = [];
  
  
        if (approveHeader) {
          approvalSequence = approveHeader.approval_sequence;
          step = approveHeader.step;
        }
  
        const nextApprovalSequece = approvalSequence + 1;
        schema.approvalList.forEach(function(value) {
          if (value.mandatory == 1 && value.approval_order == nextApprovalSequece) {
            approvalRoleMandatory.push(value.role_id);
          }
  
          if (value.mandatory == 0 && value.approval_order == nextApprovalSequece) {
            approvalRoleOptional.push(value.role_id);
          }
        });
        if (!schema) {
          throw new Exception("Schema Not Found");
        }

        const userApprove = await SchemaApprovalList.query().where("schema_id", schema.id).where("approval_order", nextApprovalSequece).where("role_id", auth.user.role_id).first();
        if (alatbm.status == "DITOLAK" || alatbm.status == "DRAFT") {
          throw new Exception("Data Alat Bongkar Muat Masih Dalam Perbaikan");
        }
        if (alatbm.status == "COMPLETE") {
          throw new Exception("Data Alat Bongkar Muat Sudah Selesai Prosess Persetujuan");
        }
        if (!userApprove) {
          throw new Exception("Anda Tidak Mempunyai Aksess Untuk Melakukan Approval Selanjutnya");
        }
        if (!approveHeader) {
          const approvalHeader = new ApprovalHeader();
          approvalHeader.no_request = noRequest;
          // @ts-ignore
          approvalHeader.total_approve = SchemaApprovalMax.approval_order;
          approvalHeader.id_submitter = auth.user.id;
          approvalHeader.approval_sequence = 0;
          approvalHeader.step = 1;
          await approvalHeader.save();
          approvalHeaderId = approvalHeader.id;
        } else {
          approvalHeaderId = approveHeader.id;
        }
  
        const cekApproval = await ApprovalDetail.query().where("header_id", approvalHeaderId).where("step", step).where("sequence", nextApprovalSequece).where("role_id", auth.user.role_id).first();
  
        if (cekApproval) {
          throw new Exception("Anda Sudah Melakukan Approval Sebelumnya");
        }
  
        const approvalDetail = new ApprovalDetail();
        approvalDetail.user_id = auth.user.id;
        approvalDetail.validation = "APPROVE";
        approvalDetail.header_id = approvalHeaderId;
        approvalDetail.remark = remark;
        approvalDetail.sequence = nextApprovalSequece;
        approvalDetail.role_id = auth.user.role_id;
        approvalDetail.step = step;
        await approvalDetail.save();
  
        let allowedOptional = true;
        const isMandatory = await ApprovalDetail.query().where("header_id", approvalHeaderId).whereIn("role_id", approvalRoleMandatory).where("step", step).where("sequence", nextApprovalSequece);
        if (approvalRoleOptional.length > 0) {
          const isOptional = await ApprovalDetail.query().where("header_id", approvalHeaderId).whereIn("role_id", approvalRoleOptional).where("step", step).where("sequence", nextApprovalSequece);
          if (isOptional.length == 0) {
            allowedOptional = false;
          }
        }
  
  
        if (isMandatory.length == approvalRoleMandatory.length && allowedOptional) {
          const approvalHeader = await ApprovalHeader.findOrFail(approvalHeaderId);
          approvalHeader.approval_sequence = nextApprovalSequece;
          await approvalHeader.save();
  
          if (nextApprovalSequece == SchemaApprovalMax.approval_order) {
            let alatbm_approveds: any = null;
  
            if (alatbm.reference_id) {
              alatbm_approveds = await AlatbmApproved.findOrFail(alatbm.reference_id);
              alatbm_approveds.is_edit = 0;
            } else {
              alatbm_approveds = new AlatbmApproved();
            }
            alatbm_approveds.entity = alatbm.entity;
            alatbm_approveds.kepemilikan_aset = alatbm.kepemilikan_aset;
            alatbm_approveds.kode_aset = alatbm.kode_aset; 
            alatbm_approveds.lokasi_kepemilikan = alatbm.lokasi_kepemilikan;
            alatbm_approveds.lokasi_fisik = alatbm.lokasi_fisik;    
            alatbm_approveds.class_code = alatbm.class_code; 
            alatbm_approveds.class_description = alatbm.class_description; 
            alatbm_approveds.kategori_alat = alatbm.kategori_alat;
            alatbm_approveds.nomor_sap = alatbm.nomor_sap;
            alatbm_approveds.local_equipment = alatbm.local_equipment;
            if([null, "null", ""].includes(alatbm.reference_id)) {
              let totalClassAlat: any = await AlatbmApproved.query().where('class_code', `${alatbm.class_code}`);
              totalClassAlat = totalClassAlat.length + 1;
              const run_num = '00000'.substr( String(totalClassAlat).length ) + (totalClassAlat);  
              alatbm_approveds.equipment_number = `${alatbm.class_code}-${run_num}`;
              alatbm_approveds.equipment_description = `${alatbm.class_code}-${run_num}, ` + alatbm.equipment_description;
            } else {
              alatbm_approveds.equipment_description = alatbm.equipment_description;
            }
            alatbm_approveds.manufacturer = alatbm.manufacturer;
            alatbm_approveds.country_origin = alatbm.country_origin;
            alatbm_approveds.manufacturer_year = alatbm.manufacturer_year;
            alatbm_approveds.acquisition_year = alatbm.acquisition_year;
            alatbm_approveds.model = alatbm.model;
            alatbm_approveds.equipment_serial = alatbm.equipment_serial;
            alatbm_approveds.kapasitas = alatbm.kapasitas;
            alatbm_approveds.satuan_kapasitas = alatbm.satuan_kapasitas;
            alatbm_approveds.power_source = alatbm.power_source;
            alatbm_approveds.power_capacity = alatbm.power_capacity;
            alatbm_approveds.span = alatbm.span;
            alatbm_approveds.outreach = alatbm.outreach;
            alatbm_approveds.lifting_above = alatbm.lifting_above;
            alatbm_approveds.lifting_below = alatbm.lifting_below;
            alatbm_approveds.tier_type = alatbm.tier_type;
            alatbm_approveds.satuan_capacity = alatbm?.satuan_capacity;
            alatbm_approveds.file_bast = alatbm?.file_bast;
            alatbm_approveds.file_lampiran_teknis = alatbm?.file_lampiran_teknis;
            alatbm_approveds.notes = alatbm.notes;
            alatbm_approveds.status = 'AKTIF';
            alatbm_approveds.id_staging = alatbm.id;
  
            await alatbm_approveds.save();
  
            const UpdateAlatbm = await Alatbm.findOrFail(alatbm.id);
            UpdateAlatbm.status = "COMPLETE";
            await UpdateAlatbm.save();
          }
        }

        // NOTIFICATION
        const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", schema.id).where("approval_order", nextApprovalSequece + 1);
        let nextApprovalRoleArray: any = [];
        nextApprovalRole.forEach(function(value) {
          nextApprovalRoleArray.push(value.role_id);
        });
        const nextUserApproval = await User.query().whereIn("role_id", nextApprovalRoleArray);
        let notificationData: any = [];
        nextUserApproval.forEach(async function(value) {
          notificationData.push({
            from: auth.user.id,
            to: value.id,
            request_no: alatbm.request_number,
            master_type_id: "c59d4ff5-djc8-4fa4-bb07-f6fc508506cd",
            status:'APPROVED'
          });
          Ws.io.emit('receive-notif', { userId: value.id,message:'Request Approval Master Data Peralatan Bongkar Muat' });
          await SendMail.approve(value.id,alatbm.submitter,"c59d4ff5-djc8-4fa4-bb07-f6fc508506cd",alatbm.request_number);
        });
        await Notification.createMany(notificationData);

        const approvalLog = new ApprovalLog();
        approvalLog.request_no = alatbm.request_number;
        approvalLog.action = "APPROVE";
        approvalLog.remark = remark;
        approvalLog.created_by = auth.user.id;
        await approvalLog.save();

        let result = {
          "message": "Data berhasil disetujui",
          "approval_sequence": approveHeader?.approval_sequence,
          "total_approve": approveHeader?.total_approve
        };
  
        return response.status(200).send(result);
      } catch (error) {
        let result = {
          "message": error.message
        };
        return response.status(500).send(result);
      }
    }

    public async reject ({ request, auth, response }: HttpContextContract) {
      try {
        const noRequest = request.input("no_request");
        const remark = request.input("notes");
        let approvalSequence = 0;
        let approvalHeaderId = "";
  
        const alatbm = await Alatbm.query().where("request_number", noRequest).first();
        const schema = await SchemaAplication.query().where("id", alatbm.schema_id).preload("approvalList").first();
        if (alatbm.status == "DITOLAK" || alatbm.status == "DRAFT") {
          throw new Exception("Data Alat Bongkar Muat Masih Dalam Perbaikan");
        }
        if (alatbm.status == "COMPLETE") {
          throw new Exception("Data Alat Bongkar Muat Sudah Selesai Prosess Persetujuan");
        }
        const approveHeader = await ApprovalHeader.query().where("no_request", noRequest).first();
        const approvalRoleMandatory = [];
  
  
        if (approveHeader) {
          approvalSequence = approveHeader.approval_sequence;
        }
  
        const nextApprovalSequece = approvalSequence + 1;
        schema.approvalList.forEach(function(value) {
          if (value.mandatory == 1 && value.approval_order == nextApprovalSequece) {
            approvalRoleMandatory.push(value.role_id);
          }
        });
        if (!schema) {
          throw new Exception("Schema Not Found");
        }
  
        const userApprove = await SchemaApprovalList.query().where("schema_id", schema.id).where("approval_order", nextApprovalSequece).where("role_id", auth.user.role_id).first();
  
        if (!userApprove) {
          throw new Exception("Anda Tidak Mempunyai Aksess Untuk Melakukan Approval Selanjutnya");
        }
  
        if (approveHeader) {
          approvalHeaderId = approveHeader.id;
  
          const cekApproval = await ApprovalDetail.query().where("header_id", approvalHeaderId).where("step", approveHeader.step).where("sequence", nextApprovalSequece).where("role_id", auth.user.role_id).first();
  
          if (cekApproval) {
            throw new Exception("Anda Sudah Melakukan Approval Sebelumnya");
          }
  
          const approvalDetail = new ApprovalDetail();
          approvalDetail.user_id = auth.user.id;
          approvalDetail.validation = "REJECT";
          approvalDetail.header_id = approvalHeaderId;
          approvalDetail.remark = remark;
          approvalDetail.sequence = nextApprovalSequece;
          approvalDetail.role_id = auth.user.role_id;
          approvalDetail.step = approveHeader.step;
          await approvalDetail.save();
  
          const UpdateAlatBm = await Alatbm.findOrFail(alatbm.id);
          UpdateAlatBm.status = "DITOLAK";
          await UpdateAlatBm.save();
  
          const approvalHeader2 = await ApprovalHeader.findOrFail(approvalHeaderId);
          approvalHeader2.approval_sequence = 0;
          approvalHeader2.step = approveHeader.step + 1;
          await approvalHeader2.save();
        } else {
          const UpdateAlatBm = await Alatbm.findOrFail(alatbm.id);
          UpdateAlatBm.status = "DITOLAK";
          await UpdateAlatBm.save();
        }

        //NOTIFICATION
        const notification = new Notification();
        notification.from = auth.user.id;
        notification.to = alatbm.submitter;
        notification.request_no = alatbm.request_number;
        notification.master_type_id = "c59d4ff5-djc8-4fa4-bb07-f6fc508506cd";
        notification.status = 'REJECTED';
        await notification.save();
        Ws.io.emit('receive-notif', { userId: alatbm.submitter,message:'Rejected Master Data Peralatan Bongkar Muat' });
        await SendMail.approve(alatbm.submitter,auth.user.id,"c59d4ff5-djc8-4fa4-bb07-f6fc508506cd",alatbm.request_number);

        const approvalLog = new ApprovalLog();
        approvalLog.request_no = alatbm.request_number;
        approvalLog.action = "REJECT";
        approvalLog.remark = remark;
        approvalLog.created_by = auth.user.id;
        await approvalLog.save();

  
        let result = {
          "message": "Data berhasil ditolak"
        };
  
        return response.status(200).send(result);
      } catch (error) {
        let result = {
          "message": error.message
        };
        return response.status(500).send(result);
      }
    }

    public async modalData ({ request, auth }: HttpContextContract) {
      const alatbm = await Alatbm.findBy('request_number', `${request.input('request_number')}`);
      const submitter = await User.findBy('id', alatbm?.submitter);
      const role = await Role.findBy('id', `${submitter?.role_id}`);
      const appHeader = await ApprovalHeader.findBy('no_request', `${request.input('request_number')}`);
      const appLists = await SchemaApprovalList.query().where("schema_id", `${alatbm?.schema_id}`).preload("role").orderBy("approval_order", "asc");
      // const appDetail = await Database.from('apilogs')
      //                 .join('users', 'users.id', '=', 'apilogs.userid')
      //                 .where('request_id', `${request.input('request_number')}`)
      //                 .orderBy('created_at', 'asc')
      //                 .select('users.name', 'users.role_id', 'apilogs.payload', 'apilogs.created_at');
      const appDetail =await Database.from('approval_log')
                      .join('users', 'users.id', '=', 'approval_log.created_by')
                      .join('roles', 'roles.id', '=', 'users.role_id')
                      .where('request_no', `${request.input('request_number')}`)
                      .orderBy('created_at', 'asc')
                      .select('roles.name', 'users.role_id', 'approval_log.remark', 'approval_log.action', 'approval_log.created_at');
      const isSubmitter = await Database.from("schema_aplications").where('role_id', `${auth.user?.role_id}`).andWhere("id", `${alatbm?.schema_id}`);
      const doneApprove = await Database.from("approval_detail").where("header_id", `${appHeader?.id}`).andWhere("step", `${appHeader?.step}`).andWhere("user_id", `${auth.user?.id}`); 
      let strTanggal = alatbm?.created_at.toString();
      const strDay = strTanggal.substring(8, 10);
      let bulan:any;
      switch(strTanggal.substring(4,7)) {
        case "Jan": bulan = "Januari"; break;
        case "Feb": bulan = "Febuari"; break;
        case "Mar": bulan = "Maret"; break;
        case "Apr": bulan = "April"; break;
        case "May": bulan = "Mei"; break;
        case "Jun": bulan = "Juni"; break;
        case "Jul": bulan = "Juli"; break;
        case "Aug": bulan = "Agustus"; break;
        case "Sep": bulan = "September"; break;
        case "Okt": bulan = "Oktober"; break;
        case "Nov": bulan = "November"; break;
        case "Dec": bulan = "Desember"; break;
      }
      let year = strTanggal.substring(11, 15);
      let jam = strTanggal.substring(16, 18);
      let menit = strTanggal.substring(19, 21);
      let resultDate = `${strDay} ${bulan} ${year} ${jam}.${menit}`;
      const data = {
        alatbm: alatbm, 
        name_request: submitter?.name, 
        date_request: resultDate, 
        dept_request: role?.name,
        app_detail: appDetail,
        app_lists: appLists,
        is_submitter: isSubmitter,
        done_approve: doneApprove,
        schema_id: alatbm?.schema_id
      }
      return data;
    }
    
    public async writeExcel ({ response }: HttpContextContract) {
      var data = await AlatbmApproved.query().where('status', 'AKTIF').orderBy('created_at', 'desc');
      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet("Sheet 1", {properties:{defaultColWidth:50}}); 
      
      worksheet.columns = [
          {header:'Equipment Number', key:'equipment_number'},
          {header:'Entity', key:'entity'},
          {header:'Kepemilikan Aset', key:'kepemilikan_aset'},
          {header:'Cabang/Area/Lokasi Kepemilikan Aset', key:'cab_kepemilikan_aset'},
          {header:'Cabang/Area/Lokasi Fisik Aset', key:'cab_fisik_aset'},
          {header:'Group Alat / Class Description', key:'class_description'},
          {header:'Kategori Alat', key:'kategori_alat'},
          {header:'Nomor Aset', key:'nomor_aset'},
          {header:'Local Equipment No', key:'local_equipment'},
          {header:'Country Of Origin', key:'country_origin'},
          {header:'Manufacturer', key:'manufacturer'},
          {header:'Manufacturer Year', key:'manufacturer_year'},
          {header:'Acquisition Year', key:'acquisition_year'},
          {header:'Model', key:'model'},
          {header:'Equipment Serial Number', key:'serial_number'},
          {header:'Kapasitas', key:'kapasitas'},
          {header:'Satuan Kapasitas', key:'satuan_kapasitas'},
          {header:'Power Source', key:'power_source'},
          {header:'Power Capacity', key:'power_capacity'},
          {header:'Satuan Power Capacity', key:'satuan_capacity'},
          {header:'Outreach(m)', key:'outreach'},
          {header:'Span(m)', key:'span'},
          {header:'Lifting Height Above Rail(m)', key:'height_above'},
          {header:'Lifting Height Below Rail(m)', key:'height_below'},
          {header:'Tier Height Type', key:'tier_height'},
          {header:'Equipment Description', key:'equipment_description'},
          {header:'Notes', key:'notes'},
          {header:'Status', key:'status'}
      ];

      for(let i = 0; i < data.length; i++) {
          worksheet.addRow({
            equipment_number: data[i].equipment_number, 
            entity: data[i].entity, 
            kepemilikan_aset: data[i].kepemilikan_aset, 
            cab_kepemilikan_aset: data[i].lokasi_kepemilikan, 
            cab_fisik_aset: data[i].lokasi_fisik,
            class_description: data[i].class_code + ' - ' + data[i].class_description, 
            kategori_alat: data[i].kategori_alat, 
            nomor_aset: data[i].nomor_sap,
            local_equipment: data[i].local_equipment, 
            country_origin: data[i].country_origin, 
            manufacturer: data[i].manufacturer, 
            manufacturer_year: data[i].manufacturer_year, 
            acquisition_year: data[i].acquisition_year, 
            model: data[i].model, 
            serial_number: data[i].equipment_serial, 
            kapasitas: data[i].kapasitas, 
            satuan_kapasitas: data[i].satuan_kapasitas, 
            power_source: data[i].power_source,
            power_capacity: data[i].power_capacity, 
            satuan_capacity: data[i].satuan_capacity, 
            outreach: data[i].outreach, 
            span: data[i].span, 
            height_above: data[i].lifting_above, 
            height_below: data[i].lifting_below, 
            tier_height: data[i].tier_type, 
            equipment_description: data[i].equipment_description, 
            notes: data[i].notes,
            status: data[i].status
          });
      }

      const filePath = Application.publicPath('/media/peralatan/export_peralatan/alatbm.xlsx');

      workbook.xlsx.writeFile(filePath);
      response.redirect().toPath('/master-peralatan/data-alat-bongkar-muat');
    }

    public async exportData ({ response }: HttpContextContract) {
      const filePath = Application.publicPath('/media/peralatan/export_peralatan/alatbm.xlsx');
      response.download(filePath);
    }

    public async countNoRequest () {
      // const total = await Database.rawQuery(`SELECT count(*) + 1 as "total" from "alatbms" where TRUNC("created_at") = TRUNC(SYSDATE)`);
      // return total[0].total;
      const data = await Alatbm.query().whereRaw(`TRUNC("created_at") = TRUNC(SYSDATE)`);
      return data.length + 1;
    }

    public async approvalOrder ({request}:HttpContextContract) {
      const order = await SchemaApprovalList.query().where('schema_id', `${request.input('schema_id')}`).andWhere('role_id', `${request.input('role_id')}`).select('approval_order');
      return order[0].approval_order;
    }

    public async uploadFile ({request,response}: HttpContextContract) {
      try {
        const jenisFile = request.input('jenisFile');
        const namaFile = request.input('namaFile'); 
        const fileData = request.file('fileData', {size: '2mb'});

        if(fileData) {
          fileData.moveToDisk('', {name:namaFile});
        }
        
        let message = "";
        
        if(jenisFile == "bast") {
          message = "Berhasil upload file bast";
        } else if(jenisFile == "lampiranTeknis") {
          message = "Berhasil upload file lampiran teknis";
        }

        const result = {
          "message" : message
        }

        response.status(200).send(result);

      } catch (error) {
        const result = {
          "message" : error.message
        }
        response.status(500).send(result);
      }
    }

    public async downloadUploadedFile ({ params }: HttpContextContract) {
      const namaFile = params.filename;
      const url = await Drive.getUrl(namaFile);
      return url; 
    }
}
