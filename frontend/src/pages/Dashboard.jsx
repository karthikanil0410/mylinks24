import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, Wand2 } from 'lucide-react';

export default function Dashboard() {
    const [config, setConfig] = useState({
        title: 'Secret Love Calculator',
        prankMessage: '😂 You got pranked! I now know who your crush is!'
    });
    const [generatedLink, setGeneratedLink] = useState('');
    const [secretLink, setSecretLink] = useState('');
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSecretLink('');
        try {
            const response = await fetch(`${apiUrl}/api/campaigns`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ config })
            });
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }
            const data = await response.json();
            if (!data.slug || !data.id) {
                throw new Error('Server did not return a campaign slug or id');
            }
            // Give them the backend share link for perfect social previews
            setGeneratedLink(`${import.meta.env.VITE_API_URL}/share/${data.slug}`);
            // The secret dashboard stays on the frontend
            setSecretLink(`${window.location.origin}/results/${data.id}`);
        } catch (err) {
            console.error('Failed to generate link', err);
            setError('Unable to generate link. Make sure the backend is running and the API URL is correct.');
        }
        setLoading(false);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 relative">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg p-8 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative overflow-hidden"
            >
                {/* Background glowing orb */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500 rounded-full blur-[90px] opacity-30 pointer-events-none"></div>

                <div className="text-center mb-8 relative z-10">
                    <h1 className="text-3xl font-extrabold text-white mb-2">Prank Link Builder</h1>
                    <p className="text-gray-300 text-sm">Customize your viral prank link below.</p>
                    {error && (
                        <div className="mt-4 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                            {error}
                        </div>
                    )}
                </div>

                {!generatedLink? (
                    <form onSubmit={handleCreate} className="space-y-5 relative z-10">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Fake Page Title</label>
                            <input 
                                type="text" 
                                required 
                                value={config.title}
                                onChange={(e) => setConfig({...config, title: e.target.value})}
                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Reveal Message (The Prank)</label>
                            <textarea 
                                required 
                                rows="3"
                                value={config.prankMessage}
                                onChange={(e) => setConfig({...config, prankMessage: e.target.value})}
                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl font-bold text-white shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading? 'Generating...' : <><Wand2 size={20} /> Generate Viral Link</>}
                        </button>
                    </form>
                ) : (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="space-y-6 relative z-10 text-center">
                        <div className="p-5 bg-green-500/10 border border-green-500/30 rounded-xl mb-4">
                            <h3 className="text-green-400 font-bold mb-2">1. Send This Link to Victims</h3>
                            <p className="text-sm text-gray-300 break-all bg-black/40 p-3 rounded-lg mb-4">{generatedLink}</p>

                            <h3 className="text-pink-400 font-bold mb-2">2. Save Your Secret Dashboard Link</h3>
                            <p className="text-xs text-gray-400 mb-2">Do not share this! Open it later to see who fell for the prank.</p>
                            <p className="text-sm text-gray-300 break-all bg-black/40 p-3 rounded-lg">{secretLink}</p>
                        </div>

                        <button 
                            onClick={copyLink}
                            className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl font-bold text-white flex items-center justify-center gap-3 transition-all"
                        >
                            {copied? <><CheckCircle size={20} className="text-green-400" /> Copied!</> : <><Copy size={20} /> Copy Link</>}
                        </button>

                        <button 
                            onClick={() => {
                                setGeneratedLink('');
                                setSecretLink('');
                            }}
                            className="text-sm text-gray-400 hover:text-white transition-colors underline"
                        >
                            Create another link
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}