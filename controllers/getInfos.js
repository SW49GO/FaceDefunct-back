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