// user.dto.ts

export interface RoleDTO {
    id: number;
    nombre: string;
    permisos: PermissionDTO[];
  }
  
  export interface PermissionDTO {
    codigo: number;
    nombre: string;
    authority: string;
  }
  
  export interface UserDTO {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    fechaNacimiento: string;
    roles: RoleDTO[];
    username: string;
    enabled: boolean;
    accountNonLocked: boolean;
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
  }
  