const {setQuery, getQueryLastId} = require('../config/connectBDD')
const fs = require('fs')
const bcrypt = require('bcrypt')


// Inscritpion d'un utilisateur dans la BBD + return LastId
exports.setRegister = (req, res) => {
 // Récupérer les données de la requête
    let { firstname, lastname, email, password,pseudo,number_road,address,postal_code,city } = req.body
    console.log(req.body)
    bcrypt.hash(password, 10, function(err, hash) {
        console.log('hash:', hash)
        const token = hash
         // Requête SQL pour insérer un nouvel utilisateur
        const sql = 'INSERT INTO users (firstname, lastname, email, password,pseudo,number_road,address,postal_code,city,date_crea, new_log) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), NOW())'
        const values = [firstname, lastname, email, token, pseudo,number_road,address,postal_code,city]
         // Exécuter la requête SQL
        getQueryLastId(sql, values, res)
        .then(result => { 
            // Create folder for User
            const folderPath = `./images/users/${result}`
            fs.mkdir(folderPath, {mode:0o777}, (err)=>{
                if(err){
                    console.log('Problème de création de dossier')
                }
            })
            res.json({ result, token })})
        .catch(err => {
            res.status(500).json({message:err})
        })
    })
}
