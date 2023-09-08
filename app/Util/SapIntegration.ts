import Parser from "App/Util/parser";
import Formatter from "App/Util/Formatter";
import axios from "axios";
import SapLog from "App/Models/SapLog";
import VesselGeneralInfo from "App/Models/VesselGeneralInfo";
import CustomerInfo from "App/Models/CustomerInfo";
import Env from '@ioc:Adonis/Core/Env'


class SapIntegration {
  async create(customerId) {
    const id = customerId;
    const customer = await CustomerInfo.query().where("id", `${id}`).preload("customerGroup").preload("postalCode").preload("npwp").first();
    const searchTerm = customer?.nm_perusahaan;
    const name = customer?.nm_perusahaan;
    const address = customer?.address;
    const npwp = customer?.npwp.no_npwp;
    // npwp = npwp?.replace(/[._-]/g,"");
    const url = `${Env.get('SAP_ENDPOINT')}/XISOAPAdapter/MessageServlet?senderParty=&senderService=MDM&receiverParty=&receiverService=&interface=SI_CreateBP_sync_out&interfaceNamespace=http%3A%2F%2Fmdm.pelindo.co.id%2F`;
    // const url = "http://svrldpo001.pelindo.co.id:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=MDM&receiverParty=&receiverService=&interface=SI_CreateBP_sync_out&interfaceNamespace=http%3A%2F%2Fmdm.pelindo.co.id%2F";
    let payload = {
      MODE: "1",
      PARTNERCATEGORY: customer?.customerGroup ? customer?.customerGroup?.partner_category : "",
      PARTNERGROUP: customer?.customerGroup ? customer?.customerGroup?.partner_group : "",
      PARTNERROLE: customer?.customerGroup ? customer?.customerGroup?.partner_role : "",
      SEARCHTERM1: searchTerm?.substring(0, 60),
      SEARCHTERM2: searchTerm?.substring(60, 120),
      NAME1: name?.substring(0, 60),
      NAME2: name?.substring(60, 119),
      CITY: customer?.postalCode ? customer?.postalCode.city : "",
      STR_SUPPL1: address?.substring(0, 60),
      STR_SUPPL2: address?.substring(60, 119),
      POSTL_COD1: customer?.postalCode ? customer?.postalCode.post_code : "00000",
      NPWP: npwp,
      PARTNERTYPE: customer?.customerGroup ? customer?.customerGroup?.partner_type : "",
      CONTROL_ACCOUNT: customer?.customerGroup ? customer?.customerGroup?.control_account : ""
    };
    let email = {
      FLAG : "i",
      CONSNUMBER: "",
      E_MAIL: customer?.email ? customer?.email : "",
    }

    const headers = {
      headers: {
        "Content-Type": "text/xml; charset=utf-8"
      },
      auth: {
        username: "P3_Test2",
        password: "Coron@20"
      }
    };
    let args = Formatter.createPayloads(payload,email);

    try {
      let remoteResponse = await axios.post(url, args, headers);
      const response = remoteResponse.data;
      remoteResponse = await Parser.convertXMLToJSON(response);
      const sapCode = remoteResponse["SOAP:Body"][0]["ns0:ZFMRE_INBOUND_MDM_TO_BP.Response"][0]["O_MDMRET"][0]["BUSINESSPARTNER"][0];
      // const message = remoteResponse["SOAP:Body"][0]["ns0:ZFMRE_INBOUND_MDM_TO_BP.Response"][0]["T_RETURN"][0]["item"][0]["MESSAGE"][0];
      // console.log(response)
      const sapLog = new SapLog();
      sapLog.id_basic_info = id;
      sapLog.request_payload = args;
      sapLog.response = response;
      await sapLog.save();
  
      //SAP CODE INSERT
      const updateSapCode = await CustomerInfo.findBy("id",id);
      updateSapCode.sap_code = sapCode;
      await updateSapCode.save();
      return true;
      
    } catch (error) {
      // const sapLog = new SapLog();
      // sapLog.id_basic_info = id;
      // sapLog.request_payload = args;
      // sapLog.response = error;
      // await sapLog.save();
      return true
    }
  }

  async update(customerId) {
    const id = customerId;
    const customer = await CustomerInfo.query().where("id", `${id}`).preload("customerGroup").preload("postalCode").preload("npwp").first();
    const searchTerm = customer?.nm_perusahaan;
    const name = customer?.nm_perusahaan;
    const address = customer?.address;
    const npwp = customer?.npwp.no_npwp;
    // npwp = npwp?.replace(/[._-]/g,"");
    const url = `${Env.get('SAP_ENDPOINT')}/XISOAPAdapter/MessageServlet?senderParty=&senderService=MDM&receiverParty=&receiverService=&interface=SI_CreateBP_sync_out&interfaceNamespace=http%3A%2F%2Fmdm.pelindo.co.id%2F`;
    // const url = "http://svrldpo001.pelindo.co.id:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=MDM&receiverParty=&receiverService=&interface=SI_CreateBP_sync_out&interfaceNamespace=http%3A%2F%2Fmdm.pelindo.co.id%2F";
    let payload = {
      MODE: "2",
      BUSINESSPARTNER:customer?.sap_code,
      PARTNERCATEGORY: customer?.customerGroup ? customer?.customerGroup?.partner_category : "",
      PARTNERGROUP: customer?.customerGroup ? customer?.customerGroup?.partner_group : "",
      PARTNERROLE: customer?.customerGroup ? customer?.customerGroup?.partner_role : "",
      SEARCHTERM1: searchTerm?.substring(0, 60),
      SEARCHTERM2: searchTerm?.substring(60, 120),
      NAME1: name?.substring(0, 60),
      NAME2: name?.substring(60, 119),
      CITY: customer?.postalCode ? customer?.postalCode.city : "",
      STR_SUPPL1: address?.substring(0, 60),
      STR_SUPPL2: address?.substring(60, 119),
      POSTL_COD1: customer?.postalCode ? customer?.postalCode.post_code : "00000",
      NPWP: npwp,
      PARTNERTYPE: customer?.customerGroup ? customer?.customerGroup?.partner_type : "",
      CONTROL_ACCOUNT: customer?.customerGroup ? customer?.customerGroup?.control_account : ""
    };

    let email = {
      FLAG : "u",
      CONSNUMBER: "",
      E_MAIL: customer?.email ? customer?.email : "",
    }

    const headers = {
      headers: {
        "Content-Type": "text/xml; charset=utf-8"
      },
      auth: {
        username: "P3_Test2",
        password: "Coron@20"
      }
    };
    let args = Formatter.createPayloads(payload,email);

    try {
      let remoteResponse = await axios.post(url, args, headers);
      const response = remoteResponse.data;
      remoteResponse = await Parser.convertXMLToJSON(response);
      const sapCode = remoteResponse["SOAP:Body"][0]["ns0:ZFMRE_INBOUND_MDM_TO_BP.Response"][0]["O_MDMRET"][0]["BUSINESSPARTNER"][0];
      const message = remoteResponse["SOAP:Body"][0]["ns0:ZFMRE_INBOUND_MDM_TO_BP.Response"][0]["T_RETURN"][0]["item"][0]["MESSAGE"][0];
      console.log(message)
      const sapLog = new SapLog();
      sapLog.id_basic_info = id;
      sapLog.request_payload = args;
      sapLog.response = response;
      await sapLog.save();
      
      //SAP CODE INSERT
      // const updateSapCode = await CustomerInfo.find(id);
      // updateSapCode.sap_code = sapCode;
      // await updateSapCode.save();
      return true;
    } catch (error) {
      // const sapLog = new SapLog();
      // sapLog.id_basic_info = id;
      // sapLog.request_payload = args;
      // sapLog.response = error;
      // await sapLog.save();
      return true
    }

  }


  async createKapal(vesselId){
    const id = vesselId;
    const vessel = await VesselGeneralInfo.query().where("id",id).first();
    const kdKapal = vessel?.kd_kapal
    const nmKapal = vessel?.kd_nm_kapal+". "+vessel?.nm_kapal
    
    // const url = "http://svrldpo001.pelindo.co.id:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=TOS&receiverParty=&receiverService=&interface=SI_INBOUND_CO_CHARAC_VALUE&interfaceNamespace=http://tos.pelindo.co.id/";
    const url = `${Env.get('SAP_ENDPOINT')}/XISOAPAdapter/MessageServlet?senderParty=&senderService=TOS&receiverParty=&receiverService=&interface=SI_INBOUND_CO_CHARAC_VALUE&interfaceNamespace=http://tos.pelindo.co.id/`;
    const payload = {
      VALUE: kdKapal,
      NAME: nmKapal,
    };
    
    const headers = {
      headers: {
        "Content-Type": "text/xml; charset=utf-8"
      },
      auth: {
        username: "P3_Test2",
        password: "Coron@20"
      }
    };
    let args = Formatter.createPayloadKapal(payload);
    try {
      let remoteResponse = await axios.post(url,args,headers);
      const response = remoteResponse.data;
      remoteResponse = await Parser.convertXMLToJSON(response);
      const sapCode = remoteResponse["SOAP:Body"][0]["ns0:ZFMFI_INBOUND_CO_CHARAC_VALUE.Response"][0]["T_VALUE"][0]["item"];
      const sapLog = new SapLog();
      sapLog.vessel_id = id;
      sapLog.request_payload = args;
      sapLog.response = response;
      await sapLog.save();
      return true;
      
    } catch (error) {
      const sapLog = new SapLog();
      sapLog.vessel_id = id;
      sapLog.request_payload = args;
      sapLog.response = error.message;
      await sapLog.save();
      return false;
    }
  }
};

export default new SapIntegration();
