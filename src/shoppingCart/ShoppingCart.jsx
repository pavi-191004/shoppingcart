import { useReducer } from "react";
import { products } from "./products";
import "./ShoppingCart.css";
import { ADD_PRODUCT, REMOVE_PRODUCT, INCREASE, DECREASE } from "./actionTypes";

export const initialCart = {
  items: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case ADD_PRODUCT: {
      if (!action.payload?.id) return state;

      if (state.items?.find((p) => p.id === action.payload.id)) {
        return state;
      }

      return {
        ...state,
        items: [...(state.items ?? []), { ...action.payload, quantity: 1 }],
      };
    }

    case REMOVE_PRODUCT:
      return {
        ...state,
        items: (state.items ?? []).filter((p) => p.id !== action.payload?.id),
      };

    case INCREASE:
      return {
        ...state,
        items: (state.items ?? []).map((item) =>
          item.id === action.payload?.id
            ? {
                ...item,
                quantity: (item.quantity ?? 0) + 1,
              }
            : item,
        ),
      };

    case DECREASE:
      return {
        ...state,
        items: (state.items ?? [])
          .map((item) =>
            item.id === action.payload?.id
              ? {
                  ...item,
                  quantity: (item.quantity ?? 1) - 1,
                }
              : item,
          )
          .filter((item) => (item.quantity ?? 0) > 0),
      };

    default:
      return state;
  }
};

export const ShoppingCart = () => {
  const [state, dispatch] = useReducer(reducer, initialCart);

  const totalPrice =
    state.items?.reduce(
      (total, item) => total + (item.price ?? 0) * (item.quantity ?? 0),
      0,
    ) ?? 0;

  return (
    <div className="cart-container">
      <h2 className="title">Products</h2>

      {products?.map((item) => (
        <div key={item.id} className="product-card">
          <div className="product-info">
            <p className="product-name">{item?.name}</p>
            <p className="product-price">₹{item?.price ?? 0}</p>
          </div>

          <div className="product-actions">
            <button
              className="btn add-btn"
              onClick={() => dispatch({ type: ADD_PRODUCT, payload: item })}
            >
              Add
            </button>

            <button
              className="btn remove-btn"
              onClick={() => dispatch({ type: REMOVE_PRODUCT, payload: item })}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <hr />

      <h2 className="title">Cart Items</h2>

      {state.items?.map((item) => (
        <div key={item.id} className="cart-item">
          <div className="cart-info">
            <p className="cart-name">{item?.name}</p>
            <p className="cart-qty">Qty: {item?.quantity ?? 0}</p>
          </div>

          <div className="cart-actions">
            <button
              className="btn qty-btn"
              onClick={() => dispatch({ type: INCREASE, payload: item })}
            >
              +
            </button>

            <button
              className="btn qty-btn"
              onClick={() => dispatch({ type: DECREASE, payload: item })}
            >
              -
            </button>
          </div>
        </div>
      ))}

      <div className="cart-footer">
        <h3 className="total">Total: ₹{totalPrice}</h3>
      </div>
    </div>
  );
};
