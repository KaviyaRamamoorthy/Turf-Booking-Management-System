// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { loginUser } from "../../store/slices/authSlice";
// import type { RootState } from "../../types";
// import type { AppDispatch } from "../../store";

// const RoleSwitcher: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { user } = useSelector((state: RootState) => state.auth);

//   const switchRole = (role: "admin" | "customer" | "vendor") => {
//     const credentials = {
//       email: `${role}@turf.com`,
//       password: "demo123",
//     };
//     dispatch(loginUser(credentials));
//   };

//   if (!user) return null;

//   return {
//     /* <div className="fixed top-4 right-4 z-50 bg-white p-3 rounded-lg shadow-lg border">
//       <div className="text-sm font-medium text-gray-700 mb-2">Demo Role Switcher</div>
//       <div className="flex gap-2">
//         <Button
//           label="Admin"
//           size="small"
//           className={`p-button-sm ${user.role === 'admin' ? 'p-button-primary' : 'p-button-outlined'}`}
//           onClick={() => switchRole('admin')}
//         />
//         <Button
//           label="Customer"
//           size="small"
//           className={`p-button-sm ${user.role === 'customer' ? 'p-button-primary' : 'p-button-outlined'}`}
//           onClick={() => switchRole('customer')}
//         />
//         <Button
//           label="Vendor"
//           size="small"
//           className={`p-button-sm ${user.role === 'vendor' ? 'p-button-primary' : 'p-button-outlined'}`}
//           onClick={() => switchRole('vendor')}
//         />
//       </div>
//       <div className="text-xs text-gray-500 mt-2">
//         Current: {user.role}
//       </div>
//     </div>*/
//   };
// };

// export default RoleSwitcher;
