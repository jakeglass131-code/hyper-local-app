import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

// Icons
const Camera = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>;
const AlertCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;


interface QRScannerProps {
    onScan: (decodedText: string) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const mountedRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true;

        // Check if we are in a secure context (HTTPS or localhost)
        if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
            setError("Camera access requires a secure connection (HTTPS). Please use a secure URL.");
        }

        return () => {
            mountedRef.current = false;
            cleanupScanner();
        };
    }, []);

    const cleanupScanner = async () => {
        if (scannerRef.current) {
            try {
                if (scannerRef.current.isScanning) {
                    await scannerRef.current.stop();
                }
                scannerRef.current.clear();
            } catch (err) {
                console.error("Failed to stop scanner:", err);
            }
            scannerRef.current = null;
            setIsScanning(false);
        }
    };

    const startScanner = async () => {
        setError(null);
        await cleanupScanner(); // Ensure previous scanner is cleaned up

        // Ensure element exists
        const element = document.getElementById("reader-custom");
        if (!element) {
            setError("Scanner element not found. Please refresh.");
            return;
        }

        try {
            const html5QrCode = new Html5Qrcode("reader-custom");
            scannerRef.current = html5QrCode;

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
            };

            await html5QrCode.start(
                { facingMode: "environment" },
                config,
                (decodedText) => {
                    if (mountedRef.current && decodedText) {
                        onScan(decodedText);
                    }
                },
                (errorMessage) => {
                    // Ignore parse errors, they are common while scanning
                }
            );

            if (mountedRef.current) {
                setIsScanning(true);
                setCameraPermission(true);
            }
        } catch (err: any) {
            console.error("Error starting scanner:", err);
            if (mountedRef.current) {
                setIsScanning(false);
                setCameraPermission(false);
                setError(`Failed to start camera: ${err.message || err}`);
            }
        }
    };



    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4">
            <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden shadow-lg mb-4">
                <div id="reader-custom" className="w-full h-full"></div>

                {!isScanning && !error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
                        <button
                            onClick={startScanner}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition-transform hover:scale-105 flex items-center gap-2"
                        >
                            <Camera className="w-5 h-5" />
                            Start Camera
                        </button>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-20 p-6 text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
                        <p className="text-white font-medium mb-4">{error}</p>
                        <button
                            onClick={startScanner}
                            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Overlay Guide */}
                {isScanning && (
                    <div className="absolute inset-0 pointer-events-none border-2 border-white/30 rounded-lg">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-indigo-500 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"></div>
                    </div>
                )}
            </div>
        </div>
    );
}
