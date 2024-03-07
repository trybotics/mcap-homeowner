const request = require('../middleware/validation/request');

const express = require("express");
const router = express.Router();
const homeownerController = require("../controllers/homeownerController");

// Endpoint to create a new homeowner
router.post('/', request.validateCreate, homeownerController.createHomeowner);

// Read homeowner routes
// Endpoint to search homeowners based on parameters (name and address)
router.get('/search', request.validateSearch, homeownerController.searchHomeowners);
// Endpoint to retrieve a homeowner by ID
router.get('/:id', request.validateId, homeownerController.retrieveHomeownerById);
// Endpoint to retrieve all homeowners
router.get('/', homeownerController.retrieveAllHomeowners);


// Update homeowner route
router.put("/:id", request.validateId, homeownerController.updateHomeowner);

// Delete homeowner routes
router.delete("/:id", request.validateId, homeownerController.deleteHomeownerById);
router.delete("/", request.validateDeleteIds, homeownerController.deleteHomeownersByIds);

module.exports = router;
