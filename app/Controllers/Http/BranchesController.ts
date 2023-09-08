import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Branch from "App/Models/Branch";
import Database from "@ioc:Adonis/Lucid/Database";
import KelasPelabuhan from "App/Models/KelasPelabuhan";
import JenisPelabuhan from "App/Models/JenisPelabuhan";
import PerairanPelabuhan from "App/Models/PerairanPelabuhan";
import { DateTime } from "luxon";
import SchemaAplication from "App/Models/SchemaAplication";
import { Exception } from "@poppinss/utils";
import User from "App/Models/User";
import RequestBranch from "App/Models/RequestBranch";
import CreateBranchValidator from "App/Validators/CreateBranchValidator";
import SchemaApprovalList from "App/Models/SchemaApprovalList";
import ApprovalHeader from "App/Models/ApprovalHeader";
import ApprovalDetail from "App/Models/ApprovalDetail";
import MasterCompany from "App/Models/MasterCompany";
import Country from "App/Models/Country";
import City from "App/Models/City";
import Ws from "App/Services/Ws";
import Notification from "../../Models/Notification";
import Regional from "App/Models/Regional";
import Cabang from "App/Models/Cabang";
import KodePerairan from "App/Models/KodePerairan";
import ApprovalLog from "App/Models/ApprovalLog";
import Auth from "Config/auth";
import { elseif } from "edge.js/build/src/Tags";
import auth from "Config/auth";
import SendMail from "App/Services/SendMail";
import CountryCode from "App/Models/CountryCode";
import excel from "exceljs";
import Terminal from "App/Models/Terminal";
import Application from "@ioc:Adonis/Core/Application";
import CreateBranchDraftValidatorValidator from "App/Validators/CreateBranchDraftValidator";
import CreateBranchDraftValidator from "App/Validators/CreateBranchDraftValidator";

export default class BranchesController {
  public async index({ bouncer, view, request, auth }: HttpContextContract) {
    await bouncer.authorize("access", "view-branch");
    const reject = await RequestBranch.query().where("status", "REJECT");
    const requestApproval = await RequestBranch.query().where("status", "REQUEST");
    const active = await Branch.query().where("status", "ACTIVE");
    const draft = await RequestBranch.query().where("status", "DRAFT").where("submitter", auth.user.id);
    const inactive = await Branch.query().where("status", "INACTIVE");

    let branches: any;
    let status: any = "ALL";
    if (request.input("status") == "OUTSTANDING") {
      branches = await RequestBranch.query().preload("regional").preload("postalcode").preload("city", function(query) {
        query.preload("country");
      }).where("status", "!=", "COMPLETED").orderBy("created_at", "DESC");
      status = request.input("status");
    } else if (request.input("status") == "REQUEST" || request.input("status") == "REJECT" || request.input("status") == "DRAFT") {
      if (request.input("status") == "DRAFT") {
        branches = await RequestBranch.query().preload("regional").preload("postalcode").preload("city", function(query) {
          query.preload("country");
        }).where("status", request.input("status")).where("submitter", auth.user.id).orderBy("created_at", "DESC");
      } else {
        branches = await RequestBranch.query().preload("regional").preload("postalcode").preload("city", function(query) {
          query.preload("country");
        }).where("status", request.input("status")).orderBy("created_at", "DESC");
      }

      status = request.input("status");
    } else if (request.input("status") == "ACTIVE" || request.input("status") == "INACTIVE") {
      branches = await Branch.query().preload("regional").preload("postalcode").preload("city", function(query) {
        query.preload("country");
      }).where("status", request.input("status")).orderBy("created_at", "DESC");
      status = "ALL";
    } else {
      branches = await Branch.query().preload("regional").preload("postalcode").preload("city", function(query) {
        query.preload("country");
      }).orderBy("created_at", "DESC");
      status = "ALL";
    }

    const state = {
      branches: branches,
      status: status,
      total: reject.length + requestApproval.length + active.length + inactive,
      reject: reject.length,
      requestApproval: requestApproval.length,
      active: active.length,
      inactive: inactive.length,
      draft: draft.length
    };
    return view.render("pages/branch/index", state);

  }

  public async create({ view, bouncer }: HttpContextContract) {


    await bouncer.authorize("access", "create-branch");
    const regionals = await Regional.query().orderBy("code");
    const peraiaranPelabuhans = await PerairanPelabuhan.all();
    const kodePerairans = await KodePerairan.all();
    const KelasPelabuhans = await KelasPelabuhan.query().orderBy("sort_no", "asc");
    const jenisPelabuhans = await JenisPelabuhan.all();
    const country = await Country.all();
    const countryCodes = await CountryCode.all();
    const state = {
      regionals: regionals,
      peraiaranPelabuhans: peraiaranPelabuhans,
      KelasPelabuhans: KelasPelabuhans,
      jenisPelabuhans: jenisPelabuhans,
      country: country,
      kodePerairans: kodePerairans,
      countryCodes: countryCodes
    };
    return view.render("pages/branch/create", state);
  }

  public async store({ request, response, bouncer, auth }: HttpContextContract) {
    if (request.input("save_submit") == 1) {
      await request.validate(CreateBranchValidator);
    } else {
      await request.validate(CreateBranchDraftValidator);
    }
    const currentDate = String(DateTime.now().year) + String(DateTime.now().month) + String(DateTime.now().day);
    await bouncer.authorize("access", "create-branch");
    const masterTypeId = "66c094e6-f39e-4671-b69a-e64b81a264c2";
    let portCode = "";
    const trx = await Database.transaction();
    try {
      if (parseInt(request.input("kedalaman_min")) > 0 && parseInt(request.input("kedalaman_max")) > 0) {
        throw new Exception("Kedalaman alur lebih besar dari 0", 422);
      }
      if (parseInt(request.input("kedalaman_min")) < parseInt(request.input("kedalaman_max"))) {
        throw new Exception("Kedalaman Alur not valid", 422);
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
      if (request.input("port_code")) {
        portCode = request.input("port_code");
      } else {
        const cekCity = await City.query().where("city_code", request.input("country_code")).where("country_id", request.input("country_id")).first();
        if (cekCity) {
          throw new Exception("Kode Pelabuhan Already Exists Master Data", 422);
        }
        const city = await new City();
        city.city_code = request.input("country_code");
        city.city_name = request.input("country_name");
        city.country_id = request.input("country_id");
        await city.save();
        portCode = city.id;
      }

      if (!request.input("reference_id")) {
        const checkCodeRequest = await RequestBranch.query().where("country_id", request.input("country_id")).where("port_code", portCode).first();
        const checkCode = await Branch.query().where("port_code", portCode).first();

        if (checkCode || checkCodeRequest) {
          throw new Exception("Kode Pelabuhan already exists", 422);
        }
      }else{
        const updateStatusBranch=await Branch.findOrFail(request.input("reference_id"));
        updateStatusBranch.isedit=1;
        await updateStatusBranch.save();
      }
      let rencanaIndukFileName = null;
      const rencanaIndukFile = request.file("rencana_induk_file");
      if (request.input("save_submit") == 1) {
        if (rencanaIndukFile) {
          await rencanaIndukFile.moveToDisk("", { name: rencanaIndukFile.fileName });
          rencanaIndukFileName = rencanaIndukFile.fileName;
        } else {
          if (request.input("reference_id")) {
            if (request.input("rencana_induk_file_old")) {
              rencanaIndukFileName = request.input("rencana_induk_file_old");
            } else {
              throw new Exception("Rencana induk pelabuhan is required", 422);
            }
          } else {
            throw new Exception("Rencana induk pelabuhan is required", 422);
          }

        }
      }


      const zeroPad = (num, places) => String(num).padStart(places, "0");
      const requestBranch = await Database.rawQuery("select * from (select SUBSTR(\"request_no\" ,12,3) AS \"request_no\" from \"request_branches\" where SUBSTR(??,4,8) = ? order by \"created_at\" desc) where rownum <= 1", ["request_no", currentDate]);
      const lastNo = requestBranch.length > 0 ? requestBranch[0].request_no : 0;
      const requestNo = "PLB" + currentDate + zeroPad(parseInt(lastNo) + 1, 3);
      const branch = new RequestBranch();
      branch.request_no = requestNo;
      branch.regional_id = request.input("regional_id");
      branch.submitter = auth.user.id;
      branch.entity_id = user.role.entity.id;
      branch.master_type_id = masterTypeId;
      branch.schema_id = schema.id;
      branch.name = request.input("name");
      branch.luas_perairan = request.input("luas_perairan");
      branch.luas_daratan = request.input("luas_daratan");
      branch.kode_area_labuh = request.input("kode_area_labuh");
      branch.kode_perairan = request.input("kode_perairan");
      branch.kode_kemenhub = request.input("kode_kemenhub");
      branch.lng = request.input("lng");
      branch.lat = request.input("lat");
      branch.kedalaman_min = request.input("kedalaman_min");
      branch.kedalaman_max = request.input("kedalaman_max");
      branch.country_id = request.input("country_id");
      branch.postalcode_id = request.input("postalcode_id");
      branch.port_name = request.input("port_name");
      branch.name = request.input("port_name");
      branch.port_code = portCode;
      branch.kelas_pelabuhan_id = request.input("kelas_pelabuhan_id");
      branch.jenis_pelabuhan_id = request.input("jenis_pelabuhan_id");
      branch.perairan_pelabuhan_id = request.input("perairan_pelabuhan_id");
      branch.header_branch_id = request.input("header_branch_id");
      branch.reference_id = request.input("reference_id") ?? null;
      branch.panjang_alur = request.input("panjang_alur");
      branch.lebar_alur = request.input("lebar_alur");
      branch.address = request.input("address");
      branch.rencana_induk_file = rencanaIndukFileName;
      if (request.input("save_draft") == 1) {
        branch.status = "DRAFT";
      }
      if (request.input("save_submit") == 1) {
        branch.status = "REQUEST";
      }
      branch.useTransaction(trx);
      await branch.save();

      //NOTIFICATION
      if (request.input("save_submit") == 1) {
        const approvalLog = new ApprovalLog();
        approvalLog.request_no = branch.request_no;
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
            request_no: branch.request_no,
            master_type_id: "66c094e6-f39e-4671-b69a-e64b81a264c2",
            status: "APPROVED"
          });
          Ws.io.emit("receive-notif", { userId: value.id, message: "Request Approval Master Data Pelabuhan" });
          await SendMail.approve(value.id, branch.submitter, branch.master_type_id, branch.request_no);
        });
        console.log(notificationData);
        await Notification.createMany(notificationData);
      }
      await trx.commit();
      let result = {
        "message": "Data Pelabuhan Berhasil Dibuat"
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


  public async edit({ params, view, bouncer }: HttpContextContract) {
    await bouncer.authorize("access", "edit-branch");
    const id = params.id;
    const branch: any = await RequestBranch.query().where("id", id).preload("postalcode").preload("portCode").preload("city", function(query) {
      query.preload("country");
    }).preload("company").first();
    const regionals = await Regional.query().orderBy("code");
    const perairanPelabuhans = await PerairanPelabuhan.all();
    const kodePerairans = await KodePerairan.all();
    const KelasPelabuhans = await KelasPelabuhan.query().orderBy("sort_no", "asc");
    const jenisPelabuhans = await JenisPelabuhan.all();
    const headerBranch = await Cabang.query().where("regional_id", branch.regional_id);
    const country = await Country.all();
    const city = await City.query().preload("country").where("country_id", branch.city?branch.city.country_id:'');
    const countryCodes = await CountryCode.all();
    const state = {
      branch: branch,
      regionals: regionals,
      perairanPelabuhans: perairanPelabuhans,
      KelasPelabuhans: KelasPelabuhans,
      jenisPelabuhans: jenisPelabuhans,
      headerBranch: headerBranch,
      country: country,
      city: city,
      kodePerairans: kodePerairans,
      countryCodes: countryCodes
    };
    return view.render("pages/branch/edit", state);
  }

  public async renewal({ params, view, bouncer }: HttpContextContract) {
    await bouncer.authorize("access", "edit-branch");
    const id = params.id;
    const branch: any = await Branch.query().where("id", id).preload("postalcode").preload("portCode").preload("city", function(query) {
      query.preload("country");
    }).preload("company").first();
    const regionals = await Regional.query().orderBy("code");
    const perairanPelabuhans = await PerairanPelabuhan.all();
    const kodePerairans = await KodePerairan.all();
    const KelasPelabuhans = await KelasPelabuhan.query().orderBy("sort_no", "asc");
    const jenisPelabuhans = await JenisPelabuhan.all();
    const headerBranch = await Cabang.query().where("regional_id", branch.regional_id);
    const country = await Country.all();
    const city = await City.query().preload("country").where("country_id", branch.city.country_id);
    const countryCodes = await CountryCode.all();
    const state = {
      branch: branch,
      regionals: regionals,
      perairanPelabuhans: perairanPelabuhans,
      KelasPelabuhans: KelasPelabuhans,
      jenisPelabuhans: jenisPelabuhans,
      headerBranch: headerBranch,
      country: country,
      city: city,
      kodePerairans: kodePerairans,
      countryCodes: countryCodes
    };
    return view.render("pages/branch/renewal", state);
  }

  public async view({ params, view, bouncer }: HttpContextContract) {
    const id = params.id;
    const exist = await RequestBranch.query().where("id", id).first();
    if (exist) {
      const id = params.id;
      const branch: any = await RequestBranch.query().where("id", id).preload("postalcode").preload("portCode").preload("approvalHeader").preload("city", function(query) {
        query.preload("country");
      }).preload("company").first();
      const regionals = await Regional.query().orderBy("code");
      const perairanPelabuhans = await PerairanPelabuhan.all();
      const KelasPelabuhans = await KelasPelabuhan.all();
      const kodePerairans = await KodePerairan.all();
      const jenisPelabuhans = await JenisPelabuhan.all();
      const headerBranch = await Cabang.query().where("regional_id", branch.regional_id);
      const country = await Country.all();
      const city = await City.query().preload("country").where("country_id", branch.city ?branch.city.country_id:'');
      const state = {
        branch: branch,
        regionals: regionals,
        perairanPelabuhans: perairanPelabuhans,
        KelasPelabuhans: KelasPelabuhans,
        jenisPelabuhans: jenisPelabuhans,
        headerBranch: headerBranch,
        country: country,
        city: city,
        kodePerairans: kodePerairans
      };

      return view.render("pages/branch/view", state);
    } else {
      const id = params.id;
      const branch: any = await Branch.query().where("id", id).preload("postalcode").preload("portCode").preload("city", function(query) {
        query.preload("country");
      }).first();
      const regionals = await Regional.query().orderBy("code");
      const perairanPelabuhans = await PerairanPelabuhan.all();
      const KelasPelabuhans = await KelasPelabuhan.all();
      const jenisPelabuhans = await JenisPelabuhan.all();
      const kodePerairans = await KodePerairan.all();
      const country = await Country.all();
      const city = await City.query().preload("country").where("country_id", branch.city.country_id);
      const headerBranch = await Cabang.query().where("regional_id", branch.regional_id);

      const state = {
        branch: branch,
        regionals: regionals,
        perairanPelabuhans: perairanPelabuhans,
        KelasPelabuhans: KelasPelabuhans,
        jenisPelabuhans: jenisPelabuhans,
        country: country,
        city: city,
        headerBranch: headerBranch,
        kodePerairans: kodePerairans
      };
      return view.render("pages/branch/view", state);
    }

  }

  public async show({ params, response }: HttpContextContract) {
    const id = params.id;
    const branch = await RequestBranch.query().where("request_no", id).first();
    if (branch) {
      const branch = await RequestBranch.query()
        .preload("kelaspelabuhan")
        .preload("jenispelabuhan")
        .preload("postalcode")
        .preload("regional")
        .preload("perairanpelabuhan")
        .preload("countryCode")
        .preload("cities")
        .preload("kodePerairan")
        .preload("company")
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
      response.send(branch);
    } else {
      const branch = await Branch.query()
        .preload("kelaspelabuhan")
        .preload("jenispelabuhan")
        .preload("postalcode")
        .preload("regional")
        .preload("perairanpelabuhan")
        .preload("portCode")
        .preload("kodePerairan")
        .where("request_no", id)
        .first();
      response.send(branch);
    }


  }

  public async update({ params, request, response, bouncer, auth }: HttpContextContract) {
    if (request.input("save_submit") == 1) {
      await request.validate(CreateBranchValidator);
    } else {
      await request.validate(CreateBranchDraftValidator);
    }
    await bouncer.authorize("access", "edit-branch");
    const id = params.id;
    let portCode = "";
    if (request.input("port_code")) {
      portCode = request.input("port_code");
    } else {
      const cekCity = await City.query().where("city_code", request.input("country_code")).where("country_id", request.input("country_id")).first();
      if (cekCity) {
        throw new Exception("Kode Pelabuhan Already Exists", 422);
      }
      const city = await new City();
      city.city_code = request.input("country_code");
      city.city_name = request.input("country_name");
      city.country_id = request.input("country_id");
      await city.save();
      portCode = city.id;
    }

    const trx = await Database.transaction();
    try {
      if (parseInt(request.input("kedalaman_min")) > 0 && parseInt(request.input("kedalaman_max")) > 0) {
        throw new Exception("Kedalaman alur lebih besar dari 0", 422);
      }
      if (parseInt(request.input("kedalaman_min")) < parseInt(request.input("kedalaman_max"))) {
        throw new Exception("Kedalaman Alur not valid", 422);
      }

      if (!request.input("reference_id")) {
        const checkCode = await Branch.query().where("port_code", portCode).first();
        const checkCodeRequest = await RequestBranch.query().where("country_id", request.input("country_id")).where("port_code", portCode).whereNot("id", id).first();
        if (checkCode || checkCode) {
          throw new Exception("Kode Pelabuhan already exists", 422);
        }
      }

      const branch = await RequestBranch.findOrFail(id);
      branch.regional_id = request.input("regional_id");
      branch.name = request.input("name");
      branch.luas_perairan = request.input("luas_perairan");
      branch.luas_daratan = request.input("luas_daratan");
      branch.kode_area_labuh = request.input("kode_area_labuh");
      branch.kode_perairan = request.input("kode_perairan");
      branch.kode_kemenhub = request.input("kode_kemenhub");
      branch.lng = request.input("lng");
      branch.lat = request.input("lat");
      branch.kedalaman_min = request.input("kedalaman_min");
      branch.kedalaman_max = request.input("kedalaman_max");
      branch.country_id = request.input("country_id");
      branch.postalcode_id = request.input("postalcode_id");
      branch.port_name = request.input("port_name");
      branch.name = request.input("port_name");
      branch.port_code = portCode;
      branch.kelas_pelabuhan_id = request.input("kelas_pelabuhan_id");
      branch.jenis_pelabuhan_id = request.input("jenis_pelabuhan_id");
      branch.perairan_pelabuhan_id = request.input("perairan_pelabuhan_id");
      branch.reference_id = request.input("reference_id") ?? null;
      branch.panjang_alur = request.input("panjang_alur");
      branch.lebar_alur = request.input("lebar_alur");
      branch.address = request.input("address");
      branch.header_branch_id = request.input("header_branch_id");
      if (request.input("save_draft") == 1) {
        branch.status = "DRAFT";
      }
      if (request.input("save_submit") == 1) {
        branch.status = "REQUEST";
      }

      if (request.file("rencana_induk_file")) {
        const rencanaIndukFile = request.file("rencana_induk_file");
        await rencanaIndukFile.moveToDisk("", { name: rencanaIndukFile.fileName });
        const rencanaIndukFileName = rencanaIndukFile.fileName;
        branch.rencana_induk_file = rencanaIndukFileName;
      }

      branch.useTransaction(trx);
      await branch.save();

      if (request.input("save_submit") == 1) {
        const checkApprovalHeader = await ApprovalHeader.query().where("no_request", branch.request_no).first();
        let status = "UPDATED";
        if (!checkApprovalHeader) {
          status = "SUBMITED";
        }
        const approvalLog = new ApprovalLog();
        approvalLog.request_no = branch.request_no;
        approvalLog.action = status;
        approvalLog.remark = request.input("data_edited");
        approvalLog.created_by = auth.user.id;
        await approvalLog.save();
        //NOTIFICATION
        const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", branch.schema_id).where("approval_order", "1");
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
            request_no: branch.request_no,
            master_type_id: "66c094e6-f39e-4671-b69a-e64b81a264c2",
            status: "APPROVED"
          });
          Ws.io.emit("receive-notif", { userId: value.id, message: "Request Approval Master Data Pelabuhan" });
          await SendMail.approve(value.id, branch.submitter, branch.master_type_id, branch.request_no);
        });
        await Notification.createMany(notificationData);
      }
      await trx.commit();

      let result = {
        "message": "Data Pelabuhan Berhasil Diubah"
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
    await bouncer.authorize("access", "delete-branch");
    const id = params.id;
    const trx = await Database.transaction();
    try {
      const branch = await RequestBranch.findOrFail(id);
      if (branch.reference_id !== null){
        const updateStatusBranch=await Branch.findOrFail(branch.reference_id);
        updateStatusBranch.isedit=0;
        await updateStatusBranch.save();
      }
      const approvalHeader = await ApprovalHeader.query().where("no_request", branch.request_no).first();
      if (approvalHeader) {
        await ApprovalDetail.query().where("header_id", approvalHeader.id).delete();
        await ApprovalHeader.query().where("no_request", branch.request_no).delete();
      }
      branch.delete();
      await trx.commit();
      let result = {
        "message": "Data Pelabuhan Berhasil Dihapus"
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

      const requestBranch = await RequestBranch.query().where("request_no", noRequest).first();
      const schema = await SchemaAplication.query().where("id", requestBranch.schema_id).preload("approvalList").first();
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
      if (requestBranch.status == "REJECT" || requestBranch.status == "DRAFT") {
        throw new Exception("Data Pelabuhan Masih Dalam Perbaikan");
      }
      if (requestBranch.status == "COMPLETED") {
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
          let branch: any = null;

          if (requestBranch.reference_id) {
            branch = await Branch.findOrFail(requestBranch.reference_id);
            branch.isedit = 0;
          } else {
            branch = new Branch();
          }
          branch.regional_id = requestBranch.regional_id;
          branch.name = requestBranch.name;
          branch.luas_perairan = requestBranch.luas_perairan;
          branch.luas_daratan = requestBranch.luas_daratan;
          branch.kode_area_labuh = requestBranch.kode_area_labuh;
          branch.kode_perairan = requestBranch.kode_perairan;
          branch.kode_kemenhub = requestBranch.kode_kemenhub;
          branch.lng = requestBranch.lng;
          branch.lat = requestBranch.lat;
          branch.kedalaman_min = requestBranch.kedalaman_min;
          branch.kedalaman_max = requestBranch.kedalaman_max;
          branch.country_id = requestBranch.country_id;
          branch.postalcode_id = requestBranch.postalcode_id;
          branch.port_name = requestBranch.port_name;
          branch.port_code = requestBranch.port_code;
          branch.kelas_pelabuhan_id = requestBranch.kelas_pelabuhan_id;
          branch.jenis_pelabuhan_id = requestBranch.jenis_pelabuhan_id;
          branch.perairan_pelabuhan_id = requestBranch.perairan_pelabuhan_id;
          branch.request_no = requestBranch.request_no;
          branch.header_branch_id = requestBranch.header_branch_id;
          branch.name = requestBranch.port_name;

          branch.panjang_alur =requestBranch.panjang_alur;
          branch.lebar_alur = requestBranch.lebar_alur;
          branch.address =requestBranch.address;
          branch.rencana_induk_file = requestBranch.rencana_induk_file;
          await branch.save();

          const UpdateRequestBranch = await RequestBranch.findOrFail(requestBranch.id);
          UpdateRequestBranch.status = "COMPLETED";
          await UpdateRequestBranch.save();
        }
      }


      //NOTIFICATION
      const approvalLog = new ApprovalLog();
      approvalLog.request_no = requestBranch.request_no;
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
          request_no: requestBranch.request_no,
          master_type_id: "66c094e6-f39e-4671-b69a-e64b81a264c2",
          status: "APPROVED"
        });
        Ws.io.emit("receive-notif", { userId: value.id, message: "Request Approval Master Data Pelabuhan" });
        await SendMail.approve(value.id, requestBranch.submitter, requestBranch.master_type_id, requestBranch.request_no);
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

      const requestBranch = await RequestBranch.query().where("request_no", noRequest).first();
      const schema = await SchemaAplication.query().where("id", requestBranch.schema_id).preload("approvalList").first();
      if (requestBranch.status == "REJECT" || requestBranch.status == "DRAFT") {
        throw new Exception("Data Pelabuhan Masih Dalam Perbaikan");
      }
      if (requestBranch.status == "COMPLETED") {
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

        const UpdateRequestBranch = await RequestBranch.findOrFail(requestBranch.id);
        UpdateRequestBranch.status = "REJECT";
        await UpdateRequestBranch.save();

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
        const UpdateRequestBranch = await RequestBranch.findOrFail(requestBranch.id);
        UpdateRequestBranch.status = "REJECT";
        await UpdateRequestBranch.save();
      }

      //NOTIFICATION
      const approvalLog = new ApprovalLog();
      approvalLog.request_no = requestBranch.request_no;
      approvalLog.action = "REJECTED";
      approvalLog.remark = remark;
      approvalLog.created_by = auth.user.id;
      await approvalLog.save();
      const notification = new Notification();
      notification.from = auth.user.id;
      notification.to = requestBranch.submitter;
      notification.request_no = requestBranch.request_no;
      notification.master_type_id = "66c094e6-f39e-4671-b69a-e64b81a264c2";
      notification.status = "REJECTED";
      await notification.save();
      const submitterUser = await User.query().where("id", requestBranch.submitter).first();
      Ws.io.emit("receive-notif", { userId: requestBranch.submitter, message: "Rejected Master Data Pelabuhan" });
      await SendMail.reject(requestBranch.submitter, auth.user.id, "66c094e6-f39e-4671-b69a-e64b81a264c2", requestBranch.request_no);
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

    const branch: any = await RequestBranch.query().where("request_no", id).first();


    if (approvalHeader) {
      const nextSequence = approvalHeader.approval_sequence + 1;
      const nextApproval = await SchemaApprovalList.query().preload("role").where("schema_id", branch.schema_id).where("approval_order", nextSequence).first();
      const state = {
        nextApproval: nextApproval,
        status: "ada"
      };
      return state;
    } else {
      const nextApproval = await SchemaApprovalList.query().preload("role").where("schema_id", branch.schema_id).orderBy("approval_order", "desc");
      const state = {
        nextApproval: nextApproval,
        status: "Tidak ada"
      };
      return state;
    }

  }


  public async active({ bouncer, params, session, response }: HttpContextContract) {

    const id = params.id;
    const trx = await Database.transaction();
    try {
      await bouncer.authorize("access", "activate-branch");
      const branch = await Branch.findOrFail(id);
      branch.status = "ACTIVE";
      branch.save();
      await trx.commit();
      let result = {
        "message": "Status Pelabuhan Berhasil Diubah"
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
      await bouncer.authorize("access", "activate-branch");
      const branch = await Branch.findOrFail(id);
      branch.status = "INACTIVE";
      branch.save();
      await trx.commit();
      let result = {
        "message": "Status Pelabuhan Berhasil Diubah"
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
        { header: "Negara", key: "negara", width: 25 },
        { header: "Provinsi", key: "province", width: 25 },
        { header: "Nama Pelabuhan", key: "port_name", width: 25 },
        { header: "Status/Kelas", key: "kelas", width: 25 },
        { header: "Kode Pelabuhan", key: "port_code", width: 25 },
        { header: "Perairan Pelabuhan", key: "perairan_code", width: 25 },
        { header: "DLKR(m2)", key: "dlkr", width: 25 },
        { header: "DLKP(m2)", key: "dlkp", width: 25 },
        { header: "Cabang Lokasi Kerja", key: "cabang", width: 25 },
        { header: "Kode Perairan", key: "kode_perairan", width: 25 },
        { header: "Jenis Pelabuhan", key: "jenis_pelabuhan", width: 25 },
        { header: "Koordinat", key: "koordinat", width: 25 },
        { header: "Kode UN/LOCODE", key: "unlocode", width: 25 },
        { header: "Kedalaman Alur Min (-mLWS)", key: "kedalaman_min", width: 25 },
        { header: "Kedalaman Alur Max (-mLWS)", key: "kedalaman_max", width: 25 },
        { header: "Panjang Alur", key: "panjang_alur", width: 25 },
        { header: "Lebar Alur", key: "lebar_alur", width: 25 },
        { header: "Alamat", key: "address", width: 25 },
        { header: "Status", key: "status", width: 25 }
      ];

      let cellArr: any = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"];
      for (let index = 0; index < cellArr.length; index++) {
        worksheet.getCell(cellArr[index] + "1").border = {
          top: { style: "double", color: { argb: "000000" } },
          left: { style: "double", color: { argb: "000000" } },
          bottom: { style: "double", color: { argb: "000000" } },
          right: { style: "double", color: { argb: "000000" } }
        };
      }

      const Branches = await Branch.query()
        .preload("kelaspelabuhan")
        .preload("jenispelabuhan")
        .preload("postalcode")
        .preload("regional")
        .preload("perairanpelabuhan")
        .preload("portCode")
        .preload("kodePerairan")
        .preload("company")
        .preload("city", function(query) {
          query.preload("country");
        });

      Branches.forEach(function(data) {
        worksheet.addRow({
          negara: data.city?.country?.country_name,
          province: data.postalcode?.province,
          port_name: data.name,
          kelas: data.kelaspelabuhan?.name,
          port_code: data.city?.country?.country_code + data.city?.city_code,
          perairan_code: data.perairanpelabuhan?.name,
          dlkr: data.luas_perairan,
          dlkp: data.luas_daratan,
          cabang: data.company?.name,
          kode_perairan: data.kodePerairan?.name,
          jenis_pelabuhan: data.jenispelabuhan?.name,
          koordinat: data.lng + "," + data.lat,
          unlocode: data.kode_kemenhub,
          kedalaman_min: data.kedalaman_min,
          kedalaman_max: data.kedalaman_max,
          panjang_alur: data.panjang_alur,
          lebar_alur: data.lebar_alur,
          address: data.address,
          status: data.status
        });
      });

      await workbook.xlsx.writeFile("public/media/template_excel_master/data_master_pelabuhan.xlsx");
      const filePath = Application.publicPath("media/template_excel_master/data_master_pelabuhan.xlsx");
      return response.download(filePath);
    } catch (error) {
      console.log(error);
    }
  }

}
