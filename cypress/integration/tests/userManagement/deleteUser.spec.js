const { API_ITEZSERVICES_URL } = require("../../../utils/constants");
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("../../../utils/errorCodes");
const { loginAuthenticationClient } = require("../../../utils/loginAuthentication");
const { generateUser } = require("../../../utils/userRandom");
const {
  generateFirstName,
  generateLastName,
  generateEmail,
} = require("../../../utils/generateTestData");


const CREATE_USER_URL = API_ITEZSERVICES_URL + "/users";
const LOGIN_CLIENT_URL = API_ITEZSERVICES_URL + "/auth/clients/login";

let requestLogin;
let requestCreateUser;
let token;
let ID_USER;

describe("Delete User API", () => {
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
    it("Should delete user with id in url and returns 204", () => {
      const authorization = `Bearer ${token}`;

      const options = {
        method: "DELETE",
        url: CREATE_USER_URL + "/" + ID_USER,
        headers: {
          authorization,
        },
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(204);
      });
    });
  });

  context("Authenticantion error", () => {
    it("Should not delete user and returns error 401 for token in authentication null", async () => {
      const authorization = `Bearer ${(token = null)}`;

      const options = {
        method: "DELETE",
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

    it("Should not delete user and returns error 401 for token in Authentication invalid format", async () => {
      const authorization = `Bearer ${(token = "invalid format")}`;

      const options = {
        method: "DELETE",
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
    context("ID in URL error", () => {
      it("Should not delete user and returns error 404 for id null", async () => {
        const authorization = `Bearer ${token}`;

        const options = {
          method: "DELETE",
          url: CREATE_USER_URL,
          headers: {
            authorization,
          },
          failOnStatusCode: false,
        };
        cy.request(options).should((response) => {
          expect(response.status).to.eq(404);
          expect(response.body.statusCode).to.be.eq(404);
          expect(response.body.message).to.be.eq("Cannot DELETE /api/v1/users");
          expect(response.body.error).to.be.eq("Not Found");
        });
      });

      it("Should not delete user and returns error 401 for invalid id", async () => {
        const authorization = `Bearer ${token}`;

        const options = {
          method: "DELETE",
          url: CREATE_USER_URL + "/invalid id",
          headers: {
            authorization,
          },
          failOnStatusCode: false,
        };
        cy.request(options).should((response) => {
          expect(response.status).to.eq(404);
          expect(response.body.statusCode).to.be.eq(404);
          expect(response.body.message).to.be.eq("Cannot DELETE /api/v1/users");
          expect(response.body.error).to.be.eq("Not Found");
        });
      });
    });
  });
});
