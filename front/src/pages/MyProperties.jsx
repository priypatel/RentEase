import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyProperties, deleteProperty } from "../redux/slices/propertySlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function MyProperties() {
  const dispatch = useDispatch();

  const {
    items: properties,
    loading,
    deleting,
  } = useSelector((state) => state.properties);

  useEffect(() => {
    dispatch(getMyProperties());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property?")) return;

    await dispatch(deleteProperty(id)).unwrap();
    toast.success("Property deleted");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between text-white mb-6">
          <h1 className="text-3xl font-bold">My Properties</h1>

          <Link
            to="/add-property"
            className="bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20"
          >
            + Add Property
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <motion.div
              key={p._id}
              className="bg-white/10 rounded-xl p-4 shadow-xl border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <img
                src={p.images?.[0]?.url}
                className="w-full h-40 rounded-lg object-cover"
              />

              <h2 className="text-white text-xl mt-3">{p.title}</h2>
              <p className="text-white/80">{p.location}</p>
              <p className="text-green-300 font-bold mt-1">₹{p.rent}</p>

              <div className="flex justify-between mt-4">
                <Link
                  to={`/edit-property/${p._id}`}
                  className="bg-white/10 px-3 py-1 text-white rounded hover:bg-white/20"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500/40 px-3 py-1 text-white rounded hover:bg-red-500/50"
                >
                  {deleting ? "..." : "Delete"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
