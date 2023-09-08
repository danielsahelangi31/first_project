import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Branch from 'App/Models/Branch';
import Terminal from 'App/Models/Terminal';
import JenisTerminal from 'App/Models/JenisTerminal';
import Dermaga from 'App/Models/Dermaga';
import DermagaApproved from 'App/Models/DermagaApproved';
import ApprovalLog from 'App/Models/ApprovalLog';
import SchemaApprovalList from 'App/Models/SchemaApprovalList';
import SchemaAplication from 'App/Models/SchemaAplication';
import ApprovalHeader from 'App/Models/ApprovalHeader';
import ApprovalDetail from 'App/Models/ApprovalDetail';
import User from 'App/Models/User';
import Role from 'App/Models/Role';
import Database from '@ioc:Adonis/Lucid/Database';
import Application from '@ioc:Adonis/Core/Application';
import { Workbook } from "exceljs";
import { Exception } from '@poppinss/utils';
import Ws from 'App/Services/Ws';
import SendMail from 'App/Services/SendMail';
import Notification from 'App/Models/Notification';
import JenisPerairan from 'App/Models/JenisPerairan';
import JenisKonstruksi from 'App/Models/JenisKonstruksi';
import JenisDermaga from 'App/Models/JenisDermaga';
import StatusMilik from 'App/Models/StatusMilik';
import DermagaCoordinates from 'App/Models/DermagaCoordinates';
import CreateDermagaValidator from 'App/Validators/CreateDermagaValidator';
import Route from '@ioc:Adonis/Core/Route';
import AWS from 'aws-sdk';
import Env from '@ioc:Adonis/Core/Env'
import fs from 'fs';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import Drive from '@ioc:Adonis/Core/Drive'


export default class MasterDermagasController {
  public async index({ view, params, auth }: HttpContextContract) {
    let dermaga: any;
    const status = params.id;
    const statusOut = ["draft", "diajukan", "ditolak"];
    const statusApp = ["aktif", "nonaktif"];

    if (statusOut.includes(params.id)) {
      if (params.id == "draft") {
        dermaga = await Dermaga.query().preload('id_dermaga').where('status', status.toUpperCase()).where('submitter', String(auth.user?.id)).orderBy('created_at', 'desc');
      } else {
        dermaga = await Dermaga.query().preload('id_dermaga').where('status', status.toUpperCase()).orderBy('created_at', 'desc');
      }
    } else if (statusApp.includes(params.id)) {
      dermaga = await DermagaApproved.query().preload('id_dermaga').where('status', status.toUpperCase()).orderBy('created_at', 'desc');
    } else if (status == "outstanding") {
      dermaga = await Dermaga.query().preload('id_dermaga').whereIn('status', ['DIAJUKAN', 'DRAFT', 'DITOLAK']).orderBy('created_at', 'desc');
    } else {
      dermaga = await DermagaApproved.query().preload('id_dermaga').orderBy('created_at', 'desc');
    }

    const dermagaCoordinates = await DermagaCoordinates.query().orderBy('line_number', 'asc');
    const draft = await Dermaga.query().where('status', 'DRAFT').where('submitter', String(auth.user?.id));
    const diajukan = await Dermaga.query().where('status', 'DIAJUKAN');
    const ditolak = await Dermaga.query().where('status', 'DITOLAK');
    const total1 = await Dermaga.all();
    const nonaktif = await DermagaApproved.query().where('status', 'NONAKTIF');
    const aktif = await DermagaApproved.query().where('status', 'AKTIF');
    const total2 = await DermagaApproved.all();
    const submitter = await SchemaAplication.findBy('role_id', auth.user?.role_id);
    const approver = await SchemaApprovalList.findBy('role_id', auth.user?.role_id);
    const data = {
      param: statusOut.includes(status) || status == "outstanding" ? "outstanding" : "",
      draft: draft.length,
      diajukan: diajukan.length,
      ditolak: ditolak.length,
      aktif: aktif.length,
      nonaktif: nonaktif.length,
      approve: aktif.length + nonaktif.length,
      total: total1.length + total2.length,
      dermaga: dermaga,
      submitter: submitter,
      approver: approver,
      roleId: auth?.user?.role_id,
      dermaga_coordinates: dermagaCoordinates
    }

    if (statusOut.includes(params.id) || status == "outstanding") {
      return view.render("pages/master_dermaga/page/outstanding/index.edge", data);
    } else {
      return view.render("pages/master_dermaga/page/approved/index.edge", data);
    }
  }

  public async add({ view, bouncer }: HttpContextContract) {
    await bouncer.authorize("access", "create-dermaga");
    return view.render("pages/master_dermaga/page/add.edge");
  }

  public async store({ request, auth, response }: HttpContextContract) {
    try {
      const dermaga = new Dermaga();
      dermaga.kode_pelabuhan = request.input("kode_pelabuhan");
      dermaga.nama_pelabuhan = request.input("nama_pelabuhan");
      dermaga.kode_terminal = request.input("kode_terminal");
      dermaga.nama_terminal = request.input("nama_terminal");
      dermaga.nama_dermaga = request.input("nama_dermaga");
      dermaga.jenis_dermaga = request.input("jenis_dermaga");
      dermaga.jenis_konstruksi = request.input("jenis_konstruksi");
      dermaga.pemilik = request.input("pemilik");
      dermaga.status_milik = request.input("status_milik");
      dermaga.kode_area_labuh = request.input("kode_area_labuh");
      dermaga.jenis_perairan = request.input("jenis_perairan");
      dermaga.tipe_layanan_utama = request.input("tipe_layanan_utama");
      dermaga.zonasi = request.input("zonasi");
      dermaga.layanan_labuh = request.input("layanan_labuh");
      dermaga.layanan_tambat = request.input("layanan_tambat");
      const coordinates: any[] = request.input("coordinates") ? request.input("coordinates") : '';
      dermaga.dokumen_pendukung = request.input("dokumen_pendukung");
      dermaga.kode_dermaga_inaportnet = request.input("kode_dermaga_inaportnet");
      dermaga.panjang = request.input("panjang");
      dermaga.lebar = request.input("lebar");
      dermaga.kade_meter_awal = request.input("kade_meter_awal");
      dermaga.kade_meter_akhir = request.input("kade_meter_akhir");
      dermaga.kedalaman_minimal = request.input("kedalaman_minimal");
      dermaga.kedalaman_maximal = request.input("kedalaman_maximal");
      dermaga.elevasi_dermaga_minimal = request.input("elevasi_dermaga_minimal");
      dermaga.elevasi_dermaga_maximal = request.input("elevasi_dermaga_maximal");
      dermaga.jarak_station_tunda = request.input("jarak_station_tunda");
      dermaga.jarak_station_pandu = request.input("jarak_station_pandu");
      dermaga.overhang_at_start = request.input("overhang_at_start");
      dermaga.overhang_at_end = request.input("overhang_at_end");
      dermaga.mob_demob = request.input("mob_demob");
      dermaga.status = request.input("status");

      if (request.input('id') != undefined) {
        const dermaga2 = await DermagaApproved.findByOrFail('id', request.input('id'));
        dermaga2.is_edit = 1;
        dermaga2.save();
      }

      dermaga.submitter = String(auth.user?.id);
      dermaga.entity_id = String(auth.user?.role_id);
      dermaga.master_type_id = "ec964b7c-2350-40ef-8cea-656204df5f2e";
      const schema = await Database.from('schema_aplications').where('role_id', String(auth.user?.role_id)).andWhere('master_type_id', "ec964b7c-2350-40ef-8cea-656204df5f2e").select('id');
      if ([null, 'null', ''].includes(String(schema))) {
        throw new Exception("User tidak memiliki schema approval");
      }
      dermaga.schema_id = schema[0].id;
      dermaga.request_number = request.input("no_request");
      dermaga.reference_id = request.input("id");
      dermaga.kode_dermaga = request.input("kode_dermaga");

      if (request.input('status') == "DIAJUKAN") {
        const approvalLog = new ApprovalLog();
        approvalLog.request_no = dermaga.request_number;
        approvalLog.action = "DIAJUKAN";
        approvalLog.remark = request.input("data_edited");
        approvalLog.created_by = auth.user.id;
        await approvalLog.save();

        // NOTIFICATION
        const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", schema[0].id).where("approval_order", "1");
        let nextApprovalRoleArray: any = [];
        nextApprovalRole.forEach(function (value) {
          nextApprovalRoleArray.push(value.role_id);
        });
        const nextUserApproval = await User.query().whereIn("role_id", nextApprovalRoleArray);
        let notificationData: any = [];
        nextUserApproval.forEach(async function (value) {
          notificationData.push({
            from: auth.user?.id,
            to: value.id,
            request_no: request.input("no_request"),
            master_type_id: "ec964b7c-2350-40ef-8cea-656204df5f2e",
            status: 'APPROVED'
          });
          Ws.io.emit('receive-notif', { userId: value.id, message: 'Request Approval Master Data Dermaga' });
          await SendMail.approve(value.id, dermaga.submitter, "ec964b7c-2350-40ef-8cea-656204df5f2e", dermaga.request_number);
        });
        await Notification.createMany(notificationData);
      }

      const saveDermaga = await dermaga.save();
      const saveCoordinates = await Dermaga.findOrFail(saveDermaga.id);
      if (coordinates.length > 0) {
        await saveCoordinates?.related('id_dermaga').createMany(coordinates);
      }

      let message = "";
      if (request.input('status') == "DRAFT") {
        message = "Data akan disimpan sementara";
      } else if (request.input('status') == "DIAJUKAN") {
        message = "Data berhasil terkirim";
      }

      const result = {
        message: message
      }

      return response.status(200).send(result);
    } catch (error) {
      const result = {
        message: error.message
      }

      return response.status(500).send(result);
    }
  }

  public async edit({ view, params, bouncer }: HttpContextContract) {
    await bouncer.authorize("access", "edit-dermaga");
    let data = await Dermaga.findBy("id", params.id);

    const trx = await Database.transaction();
    let data_coordinates = await DermagaCoordinates.query().useTransaction(trx).where('id_dermaga', params.id).orderBy('line_number');

    const result = {
      data: data == null ? await DermagaApproved.findBy("id", params.id) : data,
      data_coordinates: data_coordinates == null ? '' : data_coordinates
    }

    const url = data == null ? "approved" : "outstanding";
    return view.render(`pages/master_dermaga/page/${url}/edit.edge`, result);
  }

  public async update({ request, auth, response }: HttpContextContract) {
    try {
      const dermaga = await Dermaga.findByOrFail("id", request.input("id"));
      dermaga.kode_pelabuhan = request.input("kode_pelabuhan");
      dermaga.nama_pelabuhan = request.input("nama_pelabuhan");
      dermaga.kode_terminal = request.input("kode_terminal");
      dermaga.nama_terminal = request.input("nama_terminal");
      dermaga.nama_dermaga = request.input("nama_dermaga");
      dermaga.jenis_dermaga = request.input("jenis_dermaga");
      dermaga.jenis_konstruksi = request.input("jenis_konstruksi");
      dermaga.pemilik = request.input("pemilik");
      dermaga.status_milik = request.input("status_milik");
      dermaga.kode_area_labuh = request.input("kode_area_labuh");
      dermaga.jenis_perairan = request.input("jenis_perairan");
      dermaga.tipe_layanan_utama = request.input("tipe_layanan_utama");
      dermaga.zonasi = request.input("zonasi");
      dermaga.layanan_labuh = request.input("layanan_labuh");
      dermaga.layanan_tambat = request.input("layanan_tambat");
      const coordinates: any[] = request.input("coordinates") ? request.input("coordinates") : '';
      dermaga.dokumen_pendukung = request.input("dokumen_pendukung");
      dermaga.kode_dermaga_inaportnet = request.input("kode_dermaga_inaportnet");
      dermaga.panjang = request.input("panjang");
      dermaga.lebar = request.input("lebar");
      dermaga.kade_meter_awal = request.input("kade_meter_awal");
      dermaga.kade_meter_akhir = request.input("kade_meter_akhir");
      dermaga.kedalaman_minimal = request.input("kedalaman_minimal");
      dermaga.kedalaman_maximal = request.input("kedalaman_maximal");
      dermaga.elevasi_dermaga_minimal = request.input("elevasi_dermaga_minimal");
      dermaga.elevasi_dermaga_maximal = request.input("elevasi_dermaga_maximal");
      dermaga.jarak_station_tunda = request.input("jarak_station_tunda");
      dermaga.jarak_station_pandu = request.input("jarak_station_pandu");
      dermaga.overhang_at_start = request.input("overhang_at_start");
      dermaga.overhang_at_end = request.input("overhang_at_end");
      const status = request.input('status');
      dermaga.status = status == "UPDATE" ? "DIAJUKAN" : status;
      dermaga.resubmit = request.input('resubmit');
      dermaga.kode_dermaga = request.input("kode_dermaga");

      if (request.input('nama_dermaga')) {
        let id = request.input('id')
        let nama_dermaga = request.input('nama_dermaga')
        let nama_terminal = request.input('nama_terminal')
        const nama_dermaga_check = await Dermaga.query().select('nama_dermaga').where('nama_dermaga', `${nama_dermaga}`).where('nama_terminal', `${nama_terminal}`).whereNot('id', `${id}`).first()
        if (nama_dermaga_check) {
          throw new Exception("Nama dermaga sudah ada pada terminal tersebut");
        }
      }

      if (request.input('kode_dermaga_inaportnet')) {
        let id = request.input('id')
        let kode_dermaga_inaportnet = request.input('kode_dermaga_inaportnet')
        const kode_dermaga_inaportnet_check = await Dermaga.query().select('kode_dermaga_inaportnet').where('kode_dermaga_inaportnet', `${kode_dermaga_inaportnet}`).whereNot('id', `${id}`).first()
        if (kode_dermaga_inaportnet_check) {
          throw new Exception("Kode dermaga Inaportnet sudah ada");
        }
      }

      if (request.input('status') == "DIAJUKAN" || request.input('status') == "UPDATE") {
        const approvalLog = new ApprovalLog();
        approvalLog.request_no = dermaga.request_number;
        approvalLog.action = request.input('status');
        approvalLog.remark = request.input("data_edited");
        approvalLog.created_by = auth.user.id;
        await approvalLog.save();

        dermaga.master_type_id = "ec964b7c-2350-40ef-8cea-656204df5f2e";
        const schema = await Database.from('schema_aplications').where('role_id', String(auth.user?.role_id)).andWhere('master_type_id', "ec964b7c-2350-40ef-8cea-656204df5f2e").select('id');

        // NOTIFICATION
        const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", schema[0].id).where("approval_order", "1");
        let nextApprovalRoleArray: any = [];
        nextApprovalRole.forEach(function (value) {
          nextApprovalRoleArray.push(value.role_id);
        });
        const nextUserApproval = await User.query().whereIn("role_id", nextApprovalRoleArray);
        let notificationData: any = [];
        nextUserApproval.forEach(async function (value) {
          notificationData.push({
            from: auth.user?.id,
            to: value.id,
            request_no: request.input("no_request"),
            master_type_id: "ec964b7c-2350-40ef-8cea-656204df5f2e",
            status: 'APPROVED'
          });
          Ws.io.emit('receive-notif', { userId: value.id, message: 'Request Approval Master Data Dermaga' });
          await SendMail.approve(value.id, dermaga.submitter, "ec964b7c-2350-40ef-8cea-656204df5f2e", dermaga.request_number);
        });
        await Notification.createMany(notificationData);
      }

      const saveDermaga = await dermaga.save();

      const saveCoordinates = await Dermaga.findOrFail(saveDermaga.id);

      await DermagaCoordinates.query().where('id_dermaga', dermaga.id).delete();


      if (coordinates.length > 0) {
        await saveCoordinates?.related('id_dermaga').createMany(coordinates);
      }

      let message = "";
      if (request.input('status') == "DRAFT") {
        message = "Data akan disimpan sementara";
      } else {
        message = "Data berhasil diperbarui";
      }

      const result = {
        message: message
      }

      return response.status(200).send(result);
    } catch (error) {
      const result = {
        message: error.message
      }

      return response.status(500).send(result);
    }
  }

  public async delete({ params, bouncer }: HttpContextContract) {
    await bouncer.authorize("access", "delete-dermaga");
    const data = await Dermaga.findByOrFail("id", params.id);

    // hapus detail dari approval 
    const approvalHeader = await ApprovalHeader.findBy('no_request', data.request_number);
    if (approvalHeader) {
      await ApprovalDetail.query().where('header_id', approvalHeader.id).delete();
      approvalHeader.delete();
    }

    // hapus history data di log approval
    await ApprovalLog.query().where('request_no', data.request_number).delete();

    // jika yang dihapus adalah data renewal
    if ([null, 'null', ''].includes(data.reference_id) == false) {
      const data2 = await DermagaApproved.findByOrFail('id', data.reference_id);
      data2.is_edit = 0;
      data2.save();
    }

    // hapus dermaga koordinat data di dermaga_coordinates
    await DermagaCoordinates.query().where('id_dermaga', params.id).delete();

    await data.delete();

  }

  public async view({ view, params, bouncer }: HttpContextContract) {
    await bouncer.authorize("access", "view-dermaga");
    const dermaga = await Dermaga.findBy("id", params.id);
    // const dermagaCoordinates = await DermagaCoordinates.findBy("id_dermaga", params.id);
    const trx = await Database.transaction();
    let data_coordinates = await DermagaCoordinates.query().useTransaction(trx).where('id_dermaga', params.id).orderBy('line_number');
    var submitter, role, appDetail, appLists, resultDate;

    if (dermaga) {
      submitter = await User.findBy('id', dermaga?.submitter);
      role = await Role.findBy('id', `${submitter?.role_id}`);
      appDetail = await Database.from('approval_log')
        .join('users', 'users.id', '=', 'approval_log.created_by')
        .join('roles', 'roles.id', '=', 'users.role_id')
        .where('request_no', `${dermaga.request_number}`)
        .orderBy('created_at', 'asc')
        .select('roles.name', 'users.role_id', 'approval_log.remark', 'approval_log.action', 'approval_log.created_at');
      appLists = await Database.from('schema_approval_lists')
        .join('users', 'users.role_id', '=', 'schema_approval_lists.role_id')
        .where('schema_id', `${dermaga?.schema_id}`)
        .select('users.name', 'schema_approval_lists.approval_order', 'schema_approval_lists.mandatory', 'schema_approval_lists.approval_order');
      let strTanggal = dermaga.created_at.toString();
      const strDay = strTanggal.substring(8, 10);
      let bulan;
      switch (strTanggal.substring(4, 7)) {
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
      resultDate = `${strDay} ${bulan} ${year} ${jam}.${menit}`;
    }
    const result = {
      data: dermaga == null ? await DermagaApproved.findBy("id", params.id) : dermaga,
      data_coordinates: data_coordinates == null ? '' : data_coordinates,
      name_request: submitter?.name,
      date_request: resultDate,
      dept_request: role?.name,
      app_detail: appDetail,
      app_lists: appLists,
      schema_id: dermaga?.schema_id
    };
    // const url = dermaga == null ? "outstanding" : "approved";
    const url = dermaga == null ? "approved" : "outstanding";
    return view.render(`pages/master_dermaga/page/${url}/view.edge`, result);
  }

  public async nonaktif({ params, bouncer }: HttpContextContract) {
    await bouncer.authorize("access", "activate-dermaga");
    const dermaga = await DermagaApproved.findByOrFail('id', `${params.id}`);
    dermaga.status = 'NONAKTIF';
    await dermaga.save();
  }

  public async aktif({ params, bouncer }: HttpContextContract) {
    await bouncer.authorize("access", "activate-dermaga");
    const dermaga = await DermagaApproved.findByOrFail('id', `${params.id}`);
    dermaga.status = 'AKTIF';
    await dermaga.save();
  }

  public async approve({ request, auth, response, bouncer }: HttpContextContract) {
    await bouncer.authorize("access", "approval-dermaga");
    try {
      const noRequest = request.input("no_request");
      const remark = request.input("notes");
      let approvalSequence = 0;
      let approvalHeaderId = "";

      const dermaga = await Dermaga.query().where("request_number", noRequest).first();
      const dermaga_coordinates = await DermagaCoordinates.findByOrFail("id_dermaga", dermaga.id);
      const schema = await SchemaAplication.query().where("id", dermaga.schema_id).preload("approvalList").first();
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
      schema.approvalList.forEach(function (value) {
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
      if (dermaga.status == "DITOLAK" || dermaga.status == "DRAFT") {
        throw new Exception("Data Dermaga Masih Dalam Perbaikan");
      }
      if (dermaga.status == "COMPLETE") {
        throw new Exception("Data Dermaga Sudah Selesai Prosess Persetujuan");
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
          let dermaga_approveds: any = null;

          if (dermaga.reference_id) {
            dermaga_approveds = await DermagaApproved.findOrFail(dermaga.reference_id);
            dermaga_approveds.is_edit = 0;
          } else {
            dermaga_approveds = new DermagaApproved();
          }
          if ([null, "null", ""].includes(dermaga.reference_id)) {
            dermaga_approveds.kode_pelabuhan = dermaga?.kode_pelabuhan;
            dermaga_approveds.nama_pelabuhan = dermaga?.nama_pelabuhan;
            dermaga_approveds.kode_terminal = dermaga?.kode_terminal;
            dermaga_approveds.nama_terminal = dermaga?.nama_terminal;
            let totalKodeDermaga: any = await DermagaApproved.query().where('kode_terminal', `${dermaga?.kode_terminal}`);
            totalKodeDermaga = totalKodeDermaga.length + 1;
            const run_num = '000'.substr(String(totalKodeDermaga).length) + (totalKodeDermaga);
            dermaga_approveds.kode_dermaga = `${dermaga?.kode_terminal}-${run_num}`;
          }
          dermaga_approveds.nama_dermaga = dermaga?.nama_dermaga;
          dermaga_approveds.jenis_dermaga = dermaga?.jenis_dermaga;
          dermaga_approveds.jenis_konstruksi = dermaga?.jenis_konstruksi;
          dermaga_approveds.pemilik = dermaga?.pemilik;
          dermaga_approveds.status_milik = dermaga?.status_milik;
          dermaga_approveds.kode_area_labuh = dermaga?.kode_area_labuh;
          dermaga_approveds.jenis_perairan = dermaga?.jenis_perairan;
          dermaga_approveds.tipe_layanan_utama = dermaga?.tipe_layanan_utama;
          dermaga_approveds.zonasi = dermaga?.zonasi;
          dermaga_approveds.layanan_tambat = dermaga?.layanan_tambat;
          dermaga_approveds.layanan_labuh = dermaga?.layanan_labuh;
          dermaga_approveds.kode_dermaga_inaportnet = dermaga?.kode_dermaga_inaportnet;
          dermaga_approveds.panjang = dermaga?.panjang;
          dermaga_approveds.lebar = dermaga?.lebar;
          dermaga_approveds.kade_meter_awal = dermaga?.kade_meter_awal;
          dermaga_approveds.kade_meter_akhir = dermaga?.kade_meter_akhir;
          dermaga_approveds.kedalaman_minimal = dermaga?.kedalaman_minimal;
          dermaga_approveds.kedalaman_maximal = dermaga?.kedalaman_maximal;
          dermaga_approveds.elevasi_dermaga_minimal = dermaga?.elevasi_dermaga_minimal;
          dermaga_approveds.elevasi_dermaga_maximal = dermaga?.elevasi_dermaga_maximal;
          dermaga_approveds.jarak_station_tunda = dermaga?.jarak_station_tunda;
          dermaga_approveds.jarak_station_pandu = dermaga?.jarak_station_pandu;
          dermaga_approveds.overhang_at_start = dermaga?.overhang_at_start;
          dermaga_approveds.overhang_at_end = dermaga?.overhang_at_end;
          dermaga_approveds.mob_demob = dermaga?.mob_demob;
          dermaga_approveds.dokumen_pendukung = dermaga?.dokumen_pendukung;
          dermaga_approveds.status = 'AKTIF';
          dermaga_approveds.id_staging = dermaga?.id;
          dermaga_coordinates.id_dermaga_approved = dermaga_approveds.id;

          await dermaga_approveds.save();
          await dermaga_coordinates.save();

          const UpdateDermaga = await Dermaga.findOrFail(dermaga?.id);
          UpdateDermaga.status = "COMPLETE";
          await UpdateDermaga.save();
        }
      }

      // NOTIFICATION
      const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", schema.id).where("approval_order", nextApprovalSequece + 1);
      let nextApprovalRoleArray: any = [];
      nextApprovalRole.forEach(function (value) {
        nextApprovalRoleArray.push(value.role_id);
      });
      const nextUserApproval = await User.query().whereIn("role_id", nextApprovalRoleArray);
      let notificationData: any = [];
      nextUserApproval.forEach(async function (value) {
        notificationData.push({
          from: auth.user.id,
          to: value.id,
          request_no: dermaga.request_number,
          master_type_id: "ec964b7c-2350-40ef-8cea-656204df5f2e",
          status: 'APPROVED'
        });
        Ws.io.emit('receive-notif', { userId: value.id, message: 'Request Approval Master Data Dermaga' });
        await SendMail.approve(value.id, dermaga.submitter, "ec964b7c-2350-40ef-8cea-656204df5f2e", dermaga.request_number);
      });
      await Notification.createMany(notificationData);

      const approvalLog = new ApprovalLog();
      approvalLog.request_no = dermaga.request_number;
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

  public async reject({ request, auth, response }: HttpContextContract) {
    try {
      const noRequest = request.input("no_request");
      const remark = request.input("notes");
      let approvalSequence = 0;
      let approvalHeaderId = "";

      const dermaga = await Dermaga.query().where("request_number", noRequest).first();
      const schema = await SchemaAplication.query().where("id", dermaga.schema_id).preload("approvalList").first();
      if (dermaga.status == "DITOLAK" || dermaga.status == "DRAFT") {
        throw new Exception("Data Dermaga Masih Dalam Perbaikan");
      }
      if (dermaga.status == "COMPLETE") {
        throw new Exception("Data Dermaga Sudah Selesai Prosess Persetujuan");
      }
      const approveHeader = await ApprovalHeader.query().where("no_request", noRequest).first();
      const approvalRoleMandatory = [];


      if (approveHeader) {
        approvalSequence = approveHeader.approval_sequence;
      }

      const nextApprovalSequece = approvalSequence + 1;
      schema.approvalList.forEach(function (value) {
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

        const UpdateDermaga = await Dermaga.findOrFail(dermaga.id);
        UpdateDermaga.status = "DITOLAK";
        await UpdateDermaga.save();

        const approvalHeader2 = await ApprovalHeader.findOrFail(approvalHeaderId);
        approvalHeader2.approval_sequence = 0;
        approvalHeader2.step = approveHeader.step + 1;
        await approvalHeader2.save();
      } else {
        const UpdateDermaga = await Dermaga.findOrFail(dermaga.id);
        UpdateDermaga.status = "DITOLAK";
        await UpdateDermaga.save();
      }

      //NOTIFICATION
      const notification = new Notification();
      notification.from = auth.user.id;
      notification.to = dermaga.submitter;
      notification.request_no = dermaga.request_number;
      notification.master_type_id = "ec964b7c-2350-40ef-8cea-656204df5f2e";
      notification.status = 'REJECTED';
      await notification.save();
      Ws.io.emit('receive-notif', { userId: dermaga.submitter, message: 'Rejected Master Data Dermaga' });
      await SendMail.approve(dermaga.submitter, auth.user.id, "ec964b7c-2350-40ef-8cea-656204df5f2e", dermaga.request_number);

      const approvalLog = new ApprovalLog();
      approvalLog.request_no = dermaga.request_number;
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

  public async uploadFile({ request, response }: HttpContextContract) {
    let path = request.file('inputFile', {
      size: '2mb',
      extnames: ['pdf', 'PDF'],

    });

    const nameFile = new Date().getTime().toString() + `-` + 'dokumen_pendukung' + `-` + `${path?.clientName}`

    await path?.moveToDisk("", { name: nameFile });

    try {
      if (!path?.isValid) {
        const data = {
          error: path?.hasErrors,
          message: path?.errors[0].message
        }
        return response.send(data)
      }
      // const result = await s3.upload(params).promise()
      // const result = await client.send(command)
      return response.send(nameFile)
    } catch (error) {
      return response.send(error)
    }

  }

  public async countNoRequest() {
    // const total = await Database.rawQuery(`SELECT count(*) + 1 as "total" from "dermagas" where TRUNC("created_at") = TRUNC(SYSDATE) and "status" in ('DRAFT', 'DIAJUKAN', 'DITOLAK', 'COMPLETE')`);
    const data = await Dermaga.query().whereRaw(`TRUNC("created_at") = TRUNC(SYSDATE)`);
    return data.length + 1;

  }

  public async modalData({ request, auth }: HttpContextContract) {
    const dermaga = await Dermaga.findBy('request_number', `${request.input('no_request')}`);
    // const dermaga = await Dermaga.query().preload('id_dermaga').where('dermaga.request_number', `${request.input('no_request')}`).orderBy('dermaga_coordinates.line_number', 'asc');
    const dermagaCoordinates = await DermagaCoordinates.query().where('id_dermaga', `${dermaga?.id}`).orderBy('line_number', 'asc');
    const submitter = await User.findBy('id', dermaga?.submitter);
    const role = await Role.findBy('id', `${submitter?.role_id}`);
    const appHeader = await ApprovalHeader.findBy('no_request', `${request.input('no_request')}`);
    const appLists = await SchemaApprovalList.query().where("schema_id", `${dermaga?.schema_id}`).preload("role").orderBy("approval_order", "asc");
    const appDetail = await Database.from('approval_log')
      .join('users', 'users.id', '=', 'approval_log.created_by')
      .join('roles', 'roles.id', '=', 'users.role_id')
      .where('request_no', `${request.input('no_request')}`)
      .orderBy('created_at', 'asc')
      .select('roles.name', 'users.role_id', 'approval_log.remark', 'approval_log.action', 'approval_log.created_at');
    const isSubmitter = await Database.from("schema_aplications").where('role_id', `${auth.user?.role_id}`).andWhere("id", `${dermaga.schema_id}`);
    const doneApprove = await Database.from("approval_detail").where("header_id", `${appHeader?.id}`).andWhere("step", `${appHeader?.step}`).andWhere("user_id", `${auth.user?.id}`);
    let strTanggal = dermaga.created_at.toString();
    const strDay = strTanggal.substring(8, 10);
    let bulan: any;
    switch (strTanggal.substring(4, 7)) {
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
      dermaga: dermaga,
      name_request: submitter?.name,
      date_request: resultDate,
      dept_request: role?.name,
      app_detail: appDetail,
      app_lists: appLists,
      is_submitter: isSubmitter,
      done_approve: doneApprove,
      schema_id: dermaga?.schema_id,
      dermaga_coordinates: dermagaCoordinates
    }
    // console.log(data.dermaga_coordinates);
    return data;
  }

  public async approvalOrder({ request }: HttpContextContract) {
    const order = await SchemaApprovalList.query().where('schema_id', `${request.input('schema_id')}`).andWhere('role_id', `${request.input('role_id')}`).select('approval_order');
    return order[0].approval_order;
  }

  public async writeExcel({ response, bouncer }: HttpContextContract) {
    await bouncer.authorize("access", "export-data-dermaga");
    // var data = await DermagaApproved.query().where('status', 'AKTIF').orderBy('created_at', 'desc');
    var data = await DermagaApproved.query().leftJoin('dermaga_coordinates', 'dermaga_approveds.id', '=', 'dermaga_coordinates.id_dermaga_approved').where('dermaga_approveds.status', 'AKTIF').orderBy('dermaga_approveds.created_at', 'desc').orderBy('dermaga_coordinates.line_number', 'asc');
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Sheet 1", { properties: { defaultColWidth: 50 } });

    worksheet.columns = [
      { header: 'Kode Dermaga', key: 'kode_dermaga' },
      { header: 'Kode Pelabuhan', key: 'kode_pelabuhan' },
      { header: 'Nama Pelabuhan', key: 'nama_pelabuhan' },
      { header: 'Kode Terminal', key: 'kode_terminal' },
      { header: 'Nama Terminal', key: 'nama_terminal' },
      { header: 'Nama Dermaga', key: 'nama_dermaga' },
      { header: 'Jenis Dermaga', key: 'jenis_dermaga' },
      { header: 'Jenis Konstruksi', key: 'jenis_konstruksi' },
      { header: 'Pemilik', key: 'pemilik' },
      { header: 'Status Milik', key: 'status_milik' },
      { header: 'Kode Area Labuh', key: 'kode_area_labuh' },
      { header: 'Jenis Perairan', key: 'jenis_perairan' },
      { header: 'Tipe Layanan Utama', key: 'tipe_layanan_utama' },
      { header: 'Zonasi', key: 'zonasi' },
      { header: 'Jenis Layanan Dermaga', key: 'jenis_layanan_dermaga' },
      { header: 'Lintang Selatan (LS)', key: 'longitude' },
      { header: 'Bujur Timur (BT)', key: 'latitude' },
      { header: 'Kode Dermaga Inaportnet', key: 'kode_dermaga_inaportnet' },
      { header: 'Panjang/Length (m)', key: 'panjang' },
      { header: 'Lebar/Width (m)', key: 'lebar' },
      { header: 'Kade Meter Awal', key: 'kade_meter_awal' },
      { header: 'Kade Meter Akhir', key: 'kade_meter_akhir' },
      { header: 'Kedalaman Minimal (-mLWS)', key: 'kedalaman_minimal' },
      { header: 'Kedalaman Maximal (-mLWS)', key: 'kedalaman_maximal' },
      { header: 'Minimal Elevasi Dermaga', key: 'elevasi_dermaga_minimal' },
      { header: 'Maximal Elevasi Dermaga', key: 'elevasi_dermaga_maximal' },
      { header: 'Jarak Station Kapal Tunda', key: 'jarak_station_tunda' },
      { header: 'Jarak Station Kapal Pandu', key: 'jarak_station_pandu' },
      { header: 'Overhang Allowed at Start (m)', key: 'overhang_at_start' },
      { header: 'Overhang Allowed at End (m)', key: 'overhang_at_end' },
      { header: 'Mob / Demob (menit)', key: 'mob_demob' },
      { header: 'Status', key: 'status' }
    ];

    for (let i = 0; i < data.length; i++) {
      let jenis_layanan_dermaga_value = "";
      if (data[i].layanan_tambat == 1 && data[i].layanan_labuh == 1) {
        jenis_layanan_dermaga_value = "TAMBAT, LABUH";
      } else if (data[i].layanan_tambat == 1 && data[i].layanan_labuh == 0) {
        jenis_layanan_dermaga_value = "TAMBAT";
      } else if (data[i].layanan_tambat == 0 && data[i].layanan_labuh == 1) {
        jenis_layanan_dermaga_value = "LABUH";
      }

      worksheet.addRow({
        kode_dermaga: data[i].kode_dermaga,
        kode_pelabuhan: data[i].kode_pelabuhan,
        nama_pelabuhan: data[i].nama_pelabuhan,
        kode_terminal: data[i].kode_terminal,
        nama_terminal: data[i].nama_terminal,
        nama_dermaga: data[i].nama_dermaga,
        jenis_dermaga: data[i].jenis_dermaga,
        jenis_konstruksi: data[i].jenis_konstruksi,
        pemilik: data[i].pemilik,
        status_milik: data[i].status_milik,
        kode_area_labuh: data[i].kode_area_labuh,
        jenis_perairan: data[i].jenis_perairan,
        tipe_layanan_utama: data[i].tipe_layanan_utama,
        zonasi: data[i].zonasi,
        jenis_layanan_dermaga: jenis_layanan_dermaga_value,
        longitude: data[i].longitude + " LS",
        latitude: data[i].latitude + " BT",
        kode_dermaga_inaportnet: data[i].kode_dermaga_inaportnet,
        panjang: data[i].panjang,
        lebar: data[i].lebar,
        kade_meter_awal: data[i].kade_meter_awal,
        kade_meter_akhir: data[i].kade_meter_akhir,
        kedalaman_minimal: data[i].kedalaman_minimal,
        kedalaman_maximal: data[i].kedalaman_maximal,
        elevasi_dermaga_minimal: data[i].elevasi_dermaga_minimal,
        elevasi_dermaga_maximal: data[i].elevasi_dermaga_maximal,
        jarak_station_tunda: data[i].jarak_station_tunda,
        jarak_station_pandu: data[i].jarak_station_pandu,
        overhang_at_start: data[i].overhang_at_start,
        overhang_at_end: data[i].overhang_at_end,
        mob_demob: data[i].mob_demob,
        status: data[i].status
      });
    }

    const filePath = Application.publicPath('/media/dermaga/dermaga.xlsx');

    workbook.xlsx.writeFile(filePath);
    response.redirect().toPath('/master-dermaga/data-dermaga');
  }

  public async exportData({ response }: HttpContextContract) {
    const filePath = Application.publicPath('/media/dermaga/dermaga.xlsx');
    response.download(filePath);
  }
}
