const { LOGIN_CLIENT_URL,CLIENT_ID,CLIENT_SECRET } = require( "../utils/constants");

 function  clientAuth(){
  return cy.request({
    url: LOGIN_CLIENT_URL,
    method: "POST",
    body:{
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    }
  }).then((response) => {
    token = response.body.accessToken;
    const Authorization = `Bearer ${token}`;
  });
};
export default clientAuth; 