const request = require("supertest");
// const express = require("express");
const app = "http://localhost:8080";
describe("API tests", () => {
  it("should return a 200 status code for GET", async () => {
    const response = await request(app).get("/api/jobCate");
    expect(response.statusCode).toBe(200);
  });

  it("Test API send contact", async () => {
    const postData = {
      name: "formData.name",
      email: "formData.email",
      subject: "formData.subject",
      message: "formData.message",
      status: 'OPEN',
    };

    const response = await request(app)
      .post("/contact")
      .send(postData)
      .set("Content-Type", "application/json");
      expect(response.statusCode).toBe(200);

  });


  it("Test API register candidate", async () => {
    const postData = {
      registerType: "employer",
      name: "My Name",
      email: "quanque@gmail.com",
      phoneNumber: "08178993933",
      password: "tranbao",
      companyName:"FPOLY",
      taxNumber:"0123-012-212",
      address:"HCM city",
      bio:"I Love mysefl"
    };

    const response = await request(app)
      .post("/auth/register")
      .send(postData)
      .set("Content-Type", "application/json");
      expect(response.statusCode).toBe(200);

  });


  it("Test API Login", async () => {
    const postData = {
      email: "formData.email",
      password: "formData.password"
    };

    const response = await request(app)
      .post("/auth/login")
      .send(postData)
      .set("Content-Type", "application/json");
      expect(response.statusCode).toBe(200);

  });

  
});

export{}
