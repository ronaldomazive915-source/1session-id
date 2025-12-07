// pages/pair.tsx
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function PairPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [pairingCode, setPairingCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // 1: input, 2: qr/code, 3: success
  const [method, setMethod] = useState<'qr' | 'code'>('qr');
  
  const qrRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to active section when step changes
    if (step === 2) {
      if (method === 'qr' && qrRef.current) {
        qrRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (method === 'code' && codeRef.current) {
        codeRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (step === 3) {
      // Scroll to success section
      setTimeout(() => {
        document.getElementById('success-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [step, method]);

  const validatePhoneNumber = (number: string): boolean => {
    const cleanNumber = number.replace(/[^\d+]/g, '');
    return cleanNumber.length >= 10 && cleanNumber.length <= 15;
  };

  const handlePairing = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number with country code (e.g., 15551234567)');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/pair?number=${encodeURIComponent(phoneNumber)}`);
      const data = await response.json();
      
      if (data.code) {
        if (data.code.includes('-')) {
          // This is a pairing code
          setPairingCode(data.code);
          setMethod('code');
        } else {
          // This is a QR code (would need QR generation)
          setQrCode(data.code);
          setMethod('qr');
        }
        setStep(2);
      } else {
        setError(data.error || 'Failed to generate pairing code. Please try again.');
      }
    } catch (err) {
      setError('Connection failed. Please check your internet and try again.');
    } finally {
      setLoading(false);
    }
  };

  const simulateSuccess = () => {
    // In real implementation, this would come from WebSocket or polling
    setSuccess('Session created successfully! Your Session ID has been sent to your WhatsApp.');
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Head>
        <title>Pair Your WhatsApp - RONY SKIES</title>
        <meta name="description" content="Pair your WhatsApp account with RONY SKIES bot" />
      </Head>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold text-white">RONY SKIES</span>
            </Link>
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Pair Your <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">WhatsApp</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connect your WhatsApp account to start using RONY SKI's powerful automation features.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                step >= 1 ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                1
              </div>
              <span className={`mt-2 text-sm ${step >= 1 ? 'text-white' : 'text-gray-500'}`}>Enter Number</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-700'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                step >= 2 ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                2
              </div>
              <span className={`mt-2 text-sm ${step >= 2 ? 'text-white' : 'text-gray-500'}`}>Authenticate</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-700'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                step >= 3 ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                3
              </div>
              <span className={`mt-2 text-sm ${step >= 3 ? 'text-white' : 'text-gray-500'}`}>Complete</span>
            </div>
          </div>
        </div>

        {/* Step 1: Phone Number Input */}
        {step === 1 && (
          <div className="max-w-md mx-auto">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
              <form onSubmit={handlePairing}>
                <div className="mb-6">
                  <label htmlFor="phone" className="block text-white font-semibold mb-3">
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="15551234567 (with country code)"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                  <p className="text-gray-400 text-sm mt-2">
                    Enter your full number with country code, without + or spaces
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !phoneNumber}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Generating Code...
                    </div>
                  ) : (
                    'Generate Pairing Code'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Step 2: Authentication Methods */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto">
            {/* Method Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 rounded-xl p-1">
                <button
                  onClick={() => setMethod('qr')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    method === 'qr' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  QR Code
                </button>
                <button
                  onClick={() => setMethod('code')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    method === 'code' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Pairing Code
                </button>
              </div>
            </div>

            {/* QR Code Section */}
            {method === 'qr' && (
              <div ref={qrRef} className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">Scan QR Code</h3>
                  <p className="text-gray-300 mb-6">
                    Open WhatsApp on your phone, go to Settings → Linked Devices → Link a Device, and scan this QR code.
                  </p>
                  
                  {/* QR Code Placeholder */}
                  <div className="bg-white p-8 rounded-xl inline-block max-w-sm mx-auto">
                    <div className="text-center text-gray-600">
                      <div className="text-4xl mb-4">📱</div>
                      <p>QR Code would be displayed here</p>
                      <p className="text-sm text-gray-500 mt-2">(In production, this would show the actual QR code)</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={simulateSuccess}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
                    >
                      I've Scanned the QR Code
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Pairing Code Section */}
            {method === 'code' && (
              <div ref={codeRef} className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">Use Pairing Code</h3>
                  <p className="text-gray-300 mb-6">
                    Open WhatsApp on your phone, go to Settings → Linked Devices → Link a Device, and enter this code.
                  </p>
                  
                  {/* Pairing Code Display */}
                  <div className="bg-black/30 border-2 border-dashed border-white/20 rounded-2xl p-8 mb-6">
                    <div className="text-4xl font-mono font-bold text-white tracking-widest">
                      {pairingCode}
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-6">
                    This code will expire in 20 seconds. Make sure to enter it quickly in your WhatsApp.
                  </p>

                  <div className="mt-6">
                    <button
                      onClick={simulateSuccess}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
                    >
                      I've Entered the Code
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div id="success-section" className="max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4">Pairing Successful! 🎉</h3>
              <p className="text-gray-300 text-lg mb-6">
                Your WhatsApp has been successfully paired with RONY SKIES!
              </p>

              <div className="bg-black/30 rounded-xl p-6 mb-6 text-left">
                <h4 className="text-white font-semibold mb-3">📨 Check Your WhatsApp</h4>
                <ul className="text-gray-300 space-y-2">
                  <li>• Your Session ID has been sent to your WhatsApp</li>
                  <li>• Save the Session ID for bot configuration</li>
                  <li>• Use: <code className="bg-white/10 px-2 py-1 rounded">SESSION_ID=your_number</code></li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105">
                  Back to Home
                </Link>
                <button className="border-2 border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-xl font-semibold transition-all">
                  Get Help
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}