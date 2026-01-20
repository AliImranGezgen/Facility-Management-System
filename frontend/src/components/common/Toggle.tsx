interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: () => void;
}

export const Toggle = ({ label, checked, onChange }: ToggleProps) => {
    return (
        <div className="flex items-center cursor-pointer" onClick={onChange}>
            {/* Anahtarın Gövdesi */}
            <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${checked ? 'bg-brand-blue' : 'bg-gray-600'}`}>
                {/* Yuvarlak Buton */}
                <div 
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} 
                />
            </div>
            <span className="ml-3 text-sm font-medium text-gray-300 select-none">
                {label}
            </span>
        </div>
    );
};