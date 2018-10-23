const app = require("express")()
const morgan = require("morgan")
const fetch = require("node-fetch")
const cors = require("cors")
require("dotenv").config()

// MIDDLEWARE
app.use(morgan("dev"))
const corsOptions = require("./corsOptions")
app.use(cors(corsOptions))

// BASE OPTIONS
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const baseURL = "https://api.github.com"
const acceptV3 = "application/vnd.github.v3+json"

// ROUTES
// - Get all users
app.get("/users", function(req, res, next) {
  let reqSince = 0

  if (req.query.since) {
    reqSince = req.query.since
  }

  // Call the Github API
  fetch(
    baseURL +
      "/users" +
      "?since=" +
      reqSince +
      "&client_id=" +
      clientId +
      "&client_secret=" +
      clientSecret,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: acceptV3
      }
    }
  )
    .then(data => {
      res.set("link", data.headers.raw().link)
      return data.json()
    })
    .then(json => {
      console.log(json.length)
      return res.json(json)
    })
    .catch(e => next(e))
})

// MIDDLEWARE - 'NOT FOUND'
app.use(function(req, res, next) {
  res.status(404)
  res.json({ message: "Route does not exist." })
})

// MIDDLEWARE - ERROR HANDLER
app.use(function(error, req, res, next) {
  res.status(500).json({ message: error.message })
})

// // // // // // // // // // // // // // // // // //
// // // // // // // // // // // // // // // // // //
const port = process.env.PORT || 3000
app.listen(port, function() {
  console.log(`Server online. Running at port ${port}`)
})
