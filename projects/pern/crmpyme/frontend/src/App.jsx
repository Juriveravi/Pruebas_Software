import { useState, useEffect } from 'react';
import axios from 'axios';
function App() {
 const [correo, setCorreo] = useState('');
 const [password, setPassword] = useState('');
 useEffect(() => {
 axios.get('http://localhost:3000/ping')
 .then((r) => console.log('ping ok:', r.data))
 .catch((e) => console.error(e));
 }, []);
 return (
 <div>
 <h1>CRM PYMES — Iniciar sesión</h1>
 <input
 type="email"
 placeholder="Ingrese su correo"
 value={correo}
 onChange={(e) => setCorreo(e.target.value)}
 />
 <input
 type="password"
 placeholder="Ingrese su contraseña"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 />
 <p>Correo escrito: {correo}</p>
 <p>Password escrito: {password}</p>
 </div>
 );
}
export default App;
