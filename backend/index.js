const express = require("express");
const fetchUrl = require("./services/fetch");
const app = express();
const cors = require("cors");

app.use(cors());

app.get("/", async (req, res) => {
  try {
    const data = await fetchUrl(
      "https://www.devisubox.com/dv/dv.php5?pgl=Project/interface&sRef=HYP54PJK",
    );
    console.log("Data:", data);
    res.json(data);
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).send("Error fetching data");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
