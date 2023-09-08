
const jsonxml = require("jsontoxml");
const parseString = require("xml2js").parseString;
const { promisify } = require("util");

const promisfiedParseString = promisify(parseString);

class Parser {
   parseJSONBodyToXML(jsonArgument) {
    return jsonxml(jsonArgument, { html: true });
  }

   async convertXMLToJSON(xmlMessage) {
    const options = { trim: true, explicitArray: true, explicitRoot: false };
    return promisfiedParseString(xmlMessage, options);
  }
};

export default new Parser();
