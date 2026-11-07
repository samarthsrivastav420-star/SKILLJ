import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Sparkles, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Package, 
  HelpCircle,
  Layers,
  Copy,
  Check
} from 'lucide-react';

interface AppInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppInstallModal: React.FC<AppInstallModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'aab' | 'apk'>('pwa');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Show guide for Chrome / Safari
      alert("Mobile Chrome me upar 3 dots (⋮) par tap karein aur 'Install app' ya 'Add to Home screen' select karein!");
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-rose-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-rose-200 text-xs font-bold uppercase tracking-widest mb-1.5">
            <Sparkles className="w-4 h-4 text-rose-300" />
            <span>SKILLJ Android &amp; Web App Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            Install SKILLJ on Your Phone
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-md">
            Direct 1-Tap Mobile Install, .AAB Bundle Installer Guide, and Direct APK options.
          </p>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-5 bg-black/20 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('pwa')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'pwa'
                  ? 'bg-white text-red-600 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>1-Tap Instant Install</span>
              <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.2 rounded-full uppercase">Best</span>
            </button>
            <button
              onClick={() => setActiveTab('aab')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'aab'
                  ? 'bg-white text-red-600 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>.AAB Installer Fix</span>
            </button>
            <button
              onClick={() => setActiveTab('apk')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'apk'
                  ? 'bg-white text-red-600 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Direct APK Guide</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800 flex-1">
          {/* TAB 1: 1-TAP INSTANT PWA (BEST OPTION) */}
          {activeTab === 'pwa' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-950 text-base">Sabse Asaan Tarika: Direct Phone Me Install</h3>
                    <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                      Kisi bhi file download ya bundle ki zaroorat nahi hai. Ye app directly aapke phone ke home screen par SKILLJ ke red icon ke sath install ho jayegi aur bina browser URL bar ke poori full-screen native app ki tarah chalegi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Install Trigger Button */}
              <div className="text-center py-2">
                <button
                  onClick={handleInstallPWA}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-red-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer mx-auto"
                >
                  <Smartphone className="w-5 h-5" />
                  <span>{isInstalled ? 'App Is Already Installed!' : 'INSTALL SKILLJ ON PHONE NOW'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-slate-400 mt-2 font-medium">
                  Google Chrome Verified • Offline Capable • Zero Storage Load
                </p>
              </div>

              {/* How to install manually if button doesn't trigger prompt */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Agar Button Se Prompt Na Aaye To Kya Karein? (Manual 2-Step)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-red-600 block mb-1">Step 1:</span>
                    Mobile ke Chrome browser me top-right me <strong className="text-slate-900">3 dots (⋮)</strong> par tap karein.
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-red-600 block mb-1">Step 2:</span>
                    Menu me <strong className="text-slate-900">"Install app"</strong> ya <strong className="text-slate-900">"Add to Home screen"</strong> par tap karein. Done!
                  </div>
                </div>
              </div>

              {/* Share link button */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 text-xs">
                <span className="text-slate-600 truncate font-mono">{typeof window !== 'undefined' ? window.location.origin : ''}</span>
                <button
                  onClick={handleCopyUrl}
                  className="flex items-center gap-1 text-red-600 font-bold hover:underline shrink-0 ml-2 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied Link!' : 'Copy Website URL'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: AAB INSTALLER GUIDE */}
          {activeTab === 'aab' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-amber-950 text-sm sm:text-base">
                      Aapke Phone me `_SKILLJ_...aab` file kyu nahi khul rahi thi?
                    </h3>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                      <strong>.aab (Android App Bundle)</strong> file Google Play Store ke liye hoti hai. Android phones directly .aab file ko execute nahi kar sakte (isliye file par <span className="font-bold">"?"</span> bana aata hai). Isko phone par chalane ke liye ek free bundle installer chahiye hota hai.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Is .AAB File Ko Phone Par Install Karne Ke Steps:
                </h4>

                {/* Step 1 */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-900">Google Play Store se "App Bundle Installer" download karein:</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Ye free tool kisi bhi .aab file ko phone me direct install kar deta hai.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <a
                        href="https://play.google.com/store/apps/details?id=com.apkinstaller.apkinstaller"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open "App Bundle Installer" on Play Store</span>
                      </a>
                      <a
                        href="https://play.google.com/store/apps/details?id=com.aefyr.sai"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors border border-slate-300"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>SAI (Split APKs Installer)</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Installer App Kholein Aur "Select .AAB File" Chunein</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      App kholkar apne phone ke <strong>Downloads</strong> folder me jayein aur <span className="font-mono text-red-600 font-bold">_SKILLJ_20374195.aab</span> ko select karein.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">"Install" Dabayein</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Installer automatically .aab ko convert karke SKILLJ app ko aapke phone me install kar dega!
                    </p>
                  </div>
                </div>
              </div>

              {/* Note on Google Play Store */}
              <div className="p-3 rounded-xl bg-slate-100 text-xs text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Tip for Google Play Store:</strong> Agar aapko app ko Play Store par publish karna hai, to Google Play Console me yahi .aab file upload hoti hai!
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: DIRECT APK OPTION */}
          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-3">
                  <Download className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-blue-950 text-sm sm:text-base">
                      Agar direct 1-tap install hone wali .APK file chahiye:
                    </h3>
                    <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                      Android phones par bina kisi installer ke direct tap karke install karne ke liye <strong>.APK</strong> file chahiye hoti hai.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  PWABuilder se direct APK lene ka tarika:
                </h4>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <p className="font-bold text-slate-900">1. PWABuilder Android Packaging me:</p>
                  <p className="text-slate-600 leading-relaxed">
                    Jab aap PWABuilder.com par website ka link daalte hain aur <strong>"Package for Android"</strong> par click karte hain:
                  </p>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] space-y-1">
                    <p>• Options me <strong>"Signing Key"</strong> aur <strong>"Package Options"</strong> par click karein.</p>
                    <p>• Wahan <strong>"Test APK / Sideload APK"</strong> ka checkbox / download link hota hai.</p>
                    <p>• Wahan se aap direct <strong>.apk</strong> download kar sakte hain.</p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <p className="font-bold text-slate-900">2. Best Recommendation:</p>
                  <p className="text-slate-600 leading-relaxed">
                    PWABuilder ya APK download ki jagah Tab 1 me <strong className="text-red-600">"1-Tap Instant Install"</strong> use karein. Wo same native Android features (offline mode, push notifications, native icon, full-screen) bina kisi 27 MB file download ke provide karta hai!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">SKILLJ by UNIVERSE • Official Android PWA Engine</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
