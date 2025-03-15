import { SelfAppBuilder, SelfQRcode } from '@selfxyz/qrcode';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

// Generate a unique user ID
const userId = uuidv4();

// Create a SelfApp instance using the builder pattern
const selfApp = new SelfAppBuilder({
    appName: "My App",
    scope: "my-app-scope",
    endpoint: "https://myapp.com/api/verify",
    logoBase64: "<base64EncodedLogo>", // Optional
    userId,
    // Optional disclosure requirements
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
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-6 glow-text">QR Code Verification</h1>
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
        </div>
    );
}


export default Self;