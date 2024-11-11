import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServicioGeneralService } from 'src/app/Service/servicio-general.service';
import { Usuario } from 'src/app/models/modelos';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [NgbActiveModal]
})
export class RegisterComponent implements OnInit {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: ServicioGeneralService,
    private router: Router, // Agregar el Router
    public modal: NgbActiveModal
  ) {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  get formControls() {
    return this.userForm.controls;
  }

  onSubmit() {
    // Marcar todos los campos como tocados para que se muestren los errores
    this.userForm.markAllAsTouched();
  
    // Si el formulario es inválido, no se envía
    if (this.userForm.invalid) {
      return;
    }
  
    const userData: Usuario = this.userForm.value;
  
    this.userService.saveuser(userData).subscribe(
      () => {
        // Mensaje de éxito utilizando Swal.fire
        Swal.fire({
          icon: 'success',
          title: '¡Registro Exitoso!',
          text: `El usuario ${userData.nombre} ha sido registrado correctamente.`,
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirigir al login
            this.router.navigate(['/login']);
          }
        });
        
        this.close();
        this.userForm.reset();
      },
      error => {
        // Mensaje de error utilizando Swal.fire
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al añadir el usuario. Por favor, inténtalo de nuevo.',
        });
        console.error('Error adding user:', error);
      }
    );
  }
  
  close() {
    this.modal.dismiss();
  }
}
