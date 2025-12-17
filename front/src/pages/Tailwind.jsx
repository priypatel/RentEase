// import React from "react";

// const Tailwind = () => {
//   return (
//     // <>
//     //   <button
//     //     className="
//     //         m-4
//     //         px-4 py-2
//     //         text-sm font-medium
//     //         rounded-md
//     //         bg-blue-600 text-white
//     //         hover:bg-blue-700
//     //         focus:outline-none
//     //         focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
//     //         disabled:bg-blue-300
//     //         disabled:cursor-not-allowed
//     //         disabled:opacity-60
//     //          text-base
//     //     "
//     //   >
//     //     Save
//     //   </button>

//     //   <div>hello</div>
//     // </>

//     //     <>
//     //       <div
//     //         className="
//     //         m-4
//     //     max-w-sm
//     //     border border-gray-200 rounded-lg
//     //     p-6

//     //     transition
//     //     duration-200
//     //     ease-out

//     //     hover:shadow-md
//     //     hover:-translate-y-0.5
//     //     hover:cursor-pointer
//     //   "
//     //       >
//     //         <h3 className="text-lg font-medium leading-snug">Card title</h3>

//     //         <p className="mt-2 text-sm leading-relaxed">
//     //           This card provides subtle visual feedback on hover without being
//     //           distracting or flashy.
//     //         </p>
//     //       </div>
//     //     </>

//     <>
//       <div
//         className="
//     flex flex-col gap-4
//     p-4

//     md:flex-row
//     md:p-6

//     lg:p-8
//   "
//       >
//         <div className="flex-1">
//           <h2 className="text-lg md:text-xl lg:text-2xl font-medium leading-snug">
//             Product Title
//           </h2>
//           <p className="mt-2 text-sm md:text-base leading-relaxed">
//             This content stacks on mobile, switches to a row on desktop, and
//             scales spacing and typography progressively.
//           </p>
//         </div>

//         <div className="flex-1 bg-gray-200 p-4">Secondary content</div>
//       </div>
//     </>
//   );
// };

// export default Tailwind;

// import { useState } from "react";

// export default function ToggleBox() {
//   const [active, setActive] = useState(false);

//   return (
//     <div
//       onClick={() => setActive(!active)}
//       className={`
//         cursor-pointer
//         p-4
//         rounded-md
//         border
//         transition
//         duration-200

//         ${
//           active
//             ? "bg-blue-600 border-blue-600 text-white"
//             : "bg-gray-100 border-gray-300 text-gray-800"
//         }
//       `}
//     >
//       {active ? "Active State" : "Inactive State"}
//     </div>
//   );
// }

// import { useState } from "react";

// export default function InputStates() {
//   const [error, setError] = useState(false);
//   const [disabled, setDisabled] = useState(false);

//   return (
//     <div className="space-y-4 max-w-sm">
//       <input
//         placeholder="Enter your email"
//         disabled={disabled}
//         className={`
//           w-full
//           px-3 py-2
//           text-sm
//           rounded-md
//           border
//           transition
//           duration-200
//           outline-none

//           placeholder-gray-400

//           ${
//             disabled
//               ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
//               : error
//               ? "border-red-500 focus:ring-2 focus:ring-red-500"
//               : "border-gray-300 focus:ring-2 focus:ring-blue-500"
//           }
//         `}
//       />

//       {/* Controls just for demo */}
//       <div className="flex gap-4 text-sm">
//         <button onClick={() => setError(!error)}>Toggle Error</button>
//         <button onClick={() => setDisabled(!disabled)}>Toggle Disabled</button>
//       </div>
//     </div>
//   );
// }

// import React from "react";

// const Tailwind = () => {
//   return (
//     <>
//       <div className="px-2 py-4 bg-gray-300">Header</div>
//       <div className="m-4 flex flex-col md:flex-row gap-4 justify-around">
//         <div className=" p-4 rounded-xl bg-gray-200 hover:cursor-pointer  transition duration-200 ease-out hover:shadow-md  hover:-translate-y-0.5 flex flex-col gap-3">
//           <h1 className="text-2xl md:text-3xl font-semibold text-red-500">
//             {" "}
//             Main header
//           </h1>
//           <h2 className="text-xl md:text-2xl font-medium text-blue-500">
//             title
//           </h2>
//           <p>normal text which want to every one </p>
//         </div>
//         <div className=" p-4 rounded-xl bg-gray-200 hover:cursor-pointer  transition duration-200 ease-out hover:shadow-md  hover:-translate-x-0.5 flex flex-col gap-3">
//           <h1 className="text-2xl md:text-3xl font-semibold text-red-500">
//             Main header
//           </h1>
//           <h2 className="text-xl md:text-2xl font-medium text-blue-500">
//             title
//           </h2>
//           <p>normal text which want to every one </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Tailwind;

import React, { useState } from "react";

const Tailwind = () => {
  const [active, setActive] = useState(1);

  return (
    <>
      {/* Header */}
      <header className="w-full bg-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
            Dashboard
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {[1, 2].map((id) => (
            <div
              key={id}
              onClick={() => setActive(id)}
              className={`
                flex-1
                p-6
                rounded-xl
                border
                cursor-pointer
                transition
                duration-200
                ease-out

                ${
                  active === id
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-gray-100 border-gray-200 hover:shadow-md hover:-translate-y-0.5"
                }
              `}
            >
              <h2 className="text-xl font-medium leading-snug">
                Card Title {id}
              </h2>

              <p className="mt-2 text-base leading-relaxed">
                This panel demonstrates responsive layout, hover feedback,
                focus-safe interaction, and conditional styling.
              </p>

              <button
                className="
                  mt-4
                  px-4 py-2
                  text-sm
                  font-medium
                  rounded-md

                  bg-white/90
                  text-gray-900

                  hover:bg-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-white
                  focus:ring-offset-2
                "
              >
                Action
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Tailwind;
