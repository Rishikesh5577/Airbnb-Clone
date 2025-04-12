const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");



// All /listings related routes 

// index route
router.get("/", wrapAsync(async (req, res) => {
    try {
        // Fetch data from the database
        const allListings = await Listing.find({});
        console.log("Retrieved listings:", allListings);
        res.json(allListings);
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  }));

// Show route( GET request at /listings/:id FROM views/listings/index.ejs )
// router.get("/login",wrapAsync(async (req,res)=>{
//     // logic of login
// }))


module.exports = router;