const express = require('express');

const app = express();
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Raiz del servidor');
});


app.post('/auth/login', (req, res) => { 
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y password son obligatorios' });
    }
    res.json({ mensajeDePrueba: 'Recibí estos datos', email, password  });

});
app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});