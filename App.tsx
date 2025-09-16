
import React from 'react';
import QRCodeGenerator from './components/QRCodeGenerator';
import QrCodeIcon from './components/icons/QrCodeIcon';

const App: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-slate-900 p-4">
      <div className="w-full max-w-md mx-auto">
        <header className="flex items-center justify-center mb-6">
          <QrCodeIcon className="h-10 w-10 text-indigo-400" />
          <h1 className="ml-3 text-3xl font-bold tracking-tight text-slate-100">
            QR Code Generator
          </h1>
        </header>
        <main>
          <QRCodeGenerator />
        </main>
      </div>
       <footer className="text-center py-8 text-slate-500 mt-auto">
          <p>Create and share QR codes with ease.</p>
        </footer>
    </div>
  );
};

export default App;
