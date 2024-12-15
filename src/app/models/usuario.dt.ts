// user.dto.ts

export interface RolDTO {
    id: number;
    nombre: string;
    permisos: PermisoDTO[];
  }
  
  export interface PermisoDTO {
    codigo: number;
    nombre: string;
    authority: string;
  }
  
  export interface UsuarioDTO {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    fechaNacimiento: string;
    roles: RolDTO[];
    username: string;
    enabled: boolean;
    accountNonLocked: boolean;
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
  }
  