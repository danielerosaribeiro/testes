const { API_ITEZSERVICES_URL } = require("../../../utils/constants");
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("../../../utils/errorCodes");
const {
  loginAuthenticationClient,
} = require("../../../utils/loginAuthentication");
const { generateUser } = require("../../../utils/userRandom");
const { generateUpdateUser } = require("../../../utils/updateUserRandom");
const {
  generateFirstName,
  generateLastName,
  generateEmail,
  generateGroups,
} = require("../../../utils/generateTestData");

const CREATE_USER_URL = API_ITEZSERVICES_URL + "/users";
const LOGIN_CLIENT_URL = API_ITEZSERVICES_URL + "/auth/clients/login";

let requestLogin;
let requestCreateUser;
let requestUpdate;
let token;
let ID_USER;

describe("Update User API", () => {
  beforeEach(() => {
    requestLogin = loginAuthenticationClient();
    requestUpdate = generateUpdateUser();
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
    it("Should update user with enable true and returns 200 sucess", () => {
      requestUpdate.enabled = true;

      const authorization = `Bearer ${token}`;

      const options = {
        method: "PUT",
        body: requestUpdate,
        url: CREATE_USER_URL + "/" + ID_USER,
        headers: {
          authorization,
        },
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.eq("");
      });
    });

    it("Should create user with enable false and returns 200 sucess", () => {
      requestUpdate.enabled = false;

      const authorization = `Bearer ${token}`;

      const options = {
        method: "PUT",
        body: requestUpdate,
        url: CREATE_USER_URL + "/" + ID_USER,
        headers: {
          authorization,
        },
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.eq("");
      });
    });

    it("Should create user with group BACKOFFICE and returns 200 sucess", () => {
      requestUpdate.groups = ["BACKOFFICE"];

      const authorization = `Bearer ${token}`;

      const options = {
        method: "PUT",
        body: requestUpdate,
        url: CREATE_USER_URL + "/" + ID_USER,
        headers: {
          authorization,
        },
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.eq("");
      });
    });

    it("Should create user with group CREATOR and returns 200 sucess", () => {
      requestUpdate.groups = ["CREATOR"];

      const authorization = `Bearer ${token}`;

      const options = {
        method: "PUT",
        body: requestUpdate,
        url: CREATE_USER_URL + "/" + ID_USER,
        headers: {
          authorization,
        },
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.eq("");
      });
    });

    it("Should create user with group CUSTOMER and returns 200 sucess", () => {
      requestUpdate.groups = ["CUSTOMER"];

      const authorization = `Bearer ${token}`;

      const options = {
        method: "PUT",
        body: requestUpdate,
        url: CREATE_USER_URL + "/" + ID_USER,
        headers: {
          authorization,
        },
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.eq("");
      });
    });
  });

  context("Authenticantion error", () => {
    it("Should not update user and returns error 401 for token in authentication null", () => {
      const authorization = `Bearer ${(token = null)}`;

      const options = {
        method: "PUT",
        body: requestUpdate,
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

    it("Should not create user and returns error 401 for token in Authentication invalid format", () => {
      const authorization = `Bearer ${(token = "invalid format")}`;

      const options = {
        method: "PUT",
        body: requestUpdate,
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

  context("First name error", () => {
    it("Should not create prospect and returns error 400 for invalid first name - not string name format", () => {
      requestUpdate.firstName = 1;

      const authorization = `Bearer ${token}`;

      const options = {
        method: "PUT",
        body: requestUpdate,
        url: CREATE_USER_URL + "/" + ID_USER,
        headers: {
          authorization,
        },
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.be.eq(400);
        expect(response.body.message).not.to.be.eq(undefined);
        expect(response.body.error).contains(BAD_REQUEST);
      });
    });
  });

  context("Last name error", () => {
    it("Should not create prospect and returns error 400 for invalid last name - not string name format", () => {
      requestUpdate.lastName = 1;

      const authorization = `Bearer ${token}`;

      const options = {
        method: "PUT",
        body: requestUpdate,
        url: CREATE_USER_URL + "/" + ID_USER,
        headers: {
          authorization,
        },
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.be.eq(400);
        expect(response.body.message).not.to.be.eq(undefined);
        expect(response.body.error).contains(BAD_REQUEST);
      });
    });
  });

  context("Email error", () => {
    it("Should not create user and returns error 400 for invalid email format", () => {
      requestUpdate.email = "invalid";

      const authorization = `Bearer ${token}`;

      const options = {
        method: "PUT",
        body: requestUpdate,
        url: CREATE_USER_URL + "/" + ID_USER,
        headers: {
          authorization,
        },
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.be.eq(400);
        expect(response.body.message).not.to.be.eq(undefined);
        expect(response.body.error).contains(BAD_REQUEST);
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
