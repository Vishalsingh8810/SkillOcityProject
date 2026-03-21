import { useState } from 'react';
import { Camera, GraduationCap, BookOpen, Save, Pencil, Star, TrendingUp, Users, ShieldCheck, Mail, Calendar } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Avatar from '../../components/common/Avatar';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import SubjectPill from '../../components/common/SubjectPill';
import Button from '../../components/common/Button';
import StarRating from '../../components/common/StarRating';
import VerifiedBadge from '../../components/badges/VerifiedBadge';
import { useAuthContext } from '../../context/AuthContext';
import { SUBJECTS } from '../../utils/constants';
import profileService from '../../services/profileService';
import toast from 'react-hot-toast';

export default function MyProfilePage() {
    const { user } = useAuthContext();
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    
    // State form
    const [form, setForm] = useState({
        firstName: user?.firstName || 'Priya',
        lastName: user?.lastName || 'Mehta',
        email: user?.email || 'priya@college.ac.in',
        college: user?.college || 'BITS Pilani',
        year: user?.year || '3rd Year',
        department: user?.department || 'Computer Science',
        bio: user?.bio || 'Passionate about JavaScript, React, and helping students learn web development. Always eager to explore new technologies and share knowledge with peers.',
        subjects: user?.subjects || ['react', 'javascript', 'python'],
    });

    const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const toggleSubject = (id) => {
        setForm(prev => {
            const subjects = prev.subjects.includes(id)
                ? prev.subjects.filter(s => s !== id)
                : prev.subjects.length < 5 ? [...prev.subjects, id] : prev.subjects;
            return { ...prev, subjects };
        });
    };

    const handleSave = async () => {
        try {
            await profileService.updateProfile(form);
            toast.success('Profile updated successfully! 🎉');
            setIsEditing(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📋' },
        { id: 'edit', label: 'Settings', icon: '⚙️' },
    ];

    const stats = [
        { icon: <BookOpen size={20} />, value: '12', label: 'Total Sessions', gradient: 'bg-gradient-primary' },
        { icon: <Star size={20} />, value: '4.8', label: 'Avg Rating', gradient: 'bg-gradient-warning' },
        { icon: <Users size={20} />, value: '5', label: 'Students Helped', gradient: 'bg-gradient-success' },
        { icon: <TrendingUp size={20} />, value: '3', label: 'Active Subjects', gradient: 'bg-gradient-accent' },
    ];

    return (
        <PageWrapper>
            <div className="max-w-4xl mx-auto page-enter pb-10">
                {/* ─── Profile Header ─── */}
                <div className="card-premium overflow-hidden mb-8 p-0 border-0 shadow-lg">
                    {/* Gradient banner */}
                    <div
                        className="h-48 relative border-b border-border/20 z-0"
                        style={{
                            background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 40%, #FF6B35 100%)',
                        }}
                    >
                         <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent/40 rounded-full blur-3xl animate-pulse-slow" />
                            <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-primary/40 rounded-full blur-2xl flex" />
                            <div className="absolute inset-0 opacity-[0.05]" style={{
                                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                                backgroundSize: '16px 16px'
                            }} />
                        </div>
                    </div>

                    <div className="bg-white px-6 sm:px-10 pb-8 relative z-10 -mt-16 sm:-mt-20">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8">
                            {/* Avatar with camera overlay */}
                            <div className="relative group shrink-0">
                                <div className="p-1.5 bg-white rounded-[2rem] shadow-xl">
                                    <Avatar name={`${form.firstName} ${form.lastName}`} size={120} rounded="rounded-[1.75rem]" className="border border-border/40" />
                                </div>
                                <label className="absolute inset-0 m-1.5 flex items-center justify-center bg-black/50 rounded-[1.75rem] opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                                    <div className="flex flex-col items-center gap-1 text-white">
                                        <Camera size={24} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Update</span>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={() => toast.success('Avatar updated!')} />
                                </label>
                                {/* Online indicator */}
                                <span className="absolute bottom-2 right-2 w-6 h-6 bg-success-light rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                                </span>
                            </div>

                            <div className="flex-1 text-center sm:text-left pt-2 w-full">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                                    <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                                        <h1 className="text-3xl font-display text-text">{form.firstName} {form.lastName}</h1>
                                        <VerifiedBadge />
                                    </div>
                                    <div className="flex gap-2">
                                        {isEditing ? (
                                            <>
                                                <button onClick={() => setIsEditing(false)} className="h-10 px-4 rounded-xl text-sm font-bold bg-gray-100 text-muted hover:bg-gray-200 transition-colors">Cancel</button>
                                                <button onClick={handleSave} className="h-10 px-5 rounded-xl text-sm font-bold bg-gradient-primary text-white shadow-sm hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"><Save size={16}/> Save</button>
                                            </>
                                        ) : (
                                            <button 
                                                onClick={() => { setActiveTab('edit'); setIsEditing(true); }}
                                                className="h-10 px-5 rounded-xl text-sm font-bold bg-white border border-border/60 shadow-sm hover:border-primary/50 hover:bg-primary/5 text-text hover:text-primary transition-all flex items-center gap-2 active:scale-95"
                                            >
                                                <Pencil size={16}/> Edit Profile
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-text/80 font-medium justify-center sm:justify-start flex-wrap">
                                    <span className="flex items-center gap-1.5 bg-gray-50 border border-border/40 px-2 py-1 rounded-md text-xs">
                                        <GraduationCap size={14} className="text-primary" /> {form.college}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-gray-50 border border-border/40 px-2 py-1 rounded-md text-xs">
                                        <BookOpen size={14} className="text-primary" /> {form.department}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-gray-50 border border-border/40 px-2 py-1 rounded-md text-xs">
                                        <Calendar size={14} className="text-primary" /> {form.year}
                                    </span>
                                </div>
                                {/* Subject pills inline */}
                                <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                                    {form.subjects.map(s => <SubjectPill key={s} subjectId={s} size="sm" selected />)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Stats Grid ─── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="card-premium p-5 flex flex-col items-center justify-center text-center shadow-sm hover:-translate-y-1 transition-transform group">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-3 shadow-sm group-hover:shadow-md transition-shadow ${stat.gradient}`}>
                                {stat.icon}
                            </div>
                            <div className="text-2xl font-bold text-text mb-0.5">{stat.value}</div>
                            <div className="text-[10px] font-bold text-muted uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* ─── Tab Navigation ─── */}
                <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden p-1.5 flex gap-1 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); if(tab.id==='overview') setIsEditing(false); else setIsEditing(true); }}
                            className={`flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === tab.id
                                    ? 'bg-text text-white shadow-sm'
                                    : 'text-muted hover:text-text hover:bg-gray-50'
                                }`}
                        >
                            <span>{tab.icon}</span> {tab.label}
                        </button>
                    ))}
                </div>

                <div className="pb-10">
                    {/* ── Overview Tab ── */}
                    {activeTab === 'overview' && (
                        <div className="card-premium space-y-8 animate-fade-in shadow-sm">
                            {/* About */}
                            <div>
                                <h3 className="section-title text-base mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary-light/50 flex items-center justify-center text-primary"><Users size={16}/></div>
                                    About Me
                                </h3>
                                <div className="text-sm font-medium text-text/80 leading-relaxed bg-gray-50/50 p-5 border border-border/40 rounded-xl">
                                    {form.bio}
                                </div>
                            </div>

                            <hr className="border-border/40" />

                            {/* Activity Snapshot */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white rounded-xl p-5 border border-border/60 shadow-sm flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl">🏆</div>
                                    <div>
                                        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-0.5">Member Since</p>
                                        <p className="text-base font-bold text-text">January 2025</p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-5 border border-border/60 shadow-sm flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xl">🔥</div>
                                    <div>
                                        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-0.5">Learning Streak</p>
                                        <p className="text-base font-bold text-text">5 Days Active</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Settings / Edit Profile Tab ── */}
                    {activeTab === 'edit' && (
                        <div className="card-premium space-y-8 animate-fade-in shadow-sm relative">
                            {/* Decorative background blur */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                            <div className="flex items-center gap-3 border-b border-border/40 pb-4 relative z-10">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Pencil size={18} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-text">General Settings</h3>
                                    <p className="text-xs font-medium text-muted">Update your personal information and preferences.</p>
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-text uppercase tracking-wider">First Name</label>
                                        <input className="input-field" value={form.firstName} onChange={e => update('firstName', e.target.value)} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-text uppercase tracking-wider">Last Name</label>
                                        <input className="input-field" value={form.lastName} onChange={e => update('lastName', e.target.value)} />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-2">
                                        Email Address <span className="text-[10px] bg-warning/10 text-warning-dark px-2 py-0.5 rounded-full">Read Only</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                                        <input className="input-field pl-10 bg-gray-50 text-muted cursor-not-allowed border-dashed focus:border-border" value={form.email} disabled />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-border/40">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-text uppercase tracking-wider">College / University</label>
                                        <input className="input-field" value={form.college} onChange={e => update('college', e.target.value)} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-text uppercase tracking-wider">Current Year</label>
                                        <select className="input-field" value={form.year} onChange={e => update('year', e.target.value)}>
                                            <option value="1st Year">1st Year</option>
                                            <option value="2nd Year">2nd Year</option>
                                            <option value="3rd Year">3rd Year</option>
                                            <option value="4th Year">4th Year</option>
                                            <option value="Alumni">Alumni</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-text uppercase tracking-wider">Department</label>
                                    <input className="input-field" value={form.department} onChange={e => update('department', e.target.value)} />
                                </div>

                                <div className="space-y-1.5 pt-4 border-t border-border/40">
                                    <label className="text-xs font-bold text-text uppercase tracking-wider flex justify-between">
                                        About You
                                        <span className="text-muted lowercase font-medium">{form.bio.length}/300</span>
                                    </label>
                                    <textarea 
                                        className="input-field min-h-[120px] resize-none pb-4" 
                                        value={form.bio} 
                                        onChange={e => update('bio', e.target.value)} 
                                        maxLength={300} 
                                        placeholder="Write a short summary about yourself..."
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-text uppercase tracking-wider mb-3 flex items-center justify-between">
                                        Expertise Areas
                                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px]">{form.subjects.length}/5 Selected</span>
                                    </label>
                                    <div className="flex flex-wrap gap-2 p-5 bg-gray-50 rounded-xl border border-border/60 shadow-inner">
                                        {SUBJECTS.map(s => (
                                            <div key={s.id} className="transition-transform active:scale-95">
                                                <SubjectPill
                                                    subjectId={s.id}
                                                    selected={form.subjects.includes(s.id)}
                                                    onClick={() => toggleSubject(s.id)}
                                                    className="cursor-pointer font-bold"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-6 border-t border-border/40">
                                    <button 
                                        onClick={handleSave} 
                                        className="w-full sm:w-auto px-8 h-12 bg-gradient-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all text-sm flex items-center justify-center gap-2"
                                    >
                                        <Save size={18}/> Save Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}
