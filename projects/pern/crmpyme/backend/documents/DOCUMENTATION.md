# CRM PYMES - Documentacion del backend

## 1. Descripcion general

Este proyecto es el backend de un CRM para pequenas y medianas empresas. HU-01
es la primera capacidad implementada, pero la estructura esta pensada para
incorporar nuevas historias de usuario sin concentrar toda la logica en
`index.js` ni acoplar cada modulo entre si.

El backend expone una API HTTP construida con Express.js y utiliza PostgreSQL
como base de datos. Sequelize funciona como ORM para consultar las tablas y
Sequelize CLI administra las migraciones y los seeders.

Capacidades implementadas actualmente:

- Servidor HTTP en el puerto `3000`.
- Endpoint de comprobacion de disponibilidad.
- Endpoint de inicio de sesion.
- Validacion de contrasenas mediante bcrypt.
- Generacion de tokens JWT.
- Bloqueo temporal despues de cinco intentos fallidos.
- Bloqueo configurado actualmente por un minuto.
- Persistencia de usuarios, roles, intentos fallidos y fecha de bloqueo.
- Migraciones reproducibles para crear las tablas.
- Seeder inicial para roles y usuario de prueba.

Capacidades previstas para la evolucion del producto:

- Administracion de usuarios y roles.
- Gestion de clientes y contactos.
- Gestion de productos o servicios.
- Registro y seguimiento de oportunidades y ventas.
- Actividades, tareas y seguimiento comercial.
- Reportes y paneles por rol.
- Auditoria de cambios y notificaciones.

## 2. Tecnologias utilizadas

| Tecnologia | Uso |
| --- | --- |
| Node.js | Ejecuta el codigo JavaScript del servidor. |
| Express.js | Define el servidor HTTP, las rutas y el middleware JSON. |
| PostgreSQL | Base de datos relacional donde se almacenan roles y usuarios. |
| Neon | Proveedor de PostgreSQL utilizado por el proyecto mediante una URL de conexion. |
| Sequelize | ORM que permite trabajar con PostgreSQL usando modelos JavaScript. |
| Sequelize CLI | Herramienta para ejecutar migraciones y seeders desde la terminal. |
| bcrypt | Genera y compara hashes de contrasenas sin guardar la contrasena en texto plano. |
| jsonwebtoken | Firma tokens JWT despues de un inicio de sesion valido. |
| dotenv | Carga variables de entorno desde el archivo local de configuracion. |
| nodemon | Reinicia automaticamente el servidor durante el desarrollo. |

## 3. Dependencias del proyecto

Las dependencias estan declaradas en `package.json`.

### 3.1 Dependencias de ejecucion

#### `express`

Framework web para Node.js. Se utiliza para:

- Crear la instancia `app` del servidor.
- Registrar middleware como `express.json()`.
- Definir las rutas `GET /ping` y `POST /auth/login`.
- Enviar respuestas HTTP con sus respectivos codigos de estado.

#### `sequelize`

ORM utilizado para conectarse a PostgreSQL y ejecutar consultas mediante los
modelos `Usuario` y `Rol`. Tambien administra las asociaciones entre modelos.

#### `pg`

Driver de PostgreSQL para Node.js. Sequelize lo utiliza internamente para abrir
la conexion, enviar consultas SQL y recibir resultados.

#### `pg-hstore`

Dependencia del dialecto PostgreSQL de Sequelize. El proyecto no utiliza
columnas `hstore` directamente, pero el paquete forma parte de la configuracion
habitual del dialecto.

#### `dotenv`

Carga las variables definidas en `documents/.env` dentro de `process.env`. El
backend utiliza principalmente `DATABASE_URL` y `JWT_SECRET`.

#### `bcrypt`

Se utiliza en dos momentos:

1. El seeder genera un hash para la contrasena inicial del usuario.
2. El servicio compara la contrasena recibida con el hash almacenado mediante
	 `bcrypt.compare()`.

La contrasena original no se guarda en la base de datos.

#### `jsonwebtoken`

Genera un token firmado despues de autenticar correctamente al usuario. El
token incluye solamente los datos publicos `id`, `nombre` y `rol`, y tiene una
vigencia de ocho horas.

### 3.2 Dependencias de desarrollo

#### `nodemon`

Ejecuta el servidor y lo reinicia automaticamente cuando cambia un archivo.

#### `sequelize-cli`

Permite ejecutar comandos para:

- Crear y revertir migraciones.
- Crear y ejecutar seeders.
- Consultar el estado de las migraciones.

## 4. Estructura del proyecto

```text
backend/
|-- config/
|   `-- config.js
|-- documents/
|   |-- .env
|   |-- .gitignore
|   `-- DOCUMENTATION.md
|-- migrations/
|   |-- 20260901135630-create-rol.js
|   `-- 20260901140857-create-usuario.js
|-- models/
|   |-- index.js
|   |-- rol.js
|   `-- usuario.js
|-- seeders/
|   `-- 20260901142532-roles-y-admin-inicial.js
|-- src/
|   |-- modules/
|   |   `-- auth/
|   |       `-- auth.service.js
|   |-- utils/
|   |   `-- apiResponse.js
|   |-- middleware/
|   |-- routes/
|   `-- shared/
|-- index.js
|-- package.json
`-- package-lock.json
```

### Responsabilidad de cada parte

- `index.js`: punto de entrada del servidor y definicion de rutas HTTP.
- `src/modules/auth/auth.service.js`: reglas de negocio del login.
- `src/utils/apiResponse.js`: formato comun para respuestas exitosas y errores.
- `src/routes/`: rutas agrupadas por modulo cuando se incorporen nuevos casos de uso.
- `src/middleware/`: autenticacion JWT, autorizacion por rol, validacion y manejo de errores.
- `src/shared/`: utilidades transversales, constantes y configuracion compartida.
- `config/config.js`: configuracion de Sequelize para los entornos definidos.
- `models/index.js`: carga automaticamente los modelos y sus asociaciones.
- `models/rol.js`: modelo de la tabla `roles`.
- `models/usuario.js`: modelo de la tabla `usuarios`.
- `migrations/`: cambios estructurales de la base de datos.
- `seeders/`: datos iniciales o de prueba.
- `documents/.env`: configuracion local y secretos; no debe publicarse.


## 5. Instalacion y ejecucion

Los comandos deben ejecutarse desde la carpeta `backend`.

```powershell
cd C:\ruta\al\proyecto\projects\pern\crmpyme\backend
npm install
```

### Ejecutar en desarrollo

```powershell
node index.js
```

### Ejecutar normalmente

```powershell
npm start
```

El servidor queda disponible en:

```text
http://localhost:3000
```

Es importante no ejecutar `node index.js` desde la carpeta contenedora
`crmpyme` ni desde `Pruebas_Software`; el comando debe ejecutarse dentro de
`backend` para que Node encuentre `index.js` y `node_modules`.

## 6. Variables de entorno

El proyecto lee el archivo `documents/.env`. Ese archivo no debe subirse al
repositorio porque contiene informacion privada.

Variables requeridas:

```env
DATABASE_URL=<cadena privada de conexion a PostgreSQL>
JWT_SECRET=<secreto largo y aleatorio para firmar tokens>
```

No se documentan aqui los valores reales de estas variables.

El archivo `documents/.gitignore` excluye `.env`, `node_modules`, `dist` y
`build` para reducir el riesgo de publicar secretos o archivos generados.

## 7. Conexion con la base de datos

La conexion se configura en `config/config.js`:

- El dialecto es `postgres`.
- Sequelize obtiene la URL desde `DATABASE_URL`.
- La conexion utiliza SSL, necesario para el servicio PostgreSQL remoto.
- El entorno utilizado por defecto es `development`.

`models/index.js` realiza el siguiente proceso:

1. Lee el entorno definido en `NODE_ENV`, o usa `development` si no existe.
2. Carga la configuracion correspondiente.
3. Crea la instancia de Sequelize.
4. Lee los archivos JavaScript de `models/`.
5. Registra los modelos encontrados.
6. Ejecuta sus asociaciones.
7. Exporta `Usuario`, `Rol`, `sequelize` y `Sequelize`.

La aplicacion no utiliza `sequelize.sync()` para crear tablas automaticamente.
La estructura se crea y modifica mediante migraciones versionadas.


## 8. Migraciones y seeders

### Verificar el estado de migraciones

```powershell
npx sequelize-cli db:migrate:status
```

### Ejecutar migraciones

```powershell
npx sequelize-cli db:migrate
```

Esto crea las tablas `roles` y `usuarios` y registra cada migracion en la tabla
de control `SequelizeMeta`.

### Revertir la ultima migracion

```powershell
npx sequelize-cli db:migrate:undo
```

### Revertir todas las migraciones

```powershell
npx sequelize-cli db:migrate:undo:all
```

No se debe volver a ejecutar `model:generate` para corregir una migracion ya
creada. La migracion existente debe editarse con cuidado, y si ya fue ejecutada
debe revertirse antes de volver a aplicarla.

### Ejecutar el seeder

```powershell
npx sequelize-cli db:seed:all
```

El seeder:

1. Inserta los tres roles si aun no existen.
2. Busca el rol administrador.
3. Comprueba si el usuario inicial ya existe.
4. Si no existe, crea el usuario con un hash bcrypt.

El seeder esta escrito para no duplicar roles ni el usuario inicial cuando se
ejecuta nuevamente.

### Revertir seeders

```powershell
npx sequelize-cli db:seed:undo:all
```

## 9. API HTTP

### 9.1 Comprobar el servidor

```text
GET http://localhost:3000/ping
```

Respuesta:

```text
pong
```

### 9.2 Iniciar sesion

```text
POST http://localhost:3000/auth/login
```

Header requerido:

```text
Content-Type: application/json
```

Body de ejemplo sin informacion sensible del entorno:

```json
{
	"correo": "<correo-de-prueba>",
	"password": "<contrasena-de-prueba>"
}
```

Respuesta exitosa, HTTP `200`:

```json
{
	"success": true,
	"data": {
		"token": "<jwt-generado>",
		"usuario": {
			"id": 1,
			"nombre": "<nombre>",
			"rol": "<rol>"
		}
	}
}
```

La respuesta no incluye `passwordHash`.

## 10. Codigos de respuesta

| HTTP | Codigo | Situacion |
| ---: | --- | --- |
| 200 | - | Login exitoso o respuesta normal. |
| 400 | `DATOS_FALTANTES` | Falta `correo` o `password`. |
| 401 | `CREDENCIALES_INVALIDAS` | El correo no existe o la contrasena es incorrecta. |
| 423 | `CUENTA_BLOQUEADA` | Se alcanzaron cinco intentos fallidos o la cuenta sigue bloqueada. |
| 500 | `ERROR_INTERNO` | Error no controlado del servidor. |

Respuesta de error:

```json
{
	"success": false,
	"error": {
		"code": "CREDENCIALES_INVALIDAS",
		"message": "Correo o contrasena incorrectos"
	}
}
```

## 11. Flujo de autenticacion

1. Express recibe `POST /auth/login`.
2. Se valida que `correo` y `password` esten presentes.
3. `auth.service.js` busca el usuario por correo e incluye su rol.
4. Si el usuario no existe, responde `401` con un mensaje generico.
5. Si existe un bloqueo vigente, responde `423`.
6. bcrypt compara la contrasena recibida con `password_hash`.
7. Si la contrasena es incorrecta, incrementa `intentos_fallidos`.
8. En el quinto fallo, guarda un bloqueo de un minuto y responde `423`.
9. Si la contrasena es correcta, reinicia los intentos y elimina el bloqueo.
10. Se crea un JWT con una vigencia de ocho horas.
11. Se devuelve el token y los datos publicos del usuario.

La aplicacion utiliza el mismo mensaje para correo inexistente y contrasena
incorrecta, evitando revelar si una cuenta esta registrada.


## 12. Seguridad y buenas practicas

- No subir `documents/.env` al repositorio.
- No escribir la URL de PostgreSQL ni `JWT_SECRET` en esta documentacion.
- No guardar contrasenas en texto plano.
- Usar un `JWT_SECRET` largo, aleatorio y diferente por entorno.
- Cambiar las credenciales de prueba antes de un despliegue real.
- Mantener respuestas genericas para errores de autenticacion.
- No exponer `passwordHash` en las respuestas de la API.
- Usar HTTPS en ambientes publicados.
- Revisar y actualizar dependencias con regularidad.


## 13. Comandos de referencia

```powershell
# Instalar dependencias
npm install

# Desarrollo con reinicio automatico
npm run dev

# Ejecucion normal
npm start

# Estado de migraciones
npx sequelize-cli db:migrate:status

# Aplicar migraciones
npx sequelize-cli db:migrate

# Ejecutar datos iniciales
npx sequelize-cli db:seed:all

# Revertir todos los seeders
npx sequelize-cli db:seed:undo:all
```

