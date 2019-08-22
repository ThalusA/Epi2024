var router = express.Router();

router.get('/', require('../subroutes/index'));

router.post('/validate', require('../subroutes/validate'));

router.post('/submit', require('../subroutes/submit'));

module.exports = router;
