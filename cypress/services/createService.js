const { generateUser } = require( "../utils/userRandom");

const { CREATE_USER_URL,LOGIN_CLIENT_URL } = require("../utils/constants");
/* const { clientAuth }  = require("../../../services/authenticationServiceClient"); */


function userCreate() {
/*   clientAuth().then((response) => {
    token = response.body.accessToken;
    const Authorization = `Bearer ${token}`;}); */

    return requestUserCreate = cy.request({
        method: "POST",
        body: generateUser(),
        url: CREATE_USER_URL,
        headers: {
          AuthorizationClient,
        },
  })
};
export default userCreate;