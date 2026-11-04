export interface CartItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  imgUrl: string | any;
}

export interface CartState {
  cartItems: CartItem[];
  totalAmount: number;
  totalQuantity: number;
}