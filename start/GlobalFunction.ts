import View from "@ioc:Adonis/Core/View";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import SchemaApprovalList from "App/Models/SchemaApprovalList";
import { Exception } from "@poppinss/utils";
import ApprovalHeader from "App/Models/ApprovalHeader";
import ApprovalDetail from "App/Models/ApprovalDetail";

View.global("isAllowedApprove", async function(schemaId, noRequest, roleId) {
  const approveHeader = await ApprovalHeader.query().where("no_request", noRequest).first();
  let approvalSequence = 0;
  let step = 1;
  if (approveHeader) {
    approvalSequence = approveHeader.approval_sequence;
    step = approveHeader.step;
  }
  const nextApprovalSequece = approvalSequence + 1;
  const userApprove = await SchemaApprovalList.query().where("schema_id", schemaId).where("approval_order", nextApprovalSequece).where("role_id", roleId).first();
  // if (!userApprove) {
  //   return false;
  // }
  if (approveHeader) {
    // const cekApproval = await ApprovalDetail.query().where("header_id", approveHeader.id).where("step", step).where("sequence", nextApprovalSequece).where("role_id", roleId).first();
    const cekApproval = await ApprovalDetail.query().where("header_id", approveHeader.id).where("step", step).where("sequence", approvalSequence).where("role_id", roleId).first();

    if (cekApproval) {
      return false;
    }
  }

  return true;
});
