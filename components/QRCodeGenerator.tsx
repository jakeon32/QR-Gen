
import React, { useState, useCallback } from 'react';
import type { FC } from 'react';
import QRCode from 'qrcode';
import Spinner from './Spinner';
import DownloadIcon from './icons/DownloadIcon';

const QRCodeGenerator: FC = () => {
  const [text, setText] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text or a URL.');
      setQrCodeUrl('');
      return;
    }

    setIsLoading(true);
    setError(null);
    setQrCodeUrl('');

    try {
      // Wait for a bit to make the loading animation noticeable and feel responsive
      await new Promise(resolve => setTimeout(resolve, 300));

      const url = await QRCode.toDataURL(text, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000FF',
          light: '#FFFFFFFF',
        },
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error(err);
      setError('Failed to generate QR code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [text]);

  const handleDownloadPNG = useCallback(() => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [qrCodeUrl]);

  const handleDownloadSVG = useCallback(async () => {
    if (!text.trim()) return;

    try {
        const svgString = await QRCode.toString(text, {
            type: 'svg',
            width: 400,
            margin: 2,
            color: {
                dark: '#000000FF',
                light: '#FFFFFFFF',
            },
        });
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'qrcode.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error(err);
        setError('Failed to generate SVG. Please try again.');
    }
  }, [text]);
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleGenerate();
    }
  };


  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-6 w-full max-w-md">
      <div className="flex flex-col gap-4">
        <label htmlFor="qr-text" className="text-slate-300 font-medium">
          Enter Text or URL
        </label>
        <textarea
          id="qr-text"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., https://www.google.com"
          className="w-full p-3 bg-slate-900 border border-slate-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-slate-100 placeholder-slate-500 resize-none"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 disabled:bg-indigo-500/50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Spinner className="h-5 w-5 mr-3" />
              Generating...
            </>
          ) : (
            'Generate QR Code'
          )}
        </button>
      </div>

      {(error || isLoading || qrCodeUrl) && (
        <div className="mt-6 pt-6 border-t border-slate-700">
          {isLoading && (
            <div className="flex justify-center items-center flex-col text-slate-400">
              <Spinner className="h-8 w-8" />
              <p className="mt-2">Creating your QR code...</p>
            </div>
          )}
          {error && <p className="text-center text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
          {qrCodeUrl && (
            <div className="flex flex-col items-center gap-4 animate-fade-in">
              <p className="text-slate-300 font-medium">Your QR Code:</p>
              <div className="bg-white p-2 rounded-lg shadow-md">
                <img src={qrCodeUrl} alt="Generated QR Code" className="w-64 h-64" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-2">
                <button
                  onClick={handleDownloadPNG}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md text-slate-200 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition-colors duration-200"
                >
                  <DownloadIcon className="h-5 w-5 mr-2" />
                  Download PNG
                </button>
                 <button
                  onClick={handleDownloadSVG}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md text-slate-200 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition-colors duration-200"
                >
                  <DownloadIcon className="h-5 w-5 mr-2" />
                  Download SVG
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;