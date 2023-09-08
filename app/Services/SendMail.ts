import Mail from "@ioc:Adonis/Addons/Mail";
import User from "App/Models/User";
import MasterType from "App/Models/MasterType";
import Application from "@ioc:Adonis/Core/Application";

class SendMail {
  async approve(to, submitter, masterTypeId, noRequest) {
    try {
      const toUser = await User.query().where("id", to).first();
      const submitterData = await User.query().where("id", submitter).first();
      const masterTypeData = await MasterType.query().where("id", masterTypeId).first();
      console.log(toUser.email_notif);
      const mailData={
        noRequest:noRequest,
        name:toUser.name,
        masterData:masterTypeData.master_name,
        submitter:submitterData.name,
        submit_date:new Date()

      }
      const emailFrom = "mdm.system@pelindo.co.id";
      await Mail.sendLater((message) => {
        message
          .from(emailFrom)
          .to(toUser?.email_notif)
          .subject("Notifikasi MDM")
          .htmlView("emails/approval", { data: mailData });
      });
    } catch (error) {
      return error;
    }
  }

  async reject(to, approver, masterTypeId, noRequest) {
    try {
      const toUser = await User.query().where("id", to).first();
      const approverData = await User.query().where("id", approver).first();
      const masterTypeData = await MasterType.query().where("id", masterTypeId).first();
      console.log(toUser.email_notif);
      const mailData={
        noRequest:noRequest,
        name:toUser.name,
        masterData:masterTypeData.master_name,
        approver:approverData.name,
        submit_date:new Date()

      }
      const emailFrom = "mdm.system@pelindo.co.id";
      await Mail.sendLater((message) => {
        message
          .from(emailFrom)
          .to(toUser.email_notif)
          .subject("Notifikasi MDM")
          .htmlView("emails/reject", { data: mailData });
      });
    } catch (error) {
      return error;
    }
  }

  async sendMailApiRequest(to:any, subject:any, text:any) {
    try {
      const emailFrom = "mdm.system@pelindo.co.id";
      await Mail.send((message) => {
        message
          .from(emailFrom)
          .to(to)
          .subject(subject)
          .htmlView("emails/notifications", { data: text });

        if (text.status === true) {
          message
            .attach(
              Application.publicPath("media/mail-attachments/document-PIA.pdf"),
              {
                filename: "Document-PIA.pdf",
                contentDisposition: "attachment"
              }
            );
        }
      });
    } catch (error) {
      return error;
    }
  }
};

export default new SendMail();
