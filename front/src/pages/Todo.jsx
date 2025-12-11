// import React, { useState } from "react";

// const Todo = () => {
//   const [todos, setTodos] = useState([]);
//   const [newTodo, setNewTodo] = useState("");
//   const [editId, setEditId] = useState(null);
//   const [editText, setEditText] = useState("");

//   const handleAddTodo = () => {
//     if (!newTodo.trim()) return;

//     const newItem = {
//       id: Date.now(),
//       text: newTodo,
//     };
//     setNewTodo([...todos, newItem]);
//     setNewTodo("");
//   };
//   const handleDeleteTodo = (id) => {
//     setTodos(todos.filter((item) => item.id !== id));
//   };
//   const handleEditTodo = (id, text) => {
//     setEditId(id);
//     setEditText(text);
//   };

//   const handleSaveEdit = (id) => {
//     setTodos(
//       todos.map((item) => (item.id === id ? { ...item, text: editText } : item))
//     );
//     setEditId(null);
//     setEditText("");
//   };

//   return (
//     <>
//       <div style={{ padding: 20 }}>
//         <h1>Todo Page</h1>
//         <div>
//           <input
//             type="text"
//             value={newTodo}
//             onChange={(e) => setNewTodo(e.target.value)}
//             placeholder="Add new todo"
//           />
//           <button onClick={handleAddTodo}>Add</button>
//         </div>
//         <ul>
//           {todos.map((item) => (
//             <li key={item.id} style={{ marginBottom: 10 }}>
//               {editId === item.id ? (
//                 <>
//                   <input
//                     type="text"
//                     value={editText}
//                     onChange={(e) => setEditText(e.target.value)}
//                   />
//                   <button onClick={() => handleSaveEdit(item.id)}>Save</button>
//                 </>
//               ) : (
//                 <>
//                   {item.text}
//                   <button onClick={() => handleEditTodo(item.id, item.text)}>
//                     Edit
//                   </button>
//                   <button onClick={() => handleDeleteTodo(item.id)}>
//                     Delete
//                   </button>
//                 </>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// };

// export default Todo;

//search

// import { useState, useEffect } from "react";

// export default function SearchFilter() {
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [data] = useState([
//     "Apple",
//     "Mango",
//     "Banana",
//     "Orange",
//     "Strawberry",
//     "Watermelon",
//     "Pineapple",
//   ]);

//   // ---------------- DEBOUNCING LOGIC ----------------
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(search);
//     }, 300); // wait 300ms after last typing

//     return () => clearTimeout(timer); // cleanup
//   }, [search]);

//   // ---------------- FILTER DATA ----------------
//   const filteredItems = data.filter((item) =>
//     item.toLowerCase().includes(debouncedSearch.toLowerCase())
//   );

//   return (
//     <div style={{ width: 350, margin: "40px auto" }}>
//       <h2>Debounced Search Filter</h2>

//       <input
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         placeholder="Search fruits..."
//         style={{ width: "100%", padding: 8 }}
//       />

//       <ul style={{ marginTop: 20 }}>
//         {filteredItems.length ? (
//           filteredItems.map((item) => (
//             <li key={item} style={{ marginBottom: 5 }}>
//               {item}
//             </li>
//           ))
//         ) : (
//           <p>No results found.</p>
//         )}
//       </ul>
//     </div>
//   );
// }

//scrolll

// import { useState, useEffect, useRef } from "react";

// export default function InfiniteScrollAPI() {
//   const [items, setItems] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [firstLoading, setFirstLoading] = useState(true);

//   const loaderRef = useRef(null);

//   // ---------------- Fetch API Data ----------------
//   const fetchPosts = async () => {
//     setLoading(true);

//     const res = await fetch(
//       `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${page}`
//     );

//     const data = await res.json();

//     if (data.length === 0) setHasMore(false);

//     setItems((prev) => [...prev, ...data]);
//     setLoading(false);
//   };

//   // ---------------- FIRST LOAD ONLY (page = 1) ----------------
//   useEffect(() => {
//     const loadInitial = async () => {
//       await fetchPosts(); // run only once
//       setFirstLoading(false); // allow observer after first fetch completes
//     };

//     loadInitial();
//   }, []);

//   // ---------------- LOAD NEXT PAGES (page = 2,3,4...) ----------------
//   useEffect(() => {
//     if (page === 1) return; // prevent double fetch
//     fetchPosts();
//   }, [page]);

//   // ---------------- IntersectionObserver ----------------
//   useEffect(() => {
//     if (!hasMore || firstLoading) return; // disable until first list loaded

//     const observer = new IntersectionObserver(
//       (entries) => {
//         const target = entries[0];

//         if (target.isIntersecting && !loading) {
//           setPage((prev) => prev + 1);
//         }
//       },
//       { threshold: 1 }
//     );

//     if (loaderRef.current) observer.observe(loaderRef.current);

//     return () => observer.disconnect();
//   }, [loading, hasMore, firstLoading]);

//   return (
//     <div style={{ width: 400, margin: "20px auto" }}>
//       <h2>Infinite Scroll (API Version)</h2>

//       {items.map((item) => (
//         <div
//           key={item.id}
//           style={{
//             padding: 10,
//             margin: "8px 0",
//             background: "#f2f2f2",
//             borderRadius: 6,
//           }}
//         >
//           <b>{item.id}. </b> {item.title}
//         </div>
//       ))}

//       {/* Loader section — observer watches this */}
//       <div
//         ref={loaderRef}
//         style={{
//           height: 40,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           marginTop: 10,
//         }}
//       >
//         {loading && <p>Loading...</p>}
//       </div>

//       {!hasMore && (
//         <p style={{ textAlign: "center", marginTop: 20 }}>No more data.</p>
//       )}
//     </div>
//   );
// }

// flatten.js
// A simple recursive function that flattens ANY level of nested arrays.

// function flatten(arr) {
//   // function takes a nested array
//   const result = []; // final flattened output array

//   for (const item of arr) {
//     // loop through each element
//     if (Array.isArray(item)) {
//       // check if current item is an array
//       result.push(...flatten(item)); // recursively flatten & spread into result
//     } else {
//       result.push(item); // if not array → push directly
//     }
//   }

//   return result; // return final flattened list
// }

// // Example usage:
// console.log(flatten([1, [2, [3, 4], 5], 6, [[[7, 8]]]]));
// // Output → [1, 2, 3, 4, 5, 6]

// export default flatten; // export if needed in React/Node

// Timer.jsx
// A clean timer component with Start, Pause, Reset functionality.

// import React, { useState, useRef } from "react"; // import state + ref

// export default function Timer() {
//   const [time, setTime] = useState(0); // store elapsed seconds
//   const intervalRef = useRef(null); // holds interval ID

//   // ---------------- START ----------------
//   function start() {
//     if (intervalRef.current) return; // already running → ignore

//     intervalRef.current = setInterval(() => {
//       setTime((t) => t + 1); // increase time every second
//     }, 1000);
//   }

//   // ---------------- PAUSE ----------------
//   function pause() {
//     clearInterval(intervalRef.current); // stop interval
//     intervalRef.current = null; // clear stored ID
//   }

//   // ---------------- RESET ----------------
//   function reset() {
//     pause(); // stop interval first
//     setTime(0); // reset time
//   }

//   // helper to format seconds → mm:ss
//   function format(seconds) {
//     const m = String(Math.floor(seconds / 60)).padStart(2, "0");
//     const s = String(seconds % 60).padStart(2, "0");
//     return `${m}:${s}`;
//   }

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>{format(time)}</h2> {/* displayed time */}
//       <button onClick={start}>Start</button> {/* start button */}
//       <button onClick={pause}>Pause</button> {/* pause button */}
//       <button onClick={reset}>Reset</button> {/* reset button */}
//     </div>
//   );
// }

//pagination

// pagination.js
// // A clean reusable pagination utility function.

// export default function paginate(totalItems, itemsPerPage, currentPage) {
//   // convert values into integers and avoid invalid page values
//   const limit = Number(itemsPerPage) || 10;                  // items per page
//   const page = Math.max(1, Number(currentPage));            // ensure page >= 1

//   // calculate total number of pages
//   const totalPages = Math.max(1, Math.ceil(totalItems / limit));

//   // ensure current page never exceeds total pages
//   const safePage = Math.min(page, totalPages);

//   // calculate slice indexes
//   const startIndex = (safePage - 1) * limit;                 // e.g. page=2 => start=10
//   const endIndex = startIndex + limit;                       // end index (non-inclusive)

//   // prev/next availability
//   const hasPrev = safePage > 1;
//   const hasNext = safePage < totalPages;

//   // return all derived values
//   return {
//     page: safePage,                                          // corrected page number
//     totalPages,                                              // total paginated pages
//     startIndex,                                              // slice start
//     endIndex,                                                // slice end
//     hasPrev,                                                 // prev button state
//     hasNext                                                  // next button state
//   };
// }

// shuffle.js
// Correct Fisher–Yates shuffle — unbiased and used in real production systems.

// export default function shuffle(arr) {
//   const copy = [...arr];                         // make a copy to avoid mutating original

//   for (let i = copy.length - 1; i > 0; i--) {    // loop backwards from last index
//     const j = Math.floor(Math.random() * (i + 1)); // pick a random index between 0 and i

//     // swap elements at positions i and j
//     [copy[i], copy[j]] = [copy[j], copy[i]];
//   }

//   return copy;                                   // return the new shuffled array
// }

// Quiz.jsx
// A clean quiz component with Next, Prev, and Submit functionality.
// Perfect for interviews — simple logic, readable, predictable.

import React, { useState } from "react";

const questions = [
  {
    id: "q1",
    text: "Which language runs in a web browser?",
    choices: ["Java", "C", "Python", "JavaScript"],
    correct: "JavaScript",
  },
  {
    id: "q2",
    text: "What does CSS stand for?",
    choices: [
      "Central Style Sheets",
      "Cascading Style Sheets",
      "Computer Style System",
    ],
    correct: "Cascading Style Sheets",
  },
  {
    id: "q3",
    text: "React is a ___ ?",
    choices: ["Library", "Framework", "Language"],
    correct: "Library",
  },
];
// export default function Quiz({ questions }) {
export default function Quiz() {
  const [index, setIndex] = useState(0); // current question index
  const [answers, setAnswers] = useState({}); // store user answers
  const [score, setScore] = useState(null); // score after submit

  // ---------------- HANDLE ANSWER SELECTION ----------------
  function selectAnswer(choice) {
    const qId = questions[index].id; // current question ID
    setAnswers((prev) => ({ ...prev, [qId]: choice })); // store selected value
  }

  // ---------------- NAVIGATION ----------------
  function next() {
    setIndex((i) => Math.min(i + 1, questions.length - 1)); // safe next index
  }

  function prev() {
    setIndex((i) => Math.max(i - 1, 0)); // safe previous index
  }

  // ---------------- FINAL SUBMIT ----------------
  function submitQuiz() {
    let marks = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.correct) marks++; // correct answer check
    });

    setScore(marks); // set final score
  }

  // ---------------- SCORE SCREEN ----------------
  if (score !== null) {
    return (
      <div>
        <h2>
          Your Score: {score}/{questions.length}
        </h2>
      </div>
    );
  }

  // ---------------- CURRENT QUESTION ----------------
  const q = questions[index];

  return (
    <div style={{ padding: 20 }}>
      <h3>
        Question {index + 1} / {questions.length}
      </h3>

      <p>{q.text}</p>

      {/* answer options */}
      {q.choices.map((choice) => (
        <label key={choice} style={{ display: "block", marginBottom: 8 }}>
          <input
            type="radio"
            name={q.id}
            checked={answers[q.id] === choice}
            onChange={() => selectAnswer(choice)}
          />{" "}
          {choice}
        </label>
      ))}

      {/* navigation buttons */}
      <button onClick={prev} disabled={index === 0}>
        Prev
      </button>
      <button onClick={next} disabled={index === questions.length - 1}>
        Next
      </button>

      {/* submit button */}
      <button onClick={submitQuiz} style={{ marginLeft: 10 }}>
        Submit
      </button>
    </div>
  );
}
