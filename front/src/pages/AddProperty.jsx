// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";

// import {
//   createProperty,
//   updateProperty,
//   getMyProperties,
// } from "../redux/slices/propertySlice";

// export default function AddProperty() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const {
//     items: properties,
//     creating,
//     updating,
//   } = useSelector((state) => state.properties);

//   // -------------------------------
//   // FORM STATES
//   // -------------------------------
//   const [title, setTitle] = useState("");
//   const [location, setLocation] = useState("");
//   const [rent, setRent] = useState("");
//   const [description, setDescription] = useState("");

//   const [images, setImages] = useState([]);
//   const [previewImages, setPreviewImages] = useState([]);
//   const [existingImages, setExistingImages] = useState([]);

//   // -------------------------------
//   // LOAD PROPERTY IN EDIT MODE
//   // -------------------------------
//   useEffect(() => {
//     if (id && properties.length === 0) {
//       dispatch(getMyProperties());
//     }
//   }, [id, properties, dispatch]);

//   useEffect(() => {
//     if (id && properties.length > 0) {
//       const p = properties.find((prop) => prop._id === id);
//       if (!p) return;

//       setTitle(p.title);
//       setLocation(p.location);
//       setRent(p.rent);
//       setDescription(p.description);
//       setExistingImages(p.images || []);
//     }
//   }, [id, properties]);

//   // -------------------------------
//   // IMAGE HANDLING
//   // -------------------------------
//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files || []);
//     setImages(files);

//     const previews = files.map((file) => URL.createObjectURL(file));
//     setPreviewImages(previews);
//   };

//   useEffect(() => {
//     return () => {
//       previewImages.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [previewImages]);

//   // -------------------------------
//   // HANDLE SUBMIT
//   // -------------------------------
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!title.trim() || !location.trim() || !rent) {
//       toast.error("Please fill required fields");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("location", location);
//     formData.append("rent", rent);
//     formData.append("description", description);

//     images.forEach((file) => formData.append("images", file));

//     if (id) {
//       dispatch(updateProperty({ id, formData }))
//         .unwrap()
//         .then(() => {
//           toast.success("Property updated successfully!");
//           dispatch(getMyProperties());
//           navigate("/my-properties");
//         })
//         .catch((err) => toast.error(err || "Update failed"));
//       return;
//     }

//     dispatch(createProperty(formData))
//       .unwrap()
//       .then(() => {
//         toast.success("Property created successfully!");
//         dispatch(getMyProperties());
//         navigate("/my-properties");
//       })
//       .catch((err) => toast.error(err || "Create failed"));
//   };
//   // DELETE preview image (newly selected)
//   const handleRemovePreview = (index) => {
//     const updatedPreviews = previewImages.filter((_, i) => i !== index);
//     const updatedFiles = images.filter((_, i) => i !== index);

//     setPreviewImages(updatedPreviews);
//     setImages(updatedFiles);
//   };

//   // DELETE existing image (edit mode)
//   const handleRemoveExisting = (index) => {
//     const updatedExisting = existingImages.filter((_, i) => i !== index);
//     setExistingImages(updatedExisting);
//   };

//   // -------------------------------
//   // UI (Option C Theme)
//   // -------------------------------
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 py-10 px-6">
//       <motion.div
//         initial={{ opacity: 0, y: -8 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-8 border border-gray-200"
//       >
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">
//           {id ? "Edit Property" : "Add New Property"}
//         </h1>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-6">
//           {/* TITLE */}
//           <div>
//             <label className="text-gray-700 font-semibold">Title *</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="2BHK Luxury Apartment"
//               className="w-full mt-1 p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300"
//             />
//           </div>

//           {/* LOCATION */}
//           <div>
//             <label className="text-gray-700 font-semibold">Location *</label>
//             <input
//               type="text"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               placeholder="Ahmedabad / Area"
//               className="w-full mt-1 p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300"
//             />
//           </div>

//           {/* RENT */}
//           <div>
//             <label className="text-gray-700 font-semibold">Rent (₹) *</label>
//             <input
//               type="number"
//               value={rent}
//               onChange={(e) => setRent(e.target.value)}
//               placeholder="45000"
//               className="w-full mt-1 p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300"
//             />
//           </div>

//           {/* DESCRIPTION */}
//           <div>
//             <label className="text-gray-700 font-semibold">Description</label>
//             <textarea
//               rows={4}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Describe the property..."
//               className="w-full mt-1 p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300"
//             />
//           </div>

//           {/* IMAGE UPLOAD */}
//           <div>
//             <label className="text-gray-700 font-semibold">Images</label>

//             {/* Upload Box */}
//             <div
//               className="mt-3 border-2 border-dashed border-green-300 bg-green-50/40 rounded-2xl p-6 cursor-pointer
//                flex flex-col items-center justify-center transition hover:border-green-500 hover:bg-green-50"
//               onClick={() => document.getElementById("imageInput").click()}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-12 h-12 text-green-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M3 16l5-6 4 5 4-3 5 6M3 4h18"
//                 />
//               </svg>

//               <p className="mt-2 text-gray-700 font-medium">
//                 Drag & Drop or{" "}
//                 <span className="text-green-600 underline">Browse Files</span>
//               </p>

//               <input
//                 id="imageInput"
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//             </div>

//             {/* Existing Images (edit mode) */}
//             {id && existingImages.length > 0 && previewImages.length === 0 && (
//               <div className="grid grid-cols-3 gap-4 mt-4">
//                 {existingImages.map((img, idx) => (
//                   <div
//                     key={idx}
//                     className="relative group rounded-xl overflow-hidden shadow-md border border-gray-200"
//                   >
//                     {/* <img
//                       src={img.url}
//                       className="w-full h-28 object-cover transition group-hover:scale-110"
//                     /> */}
//                     <img
//                       src={img?.url || ""}
//                       onError={(e) => (e.target.style.display = "none")}
//                       className="w-full h-28 object-cover transition group-hover:scale-110"
//                     />

//                     {/* Delete Button */}
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveExisting(idx)}
//                       className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full
//                        shadow-md opacity-0 group-hover:opacity-100 transition"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* New selected preview images */}
//             {previewImages.length > 0 && (
//               <div className="grid grid-cols-3 gap-4 mt-4">
//                 {previewImages.map((src, idx) => (
//                   <div
//                     key={idx}
//                     className="relative group rounded-xl overflow-hidden shadow-md border border-gray-200"
//                   >
//                     {/* <img
//                       src={src}
//                       className="w-full h-28 object-cover transition group-hover:scale-110"
//                     /> */}
//                     <img
//                       src={src || ""}
//                       onError={(e) => (e.target.style.display = "none")}
//                       className="w-full h-28 object-cover transition group-hover:scale-110"
//                     />

//                     {/* Delete Button */}
//                     <button
//                       type="button"
//                       onClick={() => handleRemovePreview(idx)}
//                       className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full
//                        shadow-md opacity-0 group-hover:opacity-100 transition"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* SUBMIT BUTTON */}
//           <button
//             type="submit"
//             disabled={creating || updating}
//             className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all active:scale-95"
//           >
//             {id
//               ? updating
//                 ? "Updating..."
//                 : "Update Property"
//               : creating
//               ? "Creating..."
//               : "Create Property"}
//           </button>
//         </form>
//       </motion.div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  createProperty,
  updateProperty,
  getMyProperties,
} from "../redux/slices/propertySlice";

export default function AddProperty() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    items: properties,
    creating,
    updating,
  } = useSelector((state) => state.properties || { items: [] });

  // -------------------------------
  // FORM STATES
  // -------------------------------
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [rent, setRent] = useState("");
  const [description, setDescription] = useState("");

  // New files to upload (File[])
  const [images, setImages] = useState([]);
  // Previews for newly selected files: { id, url, file }
  const [previewImages, setPreviewImages] = useState([]);
  // Existing images from server: { _id?, public_id?, url }
  const [existingImages, setExistingImages] = useState([]);
  // IDs (/_id or public_id) of existing images removed by user — send to backend on update
  const [removedExistingIds, setRemovedExistingIds] = useState([]);

  // -------------------------------
  // LOAD PROPERTY IN EDIT MODE
  // -------------------------------
  useEffect(() => {
    if (id && (!properties || properties.length === 0)) {
      dispatch(getMyProperties());
    }
  }, [id, properties, dispatch]);

  useEffect(() => {
    if (id && properties && properties.length > 0) {
      const p = properties.find((prop) => prop._id === id);
      if (!p) return;

      setTitle(p.title || "");
      setLocation(p.location || "");
      setRent(p.rent || "");
      setDescription(p.description || "");
      // ensure server images are objects with url + id fields
      setExistingImages(Array.isArray(p.images) ? p.images : []);
    }
  }, [id, properties]);

  // -------------------------------
  // Helpers for previews
  // -------------------------------
  const makePreview = (file) => {
    const url = URL.createObjectURL(file);
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return { id: uniqueId, url, file };
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      previewImages.forEach((p) => {
        try {
          URL.revokeObjectURL(p.url);
        } catch (e) {}
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------
  // IMAGE HANDLING
  // -------------------------------
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviews = files.map((f) => makePreview(f));

    // Append new files & previews (do not replace existing ones)
    setImages((prev) => [...prev, ...newPreviews.map((p) => p.file)]);
    setPreviewImages((prev) => [...prev, ...newPreviews]);

    // Clear the input so same file can be chosen again if needed
    e.target.value = "";
  };

  // Remove a newly selected preview (by preview id)
  const handleRemovePreview = (previewId) => {
    setPreviewImages((prevPreviews) => {
      const removed = prevPreviews.find((p) => p.id === previewId);
      const next = prevPreviews.filter((p) => p.id !== previewId);

      // revoke object url of removed
      if (removed) {
        try {
          URL.revokeObjectURL(removed.url);
        } catch (e) {}
      }

      // sync images[] (File[]) to the remaining previews
      setImages(next.map((p) => p.file));
      return next;
    });
  };

  // Remove an existing image (edit mode)
  // Accepts identifier: prefer _id, else public_id, else index fallback
  const handleRemoveExisting = (identifier) => {
    setExistingImages((prev) => {
      const idx =
        typeof identifier === "number"
          ? identifier
          : prev.findIndex(
              (it) => it._id === identifier || it.public_id === identifier
            );

      if (idx === -1) return prev;

      const removed = prev[idx];
      const next = [...prev.slice(0, idx), ...prev.slice(idx + 1)];

      // gather id to tell backend to delete
      const idToRemove = removed._id || removed.public_id || null;
      if (idToRemove) {
        setRemovedExistingIds((prevIds) => [...prevIds, idToRemove]);
      }

      return next;
    });
  };

  // -------------------------------
  // HANDLE SUBMIT
  // -------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !location.trim() || !rent) {
      toast.error("Please fill required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("rent", rent);
    formData.append("description", description || "");

    // Append newly selected files
    images.forEach((file) => formData.append("images", file));

    // On update, inform backend which existing images were removed
    if (id) {
      // append removed ids as removedImages[] so backend can iterate
      removedExistingIds.forEach((rid) =>
        formData.append("removedImages[]", rid)
      );

      dispatch(updateProperty({ id, formData }))
        .unwrap()
        .then(() => {
          toast.success("Property updated successfully!");
          dispatch(getMyProperties());
          navigate("/my-properties");
        })
        .catch((err) => toast.error(err || "Update failed"));
      return;
    }

    dispatch(createProperty(formData))
      .unwrap()
      .then(() => {
        toast.success("Property created successfully!");
        dispatch(getMyProperties());
        navigate("/my-properties");
      })
      .catch((err) => toast.error(err || "Create failed"));
  };

  // -------------------------------
  // UI (Option C Theme)
  // -------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 py-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-8 border border-gray-200"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {id ? "Edit Property" : "Add New Property"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* TITLE */}
          <div>
            <label className="text-gray-700 font-semibold">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="2BHK Luxury Apartment"
              className="w-full mt-1 p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* LOCATION */}
          <div>
            <label className="text-gray-700 font-semibold">Location *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ahmedabad / Area"
              className="w-full mt-1 p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* RENT */}
          <div>
            <label className="text-gray-700 font-semibold">Rent (₹) *</label>
            <input
              type="number"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              placeholder="45000"
              className="w-full mt-1 p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-gray-700 font-semibold">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the property..."
              className="w-full mt-1 p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="text-gray-700 font-semibold">Images</label>

            {/* Upload Box */}
            <div
              className="mt-3 border-2 border-dashed border-green-300 bg-green-50/40 rounded-2xl p-6 cursor-pointer
               flex flex-col items-center justify-center transition hover:border-green-500 hover:bg-green-50"
              onClick={() => document.getElementById("imageInput").click()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16l5-6 4 5 4-3 5 6M3 4h18"
                />
              </svg>

              <p className="mt-2 text-gray-700 font-medium">
                Drag & Drop or{" "}
                <span className="text-green-600 underline">Browse Files</span>
              </p>

              <p className="text-xs text-gray-500">Upload multiple images</p>

              <input
                id="imageInput"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Existing Images (edit mode) */}
            {id && existingImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {existingImages.map((img, idx) => {
                  const key = img._id || img.public_id || `${img.url}-${idx}`;
                  return (
                    <div
                      key={key}
                      className="relative group rounded-xl overflow-hidden shadow-md border border-gray-200"
                    >
                      <img
                        src={img?.url || ""}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                        className="w-full h-28 object-cover transition group-hover:scale-110"
                        alt="existing"
                      />

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveExisting(img._id || img.public_id || idx)
                        }
                        className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full 
                       shadow-md opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* New selected preview images */}
            {previewImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {previewImages.map((p) => (
                  <div
                    key={p.id}
                    className="relative group rounded-xl overflow-hidden shadow-md border border-gray-200"
                  >
                    <img
                      src={p.url || ""}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                      className="w-full h-28 object-cover transition group-hover:scale-110"
                      alt="preview"
                    />

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleRemovePreview(p.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full 
                       shadow-md opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={creating || updating}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all active:scale-95"
          >
            {id
              ? updating
                ? "Updating..."
                : "Update Property"
              : creating
              ? "Creating..."
              : "Create Property"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
