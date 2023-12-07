const httpStatus = require("http-status");
const { UserModel } = require("../src/models");
const { userService } = require("../src/service");
const ApiError = require("../src/utils/ApiError");
const request = require("supertest");
const app = require("../app"); // Assuming your Express app is in the app.js file
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let server;

// Hook to run before all tests start
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {});

  // Start the server
  server = app.listen(0);
});

describe("POST /user/signup", () => {
  it("should create a new user", async () => {
    const response = await request(app).post("/user/signup").send({
      name: "numaira",
      userName: "arhaa__",
      email: "arhaa@gmail.com",
      password: "a123456",
    });

    console.log("MESSAGE: ", response.status);
    expect(response.status).toBe(200);
    //expect(response.body.message).toBe("User Already Exist.");
  });

  it("should return 409 if the user alreay exist", async () => {
    const response = await request(app).post("/user/signup").send({
      name: "arhaaaa",
      userName: "arhaa__",
      email: "arhaa@gmail.com",
      password: "a123456",
    });

    //console.log("response.body.message: ", response.body);
    expect(response.status).toBe(409);
    expect(response.body.message).toBe("User Already Exist.");
  });
});

describe("POST /user/login", () => {
  it("should log in an existing user", async () => {
    const response = await request(app).post("/user/login").send({
      email: "arhaa@gmail.com",
      password: "a123456",
    });
    expect(response.body.Response.jwtToken).toBeDefined();

    const decodedToken = jwt.decode(response.body.Response.jwtToken);
    //console.log("decoded JWT Token: ", decodedToken);
    expect(decodedToken).toBeTruthy();
    expect(response.status).toBe(200);
  });

  it("should handle login failure with incorrect credentials", async () => {
    const response = await request(app).post("/user/login").send({
      email: "numaira@gmail.com",
      password: "a124656",
    });

    expect(response.status).toBe(404);
  });
});

describe("GET /user/:email", () => {
  it("should return a single user by email", async () => {
    const userEmail = "arhaa@gmail.com";

    const response = await request(app)
      .get(`/user/${userEmail}`)
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTcwMTgxNDYwNjdkNjM0MzM0MDgxMjIiLCJpYXQiOjE3MDE4NDY1NTIsImV4cCI6MTcwNDQzODU1Mn0.zY-Ch2j8MTTC8Jyz7-uauQmiRFxR1A_Vo7rLXjt7tLM"
      );
    console.log("REsponse: ", response);
    expect(response.status).toBe(200);
    //expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email", userEmail);
  });
});

describe("GET /user/sendRequest", () => {});

afterAll(async () => {
  await server.close();
  await mongoose.disconnect();
  await mongoServer.stop();
});

/* afterAll(() => {
  // Close the server after all tests have run
  server.close(async () => {
    await mongoose.disconnect();
  });
}); */

/* jest.mock("../src/service");
const app = require("../app");

describe("User Creation", () => {
  it("should create a new user", async () => {
    const response = await request(app).post("/signup").send({
      name: "neha",
      userName: "neha_",
      email: "neha@gmail.com",
      password: "a123456",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should handle duplicate user creation", async () => {
    const response = await request(app)
      .post("/signup")
      .send(Add existing user creation data here );

    expect(response.status).toBe(409); // Conflict status
  });
});

jest.mock("../src/models"); // Mocking the entire UserModel module

describe("UserService", () => {
  afterEach(() => {
    jest.restoreAllMocks(); // Restore mocks after each test
  });
  describe("create", () => {
    it("should create a new user successfully", async () => {
      UserModel.findOne.mockResolvedValue(null);

      UserModel.create.mockResolvedValue({
        _id: "",
        userName: "numaira__",
      });

      const result = await userService.create({
        email: "numairaaa@example.com",
        userName: "numaira_nn",
        password: "1234564",
      });

      expect(result.success).toBe(true);
      expect(result.Response).toEqual({ name: "John" });
    });

    it("should throw a conflict error if user already exists", async () => {
      UserModel.findOne.mockResolvedValue({
        userName: "numaira__",
      });

      await expect(
        userService.create({
          email: "numaira@example.com",
          userName: "numaira__",
          password: "123456",
        })
      ).rejects.toThrow(ApiError);
      expect(ApiError).toHaveBeenCalledWith(
        httpStatus.CONFLICT,
        "User Already Exist."
      );
    });
  });

  describe("getSingle", () => {
    it("should get a user by email successfully", async () => {
      // Mocking UserModel.findOne to return a sample user
      UserModel.findOne.mockResolvedValue({
        _id: "655dffd81d99337d138bc89b",
        userName: "numaira_",
      });

      const result = await userService.getSingle("numaira@gmail.com");

      expect(result).toEqual({
        _id: "655dffd81d99337d138bc89b",
        userName: "numaira_",
      });
    });

    it("should throw a not found error if user does not exist", async () => {
      // Mocking UserModel.findOne to return null, indicating that the user doesn't exist
      UserModel.findOne.mockResolvedValue(null);

      // Expect the service function to throw an ApiError with NOT_FOUND status
      await expect(userService.getSingle("arhaa@example.com")).rejects.toThrow(
        ApiError
      );
      expect(ApiError).toHaveBeenCalledWith(
        httpStatus.NOT_FOUND,
        "Resource not found."
      );
    });
  });

  describe("login", () => {
    it("should generate a JWT token for a valid login", async () => {
      // Mocking UserModel.getSingle to return a sample user
      UserModel.getSingle.mockResolvedValue({
        email: "numaira",
        password: "12346",
        isPasswordMatch: jest.fn().mockResolvedValue(true),
      });

      // Mocking generateToken to return a sample JWT token
      const sampleToken = "sample.jwt.token";
      jest.spyOn(userService, "generateToken").mockResolvedValue(sampleToken);

      const result = await userService.login("numaira@gmail.com", "123456");

      expect(result.jwtToken).toBe(sampleToken);
    });

    it("should throw an unauthorized error for an invalid login", async () => {
      // Mocking UserModel.getSingle to return null, indicating that the user doesn't exist
      UserModel.getSingle.mockResolvedValue(null);

      // Expect the service function to throw an ApiError with UNAUTHORIZED status
      await expect(
        userService.login("asdf@example.com", "123654")
      ).rejects.toThrow(ApiError);
      expect(ApiError).toHaveBeenCalledWith(
        httpStatus.UNAUTHORIZED,
        "Incorrect username or password"
      );
    });
  });
}); */
