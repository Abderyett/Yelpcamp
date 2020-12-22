const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database Connected");
});

const app = express();
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
	res.render("home");
});
//! ======== show all campgrounds  =============
app.get("/campgrounds", async (req, res) => {
	const camps = await Campground.find({});
	res.render("campgrounds/index", { camps });
});
//! =========== Add New Camp ==========================
app.get("/campgrounds/new", async (req, res) => {
	res.render("campgrounds/new");
});
app.post("/campgrounds", async (req, res) => {
	const addCamp = new Campground(req.body);
	await addCamp.save();
	res.redirect(`/campgrounds/${addCamp._id}`);
});

//! ============ Show details of Camp  ============
app.get("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	const camps = await Campground.findById(id);
	res.render("campgrounds/show", { camps });
});

//! ========== Edit Camp ===================
app.get("/campgrounds/:id/edit", async (req, res) => {
	const { id } = req.params;
	const camps = await Campground.findById(id);
	res.render("campgrounds/edit", { camps });
});
app.put("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndUpdate(id, req.body, {
		new: true,
		runValidators: true,
	});

	res.redirect("/campgrounds");
});

//! ============ Delete Post Camp =================
app.delete("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	res.redirect("/campgrounds");
});

app.listen(2000, () => {
	console.log("Running on Port 2000...");
});
