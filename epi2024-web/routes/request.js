var router = express.Router();

router.get('/', require('../subroutes/request'));

router.post('/refuse/:id', require('../subroutes/refuse'));

router.post('/accept/:id', require('../subroutes/accept'));

router.post('/download/:id', require('../subroutes/download'));

module.exports = router;
