import { login } from './authApi';

const { postMock } = vi.hoisted(() => ({
  postMock: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      post: postMock,
    })),
  },
}));

describe('authApi.login', () => {
  it('envía las credenciales y devuelve los datos de autenticación', async () => {
    postMock.mockResolvedValueOnce({
      data: {
        data: {
          token: 'token-api',
          usuario: { id: 1, nombre: 'Admin', rol: 'admin' },
        },
      },
    });

    await expect(login('admin@pymeflow.com', 'Admin123')).resolves.toEqual({
      token: 'token-api',
      usuario: { id: 1, nombre: 'Admin', rol: 'admin' },
    });
    expect(postMock).toHaveBeenCalledWith('/auth/login', {
      correo: 'admin@pymeflow.com',
      password: 'Admin123',
    });
  });

  it('propaga el error de la API para que la interfaz lo muestre', async () => {
    const error = { response: { data: { error: 'Cuenta bloqueada' } } };
    postMock.mockRejectedValueOnce(error);

    await expect(login('admin@pymeflow.com', 'incorrecta')).rejects.toBe(error);
  });
});
