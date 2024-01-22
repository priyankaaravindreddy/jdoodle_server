const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
// Enable CORS for all routes
app.use(cors());
app.post("/execute", async (req, res) => {
  const {
    clientId,
    clientSecret,
    language,
    versionIndex,
    userAnswers,
    problems,
  } = req.body;
  const requestCallsBody = userAnswers?.map((ans, idx) => ({
    clientId,
    clientSecret,
    language,
    versionIndex,
    script: ans,
    stdin: problems[idx?.testCases],
  }));
  try {
    const promises = requestCallsBody((req) =>
      axios.post("https://api.jdoodle.com/v1/execute", req)
    );
    const response = await axios.post(
      "https://api.jdoodle.com/v1/execute",
      req.body
    );
    const results = Promise.allSettled(promises);
    console.log("results ", results);
    // res.json(response.data);
  } catch (error) {
    console.error("Error calling JDoodle API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/auth-token", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.jdoodle.com/v1/auth-token",
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error calling JDoodle API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// var request = require('request');

// var program = {
//     script : "print(\"Hello, World!\")",
//     language: "php",
//     versionIndex: "0",
//     clientId: "c0fad38eb03eaa700c9310748610fad1",
//     clientSecret:"a209966846744088f30ca130dd6251a3647a7e6efc3a95f138b063a9fbdc4ca8"
// };

// request({
//     url: 'https://api.jdoodle.com/v1/execute',
//     method: "POST",
//     json: program
// },
// function (error, response, body) {
//     console.log('error:', error);
//     console.log('statusCode:', response && response.statusCode);
//     console.log('body:', body);
// })
