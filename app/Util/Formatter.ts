import Parser from "App/Util/parser";

class Formatter {
  createPayloads(jsonArguments,jsonArguments2) {
     let soapBody = Parser.parseJSONBodyToXML(jsonArguments);
     let soapEmail= Parser.parseJSONBodyToXML(jsonArguments2);
    return `
     <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZFMRE_INBOUND_MDM_TO_BP>
         <!--You may enter the following 5 items in any order-->
         <I_HEADER>
            ${soapBody}
            <REGION></REGION>
            <COUNTRY>ID</COUNTRY>
            <TIME_ZONE>UTC+7</TIME_ZONE>
            <LANGU>EN</LANGU>
            <PMNTTRMS>Z010</PMNTTRMS>
            <COMP_CODE>1000</COMP_CODE>
            <!--Optional:-->
            <STREET></STREET>
            <NIK></NIK>
            <!--Optional:-->
            <IS_SUBSIDIARY_OF></IS_SUBSIDIARY_OF>
            <!--Optional:-->
            <TRADING_PARTNER></TRADING_PARTNER>
            <!--Optional:-->
            <PARTNEREXTERNAL></PARTNEREXTERNAL>
            <!--Optional:-->
            <PAY_METHOD></PAY_METHOD>
         </I_HEADER>
         <!--Optional:-->
         <T_EMAIL>
            <!--Zero or more repetitions:-->
            <item>
               ${soapEmail}
            </item>
         </T_EMAIL>
         <!--Optional:-->
         <T_FAXDATA>
            <!--Zero or more repetitions:-->
            <item>
               <!--Optional:-->
               <FLAG></FLAG>
               <!--Optional:-->
               <CONSNUMBER></CONSNUMBER>
               <!--Optional:-->
               <FAX></FAX>
            </item>
         </T_FAXDATA>
         <!--Optional:-->
         <T_RETURN>
            <!--Zero or more repetitions:-->
            <item>
               <!--Optional:-->
               <TYPE></TYPE>
               <!--Optional:-->
               <ID></ID>
               <!--Optional:-->
               <NUMBER></NUMBER>
               <!--Optional:-->
               <MESSAGE></MESSAGE>
               <!--Optional:-->
               <LOG_NO></LOG_NO>
               <!--Optional:-->
               <LOG_MSG_NO></LOG_MSG_NO>
               <!--Optional:-->
               <MESSAGE_V1></MESSAGE_V1>
               <!--Optional:-->
               <MESSAGE_V2></MESSAGE_V2>
               <!--Optional:-->
               <MESSAGE_V3></MESSAGE_V3>
               <!--Optional:-->
               <MESSAGE_V4></MESSAGE_V4>
               <!--Optional:-->
               <PARAMETER></PARAMETER>
               <!--Optional:-->
               <ROW></ROW>
               <!--Optional:-->
               <FIELD></FIELD>
               <!--Optional:-->
               <SYSTEM></SYSTEM>
            </item>
         </T_RETURN>
         <!--Optional:-->
         <T_TELEFONDATA>
            <!--Zero or more repetitions:-->
            <item>
               <!--Optional:-->
               <FLAG></FLAG>
               <!--Optional:-->
               <CONSNUMBER></CONSNUMBER>
               <!--Optional:-->
               <COUNTRY></COUNTRY>
               <!--Optional:-->
               <TELEPHONE></TELEPHONE>
               <!--Optional:-->
               <STD_RECIP></STD_RECIP>
            </item>
         </T_TELEFONDATA>
      </urn:ZFMRE_INBOUND_MDM_TO_BP>
   </soapenv:Body>
</soapenv:Envelope>
     `;
  }

  createPayloadKapal(jsonArguments){
   let soapBody = Parser.parseJSONBodyToXML(jsonArguments);
   return `
   <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
      <soapenv:Body>
         <urn:ZFMFI_INBOUND_CO_CHARAC_VALUE>
            <!--You may enter the following 2 items in any order-->
            <I_FIELD_NAME>WW003</I_FIELD_NAME>
            <T_VALUE>
               <!--Zero or more repetitions:-->
               <item>
                  ${soapBody}
               </item>
            </T_VALUE>
         </urn:ZFMFI_INBOUND_CO_CHARAC_VALUE>
      </soapenv:Body>
   </soapenv:Envelope>
   `
  }
};

export default new Formatter();
