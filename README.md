Considerações

**PROCEDIMENTO PARA UTILIZAR MOEDA EM R$0.000,00**

```ts
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

@NgModule({
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
})
export class AppModule { }
```

**Arquivos CSS**
Podem ser utilizado qualquer framework, ex: Bootstrap, Bluma, UIKit, etc..
Armazenar os arquivos CSS/JS na pasta ‘assets’ e chamá-los na página index.html

**Armazenar dados localmente**
Utilizar recurso de armazenamento local, como: LocalStorage e SessionStorage.
Ex: 
Criar arquivos Utils para salvar os dados do carrinho ou do usuário em uma aplicação.
```ts
import { User } from "../models/user.model";

export class Security {
    //utilizar static pra não precisar instanciar toda hora
    public static set(user: User, token: string) {
        const data = JSON.stringify(user);

        localStorage.setItem('petshopuser', btoa(data));
        localStorage.setItem('petshoptoken', token);
    }

    public static setUser(user: User) {
        const data = JSON.stringify(user);
        localStorage.setItem('petshopuser', btoa(data));
    }

    public static setToken(token: string) {
        localStorage.setItem('petshoptoken', token);
    }

    public static getUser(): User {
        const data = localStorage.getItem('petshopuser');
        if (data) {
            return JSON.parse(atob(data));
        } else {
            return null;
        }
    }

    public static getToken(): string {
        const data = localStorage.getItem('petshoptoken');
        if (data) {
            return data;
        } else {
            return null;
        }
    }

    public static hasToken(): boolean {
        if (this.getToken())
            return true;
        else
            return false;
    }

    //Exclui os usuarios
    //Se precisar excluir apenas uma das informações, criar mais de um clear
    public static clear() {
        localStorage.removeItem('petshopuser');
        localStorage.removeItem('petshoptoken');
    }
}
```

**Arquivos Service**
Local para fazer todas as chamadas para a API
ex: Login, Cadastros, Consultas, etc…
Sempre que for criado um serviço, chamar no app.module.ts em PROVIDERS:[]

**CanActivate + Service**
Criar um serviço baseado em CanActivate para restringir o acesso as rotas
ex:
```ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router'
import { Security } from '../utils/security.util';

@Injectable()
export class AuthService implements CanActivate {

    constructor(
        private router: Router
    ) { }

    canActivate() {
        const token = Security.getToken();
        if (!token) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }
}

e utilizar:
const routes: Routes = [
  {
    path: '',
    component: FramePageComponent,
    children: [
      { path: '', component: ProductsPageComponent },
      { path: 'cart', component: CartPageComponent, canActivate: [AuthService] } //CanActivate na rota especifica
    ]
  },
  {
    path: 'account',
    component: FramePageComponent,
    canActivate: [AuthService], //CanActivate na rota principal
    children: [
      { path: '', component: ProfilePageComponent },
      { path: 'pets', component: PetsPageComponent }
    ]
  },
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignUpPageComponent },
  { path: 'reset-password', component: ResetPasswordPageComponent },
];
```

**NavBar - Exibir em telas especificas**
Trabalhar com o conceito de FramePage ou Página Mestre.
Criar uma página mestre e dentro dela vincular a AppBar-Nav
```ts
import { Component } from '@angular/core';

@Component({
    selector: 'app-frame-page',
    template: '<app-navbar></app-navbar><router-outlet></router-outlet>',
})
export class FramePageComponent {

}

E ao chamar as rotas adicionar o frame: 
const routes: Routes = [
  {
    path: '',
    component: FramePageComponent,
    children: [
      { path: '', component: ProductsPageComponent },
      { path: 'cart', component: CartPageComponent, canActivate: [AuthService] } //CanActivate na rota especifica
    ]
  },
  {
    path: 'account',
    component: FramePageComponent,
    canActivate: [AuthService], //CanActivate na rota principal
    children: [
      { path: '', component: ProfilePageComponent },
      { path: 'pets', component: PetsPageComponent }
    ]
  },
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignUpPageComponent },
  { path: 'reset-password', component: ResetPasswordPageComponent },
];
```
Nesse caso como o primeiro componente que será chamado será a FramePage.ts a NavBar estará sempre presente, e dentro tera a tag de rotas '<router-outlet></router-outlet>’.
Em telas que não precisa da NavBar basta chamar sem o component FramePage.ts.


**Componentes**
Sempre que for criado um componente, o mesmo deverá ser chamado em app.module.ts, em DECLARATIONS:[]

**Tipagem de dados**
Sempre que possível tipar os dados
ex:
```ts
export class Product {
    public _id: string;
    public title: string;
    public category: string;
    public description: string;
    public price: number;
    public images: string[] = [];
}
```

**Rotas**
Sempre que optar por utilizar o schema de rotas, as tags de redirecionamento precisam mudar:
```ts
De: <a href="signup”</a>
Para: <a [routerLink]="['/signup’]”</a>

## Screenshot

| Dashboard  | CartShop | Login
| ------------- | ------------- | ------------- |
| ![Screenshot_Dashboard](https://user-images.githubusercontent.com/7735662/83012674-1c110180-9ff2-11ea-9d44-ca319c2fd228.jpg)  | ![Screenshot_Cart](https://user-images.githubusercontent.com/7735662/91672794-d68b3580-eb06-11ea-9809-abc68458ff85.png)  
