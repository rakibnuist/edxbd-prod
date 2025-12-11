'use client';

import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

interface TrackingData {
  leadName: string;
  phoneNumber: string;
  country?: string;
  program?: string;
  status?: string;
  messageType: string;
}

interface WhatsAppButtonProps {
  phoneNumber: string;
  leadName: string;
  leadCountry?: string;
  leadProgram?: string;
  leadStatus?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outline' | 'minimal';
  showText?: boolean;
  className?: string;
  onTrack?: (data: TrackingData) => void;
}

export default function WhatsAppButton({
  phoneNumber,
  leadName,
  leadCountry,
  leadProgram,
  leadStatus,
  size = 'medium',
  variant = 'default',
  showText = true,
  className = '',
  onTrack
}: WhatsAppButtonProps) {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleWhatsApp = async () => {
    if (!phoneNumber) return;

    setIsClicked(true);

    // Remove any non-numeric characters and ensure it starts with country code
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const whatsappPhone = cleanPhone.startsWith('880') ? cleanPhone : `880${cleanPhone}`;

    // Create personalized message based on lead status and information
    const message = createPersonalizedMessage(leadName, leadCountry, leadProgram, leadStatus);

    // Track the interaction
    if (onTrack) {
      onTrack({
        leadName,
        phoneNumber,
        country: leadCountry,
        program: leadProgram,
        status: leadStatus,
        messageType: 'whatsapp_contact'
      });
    }

    // Open WhatsApp with the message
    window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`, '_blank');

    // Reset click state after animation
    setTimeout(() => setIsClicked(false), 1000);
  };

  const createPersonalizedMessage = (name: string, country?: string, program?: string, status?: string) => {
    const greetings = [
      `Hi ${name}! 👋`,
      `Hello ${name}! 😊`,
      `Hi there ${name}! 🌟`
    ];

    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

    let message = `${randomGreeting}\n\nThis is EduExpress International. I'm reaching out regarding your study abroad inquiry.`;

    if (country) {
      message += `\n\nI see you're interested in studying in ${country}.`;
    }

    if (program) {
      message += `\n\nFor the ${program} program, I'd be happy to help you with:`;
    } else {
      message += `\n\nI'd be happy to help you with:`;
    }

    message += `\n• University selection & applications\n• Visa guidance\n• Scholarship opportunities\n• Pre-departure support\n\nHow can I assist you today? 😊`;

    // Add status-specific message
    if (status) {
      switch (status) {
        case 'new':
          message += `\n\nI noticed you're new to our services - welcome! 🎉`;
          break;
        case 'consultation_scheduled':
          message += `\n\nI see you have a consultation scheduled - looking forward to speaking with you! 📅`;
          break;
        case 'application_started':
          message += `\n\nI see you've started your application process - let me know if you need any assistance! 📝`;
          break;
        case 'admission_received':
          message += `\n\nCongratulations on your admission! 🎓 Let's discuss the next steps.`;
          break;
        case 'visa_applied':
          message += `\n\nI see you've applied for your visa - I'm here to help with any questions! 🛂`;
          break;
        case 'visa_approved':
          message += `\n\nCongratulations on your visa approval! 🎉 Ready for your journey?`;
          break;
      }
    }

    return message;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-2 py-1 text-xs';
      case 'large':
        return 'px-4 py-2 text-sm';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return 'bg-transparent border-2 border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600';
      case 'minimal':
        return 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200';
      default:
        return 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 'w-3 h-3';
      case 'large':
        return 'w-5 h-5';
      default:
        return 'w-4 h-4';
    }
  };

  return (
    <button
      onClick={handleWhatsApp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        inline-flex items-center justify-center
        ${getSizeClasses()}
        ${getVariantClasses()}
        rounded-lg font-medium
        transition-all duration-300 ease-in-out
        transform hover:scale-105 active:scale-95
        ${isClicked ? 'animate-pulse' : ''}
        ${isHovered ? 'shadow-lg' : 'shadow-md'}
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        ${className}
      `}
      title={`Send WhatsApp message to ${leadName}`}
      disabled={!phoneNumber}
    >
      {/* WhatsApp Icon with Animation */}
      <div className={`relative ${getIconSize()} ${showText ? 'mr-2' : ''}`}>
        <FaWhatsapp
          className={`${getIconSize()} transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`}
        />

        {/* Pulse animation for new messages */}
        {isHovered && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        )}
      </div>

      {/* Button Text */}
      {showText && (
        <span className="font-medium">
          {size === 'small' ? 'WA' : 'WhatsApp'}
        </span>
      )}

      {/* Status indicator */}
      {leadStatus && (
        <div className="ml-1">
          {leadStatus === 'new' && <span className="text-xs">🆕</span>}
          {leadStatus === 'consultation_scheduled' && <span className="text-xs">📅</span>}
          {leadStatus === 'admission_received' && <span className="text-xs">🎓</span>}
          {leadStatus === 'visa_approved' && <span className="text-xs">🎉</span>}
        </div>
      )}
    </button>
  );
}
