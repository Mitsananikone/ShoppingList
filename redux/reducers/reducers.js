const initialState = {
  user: null,
  shoppingList: [],
  userColor: null, // Add the userColor property
};

'use client';
export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    case 'UPDATE_SHOPPING_LIST':
      return { ...state, shoppingList: action.payload };
    case 'ADD_ITEM':
      return { ...state, shoppingList: [...state.shoppingList, action.payload] };
    case 'UPDATE_COLOR':
      return { ...state, userColor: action.payload }; // Update to userColor
    default:
      return state;
  }
};

export default userReducer;
