// ============================================
// FILE: About.jsx
// WHAT IT DOES: About page showing mission, vision,
// stats, and the team.
// Used by: App.jsx route "/about"
// ============================================
import React, { useEffect, useState } from 'react';
import { getAbout, getTeam } from '../../api/publicApi';
import SectionTitle from '../../components/website/SectionTitle';
import { motion } from 'framer-motion';
import { Target, Eye, Linkedin, Facebook } from 'lucide-react';

export default function About() {
    const [about, setAbout] = useState(null);
    const [team, setTeam] = useState([]);

    useEffect(() => {
        getAbout().then(r => setAbout(r.data)).catch(() => { });
        getTeam().then(r => setTeam(r.data)).catch(() => { });
    }, []);

    return (
        <>
            {/* Hero */}
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold font-heading mb-4">
                        {about?.heading || 'About CAI&ET'}
                    </motion.h1>
                </div>
            </section>

            {/* About Content */}
            {about && (
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
                        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <div className="glass-card p-8 rounded-2xl">
                                {about.image ? (
                                    <img src={about.image} alt="About" className="w-full rounded-xl" />
                                ) : (
                                    <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-violet-100 rounded-xl flex items-center justify-center">
                                        <span className="text-5xl gradient-text font-bold font-heading">CAI&ET</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <p className="text-body leading-relaxed whitespace-pre-line">{about.description}</p>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Mission & Vision */}
            {about && (
                <section className="py-16 bg-surface">
                    <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-8">
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8">
                            <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-brand flex items-center justify-center">
                                <Target className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold font-heading text-ink mb-3">Our Mission</h3>
                            <p className="text-body">{about.missionText}</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass-card p-8">
                            <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center">
                                <Eye className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold font-heading text-ink mb-3">Our Vision</h3>
                            <p className="text-body">{about.visionText}</p>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Team */}
            {team.length > 0 && (
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <SectionTitle subtitle="Our Team" title="Meet the People Behind CAI&ET" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {team.map((member, i) => (
                                <motion.div key={member.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                    className="glass-card p-6 text-center"
                                >
                                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-violet-100 flex items-center justify-center overflow-hidden">
                                        {member.photo ? (
                                            <img src={member.photo} alt={member.fullName} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-3xl font-bold gradient-text">{member.fullName.charAt(0)}</span>
                                        )}
                                    </div>
                                    <h3 className="font-heading font-bold text-ink text-lg">{member.fullName}</h3>
                                    <p className="text-sm text-primary-600 font-medium mb-2">{member.designation}</p>
                                    <p className="text-xs text-body mb-3 line-clamp-3">{member.bio}</p>
                                    <div className="flex gap-2 justify-center">
                                        {member.linkedinUrl && (
                                            <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-primary-100 transition">
                                                <Linkedin className="w-4 h-4 text-primary-600" />
                                            </a>
                                        )}
                                        {member.facebookUrl && (
                                            <a href={member.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-blue-100 transition">
                                                <Facebook className="w-4 h-4 text-blue-600" />
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
