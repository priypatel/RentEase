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

import { useState, useEffect, useRef } from "react";

export default function InfiniteScrollAPI() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [firstLoading, setFirstLoading] = useState(true);

  const loaderRef = useRef(null);

  // ---------------- Fetch API Data ----------------
  const fetchPosts = async () => {
    setLoading(true);

    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${page}`
    );

    const data = await res.json();

    if (data.length === 0) setHasMore(false);

    setItems((prev) => [...prev, ...data]);
    setLoading(false);
  };

  // ---------------- FIRST LOAD ONLY (page = 1) ----------------
  useEffect(() => {
    const loadInitial = async () => {
      await fetchPosts(); // run only once
      setFirstLoading(false); // allow observer after first fetch completes
    };

    loadInitial();
  }, []);

  // ---------------- LOAD NEXT PAGES (page = 2,3,4...) ----------------
  useEffect(() => {
    if (page === 1) return; // prevent double fetch
    fetchPosts();
  }, [page]);

  // ---------------- IntersectionObserver ----------------
  useEffect(() => {
    if (!hasMore || firstLoading) return; // disable until first list loaded

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [loading, hasMore, firstLoading]);

  return (
    <div style={{ width: 400, margin: "20px auto" }}>
      <h2>Infinite Scroll (API Version)</h2>

      {items.map((item) => (
        <div
          key={item.id}
          style={{
            padding: 10,
            margin: "8px 0",
            background: "#f2f2f2",
            borderRadius: 6,
          }}
        >
          <b>{item.id}. </b> {item.title}
        </div>
      ))}

      {/* Loader section — observer watches this */}
      <div
        ref={loaderRef}
        style={{
          height: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        {loading && <p>Loading...</p>}
      </div>

      {!hasMore && (
        <p style={{ textAlign: "center", marginTop: 20 }}>No more data.</p>
      )}
    </div>
  );
}
