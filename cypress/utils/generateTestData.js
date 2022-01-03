const faker = require("faker");

module.exports = {
  generateFirstName: () => faker.name.firstName(),
  generateLastName: () => faker.name.lastName(),
  generateEmail: () => faker.internet.email(),
  generateEnabled: () => faker.random.boolean([true, false]),
  generateGroups:()=> faker.random.arrayElement(['BACKOFFICE','CREATOR'])
};
