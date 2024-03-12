require('dotenv').config()
const express = require('express');
const router = express.Router();
const { Client } = require('pg');

const connectionData = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}

//GET all sabores
router.get('/sabores', (req, res) => {
    const client = new Client(connectionData);
    client.connect()
    .then(() => {
        return client.query('SELECT * FROM sabor;');
    })
    .then(result => {
        res.status(200).send(result.rows);
    })
    .catch(error => {
        console.error(error);
        res.status(400).send('Error');
    })
    .finally(() => {
        client.end();
    });
});

router.get('/modelos/sabor/:id', (req, res) => {
    const client = new Client(connectionData);
    client.connect()
    .then(() => {
        return client.query('select s.sabor from vape v inner join modelo m on v.fkid_modelo = m.id_modelo inner join sabor s on v.fkid_sabor = s.id_sabor where m.id_modelo = $1;', [req.params.id]);
    })
    .then(result => {
        res.status(200).send(result.rows);
    })
    .catch(error => {
        console.error(error);
        res.status(400).send('Error');
    })
    .finally(() => {
        client.end();
    });
})

//POST sabor
router.post('/sabor', (req, res) => {
    const client = new Client(connectionData);
    client.connect()
    .then(() => {
        return client.query('INSERT INTO sabor (sabor) VALUES ($1);', [req.body.sabor]);
    })
    .then(() => {
        res.status(200).send("sabor agregado");
    })
    .catch(error => {
        console.error(error);
        res.status(400).send('Error');
    })
    .finally(() => {
        client.end();
    });
});

//GET all modelos
router.get('/modelos', (req, res) => {
    const client = new Client(connectionData);
    client.connect()
    .then(() => {
        return client.query('SELECT md.*, m.marca FROM modelo md INNER JOIN marca m ON m.id_marca = md.fkid_marca;');
    })
    .then(result => {
        res.status(200).send(result.rows);
    })
    .catch(error => {
        console.error(error);
        res.status(400).send('Error');
    })
    .finally(() => {
        client.end();
    });
});


//GET all vapes
router.get('/vapes', (req, res) => {
    const client = new Client(connectionData);
    client.connect()
    .then(() => {
        return client.query('select v.*, s.sabor, m.modelo, mc.marca, m.precio from vape v inner join sabor s on v.fkid_sabor = s.id_sabor inner join modelo m on v.fkid_modelo = m.id_modelo inner join marca mc on m.fkid_marca = mc.id_marca;');
    })
    .then(result => {
        res.status(200).send(result.rows);
    })
    .catch(error => {
        console.error(error);
        res.status(400).send('Error');
    })
    .finally(() => {
        client.end();
    });
});

//GET single vape
router.get('/modelo/vape/:id', (req, res) => {
    const client = new Client(connectionData);
    client.connect()
    .then(() => {
        return client.query('select v.*, s.sabor, m.modelo, mc.marca, m.precio from vape v inner join sabor s on v.fkid_sabor = s.id_sabor inner join modelo m on v.fkid_modelo = m.id_modelo inner join marca mc on m.fkid_marca = mc.id_marca where m.id_modelo = $1;', [req.params.id]);
    })
    .then(result => {
        res.status(200).send(result.rows);
    })
    .catch(error => {
        console.error(error);
        res.status(400).send('Error');
    })
    .finally(() => {
        client.end();
    });
});

//GET all carritos
router.get('/carrito/vape', (req, res) => {
    const client = new Client(connectionData);
    client.connect()
    .then(() => {
        return client.query('select c.*, cv.*, v.*, s.sabor, m.modelo, m.precio, mc.marca from carrito_vape cv inner join carrito c on c.id_carrito = cv.fkid_carrito inner join vape v on v.id_vape = cv.fkid_vape inner join sabor s on v.fkid_sabor = s.id_sabor inner join modelo m on v.fkid_modelo = m.id_modelo inner join marca mc on m.fkid_marca = mc.id_marca order by id_carrito;');
    })
    .then(result => {
        res.status(200).send(result.rows);
    })
    .catch(error => {
        console.error(error);
        res.status(400).send('Error');
    })
    .finally(() => {
        client.end();
    });
});

//GET single carrito
router.get('/carrito/vape/:id', (req, res) => {
    const client = new Client(connectionData);
    client.connect()
    .then(() => {
        const idCarrito = req.params.id;
        return client.query('select c.*, cv.*, v.*, s.sabor, m.modelo, m.precio, mc.marca from carrito_vape cv inner join carrito c on c.id_carrito = cv.fkid_carrito inner join vape v on v.id_vape = cv.fkid_vape inner join sabor s on v.fkid_sabor = s.id_sabor inner join modelo m on v.fkid_modelo = m.id_modelo inner join marca mc on m.fkid_marca = mc.id_marca where c.id_carrito = $1;', [idCarrito]);
    })
    .then(result => {
        res.status(200).send(result.rows);
    })
    .catch(error => {
        console.error(error);
        res.status(400).send('Error');
    })
    .finally(() => {
        client.end();
    });
});


//PUT carrito
router.put('/carrito/vape', (req, res) =>{
    const client = new Client(connectionData);
    client.connect()
    .then(() =>{
        return client.query('insert into carrito_vape (fkid_carrito, fkid_vape, cantidad) values($1,$2,$3)', [req.body.id_carrito, req.body.id_vape, req.body.cantidad]);
    })
    .then(() =>{
        res.status(200).send("Vape agregado al carrito");
    })
    .catch(error => {
        console.log(error);
        res.status(400).send('Error');
    })
    .finally(() => {
        client.end();
    });
});

//GET all ordenes
router.get('/orden/vape', (req, res) => {
    const client = new Client(connectionData);
    client.connect()
    .then(() => {
        return client.query('select o.*, ov.*, v.*, s.sabor, m.modelo, m.precio, mc.marca from orden_vape ov inner join orden o on o.id_orden = ov.fkid_orden inner join vape v on v.id_vape = ov.fkid_vape inner join sabor s on v.fkid_sabor = s.id_sabor inner join modelo m on v.fkid_modelo = m.id_modelo inner join marca mc on m.fkid_marca = mc.id_marca order by id_orden;');
    })
    .then(result => {
        res.status(200).send(result.rows);
    })
    .catch(error => {
        console.error(error);
        res.status(400).send('Error');
    })
    .finally(() => {
        client.end();
    });
});

//GET single orden
router.get('/orden/vape/:id', (req, res) => {
    const client = new Client(connectionData);
    client.connect()
    .then(() => {
        const idOrden = req.params.id;
        return client.query('select o.*, ov.*, v.*, s.sabor, m.modelo, m.precio, mc.marca from orden_vape ov inner join orden o on o.id_orden = ov.fkid_orden inner join vape v on v.id_vape = ov.fkid_vape inner join sabor s on v.fkid_sabor = s.id_sabor inner join modelo m on v.fkid_modelo = m.id_modelo inner join marca mc on m.fkid_marca = mc.id_marca where o.id_orden = $1;', [idOrden]);
    })
    .then(result => {
        res.status(200).send(result.rows);
    })
    .catch(error => {
        console.error(error);
        res.status(400).send('Error');
    })
    .finally(() => {
        client.end();
    });
});

//POST orden
router.post('/orden', (req, res) => {
    const client = new Client(connectionData);
    client.connect()
    .then(() => {
        return client.query('call crear_orden ($1);', [req.body.id_user]);
    })
    .then(() => {
        res.status(200).send("orden agregada");
    })
    .catch(error => {
        console.error(error);
        res.status(400).send('Error');
    })
    .finally(() => {
        client.end();
    });
});



module.exports = router;