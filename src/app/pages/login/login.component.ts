import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario:UsuarioModel  = new UsuarioModel()
  recordar = false
  private mensaje:string

  constructor(private auth:AuthService,private router:Router) { }

  ngOnInit() {
    if(localStorage.getItem('email')){
      this.usuario.email = localStorage.getItem('email')
      this.recordar = true
    }
  }

  login( loginForm:NgForm){
    if(loginForm.invalid){
      return
    }else{
      Swal.fire({
        allowOutsideClick:false,
        icon:'info',
        text:'Espere por favor...'
      })
      Swal.showLoading()

      this.auth.login(this.usuario).subscribe( resp => {
        Swal.close()

        if(this.recordar){
          localStorage.setItem('email',this.usuario.email)
        }

        this.router.navigateByUrl('/home')
      }, (err) => {

        if(err.error.error.message == "INVALID_PASSWORD"){
          this.mensaje = "contraseña incorrecta"
        }else{
          this.mensaje = "email incorrecto"
        }

        Swal.fire({
          allowOutsideClick:false,
          icon:'error',
          text:'Error al autenticar, ' + this.mensaje
        })
      })
    }
  }

}
