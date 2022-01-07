var express = require("express")
var cors = require('cors')
var db = require("./sqlitedb.js")

var app = express()
app.use(cors());

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 8000 
app.listen(HTTP_PORT, () => {
   console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

app.get("/api/employee", (req, res, next) => {
   var sql = "select * from employee"
   var params = []
   db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json(rows)
     });

});

app.get("/api/employee/:id", (req, res, next) => {
   var sql = "select * from employee where id = ?"
   var params = [req.params.id]
   db.get(sql, params, (err, row) => {
      if (err) {
         res.status(400).json({"error":err.message});
         return;
      }
      res.json(row)
   });
});

app.post("/api/employee/", (req, res, next) => {
   var errors=[]
   if (!req.body.firstName){
      errors.push("No firstName specified");
   }
   var data = {
      firstName : req.body.firstName,
      surName: req.body.surName,
      email: req.body.email,
      DOB : req.body.DOB,
      gender: req.body.gender,
     }
   var sql = 'INSERT INTO employee (firstName, surName, email, DOB, gender) VALUES (?,?,?,?,?)'
   var params =[data.firstName, data.surName, data.email, data.DOB, data.gender]
   db.run(sql, params, function (err, result) {
      if (err){
         res.status(400).json({"error": err.message})
         return;
      }
      data.id = this.lastID;
      res.json(data);
   });
})

app.put("/api/employee/:id", (req, res, next) => {
   var data = {
      firstName : req.body.firstName,
      surName: req.body.surName,
      email: req.body.email,
      DOB : req.body.DOB,
      gender: req.body.gender
   }
   db.run(
      `UPDATE employee SET
         firstName = ?, 

         surName = ?,
         email = ?, 
         DOB = ?, 

         gender = ? 
         WHERE id = ?`,
            [data.firstName, data.surName, data.email, data.DOB,data.gender, req.params.id],
      function (err, result) {
         if (err){
            console.log(err);
            res.status(400).json({"error": res.message})
            return;
         }
         res.json(data)
   });
})

app.delete("/api/employee/:id", (req, res, next) => {
   db.run(
      'DELETE FROM employee WHERE id = ?',
      req.params.id,
      function (err, result) {
         if (err){
            res.status(400).json({"error": res.message})
            return;
         }
         res.json({"message":"deleted", changes: this.changes})
   });
})

app.use(function(req, res){
   res.status(404);
});