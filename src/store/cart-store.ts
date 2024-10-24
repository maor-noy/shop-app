import { create } from "zustand"; 

// Define the types for the cart item, cart state, and the cart store
type CartItemType = {
    id:number;
    title:string;
    price:number;
    heroImage: string;
    quantity: number;
    maxQuantity: number;
};

// Define the cart state
type CartState = {
    items: CartItemType[];
    addItem: (item: CartItemType) => void;
    removeItem: (id: number) => void;
    increaseItem: (id: number) => void;
    decreaseItem: (id: number) => void;
    getTotalPrice: ()=>string;
    getItemCount: ()=>number;
    resetCart: ()=>void;
};

const initialCartItems: CartItemType[] = [];

export const useCartStore = create<CartState>((set, get) => ({
    items: initialCartItems,

    addItem: (item: CartItemType) => {
        const existingItem = get().items.find((i) => i.id === item.id);
        //if there is an existing item, update the quantity based on the max quantity of the product
        if (existingItem) {
            set((state) => ({
                items: state.items.map((i) => (i.id === item.id) ? { 
                    ...i,
                    quantity: Math.min(i.quantity + item.quantity, i.maxQuantity),
                } : i
                ),
            }));
        } else {
            //if the item is not in the cart, add it by spreading the existing items and adding the new item
            set((state) => ({
                items: [...state.items, item],
            }));
        }
    },

    //remove an item from the cart based on the id
    removeItem: (id: number)=>set(state =>({items: state.items.filter(item=>item.id!==id)})),

    //increase the quantity of an item in the cart based on the id
    increaseItem: (id:number)=>set(state=>{

        return{
            items: state.items.map(item=>item.id===id && item.quantity<item.maxQuantity? {
                ...item,
                quantity: item.quantity+1,
            } : item),
        };
    }),

    //decrease the quantity of an item in the cart based on the id
    decreaseItem: (id:number)=>
        set(state=>({items: state.items.map(item=>item.id===id && item.quantity>1? {...item, quantity: item.quantity-1} : item)})),

    //get the total price of the items in the cart
    getTotalPrice: ()=>{
        return get().items.reduce((total, item)=>total+item.price*item.quantity, 0).toFixed(2);
    },

    //get the total number of items in the cart
    getItemCount: ()=>{
        return get().items.reduce((total, item)=>total+item.quantity, 0);
    },

    resetCart: ()=>set({items: initialCartItems}),
}));