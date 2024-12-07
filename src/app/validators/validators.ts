import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";


export function atLeastOneRequiredValidator(group: FormGroup): ValidationErrors | null {
    const email = group.get('email')?.value;
    const telefono = group.get('telefono')?.value;
    return email || telefono ? null : { atLeastOneRequired: true };
}

export function birthDateValidator(group: FormGroup): ValidationErrors | null {
    const fechaNacimientoControl = group.get('fechaNacimiento');

    if (!fechaNacimientoControl) return null; // Si no hay campo, no se valida.

    const today = new Date();
    const birthDate = new Date(fechaNacimientoControl.value);

    if (birthDate >= today) {
        return { invalidBirthDate: true }; // Error que se asigna al formulario
    }

    return null;
}

export function passwordsMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const contrasena = group.get('contrasena')?.value;
    const confirmarcontrasena = group.get('confirmarcontrasena')?.value;
    if (contrasena && confirmarcontrasena && contrasena !== confirmarcontrasena) {
        return { contrasenaMismatch: true }; // Usa 'contrasenaMismatch' como error
    }
    return null;
}