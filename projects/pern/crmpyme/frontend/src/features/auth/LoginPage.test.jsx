import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../../App';
import { AuthProvider } from '../../context/AuthContext';
import { login } from '../../api/authApi';

vi.mock('../../api/authApi', () => ({
  login: vi.fn(),
}));

function renderApp(initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('HU-01: inicio de sesión', () => {
  it('inicia sesión, persiste la sesión y redirige según el rol', async () => {
    login.mockResolvedValueOnce({
      token: 'token-de-prueba',
      usuario: { id: 1, nombre: 'Administrador', rol: 'admin' },
    });
    const user = userEvent.setup();

    renderApp();
    await user.type(screen.getByLabelText('Correo'), 'admin@pymeflow.com');
    await user.type(screen.getByLabelText('Contraseña'), 'Admin123');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(login).toHaveBeenCalledWith('admin@pymeflow.com', 'Admin123');
    expect(localStorage.getItem('token')).toBe('token-de-prueba');
    expect(JSON.parse(localStorage.getItem('usuario'))).toEqual({
      id: 1,
      nombre: 'Administrador',
      rol: 'admin',
    });
    expect(await screen.findByRole('heading', { name: 'Dashboard Admin' })).toBeInTheDocument();
  });

  it('muestra el error devuelto por la API con credenciales inválidas', async () => {
    login.mockRejectedValueOnce({
      response: { data: { error: 'Correo o contraseña incorrectos' } },
    });
    const user = userEvent.setup();

    renderApp();
    await user.type(screen.getByLabelText('Correo'), 'invalido@pymeflow.com');
    await user.type(screen.getByLabelText('Contraseña'), 'incorrecta');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(await screen.findByText('Correo o contraseña incorrectos')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument();
  });

  it('envía el formulario aunque la API falle sin respuesta HTTP', async () => {
    login.mockRejectedValueOnce(new Error('Network error'));

    renderApp();
    fireEvent.submit(screen.getByRole('button', { name: 'Ingresar' }).closest('form'));

    await waitFor(() => {
      expect(screen.getByText('Error al iniciar sesión')).toBeInTheDocument();
    });
  });
});
