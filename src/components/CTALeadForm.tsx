
'use client';

import EnhancedContactForm from './EnhancedContactForm';

interface CTALeadFormProps {
    universityName: string;
}

const CTALeadForm = ({ universityName }: CTALeadFormProps) => {
    return (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-2">Apply to {universityName}</h3>
                <p className="text-blue-100 text-sm">
                    Get a free profile assessment and scholarship check today.
                </p>
            </div>

            <div className="p-6">
                <EnhancedContactForm
                    formType="application"
                    source={`university_page_${universityName.toLowerCase().replace(/\s+/g, '_')}`}
                    title=""
                    description=""
                    showCountry={false} // We know the country is China/University location
                    showProgram={true}
                    showMessage={true}
                    showLocation={false}
                    className="shadow-none"
                />

                <p className="text-xs text-slate-400 text-center mt-4">
                    By submitting this form, you agree to our privacy policy and allow our counselors to contact you.
                </p>
            </div>
        </div>
    );
};

export default CTALeadForm;
