const express = require('express')
const router = express.Router()
const { poolPromise } = require('../connection/DB.js')
const sql = require('mssql')

let id = 0;
let login = false;
let user_data = [];
let profile_data = [];
let appointment_data = [];
let bookedAppointments = [];

router.get('/ApiUserGet', async (req, res) => {
try {
const pool = await poolPromise
const result = await pool.request()
.query('select * from Users',function(err, userset){
if (err)
{
console.log(err)
}
else {
  var user_data = userset.recordset;
  res.json(user_data);
}
})
} catch (err) {
res.status(500)
res.send(err.message)
}
});

router.get("/logout", function(req,res) {
  login = false;
  res.redirect("/");
});

router.post('/ApiUserPost', async (req, res) => {
  let PTest = async function() {
    id++;
    const pool = await poolPromise
    const result = await pool.request()
    .input("userID", sql.Int, id)
    .input("name", sql.VarChar(255), req.body.name)
    .input("email", sql.VarChar(255), req.body.email)
    .input("pass", sql.VarChar(255), req.body.pass)
    .input("type", sql.VarChar(255), "patient")
    .execute("InsertUser")
  }

  let myfunc = PTest();

  myfunc.then(function (recordSet) {
    res.redirect("/login");
  });

  myfunc.catch(function() {
    alert("Account creation failed, please try again")
  });
});

router.post('/ApiProfilePost', async (req, res) => {
  try {
  const pool = await poolPromise
  const result = await pool.request()
  .query("select * from Users where userID='" + user_data[0].userID + "'",function(err, userset){
  if (err)
  {
  console.log(err)
  }
  else {
    profile_data = userset.recordset;
  }
  })
  } catch (err) {
  res.status(500)
  res.send(err.message)
  }

  let PTest = async function() {
    if (profile_data.length == 0) {
      const pool = await poolPromise
      const result = await pool.request()
      .input("userID", sql.Int, user_data[0].userID)
      .input("address", sql.VarChar(255), req.body.address)
      .input("phone", sql.VarChar(255), req.body.phone)
      .input("height", sql.VarChar(255), req.body.height)
      .input("weight", sql.VarChar(255), req.body.weight)
      .input("dob", sql.VarChar(255), req.body.dob)
      .input("sex", sql.VarChar(255), req.body.sex)
      .execute("InsertProfile")
    } else {
      const pool = await poolPromise
      const result = await pool.request()
      .input("userID", sql.Int, user_data[0].userID)
      .input("address", sql.VarChar(255), req.body.address)
      .input("phone", sql.VarChar(255), req.body.phone)
      .input("height", sql.VarChar(255), req.body.height)
      .input("weight", sql.VarChar(255), req.body.weight)
      .input("dob", sql.VarChar(255), req.body.dob)
      .input("sex", sql.VarChar(255), req.body.sex)
      .execute("UpdateProfile")
    }
  }

  let myfunc = PTest();

  myfunc.then(function (recordSet) {
    res.redirect("/");
  });

  myfunc.catch(function() {
    res.status(400).json({ message: "Profile creation failed, please try again" })
  });
});

router.post('/login', async (req, res) => {
try {
const pool = await poolPromise
const result = await pool.request()
.query("select * from Users where Users.email='" + req.body.email + "' and Users.pass='" + req.body.password + "'",function(err, userset){
if (err)
{
console.log(err)
}
else {
  user_data = userset.recordset;
  // let login = false;
  // res.json(user_data);
  if(user_data.length != 0) {
    login = true;
    res.redirect("/");
  } else {
    login = false;
    res.redirect("/login");
  }
}
})
} catch (err) {
res.status(500)
res.send(err.message)
}
});

router.get("/", function(req, res) {
  res.render("home", {login: login, data: user_data[0]});
});

router.get("/appointment", function(req,res) {
  if(appointment_data.length == 0) {
    res.redirect("/ApiAppointmentGet");
  } else {
    res.render("appointment", {data: appointment_data});
  }
});


router.get('/ApiAppointmentGet', async (req, res) => {
try {
const pool = await poolPromise
const result = await pool.request()
.query('select * from Appointment',function(err, userset){
if (err)
{
console.log(err)
}
else {
  appointment_data = userset.recordset;
  res.redirect("/appointment");
}
})
} catch (err) {
res.status(500)
res.send(err.message)
}
});

router.post('/ApiAppointmentDelete', async (req, res) => {
try {
const pool = await poolPromise
const result = await pool.request()
.input("aptID", sql.Int, req.body.apt_selected)
.execute("DeleteAppointment").then(function (err, recordSet) {
  for(let i = 0; i < appointment_data.length; i++) {
    if(appointment_data[i].aptID == req.body.apt_selected) {
      bookedAppointments.push(appointment_data[i]);
    }
  }
  res.redirect("/ApiPatientVisitInsert");
})
} catch (err) {
res.status(500)
res.send(err.message)
}
})

router.get('/ApiPatientVisitInsert', async (req, res) => {
try {
const pool = await poolPromise
const result = await pool.request()
.input("visitID", sql.Int, bookedAppointments[0].aptID)
.input("patientID", sql.Int, user_data[0].userID)
.input("date", sql.VarChar(255), bookedAppointments[0].date)
.input("time", sql.VarChar(255), bookedAppointments[0].time)
.execute("InsertPatientVisit").then(function (err, recordSet) {
  bookedAppointments.pop();
  res.redirect("/");
})
} catch (err) {
res.status(500)
res.send(err.message)
}
})

router.get('/viewAppointment', async (req, res) => {
try {
const pool = await poolPromise
const result = await pool.request()
.query("select * from PatientVisit where patientID='" + user_data[0].userID + "'",function(err, userset){
if (err)
{
console.log(err)
}
else {
  var viewApp = userset.recordset;
  res.render("viewAppointment", {data: viewApp});
}
})
} catch (err) {
res.status(500)
res.send(err.message)
}
});

router.get('/admin', function(req,res) {
  res.render('admin');
});

// router.post("/login", function (req, res) {
//   const email = req.body.email;
//   const password = req.body.pass;
//
//   res
//
// });

module.exports = router;
