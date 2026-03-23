import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import Toggle from '../../components/common/Toggle';
import Button from '../../components/common/Button';
import Dropdown from '../../components/common/Dropdown';
import profileService from '../../services/profileService';
import { useAuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const { user, updateUser, logout } = useAuthContext();

    const [settings, setSettings] = useState({
        emailNotifications: user?.settings?.emailNotifications ?? true,
        pushNotifications: user?.settings?.pushNotifications ?? true,
        sessionReminders: user?.settings?.sessionReminders ?? true,
        newRequestAlerts: user?.settings?.newRequestAlerts ?? true,
        messageNotifications: user?.settings?.messageNotifications ?? true,
        darkMode: user?.settings?.darkMode ?? false,
        language: user?.settings?.language ?? 'en',
        availability: user?.settings?.availability ?? 'online',
    });

    // Apply dark mode class on mount and whenever it changes
    useEffect(() => {
        if (settings.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [settings.darkMode]);

    const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

    const handleSave = async () => {
        try {
            await profileService.updateSettings(settings);
            updateUser({ settings: { ...user?.settings, ...settings } });
            toast.success('Settings saved! ✅');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save settings');
        }
    };

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    const handleDeleteAccount = () => toast.error('This action cannot be undone');

    return (
        <PageWrapper>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-text mb-1">Settings</h1>
                <p className="text-sm text-muted mb-8">Manage your account preferences</p>

                {/* Notifications */}
                <section className="bg-white dark:bg-zinc-900 rounded-lg border border-border dark:border-zinc-700 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-text dark:text-white mb-4">🔔 Notifications</h2>
                    <div className="space-y-4">
                        <Toggle label="Email Notifications" description="Receive important updates via email" checked={settings.emailNotifications} onChange={(v) => update('emailNotifications', v)} />
                        <Toggle label="Push Notifications" description="Get real-time push alerts" checked={settings.pushNotifications} onChange={(v) => update('pushNotifications', v)} />
                        <Toggle label="Session Reminders" description="Get reminded 15 min before sessions" checked={settings.sessionReminders} onChange={(v) => update('sessionReminders', v)} />
                        <Toggle label="New Help Request Alerts" description="Be notified when students need help" checked={settings.newRequestAlerts} onChange={(v) => update('newRequestAlerts', v)} />
                        <Toggle label="Message Notifications" description="Get notified for new messages" checked={settings.messageNotifications} onChange={(v) => update('messageNotifications', v)} />
                    </div>
                </section>

                {/* Appearance */}
                <section className="bg-white dark:bg-zinc-900 rounded-lg border border-border dark:border-zinc-700 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-text dark:text-white mb-4">🎨 Appearance</h2>
                    <div className="space-y-4">
                        <Toggle label="Dark Mode" description="Switch to dark theme" checked={settings.darkMode} onChange={(v) => update('darkMode', v)} />
                        <Dropdown
                            label="Language"
                            options={[
                                { value: 'en', label: '🇬🇧 English' },
                                { value: 'hi', label: '🇮🇳 Hindi' },
                            ]}
                            value={settings.language}
                            onChange={(v) => update('language', v)}
                        />
                    </div>
                </section>

                {/* Availability */}
                <section className="bg-white dark:bg-zinc-900 rounded-lg border border-border dark:border-zinc-700 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-text dark:text-white mb-4">🟢 Availability</h2>
                    <div className="flex gap-3">
                        {[
                            { id: 'online', label: 'Online', color: '#10B981' },
                            { id: 'busy', label: 'Busy', color: '#F59E0B' },
                            { id: 'offline', label: 'Offline', color: '#6B7280' },
                        ].map(s => (
                            <button
                                key={s.id}
                                onClick={() => update('availability', s.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${settings.availability === s.id ? 'shadow-sm' : 'border-border'
                                    }`}
                                style={settings.availability === s.id ? { borderColor: s.color, backgroundColor: s.color + '10' } : {}}
                            >
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                                {s.label}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="accent" fullWidth onClick={handleSave}>Save Settings</Button>
                    <Button variant="ghost" fullWidth onClick={handleLogout}>Logout</Button>
                </div>

                {/* Danger Zone */}
                <section className="mt-8 border-2 border-dashed border-red-200 rounded-lg p-6">
                    <h3 className="text-sm font-semibold text-danger mb-2">⚠️ Danger Zone</h3>
                    <p className="text-xs text-muted mb-3">Once you delete your account, there is no going back. Please be certain.</p>
                    <Button
                        variant="ghost"
                        onClick={handleDeleteAccount}
                        className="!text-danger !border-danger hover:!bg-red-50"
                    >
                        Delete My Account
                    </Button>
                </section>
            </div>
        </PageWrapper>
    );
}
