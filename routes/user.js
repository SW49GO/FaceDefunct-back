const express = require('express')
const router = express.Router()

const registerCtrl = require('../controllers/register')
console.log('registerCtrl:', registerCtrl)
const updaterCtrl = require('../controllers/updater')
const deleterCtrl = require('../controllers/deleter')
const getInfosCtrl = require('../controllers/getInfos')
const globalCtrl = require('../controllers/globalRequest')
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer-config')



/**
 * Function to select and execute the right controller for each routes
 * @param {object} ctrlObj 
 * @returns response BDD
 */
function executeController(ctrlObj) {
    return function(req, res) {
        const { controller } = req.params
        const params = req.body
        const chosenController = ctrlObj[controller]

        if (!chosenController || typeof chosenController !== 'function') {
            return res.status(400).json({ message: 'Contrôleur invalide' })
        }
        chosenController(req, res, params)
    }
}

router.put('/register/:controller', auth, executeController(registerCtrl))

router.post('/registerFile', multer,(req,res)=>{
    
    if (req.file) {
        res.status(200).json({
            filename: req.file.filename,
            path: req.file.path
        })
    } else {
        console.log('No file uploaded')
    }
})

router.post('/updater/:controller', auth, executeController(updaterCtrl))
router.post('/deleter/:controller', auth, executeController(deleterCtrl))
router.post('/getInfos/:controller', auth, executeController(getInfosCtrl))
router.post('/signIn/:controller', executeController(registerCtrl))
router.post('/connect/:controller',executeController(globalCtrl))

module.exports = router