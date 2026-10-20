import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

describe('AuthContext', () => {
  it('recupera el usuario persistido al iniciar la aplicación', () => {
    const usuario = { id: 1, nombre: 'Vendedor', rol: 'vendedor' };
    localStorage.setItem('usuario', JSON.stringify(usuario));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.usuario).toEqual(usuario);
  });

  it('persiste el token y actualiza el usuario al iniciar sesión', () => {
    const usuario = { id: 2, nombre: 'Gerente', rol: 'gerente' };
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.iniciarSesion('token-gerente', usuario);
    });

    expect(result.current.usuario).toEqual(usuario);
    expect(localStorage.getItem('token')).toBe('token-gerente');
    expect(JSON.parse(localStorage.getItem('usuario'))).toEqual(usuario);
  });
});
