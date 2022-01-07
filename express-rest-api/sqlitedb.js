var sqlite3 = require('sqlite3').verbose()
const DBSOURCE = "employeedb.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
   if (err) {
      console.error(err.message)
      throw err
   }else{
      console.log('Connected to the SQLite database.')
      db.run(`CREATE TABLE employee (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         firstName text, 
         surName text, 
         email text, 
         DOB text, 
         gender text
         )`,
            (err) => {
               if (err) {
                  console.log(err);
               }else{
                  var insert = 'INSERT INTO employee (firstName, surName, email, DOB, gender) VALUES (?,?,?,?,?)'

                  db.run(insert, ['Dipali', 'Parkale', 'dipa@gmail.com', '1995-03-02', 'Female'])
                  db.run(insert, ['Rupesh', 'sharma', 'rupesh@gmail.com', '1995-03-02', 'Male'])
                  db.run(insert, ['Akash', 'rote', 'akash@gmail.com', '1995-03-02', 'Male'])
                  db.run(insert, ['Bob', 'Aura', 'bob@gmail.com', '2000-03-02', 'Male'])

               }
            }
      );  
   }
});

module.exports = db