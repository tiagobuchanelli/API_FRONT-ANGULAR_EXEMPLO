import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidator } from 'src/app/validators/custom.validator';
import { Security } from 'src/app/utils/security.util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']

})
export class LoginPageComponent implements OnInit {
  public form: FormGroup;
  public busy = false;


  //colocar pouca coisa no construtor pois enquanto a tela nao é montada a aplicação fica bloqueada.
  constructor(
    private service: DataService,
    private fb: FormBuilder,
    private router: Router
  ) {
    //poderia ser no OnInit
    this.form = this.fb.group({
      username: ['', Validators.compose([
        Validators.minLength(14),
        Validators.maxLength(14),
        Validators.required,
        CustomValidator.isCpf()
      ])],
      password: ['', Validators.compose([
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.required
      ])]
    });
  }

  ngOnInit(): void {
    const token = Security.getToken();
    if (token) {
      this.busy = true; //diz que esta acupado
      this.service
        .refreshToken()
        .subscribe((data: any) => {
          this.busy = false;
          this.setUser(data.customer, data.token); //customer porque é o nome no JSON: https://prnt.sc/u8ia4t
        },
          (err) => {
            //possibilidade é token estar expirado por exemplo.
            localStorage.clear();
            this.busy = false;

          })
    }


  }

  submit() {
    //LOCAIS DE ARMAZENAMENTO DE INFORMAÇÕES
    //1 - variavel global: Salva numa variavel da memoria (mas ao dar f5 perde os dados e precisa logar novamente)
    //2 - session storage: Função do Browser e armazena dados permanente. Vale enquanto a sessao estiver aberta (janela aberta)
    //3 - local storage: Função do Browser e armazena dados permanente. Nao perde o token, mesmo reiniciano a máquina.

    this.busy = true; //diz que esta acupado
    this.service
      .authenticate(this.form.value)
      .subscribe((data: any) => {
        this.busy = false;
        this.setUser(data.customer, data.token); //customer porque é o nome no JSON: https://prnt.sc/u8ia4t
      },
        (err) => {
          //possibilidade é token estar expirado por exemplo.
          localStorage.clear();
          this.busy = false;

        })
  }

  setUser(user, token) {
    Security.set(user, token);
    this.router.navigate(['/']);

  }
}
