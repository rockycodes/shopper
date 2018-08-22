import axios from 'axios';
import history from '../history';

/**
 * ACTION TYPES
 */
const GET_CART = 'GET_CART';
//const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const CLEAR_CART = 'CLEAR_CART';

/**
 * INITIAL STATE
 */
const cart = [];

/**
 * ACTION CREATORS
 */
const getCart = cart => ({ type: GET_CART, cart });
//const addToCart = product => ({ type: ADD_TO_CART, product });
const removeFromCart = productId => ({ type: REMOVE_FROM_CART, productId });
const clearCart = () => ({ type: CLEAR_CART});

/**
 * THUNK CREATORS
 */

export const addItemToCart = (productId) => dispatch => {
    axios
    .post(`/api/cart`, productId)
    .then(res => {
      let action = getCart(res.data);
      dispatch(action);
    })
    .catch(err => console.log(err));
}

export const addGuestItemToCart = (productId) => dispatch => {
  if (!localStorage.getItem('cart')){
    localStorage.setItem('cart', productId)
  }
  else {
    let newCart = localStorage.getItem('cart')
    newCart += `,${productId}`;
    localStorage.setItem('cart', newCart)
  }
  let udpatedCart = localStorage.getItem('cart').split(',')
  let action = getCart(udpatedCart)
  dispatch(action)
}
  

export const removeItemFromCart = (product) => (dispatch) => {
  axios
    .delete(`/api/cart/${product.id}`)
    .then(() => {
      const productId = product.id;
      let action = removeFromCart(productId);
      dispatch(action);
    })
    .catch(err => console.log(err));
  }

export const removeGuestItemFromCart = (productId) => dispatch => {
  let guestCart = localStorage.getItem('cart').split(',')
  let index = guestCart.indexOf(productId.toString())
  guestCart.splice(index, 1)
  let updatedCart = guestCart.join(',')
  localStorage.setItem('cart', updatedCart)
  let action = getCart(guestCart)
  dispatch(action)
}

export const getTheCart = () => dispatch => {
  //check if there is a cart on local storage, if there is, post it to the backend and then get the cart
    if (localStorage.getItem('cart')) {
      let guestCart = localStorage.getItem('cart').split(',')
        axios
        .post(`/api/cart`, guestCart)
        .then(res => {
        let action = getCart(res.data);
        dispatch(action);
        localStorage.removeItem('cart')
      })
    }
    axios
      .get('/api/cart')
      .then(res => {
        let action = getCart(res.data);
        dispatch(action);
      })
      .catch(err => console.log(err))
    }

export const getTheGuestCart = () => dispatch => {
  let guestCart = localStorage.getItem('cart').split(',')
  let action = getCart(guestCart)
  dispatch(action)
  }

export const clearCurrentCart = () => dispatch => {
  let action = clearCart();
  dispatch(action);
}

/**
 * REDUCER
 */
export default function(state = cart, action) {
  switch (action.type) {
    case GET_CART:
      return action.cart;
    case REMOVE_FROM_CART:
      return [...state.filter(item => item.productId !== action.productId)];
    case CLEAR_CART:
      return [];
    default:
      return state;
  }
}
