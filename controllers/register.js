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
// Inscription d'un defunt + return LastId
exports.setDefunct = (req,res)=>{
    console.log('defunct')
    console.log('req:', req.body.data)
    const {firstname, lastname, birthdate, death_date,cemetery,city_birth,city_death,postal_code,user_id} = req.body.data
    const sql = 'INSERT INTO defuncts (firstname, lastname, birthdate, death_date,cemetery,city_birth,city_death,postal_code,user_id,date_crea) VALUES (?,?,?,?,?,?,?,?,?,NOW())'
    const values = [firstname, lastname, birthdate, death_date,cemetery,city_birth,city_death,postal_code,user_id]
    getQueryLastId(sql, values, res)
    .then(result => { res.json({ result })})
    .catch(err => {
        res.status(500).json({message:err})
    })
}
// Inscription d'un administrateur utilisateur de fiche défunt
exports.setUserAdmin = (req,res)=>{
    const {affinity,card_virtuel,card_real,user_id,defunct_id,flower} = req.body.data
    const sql = 'INSERT INTO user_admin (affinity,card_virtuel,card_real,user_id,defunct_id,flower,date_crea) VALUES (?,?,?,?,?,?,NOW())'
    const values = [affinity,card_virtuel,card_real,user_id,defunct_id,flower]
        // Create folder for Defunct if it not already exist
        const folderPath = `./images/photos/${defunct_id}`
        fs.access(folderPath, fs.constants.F_OK, (err) => {
            if (err && err.code === 'ENOENT') {
                fs.mkdir(folderPath, {mode:0o777}, (err)=>{
                    if(err){
                        console.log('Problème de création de dossier')
                    }
                })
            } 
        })
        setQuery(sql,values,res)
}