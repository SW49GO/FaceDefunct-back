const {setQuery, getQuery} = require('../config/connectBDD')

// Mise à jour de la date et heure de connexion
exports.updateNewLogin = (req,res) =>{
    const {id} = req.body
    const sql = 'UPDATE users SET new_log=NOW() WHERE id = ?'
    const values = [id]
    setQuery(sql,values,res)
}

// Transfer de la dernière date de connexion vers last_log
exports.updateLastLogin = (req,res) =>{
    const {id} = req.body
    console.log('req.bodyUPDATELOGIN:', req.body)
    const sql = 'SELECT new_log FROM users WHERE id=?'
    const values = [id]
    getQuery(sql,values,res)
    .then(result => {
        const last_log = result[0].new_log
        const sql1 = 'UPDATE users SET last_log=? WHERE id = ?'
        const values1= [last_log, id]
        setQuery(sql1,values1,res)
    })
    .catch(err => {
        res.status(500).json({message:err})
    })
}
// Mise à jour du status "online" pour le tchat
exports.updateOnline = (req,res) =>{
    const {id} = req.body
    const data = req.body.data
    // console.log('req.bodyONLINE:', data)
    const sql = 'UPDATE users SET online=? WHERE id=?'
    const values = [data, id]
    setQuery(sql,values,res)
}