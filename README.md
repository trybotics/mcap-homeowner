# Create the API microservice for the assignment using NodeJS/ExpressJS that can store, read, update, and delete homeowner information.
## Requirements: 
- REQUEST Format
  - XML Document
  - MODIFY Resource
- CREATE Resource
  - Receives an XML document and parses the information required.
  - Calculate the homeowner’s age based on the supplied Date of Birth.
  - Make a 3rd party call to retrieve the geocoordinates of the home.
  - Stores the homeowner’s information in DBNo updates are allowed when the homeowner exists. 
- READ Resource
  - Ability to retrieve homeowner document(s) by:
    - ID
    - Search parameters
    - All
- Update parts of the homeowner document
  - DELETE Resource
  - By ID
  - By multiple IDs

## Acceptance Criteria:
- RESTful microservice Tech Stack  
  - mongoDB
  - nodeJS - 18.17.1
  - expressJS – 4.17.1
  - JEST – 29.7.0
  - All Functionality is Unit tested.
- Appropriate HTTP Request Methods are used for each resource.
- Solution should not include node Modules
- Solution can be built locally on any desktop


# Setup
## Install Dependencies
Run the following command to install the necessary npm packages:
```
npm i
```

Create or update your .env file inside the **mcap-homeowner** project folder with the following configuration:
```
PORT=3000
TEST_PORT=3001
DBURI=mongodb://127.0.0.1:27017/mcap-homeowner
APIKEY=4eaa53ee73d74a1aa872ec825925de80
```

# Available Scripts
In the project directory, you can use the following npm scripts:

## Start the App
To start the app, use the following command:
```
npm start
```
The API will run on http://localhost:3000.

## Development Mode
To run the app in development mode, execute the following command:
```
npm start:dev
```
The API will run on http://localhost:3000.


## Run Tests
To run tests, use the following command:
```
npm test
```

## Demo videos for assignment solution
Video showcasing our assignment solution:
- [Part 1](https://www.loom.com/share/038fd6ab836a44b584acb0d9bab81bee?sid=2ba983e5-4734-4a60-a3f6-11aa68f595dc)
- [Part 2](https://www.loom.com/share/252e3e26345a43af95644b702b88e1a1?sid=ee5da967-bdc4-4092-8f7e-24a18d2104f6)
- [Part 3](https://www.loom.com/share/5dfb7297d69548dcb51ebc28e67baa21?sid=ddf5e657-68a5-47ab-a3b6-05335beae9f9)
