const { request } = require("http");
const { API_ITEZSERVICES_URL } = require("../../../utils/constants");
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("../../../utils/errorCodes");
const { loginAuthenticationClient } = require("../../../utils/loginAuthentication");

const LOGIN_CLIENT_URL = API_ITEZSERVICES_URL + "/auth/clients/login";


let requestLogin;


describe("Authentication client API", () => {
  beforeEach(()=> {
    requestLogin = loginAuthenticationClient();
  });

  context("Success", () => {
    it("must perform client authentication and returns 200 with access token and refresh token", () => {
      const options = {
        method: "POST",
        url: LOGIN_CLIENT_URL,
        body: requestLogin,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.accessToken).not.to.be.eq(undefined);
        expect(response.body.expiresIn).not.to.be.eq(undefined);
      });
    });
  });

  context("clientId error", () => {
    it("Should not client authentication and returns 401 for invalid clientId", () => {
      requestLogin.clientId = "invalid";

      const options = {
        method: "POST",
        url: LOGIN_CLIENT_URL,
        body: requestLogin,
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.statusCode).to.eq(401);
        expect(response.body.message).to.eq("unauthorized");
      });
    });

    it("Should not client authentication and returns 400 for null clientId", () => {
      requestLogin.clientId = null;

      const options = {
        method: "POST",
        url: LOGIN_CLIENT_URL,
        body: requestLogin,
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.eq(400);
        expect(response.body.error).to.eq("Bad Request");
      });
    });
  });
  context("clientSecret error", () => {
    it("Should not client authentication and returns 401 for invalid clientSecret", () => {
      requestLogin.clientSecret = "invalid";

      const options = {
        method: "POST",
        url: LOGIN_CLIENT_URL,
        body: requestLogin,
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.statusCode).to.eq(401);
        expect(response.body.message).to.eq("unauthorized");
      });
    });

    it("Should not client authentication and returns 400 for null clientId", () => {
      requestLogin.clientSecret = null;

      const options = {
        method: "POST",
        url: LOGIN_CLIENT_URL,
        body: requestLogin,
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.eq(400);
        expect(response.body.error).to.eq("Bad Request");
    
      });
    });
  });
});
