import { SelfAppBuilder, SelfQRcode } from '@selfxyz/qrcode';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
const userId = uuidv4();

const selfApp = new SelfAppBuilder({
    appName: "NexPager",
    scope: "nexpager",
    endpoint: "https://myapp.com/api/verify",
    logoBase64: "<base64EncodedLogo>", 
    userId,
    disclosures: {
        // DG1 disclosures
        issuing_state: true,
        name: true,
        nationality: true,
        date_of_birth: true,
        passport_number: true,
        gender: true,
        expiry_date: true,
        // Custom verification rules
        minimumAge: 18,
        excludedCountries: ["IRN", "PRK"],
        ofac: true,
    },
}).build();



const Self: React.FC = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
            <div className="text-center p-8 rounded-lg backdrop-blur-sm bg-black/30 shadow-xl border border-gray-700 animated-border">
                <div className="mb-6 fadeIn">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 pulse-bg">
                    NeX VERIFY
                </h1>
                <div className="mt-2 flex justify-center">
                    <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-purple-600 rounded expandWidth"></div>
                </div>
                <p className="text-gray-300 mt-3 fadeIn opacity-80">Scan the QR code with your SELF app</p>
                </div>
                
                <div className="flex justify-center">
                <SelfQRcode
                    selfApp={selfApp}
                    onSuccess={() => {
                    console.log('Verification successful');
                    // Perform actions after successful verification
                    navigate('/home');
                    }}
                    darkMode={true}
                    size={300}
                />
                </div>
                
                <div className="mt-6 fadeIn">
                <p className="text-sm text-gray-400 mb-2">Securely verify your identity</p>
                <div className="flex justify-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-400 pulse-delay-1"></div>
                    <div className="h-2 w-2 rounded-full bg-indigo-400 pulse-delay-2"></div>
                    <div className="h-2 w-2 rounded-full bg-purple-400 pulse-delay-3"></div>
                </div>
                </div>
            </div>
            </div>
            
            {/* Skip button at bottom right */}
            <button 
            onClick={() => navigate('/home')}
            className="fixed bottom-6 right-6 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg 
                   border border-gray-600 hover:bg-gray-700 transition-all shadow-lg fadeIn"
            >
            Skip <span className="text-xs opacity-70">(for demo purpose)</span>
            </button>
            
            <style>
            {`
                @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
                }
                @keyframes expandWidth {
                from { width: 0; }
                to { width: 8rem; }
                }
                @keyframes pulse {
                0% { opacity: 0.7; }
                50% { opacity: 1; }
                100% { opacity: 0.7; }
                }
                @keyframes borderGlow {
                0% { box-shadow: 0 0 5px rgba(74, 109, 255, 0.4), 0 0 0px rgba(138, 43, 226, 0.4); border-color: rgba(74, 109, 255, 0.6); }
                50% { box-shadow: 0 0 20px rgba(74, 109, 255, 0.6), 0 0 10px rgba(138, 43, 226, 0.6); border-color: rgba(138, 43, 226, 0.8); }
                100% { box-shadow: 0 0 5px rgba(74, 109, 255, 0.4), 0 0 0px rgba(138, 43, 226, 0.4); border-color: rgba(74, 109, 255, 0.6); }
                }
                .fadeIn {
                animation: fadeIn 1.5s ease-in-out;
                }
                .expandWidth {
                animation: expandWidth 2s ease-out forwards;
                }
                .pulse-bg {
                animation: pulse 3s ease-in-out infinite;
                }
                .animated-border {
                border: 1px solid rgba(74, 109, 255, 0.6);
                animation: borderGlow 3s ease-in-out infinite;
                }
                .pulse-delay-1 {
                animation: pulse 2s ease-in-out infinite;
                }
                .pulse-delay-2 {
                animation: pulse 2s ease-in-out infinite 0.6s;
                }
                .pulse-delay-3 {
                animation: pulse 2s ease-in-out infinite 1.2s;
                }
            `}
            </style>
        </>
    );
}


export default Self;

                