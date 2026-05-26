import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Trash2, Mail, Briefcase, Settings, Globe, Users, 
  BookOpen, Star, Shield, Layout, Server, AlertCircle, Edit, Eye, EyeOff, Cpu, GripVertical 
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableCard = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transition,
    opacity: isDragging ? 0.6 : 1,
    boxShadow: isDragging ? '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)' : undefined,
    transform: isDragging 
      ? `${CSS.Transform.toString(transform)} scale(1.02)` 
      : CSS.Transform.toString(transform),
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl text-xs gap-4 font-sans"
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-white p-1 flex-shrink-0 select-none"
        style={{ touchAction: 'none' }}
      >
        <GripVertical size={16} />
      </div>
      {children}
    </div>
  );
};

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    services: 0,
    projects: 0,
    products: 0,
    team: 0,
    blogs: 0,
    testimonials: 0,
    enquiries: 0,
    users: 0
  });

  // State arrays for CRUD lists
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [team, setTeam] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);

  // Form states
  const [newService, setNewService] = useState({ title: '', description: '', features: '', tech: '', process: '' });
  const [newProject, setNewProject] = useState({ title: '', description: '', imageUrl: '', techStack: '', link: '' });
  const [newProduct, setNewProduct] = useState({ name: '', overview: '', features: '', benefits: '', price: '', demoUrl: '', imageUrl: '' });
  const [newTeam, setNewTeam] = useState({ name: '', role: '', skills: '', experience: '', linkedin: '', twitter: '', github: '', imageUrl: '' });
  const [newBlog, setNewBlog] = useState({ title: '', content: '', category: 'AI', author: '', imageUrl: '' });
  const [newTestimonial, setNewTestimonial] = useState({ clientName: '', company: '', review: '', rating: 5, imageUrl: '' });
  const [generalSettings, setGeneralSettings] = useState({ siteName: '', contactEmail: '', contactPhone: '', address: '', footerDescription: '', footerTagline: '' });
  const [seoSettings, setSeoSettings] = useState({ title: '', description: '', keywords: '' });
  const [statsSettings, setStatsSettings] = useState([
    { id: 'projects', iconName: 'Rocket', value: '', label: '' },
    { id: 'clients', iconName: 'Users', value: '', label: '' },
    { id: 'products', iconName: 'Cpu', value: '', label: '' },
    { id: 'support', iconName: 'Headphones', value: '', label: '' }
  ]);
  const [newUser, setNewUser] = useState({ username: '', password: '' });
  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const API_URL = '/api';

  // Authenticated fetch helper — injects Bearer token and handles 401 (auto-logout)
  const authFetch = async (url, options = {}) => {
    const token = sessionStorage.getItem('adminToken');
    const headers = {
      ...(options.headers || {}),
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminUser');
      onLogout();
      throw new Error('Session expired. Please log in again.');
    }
    return res;
  };

  useEffect(() => {
    cancelEdit();
    fetchData();
  }, [activeTab]);

  const showMessage = (msg, err = false) => {
    if (err) {
      setError(msg);
      setTimeout(() => setError(''), 4000);
    } else {
      setMessage(msg);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewService({ title: '', description: '', features: '', tech: '', process: '' });
    setNewProject({ title: '', description: '', imageUrl: '', techStack: '', link: '' });
    setNewProduct({ name: '', overview: '', features: '', benefits: '', price: '', demoUrl: '', imageUrl: '' });
    setNewTeam({ name: '', role: '', skills: '', experience: '', linkedin: '', twitter: '', github: '', imageUrl: '' });
    setNewBlog({ title: '', content: '', category: 'AI', author: '', imageUrl: '' });
    setNewTestimonial({ clientName: '', company: '', review: '', rating: 5, imageUrl: '' });
  };

  /**
   * Compress image using HTML5 Canvas
   * Reduces image file size from 5MB+ to ~35KB
   * 
   * @param {string} base64Str - Base64 Data URI of the image
   * @param {number} maxWidth - Maximum width in pixels (default: 800)
   * @param {number} maxHeight - Maximum height in pixels (default: 800)
   * @param {number} quality - JPEG quality 0-1 (default: 0.7)
   * @returns {Promise<string>} Compressed Base64 Data URI
   */
  const compressImage = async (base64Str, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;

      img.onload = () => {
        // Calculate new dimensions preserving aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Create off-screen canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Export as compressed JPEG
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };

      img.onerror = () => {
        // If compression fails, return original
        resolve(base64Str);
      };
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = async (event, type, items, setItems) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(item => item._id === active.id);
    const newIndex = items.findIndex(item => item._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedItems = arrayMove(items, oldIndex, newIndex);
    setItems(reorderedItems);

    try {
      const reorderedPayload = reorderedItems.map((item, index) => ({
        id: item._id,
        displayOrder: index + 1
      }));

      const res = await authFetch(`${API_URL}/admin/reorder?type=${type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reorderedPayload)
      });

      if (res.ok) {
        showMessage('Order updated successfully.');
      } else {
        const errData = await res.json().catch(() => ({}));
        showMessage(errData.error || errData.message || 'Failed to persist order', true);
        setItems(items); // Rollback
      }
    } catch (err) {
      console.error(err);
      showMessage('Network error while saving order', true);
      setItems(items); // Rollback
    }
  };

  const handleToggleStatus = async (endpoint, item) => {
    try {
      const res = await authFetch(`${API_URL}/${endpoint}/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: item.isActive === false ? true : false })
      });
      if (res.ok) {
        showMessage('Status updated successfully.');
        fetchData();
      } else {
        const data = await res.json();
        showMessage(data.message || 'Status update failed', true);
      }
    } catch (err) {
      showMessage('Failed to toggle status', true);
    }
  };

  const startEditService = (s) => {
    setEditingId(s._id);
    setNewService({
      title: s.title,
      description: s.description,
      features: s.features ? s.features.join(', ') : '',
      tech: s.tech ? s.tech.join(', ') : '',
      process: s.process ? s.process.join(', ') : ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startEditProject = (p) => {
    setEditingId(p._id);
    setNewProject({
      title: p.title,
      description: p.description,
      imageUrl: p.imageUrl || '',
      techStack: p.techStack ? p.techStack.join(', ') : '',
      link: p.link || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startEditProduct = (pr) => {
    setEditingId(pr._id);
    setNewProduct({
      name: pr.name,
      overview: pr.overview,
      features: pr.features ? pr.features.join(', ') : '',
      benefits: pr.benefits ? pr.benefits.join(', ') : '',
      price: pr.price || '',
      demoUrl: pr.demoUrl || '',
      imageUrl: pr.imageUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startEditTeam = (t) => {
    setEditingId(t._id);
    setNewTeam({
      name: t.name,
      role: t.role,
      skills: t.skills ? t.skills.join(', ') : '',
      experience: t.experience || '',
      linkedin: t.socialLinks?.linkedin || '',
      twitter: t.socialLinks?.twitter || '',
      github: t.socialLinks?.github || '',
      imageUrl: t.imageUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startEditBlog = (b) => {
    setEditingId(b._id);
    setNewBlog({
      title: b.title,
      content: b.content,
      category: b.category || 'AI',
      author: b.author,
      imageUrl: b.imageUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startEditTestimonial = (t) => {
    setEditingId(t._id);
    setNewTestimonial({
      clientName: t.clientName,
      company: t.company,
      review: t.review,
      rating: t.rating || 5,
      imageUrl: t.imageUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const [svcs, projs, prods, tm, blgs, tsts, cncts, usrs] = await Promise.all([
          authFetch(`${API_URL}/services?admin=true`).then(r => r.json()).catch(() => []),
          authFetch(`${API_URL}/projects?admin=true`).then(r => r.json()).catch(() => []),
          authFetch(`${API_URL}/products?admin=true`).then(r => r.json()).catch(() => []),
          authFetch(`${API_URL}/team?admin=true`).then(r => r.json()).catch(() => []),
          authFetch(`${API_URL}/blogs?admin=true`).then(r => r.json()).catch(() => []),
          authFetch(`${API_URL}/testimonials?admin=true`).then(r => r.json()).catch(() => []),
          authFetch(`${API_URL}/contacts`).then(r => r.json()).catch(() => []),
          authFetch(`${API_URL}/users`).then(r => r.json()).catch(() => [])
        ]);

        setStats({
          services: svcs.length,
          projects: projs.length,
          products: prods.length,
          team: tm.length,
          blogs: blgs.length,
          testimonials: tsts.length,
          enquiries: cncts.length,
          users: usrs.length
        });
      } else if (activeTab === 'services') {
        const res = await authFetch(`${API_URL}/services?admin=true`);
        setServices(await res.json());
      } else if (activeTab === 'portfolio') {
        const res = await authFetch(`${API_URL}/projects?admin=true`);
        setProjects(await res.json());
      } else if (activeTab === 'products') {
        const res = await authFetch(`${API_URL}/products?admin=true`);
        setProducts(await res.json());
      } else if (activeTab === 'team') {
        const res = await authFetch(`${API_URL}/team?admin=true`);
        setTeam(await res.json());
      } else if (activeTab === 'blogs') {
        const res = await authFetch(`${API_URL}/blogs?admin=true`);
        setBlogs(await res.json());
      } else if (activeTab === 'testimonials') {
        const res = await authFetch(`${API_URL}/testimonials?admin=true`);
        setTestimonials(await res.json());
      } else if (activeTab === 'enquiries') {
        const res = await authFetch(`${API_URL}/contacts`);
        setContacts(await res.json());
      } else if (activeTab === 'settings') {
        const [genRes, statsRes] = await Promise.all([
          authFetch(`${API_URL}/settings/general`).then(r => r.json()).catch(() => ({})),
          authFetch(`${API_URL}/settings/stats`).then(r => r.json()).catch(() => ({}))
        ]);
        setGeneralSettings(genRes.value || {});
        setStatsSettings(statsRes.value || [
          { id: 'projects', iconName: 'Rocket', value: '50+', label: 'Projects Completed' },
          { id: 'clients', iconName: 'Users', value: '20+', label: 'Happy Clients' },
          { id: 'products', iconName: 'Cpu', value: '5+', label: 'AI Products' },
          { id: 'support', iconName: 'Headphones', value: '24/7', label: 'Support Available' }
        ]);
      } else if (activeTab === 'seo') {
        const res = await authFetch(`${API_URL}/settings/seo`);
        const data = await res.json();
        setSeoSettings(data.value || {});
      } else if (activeTab === 'users') {
        const res = await authFetch(`${API_URL}/users`);
        setUsers(await res.json());
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showMessage('Error communicating with database server.', true);
    } finally {
      setLoading(false);
    }
  };

  // --- SUBMIT CONTROLLERS ---

  const handleSaveService = async (e) => {
    e.preventDefault();
    const isEdit = !!editingId;
    try {
      const res = await authFetch(isEdit ? `${API_URL}/services/${editingId}` : `${API_URL}/services`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newService.title,
          description: newService.description,
          features: newService.features.split(',').map(f => f.trim()).filter(Boolean),
          tech: newService.tech.split(',').map(t => t.trim()).filter(Boolean),
          process: newService.process.split(',').map(p => p.trim()).filter(Boolean)
        })
      });
      if (res.ok) {
        showMessage(isEdit ? 'Service updated successfully!' : 'Service saved successfully!');
        cancelEdit();
        fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        showMessage(data.error || data.message || (isEdit ? 'Failed to update service' : 'Failed to save service'), true);
      }
    } catch (err) {
      showMessage(isEdit ? 'Failed to update service' : 'Failed to save service', true);
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    const isEdit = !!editingId;
    try {
      const res = await authFetch(isEdit ? `${API_URL}/projects/${editingId}` : `${API_URL}/projects`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newProject.title,
          description: newProject.description,
          imageUrl: newProject.imageUrl,
          techStack: newProject.techStack.split(',').map(t => t.trim()).filter(Boolean),
          link: newProject.link
        })
      });
      if (res.ok) {
        showMessage(isEdit ? 'Project updated successfully!' : 'Project saved successfully!');
        cancelEdit();
        fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        showMessage(data.error || data.message || (isEdit ? 'Failed to update project' : 'Failed to save project'), true);
      }
    } catch (err) {
      showMessage(isEdit ? 'Failed to update project' : 'Failed to save project', true);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const isEdit = !!editingId;
    try {
      const res = await authFetch(isEdit ? `${API_URL}/products/${editingId}` : `${API_URL}/products`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          overview: newProduct.overview,
          features: newProduct.features.split(',').map(f => f.trim()).filter(Boolean),
          benefits: newProduct.benefits.split(',').map(b => b.trim()).filter(Boolean),
          price: newProduct.price,
          demoUrl: newProduct.demoUrl,
          imageUrl: newProduct.imageUrl
        })
      });
      if (res.ok) {
        showMessage(isEdit ? 'Product updated successfully!' : 'Product saved successfully!');
        cancelEdit();
        fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        showMessage(data.error || data.message || (isEdit ? 'Failed to update product' : 'Failed to save product'), true);
      }
    } catch (err) {
      showMessage(isEdit ? 'Failed to update product' : 'Failed to save product', true);
    }
  };

  const handleSaveTeam = async (e) => {
    e.preventDefault();
    const isEdit = !!editingId;
    try {
      const res = await authFetch(isEdit ? `${API_URL}/team/${editingId}` : `${API_URL}/team`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTeam.name,
          role: newTeam.role,
          skills: newTeam.skills.split(',').map(s => s.trim()).filter(Boolean),
          experience: newTeam.experience,
          socialLinks: {
            linkedin: newTeam.linkedin,
            twitter: newTeam.twitter,
            github: newTeam.github
          },
          imageUrl: newTeam.imageUrl
        })
      });
      if (res.ok) {
        showMessage(isEdit ? 'Team member updated successfully!' : 'Team member saved successfully!');
        cancelEdit();
        fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        showMessage(data.error || data.message || (isEdit ? 'Failed to update team member' : 'Failed to save team member'), true);
      }
    } catch (err) {
      showMessage(isEdit ? 'Failed to update team member' : 'Failed to save team member', true);
    }
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    const isEdit = !!editingId;
    try {
      const res = await authFetch(isEdit ? `${API_URL}/blogs/${editingId}` : `${API_URL}/blogs`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlog)
      });
      if (res.ok) {
        showMessage(isEdit ? 'Blog post updated!' : 'Blog post published!');
        cancelEdit();
        fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        showMessage(data.error || data.message || (isEdit ? 'Failed to update blog post' : 'Failed to save blog post'), true);
      }
    } catch (err) {
      showMessage(isEdit ? 'Failed to update blog post' : 'Failed to save blog post', true);
    }
  };

  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    const isEdit = !!editingId;
    try {
      const res = await authFetch(isEdit ? `${API_URL}/testimonials/${editingId}` : `${API_URL}/testimonials`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTestimonial)
      });
      if (res.ok) {
        showMessage(isEdit ? 'Testimonial updated successfully!' : 'Testimonial saved successfully!');
        cancelEdit();
        fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        showMessage(data.error || data.message || (isEdit ? 'Failed to update testimonial' : 'Failed to save testimonial'), true);
      }
    } catch (err) {
      showMessage(isEdit ? 'Failed to update testimonial' : 'Failed to save testimonial', true);
    }
  };

  const handleSaveSettings = async (key, val) => {
    try {
      const res = await authFetch(`${API_URL}/settings/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: val })
      });
      if (res.ok) {
        showMessage('Settings updated successfully!');
        fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        showMessage(data.error || data.message || 'Failed to update settings', true);
      }
    } catch (err) {
      showMessage('Failed to update settings', true);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        showMessage('Admin user registered successfully!');
        setNewUser({ username: '', password: '' });
        fetchData();
      } else {
        const data = await res.json();
        showMessage(data.message || 'Failed to create user', true);
      }
    } catch (err) {
      showMessage('Network error during registration', true);
    }
  };

  // --- DELETE CONTROLLERS ---

  const handleDeleteItem = async (endpoint, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await authFetch(`${API_URL}/${endpoint}/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showMessage('Item deleted successfully.');
        fetchData();
      } else {
        const data = await res.json();
        showMessage(data.message || 'Delete failed', true);
      }
    } catch (err) {
      showMessage('Failed to delete item', true);
    }
  };

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen premium-site-bg text-white flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto font-sans">
      
      {/* Sidebar */}
      <aside className="w-full lg:w-64 flex-shrink-0 space-y-1">
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-6">
          <h2 className="font-bold text-xl flex items-center gap-2 text-white">
            <Shield className="text-accent" size={22} /> Admin Area
          </h2>
          <p className="text-[10px] text-secondary mt-1">AJNABH INFOTECH CONTROL PANEL</p>
        </div>

        {/* Sidebar Nav Buttons */}
        {[
          { key: 'dashboard', label: 'Dashboard', icon: <Layout size={16} /> },
          { key: 'services', label: 'Services', icon: <Server size={16} /> },
          { key: 'portfolio', label: 'Projects', icon: <Briefcase size={16} /> },
          { key: 'products', label: 'Products', icon: <Layout size={16} /> },
          { key: 'team', label: 'Team Members', icon: <Users size={16} /> },
          { key: 'blogs', label: 'Blog Posts', icon: <BookOpen size={16} /> },
          { key: 'testimonials', label: 'Testimonials', icon: <Star size={16} /> },
          { key: 'enquiries', label: 'Enquiries', icon: <Mail size={16} /> },
          { key: 'settings', label: 'Web Settings', icon: <Settings size={16} /> },
          { key: 'seo', label: 'SEO Config', icon: <Globe size={16} /> },
          { key: 'users', label: 'Admins', icon: <Shield size={16} /> }
        ].map(tab => (
          <button 
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-xs font-semibold cursor-pointer ${activeTab === tab.key ? 'bg-accent text-white' : 'hover:bg-white/5 text-secondary'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}

        {onLogout && (
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors text-xs font-semibold cursor-pointer mt-4 border border-red-500/10"
          >
            <Shield size={16} /> Logout Admin
          </button>
        )}

        {/* Notification overlays */}
        {message && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-xs flex items-center gap-2">
            ✓ {message}
          </div>
        )}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-grow bg-white/5 border border-white/10 rounded-3xl p-8 min-h-[500px]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            
            {/* 1. DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold border-b border-white/10 pb-4">Dashboard Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {Object.entries(stats).map(([k, val]) => {
                    const tabMap = {
                      services: 'services',
                      projects: 'portfolio',
                      products: 'products',
                      team: 'team',
                      blogs: 'blogs',
                      testimonials: 'testimonials',
                      enquiries: 'enquiries',
                      users: 'users'
                    }[k] || 'dashboard';
                    return (
                      <button 
                        key={k}
                        onClick={() => setActiveTab(tabMap)}
                        className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center space-y-1 hover:bg-white/10 transition-colors w-full cursor-pointer group"
                      >
                        <p className="text-[10px] uppercase tracking-wider text-secondary group-hover:text-white transition-colors font-bold">{k}</p>
                        <p className="text-3xl font-extrabold font-mono text-accent">{val}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. SERVICES MODULE */}
            {activeTab === 'services' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold border-b border-white/10 pb-4">Manage Services</h3>
                <form onSubmit={handleSaveService} className="space-y-4 bg-black/40 p-6 border border-white/5 rounded-2xl">
                  <h4 className="font-bold text-sm">{editingId ? 'Edit Service' : 'Add Service'}</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input required placeholder="Service Title" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                    <input required placeholder="Key Features (comma separated)" value={newService.features} onChange={e => setNewService({...newService, features: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input required placeholder="Tech Stack (comma separated)" value={newService.tech} onChange={e => setNewService({...newService, tech: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                    <input required placeholder="Dev Process Steps (comma separated)" value={newService.process} onChange={e => setNewService({...newService, process: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                  </div>
                  <textarea required placeholder="Description" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs h-20 resize-none" />
                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2 bg-white text-black font-semibold rounded-lg text-xs cursor-pointer hover:bg-gray-200">{editingId ? 'Update Service' : 'Save Service'}</button>
                    {editingId && (
                      <button type="button" onClick={cancelEdit} className="px-6 py-2 bg-red-600/80 hover:bg-red-600 text-white font-semibold rounded-lg text-xs cursor-pointer">Cancel</button>
                    )}
                  </div>
                </form>

                <div className="space-y-4">
                  <h4 className="font-bold">Existing Services ({services.length})</h4>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'services', services, setServices)}>
                    <SortableContext items={services.map(s => s._id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-4">
                        {services.map(s => (
                          <SortableCard key={s._id} id={s._id}>
                            <div onClick={() => startEditService(s)} className="flex-grow min-w-0 cursor-pointer group">
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-sm truncate group-hover:text-accent transition-colors">{s.title}</p>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${s.isActive !== false ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                  {s.isActive !== false ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <p className="text-secondary truncate mt-1">{s.description}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button 
                                onClick={() => handleToggleStatus('services', s)} 
                                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${s.isActive !== false ? 'text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300' : 'text-green-400 border-green-500/20 hover:bg-green-500/10 hover:text-green-300'}`}
                              >
                                {s.isActive !== false ? 'Deactivate' : 'Activate'}
                              </button>
                              <button 
                                onClick={() => startEditService(s)} 
                                className="p-2 text-accent border border-accent/20 hover:bg-accent/10 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteItem('services', s._id)} 
                                className="p-2 text-red-500 border border-red-500/20 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </SortableCard>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
            )}

            {/* 3. PORTFOLIO (PROJECTS) MODULE */}
            {activeTab === 'portfolio' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold border-b border-white/10 pb-4">Manage Projects</h3>
                <form onSubmit={handleSaveProject} className="space-y-4 bg-black/40 p-6 border border-white/5 rounded-2xl">
                  <h4 className="font-bold text-sm">{editingId ? 'Edit Project' : 'Add Project'}</h4>
                  <div className="grid md:grid-cols-2 gap-4 items-center">
                    <input required placeholder="Project Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                    <div className="flex items-center gap-3">
                      <div className="flex-grow">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = async () => {
                                const compressed = await compressImage(reader.result);
                                setNewProject({...newProject, imageUrl: compressed});
                              };
                              reader.readAsDataURL(file);
                            }
                          }} 
                          className="w-full text-xs text-secondary file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-white/10 file:text-[10px] file:font-semibold file:bg-white/5 file:text-white file:cursor-pointer hover:file:bg-white/10 file:transition-colors" 
                        />
                      </div>
                      {newProject.imageUrl && (
                        <div className="w-10 h-10 border border-white/10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                          <img src={newProject.imageUrl} alt="Project Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input placeholder="Tech Stack (comma separated)" value={newProject.techStack} onChange={e => setNewProject({...newProject, techStack: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                    <input placeholder="Project link" value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                  </div>
                  <textarea required placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs h-20 resize-none" />
                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2 bg-white text-black font-semibold rounded-lg text-xs cursor-pointer hover:bg-gray-200">{editingId ? 'Update Project' : 'Save Project'}</button>
                    {editingId && (
                      <button type="button" onClick={cancelEdit} className="px-6 py-2 bg-red-600/80 hover:bg-red-600 text-white font-semibold rounded-lg text-xs cursor-pointer">Cancel</button>
                    )}
                  </div>
                </form>

                <div className="space-y-4">
                  <h4 className="font-bold">Project Items ({projects.length})</h4>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'projects', projects, setProjects)}>
                    <SortableContext items={projects.map(p => p._id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-4">
                        {projects.map(p => (
                          <SortableCard key={p._id} id={p._id}>
                            <div onClick={() => startEditProject(p)} className="flex-grow min-w-0 cursor-pointer group">
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-sm truncate group-hover:text-accent transition-colors">{p.title}</p>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${p.isActive !== false ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                  {p.isActive !== false ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <p className="text-secondary truncate mt-1">{p.description}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button 
                                onClick={() => handleToggleStatus('projects', p)} 
                                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${p.isActive !== false ? 'text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300' : 'text-green-400 border-green-500/20 hover:bg-green-500/10 hover:text-green-300'}`}
                              >
                                {p.isActive !== false ? 'Deactivate' : 'Activate'}
                              </button>
                              <button 
                                onClick={() => startEditProject(p)} 
                                className="p-2 text-accent border border-accent/20 hover:bg-accent/10 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteItem('projects', p._id)} 
                                className="p-2 text-red-500 border border-red-500/20 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </SortableCard>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
            )}

            {/* 4. PRODUCTS MODULE */}
            {activeTab === 'products' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold border-b border-white/10 pb-4">Manage Products</h3>
                <form onSubmit={handleSaveProduct} className="space-y-4 bg-black/40 p-6 border border-white/5 rounded-2xl">
                  <h4 className="font-bold text-sm">{editingId ? 'Edit Product' : 'Add Product'}</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <input required placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                    <input placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                    <input placeholder="Demo Link" value={newProduct.demoUrl} onChange={e => setNewProduct({...newProduct, demoUrl: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex-grow">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = async () => {
                                const compressed = await compressImage(reader.result);
                                setNewProduct({ ...newProduct, imageUrl: compressed });
                              };
                              reader.readAsDataURL(file);
                            }
                          }} 
                          className="w-full text-xs text-secondary file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-white/10 file:text-[10px] file:font-semibold file:bg-white/5 file:text-white file:cursor-pointer hover:file:bg-white/10 file:transition-colors"
                        />
                      </div>
                      {newProduct.imageUrl && (
                        <div className="w-10 h-10 border border-white/10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                          <img src={newProduct.imageUrl} alt="Product Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    <input placeholder="Features (comma separated)" value={newProduct.features} onChange={e => setNewProduct({...newProduct, features: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                    <input placeholder="Benefits (comma separated)" value={newProduct.benefits} onChange={e => setNewProduct({...newProduct, benefits: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                  </div>
                  <textarea required placeholder="Overview" value={newProduct.overview} onChange={e => setNewProduct({...newProduct, overview: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs h-16 resize-none" />
                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2 bg-white text-black font-semibold rounded-lg text-xs cursor-pointer hover:bg-gray-200">{editingId ? 'Update Product' : 'Save Product'}</button>
                    {editingId && (
                      <button type="button" onClick={cancelEdit} className="px-6 py-2 bg-red-600/80 hover:bg-red-600 text-white font-semibold rounded-lg text-xs cursor-pointer">Cancel</button>
                    )}
                  </div>
                </form>

                <div className="space-y-4">
                  <h4 className="font-bold">Existing Products ({products.length})</h4>
                  {products.map(pr => (
                    <div key={pr._id} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl text-xs gap-4 font-sans">
                      <div onClick={() => startEditProduct(pr)} className="flex-grow min-w-0 cursor-pointer group">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm truncate group-hover:text-accent transition-colors">{pr.name}</p>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${pr.isActive !== false ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {pr.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-secondary truncate mt-1">{pr.overview}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button 
                          onClick={() => handleToggleStatus('products', pr)} 
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${pr.isActive !== false ? 'text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300' : 'text-green-400 border-green-500/20 hover:bg-green-500/10 hover:text-green-300'}`}
                        >
                          {pr.isActive !== false ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => startEditProduct(pr)} 
                          className="p-2 text-accent border border-accent/20 hover:bg-accent/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem('products', pr._id)} 
                          className="p-2 text-red-500 border border-red-500/20 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. TEAM MODULE */}
            {activeTab === 'team' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold border-b border-white/10 pb-4">Manage Team Members</h3>
                <form onSubmit={handleSaveTeam} className="space-y-4 bg-black/40 p-6 border border-white/5 rounded-2xl">
                  <h4 className="font-bold text-sm">{editingId ? 'Edit Team Member' : 'Add Team Member'}</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <input required placeholder="Name" value={newTeam.name} onChange={e => setNewTeam({...newTeam, name: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                    <input required placeholder="Role (e.g. CEO, Developer)" value={newTeam.role} onChange={e => setNewTeam({...newTeam, role: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                    <input placeholder="Experience" value={newTeam.experience} onChange={e => setNewTeam({...newTeam, experience: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                  </div>
                  <div className="grid md:grid-cols-4 gap-4 items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex-grow">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = async () => {
                                const compressed = await compressImage(reader.result);
                                setNewTeam({ ...newTeam, imageUrl: compressed });
                              };
                              reader.readAsDataURL(file);
                            }
                          }} 
                          className="w-full text-xs text-secondary file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-white/10 file:text-[10px] file:font-semibold file:bg-white/5 file:text-white file:cursor-pointer hover:file:bg-white/10 file:transition-colors"
                        />
                      </div>
                      {newTeam.imageUrl && (
                        <div className="w-10 h-10 border border-white/10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                          <img src={newTeam.imageUrl} alt="Team Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    <input placeholder="LinkedIn" value={newTeam.linkedin} onChange={e => setNewTeam({...newTeam, linkedin: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                    <input placeholder="Twitter" value={newTeam.twitter} onChange={e => setNewTeam({...newTeam, twitter: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                    <input placeholder="GitHub" value={newTeam.github} onChange={e => setNewTeam({...newTeam, github: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                  </div>
                  <input placeholder="Skills (comma separated)" value={newTeam.skills} onChange={e => setNewTeam({...newTeam, skills: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2 bg-white text-black font-semibold rounded-lg text-xs cursor-pointer hover:bg-gray-200">{editingId ? 'Update Team Member' : 'Save Team Member'}</button>
                    {editingId && (
                      <button type="button" onClick={cancelEdit} className="px-6 py-2 bg-red-600/80 hover:bg-red-600 text-white font-semibold rounded-lg text-xs cursor-pointer">Cancel</button>
                    )}
                  </div>
                </form>

                <div className="space-y-4">
                  <h4 className="font-bold">Team Roster ({team.length})</h4>
                  {team.map(t => (
                    <div key={t._id} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl text-xs gap-4 font-sans">
                      <div onClick={() => startEditTeam(t)} className="flex-grow min-w-0 cursor-pointer group">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm truncate group-hover:text-accent transition-colors">{t.name}</p>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${t.isActive !== false ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {t.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-secondary mt-1">{t.role} - {t.experience || 'No experience info'}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button 
                          onClick={() => handleToggleStatus('team', t)} 
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${t.isActive !== false ? 'text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300' : 'text-green-400 border-green-500/20 hover:bg-green-500/10 hover:text-green-300'}`}
                        >
                          {t.isActive !== false ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => startEditTeam(t)} 
                          className="p-2 text-accent border border-accent/20 hover:bg-accent/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem('team', t._id)} 
                          className="p-2 text-red-500 border border-red-500/20 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. BLOG MODULE */}
            {activeTab === 'blogs' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold border-b border-white/10 pb-4">Manage Blogs</h3>
                <form onSubmit={handleSaveBlog} className="space-y-4 bg-black/40 p-6 border border-white/5 rounded-2xl">
                  <h4 className="font-bold text-sm">{editingId ? 'Edit Blog Post' : 'Add Blog Post'}</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <input required placeholder="Blog Title" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                    <input required placeholder="Author" value={newBlog.author} onChange={e => setNewBlog({...newBlog, author: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                    <select value={newBlog.category} onChange={e => setNewBlog({...newBlog, category: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs [&>option]:bg-black">
                      <option>AI</option>
                      <option>Web Development</option>
                      <option>ERP</option>
                      <option>Technology</option>
                      <option>Case Studies</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-grow">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              const compressed = await compressImage(reader.result);
                              setNewBlog({ ...newBlog, imageUrl: compressed });
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                        className="w-full text-xs text-secondary file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-white/10 file:text-[10px] file:font-semibold file:bg-white/5 file:text-white file:cursor-pointer hover:file:bg-white/10 file:transition-colors"
                      />
                    </div>
                    {newBlog.imageUrl && (
                      <div className="w-10 h-10 border border-white/10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                        <img src={newBlog.imageUrl} alt="Blog Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <textarea required placeholder="Content" value={newBlog.content} onChange={e => setNewBlog({...newBlog, content: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs h-28 resize-none" />
                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2 bg-white text-black font-semibold rounded-lg text-xs cursor-pointer hover:bg-gray-200">{editingId ? 'Update Post' : 'Publish Post'}</button>
                    {editingId && (
                      <button type="button" onClick={cancelEdit} className="px-6 py-2 bg-red-600/80 hover:bg-red-600 text-white font-semibold rounded-lg text-xs cursor-pointer">Cancel</button>
                    )}
                  </div>
                </form>

                <div className="space-y-4">
                  <h4 className="font-bold">Published Blogs ({blogs.length})</h4>
                  {blogs.map(b => (
                    <div key={b._id} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl text-xs gap-4 font-sans">
                      <div onClick={() => startEditBlog(b)} className="flex-grow min-w-0 cursor-pointer group">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm truncate group-hover:text-accent transition-colors">{b.title}</p>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${b.isActive !== false ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {b.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-secondary truncate mt-1">By {b.author} in {b.category} - {new Date(b.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button 
                          onClick={() => handleToggleStatus('blogs', b)} 
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${b.isActive !== false ? 'text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300' : 'text-green-400 border-green-500/20 hover:bg-green-500/10 hover:text-green-300'}`}
                        >
                          {b.isActive !== false ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => startEditBlog(b)} 
                          className="p-2 text-accent border border-accent/20 hover:bg-accent/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem('blogs', b._id)} 
                          className="p-2 text-red-500 border border-red-500/20 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. TESTIMONIALS MODULE */}
            {activeTab === 'testimonials' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold border-b border-white/10 pb-4">Manage Testimonials</h3>
                <form onSubmit={handleSaveTestimonial} className="space-y-4 bg-black/40 p-6 border border-white/5 rounded-2xl">
                  <h4 className="font-bold text-sm">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <input required placeholder="Client Name" value={newTestimonial.clientName} onChange={e => setNewTestimonial({...newTestimonial, clientName: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                    <input required placeholder="Company" value={newTestimonial.company} onChange={e => setNewTestimonial({...newTestimonial, company: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                    <select value={newTestimonial.rating} onChange={e => setNewTestimonial({...newTestimonial, rating: Number(e.target.value)})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs [&>option]:bg-black">
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-grow">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              const compressed = await compressImage(reader.result);
                              setNewTestimonial({ ...newTestimonial, imageUrl: compressed });
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                        className="w-full text-xs text-secondary file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-white/10 file:text-[10px] file:font-semibold file:bg-white/5 file:text-white file:cursor-pointer hover:file:bg-white/10 file:transition-colors"
                      />
                    </div>
                    {newTestimonial.imageUrl && (
                      <div className="w-10 h-10 border border-white/10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                        <img src={newTestimonial.imageUrl} alt="Testimonial Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <textarea required placeholder="Review Text" value={newTestimonial.review} onChange={e => setNewTestimonial({...newTestimonial, review: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs h-20 resize-none" />
                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2 bg-white text-black font-semibold rounded-lg text-xs cursor-pointer hover:bg-gray-200">{editingId ? 'Update Testimonial' : 'Save Testimonial'}</button>
                    {editingId && (
                      <button type="button" onClick={cancelEdit} className="px-6 py-2 bg-red-600/80 hover:bg-red-600 text-white font-semibold rounded-lg text-xs cursor-pointer">Cancel</button>
                    )}
                  </div>
                </form>

                <div className="space-y-4">
                  <h4 className="font-bold">Existing Testimonials ({testimonials.length})</h4>
                  {testimonials.map(t => (
                    <div key={t._id} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl text-xs gap-4 font-sans">
                      <div onClick={() => startEditTestimonial(t)} className="flex-grow min-w-0 cursor-pointer group">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm truncate group-hover:text-accent transition-colors">{t.clientName} ({t.company})</p>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${t.isActive !== false ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {t.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-secondary truncate mt-1">"{t.review}" - Rating: {t.rating} ★</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button 
                          onClick={() => handleToggleStatus('testimonials', t)} 
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${t.isActive !== false ? 'text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300' : 'text-green-400 border-green-500/20 hover:bg-green-500/10 hover:text-green-300'}`}
                        >
                          {t.isActive !== false ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => startEditTestimonial(t)} 
                          className="p-2 text-accent border border-accent/20 hover:bg-accent/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem('testimonials', t._id)} 
                          className="p-2 text-red-500 border border-red-500/20 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. CONTACT ENQUIRIES */}
            {activeTab === 'enquiries' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold border-b border-white/10 pb-4">Contact Enquiries ({contacts.length})</h3>
                {contacts.length === 0 ? <p className="text-secondary text-xs">No enquiries received yet.</p> : null}
                {contacts.map(c => (
                  <div key={c._id} className="p-6 bg-white/5 border border-white/5 rounded-2xl text-xs space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-sm text-white">{c.name}</h4>
                        <p className="text-accent">{c.email}</p>
                        {c.company && <p className="text-secondary mt-1">Company: {c.company}</p>}
                      </div>
                      <div className="text-left sm:text-right space-y-2 self-stretch sm:self-auto flex sm:flex-col justify-between sm:justify-start items-center sm:items-end">
                        <span className="text-secondary font-mono block">{new Date(c.createdAt).toLocaleDateString()}</span>
                        <button onClick={() => handleDeleteItem('contacts', c._id)} className="text-red-500 hover:text-red-400 p-1"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <p className="bg-black/40 p-4 border border-white/5 rounded-xl leading-relaxed text-secondary">{c.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 10. WEBSITE SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold border-b border-white/10 pb-4">Website Settings</h3>
                <div className="space-y-4 bg-black/40 p-6 border border-white/5 rounded-2xl text-xs">
                  <div>
                    <label className="mb-1 block text-secondary font-bold">Site/Company Name</label>
                    <input type="text" value={generalSettings.siteName || ''} onChange={e => setGeneralSettings({...generalSettings, siteName: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                  </div>
                  <div>
                    <label className="mb-1 block text-secondary font-bold">Contact Email</label>
                    <input type="email" value={generalSettings.contactEmail || ''} onChange={e => setGeneralSettings({...generalSettings, contactEmail: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                  </div>
                  <div>
                    <label className="mb-1 block text-secondary font-bold">Contact Phone Number</label>
                    <input type="text" value={generalSettings.contactPhone || ''} onChange={e => setGeneralSettings({...generalSettings, contactPhone: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                  </div>
                  <div>
                    <label className="mb-1 block text-secondary font-bold">Office Address</label>
                    <textarea value={generalSettings.address || ''} onChange={e => setGeneralSettings({...generalSettings, address: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs h-16 resize-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-secondary font-bold">Footer Brand Description</label>
                    <textarea value={generalSettings.footerDescription || ''} onChange={e => setGeneralSettings({...generalSettings, footerDescription: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs h-20 resize-none" placeholder="Transforming ideas into intelligent digital solutions..." />
                  </div>
                  <div>
                    <label className="mb-1 block text-secondary font-bold">Footer Bottom Tagline</label>
                    <input type="text" value={generalSettings.footerTagline || ''} onChange={e => setGeneralSettings({...generalSettings, footerTagline: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" placeholder="Innovation • Technology • Growth" />
                  </div>
                  <button onClick={() => handleSaveSettings('general', generalSettings)} className="px-6 py-2 bg-white text-black font-semibold rounded-lg text-xs cursor-pointer hover:bg-gray-200 mt-2">Save General Settings</button>
                </div>

                {/* Hero Statistics settings */}
                <div className="space-y-4 bg-black/40 p-6 border border-white/5 rounded-2xl text-xs mt-6">
                  <h4 className="font-bold text-sm border-b border-white/10 pb-2 mb-4">Hero Statistics Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {statsSettings.map((stat, idx) => (
                      <div key={stat.id || idx} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-3 font-sans">
                        <p className="font-bold text-accent capitalize">{stat.label || stat.id} Stat Card</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="mb-1 block text-secondary">Metric Value (e.g. 50+)</label>
                            <input 
                              type="text" 
                              value={stat.value || ''} 
                              onChange={e => {
                                const newStats = [...statsSettings];
                                newStats[idx].value = e.target.value;
                                setStatsSettings(newStats);
                              }} 
                              className="w-full px-3 py-1.5 bg-black border border-white/10 rounded-lg text-xs" 
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-secondary">Label (e.g. Happy Clients)</label>
                            <input 
                              type="text" 
                              value={stat.label || ''} 
                              onChange={e => {
                                const newStats = [...statsSettings];
                                newStats[idx].label = e.target.value;
                                setStatsSettings(newStats);
                              }} 
                              className="w-full px-3 py-1.5 bg-black border border-white/10 rounded-lg text-xs" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-1 block text-secondary font-bold">Icon Symbol</label>
                          <select
                            value={stat.iconName || 'Rocket'}
                            onChange={e => {
                              const newStats = [...statsSettings];
                              newStats[idx].iconName = e.target.value;
                              setStatsSettings(newStats);
                            }}
                            className="w-full px-3 py-1.5 bg-black border border-white/10 rounded-lg text-xs [&>option]:bg-black text-white"
                          >
                            <option value="Rocket">Rocket</option>
                            <option value="Users">Users</option>
                            <option value="Cpu">Cpu</option>
                            <option value="Headphones">Headphones</option>
                            <option value="Award">Award</option>
                            <option value="Activity">Activity</option>
                            <option value="Clock">Clock</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => handleSaveSettings('stats', statsSettings)} className="px-6 py-2 bg-white text-black font-semibold rounded-lg text-xs cursor-pointer hover:bg-gray-200 mt-2">Save Statistics Settings</button>
                </div>
              </div>
            )}

            {/* 11. SEO SETTINGS */}
            {activeTab === 'seo' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold border-b border-white/10 pb-4">SEO Configuration</h3>
                <div className="space-y-4 bg-black/40 p-6 border border-white/5 rounded-2xl text-xs">
                  <div>
                    <label className="mb-1 block text-secondary font-bold">Meta Title</label>
                    <input type="text" value={seoSettings.title || ''} onChange={e => setSeoSettings({...seoSettings, title: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                  </div>
                  <div>
                    <label className="mb-1 block text-secondary font-bold">Meta Description</label>
                    <textarea value={seoSettings.description || ''} onChange={e => setSeoSettings({...seoSettings, description: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs h-20 resize-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-secondary font-bold">Meta Keywords</label>
                    <input type="text" value={seoSettings.keywords || ''} onChange={e => setSeoSettings({...seoSettings, keywords: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                  </div>
                  <button onClick={() => handleSaveSettings('seo', seoSettings)} className="px-6 py-2 bg-white text-black font-semibold rounded-lg text-xs cursor-pointer hover:bg-gray-200 mt-2">Save SEO Config</button>
                </div>
              </div>
            )}

            {/* 12. USER MANAGEMENT */}
            {activeTab === 'users' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold border-b border-white/10 pb-4">User Management</h3>
                <form onSubmit={handleCreateUser} className="space-y-4 bg-black/40 p-6 border border-white/5 rounded-2xl">
                  <h4 className="font-bold text-sm">Register New Admin Account</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input required placeholder="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                    <input required type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                  </div>
                  <button type="submit" className="px-6 py-2 bg-white text-black font-semibold rounded-lg text-xs cursor-pointer hover:bg-gray-200">Register Admin</button>
                </form>

                <div className="space-y-4">
                  <h4 className="font-bold">Active Administrators ({users.length})</h4>
                  {users.map(u => (
                    <div key={u._id} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl text-xs">
                      <div>
                        <p className="font-bold text-sm text-white">{u.username}</p>
                        <p className="text-secondary mt-0.5">Created: {new Date(u.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => handleDeleteItem('users', u._id)} className="text-red-500 hover:text-red-400 p-2"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
