const jsonServer = require('json-server');

const db = {
    garage: [
        {
            "name": "Toyota Supra",
            "color": "#f74d28",
            "id": 1,
        },
        {
            "name": "Nissan Skyline",
            "color": "#0746e8",
            "id": 2,
        },
        {
            "name": "Dodge Charger",
            "color": "#1c1b19",
            "id": 3,
        },
        {
            "name": "BMW M3",
            "color": "#fede00",
            "id": 4,
        },
    ],
    winners: [
        {
            id: 1,
            wins: 1,
            time: 10,
        }
    ]
};

const server = jsonServer.create();
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();

const port = process.env.PORT || 3000

const state = { velocity: {}, blocked: {} };

server.use(middlewares);

server.patch('/engine', (req, res) => {
    const { id, status } = req.query;

    if (!id || !status || !/^(started)|(stopped)|(drive)$/.test(status)) {
        return res.status(400).send('Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"');
    }

    if (!db.garage.find(car => car.id === +id)) {
        return res.status(404).send('Car with such id was not found in the garage.')
    }

    const distance = 500000;
    if (status === 'drive') {
        const velocity = state.velocity[id];

        if (!velocity) return res.status(404).send('Engine parameters for car with such id was not found in the garage. Have you tried to set engine status to "started" before?');
        if (state.blocked[id]) return res.status(429).send('Drive already in progress. You can\'t run drive for the same car twice while it\'s not stopped.');
        
        state.blocked[id] = true;

        const x = Math.round(distance / velocity);

        if (new Date().getMilliseconds() % 3 === 0) {
            setTimeout(() => {
                delete state.velocity[id];
                delete state.blocked[id];
                res.header('Content-Type', 'application/json').status(500).send('Car has been stopped suddenly. It\'s engine was broken down.');
            }, Math.random() * x ^ 0);
        } else {
            setTimeout(() => {
                delete state.velocity[id];
                delete state.blocked[id];
                res.header('Content-Type', 'application/json').status(200).send(JSON.stringify({ success: true }));
            }, x);
        }
    } else {
        const x = req.query.speed ? +req.query.speed : Math.random() * 2000 ^ 0;

        const velocity = status === 'started' ? Math.max(50, Math.random() * 200 ^ 0) : 0;

        if (velocity) {
            state.velocity[id] = velocity;
        } else {
            delete state.velocity[id];
            delete state.blocked[id];
        }

        setTimeout(() => res.header('Content-Type', 'application/json').status(200).send(JSON.stringify({ velocity, distance })), x);
    }
});

server.use(router);
server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`);
});