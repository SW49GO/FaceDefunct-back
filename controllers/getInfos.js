const {getQuery} = require('../config/connectBDD')

exports.getUserData = (req, res) => {

    let { id } = req.body
    console.log('req.body:', req.body)
    if(req.body.other){
        id = req.body.other
    }
    const sql1 = 'SELECT id, email, firstname, lastname, number_road, address, city, postal_code, pseudo, photo, last_log FROM users WHERE id=?'
    const sql2 = 'SELECT affinity, add_share, email_share, card_real, card_virtuel, flower, defunct_id FROM user_admin WHERE user_id=?'
  
    getQuery(sql1,[id], res)
    .then(result => {
        let userData = result
        getQuery(sql2, [id], res)
        .then(result2=>{
            result2.forEach(item => {
                userData.push(item)
            })
            console.log(userData)
            res.json({ userData })
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({message:'Erreur'})
        })
    })
    .catch(err => {
        res.status(500).json({message:err})
    })
}

// Récupération les infos de tout les défunts d'un utilisateur
exports.getUserDefunctList = (req,res) =>{
    const {id} = req.body
    const sql = 'SELECT id, lastname, firstname, birthdate, death_date, cemetery, city_birth, city_death, postal_code, photo FROM defuncts WHERE user_id=?'
    getQuery(sql,[id],res)
    .then(result => { res.json({ result })})
    .catch(err => {
        res.status(500).json({message:err})
    })
}
// Liste des amis enregistrée
exports.getFriendsList = (req,res) =>{
    const { id }= req.body
    // console.log('req.bodyFRIENDS:', req.body)
    // console.log('idFriends:', id)
    const sql = 'SELECT friend_id, user_id, date_crea, validate FROM friends WHERE user_id=? OR friend_id=?'
    getQuery(sql,[id, id],res)
    .then(result => { res.json({ result })})
    .catch(err => {
        res.status(500).json({message:err})
    })
}

// Liste des demande d'amis depuis la dernière connexion avec jointure pour ses informations
exports.getAskFriend = (req,res) =>{
    const {id}= req.body
    const sql = 'SELECT last_log FROM users WHERE id=?'
    getQuery(sql,[id],res)
    .then(result => { 
        if(result.length>0){
            const last_log = result[0].last_log
            const sql = 'SELECT user_id, validate, users.lastname, users.firstname FROM friends INNER JOIN users ON users.id=friends.user_id WHERE friend_id=? AND friends.date_crea < ?'
            getQuery(sql,[id,last_log],res)
            .then(friends => { res.json({ friends })})
            .catch(err => {
                res.status(500).json({message:err})
            })
        }
    })
    .catch(err => {
        res.status(500).json({message:err})
    })
}

// Nombre de message depuis la dernière connexion
exports.getNewTchat = (req,res) =>{
    const {user_id} = req.body
    const sql = 'SELECT user_id FROM tchat WHERE friend_id=? AND `read` = 0 GROUP BY user_id'
    getQuery(sql,[user_id],res)
    .then(result => { res.json({ result })})
    .catch(err => {
        res.status(500).json({message:err})
    })
}