import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Trash2, Mail, Briefcase, Settings, Globe, Users, 
  BookOpen, Star, Shield, Layout, Server, AlertCircle, Edit, Eye, EyeOff, Cpu, GripVertical 
} from 'lucide-react';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    services: 0,
    projects: 0,
    products: 0,
    team: 0,
    careers: 0,
    applications: 0,
    blogs: 0,
    testimonials: 0,
    enquiries: 0,
    users: 0,
    technologies: 0
  });

  // State arrays for CRUD lists
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [team, setTeam] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [techGroups, setTechGroups] = useState([]);

  // Form states
  const [newService, setNewService] = useState({ title: '', description: '', features: '', tech: '', process: '' });
  const [newProject, setNewProject] = useState({ title: '', description: '', imageUrl: '', techStack: '', link: '' });
  const [newProduct, setNewProduct] = useState({ name: '', overview: '', features: '', benefits: '', price: '', demoUrl: '', imageUrl: '' });
  const [newTeam, setNewTeam] = useState({ name: '', role: '', skills: '', experience: '', linkedin: '', twitter: '', github: '', imageUrl: '' });
  const [newJob, setNewJob] = useState({ title: '', type: 'Full-time', description: '', requirements: '', benefits: '' });
  const [newBlog, setNewBlog] = useState({ title: '', content: '', category: 'AI', author: '', imageUrl: '' });
  const [newTestimonial, setNewTestimonial] = useState({ clientName: '', company: '', review: '', rating: 5, imageUrl: '' });
  const [newTechGroup, setNewTechGroup] = useState({ title: '', description: '', technologies: [] });
  const [generalSettings, setGeneralSettings] = useState({ siteName: '', contactEmail: '', contactPhone: '', address: '' });
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
    setNewJob({ title: '', type: 'Full-time', description: '', requirements: '', benefits: '' });
    setNewBlog({ title: '', content: '', category: 'AI', author: '', imageUrl: '' });
    setNewTestimonial({ clientName: '', company: '', review: '', rating: 5, imageUrl: '' });
    setNewTechGroup({ title: '', description: '', technologies: [] });
  };

  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index, type) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    let items;
    let setItems;

    if (type === 'services') {
      items = services;
      setItems = setServices;
    } else if (type === 'projects') {
      items = projects;
      setItems = setProjects;
    } else if (type === 'products') {
      items = products;
      setItems = setProducts;
    } else if (type === 'team') {
      items = team;
      setItems = setTeam;
    } else if (type === 'jobs') {
      items = jobs;
      setItems = setJobs;
    } else if (type === 'blogs') {
      items = blogs;
      setItems = setBlogs;
    } else if (type === 'testimonials') {
      items = testimonials;
      setItems = setTestimonials;
    } else if (type === 'technologies') {
      items = techGroups;
      setItems = setTechGroups;
    }

    if (!items || !setItems) return;

    const listCopy = [...items];
    const draggedItem = listCopy[draggedIndex];
    listCopy.splice(draggedIndex, 1);
    listCopy.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setItems(listCopy);
  };

  const handleDragEnd = async (type) => {
    setDraggedIndex(null);

    let items;
    let endpoint;

    if (type === 'services') {
      items = services;
      endpoint = 'services/reorder';
    } else if (type === 'projects') {
      items = projects;
      endpoint = 'projects/reorder';
    } else if (type === 'products') {
      items = products;
      endpoint = 'products/reorder';
    } else if (type === 'team') {
      items = team;
      endpoint = 'team/reorder';
    } else if (type === 'jobs') {
      items = jobs;
      endpoint = 'careers/jobs/reorder';
    } else if (type === 'blogs') {
      items = blogs;
      endpoint = 'blogs/reorder';
    } else if (type === 'testimonials') {
      items = testimonials;
      endpoint = 'testimonials/reorder';
    } else if (type === 'technologies') {
      items = techGroups;
      endpoint = 'technologies/reorder';
    }

    if (!items || !endpoint) return;

    try {
      const res = await fetch(`${API_URL}/${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: items.map(item => item._id) })
      });
      if (res.ok) {
        showMessage('Order updated successfully.');
      } else {
        const data = await res.json().catch(() => ({}));
        showMessage(data.message || 'Failed to update order', true);
      }
    } catch (err) {
      showMessage('Error saving new order', true);
    }
  };

  const handleToggleStatus = async (endpoint, item) => {
    try {
      const res = await fetch(`${API_URL}/${endpoint}/${item._id}`, {
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

  const startEditJob = (j) => {
    setEditingId(j._id);
    setNewJob({
      title: j.title,
      type: j.type || 'Full-time',
      description: j.description,
      requirements: j.requirements ? j.requirements.join(', ') : '',
      benefits: j.benefits ? j.benefits.join(', ') : ''
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

  const startEditTechGroup = (tg) => {
    setEditingId(tg._id);
    setNewTechGroup({
      title: tg.title,
      description: tg.description,
      technologies: tg.technologies ? tg.technologies.map(t => ({ name: t.name, description: t.description })) : []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const [svcs, projs, prods, tm, jbs, apps, blgs, tsts, cncts, usrs, techs] = await Promise.all([
          fetch(`${API_URL}/services?admin=true`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/projects?admin=true`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/products?admin=true`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/team?admin=true`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/careers/jobs?admin=true`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/careers/applications`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/blogs?admin=true`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/testimonials?admin=true`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/contacts`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/users`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/technologies?admin=true`).then(r => r.json()).catch(() => [])
        ]);

        setStats({
          services: svcs.length,
          projects: projs.length,
          products: prods.length,
          team: tm.length,
          careers: jbs.length,
          applications: apps.length,
          blogs: blgs.length,
          testimonials: tsts.length,
          enquiries: cncts.length,
          users: usrs.length,
          technologies: techs.length
        });
      } else if (activeTab === 'services') {
        const res = await fetch(`${API_URL}/services?admin=true`);
        setServices(await res.json());
      } else if (activeTab === 'portfolio') {
        const res = await fetch(`${API_URL}/projects?admin=true`);
        setProjects(await res.json());
      } else if (activeTab === 'products') {
        const res = await fetch(`${API_URL}/products?admin=true`);
        setProducts(await res.json());
      } else if (activeTab === 'team') {
        const res = await fetch(`${API_URL}/team?admin=true`);
        setTeam(await res.json());
      } else if (activeTab === 'careers') {
        const jobsRes = await fetch(`${API_URL}/careers/jobs?admin=true`);
        setJobs(await jobsRes.json());
        const appsRes = await fetch(`${API_URL}/careers/applications`);
        setApplications(await appsRes.json());
      } else if (activeTab === 'blogs') {
        const res = await fetch(`${API_URL}/blogs?admin=true`);
        setBlogs(await res.json());
      } else if (activeTab === 'testimonials') {
        const res = await fetch(`${API_URL}/testimonials?admin=true`);
        setTestimonials(await res.json());
      } else if (activeTab === 'enquiries') {
        const res = await fetch(`${API_URL}/contacts`);
        setContacts(await res.json());
      } else if (activeTab === 'settings') {
        const [genRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/settings/general`).then(r => r.json()).catch(() => ({})),
          fetch(`${API_URL}/settings/stats`).then(r => r.json()).catch(() => ({}))
        ]);
        setGeneralSettings(genRes.value || {});
        setStatsSettings(statsRes.value || [
          { id: 'projects', iconName: 'Rocket', value: '50+', label: 'Projects Completed' },
          { id: 'clients', iconName: 'Users', value: '20+', label: 'Happy Clients' },
          { id: 'products', iconName: 'Cpu', value: '5+', label: 'AI Products' },
          { id: 'support', iconName: 'Headphones', value: '24/7', label: 'Support Available' }
        ]);
      } else if (activeTab === 'seo') {
        const res = await fetch(`${API_URL}/settings/seo`);
        const data = await res.json();
        setSeoSettings(data.value || {});
      } else if (activeTab === 'users') {
        const res = await fetch(`${API_URL}/users`);
        setUsers(await res.json());
      } else if (activeTab === 'technologies') {
        const res = await fetch(`${API_URL}/technologies?admin=true`);
        setTechGroups(await res.json());
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
      const res = await fetch(isEdit ? `${API_URL}/services/${editingId}` : `${API_URL}/services`, {
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
      const res = await fetch(isEdit ? `${API_URL}/projects/${editingId}` : `${API_URL}/projects`, {
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
      const res = await fetch(isEdit ? `${API_URL}/products/${editingId}` : `${API_URL}/products`, {
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
      const res = await fetch(isEdit ? `${API_URL}/team/${editingId}` : `${API_URL}/team`, {
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

  const handleSaveJob = async (e) => {
    e.preventDefault();
    const isEdit = !!editingId;
    try {
      const res = await fetch(isEdit ? `${API_URL}/careers/jobs/${editingId}` : `${API_URL}/careers/jobs`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newJob.title,
          type: newJob.type,
          description: newJob.description,
          requirements: newJob.requirements.split(',').map(r => r.trim()).filter(Boolean),
          benefits: newJob.benefits.split(',').map(b => b.trim()).filter(Boolean)
        })
      });
      if (res.ok) {
        showMessage(isEdit ? 'Job opening updated!' : 'Job opening posted!');
        cancelEdit();
        fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        showMessage(data.error || data.message || (isEdit ? 'Failed to update job opening' : 'Failed to save job opening'), true);
      }
    } catch (err) {
      showMessage(isEdit ? 'Failed to update job opening' : 'Failed to save job opening', true);
    }
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    const isEdit = !!editingId;
    try {
      const res = await fetch(isEdit ? `${API_URL}/blogs/${editingId}` : `${API_URL}/blogs`, {
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
      const res = await fetch(isEdit ? `${API_URL}/testimonials/${editingId}` : `${API_URL}/testimonials`, {
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

  const handleSaveTechGroup = async (e) => {
    e.preventDefault();
    const isEdit = !!editingId;
    try {
      const res = await fetch(isEdit ? `${API_URL}/technologies/${editingId}` : `${API_URL}/technologies`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTechGroup.title,
          description: newTechGroup.description,
          technologies: newTechGroup.technologies.filter(t => t.name.trim() !== '')
        })
      });
      if (res.ok) {
        showMessage(isEdit ? 'Technology group updated successfully!' : 'Technology group saved successfully!');
        cancelEdit();
        fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        showMessage(data.error || data.message || (isEdit ? 'Failed to update technology group' : 'Failed to save technology group'), true);
      }
    } catch (err) {
      showMessage(isEdit ? 'Failed to update technology group' : 'Failed to save technology group', true);
    }
  };

  const handleSaveSettings = async (key, val) => {
    try {
      const res = await fetch(`${API_URL}/settings/${key}`, {
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
      const res = await fetch(`${API_URL}/users/register`, {
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
      const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
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
          { key: 'careers', label: 'Careers', icon: <Briefcase size={16} /> },
          { key: 'blogs', label: 'Blog Posts', icon: <BookOpen size={16} /> },
          { key: 'testimonials', label: 'Testimonials', icon: <Star size={16} /> },
          { key: 'technologies', label: 'Technologies', icon: <Cpu size={16} /> },
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
                  {projects.map(p => (
                    <div key={p._id} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl text-xs gap-4 font-sans">
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
                    </div>
                  ))}
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
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setNewProduct({ ...newProduct, imageUrl: reader.result });
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
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setNewTeam({ ...newTeam, imageUrl: reader.result });
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

            {/* 6. CAREERS MODULE */}
            {activeTab === 'careers' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold border-b border-white/10 pb-4">Manage Careers</h3>
                
                {/* Save Job Form */}
                <form onSubmit={handleSaveJob} className="space-y-4 bg-black/40 p-6 border border-white/5 rounded-2xl">
                  <h4 className="font-bold text-sm">{editingId ? 'Edit Job Opening' : 'Add Job Opening'}</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input required placeholder="Job Title" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                    <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs [&>option]:bg-black">
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Internship</option>
                    </select>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input placeholder="Requirements (comma separated)" value={newJob.requirements} onChange={e => setNewJob({...newJob, requirements: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                    <input placeholder="Benefits (comma separated)" value={newJob.benefits} onChange={e => setNewJob({...newJob, benefits: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" />
                  </div>
                  <textarea required placeholder="Job Description" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs h-16 resize-none" />
                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2 bg-white text-black font-semibold rounded-lg text-xs cursor-pointer hover:bg-gray-200">{editingId ? 'Update Position' : 'Post Position'}</button>
                    {editingId && (
                      <button type="button" onClick={cancelEdit} className="px-6 py-2 bg-red-600/80 hover:bg-red-600 text-white font-semibold rounded-lg text-xs cursor-pointer">Cancel</button>
                    )}
                  </div>
                </form>

                {/* Job Openings List */}
                <div className="space-y-4">
                  <h4 className="font-bold">Active Openings ({jobs.length})</h4>
                  {jobs.map(j => (
                    <div key={j._id} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl text-xs gap-4 font-sans">
                      <div onClick={() => startEditJob(j)} className="flex-grow min-w-0 cursor-pointer group">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm truncate group-hover:text-accent transition-colors">{j.title} ({j.type})</p>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${j.isActive !== false ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {j.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-secondary truncate mt-1">{j.description}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button 
                          onClick={() => handleToggleStatus('careers/jobs', j)} 
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${j.isActive !== false ? 'text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300' : 'text-green-400 border-green-500/20 hover:bg-green-500/10 hover:text-green-300'}`}
                        >
                          {j.isActive !== false ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => startEditJob(j)} 
                          className="p-2 text-accent border border-accent/20 hover:bg-accent/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem('careers/jobs', j._id)} 
                          className="p-2 text-red-500 border border-red-500/20 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Job Applications List */}
                <div className="space-y-4 border-t border-white/10 pt-6">
                  <h4 className="font-bold">Submitted Applications ({applications.length})</h4>
                  {applications.length === 0 ? <p className="text-secondary text-xs">No applications submitted yet.</p> : null}
                  {applications.map(app => (
                    <div key={app._id} className="p-4 bg-white/5 border border-white/5 rounded-xl text-xs space-y-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div>
                          <p className="font-bold text-sm">{app.name}</p>
                          <p className="text-accent">{app.email} | {app.phone}</p>
                          <p className="text-secondary mt-1">Applying for: <strong className="text-white">{app.position}</strong></p>
                        </div>
                        <button onClick={() => handleDeleteItem('careers/applications', app._id)} className="text-red-500 hover:text-red-400 p-2 h-fit self-end sm:self-auto"><Trash2 size={16} /></button>
                      </div>
                      {app.resumeUrl && <p className="text-secondary font-mono text-[10px]">Resume Link: <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{app.resumeUrl}</a></p>}
                      {app.message && <p className="bg-black/30 p-2 rounded text-secondary border border-white/5 mt-1">{app.message}</p>}
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
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewBlog({ ...newBlog, imageUrl: reader.result });
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
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewTestimonial({ ...newTestimonial, imageUrl: reader.result });
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

            {/* 13. TECHNOLOGIES MODULE */}
            {activeTab === 'technologies' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold border-b border-white/10 pb-4">Manage Technologies</h3>
                <form onSubmit={handleSaveTechGroup} className="space-y-4 bg-black/40 p-6 border border-white/5 rounded-2xl">
                  <h4 className="font-bold text-sm">{editingId ? 'Edit Technology Group' : 'Add Technology Group'}</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input 
                      required 
                      placeholder="Group Title (e.g. Frontend Engineering)" 
                      value={newTechGroup.title} 
                      onChange={e => setNewTechGroup({...newTechGroup, title: e.target.value})} 
                      className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" 
                    />
                    <input 
                      required 
                      placeholder="Short Description" 
                      value={newTechGroup.description} 
                      onChange={e => setNewTechGroup({...newTechGroup, description: e.target.value})} 
                      className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-xs" 
                    />
                  </div>
                  
                  {/* Technologies Sub-List */}
                  <div className="space-y-3 border-t border-white/10 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <h5 className="font-bold text-xs uppercase tracking-wider text-accent">Technologies</h5>
                      <button
                        type="button"
                        onClick={() => setNewTechGroup({
                          ...newTechGroup,
                          technologies: [...newTechGroup.technologies, { name: '', description: '' }]
                        })}
                        className="px-3 py-1 bg-accent/20 hover:bg-accent/30 text-accent font-semibold rounded-lg text-[10px] cursor-pointer flex items-center gap-1"
                      >
                        <Plus size={12} /> Add Tech Item
                      </button>
                    </div>
                    {newTechGroup.technologies.length === 0 ? (
                      <p className="text-[11px] text-secondary">No technologies added yet. Click "Add Tech Item" above.</p>
                    ) : (
                      <div className="space-y-2">
                        {newTechGroup.technologies.map((tech, index) => (
                          <div key={index} className="flex gap-3 items-center bg-black/20 p-3 rounded-xl border border-white/5">
                            <input
                              required
                              placeholder="Tech Name (e.g. React)"
                              value={tech.name}
                              onChange={e => {
                                const updated = [...newTechGroup.technologies];
                                updated[index].name = e.target.value;
                                setNewTechGroup({ ...newTechGroup, technologies: updated });
                              }}
                              className="flex-grow px-3 py-1.5 bg-black border border-white/10 rounded-lg text-xs"
                            />
                            <input
                              required
                              placeholder="Description (e.g. For dynamic web architectures)"
                              value={tech.description}
                              onChange={e => {
                                const updated = [...newTechGroup.technologies];
                                updated[index].description = e.target.value;
                                setNewTechGroup({ ...newTechGroup, technologies: updated });
                              }}
                              className="flex-grow px-3 py-1.5 bg-black border border-white/10 rounded-lg text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = newTechGroup.technologies.filter((_, idx) => idx !== index);
                                setNewTechGroup({ ...newTechGroup, technologies: updated });
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/10"
                              title="Remove Item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2 bg-white text-black font-semibold rounded-lg text-xs cursor-pointer hover:bg-gray-200">
                      {editingId ? 'Update Tech Group' : 'Save Tech Group'}
                    </button>
                    {editingId && (
                      <button type="button" onClick={cancelEdit} className="px-6 py-2 bg-red-600/80 hover:bg-red-600 text-white font-semibold rounded-lg text-xs cursor-pointer">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <div className="space-y-4">
                  <h4 className="font-bold">Existing Technology Groups ({techGroups.length})</h4>
                  {techGroups.map(tg => (
                    <div key={tg._id} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl text-xs gap-4 font-sans">
                      <div onClick={() => startEditTechGroup(tg)} className="flex-grow min-w-0 cursor-pointer group">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm truncate group-hover:text-accent transition-colors">{tg.title}</p>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${tg.isActive !== false ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {tg.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-secondary truncate mt-1">{tg.description}</p>
                        {tg.technologies && tg.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {tg.technologies.map((t, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-zinc-400 border border-white/5">
                                {t.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button 
                          onClick={() => handleToggleStatus('technologies', tg)} 
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${tg.isActive !== false ? 'text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300' : 'text-green-400 border-green-500/20 hover:bg-green-500/10 hover:text-green-300'}`}
                        >
                          {tg.isActive !== false ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => startEditTechGroup(tg)} 
                          className="p-2 text-accent border border-accent/20 hover:bg-accent/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem('technologies', tg._id)} 
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

          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
