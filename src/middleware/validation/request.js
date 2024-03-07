const mongoose = require('mongoose');
const libxmljs = require('libxmljs2');
var fs = require('fs');
var path = require('path');

module.exports = {
  validateId: (req, res, next) => {
    try {
      const { id } = req.params;
      // Validate if the provided ID is a valid ObjectId
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid ID format.' });
      }
      next();
    } catch (error) {
      console.warn('Validation Error: ', error);
      res.status(422).send({
        message: error.message || 'Invalid ID format.',
      });
    }
  },
  validateSearch: (req, res, next) => {
    try {
      const { name, address } = req.query;
      // Validate search parameters
      if (!name && !address) {
        return res.status(400).json({ message: 'At least one search parameter is required (name or address).' });
      }
      next();
    } catch (error) {
      console.warn('Validation Error: ', error);
      res.status(422).send({
        message: error.message || 'At least one search parameter is required (name or address).',
      });
    }
  },
  validateCreate: (req, res, next) => {
    try {
      const contentType = req.get('content-type');
      // Validate if the request body is XML
      if (!isXMLContentType(contentType)) {
        return res.status(400).json({ message: 'Invalid content type. Expected XML.' });
      }
      const xmlDoc = libxmljs.parseXmlString(req.rawBody);
      // load XML schema from file system
      var xmlSchema = loadXmlSchema('homeownerSchema.xsd');
      if (!xmlDoc.validate(xmlSchema)) {
        return res.status(400).json({ error: 'Invalid XML format.' });
      }
      next();
    } catch (error) {
      console.warn('Validation Error: ', error);
      res.status(422).send({
        message: error.message || 'Invalid content type. Expected XML.',
      });
    }
  },
  validateDeleteIds: (req, res, next) => {
    try {
      const ids = req.body?.homeowner?.ids;

      if(!ids||!ids.length){
        return res.status(400).json({ message: 'Invalid IDs format.' });
      }

      for(let index=0; index<ids.length; index++){
        // Validate if the provided ID is a valid ObjectId
        if (!mongoose.isValidObjectId(ids[index])) {
          return res.status(400).json({ message: 'Invalid ID format.' });
        }
      }
      next();
    } catch (error) {
      console.warn('Validation Error: ', error);
      res.status(422).send({
        message: error.message || 'Invalid ID format.',
      });
    }
  },
}

const isXMLContentType = (contentType) => {
  // Check if the content type indicates XML
  return contentType === 'application/xml' || contentType === 'text/xml';
};

function loadXmlSchema(filename) {
  var schemaPath = path.join(__dirname, 'xml-schema', filename);
  var xmlSchema = fs.readFileSync(schemaPath, 'utf8');
  return libxmljs.parseXmlString(xmlSchema); 
}
