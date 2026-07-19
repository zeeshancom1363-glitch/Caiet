// ============================================
// FILE: SectionTitle.jsx
// WHAT IT DOES: Reusable section heading with
// gradient accent line. Used on every section
// to keep consistent typography.
// Used by: Home, About, Services, etc.
// ============================================
import React from 'react';
import { motion } from 'framer-motion';

export default function SectionTitle({ subtitle, title, description, center = true }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`mb-12 ${center ? 'text-center' : ''}`}
        >
            {subtitle && (
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-600 text-sm font-semibold mb-4 tracking-wide uppercase">
                    {subtitle}
                </span>
            )}
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-ink mb-4">
                {title}
            </h2>
            {description && (
                <p className="text-body max-w-2xl mx-auto text-lg">
                    {description}
                </p>
            )}
        </motion.div>
    );
}
