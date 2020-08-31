import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidator } from 'src/app/validators/custom.validator';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  public form: FormGroup;
  public busy = false;

  constructor(
    private router: Router,
    private service: DataService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      //no campo entre '' poderia ser informado os dados do campo, mas quando mais dados mais vai demorar pra carregar. Deixar apenas para construção. 
      //o melhor local para preencher os dados do formulario é o ngOnInit
      name: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(80),
        Validators.required
      ])],
      document: [{ value: '', disabled: true }], //apenas exibir, sem valdiação e edição
      email: ['', Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(120),
        Validators.required,
        CustomValidator.EmailValidator //não precisa ser CustomValidator.EmailValidator pois não é função
      ])],
    });
  }

  ngOnInit(): void {
    this.busy = true;
    //this.form.disable(); alternativa ao busy para desabilitar enquanto carrega, e depois so this.form.enable() 
    this.service
      .getProfile()
      .subscribe((data: User) => {
        this.busy = false;
        this.form.controls['name'].setValue(data.name);
        this.form.controls['document'].setValue(data.document);
        this.form.controls['email'].setValue(data.email);

      },
        (err) => {
          console.log(err);
          this.busy = false;
        });
  }

  submit() {
    this.busy = true;
    this.service
      .updateProfile(this.form.value)
      .subscribe((data: any) => {
        this.busy = false;
        this.toastr.success(data.message, 'Atualização Completa');
      },
        (err) => {
          console.log(err);
          this.busy = false;
        });
  }

}
