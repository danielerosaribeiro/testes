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
const userAuth = require("../../../services/authenticationService");
const userCreate  = require("../../../services/createService");


const CREATE_USER_URL = API_ITEZSERVICES_URL + "/users";
const LOGIN_CLIENT_URL = API_ITEZSERVICES_URL + "/auth/clients/login";
const LOGOUT_USER_URL = API_ITEZSERVICES_URL + "/auth/logout";

let requestLoginClient;
let requestCreateUser;
let token;
let logoutUser;
let authInfos;

describe("Logout User API", () => {
  beforeEach(() => {
    requestLoginClient = loginAuthenticationClient();
    requestCreateUser = generateUser();

    cy.request({
      url: LOGIN_CLIENT_URL,
      method: "POST",
      body: requestLoginClient,
    }).then((response) => {
      token = response.body.accessToken;
      const Authorization = `Bearer ${token}`;

      userCreate(userCreate.request.AuthorizationClient = Authorization).then(() => {
        userAuth(userCreate.generateUser().email).then((response) =>
          authInfos = response.body
        );
      });
    });
  });

  context("Success", () => {
    it("must logout User and returns 204 - No content", () => {
      const options = {
        method: "POST",
        url: LOGOUT_USER_URL,
        body: {
          clientId: "applaus-api",
          refreshToken: authInfos.refreshToken,
        },
      };

      cy.request(options).should((response) => {
        expect(response.status).to.eq(204);
      });
    });
  });

  context("clientId error", () => {
    it("Shold not logout User and returns 400 Bad Request - for clientId null ", () => {
      const options = {
        method: "POST",
        url: LOGOUT_USER_URL,
        body: {
          clientId: null,
          refreshToken: logoutUser,
        },
        failOnStatusCode: false,
      };

      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.eq("Bad Request");
      });
    });

    it("Shold not logout User and returns 400 Bad Request - for clientId invalid ", () => {
      const options = {
        method: "POST",
        url: LOGOUT_USER_URL,
        body: {
          clientId: "invalid",
          refreshToken: logoutUser,
        },
        failOnStatusCode: false,
      };

      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.eq("Bad Request");
      });
    });
  });

  context("refreshToken error", () => {
    it("Shold not logout User and returns 400 Bad Request - for refreshToken null ", () => {
      const options = {
        method: "POST",
        url: LOGOUT_USER_URL,
        body: {
          clientId: "applaus-api",
          refreshToken: null,
        },
        failOnStatusCode: false,
      };

      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.eq("Bad Request");
      });
    });

    it("Shold not logout User and returns 400 Bad Request - for refreshToken invalid ", () => {
      const options = {
        method: "POST",
        url: LOGOUT_USER_URL,
        body: {
          clientId: "applaus-api",
          refreshToken: "invalid",
        },
        failOnStatusCode: false,
      };

      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.eq("Bad Request");
      });
    });
  });
});
