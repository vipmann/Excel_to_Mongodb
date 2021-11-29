var express = require("express");
var mongoose = require("mongoose");
var multer = require("multer");
var path = require("path");
var bodyParser = require("body-parser");
var async = require("async");
var User = require("./models/csv");
var validator = require("validator");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

var uploads = multer({ storage: storage });

//connect to db
mongoose
  .connect(
    "mongodb+srv://vipul:VIP12345@cluster0.s4lpz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useUnifiedTopology: true,useNewUrlParser: true }
  )
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));

//init app
var app = express();

//set the template engine
app.set("view engine", "ejs");

//fetch data from the request
app.use(bodyParser.urlencoded({ extended: false }));

//static folder
app.use(express.static(path.resolve(__dirname, "public")));

//default pageload
app.get("/", async(req, res) => {

  const data = await User.find({});
//   console.log(data);
  if (data.length > 0) {
    res.render("demo", { data: data });
  } else {
    res.render("demo", { data: "" });
  }

});


const addUser = async (val, cb) => {
  if (val.Email !== undefined || val["Name of the Candidate"] !== undefined) {
    const obj = {
      name: val["Name of the Candidate"],
      email: val.Email,
      mobile: val["Mobile No."],
      dob: val["Date of Birth"],
      experience: val["Work Experience"],
      resume: val["Resume Title"],
      location: val["Current Location"],
      address: val["Postal Address"],
      currentEmployer: val["Current Employer"],
      currentDesignation: val["Current Designation"],
    };

    if (!validator.isEmail(val.Email)) {
      return cb(null);
    }
    try {
      const user = await User.findOne({ email: val.Email });
      if (!user) {
        await User.create(obj);
      }
    } catch (err) {
      console.log(err, "  error");
    }
  }
  cb(null);
};
app.post("/", uploads.single("csv"), (req, res) => {
  var XLSX = require("xlsx");
  var workbook = XLSX.readFile(req.file.path);
  var sheet_name_list = workbook.SheetNames;
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
    raw: false,
  });
  console.log(data);
  async.eachSeries(
    data,
    (val, next) => {
      addUser(val, next);
    },
    (err) => {
      console.log("finished");
    }
  );
  res.redirect("/");
});

//assign port
var port = process.env.PORT || 4000;
app.listen(port, () => console.log("server run at port " + port));
