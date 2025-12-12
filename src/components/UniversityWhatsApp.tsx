
'use client';

import { FaWhatsapp } from 'react-icons/fa';

interface UniversityWhatsAppProps {
    universityName: string;
    className?: string;
}

const UniversityWhatsApp = ({ universityName, className = '' }: UniversityWhatsAppProps) => {
    const phoneNumber = '8801983333566'; // EduExpress Main WhatsApp

    const handleClick = () => {
        const message = `Hi EduExpress! \n\nI am interested in applying to *${universityName}*.\n\nCould you please provide more information about admission requirements and scholarship opportunities?`;
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            className={`flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl group ${className}`}
        >
            <FaWhatsapp className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span>Chat on WhatsApp</span>
        </button>
    );
};

export default UniversityWhatsApp;
