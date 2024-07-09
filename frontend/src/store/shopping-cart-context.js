import React, { createContext, useReducer } from 'react';
import { normalizeAttributes } from '../utilities/attributeUtils';
import { ToastContainer, toast } from 'react-toastify';

export const CartContext = createContext({
  items: [],
  selectedAttributes: {},
  addItemToCart: () => {},
  updateItemQuantity: () => {},
  handleCheckboxChange: () => {},
  allAttributesSelected: () => false,
});

function shoppingCartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      const updatedItems = [...state.items];
      const newSelectedAttributes = normalizeAttributes(action.payload.selectedAttributes);

      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) =>
          cartItem.id === action.payload.id &&
          JSON.stringify(normalizeAttributes(cartItem.selectedAttributes)) === JSON.stringify(newSelectedAttributes)
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        updatedItems.push({
          id: action.payload.id,
          name: action.payload.name,
          price: action.payload.price,
          images: action.payload.images,
          attributes: action.payload.attributes,
          selectedAttributes: newSelectedAttributes,
          quantity: 1,
        });
      }

      return {
        ...state,
        items: updatedItems,
      };

    case 'UPDATE_ITEM':
      const updatedItemsForUpdate = [...state.items];
      const newSelectedAttributesForUpdate = normalizeAttributes(action.payload.selectedAttributes);

      const existingItemIndexForUpdate = updatedItemsForUpdate.findIndex(
        (item) =>
          item.id === action.payload.productId &&
          JSON.stringify(normalizeAttributes(item.selectedAttributes)) === JSON.stringify(newSelectedAttributesForUpdate)
      );
      const existingItemForUpdate = updatedItemsForUpdate[existingItemIndexForUpdate];

      if (existingItemForUpdate) {
        const updatedItemForUpdate = {
          ...existingItemForUpdate,
          quantity: existingItemForUpdate.quantity + action.payload.amount,
        };

        if (updatedItemForUpdate.quantity <= 0) {
          updatedItemsForUpdate.splice(existingItemIndexForUpdate, 1);
        } else {
          updatedItemsForUpdate[existingItemIndexForUpdate] = updatedItemForUpdate;
        }
      }

      return {
        ...state,
        items: updatedItemsForUpdate,
      };

    case 'SET_SELECTED_ATTRIBUTES':
      return {
        ...state,
        selectedAttributes: {
          ...state.selectedAttributes,
          [action.payload.setName]: action.payload.attrId,
        },
      };

    case 'RESET_SELECTED_ATTRIBUTES':
      return {
        ...state,
        selectedAttributes: {},
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }

  
}

export default function CartContextProvider({ children }) {
  const [shoppingCartState, shoppingCartDispatch] = useReducer(shoppingCartReducer, {
    items: [],
    selectedAttributes: {},
  });

  function handleAddItemToCart(product, selectedAttributes) {
    shoppingCartDispatch({
      type: 'ADD_ITEM',
      payload: {
        ...product,
        selectedAttributes,
      },
    });
    shoppingCartDispatch({
      type: 'RESET_SELECTED_ATTRIBUTES',
    });
    toast.success("Item added to cart!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  function handleUpdateCartItemQuantity(productId, selectedAttributes, amount) {
    shoppingCartDispatch({
      type: 'UPDATE_ITEM',
      payload: {
        productId,
        selectedAttributes,
        amount,
      },
    });
  }

  function handleCheckboxChange(setName, attrId) {
    shoppingCartDispatch({
      type: 'SET_SELECTED_ATTRIBUTES',
      payload: {
        setName,
        attrId,
      },
    });
  }

  function allAttributesSelected(groupedAttributes) {
    return Object.keys(groupedAttributes).every(
      (setName) => shoppingCartState.selectedAttributes[setName]
    );
  }

  function clearCart() {
    shoppingCartDispatch({ type: 'CLEAR_CART' });
  }

  const ctxValue = {
    items: shoppingCartState.items,
    selectedAttributes: shoppingCartState.selectedAttributes,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
    handleCheckboxChange: handleCheckboxChange,
    allAttributesSelected: allAttributesSelected,
    clearCart: clearCart,
  };

  return (
    <CartContext.Provider value={ctxValue}>
      {children}
    </CartContext.Provider>
  );
}
