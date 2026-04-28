import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ResultsPage() {
    const { id } = useParams();
    const [results, setResults] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/results/${id}`)
           .then(res => res.json())
           .then(data => setResults(data || []))
           .catch(() => setResults([]));
    }, [id]);

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-2xl p-8 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl text-white">
                <h1 className="text-3xl font-bold mb-2">Secret Dashboard</h1>
                <p className="text-gray-300 mb-8">Here is everyone who fell for your prank.</p>
                
                <div className="space-y-4">
                    {results.length === 0 ? (
                        <p className="text-gray-400">Waiting for victims to submit...</p>
                    ) : (
                        results.map((entry, index) => (
                            <div key={index} className="p-4 bg-black/30 border border-white/10 rounded-xl flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-400">Victim</p>
                                    <p className="font-bold text-lg">{entry.responses?.victim}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400">Crush</p>
                                    <p className="font-bold text-lg text-pink-400">{entry.responses?.crush}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                
                <Link to="/" className="inline-block mt-8 text-blue-400 hover:text-blue-300 underline">Create another prank</Link>
            </div>
        </div>
    );
}
