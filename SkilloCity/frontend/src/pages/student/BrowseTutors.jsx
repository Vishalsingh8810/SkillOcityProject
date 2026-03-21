import { useState, useEffect, useMemo } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import TutorCard from '../../components/cards/TutorCard';
import Input from '../../components/common/Input';
import Toggle from '../../components/common/Toggle';
import Spinner from '../../components/common/Spinner';
import StarRating from '../../components/common/StarRating';
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { SUBJECTS } from '../../utils/constants';
import tutorService from '../../services/tutorService';
import { useSearchParams } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';

export default function BrowseTutors() {
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [minRating, setMinRating] = useState(0);
    const [onlineOnly, setOnlineOnly] = useState(false);
    const [sortBy, setSortBy] = useState('sessions');
    const [loading, setLoading] = useState(true);
    const [showMoreSubjects, setShowMoreSubjects] = useState(false);
    const [tutors, setTutors] = useState([]);
    
    // Mobile filter sheet state
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        const fetchTutors = async () => {
            setLoading(true);
            try {
                // Determine search parameter appropriately based on our new API features
                let fetchMethod = tutorService.getAll;
                let filterParams = {
                    subject: selectedSubjects[0] || '',
                    onlineOnly,
                    minRating: minRating || undefined,
                    search: debouncedSearch || undefined,
                    sortBy,
                };

                const data = await fetchMethod(filterParams);
                setTutors(data);
            } catch (err) {
                console.error('Error fetching tutors:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTutors();
    }, [debouncedSearch, selectedSubjects, minRating, onlineOnly, sortBy]);

    const toggleSubject = (id) => {
        setSelectedSubjects(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    const filtered = useMemo(() => {
        let results = [...tutors];
        // Client-side filtering for multiple subjects
        if (selectedSubjects.length > 1) {
            results = results.filter(t => t.subjects?.some(s => selectedSubjects.includes(s)));
        }
        return results;
    }, [tutors, selectedSubjects]);

    const displaySubjects = showMoreSubjects ? SUBJECTS : SUBJECTS.slice(0, 6);

    const FilterSidebar = () => (
        <div className="space-y-6">
            {/* Search */}
            <div>
                <label className="text-xs font-bold text-text uppercase tracking-wider mb-2.5 block">Search keywords</label>
                <div className="relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Name, subject, college..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-border/60 rounded-xl text-sm transition-all focus:bg-white focus:border-primary focus:shadow-focus outline-none"
                    />
                </div>
            </div>

            {/* Subjects */}
            <div className="pt-5 border-t border-border/40">
                <label className="text-xs font-bold text-text uppercase tracking-wider mb-3 block">Subjects</label>
                <div className="space-y-1.5">
                    {displaySubjects.map((s) => (
                        <label key={s.id} className="flex items-center gap-3 cursor-pointer group p-1.5 -mx-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="relative flex items-center justify-center w-4 h-4 shrink-0">
                                <input
                                    type="checkbox"
                                    checked={selectedSubjects.includes(s.id)}
                                    onChange={() => toggleSubject(s.id)}
                                    className="peer appearance-none w-4 h-4 rounded border-2 border-border/80 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                />
                                <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="2.5 7.5 5.5 10.5 11.5 3.5"/></svg>
                            </div>
                            <span className="text-sm font-medium text-text group-hover:text-primary transition-colors">{s.emoji} {s.name}</span>
                        </label>
                    ))}
                    <button
                        onClick={() => setShowMoreSubjects(!showMoreSubjects)}
                        className="text-xs font-bold text-primary hover:text-primary-dark mt-2 pt-1 inline-flex items-center gap-1"
                    >
                        {showMoreSubjects ? 'Hide subjects' : 'View all subjects'}
                        <ArrowUpDown size={12} className={showMoreSubjects ? 'rotate-180 transition-transform' : 'transition-transform'} />
                    </button>
                </div>
            </div>

            {/* Rating */}
            <div className="pt-5 border-t border-border/40">
                <label className="text-xs font-bold text-text uppercase tracking-wider mb-3 block">Minimum rating</label>
                <div className="bg-gray-50 rounded-xl p-3 border border-border/40 text-center">
                    <StarRating rating={minRating} interactive onChange={setMinRating} size={22} className="justify-center mb-1" />
                    {minRating > 0 ? (
                        <p className="text-[11px] font-semibold text-primary">{minRating}.0 and above</p>
                    ) : (
                        <p className="text-[11px] font-medium text-muted">Any rating</p>
                    )}
                </div>
            </div>

            {/* Toggles */}
            <div className="pt-5 border-t border-border/40 space-y-4">
                <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm font-bold text-text group-hover:text-primary transition-colors">Online right now</span>
                    <Toggle checked={onlineOnly} onChange={setOnlineOnly} />
                </label>
            </div>
        </div>
    );

    return (
        <PageWrapper>
            {/* Header section */}
            <div className="max-w-6xl mx-auto mb-6 sm:mb-8 mt-2">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display text-text mb-2">Find your next Tutor</h1>
                        <p className="text-sm text-muted">Browse {filtered.length} verified tutors ready to help you learn faster.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            className="lg:hidden h-10 px-4 rounded-xl border border-border/80 bg-white font-semibold text-sm flex items-center gap-2 hover:bg-gray-50 active:scale-95 transition-all outline-none"
                            onClick={() => setShowMobileFilters(true)}
                        >
                            <Filter size={16} /> Filters
                        </button>
                        
                        <div className="relative shrink-0 w-full sm:w-[200px]">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full h-10 pl-10 pr-8 bg-white border border-border/80 rounded-xl text-sm font-semibold text-text appearance-none outline-none focus:border-primary focus:shadow-focus cursor-pointer transition-colors"
                            >
                                <option value="sessions">Most Experienced</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                            <SlidersHorizontal size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                            <ChevronDownIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-8 max-w-6xl mx-auto page-enter">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-[280px] shrink-0">
                    <div className="card-premium sticky top-[100px] shadow-lg border-border/40">
                        <FilterSidebar />
                    </div>
                </aside>

                {/* Mobile Filter Sheet */}
                {showMobileFilters && (
                    <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowMobileFilters(false)} />
                        <div className="relative w-full max-w-[320px] bg-white h-full flex flex-col shadow-2xl animate-slide-left">
                            <div className="p-5 border-b border-border/60 flex items-center justify-between bg-gray-50">
                                <h3 className="font-bold text-lg text-text flex items-center gap-2"><Filter size={18}/> Filters</h3>
                                <button onClick={() => setShowMobileFilters(false)} className="p-2 -mr-2 text-muted hover:text-text rounded-full hover:bg-black/5 transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                </button>
                            </div>
                            <div className="p-5 overflow-y-auto flex-1">
                                <FilterSidebar />
                            </div>
                            <div className="p-5 border-t border-border/60 bg-gray-50">
                                <button className="btn-primary w-full h-12 text-sm rounded-xl" onClick={() => setShowMobileFilters(false)}>
                                    Show {filtered.length} Teachers
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="card-premium p-6 space-y-4 shadow-sm border border-border/40">
                                    <div className="flex gap-4"><div className="skeleton w-16 h-16 rounded-full" /><div className="flex-1 space-y-2.5 pt-1"><div className="skeleton h-4 w-3/4" /><div className="skeleton h-3 w-1/2" /></div></div>
                                    <div className="skeleton h-8 w-full rounded-lg mt-6" />
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="card-premium flex flex-col items-center justify-center py-20 text-center shadow-sm">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 text-4xl shadow-inner border border-border/40">
                                🔍
                            </div>
                            <h3 className="text-xl font-display text-text mb-2">No tutors found</h3>
                            <p className="text-sm text-muted mb-6 max-w-sm">We couldn't find any tutors matching your current filters. Try adjusting your search criteria.</p>
                            <button className="btn-outline px-6 py-2.5 rounded-xl text-sm" onClick={() => { setSearch(''); setSelectedSubjects([]); setMinRating(0); setOnlineOnly(false); }}>
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5 stagger-children pb-10">
                            {filtered.map((t) => (
                                <div key={t.id} className="animate-slide-up h-full">
                                    <TutorCard tutor={t} />
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </PageWrapper>
    );
}

// Chevron Helper icon
function ChevronDownIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    );
}

// Add animation keyframe not in standard config
const style = document.createElement('style');
style.innerHTML = `
@keyframes slideLeft {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}
.animate-slide-left { animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
`;
document.head.appendChild(style);
