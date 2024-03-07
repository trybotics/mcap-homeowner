// tests/homeownerController.test.js
const mongoose = require("mongoose");
const request = require("supertest");
const axios = require("axios");
const app = require("../src/app");
const Homeowner = require("../src/models/homeownerModel");

jest.mock("axios");

const mockData = {
  data: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          datasource: {
            sourcename: "openstreetmap",
            attribution: "© OpenStreetMap contributors",
            license: "Open Database License",
            url: "https://www.openstreetmap.org/copyright",
          },
          country: "France",
          country_code: "fr",
          region: "Metropolitan France",
          state: "Auvergne-Rhône-Alpes",
          state_district: "Rhône",
          county: "Métropole de Lyon",
          city: "Lyon",
          municipality: "Lyon",
          postcode: "69002",
          suburb: "Cordeliers",
          street: "Rue Grenette",
          housenumber: "11",
          lon: 4.8338857,
          lat: 45.7634024,
          state_code: "ARA",
          state_COG: "84",
          result_type: "building",
          formatted: "11 Rue Grenette, 69002 Lyon, France",
          address_line1: "11 Rue Grenette",
          address_line2: "69002 Lyon, France",
          department_COG: "69",
          timezone: {
            name: "Europe/Paris",
            offset_STD: "+01:00",
            offset_STD_seconds: 3600,
            offset_DST: "+02:00",
            offset_DST_seconds: 7200,
            abbreviation_STD: "CET",
            abbreviation_DST: "CEST",
          },
          plus_code: "8FQ6QR7M+9H",
          plus_code_short: "7M+9H Lyon, Métropole de Lyon, France",
          rank: {
            importance: 0.31001,
            popularity: 8.995467104553104,
            confidence: 1,
            confidence_city_level: 1,
            confidence_street_level: 1,
            match_type: "full_match",
          },
          place_id:
            "5184680822e6551340590dd87a2bb7e14640f00103f9017672bf6f00000000c00203",
        },
        geometry: { type: "Point", coordinates: [4.8338857, 45.7634024] },
        bbox: [4.8338357, 45.7633524, 4.8339357, 45.7634524],
      },
    ],
    query: {
      text: "11 Rue Grenette, 69002 Lyon, France",
      parsed: {
        housenumber: "11",
        street: "rue grenette",
        postcode: "69002",
        city: "lyon",
        country: "france",
        expected_type: "building",
      },
    },
  },
};

// Mock the axios get request for geocoordinates
axios.get.mockResolvedValue(mockData);

// Function to create XML data for homeowner
const createXmlData = (name, dateOfBirth, address) => `
  <homeowner>
    <name>${name}</name>
    <dateOfBirth>${dateOfBirth}</dateOfBirth>
    <address>${address}</address>
  </homeowner>
`;

describe("Homeowner Controller", () => {
  beforeEach(async () => {
    // Clear the database before each test
    await Homeowner.deleteMany();
  });

  describe("GET /homeowners/:id", () => {
    it("should retrieve homeowner by ID", async () => {
      const homeownerData = `
        <homeowner>
          <name>John Doe</name>
          <dateofbirth>1990-01-01</dateofbirth>
          <address>123 11 Rue Grenette, 69002 Lyon, France</address>
        </homeowner>`;

      const createdHomeowner = await request(app)
        .post("/homeowners")
        .set("Content-Type", "application/xml") // Set Content-Type to XML
        .send(homeownerData);

      const response = await request(app).get(
        `/homeowners/${createdHomeowner.body.data._id}`
      );

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(createdHomeowner.body.data.name);
      expect(response.body.dateOfBirth).toBe(
        createdHomeowner.body.data.dateOfBirth
      );
      expect(response.body.address).toBe(createdHomeowner.body.data.address);
    });

    it("should return 404 if trying to retrieve non-existent homeowner by ID", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app).get(`/homeowners/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Homeowner not found.");
    });

    it("should return 500 if internal server error occurs during retrieval by ID", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      // Mock the Homeowner model to force an error during retrieval by ID
      jest
        .spyOn(Homeowner, "findById")
        .mockRejectedValueOnce(new Error("Mocked error"));

      const response = await request(app).get("/homeowners/" + nonExistentId);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Internal Server Error");
    });
  });

  it("should retrieve all homeowners", async () => {
    const homeownerData1 = `
        <homeowner>
          <name>John Doe 1</name>
          <dateofbirth>1990-01-01</dateofbirth>
          <address>123 11 Rue Grenette, 69002 Lyon, France</address>
        </homeowner>`;

    const homeownerData2 = `
        <homeowner>
          <name>John Doe 2</name>
          <dateofbirth>1990-01-02</dateofbirth>
          <address>456 Main St</address>
        </homeowner>`;

    await request(app)
      .post("/homeowners")
      .set("Content-Type", "application/xml") // Set Content-Type to XML
      .send(homeownerData1);

    await request(app)
      .post("/homeowners")
      .set("Content-Type", "application/xml") // Set Content-Type to XML
      .send(homeownerData2);

    const response = await request(app).get("/homeowners");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it("should search homeowners by name and address", async () => {
    const homeownerData1 = `
        <homeowner>
          <name>John Doe 1</name>
          <dateofbirth>1990-01-01</dateofbirth>
          <address>123 11 Rue Grenette, 69002 Lyon, France</address>
        </homeowner>`;

    const homeownerData2 = `
        <homeowner>
          <name>John Doe 2</name>
          <dateofbirth>1990-01-02</dateofbirth>
          <address>456 Main St</address>
        </homeowner>`;

    const createdHomeowner1 = await request(app)
      .post("/homeowners")
      .set("Content-Type", "application/xml") // Set Content-Type to XML
      .send(homeownerData1);

    const createdHomeowner2 = await request(app)
      .post("/homeowners")
      .set("Content-Type", "application/xml") // Set Content-Type to XML
      .send(homeownerData2);

    const response = await request(app)
      .get("/homeowners/search")
      .query({ name: "John", address: "Main" });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe(createdHomeowner2._body.data.name);
    expect(response.body[0].address).toBe(createdHomeowner2._body.data.address);
    expect(response.body[0].name).not.toBe(createdHomeowner1._body.data.name);
    expect(response.body[0].address).not.toBe(
      createdHomeowner1._body.data.address
    );
  });

  it("should return 500 if internal server error occurs during search", async () => {
    // Mock an internal server error by modifying the search function
    jest
      .spyOn(Homeowner, "find")
      .mockRejectedValue(new Error("Internal Server Error"));

    const response = await request(app)
      .get("/homeowners")
      .query({ name: "John" });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal Server Error");
  });

  it("should return 500 if internal server error occurs during retrieval of all homeowners", async () => {
    // Mock an internal server error by modifying the find function
    jest
      .spyOn(Homeowner, "find")
      .mockRejectedValue(new Error("Internal Server Error"));

    const response = await request(app).get("/homeowners");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal Server Error");
  });

  describe("POST /homeowners", () => {
    it("should create homeowner with XML data", async () => {
      const homeownerData = `
        <homeowner>
          <name>John Doe</name>
          <dateofbirth>1990-01-01</dateofbirth>
          <address>123 11 Rue Grenette, 69002 Lyon, France</address>
        </homeowner>`;

      const createdHomeowner = await request(app)
        .post("/homeowners")
        .set("Content-Type", "application/xml") // Set Content-Type to XML
        .send(homeownerData);

      expect(createdHomeowner.status).toBe(201);
      expect(createdHomeowner.body.message).toBe(
        "Homeowner created successfully."
      );
    });

    it("should return 400 if XML format is Invalid", async () => {
      const homeownerData = `
        <homeowner>
          <name>John Doe</name>
          <dateofbirth>1990-01-01</dateofbirth>
        </homeowner>`;

      const createdHomeowner = await request(app)
        .post("/homeowners")
        .set("Content-Type", "application/xml") // Set Content-Type to XML
        .send(homeownerData);

      expect(createdHomeowner.status).toBe(400);
      expect(createdHomeowner.body.error).toBe("Invalid XML format.");
    });
  });

  describe("PUT /homeowners/:id", () => {
    // Existing tests for creating homeowners
    // ...

    it("should update homeowner by ID", async () => {
      const homeownerData = `
        <homeowner>
          <name>John Doe</name>
          <dateofbirth>1990-01-01</dateofbirth>
          <address>123 11 Rue Grenette, 69002 Lyon, France</address>
        </homeowner>`;

      const createdHomeowner = await request(app)
        .post("/homeowners")
        .set("Content-Type", "application/xml") // Set Content-Type to XML
        .send(homeownerData);

      const updatedHomeownerData = `
        <homeowner>
          <name>John Doe Updated</name>
          <dateofbirth>1991-02-02</dateofbirth>
          <address>456 Updated St</address>
        </homeowner>`;

      const response = await request(app)
        .put(`/homeowners/${createdHomeowner.body.data._id}`)
        .set("Content-Type", "application/xml") // Set Content-Type to XML
        .send(updatedHomeownerData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Homeowner updated successfully.");

      const updatedHomeowner = await Homeowner.findById(
        createdHomeowner.body.data._id
      );
      expect(updatedHomeowner.name).toBe("John Doe Updated");
      expect(updatedHomeowner.dateOfBirth.toISOString()).toBe(
        new Date("1991-02-02").toISOString()
      );
      expect(updatedHomeowner.address).toBe("456 Updated St");
    });

    it("should return 404 if trying to update non-existent homeowner", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const updatedHomeownerData = `
        <homeowner>
          <name>John Doe Updated</name>
          <dateofbirth>1991-02-02</dateofbirth>
          <address>456 Updated St</address>
        </homeowner>`;

      const response = await request(app)
        .put(`/homeowners/${nonExistentId}`)
        .set("Content-Type", "application/xml") // Set Content-Type to XML
        .send(updatedHomeownerData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Homeowner not found.");
    });
  });

  describe("DELETE /homeowners/:id", () => {
    // Existing tests for deleting homeowners by ID
    // ...

    it("should delete homeowner by ID", async () => {
      const homeownerData = `
        <homeowner>
          <name>John Doe</name>
          <dateofbirth>1990-01-01</dateofbirth>
          <address>123 11 Rue Grenette, 69002 Lyon, France</address>
        </homeowner>`;

      const createdHomeowner = await request(app)
        .post("/homeowners")
        .set("Content-Type", "application/xml") // Set Content-Type to XML
        .send(homeownerData);

      const response = await request(app).delete(
        `/homeowners/${createdHomeowner.body.data._id}`
      );

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Homeowner deleted successfully.");

      const deletedHomeowner = await Homeowner.findById(
        createdHomeowner.body.data._id
      );
      expect(deletedHomeowner).toBeNull();
    });

    it("should return 404 if trying to delete non-existent homeowner by ID", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app).delete(
        `/homeowners/${nonExistentId}`
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Homeowner not found.");
    });
  });

  describe("DELETE /homeowners", () => {
    it("should delete homeowners by multiple IDs", async () => {
      const homeownerData1 = `
        <homeowner>
          <name>John Doe 1</name>
          <dateofbirth>1990-01-01</dateofbirth>
          <address>123 11 Rue Grenette, 69002 Lyon, France</address>
        </homeowner>`;

      const homeownerData2 = `
        <homeowner>
          <name>John Doe 2</name>
          <dateofbirth>1990-01-02</dateofbirth>
          <address>456 Main St</address>
        </homeowner>`;

      const createdHomeowner1 = await request(app)
        .post("/homeowners")
        .set("Content-Type", "application/xml") // Set Content-Type to XML
        .send(homeownerData1);

      const createdHomeowner2 = await request(app)
        .post("/homeowners")
        .set("Content-Type", "application/xml") // Set Content-Type to XML
        .send(homeownerData2);

      const response = await request(app)
        .delete("/homeowners")
        .set("Content-Type", "application/xml") // Set Content-Type to XML
        .send(
          `<homeowner><ids>${createdHomeowner1.body.data._id}</ids><ids>${createdHomeowner2.body.data._id}</ids></homeowner>`
        );

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Homeowners deleted successfully.");

      const deletedHomeowner1 = await Homeowner.findById(
        createdHomeowner1.body.data._id
      );
      const deletedHomeowner2 = await Homeowner.findById(
        createdHomeowner2.body.data._id
      );

      expect(deletedHomeowner1).toBeNull();
      expect(deletedHomeowner2).toBeNull();
    });

    it("should return 404 if trying to delete homeowners by non-existent IDs", async () => {
      const nonExistentIds = [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      ];

      const response = await request(app)
        .delete("/homeowners")
        .set("Content-Type", "application/xml") // Set Content-Type to XML
        .send(
          `<homeowner><ids>${nonExistentIds.join(
            "</ids><ids>"
          )}</ids></homeowner>`
        );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(
        "No homeowners found for the provided IDs."
      );
    });
  });
});
