# Homeowner API Microservice

This Node.js/Express.js microservice provides functionality to store, read, update, and delete homeowner information using XML documents and MongoDB. 

## Requirements

- **REQUEST Format:**
  - XML Document
  - MODIFY Resource

- **CREATE Resource:**
  - Parses XML documents to extract required information.
  - Calculates homeowner’s age from Date of Birth.
  - Retrieves geocoordinates of the home from a third-party service.
  - Stores homeowner’s information in MongoDB.

- **READ Resource:**
  - Retrieve homeowner document(s) by:
    - ID
    - Search parameters
    - All

- **Update parts of the homeowner document**

- **DELETE Resource:**
  - By ID
  - By multiple IDs

## Acceptance Criteria

- **RESTful Microservice Tech Stack:**
  - MongoDB
  - Node.js - 18.17.1
  - Express.js – 4.17.1
  - Jest – 29.7.0
  - All functionality is unit tested.

- **Appropriate HTTP Request Methods are used for each resource.**

- **Solution should not include Node modules.**

- **Solution can be built locally on any desktop.**

# Setup

## Install Dependencies

Run the following command to install the necessary npm packages:

```
npm install
```

Create or update your `.env` file inside the `mcap-homeowner` project folder with the following configuration:

```
PORT=3000
TEST_PORT=3001
DBURI=mongodb://127.0.0.1:27017/mcap-homeowner
APIKEY=4eaa53ee73d74a1aa872ec825925de80
```

## Available Scripts

In the project directory, you can use the following npm scripts:

### Start the App

To start the app, use the following command:

```
npm start
```

The API will run on [http://localhost:3000](http://localhost:3000).

### Development Mode

To run the app in development mode, execute the following command:

```
npm run start:dev
```

The API will run on [http://localhost:3000](http://localhost:3000).

### Run Tests

To run tests, use the following command:

```
npm test
```

## Demo Videos for Assignment Solution

Video showcasing our assignment solution:

- [Part 1](https://www.loom.com/share/038fd6ab836a44b584acb0d9bab81bee?sid=2ba983e5-4734-4a60-a3f6-11aa68f595dc)
- [Part 2](https://www.loom.com/share/252e3e26345a43af95644b702b88e1a1?sid=ee5da967-bdc4-4092-8f7e-24a18d2104f6)
- [Part 3](https://www.loom.com/share/5dfb7297d69548dcb51ebc28e67baa21?sid=ddf5e657-68a5-47ab-a3b6-05335beae9f9)

## Screenshot
![image](https://github.com/trybotics/mcap-homeowner/assets/22857102/9fbdaae9-0955-4e98-8d59-67523078b84d)
