var router = express.Router();

router.get('/', require('../subroutes/request'));

router.post('/refuse', require('../subroutes/refuse'));

router.post('/accept', require('../subroutes/accept'));

router.post('/download', require('../subroutes/download'));

module.exports = router;
