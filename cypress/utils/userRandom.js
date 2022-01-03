const {
  generateFirstName,
  generateLastName,
  generateEmail,
  generateEnabled,
  generateGroups,
} = require("./generateTestData");

export const generateUser = () => {
  return {
    firstName: generateFirstName(),
    lastName: generateLastName(),
    email: generateEmail(),
    enabled: generateEnabled(),
    password: "password123",
    groups: [generateGroups()],
    type: generateGroups()
  };
};
