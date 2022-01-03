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
const { report } = require("process");

const CREATE_USER_URL = API_ITEZSERVICES_URL + "/users";
const LOGIN_CLIENT_URL = API_ITEZSERVICES_URL + "/auth/clients/login";

let requestLogin;
let request;
let token;
let createUser;

describe("Update Password User API", () => {

  beforeEach(async () => {
    requestLogin = loginAuthenticationClient();

    token = await cy.request({
      url: LOGIN_CLIENT_URL,
      method: "POST",
      body: requestLogin,
    });
  });

  context("Success", () => {
    it("Should update password user with id in url and returns 200", async () => {
      const authorization = `Bearer ${token.body.accessToken}`;
      
      request = generateUser();

      createUser = await cy.request({
        url: CREATE_USER_URL,
        method: "POST",
        body: request,
        headers: {
          authorization,
        },
      });
      
      const idUser = createUser.body.id;

      const options = {
        method: "PATH",
        url: CREATE_USER_URL + "/" + idUser + "/credentials",
        body:{
            
             currentPassword:"password123",
                password: "newpassword"
        },
        headers: {
          authorization,
        },
      };
      cy.request(options).should((response) => {
      expect(response.status).to.eq(200);



      });
    });
});

  context("Authenticantion error", () => {
    it("Should not listing user and returns error 401 for token in authentication null", async () => {
      const authorization = `Bearer ${(token.body.accessToken = null)}`;
      createUser = await cy.request({
        url: CREATE_USER_URL,
        method: "POST",
        body: request,
        headers: {
          authorization,
        },
      });
      
      const idUser = createUser.body.id;

      const options = {
        method: "PATH",
        url: CREATE_USER_URL + "/" + idUser + "/credentials",
        body:{
            
             currentPassword:"password123",
                password: "newpassword"
        },
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

    it("Should not listing user and returns error 401 for token in Authentication invalid format", async () => {
      const authorization = `Bearer ${(token.body.accessToken =
        "invalid format")}`;
        request = generateUser();

        createUser = await cy.request({
            url: CREATE_USER_URL,
            method: "POST",
            body: request,
            headers: {
              authorization,
            },
          });
          
          const idUser = createUser.body.id;
    
          const options = {
            method: "PATH",
            url: CREATE_USER_URL + "/" + idUser + "/credentials",
            body:{
                
                 currentPassword:"password123",
                    password: "newpassword"
            },
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

  });
