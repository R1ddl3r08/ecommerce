import { forwardRef, useImperativeHandle, useRef, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { gql, useMutation } from '@apollo/client';
import { ToastContainer, toast } from 'react-toastify';
import Cart from './Cart';
import { CartContext } from '../store/shopping-cart-context';

const CREATE_ORDER = gql`
  mutation CreateOrder($input: OrderInput!) {
    createOrder(input: $input) {
      id
      total
      items {
        id
        product_id
        quantity
        price
        attributes {
          id
          attribute_id
        }
      }
    }
  }
`;

const CartModal = forwardRef(function Modal(_, ref) {
  const modalRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const { items, clearCart } = useContext(CartContext);

  const [createOrder, { loading, error }] = useMutation(CREATE_ORDER, {
    onCompleted: (data) => {
      console.log('Order created:', data);
      clearCart();
      setIsOpen(false);
      toast.success("Order created!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
  });

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  const handlePlaceOrder = () => {
    const orderInput = {
      total: items.reduce((acc, item) => acc + item.price.amount * item.quantity, 0),
      items: items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price.amount,
        attributes: item.selectedAttributes ? Object.entries(item.selectedAttributes).map(([key, value]) => ({
          attribute_id: value
        })) : [],
      })),
    };
  
    createOrder({ variables: { input: orderInput } });
  };
  

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <>
      <div className="modal-backdrop" onClick={() => setIsOpen(false)} />
      <div className="modal" ref={modalRef}>
        <Cart />
        <div id="modal-actions">
          <button
            disabled={items.length < 1 || loading}
            className="place-order-button"
            onClick={handlePlaceOrder}
          >
            {loading ? 'Placing order...' : 'Place order'}
          </button>
          {error && <p className="error">Error placing order: {error.message}</p>}
        </div>
      </div>
    </>,
    document.getElementById('modal-root')
  );
});

export default CartModal;
