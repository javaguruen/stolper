const axios = require('axios')

const servestatic = require('serve-static')
const path = require('path')
const express = require('express')
const port = process.env.PORT || 3000
const router = express.Router()
const app = express()
router.get('/organizers', (req, res, next) => {
    console.log('called /stolpejakten')
    axios.get('https://apiv9.stolpejakten.no/organizers')
        .then(data => {
            // console.log('success from stolpejakten: ' + JSON.stringify(data.data));
            res.json(data.data)
        })
        .catch(err => res.send(err))
})
router.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    next()
})
app.use('/api', router)
app.use(servestatic(path.join(path.resolve(), 'dist')))
app.listen(port, () => {
    console.log('API server started on ' + app.get('port'))
})
