const { API_ITEZSERVICES_URL } = require("../../../utils/constants");
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("../../../utils/errorCodes");
const {
  loginAuthenticationClient,
} = require("../../../utils/loginAuthentication");
const { generateUser } = require("../../../utils/userRandom");
const {
  generateFirstName,
  generateLastName,
  generateEmail,
  generateEnabled,
  generateGroups,
} = require("../../../utils/generateTestData");

const CREATE_USER_URL = API_ITEZSERVICES_URL + "/users";
const LOGIN_CLIENT_URL = API_ITEZSERVICES_URL + "/auth/clients/login";

let requestLogin;
let requestCreateUser;
let token;
let ID_USER;

describe("Listing User API", () => {
  beforeEach(() => {
    requestLogin = loginAuthenticationClient();
    requestCreateUser = generateUser();
    cy.request({
      url: LOGIN_CLIENT_URL,
      method: "POST",
      body: requestLogin,
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
    it("Should listing user with id in url and returns 200", () => {
      const Authorization = `Bearer ${token}`;

      const options = {
        method: "GET",
        url: CREATE_USER_URL + "/" + ID_USER,
        headers: {
          Authorization,
        },
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.eq(ID_USER);
        // expect(response.body.email,{ matchCase: false }).to.eq(requestCreateUser.email );
        expect(response.body.emailVerified).to.eq(true);
        expect(response.body.firstName).to.eq(requestCreateUser.firstName);
        expect(response.body.lastName).to.eq(requestCreateUser.lastName);
        expect(response.body.username).not.to.be.eq(undefined);
        // expect(response.body.enabled).to.eq(resquestCreateUser.enabled);
      });
    });
  });

  context("Authenticantion error", () => {
    it("Should not listing user and returns error 401 for token in authentication null", () => {
      const authorization = `Bearer ${(token = null)}`;

      const options = {
        method: "GET",
        url: CREATE_USER_URL + "/" + ID_USER,
        headers: {
          authorization,
        },
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.statusCode).to.be.eq(401);
        expect(response.body.message).to.be.eq("Unauthorized");
      });
    });

    it("Should not listing user and returns error 401 for token in Authentication invalid format", () => {
      const authorization = `Bearer ${(token = "invalid format")}`;

      const options = {
        method: "GET",
        url: CREATE_USER_URL + "/" + ID_USER,
        headers: {
          authorization,
        },
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.statusCode).to.be.eq(401);
        expect(response.body.message).to.be.eq("Unauthorized");
      });
    });
  });
  afterEach(() => {
    cy.request({
      url: LOGIN_CLIENT_URL,
      method: "POST",
      body: requestLogin,
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
