const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDB } = require("./fixtures/db");

beforeEach(setupDB);
// afterAll(async () => {
//   await mongoose.connection.close();
// });

test("signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "yyc",
      email: "foos1280@gmail.com",
      password: "123456",
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: "yyc",
      email: "foos1280@gmail.com",
    },
    token: user.tokens[0].token,
  });
  expect(user.password).not.toBe("123456");
});

test("login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("login failed", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "aaaaa",
      password: userOne.password,
    })
    .expect(400);
});

test("get profile", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("get profile failed", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("delete user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("delete user failed", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("upload avatar", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("update user", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "fooszzzz",
    })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.name).toBe("fooszzzz");
});

test("update user failed", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      sex: "fooszzzz",
    })
    .expect(400);
});
