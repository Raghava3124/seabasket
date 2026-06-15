"use client";

import { useEffect, useState } from "react";
import { Package, Truck, CheckCircle2, LayoutDashboard, Loader2, Tags, ShoppingBag, Plus, Trash2, Image as ImageIcon, Edit, MessageSquare, MapPin, AlertTriangle } from "lucide-react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

const AddressMapPicker = dynamic(() => import("@/components/AddressMapPicker"), { ssr: false });

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"ORDERS" | "PRODUCTS" | "CATEGORIES" | "MESSAGES" | "STORE" | "BANNERS" | "ALERTS">("ORDERS");

  // Data States
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [storeConfig, setStoreConfig] = useState<any>(null);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Store Form States
  const [formLat, setFormLat] = useState<number>(16.9834);
  const [formLng, setFormLng] = useState<number>(81.7836);
  const [formAddress, setFormAddress] = useState<string>("");

  useEffect(() => {
    if (storeConfig) {
      setFormLat(storeConfig.latitude);
      setFormLng(storeConfig.longitude);
      setFormAddress(storeConfig.address || "");
    }
  }, [storeConfig]);

  // Form States
  const [editingCategory, setEditingCategory] = useState<any>(null); // null means not editing/adding, empty object means adding, populated means editing
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordRes, prodRes, catRes, feedRes, storeRes, banRes] = await Promise.all([
        fetch("/api/admin/orders"),
        fetch("/api/admin/inventory/product"),
        fetch("/api/admin/inventory/category"),
        fetch("/api/feedback"),
        fetch("/api/store"),
        fetch("/api/banners")
      ]);

      if (ordRes.ok) setOrders((await ordRes.json()).orders);
      if (prodRes.ok) setProducts((await prodRes.json()).products);
      if (catRes.ok) setCategories((await catRes.json()).categories);
      if (feedRes.ok) setFeedbacks((await feedRes.json()).feedbacks);
      if (storeRes.ok) setStoreConfig((await storeRes.json()).store);
      if (banRes.ok) setBanners((await banRes.json()).banners);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // --- Orders Logic ---
  const updateOrderStatus = async (orderId: string, status: string) => {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status })
    });
    fetchData();
  };

  // --- Category Logic ---
  const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      let imageUrl = editingCategory?.imageUrl || "";
      const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;

      if (fileInput.files && fileInput.files.length > 0) {
        const uploadData = new FormData();
        uploadData.append("file", fileInput.files[0]);
        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: uploadData });
        const uploadJson = await uploadRes.json();
        if (!uploadJson.success) throw new Error(uploadJson.error);
        imageUrl = uploadJson.url;
      }

      const method = editingCategory?.id ? "PUT" : "POST";
      const payload = {
        id: editingCategory?.id,
        name: formData.get("name"),
        slug: formData.get("slug"),
        imageUrl
      };

      const res = await fetch("/api/admin/inventory/category", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setEditingCategory(null);
        fetchData();
      } else {
        const errData = await res.json();
        toast.error(errData.error);
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await fetch("/api/admin/inventory/category", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    fetchData();
  };

  // --- Product Logic ---
  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      let imageUrl = editingProduct?.imageUrl || "";
      const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;

      if (fileInput.files && fileInput.files.length > 0) {
        const uploadData = new FormData();
        uploadData.append("file", fileInput.files[0]);
        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: uploadData });
        const uploadJson = await uploadRes.json();
        if (!uploadJson.success) throw new Error(uploadJson.error);
        imageUrl = uploadJson.url;
      } else if (!imageUrl) {
        throw new Error("Please select an image");
      }

      const method = editingProduct?.id ? "PUT" : "POST";
      const grossVal = formData.get("grossWeightValue");
      const netVal = formData.get("netWeightValue");

      const payload = {
        id: editingProduct?.id,
        categoryId: formData.get("categoryId"),
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        offerPrice: formData.get("offerPrice") || null,
        stock: formData.get("stock"),
        stockUnit: formData.get("stockUnit"),
        lowStockThreshold: formData.get("lowStockThreshold"),
        grossWeight: grossVal ? `${grossVal}${formData.get("grossWeightUnit")}` : "",
        netWeight: netVal ? `${netVal}${formData.get("netWeightUnit")}` : "",
        isBestseller: formData.get("isBestseller") === "on",
        imageUrl
      };

      const prodRes = await fetch("/api/admin/inventory/product", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (prodRes.ok) {
        setEditingProduct(null);
        fetchData();
      } else {
        const errData = await prodRes.json();
        toast.error(errData.error);
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveBanner = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const payload = {
        id: editingBanner?.id,
        title: formData.get("title"),
        subtitle: formData.get("subtitle"),
        categoryId: formData.get("categoryId")
      };

      const res = await fetch("/api/banners", {
        method: editingBanner?.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setEditingBanner(null);
        fetchData();
        toast.success("Banner created successfully!");
      } else {
        const errData = await res.json();
        toast.error(errData.error);
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch("/api/admin/inventory/product", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    fetchData();
  };

  const deleteFeedback = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await fetch("/api/feedback", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    fetchData();
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    await fetch("/api/banners", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    fetchData();
  };

  const handleSaveStore = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await fetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: parseFloat(formData.get("latitude") as string),
          longitude: parseFloat(formData.get("longitude") as string),
          radiusKm: parseFloat(formData.get("radiusKm") as string),
          address: formData.get("address") as string,
        }),
      });
      fetchData();
      toast.success("Store configuration saved successfully!");
    } catch (err) {
      toast.error("Failed to save store configuration");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading && orders.length === 0) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#0B3B60] h-8 w-8" /></div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-[#0B3B60] text-white py-6">
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-6 w-6" />
            <h1 className="text-2xl font-black tracking-tight">Admin Console</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("ORDERS")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === "ORDERS" ? "bg-[#0B3B60] text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <Package className="h-5 w-5" /> Live Orders
          </button>
          <button
            onClick={() => setActiveTab("CATEGORIES")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === "CATEGORIES" ? "bg-[#0B3B60] text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <Tags className="h-5 w-5" /> Categories
          </button>
          <button
            onClick={() => setActiveTab("PRODUCTS")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === "PRODUCTS" ? "bg-[#0B3B60] text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <ShoppingBag className="h-5 w-5" /> Products
          </button>
          <button
            onClick={() => setActiveTab("MESSAGES")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === "MESSAGES" ? "bg-[#0B3B60] text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <MessageSquare className="h-5 w-5" /> Messages
          </button>
          <button
            onClick={() => setActiveTab("ALERTS")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === "ALERTS" ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <AlertTriangle className="h-5 w-5" />
            Alerts
            {products.some(p => p.stock < (p.lowStockThreshold || 5000)) && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1 animate-pulse">!</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("STORE")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === "STORE" ? "bg-[#0B3B60] text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <MapPin className="h-5 w-5" /> Store Settings
          </button>
          <button
            onClick={() => setActiveTab("BANNERS")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === "BANNERS" ? "bg-[#0B3B60] text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <ImageIcon className="h-5 w-5" /> Banners
          </button>
        </div>

        {/* --- ORDERS TAB --- */}
        {activeTab === "ORDERS" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Live Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Order ID</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Total</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-medium">#{order.id.slice(-6).toUpperCase()}</td>
                      <td className="p-4">{order.user.name || "Guest"} <span className="text-xs text-gray-500 block">+91 {order.user.phone}</span></td>
                      <td className="p-4 font-bold">₹{order.totalAmount}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'PREPARING' ? 'bg-orange-100 text-orange-700' :
                            order.status === 'DISPATCHED' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>{order.status}</span>
                      </td>
                      <td className="p-4">
                        {order.status === 'PREPARING' && (
                          <button onClick={() => updateOrderStatus(order.id, 'DISPATCHED')} className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded transition-colors" title="Dispatch"><Truck className="h-4 w-4" /></button>
                        )}
                        {order.status === 'DISPATCHED' && (
                          <button onClick={() => updateOrderStatus(order.id, 'DELIVERED')} className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded transition-colors" title="Deliver"><CheckCircle2 className="h-4 w-4" /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- CATEGORIES TAB --- */}
        {activeTab === "CATEGORIES" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Manage Categories</h2>
              <button onClick={() => setEditingCategory({})} className="bg-brand text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-dark transition-colors">
                <Plus className="h-4 w-4" /> New Category
              </button>
            </div>

            {editingCategory && (
              <form onSubmit={handleSaveCategory} className="bg-white p-6 rounded-xl shadow-sm border border-brand ring-1 ring-brand/20">
                <h3 className="font-bold mb-4">{editingCategory.id ? "Edit Category" : "Add New Category"}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Category Image Upload */}
                  <div className="col-span-full">
                    <label className="block text-sm font-bold text-gray-900 mb-2">Category Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
                      {editingCategory.imageUrl && !isUploading && (
                        <img src={editingCategory.imageUrl} alt="preview" className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-20" />
                      )}
                      <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2 relative z-10" />
                      <input type="file" name="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand/10 file:text-brand hover:file:bg-brand/20 cursor-pointer relative z-10" />
                      <p className="text-xs text-gray-500 mt-2 relative z-10">
                        {editingCategory.id ? "Upload to replace image" : "Upload directly to Cloudinary"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Category Name</label>
                    <input name="name" defaultValue={editingCategory.name} required className="w-full border rounded-lg p-2" placeholder="e.g. Exotic Catch" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">URL Slug</label>
                    <input name="slug" defaultValue={editingCategory.slug} required className="w-full border rounded-lg p-2" placeholder="e.g. exotic-catch" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={isUploading} className="bg-[#0B3B60] text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50">
                    {isUploading ? "Uploading & Saving..." : "Save Category"}
                  </button>
                  <button type="button" onClick={() => setEditingCategory(null)} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-bold">Cancel</button>
                </div>
              </form>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold w-16">Image</th>
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Slug</th>
                    <th className="p-4 font-semibold">Products Linked</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {categories.map(cat => (
                    <tr key={cat.id}>
                      <td className="p-4">
                        {cat.imageUrl ? (
                          <img src={cat.imageUrl} alt={cat.name} className="w-10 h-10 rounded object-cover bg-gray-100" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center"><ImageIcon className="h-4 w-4 text-gray-300" /></div>
                        )}
                      </td>
                      <td className="p-4 font-bold text-gray-900">{cat.name}</td>
                      <td className="p-4 font-mono text-gray-500">{cat.slug}</td>
                      <td className="p-4">{cat._count?.products || 0}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditingCategory(cat)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => deleteCategory(cat.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- PRODUCTS TAB --- */}
        {activeTab === "PRODUCTS" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Manage Products</h2>
              <button onClick={() => setEditingProduct({})} className="bg-brand text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-dark transition-colors">
                <Plus className="h-4 w-4" /> New Product
              </button>
            </div>

            {editingProduct && (
              <form onSubmit={handleSaveProduct} className="bg-white p-6 rounded-xl shadow-sm border border-brand ring-1 ring-brand/20">
                <h3 className="font-bold mb-4">{editingProduct.id ? "Edit Product" : "Add New Product"}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {/* Image Upload */}
                  <div className="col-span-full">
                    <label className="block text-sm font-bold text-gray-900 mb-2">Product Image {!editingProduct.id && <span className="text-red-500">*</span>}</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
                      {editingProduct.imageUrl && !isUploading && (
                        <img src={editingProduct.imageUrl} alt="preview" className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-20" />
                      )}
                      <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2 relative z-10" />
                      <input type="file" name="file" accept="image/*" required={!editingProduct.id} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand/10 file:text-brand hover:file:bg-brand/20 cursor-pointer relative z-10" />
                      <p className="text-xs text-gray-500 mt-2 relative z-10">
                        {editingProduct.id ? "Upload new image to replace existing" : "Upload directly to Cloudinary"}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-full md:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 mb-1">Product Name</label>
                    <input name="name" defaultValue={editingProduct.name} required className="w-full border rounded-lg p-2" placeholder="e.g. Premium Tiger Prawns" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Category</label>
                    <select name="categoryId" defaultValue={editingProduct.categoryId} required className="w-full border rounded-lg p-2 bg-white">
                      <option value="">Select a category...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="col-span-full">
                    <label className="block text-xs font-bold text-gray-600 mb-1">Description</label>
                    <textarea name="description" defaultValue={editingProduct.description} required rows={2} className="w-full border rounded-lg p-2" placeholder="Brief product description..." />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Price (₹) <span className="text-red-500">*</span></label>
                    <input type="number" name="price" defaultValue={editingProduct.price} required min="1" className="w-full border rounded-lg p-2" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Offer Price (₹) <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <input type="number" name="offerPrice" defaultValue={editingProduct.offerPrice} min="1" className="w-full border rounded-lg p-2" placeholder="Discounted price" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      Stock Quantity <span className="text-red-500">*</span>
                      {editingProduct.id && editingProduct.stock !== undefined && (
                        <span className="ml-2 text-brand bg-brand/10 px-2 py-0.5 rounded-full text-[10px]">
                          Current: {editingProduct.stock >= 1000 && editingProduct.stock % 1000 === 0 ? `${editingProduct.stock / 1000} KG` : `${editingProduct.stock} Grams`}
                        </span>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <input type="number" name="stock" defaultValue={editingProduct.stock ? (editingProduct.stock >= 1000 && editingProduct.stock % 1000 === 0 ? editingProduct.stock / 1000 : editingProduct.stock) : ""} required min="0" step="any" className="w-full border rounded-lg p-2" />
                      <select name="stockUnit" defaultValue={editingProduct.stock && editingProduct.stock >= 1000 && editingProduct.stock % 1000 === 0 ? "kg" : "g"} className="border rounded-lg p-2 bg-gray-50">
                        <option value="kg">KG</option>
                        <option value="g">Grams</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Low Stock Alert Threshold</label>
                    <div className="flex items-center gap-2">
                      <input type="number" name="lowStockThreshold" defaultValue={editingProduct.lowStockThreshold || 5000} required min="0" className="w-full border rounded-lg p-2" />
                      <span className="text-sm font-bold text-gray-500">Grams</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Gross Weight</label>
                    <div className="flex gap-2">
                      <input type="number" step="any" name="grossWeightValue" defaultValue={editingProduct.grossWeight ? parseFloat(editingProduct.grossWeight) : ""} className="w-full border rounded-lg p-2" />
                      <select name="grossWeightUnit" defaultValue={editingProduct.grossWeight?.toLowerCase().endsWith("kg") ? "kg" : "g"} className="border rounded-lg p-2 bg-gray-50">
                        <option value="kg">KG</option>
                        <option value="g">Grams</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Net Weight <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <input type="number" step="any" name="netWeightValue" defaultValue={editingProduct.netWeight ? parseFloat(editingProduct.netWeight) : ""} required className="w-full border rounded-lg p-2" />
                      <select name="netWeightUnit" defaultValue={editingProduct.netWeight?.toLowerCase().endsWith("kg") ? "kg" : "g"} className="border rounded-lg p-2 bg-gray-50">
                        <option value="kg">KG</option>
                        <option value="g">Grams</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-span-full border-t pt-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-sm w-fit">
                      <input type="checkbox" name="isBestseller" defaultChecked={editingProduct.isBestseller} className="w-4 h-4 text-brand focus:ring-brand" />
                      Mark as Bestseller
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 border-t pt-4">
                  <button type="submit" disabled={isUploading} className="bg-[#0B3B60] hover:bg-[#07243c] text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50">
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    {isUploading ? "Uploading Image & Saving..." : "Save Product"}
                  </button>
                  <button type="button" onClick={() => setEditingProduct(null)} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-bold">Cancel</button>
                </div>
              </form>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold w-16">Image</th>
                      <th className="p-4 font-semibold">Product Info</th>
                      <th className="p-4 font-semibold">Price</th>
                      <th className="p-4 font-semibold">Stock</th>
                      <th className="p-4 font-semibold">Category</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {products.map(prod => (
                      <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <img src={prod.imageUrl} alt={prod.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-gray-900">{prod.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{prod.netWeight} {prod.isBestseller && '⭐ Bestseller'}</p>
                        </td>
                        <td className="p-4">
                          <div className="font-bold">₹{prod.offerPrice || prod.price}</div>
                          {prod.offerPrice && <div className="text-xs text-gray-400 line-through">₹{prod.price}</div>}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${prod.stock < (prod.lowStockThreshold || 5000) ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                            {prod.stock >= 1000 && prod.stock % 1000 === 0 ? `${prod.stock / 1000}kg` : `${prod.stock}g`}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">{prod.category?.name || 'Uncategorized'}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingProduct(prod)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit className="h-4 w-4" /></button>
                            <button onClick={() => deleteProduct(prod.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- MESSAGES TAB --- */}
        {activeTab === "MESSAGES" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Customer Messages & Feedback</h2>
            </div>
            <div className="p-6">
              {feedbacks.length === 0 ? (
                <p className="text-gray-500">No messages found.</p>
              ) : (
                <div className="space-y-4">
                  {feedbacks.map(fb => (
                    <div key={fb.id} className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50/50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900">{fb.subject}</h3>
                          <p className="text-sm text-gray-600">{fb.name} • {fb.email} • {fb.phone}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-gray-400">{new Date(fb.createdAt).toLocaleDateString()}</span>
                          <button onClick={() => deleteFeedback(fb.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete Message">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-800 text-sm mt-3 bg-white p-3 rounded-lg border border-gray-100">{fb.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- STORE TAB --- */}
        {activeTab === "STORE" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Store Delivery Configuration</h2>
              <p className="text-sm text-gray-500 mt-1">Set your primary store location to validate customer addresses within a specific delivery radius.</p>
            </div>
            <div className="p-6">
              <div className="mb-8">
                <AddressMapPicker
                  onLocationSelect={(details, lat, lng) => {
                    setFormLat(lat);
                    setFormLng(lng);
                    setFormAddress(`${details.flat ? details.flat + ', ' : ''}${details.street ? details.street + ', ' : ''}${details.area}`);
                  }}
                />
              </div>

              <form onSubmit={handleSaveStore} className="max-w-2xl space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Store Latitude</label>
                    <input type="number" step="any" name="latitude" value={formLat} onChange={e => setFormLat(parseFloat(e.target.value))} required className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50" readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Store Longitude</label>
                    <input type="number" step="any" name="longitude" value={formLng} onChange={e => setFormLng(parseFloat(e.target.value))} required className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50" readOnly />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Radius (in Kilometers)</label>
                  <input type="number" step="any" name="radiusKm" defaultValue={storeConfig?.radiusKm || 25} required className="w-full border border-gray-300 rounded-lg p-3" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Store Physical Address (Optional)</label>
                  <input type="text" name="address" value={formAddress} onChange={e => setFormAddress(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3" placeholder="Full address..." />
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={isUploading} className="bg-[#0B3B60] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#072640] transition-colors flex items-center gap-2">
                    {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Store Configuration"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- BANNERS TAB --- */}
        {activeTab === "BANNERS" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Manage Banners</h2>
              <button onClick={() => setEditingBanner({})} className="bg-brand text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-dark transition-colors">
                <Plus className="h-4 w-4" /> New Banner
              </button>
            </div>

            {editingBanner && (
              <form onSubmit={handleSaveBanner} className="bg-white p-6 rounded-xl shadow-sm border border-brand ring-1 ring-brand/20">
                <h3 className="font-bold mb-4">{editingBanner.id ? "Edit Banner" : "Add New Banner"}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Banner Title <span className="text-red-500">*</span></label>
                    <input name="title" defaultValue={editingBanner.title} required className="w-full border rounded-lg p-2" placeholder="e.g. Fresh Catch of the Day!" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Banner Subtitle <span className="text-red-500">*</span></label>
                    <input name="subtitle" defaultValue={editingBanner.subtitle} required className="w-full border rounded-lg p-2" placeholder="e.g. Get 20% off on all Premium Seafood." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 mb-1">Target Category <span className="text-red-500">*</span></label>
                    <select name="categoryId" defaultValue={editingBanner.categoryId} required className="w-full border rounded-lg p-2 bg-white">
                      <option value="">Select a category to link to...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">When customers click "Order Now" on this banner, they will be redirected to this category.</p>
                  </div>
                </div>

                <div className="flex gap-2 border-t pt-4">
                  <button type="submit" disabled={isUploading} className="bg-[#0B3B60] hover:bg-[#07243c] text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Save Banner
                  </button>
                  <button type="button" onClick={() => setEditingBanner(null)} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-bold">Cancel</button>
                </div>
              </form>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Title & Subtitle</th>
                    <th className="p-4 font-semibold">Linked Category</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {banners.map(banner => (
                    <tr key={banner.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-gray-900 text-lg">{banner.title}</p>
                        <p className="text-gray-500">{banner.subtitle}</p>
                      </td>
                      <td className="p-4">
                        <span className="bg-brand/10 text-brand px-3 py-1 rounded-full font-bold text-xs">
                          {banner.category?.name || "Unknown"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditingBanner(banner)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => deleteBanner(banner.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {banners.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-gray-500">No banners found. Create one to show on the homepage.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- ALERTS TAB --- */}
        {activeTab === "ALERTS" && (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-black flex items-center gap-2"><AlertTriangle className="h-6 w-6" /> Low Stock Alerts</h2>
              <p className="mt-2 font-medium">The following products are below their minimum stock threshold and require immediate restocking.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold w-16">Image</th>
                      <th className="p-4 font-semibold">Product Info</th>
                      <th className="p-4 font-semibold">Current Stock</th>
                      <th className="p-4 font-semibold">Threshold</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {products.filter(p => p.stock < (p.lowStockThreshold || 5000)).map(prod => (
                      <tr key={prod.id} className="hover:bg-red-50/30 transition-colors bg-white">
                        <td className="p-4">
                          <img src={prod.imageUrl} alt={prod.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-gray-900">{prod.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{prod.category?.name}</p>
                        </td>
                        <td className="p-4">
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-bold shadow-sm">
                            {prod.stock >= 1000 && prod.stock % 1000 === 0 ? `${prod.stock / 1000}kg` : `${prod.stock}g`}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 font-medium">
                          {prod.lowStockThreshold >= 1000 && prod.lowStockThreshold % 1000 === 0 ? `${prod.lowStockThreshold / 1000}kg` : `${prod.lowStockThreshold || 5000}g`}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setEditingProduct(prod);
                              setActiveTab("PRODUCTS");
                            }}
                            className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg font-bold transition-colors text-xs"
                          >
                            Update Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                    {products.filter(p => p.stock < (p.lowStockThreshold || 5000)).length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">
                          <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-3 opacity-50" />
                          All products are sufficiently stocked! No alerts to show.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
