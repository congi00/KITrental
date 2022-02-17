const express = require('express');
const mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();
const jwt = require('jsonwebtoken');
const jwt_secret = 'B)f`PM(P"-8^vkkL';


const Employees = require('./Modules/employees_model.js');
const Clients = require('./Modules/client_model.js');


var router = express.Router();

router.post('/', jsonParser, async (req, res) => {
  const username = req.body.emplUsername;
  const password = req.body.emplPassword;
  console.log(username);
  
  const employee = await Employees.findOne({ username: username });
  if(!employee){
      res.status(404).json({message: "false"});
  }else{
    var pass = await bcrypt.compare(password,employee.password);
    const token = await generateToken(permissionRoleLevels["employee"], employee._id);
    // checkUser(employee, res, permissionRoleLevels["employee"])
    res.status(200).json({password: pass, id:employee._id, role: employee.role, auth: token});
  }
})

router.post('/clients', jsonParser, async (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;

  const client = await Clients.findOne({ username: username });
  if(!client){
      res.status(404).json({message: "false"});
  }else{
    var pass = await bcrypt.compare(password,client.password);
    const token = await generateToken(permissionRoleLevels["client"], client._id);
    // checkUser(client, res, permissionRoleLevels["client"])
    console.log(token)
    res.status(200).json({ id:client._id, password:pass, auth: token});
  }
})

router.post('/managers', jsonParser, async (req, res) => {
  const username = req.body.emplUsername;
  const password = req.body.emplPassword;
  console.log(username);
  
  const employee = await Employees.findOne({ username: username });
  if(!employee){
      res.status(404).json({message: "false"});
  }else{
    var pass = await bcrypt.compare(password,employee.password);
    pass = pass && employee.role=="manager";
    const token = await generateToken(permissionRoleLevels["manager"], employee._id);
    // checkUser(employee, res, permissionRoleLevels["manager"])
    res.status(200).json({password: pass, id:employee._id, role: employee.role, auth: token});
  }
})

// const fs = require('fs');
// const path = require('path');
// const bcrypt = require('bcryptjs');


// let router = express.Router();
// const keysPath = path.join(global.rootDir, '.keys');
// const privateKey = fs.readFileSync(path.join(keysPath, 'jwtRS256.key'));
// const publicKey = fs.readFileSync(path.join(keysPath, 'jwtRS256.key.pub'));


const permissionRoleLevels = {
  "no-auth": 0,
  "client" : 1,
  "employee" : 2,
  "manager" : 4,
}

function verifyPermission (basePermissionLevel){
  return async function verifyLogin(req, res, next){
    console.log(req.headers)
    if('auth' in req.headers && req.headers['auth'] !== null && req.headers['auth']){
      let token
      try{
        token = req.headers['auth'];
      }
      catch(err){
        return res.status(400).json({message: "Error in retriving token from header", error: err});
      }
      if(token){
        await jwt.verify(token, jwt_secret, (err, decoded)=>{
            if(!err) {
                let auth = decoded.auth;
                console.log(decoded)
                if(auth >= basePermissionLevel) next();
                else return res.status(401).json({message: "Not sufficient permission level"});
            }
            else return res.status(401).json({message: "Error in verifying token", error: err});
        })
      }
      else return res.status(401).json({message: "Missing token"});
    }
    else
      return res.status(401).json({message: "Required auth token"})
  }
}


// async function checkUser(user, res, authLevel){
//     // if(!user || user===null)
//     //     return res.status(404).json({message: "User not found"});
//     // else 
//     // if (! (await bcrypt.compare(data.password || "", user.password)))
//     //     return res.status(403).json({message: "Your password is incorrect"});
//     const token = await generateToken(authLevel, user._id, user.username);
//     return res.status(200).json({ authority: token });
// }

async function generateToken(authLvl, id){
  const unsignedToken = {
    auth: authLvl,
    id: id
  }
  const token = 
    await jwt.sign(
      unsignedToken, 
      jwt_secret,
    );
  return token;
}

// router.post('/login/users', async (req, res)=>{
//     let data = req.body;
//     await Users.findOne({username : data.username})
//     .exec()
//     .then( usr => {
//      	checkUser(usr, data, res, permissionRoleLevels["customer"])
//     })
//     .catch( err => {
//         res.status(500).json({message: "Username not found", error: err});
//     })
// })

// router.post('/login/staff', async (req, res)=>{
//     let data = req.body;
//     let rolePassed = req.query.role
//     let query = { username: data.username }
//     if (rolePassed) query.role = rolePassed
//     await Staffs.findOne(query)
//     .exec()
//     .then( empl => {
//         checkUser(empl, data, res, permissionRoleLevels[empl.role])
//     })
//     .catch( err => {
//         res.status(500).json({message: "No User found", error: err});
//     })
// })

// router.get('/publicKey', (req, res) => {
//     return res.status(200).json({ publicKey: publicKey.toString() })
// })

module.exports = router
module.exports.verifyPermission = verifyPermission
// module.exports.checkUser = checkUser
module.exports.generateToken = generateToken
module.exports.permissionRoleLevels = permissionRoleLevels


module.exports = router;
