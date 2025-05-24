// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contacts API',
    description: 'API for managing contacts information'
  },
  host: 'localhost:3000',
  schemes: ['http', 'https'],
  tags: [
    {
      name: 'Contacts',
      description: 'Endpoints for managing contacts'
    }
  ],
  definitions: {
    Contact: {
      firstName: 'Racheal',
      lastName: 'Katono',
      email: 'rafaelktn29@gmail.com',
      favoriteColor: 'Black',
      birthday: '1997-09-02'
    },
    ContactInput: {
      $firstName: 'Tom',
      $lastName: 'Seguja',
      $email: 'tomseguja@gmail.com',
      $favoriteColor: 'Green',
      $birthday: '1965-06-15'
    },
    ContactResponse: {
      _id: '682e23e8cc8f14903304a546',
      firstName: 'Joan',
      lastName: 'Nakibuule',
      email: 'joanruth@gmail.com',
      favoriteColor: 'White',
      birthday: '1970-03-22'
    },
    NewContactResponse: {
      id: '682e23e8cc8f14903304a544',
      message: 'Contact created successfully'
    },
    Error: {
      error: 'Error message',
      message: 'Detailed error information'
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js']; // Add more route files here if needed

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
