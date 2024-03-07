const { differenceInYears } = require("date-fns");
const axios = require("axios");
const Homeowner = require("../models/homeownerModel");

const calculateAge = (dateOfBirth) => {
  const today = new Date();
  return differenceInYears(today, new Date(dateOfBirth));
};

const retrieveGeocoordinates = async (address) => {
  try {
    // Make a third-party call to retrieve geocoordinates using axios
    const response = await axios.get("https://api.geoapify.com/v1/geocode/search", {
      params: {
        text: address,
        apiKey: process.env.APIKEY
        // Add any other required parameters for the geocoding API
      },
    });

    // Extract and return geocoordinates from the API response
    return response?.data?.features[0]?.geometry?.coordinates;
  } catch (error) {
    console.error("Error retrieving geocoordinates:", error);
    throw error;
  }
};

const retrieveHomeownerById = async (req, res) => {
  const { id } = req.params;

  try {
    // Retrieve homeowner by ID from the database
    const homeowner = await Homeowner.findById(id);

    if (!homeowner) {
      return res.status(404).json({ message: "Homeowner not found." });
    }

    return res.status(200).json(homeowner);
  } catch (error) {
    console.error("Error retrieving homeowner by ID:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchHomeowners = async (req, res) => {
  const { name, address } = req.query;

  try {
    // Build search criteria based on provided parameters
    const searchCriteria = {};
    if (name) {
      searchCriteria.name = { $regex: new RegExp(name, "i") };
    }
    if (address) {
      searchCriteria.address = { $regex: new RegExp(address, "i") };
    }

    // Retrieve homeowners based on search criteria from the database
    const homeowners = await Homeowner.find(searchCriteria);

    return res.status(200).json(homeowners);
  } catch (error) {
    console.error("Error searching homeowners:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const retrieveAllHomeowners = async (req, res) => {
  try {
    // Retrieve all homeowners from the database
    const homeowners = await Homeowner.find();

    return res.status(200).json(homeowners);
  } catch (error) {
    console.error("Error retrieving all homeowners:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const createHomeowner = async (req, res) => {
  try {
    const xmlData = req.body; // Assuming XML data is in the request body
    // Validate parameters
    if (!xmlData?.homeowner) {
      return res.status(400).json({ message: 'homeowner data is required.' });
    }
    const { name, dateofbirth, address } = xmlData?.homeowner;
    const homeOwner = {
      name: name[0], dateOfBirth: dateofbirth[0], address: address[0]
    }
    // Validate parameters
    if (!homeOwner.name || !homeOwner.dateOfBirth || !homeOwner.address ) {
      return res.status(400).json({ message: 'name, dateOfBirth and address parameter is required.' });
    }

    // Calculate age from Date of Birth
    const age = calculateAge(homeOwner.dateOfBirth);

    // Make a third-party call to retrieve geocoordinates
    const geocoordinates = await retrieveGeocoordinates(homeOwner.address);
    if (!geocoordinates) {
      return res.status(422).json({ message: "Unable to get geocoordinates." });
    }
    
    const homeownerData = {
      name: homeOwner.name,
      dateOfBirth: homeOwner.dateOfBirth,
      age,
      address: homeOwner.address,
      geocoordinates,
    };

    // Check if homeowner already exists
    const existingHomeowner = await Homeowner.findOne({
      name: homeownerData.name,
    });
    if (existingHomeowner) {
      return res.status(409).json({ message: "Homeowner already exists.", data: existingHomeowner });
    }

    // Save homeowner information to the database
    const newHomeowner = new Homeowner(homeownerData);
    const createdHomeowner = await newHomeowner.save();

    return res.status(201).json({ message: "Homeowner created successfully.", data: createdHomeowner });
  } catch (error) {
    console.error("Error creating homeowner:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateHomeowner = async (req, res) => {
  const { id } = req.params;

  try {
    const xmlData = req.body; // Assuming XML data is in the request body
    // Validate parameters
    if (!xmlData?.homeowner) {
      return res.status(400).json({ message: 'homeowner data is required.' });
    }
    const { name, dateofbirth, address } = xmlData?.homeowner;
    const homeOwner = {
      name: name&&name[0], dateOfBirth: dateofbirth&&dateofbirth[0], address: address&&address[0]
    }
    // Validate search parameters
    if (!homeOwner.name && !homeOwner.dateOfBirth && !homeOwner.address ) {
      return res.status(400).json({ message: 'name or dateOfBirth or address parameter is required.' });
    }

    const updatedHomeownerData = {}

    if(homeOwner.name){
      updatedHomeownerData.name = homeOwner.name;
    }

    if(homeOwner.dateOfBirth){
      updatedHomeownerData.dateOfBirth = homeOwner.dateOfBirth;
      // Calculate age from Date of Birth
      updatedHomeownerData.age = calculateAge(homeOwner.dateOfBirth);
    }

    if(homeOwner.address){
      updatedHomeownerData.address = homeOwner.address;
      // Make a third-party call to retrieve geocoordinates
      updatedHomeownerData.geocoordinates = await retrieveGeocoordinates(homeOwner.address);
    }

    // Update homeowner information in the database
    const updatedHomeowner = await Homeowner.findByIdAndUpdate(
      id,
      updatedHomeownerData,
      { new: true }
    );

    if (!updatedHomeowner) {
      return res.status(404).json({ message: "Homeowner not found." });
    }

    return res.status(200).json({ message: "Homeowner updated successfully." , data: updatedHomeowner});
  } catch (error) {
    console.error("Error updating homeowner:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteHomeownerById = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete homeowner by ID from the database
    const deletedHomeowner = await Homeowner.findByIdAndDelete(id);

    if (!deletedHomeowner) {
      return res.status(404).json({ message: "Homeowner not found." });
    }

    return res.status(200).json({ message: "Homeowner deleted successfully." });
  } catch (error) {
    console.error("Error deleting homeowner by ID:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteHomeownersByIds = async (req, res) => {
  const { ids } = req.body.homeowner;

  try {
    // Delete homeowners by multiple IDs from the database
    const deletedHomeowners = await Homeowner.deleteMany({ _id: { $in: ids } });

    if (!deletedHomeowners.deletedCount) {
      return res
        .status(404)
        .json({ message: "No homeowners found for the provided IDs." });
    } else if(deletedHomeowners.deletedCount != ids.length) {
      return res
      .status(200)
      .json({ message: "Homeowners deleted successfully. But some provided IDs for homeowners not found" });
    }

    return res
      .status(200)
      .json({ message: "Homeowners deleted successfully." });
  } catch (error) {
    console.error("Error deleting homeowners by IDs:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createHomeowner,
  retrieveHomeownerById,
  searchHomeowners,
  retrieveAllHomeowners,
  updateHomeowner,
  deleteHomeownerById,
  deleteHomeownersByIds,
};
