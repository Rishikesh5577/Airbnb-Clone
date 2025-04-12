const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

// middleware function to be used as a parameter in routes
const validateListing = (req, res, next) => {
  const result = listingSchema.validate(req.body);
  if (result.error) {
    //let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};

router.post('/:id/reviews',validateListing, wrapAsync(async (req, res) => {
  console.log("Im in");
  let listing = await Listing.findById(req.params.id);
  let newReview = new review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
}));


// All /listings related routes

// index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    try {
      // Fetch data from the database
      const allListings = await Listing.find({});
      console.log("Retrieved listings:", allListings);
      res.json(allListings);
    } catch (error) {
      console.error("Error fetching listings:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

// Show route( GET request at /listings/:id FROM views/listings/index.ejs )
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const currentListing = await Listing.findById(id).populate("reviews");
    res.json(currentListing);
  })
);

// New and Create Route for Listing
// New ---> GET request at /listings/new to collect Form data
// Create ---> POST request at /listings to add form data to database

router.post(
  "/",
  wrapAsync(async (req, res) => {
    console.log("In post route");
    let myListing = req.body;
    console.log(myListing);

    const newListing = new Listing(myListing);
    await newListing.save();
    res
      .status(200)
      .json({ success: true, message: "Listing created successfully" });
  })
);

router.get("/:id/edit", async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    // Instead of res.render, send the listing as JSON
    res.json({ listing });
  } catch (err) {
    next(err);
  }
});

// Route to update a listing
router.put("/:id", async (req, res, next) => {
  try {
    const { description, price } = req.body;
    await Listing.findByIdAndUpdate(req.params.id, { description, price });
    // Instead of res.redirect, send a success JSON response
    res.json({ success: true, message: "Listing updated successfully" });
  } catch (err) {
    next(err);
  }
});











/*
//Edit and Update Route For Listing
// Edit ---> GET request at /listings/:id/edit from show.ejs to render edit form
// Update ---> PUT request at /listings/:id to Update Database
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const currentListing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {currentListing});
}));
router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}))

// Delete Route for Listing --> DELETE request at /listings/:id From show.ejs 
router.delete("/:id",wrapAsync(async (req,res)=>{
    const {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");
}))



*/


// Delete Route for Listing --> DELETE request at /listings/:id From show.ejs 
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.json({ success: true, message: "Listing deleted successfully" });
  })
);

module.exports = router;
