const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../../../models');

const BLOQUEO_MINUTOS = 1;
const MAXIMOS_INTENTOS = 5;

function authError(status, code, message) {
  return { status, code, message };
}

async function login(correo, password) {
  const usuario = await Usuario.findOne({ where: { correo }, include: Rol });

  if (!usuario) {
    throw authError(401, 'CREDENCIALES_INVALIDAS', 'Correo o contraseña incorrectos');
  }

  if (usuario.bloqueadoHasta && usuario.bloqueadoHasta > new Date()) {
    const minutos = Math.ceil((usuario.bloqueadoHasta - new Date()) / 60000);
    throw authError(423, 'CUENTA_BLOQUEADA', `Cuenta bloqueada. Intenta en ${minutos} minuto(s).`);
  }

  const passwordValido = await bcrypt.compare(password, usuario.passwordHash);

  if (!passwordValido) {
    const nuevosIntentos = usuario.intentosFallidos + 1;
    const bloqueado = nuevosIntentos >= MAXIMOS_INTENTOS;

    await usuario.update({
      intentosFallidos: bloqueado ? 0 : nuevosIntentos,
      bloqueadoHasta: bloqueado
        ? new Date(Date.now() + BLOQUEO_MINUTOS * 60000)
        : null,
    });

    if (bloqueado) {
      throw authError(
        423,
        'CUENTA_BLOQUEADA',
        `Cuenta bloqueada. Intenta en ${BLOQUEO_MINUTOS} minuto(s).`,
      );
    }

    throw authError(401, 'CREDENCIALES_INVALIDAS', 'Correo o contraseña incorrectos');
  }

  await usuario.update({ intentosFallidos: 0, bloqueadoHasta: null });

  const usuarioPublico = {
    id: usuario.id,
    nombre: usuario.nombre,
    rol: usuario.Rol.nombre,
  };
  const token = jwt.sign(usuarioPublico, process.env.JWT_SECRET, { expiresIn: '8h' });

  return { token, usuario: usuarioPublico };
}

module.exports = { login };
