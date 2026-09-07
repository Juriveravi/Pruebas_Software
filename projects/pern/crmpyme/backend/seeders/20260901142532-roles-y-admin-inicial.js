const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const roles = [
      {
        nombre: 'administrador',
        descripcion: 'Administrador del sistema',
      },
      {
        nombre: 'gerente',
        descripcion: 'Gerente de ventas',
      },
      {
        nombre: 'vendedor',
        descripcion: 'Vendedor',
      },
    ];

    for (const role of roles) {
      const [existingRole] = await queryInterface.sequelize.query(
        'SELECT id FROM roles WHERE nombre = :nombre',
        { replacements: { nombre: role.nombre } },
      );
      if (existingRole.length === 0) {
        await queryInterface.bulkInsert('roles', [{
          ...role,
          createdAt: new Date(),
          updatedAt: new Date(),
        }]);
      }
    }

    const [[admin]] = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE nombre = 'administrador'",
    );
    const [existingAdmin] = await queryInterface.sequelize.query(
      'SELECT id FROM usuarios WHERE correo = :correo',
      { replacements: { correo: 'admin@crm.local' } },
    );

    if (existingAdmin.length === 0) {
      const hash = await bcrypt.hash('Admin123', 10);
      await queryInterface.bulkInsert('usuarios', [{
        nombre: 'Administrador Inicial',
        correo: 'admin@crm.local',
        password_hash: hash,
        rol_id: admin.id,
        activo: true,
        intentos_fallidos: 0,
        created_at: new Date(),
        updated_at: new Date(),
      }]);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('usuarios', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  },
};