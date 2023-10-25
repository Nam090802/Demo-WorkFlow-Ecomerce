const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const port = process.env.PORT || 3000;

server.use(middlewares);
server.use(jsonServer.bodyParser);


server.get('/bills/:code', (req, res) => {
    const codeBill = req.params.code
    const bill = router.db.get('bills').find({ code: codeBill }).value()

    if (!bill) {
        res.status(404).json({ error: 'Item not found' });
    } else {
        res.json(bill);
    }
});

server.get('/bills', (req, res) => {
    const bills = router.db.get('bills').value();
    res.json(bills);
});


server.post('/bills', (req, res) => {
    const newBill = req.body;
    router.db.get('bills').push(newBill).write();
    res.status(201).json(newBill);
});

server.delete('/bills/:code', (req, res) => {
    const codeBill = req.params.code;
    router.db.get('bills').remove({ code: codeBill }).write();
    res.status(204).send();
});

server.listen(port)
