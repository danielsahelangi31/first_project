import parser from "App/Util/parser";

class MdmPegawaiFormatter {
    createPayloads(body) {
        body = parser.parseJSONBodyToXML(body);

        return `<?xml version="1.0" encoding="utf-16"?>
        <ZHCMST0003 xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        ${body}
        </ZHCMST0003>`;
    }
}

export default new MdmPegawaiFormatter();