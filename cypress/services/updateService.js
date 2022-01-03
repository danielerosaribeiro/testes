import { generateUser } from "../utils/userRandom";

const { CREATE_USER_URL } = require("../utils/constants");

function userCreate() {
    return cy.request({
        method: "POST",
        body: generateUser(),
        url: CREATE_USER_URL,
        headers: {
          Authorization,
        },
  })
};
export default userCreate;