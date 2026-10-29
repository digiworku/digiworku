import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  Search,
  Plus,
  Play,
  ArrowUpRight,
  Edit3,
  Trash2,
  FolderGit2,
  TrendingUp,
  X,
  ExternalLink,
  Upload,
  Loader2,
} from 'lucide-react';
import type { ProjectItem } from '../types/crm';
import { uploadMediaToStorage } from '../supabase';

interface PortfolioPageProps {
  projects: ProjectItem[];
  isAdmin: boolean;
  darkMode: boolean;
  onAddProject?: (project: Omit<ProjectItem, 'id'>) => Promise<void>;
  onEditProject?: (project: ProjectItem) => Promise<void>;
  onDeleteProject?: (id: string, title: string) => Promise<void>;
  onRequestService?: (serviceName: string) => void;
}

export function PortfolioPage({
  projects,
  isAdmin,
  darkMode,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onRequestService,
}: PortfolioPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDetail, setSelectedDetail] = useState<ProjectItem | null>(null);

  // Upload modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [clientName, setClientName] = useState('');
  const [impactResult, setImpactResult] = useState('');
  const [tagsInput, setTagsInput] = useState('React, Next.js, Cloud');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [projects, selectedCategory, searchQuery]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const { url, error } = await uploadMediaToStorage(file, 'projects-media');
    setIsUploading(false);

    if (error) {
      alert(`Storage upload error: ${error}`);
      return;
    }

    if (url) {
      setMediaUrl(url);
      if (file.type.startsWith('video/')) {
        setMediaType('video');
      }
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setCategory('Web Development');
    setClientName('');
    setImpactResult('');
    setTagsInput('React, Cloud, Performance');
    setMediaUrl('');
    setMediaType('image');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: ProjectItem) => {
    setEditingId(proj.id);
    setTitle(proj.title);
    setDescription(proj.description);
    setCategory(proj.category);
    setClientName(proj.clientName);
    setImpactResult(proj.impactResult || '');
    setTagsInput((proj.tags || []).join(', '));
    setMediaUrl(proj.imageUrl || proj.videoUrl || '');
    setMediaType(proj.mediaType || 'image');
    setIsModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !mediaUrl.trim()) {
      alert('Please provide a title and media file/URL.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingId && onEditProject) {
      await onEditProject({
        id: editingId,
        title: title.trim(),
        description: description.trim(),
        category,
        clientName: clientName.trim() || 'DigiWorku Client',
        impactResult: impactResult.trim() || undefined,
        tags,
        imageUrl: mediaType === 'image' ? mediaUrl : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
        videoUrl: mediaType === 'video' ? mediaUrl : undefined,
        mediaType,
      });
    } else if (onAddProject) {
      await onAddProject({
        title: title.trim(),
        description: description.trim(),
        category,
        clientName: clientName.trim() || 'DigiWorku Client',
        impactResult: impactResult.trim() || undefined,
        tags,
        imageUrl: mediaType === 'image' ? mediaUrl : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
        videoUrl: mediaType === 'video' ? mediaUrl : undefined,
        mediaType,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <motion.div
      key="tab-portfolio"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="flex-1 p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full"
    >
      {/* Admin Portfolio Management Banner */}
      {isAdmin && (
        <div
          className={`rounded-2xl border p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            darkMode ? 'bg-emerald-950/30 border-emerald-800/40' : 'bg-emerald-50 border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00c853] flex items-center justify-center shadow-md shrink-0">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase tracking-widest text-[#00c853]">Admin Mode</span>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Portfolio Manager</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {projects.length} projects in database · Powered by Supabase Storage
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00c853] hover:bg-[#00b04a] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Project</span>
          </button>
        </div>
      )}

      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="block text-[11px] font-black uppercase text-[#00c853] tracking-wider">WORK PORTFOLIO</span>
          <h2 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-white mt-1 leading-none font-display">
            Engineering, Design & Video <span className="text-[#00c853]">Showcase</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xl leading-relaxed">
            Explore our wide range of delivered client solutions across Web Apps, UI/UX Design, Corporate Branding, and Commercial Video Production.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-[#00c853] w-56 bg-slate-100/30 dark:bg-slate-900/30"
            />
          </div>
          {isAdmin && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00c853] hover:bg-[#00b04a] text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap pb-1 border-b border-slate-200 dark:border-slate-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-tight transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#00c853] text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-[#fafafa]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 pt-2">
        {filteredProjects.map((proj, idx) => {
          const isLargeCard = idx === 0;
          const isVideo = proj.mediaType === 'video' || Boolean(proj.videoUrl);

          return (
            <div
              key={proj.id}
              className={`group border rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl relative ${
                isLargeCard ? 'lg:col-span-8' : 'lg:col-span-4'
              } ${darkMode ? 'bg-[#202020]/50 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}
            >
              {/* Media preview */}
              <div
                onClick={() => setSelectedDetail(proj)}
                className="aspect-video relative overflow-hidden bg-slate-900 cursor-pointer group/media"
              >
                {isVideo && proj.videoUrl ? (
                  <div className="relative w-full h-full">
                    <video
                      src={proj.videoUrl}
                      poster={proj.imageUrl}
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                      onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()}
                      className="w-full h-full object-cover group-hover:scale-103 duration-500 filter brightness-95"
                    />
                    <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center group-hover/media:bg-slate-950/10 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-[#00c853] text-white flex items-center justify-center shadow-xl group-hover/media:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-103 duration-500 filter brightness-95"
                    loading="lazy"
                  />
                )}

                {/* Badge tags */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10 pointer-events-none">
                  <span className="bg-[#00c853] text-white text-[9px] font-black px-2.5 py-1 rounded-sm tracking-widest uppercase shadow-xs">
                    {proj.category}
                  </span>
                  {(proj.tags || []).slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="bg-slate-950/70 text-white text-[9px] font-bold px-2 py-1 rounded-sm tracking-wider uppercase backdrop-blur-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="absolute bottom-4 right-4 w-9 h-9 bg-[#00c853]/90 text-white rounded-full flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Info details */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#00c853] truncate">
                    {proj.clientName}
                  </span>

                  {isAdmin && (
                    <div className="flex items-center gap-1.5 shrink-0 z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(proj);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-[#00c853] transition-colors cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onDeleteProject) onDeleteProject(proj.id, proj.title);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <h3
                  onClick={() => setSelectedDetail(proj)}
                  className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-normal cursor-pointer hover:text-[#00c853] transition-colors"
                >
                  {proj.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {proj.description}
                </p>

                {proj.impactResult && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-[#00c853] font-bold">
                    <TrendingUp className="w-4 h-4 shrink-0" />
                    <span className="truncate">Outcome: {proj.impactResult}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-12 py-16 text-center max-w-sm mx-auto space-y-4">
            <FolderGit2 className="w-12 h-12 text-slate-300 mx-auto stroke-1" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">No Projects Found</h4>
            <p className="text-xs text-slate-400">
              No portfolio projects found under category "{selectedCategory}".
            </p>
          </div>
        )}
      </div>

      {/* Bottom CTA block */}
      <div className="text-center py-6 mt-4 border-t border-slate-200/50 dark:border-slate-800 space-y-3">
        <h4 className="text-base font-black text-slate-900 dark:text-white">
          Your project could be our next showcase success story.
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ready to scale your business with enterprise-grade digital development?
        </p>
        <button
          onClick={() => onRequestService && onRequestService('Custom Development')}
          className="bg-[#00c853] text-white hover:bg-[#00b047] px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          Start a Conversation
        </button>
      </div>

      {/* Project Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setSelectedDetail(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              {selectedDetail.videoUrl ? (
                <video src={selectedDetail.videoUrl} controls autoPlay className="w-full h-full object-contain" />
              ) : (
                <img src={selectedDetail.imageUrl} alt={selectedDetail.title} className="w-full h-full object-cover" />
              )}
            </div>

            <div>
              <span className="text-[10px] font-black text-[#00c853] uppercase tracking-wider block">
                {selectedDetail.category} • {selectedDetail.clientName}
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">{selectedDetail.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {selectedDetail.description}
              </p>
            </div>

            {selectedDetail.impactResult && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-[#00c853] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span>Impact: {selectedDetail.impactResult}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload/Edit Modal (Uses Supabase Storage, eliminating Base64 database bloat) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl p-6 relative space-y-4 my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {editingId ? 'Edit Project' : 'Upload Project (Supabase Storage)'}
            </h3>

            <form onSubmit={handleSaveProject} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. D2C E-Commerce App"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-semibold"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Video Production">Video Production</option>
                    <option value="Branding">Branding</option>
                    <option value="AI Solutions">AI Solutions</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Client Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Stellar Brands"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-medium"
                />
              </div>

              {/* Media File Upload (Supabase Storage Bucket: projects-media) */}
              <div>
                <label className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Upload Media File to Storage Bucket (Max 5MB Image, 50MB Video)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*,video/mp4,video/webm"
                    className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#00c853] file:text-black cursor-pointer"
                  />
                  {isUploading && <Loader2 className="w-4 h-4 animate-spin text-[#00c853]" />}
                </div>
              </div>

              {mediaUrl && (
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border text-[11px] truncate text-slate-500">
                  Attached: {mediaUrl}
                </div>
              )}

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#00c853] text-black font-extrabold text-xs cursor-pointer shadow-md mt-2 disabled:opacity-50"
              >
                {editingId ? 'Save Changes' : 'Publish to Portfolio'}
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
export default PortfolioPage;
