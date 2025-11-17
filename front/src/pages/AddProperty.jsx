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

// /**
//  * AddProperty.jsx
//  * - Create mode: /add-property
//  * - Edit mode: /edit-property/:id
//  *
//  * Notes:
//  * - Backend expects multipart/form-data with files under field name "images"
//  * - Backend will set ownerId from token
//  * - On update: if new images are uploaded they replace existing images; if none uploaded, existing images are kept
//  */

// export default function AddProperty() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { id } = useParams(); // if id exists → edit mode

//   const {
//     items: properties,
//     creating,
//     updating,
//   } = useSelector((state) => state.properties);

//   // Form fields
//   const [title, setTitle] = useState("");
//   const [location, setLocation] = useState("");
//   const [rent, setRent] = useState("");
//   const [description, setDescription] = useState("");

//   // Images handling
//   const [images, setImages] = useState([]); // File objects selected now
//   const [previewImages, setPreviewImages] = useState([]); // local preview URLs
//   const [existingImages, setExistingImages] = useState([]); // from server when editing

//   // Load properties (so edit mode can prefill)
//   useEffect(() => {
//     // If editing and we haven't loaded properties yet, fetch them
//     if (id && properties.length === 0) {
//       dispatch(getMyProperties()).catch(() => {});
//     }
//   }, [id, properties, dispatch]);

//   // Prefill form in edit mode when properties are available
//   useEffect(() => {
//     if (id && properties.length > 0) {
//       const p = properties.find((prop) => prop._id === id);
//       if (!p) return;

//       setTitle(p.title || "");
//       setLocation(p.location || "");
//       setRent(p.rent ?? "");
//       setDescription(p.description || "");
//       setExistingImages(Array.isArray(p.images) ? p.images : []);
//     }
//   }, [id, properties]);

//   // Handle file input change
//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files || []);
//     setImages(files);

//     // Create object URLs for preview
//     const previews = files.map((f) => URL.createObjectURL(f));
//     setPreviewImages(previews);
//   };

//   // Clean up object URLs on unmount to avoid memory leaks
//   useEffect(() => {
//     return () => {
//       previewImages.forEach((url) => URL.revokeObjectURL(url));
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [previewImages]);

//   // Submit handler (create or update)
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title?.trim() || !location?.trim() || !rent) {
//       toast.error("Please fill required fields: title, location, rent");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("location", location);
//     formData.append("rent", rent);
//     formData.append("description", description);

//     // Append files only if user selected new ones
//     images.forEach((file) => {
//       formData.append("images", file);
//     });

//     try {
//       if (id) {
//         // Edit mode
//         await dispatch(updateProperty({ id, formData })).unwrap();
//         toast.success("Property updated successfully");
//       } else {
//         // Create mode
//         await dispatch(createProperty(formData)).unwrap();
//         toast.success("Property created successfully");
//       }

//       // Refresh local list and navigate back to My Properties
//       await dispatch(getMyProperties()).catch(() => {});
//       navigate("/my-properties");
//     } catch (err) {
//       toast.error(err || "Failed to save property");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 py-10 px-6">
//       <motion.div
//         initial={{ opacity: 0, y: -8 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20"
//       >
//         <h1 className="text-3xl font-bold text-white mb-6">
//           {id ? "Edit Property" : "Add New Property"}
//         </h1>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-5">
//           {/* Title */}
//           <div>
//             <label className="text-white font-semibold">Title *</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full mt-1 p-3 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none"
//               placeholder="e.g. 2BHK near SG Highway"
//               required
//             />
//           </div>

//           {/* Location */}
//           <div>
//             <label className="text-white font-semibold">Location *</label>
//             <input
//               type="text"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               className="w-full mt-1 p-3 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none"
//               placeholder="City / Area"
//               required
//             />
//           </div>

//           {/* Rent */}
//           <div>
//             <label className="text-white font-semibold">Rent (₹) *</label>
//             <input
//               type="number"
//               value={rent}
//               onChange={(e) => setRent(e.target.value)}
//               className="w-full mt-1 p-3 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none"
//               placeholder="Monthly rent amount"
//               required
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="text-white font-semibold">Description</label>
//             <textarea
//               rows={4}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full mt-1 p-3 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none"
//               placeholder="Optional property description"
//             />
//           </div>

//           {/* Images */}
//           <div>
//             <label className="text-white font-semibold">Images</label>
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={handleImageChange}
//               className="mt-2 text-white"
//             />

//             {/* Show existing images (edit mode) only when user hasn't selected new ones */}
//             {id && existingImages.length > 0 && previewImages.length === 0 && (
//               <div className="grid grid-cols-3 gap-3 mt-3">
//                 {existingImages.map((img, idx) => (
//                   <div key={idx} className="relative">
//                     <img
//                       src={img.url}
//                       alt={`existing-${idx}`}
//                       className="w-28 h-28 object-cover rounded-xl border border-white/20"
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Preview selected new images */}
//             {previewImages.length > 0 && (
//               <div className="grid grid-cols-3 gap-3 mt-3">
//                 {previewImages.map((src, idx) => (
//                   <img
//                     key={idx}
//                     src={src}
//                     alt={`preview-${idx}`}
//                     className="w-28 h-28 object-cover rounded-xl border border-white/20"
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Submit */}
//           <div>
//             <button
//               type="submit"
//               disabled={creating || updating}
//               className="bg-green-500/70 hover:bg-green-500 text-white font-semibold py-3 rounded-xl shadow-lg transition mt-4 w-full"
//             >
//               {id
//                 ? updating
//                   ? "Updating..."
//                   : "Update Property"
//                 : creating
//                 ? "Creating..."
//                 : "Create Property"}
//             </button>
//           </div>
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
  const { id } = useParams(); // edit mode if id exists

  const { items: properties, creating, updating } = useSelector(
    (state) => state.properties
  );

  // -------------------------------
  // FORM STATES
  // -------------------------------
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [rent, setRent] = useState("");
  const [description, setDescription] = useState("");

  // Images
  const [images, setImages] = useState([]); // new uploads (File objects)
  const [previewImages, setPreviewImages] = useState([]); // preview URLs
  const [existingImages, setExistingImages] = useState([]); // old images for edit mode

  // -------------------------------
  // LOAD PROPERTY IN EDIT MODE
  // -------------------------------
  useEffect(() => {
    if (id && properties.length === 0) {
      dispatch(getMyProperties());
    }
  }, [id, properties, dispatch]);

  useEffect(() => {
    if (id && properties.length > 0) {
      const p = properties.find((prop) => prop._id === id);
      if (!p) return;

      setTitle(p.title);
      setLocation(p.location);
      setRent(p.rent);
      setDescription(p.description);
      setExistingImages(p.images || []);
    }
  }, [id, properties]);

  // -------------------------------
  // HANDLE IMAGE PREVIEW
  // -------------------------------
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  // -------------------------------
  // HANDLE SUBMIT (CREATE / UPDATE)
  // -------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !location.trim() || !rent) {
      toast.error("Please fill required fields: Title, Location, Rent");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("rent", rent);
    formData.append("description", description);

    // New images (optional)
    images.forEach((file) => {
      formData.append("images", file);
    });

    // -------------------------------
    // EDIT MODE
    // -------------------------------
    if (id) {
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

    // -------------------------------
    // CREATE MODE
    // -------------------------------
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
  // RENDER
  // -------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 py-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20"
      >
        <h1 className="text-3xl font-bold text-white mb-6">
          {id ? "Edit Property" : "Add New Property"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* TITLE */}
          <div>
            <label className="text-white font-semibold">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none"
              placeholder="2BHK near SG Highway"
            />
          </div>

          {/* LOCATION */}
          <div>
            <label className="text-white font-semibold">Location *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none"
              placeholder="Ahmedabad / Area"
            />
          </div>

          {/* RENT */}
          <div>
            <label className="text-white font-semibold">Rent (₹) *</label>
            <input
              type="number"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none"
              placeholder="45000"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-white font-semibold">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none"
              placeholder="About the property…"
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="text-white font-semibold">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 text-white"
            />

            {/* Existing images (edit mode only, no new selected) */}
            {id && existingImages.length > 0 && previewImages.length === 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {existingImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url}
                    className="w-28 h-28 object-cover rounded-xl border border-white/20"
                    alt=""
                  />
                ))}
              </div>
            )}

            {/* Preview new selected images */}
            {previewImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {previewImages.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    className="w-28 h-28 object-cover rounded-xl border border-white/20"
                    alt=""
                  />
                ))}
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={creating || updating}
            className="bg-green-500/70 hover:bg-green-500 text-white font-semibold py-3 rounded-xl shadow-lg transition mt-4"
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
