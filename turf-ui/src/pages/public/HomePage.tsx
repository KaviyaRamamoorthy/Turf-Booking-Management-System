// import React from "react";
// import { Button } from "primereact/button";
// import { Card } from "primereact/card";

// const HomePage: React.FC = () => {
//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
//         <div className="container mx-auto px-6 text-center">
//           <h1 className="text-5xl font-bold mb-6">Book Your Perfect Turf</h1>
//           <p className="text-xl mb-8 max-w-2xl mx-auto">
//             Discover and book the best sports turfs in your area. Football,
//             cricket, tennis, and more - all in one place.
//           </p>
//           <div className="flex gap-4 justify-center">
//             <Button
//               label="Browse Turfs"
//               className="p-button-lg p-button-outlined p-button-white"
//               icon="pi pi-map-marker"
//             />
//             <Button
//               label="Sign Up"
//               className="p-button-lg p-button-white"
//               icon="pi pi-user-plus"
//             />
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-16 bg-gray-50">
//         <div className="container mx-auto px-6">
//           <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
//             Why Choose Our Platform?
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             <Card className="text-center">
//               <div className="text-4xl text-blue-600 mb-4">
//                 <i className="pi pi-calendar"></i>
//               </div>
//               <h3 className="text-xl font-semibold mb-3">Easy Booking</h3>
//               <p className="text-gray-600">
//                 Book your preferred turf with just a few clicks. Real-time
//                 availability and instant confirmation.
//               </p>
//             </Card>

//             <Card className="text-center">
//               <div className="text-4xl text-green-600 mb-4">
//                 <i className="pi pi-star"></i>
//               </div>
//               <h3 className="text-xl font-semibold mb-3">Quality Turfs</h3>
//               <p className="text-gray-600">
//                 Hand-picked turfs with professional facilities. Maintained to
//                 the highest standards.
//               </p>
//             </Card>

//             <Card className="text-center">
//               <div className="text-4xl text-purple-600 mb-4">
//                 <i className="pi pi-shield"></i>
//               </div>
//               <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
//               <p className="text-gray-600">
//                 Safe and secure payment processing. Multiple payment options
//                 available.
//               </p>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Sports Categories */}
//       <section className="py-16">
//         <div className="container mx-auto px-6">
//           <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
//             Popular Sports
//           </h2>
//           <div className="grid md:grid-cols-4 gap-6">
//             {[
//               { name: "Football", icon: "pi pi-circle", color: "bg-green-500" },
//               { name: "Cricket", icon: "pi pi-circle", color: "bg-blue-500" },
//               { name: "Tennis", icon: "pi pi-circle", color: "bg-yellow-500" },
//               {
//                 name: "Basketball",
//                 icon: "pi pi-circle",
//                 color: "bg-orange-500",
//               },
//             ].map((sport) => (
//               <Card
//                 key={sport.name}
//                 className="text-center cursor-pointer hover:shadow-lg transition-shadow"
//               >
//                 <div
//                   className={`w-16 h-16 ${sport.color} rounded-full mx-auto mb-4 flex items-center justify-center`}
//                 >
//                   <i className={`${sport.icon} text-white text-2xl`}></i>
//                 </div>
//                 <h3 className="text-lg font-semibold">{sport.name}</h3>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="bg-gray-800 text-white py-16">
//         <div className="container mx-auto px-6 text-center">
//           <h2 className="text-3xl font-bold mb-4">Ready to Book Your Turf?</h2>
//           <p className="text-xl mb-8">
//             Join thousands of sports enthusiasts who trust our platform.
//           </p>
//           <Button
//             label="Get Started"
//             className="p-button-lg p-button-primary"
//             icon="pi pi-arrow-right"
//           />
//         </div>
//       </section>
//     </div>
//   );
// };

// export default HomePage;
