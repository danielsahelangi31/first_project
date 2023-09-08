import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Terminal from "App/Models/Terminal";
import JenisTerminal from "App/Models/JenisTerminal";
import Branch from "App/Models/Branch";
import Database from "@ioc:Adonis/Lucid/Database";
import { DateTime } from "luxon";
import User from "App/Models/User";
import SchemaAplication from "App/Models/SchemaAplication";
import { Exception } from "@poppinss/utils";
import RequestTerminal from "App/Models/RequestTerminal";
import SchemaApprovalList from "App/Models/SchemaApprovalList";
import ApprovalHeader from "App/Models/ApprovalHeader";
import ApprovalDetail from "App/Models/ApprovalDetail";
import GroupCompany from "App/Models/GroupCompany";
import CreateTerminalValidator from "App/Validators/CreateTerminalValidator";
import MasterCompany from "App/Models/MasterCompany";
import SchemaApprovalList from "App/Models/SchemaApprovalList";
import RequestBranch from "App/Models/RequestBranch";
import Ws from "App/Services/Ws";
import Notification from "../../Models/Notification";
import ApprovalLog from "App/Models/ApprovalLog";
import SendMail from "App/Services/SendMail";
import excel from "exceljs";
import Application from "@ioc:Adonis/Core/Application";
import Drive from "@ioc:Adonis/Core/Drive";
import CreateTerminaDraftlValidator from "App/Validators/CreateTerminalDraftValidator";


export default class TerminalsController {
  public async index({ view, bouncer, request, auth }: HttpContextContract) {
    await bouncer.authorize("access", "view-terminal");
    const reject = await RequestTerminal.query().where("status", "REJECT");
    const requestApproval = await RequestTerminal.query().where("status", "REQUEST");
    const draft = await RequestTerminal.query().where("status", "DRAFT").where("submitter", auth.user.id);
    const active = await Terminal.query().where("status", "ACTIVE");
    const inactive = await Terminal.query().where("status", "INACTIVE");


    let terminals: any;
    let status: any = "ALL";

    if (request.input("status") == "OUTSTANDING") {
      terminals = await RequestTerminal.query().preload("jenisTerminal").where("status", "!=", "COMPLETED").orderBy("created_at", "desc");
      status = request.input("status");
    } else if (request.input("status") == "REQUEST" || request.input("status") == "REJECT" || request.input("status") == "DRAFT") {
      if (request.input("status") == "DRAFT") {
        terminals = await RequestTerminal.query().preload("jenisTerminal").where("status", request.input("status")).where("submitter", auth.user.id).orderBy("created_at", "desc");
      } else {
        terminals = await RequestTerminal.query().preload("jenisTerminal").where("status", request.input("status")).orderBy("created_at", "desc");
      }
      status = request.input("status");
    } else if (request.input("status") == "ACTIVE" || request.input("status") == "INACTIVE") {
      terminals = await Terminal.query().preload("jenisTerminal").where("status", request.input("status")).orderBy("created_at", "desc");
      status = "ALL";
    } else {
      terminals = await Terminal.query().preload("jenisTerminal").orderBy("created_at", "desc");
      status = "ALL";
    }
    const state = {
      terminals: terminals,
      status: status,
      total: reject.length + requestApproval.length + active.length + inactive,
      reject: reject.length,
      requestApproval: requestApproval.length,
      active: active.length,
      inactive: inactive.length,
      draft: draft.length
    };


    return view.render("pages/master_terminal/index", state);
  }

  public async create({ view }: HttpContextContract) {
    const jenisTerminals = await JenisTerminal.all();
    const branches = await Branch.query().preload("portCode").preload("city");
    //const strukturAll = await StrukturAll.all();
    const strukturAll = await GroupCompany.all();
    const state = {
      jenisTerminals: jenisTerminals,
      branches: branches,
      strukturAll: strukturAll
    };
    return view.render("pages/master_terminal/create", state);
  }

  public async store({ bouncer, request, response, session, auth }: HttpContextContract) {
    if (request.input("save_submit") == 1) {
      await request.validate(CreateTerminalValidator);
    } else {
      await request.validate(CreateTerminaDraftlValidator);
    }
    await bouncer.authorize("access", "create-terminal");
    const currentDate = String(DateTime.now().year) + String(DateTime.now().month) + String(DateTime.now().day);
    const masterTypeId = "a7c03e4f-e1f5-4c80-a3cd-f4b4929cbed7";
    const trx = await Database.transaction();
    try {

      if (parseInt(request.input("kedalaman_min")) > 0 && parseInt(request.input("kedalaman_max")) > 0) {
        throw new Exception("Kedalaman alur lebih besar dari 0", 422);
      }
      if (parseInt(request.input("kedalaman_min")) < parseInt(request.input("kedalaman_max"))) {
        throw new Exception("Kedalaman Kolam not valid", 422);
      }

      const user = await User.query().where("id", auth.user.id).preload("role").preload("role", (query) => {
        query.preload("entity");
      }).first();
      const schema = await SchemaAplication.query().where("master_type_id", masterTypeId).where("role_id", user.role_id).first();
      if (!user) {
        throw new Exception("User Not Found", 422);
      }
      if (!schema) {
        throw new Exception("Schema Not Found", 422);
      }

      if (request.input("reference_id")) {
        const updateStatusTerminal=await Terminal.findOrFail(request.input("reference_id"));
        updateStatusTerminal.isedit=1;
        await updateStatusTerminal.save();
      }
      const zeroPad = (num, places) => String(num).padStart(places, "0");
      // const branch = await Branch.find(request.input("branch_id"));
      const branch: any = await Branch.query().preload("portCode").preload("city").where("id", request.input("branch_id")).first();
      const requestTerminal = await Database.rawQuery("select * from (select SUBSTR(\"request_no\" ,12,3) AS \"request_no\" from \"request_terminals\" order by \"created_at\" desc) where rownum <= 1");
      const lastNo = requestTerminal.length > 0 ? requestTerminal[0].request_no : 0;
      const requestNo = "TML" + currentDate + zeroPad(parseInt(lastNo) + 1, 3);
      const terminal = new RequestTerminal();
      terminal.request_no = requestNo;
      terminal.submitter = auth.user.id;
      terminal.entity_id = user.role.entity.id;
      terminal.master_type_id = masterTypeId;
      terminal.schema_id = schema.id;
      terminal.branch_id = request.input("branch_id");
      terminal.name = request.input("name");
      if (request.input("code")) {
        terminal.code = request.input("code");
      } else {
        if (branch){
          terminal.code = branch.city.city_code + "-" + zeroPad(parseInt(lastNo) + 1, 3);
        }
      }
      terminal.jumlah_tambat = request.input("jumlah_tambat");
      terminal.luas = request.input("luas");
      terminal.name_sub_wil = request.input("name_sub_wil");
      terminal.code_sub_wil = request.input("code_sub_wil");
      terminal.kedalaman_max = request.input("kedalaman_max");
      terminal.kedalaman_min = request.input("kedalaman_min");
      terminal.jenis_terminal_id = request.input("jenis_terminal_id");
      terminal.company_id = request.input("company_id");
      terminal.address = request.input("address");
      terminal.lng = request.input("lng");
      terminal.lat = request.input("lat");
      terminal.reference_id = request.input("reference_id");


      const izinOperasiFile = request.file("izin_operasi_file");
      const bastFile = request.file("bast_file");
      if (izinOperasiFile) {
        await izinOperasiFile.moveToDisk("", { name: izinOperasiFile.fileName });
        const izinOperasiFileName = izinOperasiFile.fileName;
        terminal.izin_operasi_file = izinOperasiFileName;
      }
      if (bastFile) {
        await bastFile.moveToDisk("", { name: bastFile.fileName });
        const bastFileName = bastFile.fileName;
        terminal.bast_file = bastFileName;
      }


      if (request.input("save_draft") == 1) {
        terminal.status = "DRAFT";
      }
      if (request.input("save_submit") == 1) {
        terminal.status = "REQUEST";
      }
      terminal.useTransaction(trx);
      await terminal.save();

      //NOTIFICATION
      if (request.input("save_submit") == 1) {
        const approvalLog = new ApprovalLog();
        approvalLog.request_no = terminal.request_no;
        approvalLog.action = "SUBMITED";
        approvalLog.remark = request.input("data_edited");
        approvalLog.created_by = auth.user.id;
        await approvalLog.save();

        const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", schema.id).where("approval_order", "1");
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
            request_no: terminal.request_no,
            master_type_id: "a7c03e4f-e1f5-4c80-a3cd-f4b4929cbed7",
            status: "APPROVED"
          });
          Ws.io.emit("receive-notif", { userId: value.id, message: "Request Approval Master Data Terminal" });
          await SendMail.approve(value.id, terminal.submitter, terminal.master_type_id, terminal.request_no);
        });
        await Notification.createMany(notificationData);
      }
      await trx.commit();
      let result = {
        "message": "Data Terminal Berhasil Dibuat"
      };
      return response.status(200).send(result);
    } catch (error) {
      await trx.rollback();
      let result = {
        "message": error.message
      };
      return response.status(500).send(result);
    }
  }

  public async show({ params, response }: HttpContextContract) {
    const id = params.id;
    const terminal = await RequestTerminal.query().where("request_no", id).first();
    if (terminal) {
      const terminal = await RequestTerminal.query()
        .preload("branch")
        .preload("jenisTerminal")
        .preload("branch")
        .preload("subPengelola", (query) => {
          query.preload("groupCompany");
        })
        .preload("user", function(query) {
          query.preload("role", function(query) {
            query.preload("entity", function(query) {
              query.preload("jobTitle");
              query.preload("masterCompany");
            });
          });
        })
        .where("request_no", id)
        .first();
      response.send(terminal);
    } else {
      const terminal = await Terminal.query()
        .preload("branch")
        .preload("jenisTerminal")
        .preload("branch")
        .preload("subPengelola", (query) => {
          query.preload("groupCompany");
        })
        .where("request_no", id)
        .first();
      response.send(terminal);
    }


  }

  public async edit({ bouncer, params, view }: HttpContextContract) {
    await bouncer.authorize("access", "edit-terminal");
    const id = params.id;
    const terminal = await RequestTerminal.query().where("id", id).preload("subPengelola").first();
    const jenisTerminals = await JenisTerminal.all();
    const branches = await Branch.query().preload("portCode").preload("city");

    const state = {
      terminal: terminal,
      jenisTerminals: jenisTerminals,
      branches: branches
    };
    return view.render("pages/master_terminal/edit", state);
  }

  public async renewal({ bouncer, params, view }: HttpContextContract) {
    await bouncer.authorize("access", "edit-terminal");
    const id = params.id;
    const terminal = await Terminal.query().where("id", id).preload("subPengelola").first();
    const jenisTerminals = await JenisTerminal.all();
    const branches = await Branch.query().preload("portCode").preload("city");

    const state = {
      terminal: terminal,
      jenisTerminals: jenisTerminals,
      branches: branches
    };
    return view.render("pages/master_terminal/renewal", state);
  }

  public async update({ bouncer, params, request, response, auth }: HttpContextContract) {

    if (request.input("save_submit") == 1) {
      await request.validate(CreateTerminalValidator);
    } else {
      await request.validate(CreateTerminaDraftlValidator);
    }
    await bouncer.authorize("access", "edit-terminal");
    const id = params.id;

    const trx = await Database.transaction();
    try {
      if (parseInt(request.input("kedalaman_min")) > 0 && parseInt(request.input("kedalaman_max")) > 0) {
        throw new Exception("Kedalaman alur lebih besar dari 0", 422);
      }
      if (parseInt(request.input("kedalaman_min")) < parseInt(request.input("kedalaman_max"))) {
        throw new Exception("Kedalaman Kolam not valid", 422);
      }
      const terminal = await RequestTerminal.findOrFail(id);
      terminal.branch_id = request.input("branch_id");
      terminal.name = request.input("name");
      terminal.jumlah_tambat = request.input("jumlah_tambat");
      terminal.luas = request.input("luas");
      terminal.name_sub_wil = request.input("name_sub_wil");
      terminal.code_sub_wil = request.input("code_sub_wil");
      terminal.kedalaman_max = request.input("kedalaman_max");
      terminal.kedalaman_min = request.input("kedalaman_min");
      terminal.jenis_terminal_id = request.input("jenis_terminal_id");
      terminal.company_id = request.input("company_id");
      terminal.address = request.input("address");
      terminal.lng = request.input("lng");
      terminal.lat = request.input("lat");
      terminal.reference_id = request.input("reference_id");
      const izinOperasiFile = request.file("izin_operasi_file");
      const bastFile = request.file("bast_file");
      if (izinOperasiFile) {
        await izinOperasiFile.moveToDisk("", { name: izinOperasiFile.fileName });
        const izinOperasiFileName = izinOperasiFile.fileName;
        terminal.izin_operasi_file = izinOperasiFileName;
      }
    )
      if (bastFile) {
        await bastFile.moveToDisk("", { name: bastFile.fileName });
        const bastFileName = bastFile.fileName;
        terminal.bast_file = bastFileName;
      }
      if (request.input("save_draft") == 1) {
        terminal.status = "DRAFT";
      }
      if (request.input("save_submit") == 1) {
        terminal.status = "REQUEST";
      }
      terminal.useTransaction(trx);
      await terminal.save();
      //NOTIFICATION
      if (request.input("save_submit") == 1) {
        const checkApprovalHeader = await ApprovalHeader.query().where("no_request", terminal.request_no).first();

        let status = "UPDATED";
        if (!checkApprovalHeader) {
          status = "SUBMITED";

        }
        const approvalLog = new ApprovalLog();
        approvalLog.request_no = terminal.request_no;
        approvalLog.action = status;
        approvalLog.remark = request.input("data_edited");
        approvalLog.created_by = auth.user.id;
        await approvalLog.save();

        const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", terminal.schema_id).where("approval_order", "1");
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
            request_no: terminal.request_no,
            master_type_id: "a7c03e4f-e1f5-4c80-a3cd-f4b4929cbed7",
            status: "APPROVED"
          });
          Ws.io.emit("receive-notif", { userId: value.id, message: "Request Approval Master Data Terminal" });
          await SendMail.approve(value.id, terminal.submitter, terminal.master_type_id, terminal.request_no);
        });
        await Notification.createMany(notificationData);
      }
      await trx.commit();
      let result = {
        "message": "Data Terminal Berhasil Diubah"
      };

      return response.status(200).send(result);
    } catch (error) {
      await trx.rollback();

      let result = {
        "message": error.message
      };
      return response.status(500).send(result);
    }
  }

  public async destroy({ bouncer, params, session, response }: HttpContextContract) {
    await bouncer.authorize("access", "delete-terminal");
    const id = params.id;
    const trx = await Database.transaction();
    try {
      const terminal = await RequestTerminal.findOrFail(id);
      if (terminal.reference_id !== null){
        const updateStatusTerminal=await Terminal.findOrFail(terminal.reference_id);
        updateStatusTerminal.isedit=0;
        await updateStatusTerminal.save();
      }
      const approvalHeader = await ApprovalHeader.query().where("no_request", terminal.request_no).first();
      if (approvalHeader) {
        await ApprovalDetail.query().where("header_id", approvalHeader.id).delete();
        await ApprovalHeader.findOrFail(approvalHeader.id).delete();
      }
      terminal.delete();
      await trx.commit();
      let result = {
        "message": "Data Terminal Berhasil Dihapus"
      };

      return response.status(200).send(result);
    } catch (error) {
      await trx.rollback();

      let result = {
        "message": error.message
      };
      return response.status(500).send(result);
    }
  }


  public async approve({ request, auth, session, response }: HttpContextContract) {

    try {
      const noRequest = request.input("request_no");
      const remark = request.input("remark");
      let approvalSequence = 0;
      let approvalHeaderId = "";

      const requestTerminal = await RequestTerminal.query().where("request_no", noRequest).first();
      const schema = await SchemaAplication.query().where("id", requestTerminal.schema_id).preload("approvalList").first();
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
      if (requestTerminal.status == "REJECT" || requestTerminal.status == "DRAFT") {
        throw new Exception("Data Pelabuhan Masih Dalam Perbaikan");
      }
      if (requestTerminal.status == "COMPLETED") {
        throw new Exception("Data Pelabuhan Sudah Selesai Prosess Persetujuan");
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
          let terminal: any = null;

          if (requestTerminal.reference_id) {
            terminal = await Terminal.findOrFail(requestTerminal.reference_id);
            terminal.isedit = 0;
          } else {
            terminal = new Terminal();
          }
          terminal.branch_id = requestTerminal.branch_id;
          terminal.name = requestTerminal.name;
          terminal.code = requestTerminal.code;
          terminal.jumlah_tambat = requestTerminal.jumlah_tambat;
          terminal.luas = requestTerminal.luas;
          terminal.kedalaman_max = requestTerminal.kedalaman_max;
          terminal.kedalaman_min = requestTerminal.kedalaman_min;
          terminal.jenis_terminal_id = requestTerminal.jenis_terminal_id;
          terminal.name_sub_wil = requestTerminal.name_sub_wil;
          terminal.code_sub_wil = requestTerminal.code_sub_wil;
          terminal.request_no = requestTerminal.request_no;
          terminal.bast_file = requestTerminal.bast_file;
          terminal.izin_operasi_file = requestTerminal.izin_operasi_file;
          await terminal.save();

          const UpdateRequestTerminal = await RequestTerminal.findOrFail(requestTerminal.id);
          UpdateRequestTerminal.status = "COMPLETED";
          await UpdateRequestTerminal.save();
        }
      }

      //NOTIFICATION
      const approvalLog = new ApprovalLog();
      approvalLog.request_no = requestTerminal.request_no;
      approvalLog.action = "APPROVED";
      approvalLog.remark = remark;
      approvalLog.created_by = auth.user.id;
      await approvalLog.save();
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
          request_no: requestTerminal.request_no,
          master_type_id: "a7c03e4f-e1f5-4c80-a3cd-f4b4929cbed7",
          status: "APPROVED"
        });
        Ws.io.emit("receive-notif", { userId: value.id, message: "Request Approval Master Data Terminal" });
        await SendMail.approve(value.id, requestTerminal?.submitter, requestTerminal?.master_type_id, requestTerminal?.request_no);
      });
      await Notification.createMany(notificationData);
      let result = {
        "message": "Berhasil Disetujui"
      };

      return response.status(200).send(result);
    } catch (error) {

      let result = {
        "message": error.message
      };
      return response.status(500).send(result);
    }
  }

  public async reject({ request, auth, session, response }: HttpContextContract) {
    try {
      const noRequest = request.input("request_no");
      const remark = request.input("remark");
      let approvalSequence = 0;
      let approvalHeaderId = "";

      const requestTerminal = await RequestTerminal.query().where("request_no", noRequest).first();
      const schema = await SchemaAplication.query().where("id", requestTerminal.schema_id).preload("approvalList").first();
      if (requestTerminal.status == "REJECT" || requestTerminal.status == "DRAFT") {
        throw new Exception("Data Pelabuhan Masih Dalam Perbaikan");
      }
      if (requestTerminal.status == "COMPLETED") {
        throw new Exception("Data Pelabuhan Sudah Selesai Prosess Persetujuan");
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

        const UpdateRequestTerminal = await RequestTerminal.findOrFail(requestTerminal.id);
        UpdateRequestTerminal.status = "REJECT";
        await UpdateRequestTerminal.save();

        const approvalHeader2 = await ApprovalHeader.findOrFail(approvalHeaderId);
        approvalHeader2.approval_sequence = 0;
        approvalHeader2.step = approveHeader.step + 1;
        await approvalHeader2.save();

      } else {
        const SchemaApprovalMax = await SchemaApprovalList.query().where("schema_id", schema.id).orderBy("approval_order", "desc").first();
        const approvalHeader = new ApprovalHeader();
        approvalHeader.no_request = noRequest;
        // @ts-ignore
        approvalHeader.total_approve = SchemaApprovalMax.approval_order;
        approvalHeader.id_submitter = auth.user.id;
        approvalHeader.approval_sequence = 0;
        approvalHeader.step = 2;
        await approvalHeader.save();
        approvalHeaderId = approvalHeader.id;

        const approvalDetail = new ApprovalDetail();
        approvalDetail.user_id = auth.user.id;
        approvalDetail.validation = "REJECT";
        approvalDetail.header_id = approvalHeaderId;
        approvalDetail.remark = remark;
        approvalDetail.sequence = 1;
        approvalDetail.role_id = auth.user.role_id;
        approvalDetail.step = 1;
        await approvalDetail.save();

        const UpdateRequestTerminal = await RequestTerminal.findOrFail(requestTerminal.id);
        UpdateRequestTerminal.status = "REJECT";
        await UpdateRequestTerminal.save();
      }
      //NOTIFICATION
      const approvalLog = new ApprovalLog();
      approvalLog.request_no = requestTerminal.request_no;
      approvalLog.action = "REJECTED";
      approvalLog.remark = remark;
      approvalLog.created_by = auth.user.id;
      await approvalLog.save();

      const notification = new Notification();
      notification.from = auth.user.id;
      notification.to = requestTerminal.submitter;
      notification.request_no = requestTerminal.request_no;
      notification.master_type_id = "a7c03e4f-e1f5-4c80-a3cd-f4b4929cbed7";
      notification.status = "REJECTED";
      await notification.save();
      Ws.io.emit("receive-notif", { userId: requestTerminal.submitter, message: "Rejected Master Data Terminal" });
      await SendMail.reject(requestTerminal.submitter, auth.user.id, "a7c03e4f-e1f5-4c80-a3cd-f4b4929cbed7", requestTerminal.request_no);
      let result = {
        "message": "Berhasil Ditolak"
      };

      return response.status(200).send(result);
    } catch (error) {

      let result = {
        "message": error.message
      };
      return response.status(500).send(result);
    }
  }

  public async approvalHistoryNext({ params, response }: HttpContextContract) {
    const id = params.id;
    const approvalHeader: any = await ApprovalHeader.query().where("no_request", id).first();
    const terminal: any = await RequestTerminal.query().where("request_no", id).first();
    if (approvalHeader) {
      const nextSequence = approvalHeader.approval_sequence + 1;
      const nextApproval = await SchemaApprovalList.query().preload("role").where("schema_id", terminal.schema_id).where("approval_order", nextSequence).first();
      const state = {
        nextApproval: nextApproval,
        status: "ada"
      };
      return state;
    } else {
      const nextApproval = await SchemaApprovalList.query().preload("role").where("schema_id", terminal.schema_id).orderBy("approval_order", "desc");
      const state = {
        nextApproval: nextApproval,
        status: "Tidak ada"
      };
      return state;
    }

  }

  public async view({ params, view, bouncer }: HttpContextContract) {
    const id = params.id;
    const exist = await RequestTerminal.query().where("id", id).first();
    if (exist) {
      const id = params.id;
      const terminal = await RequestTerminal.query().where("id", id).preload("subPengelola").preload("approvalHeader").first();
      const jenisTerminals = await JenisTerminal.all();
      const branches = await Branch.query().preload("portCode").preload("city");
      const strukturAll = await GroupCompany.all();
      const state = {
        terminal: terminal,
        jenisTerminals: jenisTerminals,
        branches: branches,
        strukturAll: strukturAll,
        requestStatus: 1
      };
      return view.render("pages/master_terminal/view", state);
    } else {
      const id = params.id;
      const terminal = await Terminal.query().where("id", id).first();
      const jenisTerminals = await JenisTerminal.all();
      // const branches = await Branch.query().preload("portCode");
      const branches = await Branch.query().preload("portCode").preload("city");
      const strukturAll = await GroupCompany.all();
      const state = {
        terminal: terminal,
        jenisTerminals: jenisTerminals,
        branches: branches,
        strukturAll: strukturAll,
        requestStatus: 0
      };
      return view.render("pages/master_terminal/view", state);
    }

  }


  public async active({ bouncer, params, session, response }: HttpContextContract) {
    const id = params.id;
    const trx = await Database.transaction();
    try {
      await bouncer.authorize("access", "activate-terminal");
      const branch = await Terminal.findOrFail(id);
      branch.status = "ACTIVE";
      branch.save();
      await trx.commit();
      let result = {
        "message": "Status Terminal Berhasil Diubah"
      };

      return response.status(200).send(result);
    } catch (error) {
      await trx.rollback();

      let result = {
        "message": error.message
      };
      return response.status(500).send(result);
    }
  }

  public async inActive({ bouncer, params, session, response }: HttpContextContract) {
    const id = params.id;
    const trx = await Database.transaction();
    try {
      await bouncer.authorize("access", "activate-terminal");
      const branch = await Terminal.findOrFail(id);
      branch.status = "INACTIVE";
      branch.save();
      await trx.commit();
      let result = {
        "message": "Status Terminal Berhasil Diubah"
      };

      return response.status(200).send(result);
    } catch (error) {
      await trx.rollback();

      let result = {
        "message": error.message
      };
      return response.status(500).send(result);
    }
  }


  public async export({ response }: HttpContextContract) {
    try {
      const workbook = new excel.Workbook();
      workbook.creator = "PT Pelabuhan Indonesia (Persero)";
      const worksheet = workbook.addWorksheet("Master Terminal");
      worksheet.columns = [
        { header: "Pelabuhan", key: "pelabuhan", width: 25 },
        { header: "Jenis Terminal", key: "jenis_terminal", width: 25 },
        { header: "Nama Terminal", key: "nama_terminal", width: 25 },
        { header: "Luas Wilayah (m2)", key: "luas_wilayah", width: 25 },
        { header: "Panjang Dermaga (m)", key: "panjang_dermaga", width: 25 },
        { header: "Kedalaman Kolam Min", key: "kedalaman_min", width: 25 },
        { header: "Kedalaman Kolam Max", key: "kedalaman_max", width: 25 },
        { header: "Status", key: "status", width: 25 }
      ];

      let cellArr: any = ["A", "B", "C", "D", "E", "F", "G", "H"];
      for (let index = 0; index < cellArr.length; index++) {
        worksheet.getCell(cellArr[index] + "1").border = {
          top: { style: "double", color: { argb: "000000" } },
          left: { style: "double", color: { argb: "000000" } },
          bottom: { style: "double", color: { argb: "000000" } },
          right: { style: "double", color: { argb: "000000" } }
        };
      }

      const Terminals = await Terminal.query().preload("branch").preload("jenisTerminal");

      Terminals.forEach(function(data) {
        worksheet.addRow({
          pelabuhan: data.branch?.name,
          jenis_terminal: data.jenisTerminal?.name,
          nama_terminal: data.name,
          luas_wilayah: data.luas,
          panjang_dermaga: data.jumlah_tambat,
          kedalaman_min: data.kedalaman_min,
          kedalaman_max: data.kedalaman_max,
          status: data.status
        });
      });

      await workbook.xlsx.writeFile("public/media/template_excel_master/data_master_terminal.xlsx");
      const filePath = Application.publicPath("media/template_excel_master/data_master_terminal.xlsx");
      return response.download(filePath);
    } catch (error) {
      console.log(error);
    }
  }

}
