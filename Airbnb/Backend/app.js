const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");

const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js"); 
const newListing = require("./routes/newListing.js");
const SignIn = require("./routes/signin.js");
const Register = require("./routes/register.js");
const reviews = require("./routes/review.js");
const cors = require("cors"); 
const Listing = require("./models/listing.js");
const review = require("./models/review.js");
const wrapAsync = require("./utils/wrapAsync.js");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main().then(() => {
  console.log("connected to database!");
}).catch((err) => {
  console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/Airbnb');
}

app.use("/", newListing);
app.use("/signin", SignIn);
app.use("/register", Register);

// Use the new route for editing a listing

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

//Express route handling for DELETE request
// app.post('/listings/:id/reviews', wrapAsync(async (req, res) => {
//   console.log("Im in");
//   let listing = await Listing.findById(req.params.id);
//   let newReview = new review(req.body.review);
//   listing.reviews.push(newReview);
//   await newReview.save();
//   await listing.save();

//   res.redirect(`/listings/${listing._id}`);
// }));




app.use("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.listen(8080, (req, res) => {
  console.log("server is listening at port 8080");
});
