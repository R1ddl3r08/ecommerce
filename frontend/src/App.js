import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import RootLayout from "./pages/Root";
import ErrorPage from "./pages/ErrorPage";
import ApolloProvider from "./ApolloProvider";
import ProductDetails from "./pages/ProductDetailsPage";
import CartContextProvider from "./store/shopping-cart-context";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/clothes" replace />,
      },
      { 
        path: ':category', 
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: ':productId',
            element: <ProductDetails />,
          }
        ]
      },
    ]
  },
]);

function App() { 
  return (
    <ApolloProvider>
      <CartContextProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </CartContextProvider>
    </ApolloProvider>
  );
}

export default App;
