const express = require('express')
const router = express.Router()
const { poolPromise } = require('../connection/DB.js')
const sql = require('mssql')

let id = 10;
let login = false;
let user_data = [];
let profile_data = [];
let appointment_data = [];
let bookedAppointments = [];

router.get("/logout", function(req,res) {
  login = false;
  res.redirect("/");
});

router.post('/UserPost', async (req, res) => {
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

router.post('/ProfilePost', async (req, res) => {
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
    res.redirect("/AppointmentGet");
  } else {
    res.render("appointment", {data: appointment_data});
  }
});


router.get('/AppointmentGet', async (req, res) => {
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

router.post('/AppointmentDelete', async (req, res) => {
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
  res.redirect("/PatientVisitInsert");
})
} catch (err) {
res.status(500)
res.send(err.message)
}
})

router.get('/PatientVisitInsert', async (req, res) => {
try {
const pool = await poolPromise
const result = await pool.request()
.input("visitID", sql.Int, bookedAppointments[0].aptID)
.input("patientID", sql.Int, user_data[0].userID)
.input("date", sql.VarChar(255), bookedAppointments[0].date)
.input("time", sql.VarChar(255), bookedAppointments[0].time)
.execute("InsertPatientVisit").then(function (err, recordSet) {
  bookedAppointments.pop();
  appointment_data = [];
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

// ** API OPERATIONS FOR USER **
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

router.post('/ApiUserPost', async (req, res) => {
  let PTest = async function() {
    id++;
    const pool = await poolPromise
    const result = await pool.request()
    .input("userID", sql.Int, req.query.id)
    .input("name", sql.VarChar(255), req.query.name)
    .input("email", sql.VarChar(255), req.query.email)
    .input("pass", sql.VarChar(255), req.query.pass)
    .input("type", sql.VarChar(255), req.query.type)
    .execute("InsertUser")
  }

  let myfunc = PTest();

  myfunc.then(function (recordSet) {
    res.status(200).json({ status: "Success" })
  });

  myfunc.catch(function() {
    res.status(500)
    res.send(err.message)
  });
});

router.put('/ApiUserPut', async (req, res) => {
try {
const pool = await poolPromise
const result = await pool.request()
.input("userID", sql.Int, req.query.id)
.input("name", sql.VarChar(255), req.query.name)
.input("email", sql.VarChar(255), req.query.email)
.input("pass", sql.VarChar(255), req.query.pass)
.input("type", sql.VarChar(255), req.query.type)
.execute("UpdateUsers").then(function (err, recordSet) {
res.status(200).json({ status: "Success" })
})
} catch (err) {
res.status(500)
res.send(err.message)
}
})

router.delete('/ApiUserDelete', async (req, res) => {
try {
const pool = await poolPromise
const result = await pool.request()
.input("userID", sql.Int, req.query.id)
.execute("DeleteUser").then(function (err, recordSet) {
res.status(200).json({ status: "Success" })
})
} catch (err) {
res.status(500)
res.send(err.message)
}
})

// ** API OPERATIONS FOR PROFILE **
router.get('/ApiProfileGet', async (req, res) => {
try {
const pool = await poolPromise
const result = await pool.request()
.query('select * from Profile',function(err, userset){
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

router.post('/ApiProfilePost', async (req, res) => {
  let PTest = async function() {
    id++;
    const pool = await poolPromise
    const result = await pool.request()
    .input("userID", sql.Int, req.query.id)
    .input("address", sql.VarChar(255), req.query.address)
    .input("phone", sql.VarChar(255), req.query.phone)
    .input("height", sql.VarChar(255), req.query.height)
    .input("weight", sql.VarChar(255), req.query.weight)
    .input("dob", sql.VarChar(255), req.query.dob)
    .input("sex", sql.VarChar(255), req.query.sex)
    .execute("InsertProfile")
  }

  let myfunc = PTest();

  myfunc.then(function (recordSet) {
    res.status(200).json({ status: "Success" })
  });

  myfunc.catch(function() {
    res.status(500)
    res.send(err.message)
  });
});

router.put('/ApiProfilePut', async (req, res) => {
try {
const pool = await poolPromise
const result = await pool.request()
.input("userID", sql.Int, req.query.id)
.input("address", sql.VarChar(255), req.query.address)
.input("phone", sql.VarChar(255), req.query.phone)
.input("height", sql.VarChar(255), req.query.height)
.input("weight", sql.VarChar(255), req.query.weight)
.input("dob", sql.VarChar(255), req.query.dob)
.input("sex", sql.VarChar(255), req.query.sex)
.execute("UpdateProfile").then(function (err, recordSet) {
res.status(200).json({ status: "Success" })
})
} catch (err) {
res.status(500)
res.send(err.message)
}
})

router.delete('/ApiProfileDelete', async (req, res) => {
try {
const pool = await poolPromise
const result = await pool.request()
.input("userID", sql.Int, req.query.id)
.execute("DeleteProfile").then(function (err, recordSet) {
res.status(200).json({ status: "Success" })
})
} catch (err) {
res.status(500)
res.send(err.message)
}
})

// ** API OPERATIONS FOR APPOINTMENT **
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
  var user_data = userset.recordset;
  res.json(user_data);
}
})
} catch (err) {
res.status(500)
res.send(err.message)
}
});

router.post('/ApiAppointmentPost', async (req, res) => {
  let PTest = async function() {
    id++;
    const pool = await poolPromise
    const result = await pool.request()
    .input("aptID", sql.Int, req.query.id)
    .input("date", sql.VarChar(255), req.query.date)
    .input("time", sql.VarChar(255), req.query.time)
    .execute("InsertAppointment")
  }

  let myfunc = PTest();

  myfunc.then(function (recordSet) {
    res.status(200).json({ status: "Success" })
  });

  myfunc.catch(function() {
    res.status(500)
    res.send(err.message)
  });
});

router.put('/ApiAppointmentPut', async (req, res) => {
try {
const pool = await poolPromise
const result = await pool.request()
.input("aptID", sql.Int, req.query.id)
.input("date", sql.VarChar(255), req.query.date)
.input("time", sql.VarChar(255), req.query.time)
.execute("UpdateAppointment").then(function (err, recordSet) {
res.status(200).json({ status: "Success" })
})
} catch (err) {
res.status(500)
res.send(err.message)
}
})

router.delete('/ApiAppointmentDelete', async (req, res) => {
try {
const pool = await poolPromise
const result = await pool.request()
.input("aptID", sql.Int, req.query.id)
.execute("DeleteAppointment").then(function (err, recordSet) {
res.status(200).json({ status: "Success" })
})
} catch (err) {
res.status(500)
res.send(err.message)
}
})

// ** API OPERATIONS FOR PATIENTVISIT **
router.get('/ApiPatientVisitGet', async (req, res) => {
try {
const pool = await poolPromise
const result = await pool.request()
.query('select * from PatientVisit',function(err, userset){
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

router.post('/ApiPatientVisitPost', async (req, res) => {
  let PTest = async function() {
    id++;
    const pool = await poolPromise
    const result = await pool.request()
    .input("visitID", sql.Int, req.query.id)
    .input("patientID", sql.Int, req.query.id)
    .input("date", sql.VarChar(255), req.query.date)
    .input("time", sql.VarChar(255), req.query.time)
    .execute("InsertPatientVisit")
  }

  let myfunc = PTest();

  myfunc.then(function (recordSet) {
    res.status(200).json({ status: "Success" })
  });

  myfunc.catch(function() {
    res.status(500)
    res.send(err.message)
  });
});

router.put('/ApiPatientVisitPut', async (req, res) => {
try {
const pool = await poolPromise
const result = await pool.request()
.input("visitID", sql.Int, req.query.id)
.input("patientID", sql.Int, req.query.id)
.input("date", sql.VarChar(255), req.query.date)
.input("time", sql.VarChar(255), req.query.time)
.execute("UpdatePatientVisit").then(function (err, recordSet) {
res.status(200).json({ status: "Success" })
})
} catch (err) {
res.status(500)
res.send(err.message)
}
})

router.delete('/ApiPatientVisitDelete', async (req, res) => {
try {
const pool = await poolPromise
const result = await pool.request()
.input("visitID", sql.Int, req.query.id)
.execute("DeletePatientVisit").then(function (err, recordSet) {
res.status(200).json({ status: "Success" })
})
} catch (err) {
res.status(500)
res.send(err.message)
}
})

module.exports = router;
