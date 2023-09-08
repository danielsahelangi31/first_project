import ApprovalDetail from "App/Models/ApprovalDetail";
import ApprovalHeader from "App/Models/ApprovalHeader";
import ApprovalLog from "App/Models/ApprovalLog";
import SchemaAplication from "App/Models/SchemaAplication";
import SchemaApprovalList from "App/Models/SchemaApprovalList";
import User from "App/Models/User";
import Ws from "../Ws";
import Notification from "App/Models/Notification";
import Database from "@ioc:Adonis/Lucid/Database";

interface result {
    status: boolean,
    isFinalApprove: boolean,
    nextApproval: number,
    message: string     
}
class ApprovalStep {



    public async approveData(
        noRequest:string,
        schemaId:string,
        status:string,
        roleId:string,
        submitter:string,
        remark:string
    ) {
        let approvalSequence:number = 0;
        let approvalHeaderId:string = "";
        let step:number = 1;
        let data:result = {
            status:false,
            isFinalApprove: false,
            nextApproval:0,
            message: ""
        }

        try {
            
            const schema = await SchemaAplication.query().where("id", schemaId).preload("approvalList").first();
            const SchemaApprovalMax = await SchemaApprovalList.query().where("schema_id", `${schema?.id}`).orderBy("approval_order", "desc").first();
            const approveHeader = await ApprovalHeader.query().where("no_request", noRequest).first();
            const approvalRoleMandatory:any = [];
            const approvalRoleOptional:any = [];

            // set approval squence and step from approval header
            if (approveHeader) {
                approvalSequence = approveHeader.approval_sequence;
                step = approveHeader.step;
            }

            // set approval mandatory and approval optional
            const nextApprovalSequece:number = approvalSequence + 1;
            schema?.approvalList.forEach(function (value) {
                if (value.mandatory == "1" && value.approval_order == `${nextApprovalSequece}`) {
                    approvalRoleMandatory.push(value.role_id);
                }

                if (value.mandatory == "0" && value.approval_order == `${nextApprovalSequece}`) {
                    approvalRoleOptional.push(value.role_id);
                }
            });
            
            // check user schema
            if (!schema) {
                 data.message = "Schema Not Found";
                 return data
            }
            
            // check status data
            if (status == "REJECT" || status == "DRAFT") {
                data.message = "Data Masih Dalam Perbaikan";
                return data
            }
            
            if (status == "ACTIVE") {
                data.message = "Data Sudah Selesai Prosess Persetujuan";
                return data
            }
            
            // check user in schema approval
            const userApprove = await SchemaApprovalList.query().where("schema_id", schema.id).where("approval_order", nextApprovalSequece).where("role_id", roleId).first();    
            if (!userApprove) {
                data.message = "Anda Tidak Mempunyai Aksess Untuk Melakukan Approval Selanjutnya";
                return data
            }

            // create Approval header data
            if (!approveHeader) {
                const approvalHeader = new ApprovalHeader();
                approvalHeader.no_request = noRequest;
                approvalHeader.total_approve = SchemaApprovalMax?.approval_order ? parseInt(SchemaApprovalMax?.approval_order) : 0;
                approvalHeader.id_submitter = submitter;
                approvalHeader.approval_sequence = 0;
                approvalHeader.step = 1;
                // approvalHeader.useTransaction(trx)
                await approvalHeader.save();
                approvalHeaderId = approvalHeader.id;
            } else {
                approvalHeaderId = approveHeader.id;
            }

            // check user already approve 
            const cekApproval = await ApprovalDetail.query().where("header_id", approvalHeaderId).where("step", step).where("sequence", nextApprovalSequece).where("role_id", roleId).first();
            if (cekApproval) {
                data.message = "Anda Sudah Melakukan Approval Sebelumnya";
                return data
            }

            // create user approve detail
            const approvalDetail = new ApprovalDetail();
            approvalDetail.user_id = submitter;
            approvalDetail.validation = "APPROVE";
            approvalDetail.header_id = approvalHeaderId;
            approvalDetail.remark = remark;
            approvalDetail.sequence = nextApprovalSequece;
            approvalDetail.role_id = roleId;
            approvalDetail.step = step;
            // approvalDetail.useTransaction(trx)
            await approvalDetail.save();

            // check user approval is mandatory or optional
            let allowedOptional:boolean = true;
            const isMandatory = await ApprovalDetail.query().where("header_id", approvalHeaderId).whereIn("role_id", approvalRoleMandatory).where("step", step).where("sequence", nextApprovalSequece);
            if (approvalRoleOptional.length > 0) {
                const isOptional = await ApprovalDetail.query().where("header_id", approvalHeaderId).whereIn("role_id", approvalRoleOptional).where("step", step).where("sequence", nextApprovalSequece);
                if (isOptional.length == 0) {
                    allowedOptional = false;
                }
            }
            
            // check final approve
            if (isMandatory.length == approvalRoleMandatory.length && allowedOptional){
                const approvalHeader = await ApprovalHeader.findOrFail(approvalHeaderId);
                approvalHeader.approval_sequence = nextApprovalSequece;
                // approvalHeader.useTransaction(trx)
                await approvalHeader.save();

                if (`${nextApprovalSequece}` == SchemaApprovalMax?.approval_order){
                    data.status = true;
                    data.isFinalApprove = true;
                    data.nextApproval = nextApprovalSequece;
                    data.message = "Final Approve";
                    return data
                } 
                else{
                    data.status = true;
                    data.isFinalApprove = false;
                    data.nextApproval = nextApprovalSequece
                    data.message = "Not Final Approve";
                    return data
                }
            }else{
                data.status = false;
                data.isFinalApprove = false;
                data.nextApproval = nextApprovalSequece
                data.message = "Next Approval";
                return data;
            }
        } catch (error) {
            console.log(error)
            data.status = false
            data.message = error
            return data   
        }
    }

    public async rejectData(
        noRequest:string,
        schemaId:string,
        status:string,
        roleId:string,
        submitter:string,
        remark:string
    ) {
        const trx = await Database.transaction()
        let data:result = {
            status:false,
            isFinalApprove: false,
            nextApproval:0,
            message: ""
        }
        try {
            let approvalSequence = 0;
            let approvalHeaderId = "";
            const schema = await SchemaAplication.query().where("id", schemaId).preload("approvalList").first();

            // check status data
            if (status == "REJECT" || status == "DRAFT") {
                data.message = "Data Masih Dalam Perbaikan";
                return data
            }
            
            if (status == "ACTIVE") {
                data.message = "Data Sudah Selesai Prosess Persetujuan";
                return data
            }
            const approveHeader = await ApprovalHeader.query().where("no_request", noRequest).first();
            const approvalRoleMandatory:any = [];

            if (approveHeader) {
                approvalSequence = approveHeader.approval_sequence;
                }
        
            const nextApprovalSequece = approvalSequence + 1;
            schema?.approvalList.forEach(function(value) {
            if (value.mandatory == "1" && value.approval_order == `${nextApprovalSequece}`) {
                approvalRoleMandatory.push(value.role_id);
            }
            });

            if (!schema) {
                data.message = "Schema Not Found";
                return data;
            }
        
            const userApprove = await SchemaApprovalList.query().where("schema_id", schema.id).where("approval_order", nextApprovalSequece).where("role_id", roleId).first();
    
            if (!userApprove) {
                data.message = "Anda Tidak Mempunyai Aksess Untuk Melakukan Approval Selanjutnya";
                return data;
            }
            
            if (approveHeader) {
                approvalHeaderId = approveHeader.id;
        
                const cekApproval = await ApprovalDetail.query().where("header_id", approvalHeaderId).where("step", approveHeader.step).where("sequence", nextApprovalSequece).where("role_id", roleId).first();
        
                if (cekApproval) {
                    data.message = "Anda Sudah Melakukan Approval Sebelumnya";
                    return data;
                }
        
                const approvalDetail = new ApprovalDetail();
                approvalDetail.user_id = submitter;
                approvalDetail.validation = "REJECT";
                approvalDetail.header_id = approvalHeaderId;
                approvalDetail.remark = remark;
                approvalDetail.sequence = nextApprovalSequece;
                approvalDetail.role_id = roleId;
                approvalDetail.step = approveHeader.step;
                approvalDetail.useTransaction(trx)
                await approvalDetail.save();
                
                const approvalHeader2 = await ApprovalHeader.findOrFail(approvalHeaderId);
                approvalHeader2.approval_sequence = 0;
                approvalHeader2.step = approveHeader.step + 1;
                approvalHeader2.useTransaction(trx)
                await approvalHeader2.save();

                data = {
                    status: true,
                    isFinalApprove: true,
                    nextApproval: 0 ,
                    message: "Reject Data"
                };

                return data;
                // const UpdateRequestVessel = await RequestVesselGeneralInfo.findOrFail(requestVessel?.id);
                // UpdateRequestVessel.status = "REJECT";
                // UpdateRequestVessel.useTransaction(trx)
                // await UpdateRequestVessel.save();
    
            } else {
                const SchemaApprovalMax = await SchemaApprovalList.query().where("schema_id", schema.id).orderBy("approval_order", "desc").first();
                const approvalHeader = new ApprovalHeader();
                approvalHeader.no_request = noRequest;
                // @ts-ignore
                approvalHeader.total_approve = SchemaApprovalMax.approval_order;
                approvalHeader.id_submitter =submitter;
                approvalHeader.approval_sequence = 0;
                approvalHeader.step = 2;
                approvalHeader.useTransaction(trx)
                await approvalHeader.save();
                approvalHeaderId = approvalHeader.id;
        
                const approvalDetail = new ApprovalDetail();
                approvalDetail.user_id =submitter;
                approvalDetail.validation = "REJECT";
                approvalDetail.header_id = approvalHeaderId;
                approvalDetail.remark = remark;
                approvalDetail.sequence = 1;
                approvalDetail.role_id = roleId;
                approvalDetail.step = 1;
                approvalDetail.useTransaction(trx)
                await approvalDetail.save();

                data = {
                    status: true,
                    isFinalApprove: true,
                    nextApproval: 0 ,
                    message: "Reject Data Completed"
                };

                return data;
                // const UpdateRequestVessel = await RequestVesselGeneralInfo.findOrFail(requestVessel?.id);
                // UpdateRequestVessel.status = "REJECT";
                // UpdateRequestVessel.useTransaction(trx)
                // await UpdateRequestVessel.save();
            }
        } catch (error) {
            data = {
                status: false,
                isFinalApprove: false,
                nextApproval: 0 ,
                message: "Reject data cannot completed"
            };

            return data;
        }
    }

    public async notifApproval(
        noRequest:string,
        submitter:string,
        remark:string,
        action:string,
        masterTypeId:string,
        schemaId:string,
        nextApprovalSequece:number,
        messageMasterType:string
    ) {
        try {
            const approvalLog = new ApprovalLog();
            approvalLog.request_no = noRequest;
            approvalLog.action = action;
            approvalLog.remark = remark ;
            approvalLog.created_by = submitter;
            await approvalLog.save();

            const nextApprovalRole = await SchemaApprovalList.query().where("schema_id", schemaId).where("approval_order", nextApprovalSequece + 1);
            let nextApprovalRoleArray: any = [];
            nextApprovalRole.forEach(function(value) {
                nextApprovalRoleArray.push(value.role_id);
            });
            const nextUserApproval = await User.query().whereIn("role_id", nextApprovalRoleArray);
            let notificationData: any = [];
            nextUserApproval.forEach(async function(value) {
                notificationData.push({
                    from: submitter,
                    to: value.id,
                    request_no: noRequest,
                    master_type_id: masterTypeId,
                    status:'APPROVED'
                });
                Ws.io.emit('receive-notif', { userId: value.id,message:`Request Approval Master Data ${messageMasterType} ` });
                // await SendMail.approve(value.id, submitter, masterType, noRequest);
            });
            await Notification.createMany(notificationData);
        } catch (error) {
            console.log(error)
        }
    }
}

export default new ApprovalStep();