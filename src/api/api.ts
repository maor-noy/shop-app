import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../providers/auth-provider";
import { generateOrderSlug } from "../utils/utils";

//this file contains all the queries that we will use in the app

/**
 * get all data of the products and the categories
 * @returns all the products and categories
 */
export const getProductsAndCategories = () => {
    return useQuery({
        queryKey: ['products', 'categories'],
        queryFn: async () => {
            const [products, categories] = await Promise.all([
                supabase.from('product').select('*'),
                supabase.from('category').select('*')
            ]);
            if(products.error || categories.error){
                throw new Error('Error fetching data');
            }

            return {products: products.data, categories: categories.data};
        },
    });
}

/**
 * take the slug of the product and fetch the product with the given slug
 * @param slug the slug of the product
 * @returns the product with the given slug
 */
export const getProduct = (slug: string) => {
    return useQuery({
      queryKey: ['product', slug],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('product')
          .select('*')
          .eq('slug', slug)
          .single();
  
        if (error || !data) {
          throw new Error(
            'An error occurred while fetching data: ' + error?.message
          );
        }
  
        return data;
      },
    });
};
  
/**
 * take the category slug and fetch the category and the products of this category
 * @param categorySlug the slug of the category
 * @returns all the products of the category
 */
export const getCategoryAndProducts = (categorySlug: string) => {
    return useQuery({
      queryKey: ['categoryAndProducts', categorySlug],
      queryFn: async () => {
        const { data: category, error: categoryError } = await supabase
          .from('category')
          .select('*')
          .eq('slug', categorySlug)
          .single();
  
        if (categoryError || !category) {
          throw new Error('An error occurred while fetching category data');
        }
  
        const { data: products, error: productsError } = await supabase
          .from('product')
          .select('*')
          .eq('category', category.id);
  
        if (productsError) {
          throw new Error('An error occurred while fetching products data');
        }
  
        return { category, products };
      },
    });
};

/**
 * take the user id from the auth context and fetch the orders of the current user
 * @returns the orders of the current user
 */
export const getMyOrders = () => {
  const {
    user: { id },
  } = useAuth();

  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order')
        .select('*')
        .order('created_at', { ascending: false })
        .eq('user', id);

      if (error) {
        throw new Error('An error occurred while fetching orders data', error);
      }

      return data;
    },
  });
}

/**
 * create a new order for the current user
 * @returns the current order of the current user
 */
export const createOrder = () => {
  const {
    user: { id },
  } = useAuth();

  const slug = generateOrderSlug();

  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({ totalPrice }: { totalPrice: number }) {
      // create the order
      const { data, error } = await supabase
        .from('order')
        .insert({
          totalPrice,
          slug,
          user: id,
          status: 'Pending',
        })
        .select('*')
        .single();

      if (error)
        throw new Error(
          'An error occurred while creating order: ' + error.message
        );

      return data;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['order'] });
    },
  });
};

// /**
//  * create a new order for the current user
//  * @returns the order items of the current order
//  */
// export const createOrderItem = () => {
//   return useMutation({
//     async mutationFn(
//       insertData: {
//         orderId: number;
//         productId: number;
//         quantity: number;
//       }[]
//     ) {
//       // insert the order items
//       const { data, error } = await supabase
//         .from('order_item')
//         .insert(
//           insertData.map(({ orderId, quantity, productId }) => ({
//             order: orderId,
//             product: productId,
//             quantity,
//           }))
//         )
//         .select('*')

//       //calculate the total quantity of each product
//       const productQuantities = insertData.reduce(
//         (acc, { productId, quantity }) => {
//           if (!acc[productId]) {
//             acc[productId] = 0;
//           }
//           acc[productId] += quantity;
//           return acc;
//         },
//         {} as Record<number, number>
//       );

//       //decrement the quantity of each product
//       await Promise.all(
//         Object.entries(productQuantities).map(
//           async ([productId, totalQuantity]) =>
//             supabase.rpc('decrement_product_quantity', {
//               product_id: Number(productId),
//               quantity: totalQuantity,
//             })
//         )
//       );

//       if (error)
//         throw new Error(
//           'An error occurred while creating order item: ' + error.message
//         );

//       return data;
//     },
//   });
// };

export const createOrderItem = () => {
  const queryClient = useQueryClient();  // React Query's query client to interact with cached queries

  return useMutation({
    mutationFn: async (insertData: { orderId: number, productId: number, quantity: number }[]) => {
      // Perform the insert operation (same as before)
      const { data, error } = await supabase
        .from('order_item')
        .insert(insertData.map(({ orderId, productId, quantity }) => ({
          order: orderId,
          product: productId,
          quantity
        })))
        .select('*, products:product(*)')
      
      // Decrement product quantities (same as before)
      const productQuantity = insertData.reduce((acc, { productId, quantity }) => {
        if (!acc[productId]) acc[productId] = 0;
        acc[productId] += quantity;
        return acc;
      }, {} as Record<number, number>);

      await Promise.all(Object.entries(productQuantity).map(([productId, quantity]) => {
        return supabase.rpc('decrement_product_quantity', {
          product_id: Number(productId),
          quantity: quantity,
        });
      }));

      if (error) {
        throw new Error('An error occurred while creating order item: ' + error.message);
      }
      
      return data;
    },
    onSuccess: () => {
      // Invalidate the 'orders' query to refetch the updated list of orders
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};


/**
 * return the data of the order with the given slug
 * @param slug the slug of the order
 * @returns the order with the given slug
 */
export const getMyOrder = (slug: string) => {
  const {
    user: { id },
  } = useAuth();

  return useQuery({
    queryKey: ['orders', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order')
        .select('*, order_items:order_item(*, products:product(*))')
        .eq('slug', slug)
        .eq('user', id)
        .single();

      if (error || !data)
        throw new Error(
          'An error occurred while fetching data: ' + error.message
        );

      return data;
    },
  });
}