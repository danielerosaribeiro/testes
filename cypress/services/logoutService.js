const { USER_PASSWORD, CLIENT_ID, LOGIN_USER_URL} = require("../utils/constants");


function logoutUser(CLIENT_ID, ) {
    return cy.request({
    url: LOGIN_USER_URL,
    method: "POST",
    body: {
      clientId: CLIENT_ID,
      refreshToken: authInfo.refreshToken
    },
  })
};
export default logoutUser;