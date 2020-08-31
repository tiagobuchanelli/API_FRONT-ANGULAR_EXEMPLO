import { CartItem } from './cart.item.model';

export class Cart {
    constructor(
        public items: CartItem[] = [] //ja inicializa para poder conseguir adicionar itens la no cart.util.ts
    ) {

    }
}