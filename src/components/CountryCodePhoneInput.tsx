'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface CountryCode {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

interface CountryCodePhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
  disabled?: boolean;
}

const countryCodes: CountryCode[] = [
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', dialCode: '+880' },
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', dialCode: '+30' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', dialCode: '+48' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', dialCode: '+36' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾', dialCode: '+357' },
  { code: 'China', name: 'China', flag: '🇨🇳', dialCode: '+86' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dialCode: '+92' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', dialCode: '+94' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', dialCode: '+977' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻', dialCode: '+960' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪', dialCode: '+995' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', dialCode: '+7' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', dialCode: '+998' },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬', dialCode: '+996' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', dialCode: '+66' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', dialCode: '+62' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', dialCode: '+974' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', dialCode: '+965' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', dialCode: '+968' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7' },
];

const CountryCodePhoneInput: React.FC<CountryCodePhoneInputProps> = ({
  value,
  onChange,

  required = false,
  className = '',
  error,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCodes[0]); // Default to Bangladesh
  const [searchTerm, setSearchTerm] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter countries based on search term
  const filteredCountries = countryCodes.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initialize with Bangladesh as default
  useEffect(() => {
    if (!value) {
      setSelectedCountry(countryCodes[0]); // Bangladesh
      setPhoneNumber('');
    } else {
      // Parse existing value to extract country and phone number
      const parsed = parsePhoneNumber(value);
      if (parsed.country) {
        setSelectedCountry(parsed.country);
        setPhoneNumber(parsed.number);
      }
    }
  }, [value]);

  // Parse phone number to extract country and number
  const parsePhoneNumber = (fullNumber: string) => {
    for (const country of countryCodes) {
      if (fullNumber.startsWith(country.dialCode + '')) {
        return {
          country,
          number: fullNumber.substring(country.dialCode.length)
        };
      }
    }
    const match = countryCodes.find(c => fullNumber.startsWith(c.dialCode));
    if (match) {
      return {
        country: match,
        number: fullNumber.substring(match.dialCode.length)
      };
    }
    return { country: null, number: fullNumber };
  };

  // Handle country selection
  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchTerm('');

    // Update the full phone number
    const fullNumber = country.dialCode + phoneNumber;
    onChange(fullNumber);

    // Default focus back to input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle phone number input
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setPhoneNumber(number);

    // Update the full phone number
    const fullNumber = selectedCountry.dialCode + number;
    onChange(fullNumber);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Container - Unified Box (Compact) */}
      <div
        className={`flex items-center w-full px-4 py-2.5 border-2 rounded-xl transition-all duration-300 bg-slate-50 relative z-10 
        ${error
            ? 'border-red-500 ring-2 ring-red-100'
            : 'border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 hover:border-slate-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''}`}
      >

        {/* Country Code Selector */}
        <div className="relative shrink-0 border-r border-slate-200 pr-3 mr-3" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className="flex items-center space-x-2 focus:outline-none group"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className="text-xl leading-none">{selectedCountry.flag}</span>
            <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
              {selectedCountry.dialCode}
            </span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute top-[140%] left-0 z-50 w-72 bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Search Input */}
              <div className="p-2 border-b border-slate-100 bg-slate-50">
                <input
                  type="text"
                  placeholder="Search country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs bg-white"
                  autoFocus
                />
              </div>

              {/* Country List */}
              <div className="max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-blue-50 transition-colors ${selectedCountry.code === country.code ? 'bg-blue-50/50' : ''
                        }`}
                    >
                      <span className="text-lg">{country.flag}</span>
                      <span className="flex-1 text-xs font-semibold text-slate-700">{country.name}</span>
                      <span className="text-xs font-bold text-slate-400 font-mono">{country.dialCode}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-xs text-slate-500 text-center">No countries found</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          ref={inputRef}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          onKeyDown={handleKeyDown}
          placeholder="123 456 7890"
          required={required}
          disabled={disabled}
          className="flex-1 bg-transparent border-none p-0 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:outline-none h-full"
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-xs font-bold text-red-600 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-600"></span>
          {error}
        </p>
      )}

    </div>
  );
};

export default CountryCodePhoneInput;
