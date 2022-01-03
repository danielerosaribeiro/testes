const { USER_PASSWORD, CLIENT_ID, LOGIN_USER_URL} = require("../utils/constants");


function userDelete(email, password = USER_PASSWORD) {
    return cy.request({
    url: LOGIN_USER_URL,
    method: "POST",
    body: {
      email: email,
      password: password,
      clientId: CLIENT_ID,
    },
  })
};
export default userAuth;