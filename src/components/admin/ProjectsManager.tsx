import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, UploadCloud, Save, X } from 'lucide-react';
import type { Project } from '../../sections/ProjectsSection';

export const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  const [errorMsg, setErrorMsg] = useState('');
  
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('order_num', { ascending: true });
    if (!error && data) setProjects(data);
    setLoading(false);
  };

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMsg('Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg('File too large. Maximum size is 5MB.');
      return;
    }
    setErrorMsg('');

    setUploadingImage(true);
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError.message);
      setErrorMsg('Failed to upload image. Please try again.');
      setUploadingImage(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    setCurrentProject(prev => ({ ...prev, [fieldName]: publicUrl }));
    setUploadingImage(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProject.id) {
      // Update
      const { error } = await supabase.from('projects').update(currentProject).eq('id', currentProject.id);
      if (!error) {
        setIsEditing(false);
        fetchProjects();
      } else {
        console.error('Save error:', error.message);
        setErrorMsg('Failed to save project. Please try again.');
      }
    } else {
      // Insert
      const { error } = await supabase.from('projects').insert([currentProject]);
      if (!error) {
        setIsEditing(false);
        fetchProjects();
      } else {
        console.error('Insert error:', error.message);
        setErrorMsg('Failed to create project. Please try again.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        console.error('Delete error:', error.message);
        setErrorMsg('Failed to delete project. Please try again.');
      } else {
        fetchProjects();
      }
    }
  };

  const openNewProject = () => {
    setErrorMsg('');
    setCurrentProject({
      order_num: projects.length + 1,
      num: `0${projects.length + 1}`.slice(-2),
      label: 'Client',
      name: '',
      description: '',
      live_link: '',
      github_link: ''
    });
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="bg-[#111] border border-white/10 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold uppercase tracking-wider">{currentProject.id ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={() => setIsEditing(false)} className="text-white/50 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#A0AAB2] uppercase tracking-widest font-bold">Project Number (e.g. 01)</label>
            <input required type="text" value={currentProject.num || ''} onChange={e => setCurrentProject({...currentProject, num: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#A0AAB2] uppercase tracking-widest font-bold">Order Number (Sorting)</label>
            <input required type="number" value={currentProject.order_num || ''} onChange={e => setCurrentProject({...currentProject, order_num: parseInt(e.target.value)})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#A0AAB2] uppercase tracking-widest font-bold">Label (e.g. Client / Personal)</label>
            <input required type="text" value={currentProject.label || ''} onChange={e => setCurrentProject({...currentProject, label: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#A0AAB2] uppercase tracking-widest font-bold">Project Name</label>
            <input required type="text" value={currentProject.name || ''} onChange={e => setCurrentProject({...currentProject, name: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#A0AAB2] uppercase tracking-widest font-bold">Live Link (Optional)</label>
            <input type="text" value={currentProject.live_link || ''} onChange={e => setCurrentProject({...currentProject, live_link: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3" placeholder="https://" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#A0AAB2] uppercase tracking-widest font-bold">GitHub Link (Optional)</label>
            <input type="text" value={currentProject.github_link || ''} onChange={e => setCurrentProject({...currentProject, github_link: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3" placeholder="https://github.com/..." />
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-xs text-[#A0AAB2] uppercase tracking-widest font-bold">Project Description</label>
            <textarea required rows={4} value={currentProject.description || ''} onChange={e => setCurrentProject({...currentProject, description: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 resize-none" placeholder="Write about the project..."></textarea>
          </div>

          <div className="md:col-span-2 pt-6 mt-2 border-t border-white/10">
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              {/* Desktop Image */}
              <div className="flex flex-col gap-2 items-center w-full max-w-sm">
                <label className="text-xs text-[#A0AAB2] uppercase tracking-widest font-bold w-full text-center mb-2">Desktop Image (Horizontal)</label>
                {currentProject.media_url ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/20 group">
                    <img src={currentProject.media_url} alt="Project preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setCurrentProject({...currentProject, media_url: ''})} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="text-red-500" /></button>
                  </div>
                ) : (
                  <label className="w-full h-32 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-[#E60000] hover:bg-[#E60000]/5 transition-all">
                    <UploadCloud className="w-6 h-6 text-white/50 mb-2" />
                    <span className="text-xs text-white/50">{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'media_url')} disabled={uploadingImage} />
                  </label>
                )}
              </div>

              {/* Mobile Image */}
              <div className="flex flex-col gap-2 items-center w-full max-w-sm">
                <label className="text-xs text-[#A0AAB2] uppercase tracking-widest font-bold w-full text-center mb-2">Mobile Image (Vertical) - Optional</label>
                {currentProject.mobile_media_url ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/20 group">
                    <img src={currentProject.mobile_media_url} alt="Mobile preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setCurrentProject({...currentProject, mobile_media_url: ''})} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="text-red-500" /></button>
                  </div>
                ) : (
                  <label className="w-full h-32 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-[#E60000] hover:bg-[#E60000]/5 transition-all">
                    <UploadCloud className="w-6 h-6 text-white/50 mb-2" />
                    <span className="text-xs text-white/50">{uploadingImage ? 'Uploading...' : 'Upload Mobile Image'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'mobile_media_url')} disabled={uploadingImage} />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 pt-4">
            <button type="submit" disabled={uploadingImage || !currentProject.media_url} className="w-full bg-[#E60000] hover:bg-[#E60000]/80 text-white font-bold uppercase tracking-widest py-4 rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-50">
              <Save className="w-5 h-5" />
              Save Project
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-white/10 rounded-3xl p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold uppercase tracking-wider text-white flex items-center gap-2">
          Projects Manager
        </h2>
        <button onClick={openNewProject} className="flex items-center gap-2 bg-[#E60000] hover:bg-[#E60000]/80 text-white px-4 py-2.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-all">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-[#A0AAB2]">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-10 text-[#A0AAB2] border border-dashed border-white/10 rounded-2xl">
          No projects found. Add your first project!
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-white/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 rounded-lg bg-white/5 overflow-hidden border border-white/10 hidden sm:block">
                  {project.media_url && <img src={project.media_url} alt={`${project.name} thumbnail`} className="w-full h-full object-cover" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#E60000] font-black">{project.num}</span>
                    <h3 className="font-bold text-lg uppercase tracking-wide">{project.name}</h3>
                  </div>
                  <span className="text-xs text-[#A0AAB2] uppercase tracking-widest">{project.label}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setCurrentProject(project); setIsEditing(true); }} className="p-2 bg-white/5 hover:bg-white/20 rounded-lg transition-colors text-white">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(project.id)} className="p-2 bg-red-500/10 hover:bg-red-500/30 rounded-lg transition-colors text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
