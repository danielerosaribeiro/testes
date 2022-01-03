const { request } = require("http");
const { API_ITEZSERVICES_URL } = require("../../../utils/constants");
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("../../../utils/errorCodes");
const {
  loginAuthenticationClient,
} = require("../../../utils/loginAuthentication");
const {
  loginAuthenticationUser,
} = require("../../../utils/loginAuthentication");
const { generateUser } = require("../../../utils/userRandom");
const {
  generateFirstName,
  generateLastName,
  generateEmail,
} = require("../../../utils/generateTestData");
const { TIMEOUT } = require("dns");

const CREATE_USER_URL = API_ITEZSERVICES_URL + "/users";
const LOGIN_USER_URL = API_ITEZSERVICES_URL + "/auth/users/login";
const LOGIN_CLIENT_URL = API_ITEZSERVICES_URL + "/auth/clients/login";

let requestLoginClient;
let requestLoginUser;
let requestCreateUser;
let token;
let ID_USER;

describe("Authentication User API", () => {
  beforeEach(() => {
    requestLoginClient = loginAuthenticationClient();
    requestLoginUser = loginAuthenticationUser();
    requestCreateUser = generateUser();

    cy.request({
      url: LOGIN_CLIENT_URL,
      method: "POST",
      body: requestLoginClient,
    }).then((response) => {
      token = response.body.accessToken;
      const Authorization = `Bearer ${token}`;

      cy.request({
          
        url: CREATE_USER_URL,
        method: "POST",
        body: requestCreateUser,
        headers: {
          Authorization,
        },
        
      }).then((response) => {
        ID_USER = response.body.id;
      });
      
    });
  });

  context("Success", () => {
    it("must perform User authentication and returns 200 with access token and refresh token", () => {
      requestLoginUser.email = requestCreateUser.email;

      const options = {
        method: "POST",
        url: LOGIN_USER_URL,
        body: requestLoginUser, 
      };

      cy.request(options).should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.accessToken).not.to.be.eq(undefined);
        expect(response.body.refreshToken).not.to.be.eq(undefined);
        expect(response.body.expiresIn).not.to.be.eq(undefined);
        expect(response.body.refreshExpiresIn).not.to.be.eq(undefined);
      });
    });
  });

  context("clientId error", () => {
    it("Should not User authentication and returns 400 Bad Request - for invalid clientId", () => {
        requestLoginUser.email = requestCreateUser.email;
        requestLoginUser.clientId = "invalid";
        cy.log(requestLoginUser);
      const options = {
        method: "POST",
        url: LOGIN_CLIENT_URL,
        body: requestLoginUser,
        failOnStatusCode: false,
      };
      cy.request(options,{ timeout: 10000 }).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.eq(400);
        //expect(response.body.message).to.eq("client not found");
      });   
    });

    it("Should not client authentication and returns 400 Bad Request - for null clientId", () => {
        requestLoginUser.email = requestCreateUser.email;
        requestLoginUser.clientId = null;

      const options = {
        method: "POST",
        url: LOGIN_CLIENT_URL,
        body: requestLoginUser,
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.eq(400);
       // expect(response.body.error).to.eq("Bad Request");
      });
    });
  });

  context("Email error", () => {
    it("Should not User authentication and returns 400 Bad Request - for invalid email", () => {
     
        requestLoginUser.email = "invalid";

      const options = {
        method: "POST",
        url: LOGIN_CLIENT_URL,
        body: requestLoginUser,
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.eq(400);
       // expect(response.body.message).to.eq("Bad Request");
      });
    });

    it("Should not User authentication and returns 400 Bad Request - for null email", () => {
      const options = {
        method: "POST",
        url: LOGIN_CLIENT_URL,
        body: requestLoginUser,
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.eq(400);
      //  expect(response.body.error).to.eq("Bad Request");
      });
    });
  });

  context("Password error", () => {
    it("Should not User authentication and returns 400 Bad Request - for invalid password", () => {
      requestLoginUser.password = "invalid";

      const options = {
        method: "POST",
        url: LOGIN_CLIENT_URL,
        body: requestLoginUser,
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.eq(400);
      //  expect(response.body.message).to.eq("Bad Request");
      });
    });

    it("Should not User authentication and returns 400 Bad Request - for null password", () => {
      requestLoginUser.password = null;
      const options = {
        method: "POST",
        url: LOGIN_CLIENT_URL,
        body: requestLoginUser,
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.eq(400);
      //  expect(response.body.error).to.eq("Bad Request");
      });
    });
  });
  afterEach(() => {
    
    cy.request({
      url: LOGIN_CLIENT_URL,
      method: "POST",
      body: requestLoginClient,
    }).then((response) => {
      token = response.body.accessToken;
      const Authorization = `Bearer ${token}`;
      cy.request({
        method: "DELETE",
        url: CREATE_USER_URL + "/" + ID_USER,
        headers: {
          Authorization,
        },
      });
    });
  });
});
