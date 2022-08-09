import AHF from './lib';
import Router from './lib/router';


const app = new AHF('/api', '[MESTO]');

app.get('/test', (req, res) => {
	res.json(req.body);
});

const router = new Router('/test');

router.get('/a', (req, res) => {
	console.log(req.body);
	res.json({ test: 2 });
});


app.listen(8080, () => console.log('STARTED ON PORT 8080'));