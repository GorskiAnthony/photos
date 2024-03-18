const fetch = require("node-fetch");

async function fetchUrl(url) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        pgl: "Go/connect",
        ti: "dvb_view",
        sAction: "photos",
        pjvHash: "HYP54PJK",
        id: "EQPA2QVF5",
        order: "DESC",
        limit: "50",
        nDelay: "0",
        photoOffset: "",
      }).toString(),
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching data : ", error);
    return error;
  }
}

module.exports = fetchUrl;
