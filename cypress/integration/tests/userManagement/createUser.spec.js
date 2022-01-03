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
} = require("../../../utils/generateTestData");

const CREATE_USER_URL = API_ITEZSERVICES_URL + "/users";
const LOGIN_CLIENT_URL = API_ITEZSERVICES_URL + "/auth/clients/login";

let requestLoginClient;
let requestCreateUser;
let token;
let ID_USER;

describe("Create User API", () => {
  beforeEach(() => {
    requestCreateUser = generateUser();
    requestLoginClient = loginAuthenticationClient();

    token = cy
      .request({
        url: LOGIN_CLIENT_URL,
        method: "POST",
        body: requestLoginClient,
      })
      .then((response) => {
        token = response.body.accessToken;
      });
  });

  context("Success", () => {
    it("Should create user with enable true and returns 201 Created with ID", () => {
      requestCreateUser.enabled = true;

      createService().should((response) => {
        ID_USER = response.body.id;
        expect(response.status).to.eq(201);
        expect(response.body.id).to.be.not.null;
      });
    });

    it("Should create user with enable false and returns 201 Created with ID", () => {
      requestCreateUser.enabled = false;

      const authorization = `Bearer ${token}`;
      const options = {
        method: "POST",
        body: requestCreateUser,
        url: CREATE_USER_URL,
        headers: {
          authorization,
        },
      };
      cy.request(options).should((response) => {
        ID_USER = response.body.id;
        expect(response.status).to.eq(201);
        expect(response.body.id).to.be.not.null;
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


  context("Authenticantion error", () => {
    it("Should not create user and returns error 401 for token in authentication null", () => {
      const authorization = `Bearer ${(token = null)}`;
      const options = {
        method: "POST",
        body: requestCreateUser,
        url: CREATE_USER_URL,
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
        method: "POST",
        body: requestCreateUser,
        url: CREATE_USER_URL,
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
    it("Should not create user and returns 400 for fist name null", () => {
      requestCreateUser.firstName = null;

      const authorization = `Bearer ${token}`;
      const options = {
        method: "POST",
        body: requestCreateUser,
        url: CREATE_USER_URL,
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

    it("Should not create prospect and returns error 400 for invalid first name - less than three characters", () => {
      requestCreateUser.firstName = "a";

      const authorization = `Bearer ${token}`;
      const options = {
        method: "POST",
        body: requestCreateUser,
        url: CREATE_USER_URL,
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

    it("Should not create prospect and returns error 400 for invalid first name - not string name format", () => {
      requestCreateUser.firstName = 1;

      const authorization = `Bearer ${token}`;
      const options = {
        method: "POST",
        body: requestCreateUser,
        url: CREATE_USER_URL,
        headers: {
          authorization,
        },
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.be.eq(400);
        expect(response.body.message).not.to.eq(undefined);
        expect(response.body.error).contains(BAD_REQUEST);
      });
    });
  });

  context("Last name error", () => {
    it("Should not create user and returns 400 for last name null", () => {
      requestCreateUser.lastName = null;

      const authorization = `Bearer ${token}`;
      const options = {
        method: "POST",
        body: requestCreateUser,
        url: CREATE_USER_URL,
        headers: {
          authorization,
        },
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.be.eq(400);
        expect(response.body.message).not.to.eq(undefined);
        expect(response.body.error).contains(BAD_REQUEST);
      });
    });

    it("Should not create prospect and returns error 400 for invalid last name - less than three characters", () => {
      requestCreateUser.lastName = "a";

      const authorization = `Bearer ${token}`;
      const options = {
        method: "POST",
        body: requestCreateUser,
        url: CREATE_USER_URL,
        headers: {
          authorization,
        },
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.be.eq(400);
        expect(response.body.message).not.to.eq(undefined);
        expect(response.body.error).contains(BAD_REQUEST);
      });
    });

    it("Should not create prospect and returns error 400 for invalid last name - not string name format", () => {
      requestCreateUser.lastName = 1;

      const authorization = `Bearer ${token}`;
      const options = {
        method: "POST",
        body: requestCreateUser,
        url: CREATE_USER_URL,
        headers: {
          authorization,
        },
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.be.eq(400);
        expect(response.body.message).not.to.eq(undefined);
        expect(response.body.error).contains(BAD_REQUEST);
      });
    });
  });

  context("Email error", () => {
    it("Should not create user and returns error 400 for email null", () => {
      requestCreateUser.email = null;

      const authorization = `Bearer ${token}`;
      const options = {
        method: "POST",
        body: requestCreateUser,
        url: CREATE_USER_URL,
        headers: {
          authorization,
        },
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.be.eq(400);
        expect(response.body.message).not.to.eq(undefined);
        expect(response.body.error).contains(BAD_REQUEST);
      });
    });

    it("Should not create user and returns error 400 for invalid email format", () => {
      requestCreateUser.email = "invalid";

      const authorization = `Bearer ${token}`;
      const options = {
        method: "POST",
        body: requestCreateUser,
        url: CREATE_USER_URL,
        headers: {
          authorization,
        },
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.be.eq(400);
        expect(response.body.message).not.to.eq(undefined);
        expect(response.body.error).contains(BAD_REQUEST);
      });
    });
  });

  context("Password error", () => {
    it("Should not create user and returns error 400 for password null", () => {
      requestCreateUser.password = null;

      const authorization = `Bearer ${token}`;
      const options = {
        method: "POST",
        body: requestCreateUser,
        url: CREATE_USER_URL,
        headers: {
          authorization,
        },
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.be.eq(400);
        expect(response.body.message).not.to.eq(undefined);
        expect(response.body.error).contains(BAD_REQUEST);
      });
    });

    it("Should not create user and returns error 400 for password invalid format - just with letters", () => {
      requestCreateUser.password = "password";

      const authorization = `Bearer ${token}`;
      const options = {
        method: "POST",
        body: requestCreateUser,
        url: CREATE_USER_URL,
        headers: {
          authorization,
        },
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.be.eq(400);
        expect(response.body.message).not.to.eq(undefined);
        expect(response.body.error).contains(BAD_REQUEST);
      });
    });
    it("Should not create user and returns error 400 for password invalid format - just with numbers", () => {
      requestCreateUser.password = "123";

      const authorization = `Bearer ${token}`;
      const options = {
        method: "POST",
        body: requestCreateUser,
        url: CREATE_USER_URL,
        headers: {
          authorization,
        },
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.be.eq(400);
        expect(response.body.message).not.to.eq(undefined);
        expect(response.body.error).contains(BAD_REQUEST);
      });
    });
    it("Should not create user and returns error 400 for password out of format - not string", () => {
      requestCreateUser.password = 123;

      const authorization = `Bearer ${token}`;
      const options = {
        method: "POST",
        body: requestCreateUser,
        url: CREATE_USER_URL,
        headers: {
          authorization,
        },
        failOnStatusCode: false,
      };
      cy.request(options).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.statusCode).to.be.eq(400);
        expect(response.body.message).not.to.eq(undefined);
        expect(response.body.error).contains(BAD_REQUEST);
      });
    });
  });
});
