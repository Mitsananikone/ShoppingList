'use client';
import * as actionTypes from './actionTypes';

export const updateUser = (user) => ({
  type: actionTypes.UPDATE_USER,
  payload: user,
});

export const addItem = (item) => ({
  type: actionTypes.ADD_ITEM,
  payload: item,
});

export const updateShoppingList = (shoppingList) => {
  const formattedShoppingList = shoppingList.map((item) => item.item);
  return {
    type: actionTypes.UPDATE_SHOPPING_LIST,
    payload: formattedShoppingList,
  };
};

export const updateColor = (color) => ({
  type: actionTypes.UPDATE_COLOR,
  payload: color,
});
