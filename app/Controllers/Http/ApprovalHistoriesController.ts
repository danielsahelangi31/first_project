import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ApprovalDetail from "App/Models/ApprovalDetail";
import ApprovalHeader from "App/Models/ApprovalHeader";
import SchemaApprovalList from "App/Models/SchemaApprovalList";
import ApprovalLog from "App/Models/ApprovalLog";

export default class ApprovalHistoriesController {

  public async approvalHeader({ params }: HttpContextContract) {
    const request_no = params.id;
    const approvalHeader = await ApprovalHeader.query().where("no_request", request_no).first();
    if (approvalHeader) {
      const approvalHeader = await ApprovalHeader.query().preload("user", function(query) {
        query.preload("role", function(query) {
          query.preload("entity");
        });
      }).where("no_request", request_no).first();
      const state = {
        approvalHeader: approvalHeader,
        status: "approval"
      };
      return state;
    } else {
      const state = {
        status: "request"
      };
      return state;
    }


  }

  public async lastApprovalHistory({ params }: HttpContextContract) {
    const request_no = params.id;
    const approvalHeader: any = await ApprovalHeader.query().where("no_request", request_no).select("approval_sequence", "id").first();
    if (approvalHeader) {
      if (approvalHeader?.approval_sequence == 0) {
        const approvalLastHistory = await ApprovalHeader.query().preload("user", function(query) {
          query.preload("role");
        }).where("no_request", request_no).first();
        const state = {
          approvalLastHistory: approvalLastHistory,
          status: "new"
        };
        return state;
      } else {
        const approvalLastHistory = await ApprovalDetail.query().preload("role").where("header_id", approvalHeader?.id).where("sequence", approvalHeader?.approval_sequence).first();
        const state = {
          approvalLastHistory: approvalLastHistory,
          status: "approve"
        };
        return state;
      }
    } else {
      const state = {
        status: "request"
      };
      return state;
    }

  }

  public async approvalHistoryDetail({ params }: HttpContextContract) {
    const request_no = params.id;
    const approvalHeader: any = await ApprovalHeader.query().where("no_request", request_no).first();
    if (approvalHeader?.approval_sequence == 0) {
      status: "tidak ada";
    } else {
      const approvalLastHistory = await ApprovalDetail.query().preload("role").preload("user").where("header_id", approvalHeader?.id).orderBy("created_at", "asc");
      const state = {
        approvalLastHistory: approvalLastHistory,
        status: "ada"
      };
      return state;

    }
  }

  public async logApproval({ params }: HttpContextContract) {
    const request_no = params.id;
    const approvalLog: any = await ApprovalLog.query().preload("user", function(query) {
      query.preload("role", function(query) {
        query.preload("entity", function(query) {
          query.preload("jobTitle");
        });
      });
    }).where("request_no", request_no).orderBy("created_at", "asc");

    return approvalLog;

  }


  public async approvalPath({ params }: HttpContextContract) {
    const approvalPatch: any = await SchemaApprovalList.query().where("schema_id", params.id).preload("role").orderBy("approval_order", "asc");
    return approvalPatch;
  }

}

