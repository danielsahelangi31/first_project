import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import { Workbook } from "exceljs";
import fs from "fs";
import {access, constants} from "fs";
import Application from '@ioc:Adonis/Core/Application';
import MasterCompany from 'App/Models/MasterCompany';
import AlatApung from 'App/Models/AlatApung';
import AlatApungApproved from 'App/Models/AlatApungApproved';
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
import Klasifikasi from 'App/Models/Klasifikasi';
import JenisKapal from 'App/Models/JenisKapal';
import Cabang from 'App/Models/Cabang';
import JenisPropulsi from 'App/Models/JenisPropulsi';
import ApprovalLog from 'App/Models/ApprovalLog';
import SendMail from 'App/Services/SendMail';
import Drive from '@ioc:Adonis/Core/Drive';

export default class MasterApungsController {
    public async index ({ view, params, auth }: HttpContextContract) {
        let alatapung: any;
        const status = params.id;
        const statusOut = ["draft", "diajukan", "ditolak"];
        const statusApp = ["aktif", "nonaktif"];
        if(statusOut.includes(status)) {
            if(params.id == "draft") {
                alatapung = await AlatApung.query().where('status', status.toUpperCase()).where('submitter', String(auth.user?.id)).orderBy('created_at', 'desc'); 
            } else {
                alatapung = await AlatApung.query().where('status', status.toUpperCase()).orderBy('created_at', 'desc'); 
            } 
        } else if(statusApp.includes(status)) {
            alatapung = await AlatApungApproved.query().where('status', status.toUpperCase()).orderBy('created_at', 'desc');
        } else if(status == "outstanding") {
            alatapung = await AlatApung.query().whereIn('status', ['DIAJUKAN', 'DRAFT', 'DITOLAK']).orderBy('created_at', 'desc');
        } else {
            alatapung = await AlatApungApproved.query().orderBy('created_at', 'desc');
        }
        const total1 = await (await AlatApung.all()).length;
        const total2 = await (await AlatApungApproved.all()).length;
        const approve = await (await AlatApungApproved.query().whereIn('status', ['AKTIF', 'NONAKTIF'])).length;
        const aktif = await (await AlatApungApproved.query().where('status', 'AKTIF')).length;
        const nonaktif = await (await AlatApungApproved.query().where('status', 'NONAKTIF')).length;
        const diajukan = await (await AlatApung.query().where('status', 'DIAJUKAN')).length;
        const ditolak = await (await AlatApung.query().where('status', 'DITOLAK')).length;
        const draft = await (await AlatApung.query().where('status', 'DRAFT').where('submitter', String(auth.user?.id))).length;
        const submitter = await SchemaAplication.findBy('role_id', auth.user?.role_id);
        const approver = await SchemaApprovalList.findBy('role_id', auth.user?.role_id);
        
        const data = {
            param: statusOut.includes(status) || status == "outstanding" ? "outstanding" : "",
            data: alatapung, 
            total: total1 + total2,
            approve: approve,
            aktif: aktif,
            nonaktif: nonaktif, 
            diajukan: diajukan,
            ditolak: ditolak,
            draft: draft,
            submitter: submitter, 
            approver: approver,
            roleId: auth?.user?.role_id
        }
        
        return view.render('pages/master_peralatan/index_alat_kapal.edge', data);
    }
  
    public async add ({ view, bouncer }: HttpContextContract) {
        await bouncer.authorize("access", "create-alat-apung");
        const com = await MasterCompany.query().whereNotIn('company_group', ['5a4bfc54-adf3-48bf-8a10-43ba8615327e', 'd47bb444-4b12-4d31-ac18-fad08fba4086', '69d07ab2-8d39-4277-94bd-1d8286798017', '5c46ea27-5fbf-4bbf-b855-98f369c30934']).orderBy('company_name', 'asc');
        const country = await Country.query().orderBy('country_name', 'asc');
        const groupCompany = await GroupCompany.query().orderBy('sort_no', 'asc');
        const klasifikasi = await Klasifikasi.query().orderBy('sort_no', 'asc');
        const jenisKapal = await JenisKapal.query().orderBy('sort_no', 'asc');
        const cabang = await MasterCompany.query().whereIn('company_group', ['5a4bfc54-adf3-48bf-8a10-43ba8615327e', 'd47bb444-4b12-4d31-ac18-fad08fba4086', '69d07ab2-8d39-4277-94bd-1d8286798017', '5c46ea27-5fbf-4bbf-b855-98f369c30934']).orderBy('company_name', 'asc');;
        const cabang2 = await Cabang.query().whereRaw(`"name" not like '%Sub%'`).orderBy('name', 'asc');
        const jenisPropulsi = await JenisPropulsi.query().orderBy('sort_no', 'asc');
        const data = {
            com: com,
            country: country,
            groupcom: groupCompany,
            klasifikasi: klasifikasi,
            jenisKapal: jenisKapal,
            cabang: cabang, 
            cabang2: cabang2, 
            jenisPropulsi: jenisPropulsi
        }
        return view.render('pages/master_peralatan/add_alat_kapal.edge', data);
    }

    public async store ({ request, auth, response }: HttpContextContract) {
        try {
            const alatapung = new AlatApung();
            alatapung.entity = request.input('entity');
            alatapung.kepemilikan_aset = request.input('kepemilikanAset');
            alatapung.kode_aset = request.input('kodeKepemilikanAset'); 
            alatapung.lokasi_kepemilikan = request.input('lokasiKepemilikanAset'); 
            alatapung.lokasi_fisik = request.input('lokasiFisikAset');
            alatapung.klasifikasi = request.input('klasifikasi');
            alatapung.kode_jenis = request.input('kodeJenisKapal');
            alatapung.jenis_kapal = request.input('jenisKapal');
            alatapung.nama_kapal = request.input("namaKapal"); 
            alatapung.equipment_description = request.input("existingEquipmentDescription");
            alatapung.notes = request.input("notes"); 
            alatapung.kode_alat = request.input("kodeAlat");
            alatapung.local_asset_number = request.input("localAssetNumber");
            alatapung.manufacturer = request.input("manufacturer");
            alatapung.country_of_origin = request.input("countryOfOrigin");
            alatapung.manufacturer_year = request.input('manufacturerYear');
            alatapung.acquisition_year = request.input('acquisitionYear'); 
            alatapung.tipe_me = request.input("tipeMe"); 
            alatapung.daya_me = request.input("dayaMe"); 
            alatapung.tipe_ae = request.input("tipeAe"); 
            alatapung.daya_ae = request.input("dayaAe");
            alatapung.jenis_propulsi = request.input("jenispropulsi");
            alatapung.merk_propulsi = request.input("merkpropulsi");
            alatapung.status = request.input('status');
            alatapung.reference_id = request.input('id');
            if(request.input('id') != undefined) {
                const alatapung2 = await AlatApungApproved.findByOrFail('id', request.input('id')); 
                alatapung2.is_edit = 1;
                alatapung2.save();
            }
            alatapung.submitter = String(auth.user?.id);
            alatapung.entity_id = String(auth.user?.role_id); 
            alatapung.master_type_id = "c59d42f5-d9c8-4fa4-bb0b-f6fc548506cd";
            const schema = await Database.from('schema_aplications').where('role_id', String(auth.user?.role_id)).andWhere('master_type_id', "c59d42f5-d9c8-4fa4-bb0b-f6fc548506cd").select('id');
            if([null, 'null', ''].includes(String(schema))) {
                throw new Exception("User tidak memiliki schema approval");
            }
            alatapung.schema_id = schema[0].id;
            alatapung.reference_id = request.input('id');
            alatapung.request_number = request.input('no_request');
            alatapung.jumlah_ae = request.input('jumlahAe');
            alatapung.jumlah_me = request.input('jumlahMe');
            alatapung.file_grosse_akta = request.input('fileGrosseAktaName');
            alatapung.file_bast = request.input('fileBastName');
            alatapung.file_lampiran_teknis = request.input('fileLampiranTeknisName');
            alatapung.file_spesifikasi_detail_kapal = request.input('fileSpesifikasiDetailKapalName');
            if(request.input("status") == "DIAJUKAN") {
                const approvalLog = new ApprovalLog();
                approvalLog.request_no = alatapung.request_number;
                approvalLog.action = "DIAJUKAN";
                approvalLog.remark = request.input("dataEdited");
                approvalLog.created_by = auth.user.id;
                await approvalLog.save();
    
                // NOTIFICATION
                const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", alatapung.schema_id).where("approval_order", "1");
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
                        master_type_id: "c59d42f5-d9c8-4fa4-bb0b-f6fc548506cd",
                        status:'APPROVED'
                    });
                    Ws.io.emit('receive-notif', { userId: value.id,message:'Request Approval Master Data Peralatan Apung' });
                    await SendMail.approve(value.id, alatapung.submitter, "c59d42f5-d9c8-4fa4-bb0b-f6fc548506cd", alatapung.request_number);
                });
                await Notification.createMany(notificationData);
            }
            
            await alatapung.save();
            
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
        await bouncer.authorize("access", "edit-alat-apung");
        const alatapung = await AlatApung.findBy('id', `${params.id}`)
        const alatapung2 = await AlatApungApproved.findBy('id', `${params.id}`);
        const com = await MasterCompany.query().whereNotIn('company_group', ['5a4bfc54-adf3-48bf-8a10-43ba8615327e', 'd47bb444-4b12-4d31-ac18-fad08fba4086', '69d07ab2-8d39-4277-94bd-1d8286798017', '5c46ea27-5fbf-4bbf-b855-98f369c30934']).orderBy('company_name', 'asc');
        const country = await Country.query().orderBy('country_name', 'asc');
        const groupCompany = await GroupCompany.query().orderBy('sort_no', 'asc');
        const klasifikasi = await Klasifikasi.query().orderBy('sort_no', 'asc');
        const jenisKapal = await JenisKapal.query().orderBy('sort_no', 'asc');
        const cabang = await await MasterCompany.query().whereIn('company_group', ['5a4bfc54-adf3-48bf-8a10-43ba8615327e', 'd47bb444-4b12-4d31-ac18-fad08fba4086', '69d07ab2-8d39-4277-94bd-1d8286798017', '5c46ea27-5fbf-4bbf-b855-98f369c30934']).orderBy('company_name', 'asc');;
        const cabang2 = await Cabang.query().whereRaw(`"name" not like '%Sub%'`).orderBy('name', 'asc');
        const jenisPropulsi = await JenisPropulsi.query().orderBy('sort_no', 'asc');
        const data = {
            data: alatapung == null ? alatapung2 : alatapung,
            com: com,
            country: country,
            groupcom: groupCompany, 
            klasifikasi: klasifikasi,
            jenisKapal: jenisKapal,
            cabang: cabang, 
            cabang2: cabang2,
            jenisPropulsi: jenisPropulsi
        }
        return view.render('pages/master_peralatan/edit_alat_kapal.edge', data);
    }

    public async update ({ request, auth, response }: HttpContextContract) {
        try {
            const alatapung = await AlatApung.findByOrFail('id', `${request.input('id')}`);
            alatapung.entity = request.input('entity');
            alatapung.kepemilikan_aset = request.input('kepemilikanAset');
            alatapung.kode_aset = request.input('kodeKepemilikanAset'); 
            alatapung.lokasi_kepemilikan = request.input('lokasiKepemilikanAset'); 
            alatapung.lokasi_fisik = request.input('lokasiFisikAset');
            alatapung.klasifikasi = request.input('klasifikasi');
            alatapung.jenis_kapal = request.input('jenisKapal'); 
            alatapung.kode_jenis = request.input("kodeJenisKapal");
            alatapung.nama_kapal = request.input("namaKapal"); 
            alatapung.equipment_description = request.input("existingEquipmentDescription");
            alatapung.notes = request.input("notes"); 
            alatapung.kode_alat = request.input("kodeAlat");
            alatapung.local_asset_number = request.input("localAssetNumber");
            alatapung.manufacturer = request.input("manufacturer");
            alatapung.country_of_origin = request.input("countryOfOrigin");
            alatapung.manufacturer_year = request.input('manufacturerYear');
            alatapung.acquisition_year = request.input('acquisitionYear');
            alatapung.tipe_me = request.input("tipeMe"); 
            alatapung.daya_me = request.input("dayaMe"); 
            alatapung.tipe_ae = request.input("tipeAe"); 
            alatapung.daya_ae = request.input("dayaAe");
            alatapung.jenis_propulsi = request.input("jenispropulsi");
            alatapung.merk_propulsi = request.input("merkpropulsi");
            alatapung.jumlah_ae = request.input('jumlahAe');
            alatapung.jumlah_me = request.input('jumlahMe');
            alatapung.file_grosse_akta = request.input('fileGrosseAktaName');
            alatapung.file_bast = request.input('fileBastName');
            alatapung.file_lampiran_teknis = request.input('fileLampiranTeknisName');
            alatapung.file_spesifikasi_detail_kapal = request.input('fileSpesifikasiDetailKapalName');
            const status = request.input('status');
            alatapung.status = status  ==  "UPDATE" ? "DIAJUKAN" : status;
            alatapung.resubmit = request.input('resubmit');

            if(request.input("status") == "DIAJUKAN" || request.input("status") == "UPDATE") {
                const approvalLog = new ApprovalLog();
                approvalLog.request_no = alatapung.request_number;
                approvalLog.action = request.input("status");
                approvalLog.remark = request.input("dataEdited");
                approvalLog.created_by = auth.user.id;
                await approvalLog.save();
    
                // NOTIFICATION
                const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", alatapung.schema_id).where("approval_order", "1");
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
                        master_type_id: "c59d42f5-d9c8-4fa4-bb0b-f6fc548506cd",
                        status:'APPROVED'
                    });
                    Ws.io.emit('receive-notif', { userId: value.id,message:'Request Approval Master Data Peralatan Apung' });
                    await SendMail.approve(value.id, alatapung.submitter, "c59d42f5-d9c8-4fa4-bb0b-f6fc548506cd", alatapung.request_number);
                });
                await Notification.createMany(notificationData);
            }
            
            await alatapung.save();
            
            let message = "";
            if(request.input('status') == "DRAFT") {
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
        const alatapung2 = await AlatApungApproved.findBy('id', `${params.id}`);
        const alatapung = await AlatApung.findBy('id', params.id);
        if(alatapung != null) {
            const submitter = await User.findBy('id', alatapung?.submitter);
            const role = await Role.findBy('id', `${submitter?.role_id}`);
            const appDetail =await Database.from('approval_log')
                        .join('users', 'users.id', '=', 'approval_log.created_by')
                        .join('roles', 'roles.id', '=', 'users.role_id')
                        .where('request_no', `${alatapung.request_number}`)
                        .orderBy('created_at', 'asc')
                        .select('roles.name', 'users.role_id', 'approval_log.remark', 'approval_log.action', 'approval_log.created_at');
            const appLists = await Database.from('schema_approval_lists')
                            .join('users', 'users.role_id', '=', 'schema_approval_lists.role_id')
                            .where('schema_id', `${alatapung?.schema_id}`)
                            .select('users.name', 'schema_approval_lists.approval_order', 'schema_approval_lists.mandatory', 'schema_approval_lists.approval_order');
            let strTanggal = alatapung?.created_at.toString();
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
                data: alatapung == null ? alatapung2 : alatapung,
                name_request: submitter?.name, 
                date_request: resultDate, 
                dept_request: role?.name,
                app_detail: appDetail,
                app_lists: appLists, 
                schema_id: alatapung.schema_id
            };
            
            return view.render('pages/master_peralatan/view_alat_kapal.edge', data);
        } else {
            const data = {
                data: alatapung == null ? alatapung2 : alatapung
            };
            
            return view.render('pages/master_peralatan/view_alat_kapal.edge', data);
        }
    }

    public async delete ({ params, bouncer }: HttpContextContract) {
        await bouncer.authorize("access", "delete-alat-apung");
        const alatapung = await AlatApung.findByOrFail('id', `${params.id}`);
        const approvalHeader = await ApprovalHeader.findBy('no_request', alatapung.request_number);
        if(approvalHeader) {
            await ApprovalDetail.query().where('header_id', approvalHeader.id).delete();
            approvalHeader.delete();
        }
        
        await ApprovalLog.query().where('request_no', alatapung.request_number).delete();

        // jika yang dihapus adalah data renewal
        if([null, 'null', ''].includes(alatapung.reference_id) == false) {
            const alatapung2 = await AlatApungApproved.findByOrFail('id', alatapung.reference_id);
            alatapung2.is_edit = 0;
            alatapung2.save();
        }

        // hapus file 
        const url1 = await Drive.getUrl(alatapung.file_grosse_akta);
        const url2 = await Drive.getUrl(alatapung.file_bast);
        const url3 = await Drive.getUrl(alatapung.file_lampiran_teknis);
        const url4 = await Drive.getUrl(alatapung.file_spesifikasi_detail_kapal);
        await this.deleteFile(url1);
        await this.deleteFile(url2);
        await this.deleteFile(url3);
        await this.deleteFile(url4);

        await alatapung.delete();
    }

    public async deleteFile(file) {
      access(file, constants.F_OK, (err) => {
        if(!err) {
          fs.unlinkSync(file);
        }
      });
    }

    public async nonaktif ({ params, bouncer }: HttpContextContract) {
        await bouncer.authorize("access", "activate-alat-apung");
        const alatapung = await AlatApungApproved.findByOrFail('id', `${params.id}`);
        alatapung.status = "NONAKTIF"; 
        await alatapung.save();
    }

    public async aktif ({ params, bouncer }: HttpContextContract) {
        await bouncer.authorize("access", "activate-alat-apung");
        const alatapung = await AlatApungApproved.findByOrFail("id", `${params.id}`);
        alatapung.status = "AKTIF"; 
        await alatapung.save();
    }
    
    public async kirim ({ params, auth }: HttpContextContract) {
        const alatapung = await AlatApung.findByOrFail("id", `${params.id}`);
        var isError = false;
        var listField: string[] = [];
        const value = [null, "null", ""]; 
        
        if(value.includes(alatapung.entity)) {
            isError = true;
            listField.push("Entity");
        }

        if(value.includes(alatapung.klasifikasi)) {
            isError = true;
            listField.push("Klasifikasi");
        }

        if(value.includes(alatapung.kepemilikan_aset)) {
            isError = true;
            listField.push("Kepemilikan Aset");
        }

        if(value.includes(alatapung.jenis_kapal)) {
            isError = true;
            listField.push("Kode dan Jenis Kapal");
        }

        if(alatapung.kode_jenis == "KPD" || alatapung.kode_jenis == "KTD") {
            if(value.includes(alatapung.tipe_me)) {
                isError = true;
                listField.push("Merk/Tipe ME");  
            }

            if(value.includes(alatapung.daya_ae)) {
                isError = true;
                listField.push("Daya AE (Horsepower)");  
            }

            if(value.includes(alatapung.daya_me)) {
                isError = true;
                listField.push("Daya ME (Horsepower)");  
            }

            if(value.includes(alatapung.merk_propulsi)) {
                isError = true;
                listField.push("Merk propulsi");  
            }

            if(value.includes(alatapung.jenis_propulsi)) {
                isError = true;
                listField.push("Jenis Propulsi");  
            }

            if(value.includes(alatapung.equipment_description)) {
                isError = true;
                listField.push("Existing Equipment Description");  
            }

            if(value.includes(alatapung.tipe_ae)) {
                isError = true;
                listField.push("Merk/Tipe AE");  
            }
        }

        if(value.includes(alatapung.lokasi_kepemilikan)) {
            isError = true;
            listField.push("Cabang/Area/Lokasi Kepemilikan Aset");
        }

        // if(value.includes(alatapung.lokasi_fisik)) {
        //   isError = true;
        //   listField.push("Cabang/Area/Lokasi Fisik Aset");
        // }

        if(value.includes(alatapung.manufacturer)) {
            isError = true;
            listField.push("Manufacturer");
        }

        // if(value.includes(alatapung.manufacturer == null || alatapung.manufacturer == "null" ) {
        //   isError = true;
        //   listField.push("Manufacturer");
        // }

        if(value.includes(alatapung.country_of_origin)) {
            isError = true;
            listField.push("Country of Origin");
        }

        if(alatapung.manufacturer_year == null) {
            isError = true;
            listField.push("Manufacturer Year");
        }

        if(alatapung.acquisition_year == null) {
            isError = true;
            listField.push("Acquisition Year");
        }

        if(isError == true) {
            const result = {
                count : 0,
                message: `Ada beberapa field yang harus anda isi seperti berikut : ${listField}`
            }
            return result;
        } else {
            // NOTIFICATION
            const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", alatapung.schema_id).where("approval_order", "1");
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
                    request_no: alatapung.request_number,
                    master_type_id: alatapung.master_type_id,
                    status:'APPROVED'
                });
                Ws.io.emit('receive-notif', { userId: value.id,message:'Request Approval Master Data Peralatan Apung' });
            });
            await Notification.createMany(notificationData);

            alatapung.status = "DIAJUKAN"; 
            await alatapung.save();
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

            const alatapung = await AlatApung.query().where("request_number", noRequest).first();
            const schema = await SchemaAplication.query().where("id", alatapung.schema_id).preload("approvalList").first();
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
            
            if (alatapung.status == "DITOLAK" || alatapung.status == "DRAFT") {
                throw new Exception("Data Alat Apung Masih Dalam Perbaikan");
            }
            
            if (alatapung.status == "COMPLETE") {
                throw new Exception("Data Alat Apung Sudah Selesai Prosess Persetujuan");
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
                    let alatapung_approveds: any = null;

                    if (alatapung.reference_id) {
                        alatapung_approveds = await AlatApungApproved.findOrFail(alatapung.reference_id);
                        alatapung_approveds.is_edit = 0;
                    } else {
                        alatapung_approveds = new AlatApungApproved();
                    }
                    alatapung_approveds.entity = alatapung.entity;
                    alatapung_approveds.kepemilikan_aset = alatapung.kepemilikan_aset;
                    alatapung_approveds.kode_aset = alatapung.kode_aset; 
                    alatapung_approveds.lokasi_kepemilikan = alatapung.lokasi_kepemilikan; 
                    alatapung_approveds.lokasi_fisik = alatapung.lokasi_fisik;
                    alatapung_approveds.klasifikasi = alatapung.klasifikasi;
                    alatapung_approveds.jenis_kapal = alatapung.jenis_kapal; 
                    alatapung_approveds.kode_jenis = alatapung.kode_jenis;
                    alatapung_approveds.nama_kapal = alatapung.nama_kapal; 
                    alatapung_approveds.notes = alatapung.notes;
                    if([null, "null", ""].includes(alatapung.reference_id)) {
                        let totalClassAlat: any = await AlatApungApproved.query().where('kode_jenis', `${alatapung.kode_jenis}`);
                        totalClassAlat = totalClassAlat.length + 1;
                        const run_num = '00000'.substr( String(totalClassAlat).length ) + (totalClassAlat);  
                        alatapung_approveds.kode_alat = `${alatapung.kode_jenis}-${run_num}`;
                        alatapung_approveds.equipment_description = `${alatapung.kode_jenis}-${run_num}, ` + alatapung.equipment_description;
                    } else {
                        alatapung_approveds.equipment_description = alatapung.equipment_description;
                    }
                    alatapung_approveds.local_asset_number = alatapung.local_asset_number;
                    alatapung_approveds.manufacturer = alatapung.manufacturer;
                    alatapung_approveds.country_of_origin = alatapung.country_of_origin;
                    alatapung_approveds.manufacturer_year = alatapung.manufacturer_year;
                    alatapung_approveds.acquisition_year = alatapung.acquisition_year; 
                    alatapung_approveds.tipe_me = alatapung.tipe_me; 
                    alatapung_approveds.daya_me = alatapung.daya_me; 
                    alatapung_approveds.tipe_ae = alatapung.tipe_ae; 
                    alatapung_approveds.daya_ae = alatapung.daya_ae;
                    alatapung_approveds.jenis_propulsi = alatapung.jenis_propulsi;
                    alatapung_approveds.merk_propulsi = alatapung.merk_propulsi;
                    alatapung_approveds.jumlah_ae = alatapung.jumlah_ae;
                    alatapung_approveds.jumlah_me = alatapung.jumlah_me;
                    alatapung_approveds.file_grosse_akta = alatapung.file_grosse_akta;
                    alatapung_approveds.file_bast = alatapung.file_bast;
                    alatapung_approveds.file_lampiran_teknis = alatapung.file_lampiran_teknis;
                    alatapung_approveds.file_spesifikasi_detail_kapal = alatapung.file_spesifikasi_detail_kapal;
                    alatapung_approveds.status = 'AKTIF';
                    alatapung_approveds.id_staging = alatapung?.id;

                    await alatapung_approveds.save();

                    const UpdateAlatApung = await AlatApung.findOrFail(alatapung.id);
                    UpdateAlatApung.status = "COMPLETE";
                    await UpdateAlatApung.save();
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
                    request_no: alatapung.request_number,
                    master_type_id: "c59d42f5-d9c8-4fa4-bb0b-f6fc548506cd",
                    status:'APPROVED'
                });
                Ws.io.emit('receive-notif', { userId: value.id,message:'Request Approval Master Data Peralatan Apung' });
                await SendMail.approve(value.id, alatapung.submitter, "c59d42f5-d9c8-4fa4-bb0b-f6fc548506cd", alatapung.request_number);
            });
            await Notification.createMany(notificationData);

            const approvalLog = new ApprovalLog();
            approvalLog.request_no = alatapung.request_number;
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

            const alatapung = await AlatApung.query().where("request_number", noRequest).first();
            const schema = await SchemaAplication.query().where("id", alatapung.schema_id).preload("approvalList").first();
            
            if (alatapung.status == "DITOLAK" || alatapung.status == "DRAFT") {
                throw new Exception("Data Alat Apung Masih Dalam Perbaikan");
            }

            if (alatapung.status == "COMPLETE") {
                throw new Exception("Data Alat Apung Sudah Selesai Prosess Persetujuan");
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

                const UpdateAlatApung = await AlatApung.findOrFail(alatapung.id);
                UpdateAlatApung.status = "DITOLAK";
                await UpdateAlatApung.save();

                const approvalHeader2 = await ApprovalHeader.findOrFail(approvalHeaderId);
                approvalHeader2.approval_sequence = 0;
                approvalHeader2.step = approveHeader.step + 1;
                await approvalHeader2.save();
            } else {
                const UpdateAlatApung = await AlatApung.findOrFail(alatapung.id);
                UpdateAlatApung.status = "DITOLAK";
                await UpdateAlatApung.save();
            }

            //NOTIFICATION
            const notification = new Notification();
            notification.from = auth.user.id;
            notification.to = alatapung.submitter;
            notification.request_no = alatapung.request_number;
            notification.master_type_id = alatapung.master_type_id;
            notification.status = 'REJECTED';
            await notification.save();
            Ws.io.emit('receive-notif', { userId: alatapung.submitter,message:'Rejected Master Data Peralatan Apung' });
            await SendMail.approve(alatapung.submitter, auth.user.id, "c59d42f5-d9c8-4fa4-bb0b-f6fc548506cd", alatapung.request_number);

            const approvalLog = new ApprovalLog();
            approvalLog.request_no = alatapung.request_number;
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
        const alatap = await AlatApung.findBy('request_number', `${request.input('request_number')}`);
        const submitter = await User.findBy('id', alatap?.submitter);
        const role = await Role.findBy('id', `${submitter?.role_id}`);
        const appHeader = await ApprovalHeader.findBy('no_request', `${request.input('request_number')}`);
        const appDetail =await Database.from('approval_log')
                      .join('users', 'users.id', '=', 'approval_log.created_by')
                      .join('roles', 'roles.id', '=', 'users.role_id')
                      .where('request_no', `${request.input('request_number')}`)
                      .orderBy('created_at', 'asc')
                      .select('roles.name', 'users.role_id', 'approval_log.remark', 'approval_log.action', 'approval_log.created_at');
        const appLists = await SchemaApprovalList.query().where("schema_id", `${alatap?.schema_id}`).preload("role").orderBy("approval_order", "asc");
        const isSubmitter = await Database.from("schema_aplications").where('role_id', `${auth.user?.role_id}`).andWhere("id", `${alatap?.schema_id}`);
        const doneApprove = await Database.from("approval_detail").where("header_id", `${appHeader?.id}`).andWhere("step", `${appHeader?.step}`).andWhere("user_id", `${auth.user?.id}`);
        let strTanggal = alatap?.created_at.toString();
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
            alatap: alatap, 
            name_request: submitter?.name, 
            date_request: resultDate, 
            dept_request: role?.name,
            app_detail : appDetail,
            app_lists : appLists,
            is_submitter: isSubmitter,
            done_approve: doneApprove,
            schema_id: alatap?.schema_id
        }
        return data;
    }

    public async writeExcel ({ response }: HttpContextContract) {
      var data = await AlatApungApproved.query().where('status', 'AKTIF').orderBy('created_at', 'desc');
      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet("Sheet 1", {properties:{defaultColWidth:50}}); 

      worksheet.columns = [
        {header:'Kode Alat', key:'kode_alat'},
        {header:'Entity', key:'entity'},
        {header:'Kepemilikan Aset', key:'kepemilikan_aset'},
        {header:'Cabang/Area/Lokasi Kepemilikan Aset', key:'cab_kepemilikan_aset'},
        {header:'Nama Kapal', key:'nama_kapal'},
        {header:'Kode Jenis Kapal', key:'kode_jenis_kapal'},
        {header:'Jenis Kapal', key:'jenis_kapal'},
        {header:'Klasifikasi', key:'klasifikasi'},
        {header:'Country Of Origin', key:'country_origin'},
        {header:'Manufacturer', key:'manufacturer'},
        {header:'Manufacturer Year', key:'manufacturer_year'},
        {header:'Acquisition Year', key:'acquisition_year'},
        {header:'Local Asset Number', key:'local_asset_number'},
        {header:'Merk/Tipe ME', key:'tipe_me'},
        {header:'Merk/Tipe AE', key:'tipe_ae'},
        {header:'Daya ME', key:'daya_me'},
        {header:'Daya AE', key:'daya_ae'},
        {header:'Jumlah ME', key:'jumlah_me'},
        {header:'Jumlah AE', key:'jumlah_ae'},
        {header:'Merk Propulsi', key:'merk_propulsi'},
        {header:'Jenis Propulsi', key:'jenis_propulsi'},
        {header:'Existing Equipment Description', key:'equipment_description'},
        {header:'Notes', key:'notes'},
        {header:'Status', key:'status'}
      ];

      for(let i = 0; i < data.length; i++) {
        worksheet.addRow({
          kode_alat: data[i].kode_alat, 
          entity: data[i].entity, 
          kepemilikan_aset: data[i].kepemilikan_aset, 
          cab_kepemilikan_aset: data[i].lokasi_kepemilikan, 
          nama_kapal: data[i].nama_kapal,
          kode_jenis_kapal: data[i].kode_jenis, 
          jenis_kapal: data[i].jenis_kapal, 
          klasifikasi: data[i].klasifikasi, 
          country_origin: data[i].country_of_origin, 
          manufacturer: data[i].manufacturer, 
          manufacturer_year: data[i].manufacturer_year, 
          acquisition_year: data[i].acquisition_year, 
          local_asset_number: data[i].local_asset_number, 
          tipe_me: data[i].tipe_me, 
          daya_me: data[i].daya_me, 
          tipe_ae: data[i].tipe_ae, 
          daya_ae: data[i].daya_ae, 
          jumlah_me: data[i].jumlah_me, 
          jumlah_ae: data[i].jumlah_ae, 
          jenis_propulsi: data[i].jenis_propulsi, 
          merk_propulsi: data[i].merk_propulsi, 
          equipment_description: data[i].equipment_description, 
          notes: data[i].notes, 
          status: data[i].status
        });
      }

      const filePath = Application.publicPath('/media/peralatan/export_peralatan/alatkp.xlsx');
      workbook.xlsx.writeFile(filePath);
      response.redirect().toPath('/master-peralatan/data-alat-apung');
    }

    public async exportData ({ response }: HttpContextContract) {
        const filePath = Application.publicPath('/media/peralatan/export_peralatan/alatkp.xlsx');
        response.download(filePath, true);
    }

    public async countNoRequest() {
        // const total = await Database.rawQuery(`SELECT count(*) + 1 as "total" from "alatapungs" where TRUNC("created_at") = TRUNC(SYSDATE)`);
        // return total[0].total;
        const data = await AlatApung.query().whereRaw(`TRUNC("created_at") = TRUNC(SYSDATE)`);
        return data.length + 1;
    }

    public async approvalOrder({request}:HttpContextContract) {
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
            if(jenisFile == "grosseAkta") {
            message = "Berhasil upload file grosse akta";
            } else if(jenisFile == "bast") {
            message = "Berhasil upload file bast";
            } else if(jenisFile == "lampiranTeknis") {
            message = "Berhasil upload file lampiran teknis";
            } else if(jenisFile == 'spesifikasiDetailKapal') {
            message = "Berhasil upload file spesifikasi detail kapal";
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
  
    public async downloadUploadedFile ({params}: HttpContextContract) {
      const namaFile = params.filename;
      const url = await Drive.getUrl(namaFile);
      return url;
    }

}
