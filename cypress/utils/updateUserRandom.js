const {
    generateFirstName,
    generateLastName,
    generateEmail,
    generateEnabled,
    generateGroups,
  } = require("./generateTestData");
  
  export const generateUpdateUser = () => {
    return {
      firstName: generateFirstName(),
      lastName: generateLastName(),
      email: generateEmail(),
      enabled: generateEnabled(),
      groups: [generateGroups()]
    };
  };
  