import React, { useState, useEffect } from 'react';
import { Shield, FileCheck, Bell, Users, Building2, Clock, Mail, CheckCircle2, AlertTriangle, XCircle, Plus, Search, Upload, ChevronRight, Star, Zap, BarChart3, Lock, CreditCard, Menu, X, ArrowRight, Sparkles, Globe, FileText, Calendar, TrendingUp, Award, Check, Eye, RefreshCw, ExternalLink, AlertCircle, Loader2, ChevronDown, Settings, LogOut, User, Home, ClipboardCheck, Brain, DollarSign, Briefcase, Phone, MapPin, Hash, HardHat, Wrench, Hammer, Construction, Truck } from 'lucide-react';

const mockSubcontractors = [
  { id: 1, name: 'Mann Plumbing', trade: 'Plumbing', license: '941137', state: 'CA', licenseStatus: 'Active', licenseExpiry: '2027-11-30', licenseVerified: true, verifiedDate: '2024-12-01', glInsurance: { status: 'compliant', expiry: '2026-03-15', limit: '$1,000,000' }, wcInsurance: { status: 'compliant', expiry: '2026-01-20', limit: '$500,000' }, autoInsurance: { status: 'expiring', expiry: '2025-01-15', limit: '$1,000,000' }, additionalInsured: true, email: 'info@mannplumbing.com', phone: '(619) 535-1322', address: '771 Jamacha Road, El Cajon, CA 92019', riskScore: 85 },
  { id: 2, name: 'Pacific Electric Co', trade: 'Electrical', license: '876543', state: 'CA', licenseStatus: 'Active', licenseExpiry: '2026-08-15', licenseVerified: true, verifiedDate: '2024-11-15', glInsurance: { status: 'compliant', expiry: '2026-05-10', limit: '$2,000,000' }, wcInsurance: { status: 'non-compliant', expiry: '2024-12-01', limit: '$0' }, autoInsurance: { status: 'compliant', expiry: '2026-02-28', limit: '$1,000,000' }, additionalInsured: false, email: 'contact@pacificelectric.com', phone: '(858) 555-0123', address: '1234 Industrial Blvd, San Diego, CA 92101', riskScore: 45 },
  { id: 3, name: 'Island Concrete Hawaii', trade: 'Concrete', license: '30289', state: 'HI', licenseStatus: 'Active', licenseExpiry: '2025-06-30', licenseVerified: false, verifiedDate: null, glInsurance: { status: 'expiring', expiry: '2025-01-30', limit: '$1,000,000' }, wcInsurance: { status: 'compliant', expiry: '2025-09-15', limit: '$500,000' }, autoInsurance: { status: 'compliant', expiry: '2025-11-01', limit: '$500,000' }, additionalInsured: true, email: 'aloha@islandconcrete.com', phone: '(808) 555-4567', address: '456 Ala Moana Blvd, Honolulu, HI 96813', riskScore: 72 },
  { id: 4, name: 'Summit Roofing', trade: 'Roofing', license: '654321', state: 'CA', licenseStatus: 'Expired', licenseExpiry: '2024-11-30', licenseVerified: true, verifiedDate: '2024-10-01', glInsurance: { status: 'non-compliant', expiry: '2024-10-15', limit: '$0' }, wcInsurance: { status: 'non-compliant', expiry: '2024-10-15', limit: '$0' }, autoInsurance: { status: 'non-compliant', expiry: '2024-10-15', limit: '$0' }, additionalInsured: false, email: 'info@summitroofing.com', phone: '(760) 555-7890', address: '789 Mountain View Dr, Escondido, CA 92025', riskScore: 12 },
  { id: 5, name: 'Precision HVAC', trade: 'HVAC', license: '789012', state: 'CA', licenseStatus: 'Active', licenseExpiry: '2026-04-15', licenseVerified: true, verifiedDate: '2024-12-10', glInsurance: { status: 'compliant', expiry: '2025-12-01', limit: '$1,000,000' }, wcInsurance: { status: 'compliant', expiry: '2025-11-15', limit: '$500,000' }, autoInsurance: { status: 'compliant', expiry: '2025-10-20', limit: '$1,000,000' }, additionalInsured: true, email: 'service@precisionhvac.com', phone: '(619) 555-2345', address: '321 Climate Way, La Mesa, CA 91942', riskScore: 92 },
];

const StatusBadge = ({ status, size = 'sm' }) => {
  const styles = {
    compliant: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    expiring: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    'non-compliant': 'bg-red-500/10 text-red-600 border-red-500/20',
    Active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    Expired: 'bg-red-500/10 text-red-600 border-red-500/20',
    pending: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  };
  const icons = { compliant: <CheckCircle2 size={12} />, expiring: <AlertTriangle size={12} />, 'non-compliant': <XCircle size={12} />, Active: <CheckCircle2 size={12} />, Expired: <XCircle size={12} />, pending: <Clock size={12} /> };
  const labels = { compliant: 'Compliant', expiring: 'Expiring', 'non-compliant': 'Missing', Active: 'Active', Expired: 'Expired', pending: 'Pending' };
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}>{icons[status]} {labels[status] || status}</span>;
};

const RiskMeter = ({ score }) => {
  const color = score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';
  const textColor = score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-600';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-bold ${textColor}`}>{score}</span>
    </div>
  );
};

// Stripe Checkout Modal
const CheckoutModal = ({ plan, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setStep(2);
    setLoading(false);
    setTimeout(() => onSuccess(), 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10"><X size={24} /></button>
        {step === 1 ? (
          <>
            <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><CreditCard className="text-white" size={24} /></div>
                  <div>
                    <div className="text-white/80 text-sm">Subscribe to</div>
                    <div className="text-white font-bold text-xl">{plan.name} Plan</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white text-4xl font-bold">${plan.price}</div>
                  <div className="text-white/80 text-sm">/month</div>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Card Number</label>
                <div className="relative">
                  <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())} maxLength={19} className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" placeholder="4242 4242 4242 4242" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    <div className="w-8 h-5 bg-gradient-to-r from-orange-500 to-amber-500 rounded text-white text-[8px] font-bold flex items-center justify-center">VISA</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-2">Expiry</label><input type="text" value={expiry} onChange={e => setExpiry(e.target.value)} maxLength={5} className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="MM/YY" /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-2">CVC</label><input type="text" value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, ''))} maxLength={3} className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="123" /></div>
              </div>
              
              <div className="bg-amber-50 rounded-xl p-4 space-y-2 border border-amber-200">
                <div className="flex justify-between text-sm"><span className="text-slate-600">{plan.name} Plan (Monthly)</span><span className="font-semibold">${plan.price}.00</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-600">14-day free trial</span><span className="font-semibold text-emerald-600">-${plan.price}.00</span></div>
                <div className="border-t border-amber-300 pt-2 flex justify-between"><span className="font-bold text-slate-900">Due today</span><span className="font-bold text-2xl text-emerald-600">$0.00</span></div>
              </div>
              
              <button onClick={handlePayment} disabled={loading || cardNumber.length < 19} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-orange-500/30 transition disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : <>Start Free Trial <Lock size={18} /></>}
              </button>
              <p className="text-center text-xs text-slate-500">🔒 Secured by Stripe. Cancel anytime during trial.</p>
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle2 className="text-emerald-600" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome to SubCompliance Pro!</h3>
            <p className="text-slate-600">Your 14-day free trial is active. Let's get building! 🏗️</p>
          </div>
        )}
      </div>
    </div>
  );
};

// AI Analysis Panel
const AIAnalysisPanel = ({ subs, onClose }) => {
  const [analyzing, setAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          setResults({
            overallScore: 68,
            critical: 2,
            warnings: 3,
            suggestions: 2,
            findings: [
              { type: 'critical', title: 'Summit Roofing - BLOCK FROM ALL SITES', desc: 'License expired, all insurance policies lapsed. High liability risk.', action: 'Remove from active projects' },
              { type: 'critical', title: 'Pacific Electric Co - Workers Comp Missing', desc: 'WC insurance expired Dec 1, 2024. Cannot work on CA job sites.', action: 'Request updated COI' },
              { type: 'warning', title: 'Mann Plumbing - Auto Insurance Expiring', desc: 'Expires Jan 15, 2025 (30 days). Send renewal reminder.', action: 'Send reminder' },
              { type: 'warning', title: 'Island Concrete - License Unverified', desc: 'HI license #30289 not verified in 90+ days.', action: 'Verify now' },
              { type: 'warning', title: 'Pacific Electric - Missing Additional Insured', desc: 'Your company not listed on GL policy.', action: 'Request endorsement' },
              { type: 'info', title: 'Island Concrete - GL Expiring Soon', desc: 'General Liability expires Jan 30, 2025.', action: 'Schedule reminder' },
            ],
            recommendations: ['Implement 60-day advance renewal reminders', 'Require Additional Insured from all subs', 'Schedule weekly license verification checks', 'Remove Summit Roofing until compliant']
          });
          return 100;
        }
        return p + 3;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><Brain className="text-white" size={24} /></div>
              <div>
                <h2 className="text-xl font-bold text-white">AI Compliance Analysis</h2>
                <p className="text-white/80 text-sm">Scanning {subs.length} subcontractors</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white"><X size={24} /></button>
          </div>
        </div>

        {analyzing ? (
          <div className="p-12 text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-32 h-32 -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#fed7aa" strokeWidth="8" fill="none" />
                <circle cx="64" cy="64" r="56" stroke="url(#orangeGrad)" strokeWidth="8" fill="none" strokeDasharray={352} strokeDashoffset={352 - (352 * progress / 100)} strokeLinecap="round" />
                <defs><linearGradient id="orangeGrad"><stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#eab308" /></linearGradient></defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-slate-900">{progress}%</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Analyzing Compliance Data...</h3>
            <p className="text-slate-500">Checking licenses, COIs, and coverage requirements</p>
          </div>
        ) : (
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl p-4 text-center border border-slate-200">
                <div className="text-3xl font-bold text-slate-900">{results.overallScore}</div>
                <div className="text-sm text-slate-500 font-medium">Risk Score</div>
              </div>
              <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl p-4 text-center border border-red-200">
                <div className="text-3xl font-bold text-red-600">{results.critical}</div>
                <div className="text-sm text-red-600 font-medium">Critical</div>
              </div>
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-4 text-center border border-amber-200">
                <div className="text-3xl font-bold text-amber-600">{results.warnings}</div>
                <div className="text-sm text-amber-600 font-medium">Warnings</div>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl p-4 text-center border border-orange-200">
                <div className="text-3xl font-bold text-orange-600">{results.suggestions}</div>
                <div className="text-sm text-orange-600 font-medium">Info</div>
              </div>
            </div>

            <div className="space-y-3">
              {results.findings.map((f, i) => (
                <div key={i} className={`p-4 rounded-xl border ${f.type === 'critical' ? 'bg-red-50 border-red-200' : f.type === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-orange-50 border-orange-200'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {f.type === 'critical' ? <XCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} /> : f.type === 'warning' ? <AlertTriangle className="text-amber-600 mt-0.5 flex-shrink-0" size={20} /> : <AlertCircle className="text-orange-600 mt-0.5 flex-shrink-0" size={20} />}
                      <div>
                        <div className={`font-bold ${f.type === 'critical' ? 'text-red-900' : f.type === 'warning' ? 'text-amber-900' : 'text-orange-900'}`}>{f.title}</div>
                        <div className={`text-sm mt-1 ${f.type === 'critical' ? 'text-red-700' : f.type === 'warning' ? 'text-amber-700' : 'text-orange-700'}`}>{f.desc}</div>
                      </div>
                    </div>
                    <button className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${f.type === 'critical' ? 'bg-red-600 text-white' : f.type === 'warning' ? 'bg-amber-500 text-white' : 'bg-orange-500 text-white'}`}>{f.action}</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-orange-100 to-amber-50 rounded-xl p-5 border border-orange-200">
              <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2"><Sparkles size={18} /> AI Recommendations</h4>
              <ul className="space-y-2">
                {results.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-orange-800"><Check className="text-orange-600 mt-0.5 flex-shrink-0" size={16} /> {r}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Manual Verification Section
const ManualVerificationSection = ({ subs }) => {
  const [verifying, setVerifying] = useState(null);
  const [licenseInput, setLicenseInput] = useState('');
  const [stateInput, setStateInput] = useState('CA');
  const [manualResult, setManualResult] = useState(null);

  const runVerification = async (sub) => {
    setVerifying(sub.id);
    await new Promise(r => setTimeout(r, 2000));
    setManualResult({
      subId: sub.id,
      success: sub.licenseStatus === 'Active',
      data: { businessName: sub.name.toUpperCase(), licenseNumber: sub.license, status: sub.licenseStatus, issueDate: '12/17/2009', expiryDate: sub.licenseExpiry, classifications: ['C-36 Plumbing', 'C-42 Sanitation'], bondAmount: '$25,000', workersComp: sub.wcInsurance.status === 'compliant' ? 'Current' : 'Not on file' }
    });
    setVerifying(null);
  };

  const runManualSearch = async () => {
    if (!licenseInput) return;
    setVerifying('manual');
    await new Promise(r => setTimeout(r, 2000));
    setManualResult({
      subId: 'manual',
      success: true,
      data: { businessName: 'ABC CONSTRUCTION INC', licenseNumber: licenseInput, status: 'Active', issueDate: '05/22/2018', expiryDate: '05/31/2026', classifications: ['B - General Building Contractor'], bondAmount: '$25,000', workersComp: 'Exempt' }
    });
    setVerifying(null);
  };

  const unverifiedSubs = subs.filter(s => !s.licenseVerified);

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Manual Verification</h2><p className="text-slate-500">Verify contractor licenses directly from state databases</p></div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Search size={20} className="text-orange-600" /> License Lookup</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">License Number</label>
            <input type="text" value={licenseInput} onChange={e => setLicenseInput(e.target.value)} className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white" placeholder="e.g., 941137" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
            <select value={stateInput} onChange={e => setStateInput(e.target.value)} className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white">
              <option value="CA">California (CSLB)</option>
              <option value="HI">Hawaii (DCCA)</option>
              <option value="ID">Idaho</option>
              <option value="AZ">Arizona (ROC)</option>
              <option value="NV">Nevada</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={runManualSearch} disabled={verifying === 'manual' || !licenseInput} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
              {verifying === 'manual' ? <><Loader2 className="animate-spin" size={18} /> Checking...</> : <><ExternalLink size={18} /> Verify</>}
            </button>
          </div>
        </div>
        <p className="text-xs text-amber-700 mt-3 font-medium">🔗 Connects to: CA CSLB, Hawaii DCCA, Arizona ROC + 47 more state databases</p>
      </div>

      {manualResult && (
        <div className={`rounded-2xl p-6 border-2 ${manualResult.success ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {manualResult.success ? <CheckCircle2 className="text-emerald-600" size={28} /> : <XCircle className="text-red-600" size={28} />}
              <div>
                <h4 className={`font-bold text-lg ${manualResult.success ? 'text-emerald-900' : 'text-red-900'}`}>{manualResult.success ? '✓ License Verified' : '✗ Verification Failed'}</h4>
                <p className={`text-sm ${manualResult.success ? 'text-emerald-700' : 'text-red-700'}`}>Data from state database</p>
              </div>
            </div>
            <button onClick={() => setManualResult(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-3">
            {Object.entries(manualResult.data).map(([key, value]) => (
              <div key={key} className="bg-white/70 rounded-xl p-3 border border-white">
                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div className="font-semibold text-slate-900 mt-1">{Array.isArray(value) ? value.join(', ') : value}</div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-3 mt-4">
            <button className="flex-1 bg-white text-slate-700 py-2.5 rounded-xl font-semibold border-2 border-slate-300 hover:bg-slate-50">Save to Records</button>
            <button className="flex-1 bg-orange-500 text-white py-2.5 rounded-xl font-semibold hover:bg-orange-600">Add as Subcontractor</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <h3 className="font-bold text-slate-900 flex items-center gap-2"><Clock size={20} className="text-amber-600" /> Pending Verifications ({unverifiedSubs.length})</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {unverifiedSubs.length === 0 ? (
            <div className="p-8 text-center"><CheckCircle2 className="mx-auto mb-2 text-emerald-500" size={40} /><p className="text-slate-600 font-medium">All subcontractors verified! 🎉</p></div>
          ) : (
            unverifiedSubs.map(sub => (
              <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-amber-50/50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center"><AlertTriangle className="text-amber-600" size={24} /></div>
                  <div>
                    <div className="font-semibold text-slate-900">{sub.name}</div>
                    <div className="text-sm text-slate-500">{sub.state} #{sub.license} • {sub.trade}</div>
                  </div>
                </div>
                <button onClick={() => runVerification(sub)} disabled={verifying === sub.id} className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2">
                  {verifying === sub.id ? <><Loader2 className="animate-spin" size={16} /> Verifying...</> : <><RefreshCw size={16} /> Verify</>}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 flex items-center gap-2"><CheckCircle2 size={20} className="text-emerald-600" /> Recently Verified</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {subs.filter(s => s.licenseVerified).slice(0, 4).map(sub => (
            <div key={sub.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center"><CheckCircle2 className="text-emerald-600" size={24} /></div>
                <div>
                  <div className="font-semibold text-slate-900">{sub.name}</div>
                  <div className="text-sm text-slate-500">{sub.state} #{sub.license} • Verified {sub.verifiedDate}</div>
                </div>
              </div>
              <StatusBadge status={sub.licenseStatus} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Landing Page
const LandingPage = ({ onStartDemo, onStartTrial }) => {
  const [mobileMenu, setMobileMenu] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <nav className="fixed w-full z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <HardHat className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-white">SubCompliance<span className="text-orange-400">Pro</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-400 hover:text-white transition font-medium">Features</a>
              <a href="#pricing" className="text-slate-400 hover:text-white transition font-medium">Pricing</a>
              <a href="#testimonials" className="text-slate-400 hover:text-white transition font-medium">Testimonials</a>
              <button onClick={onStartDemo} className="text-slate-300 hover:text-white transition font-medium">Live Demo</button>
              <button onClick={onStartDemo} className="bg-gradient-to-r from-orange-500 to-amber-400 text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/30 transition">
                Start Free Trial
              </button>
            </div>
            <button className="md:hidden text-white" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700 p-4 space-y-3">
            <a href="#features" className="block text-slate-300 py-2">Features</a>
            <a href="#pricing" className="block text-slate-300 py-2">Pricing</a>
            <button onClick={onStartDemo} className="block text-slate-300 py-2">Live Demo</button>
            <button onClick={onStartDemo} className="w-full bg-gradient-to-r from-orange-500 to-amber-400 text-white px-5 py-3 rounded-xl font-bold">Start Free Trial</button>
          </div>
        )}
      </nav>

      <section className="pt-28 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-orange-500/20 to-transparent rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-5 py-2 mb-8">
            <Zap className="text-orange-400" size={18} />
            <span className="text-orange-300 font-semibold">Built for General Contractors</span>
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tight">
            Stop Chasing Paperwork.<br />
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">Start Building.</span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Automate subcontractor license verification, COI tracking, and compliance management. 
            Protect your projects from legal and financial risks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button onClick={onStartDemo} className="group bg-gradient-to-r from-orange-500 to-amber-400 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2">
              <HardHat size={22} /> Try Demo - No Signup <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={onStartDemo} className="bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-slate-600 hover:bg-slate-700 hover:border-slate-500 transition flex items-center justify-center gap-2">
              <Eye size={20} /> Watch 2-Min Demo
            </button>
          </div>
          <p className="text-slate-500 text-sm flex items-center justify-center gap-6 flex-wrap">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> Instant access</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> Cancel anytime</span>
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            {[
              { value: '50K+', label: 'Subs Tracked', icon: <Users size={20} /> },
              { value: '98%', label: 'Compliance Rate', icon: <TrendingUp size={20} /> },
              { value: '40hrs', label: 'Saved Monthly', icon: <Clock size={20} /> },
              { value: '4.9★', label: 'Rating', icon: <Star size={20} /> },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 hover:bg-slate-800 hover:border-orange-500/50 transition group">
                <div className="text-orange-400 mb-2">{stat.icon}</div>
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Built for the Job Site</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Everything you need to manage subcontractor compliance across multiple states and projects.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Globe />, title: 'Multi-State License Verification', desc: 'Verify licenses across CA CSLB, Hawaii DCCA, and 48 other state databases instantly.' },
              { icon: <Brain />, title: 'AI-Powered COI Analysis', desc: 'Upload COIs and our AI extracts policy details, limits, and expiration dates automatically.' },
              { icon: <Bell />, title: 'Smart Expiration Alerts', desc: 'Get notified 60, 30, and 7 days before any license or insurance expires.' },
              { icon: <Mail />, title: 'Automated Email Collection', desc: 'AI sends personalized emails to subs requesting missing or expiring documents.' },
              { icon: <ClipboardCheck />, title: 'Manual Verification Tools', desc: 'Direct links to state databases. Verify any license and save results instantly.' },
              { icon: <BarChart3 />, title: 'Risk Scoring & Reports', desc: 'AI calculates risk scores for each sub. Generate audit-ready compliance reports.' },
            ].map((feature, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-orange-500/50 hover:bg-slate-800 transition group">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl flex items-center justify-center mb-5 text-orange-400 group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Simple, Honest Pricing</h2>
            <p className="text-slate-400 text-lg">No hidden fees. No contracts. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Starter', price: 49, subs: 25, features: ['Up to 25 subcontractors', 'License verification (2 states)', 'Basic COI tracking', 'Email alerts', 'Standard support'] },
              { name: 'Professional', price: 149, subs: 100, popular: true, features: ['Up to 100 subcontractors', 'All 50 state verification', 'AI COI analysis', 'Automated email collection', 'Project management', 'Risk scoring', 'Priority support'] },
              { name: 'Business', price: 349, subs: 500, features: ['Up to 500 subcontractors', 'Everything in Professional', 'Custom compliance rules', 'API access', 'Dedicated account manager', 'White-label options', 'SSO integration'] },
            ].map((plan, i) => (
              <div key={i} className={`relative bg-slate-800/50 border-2 rounded-3xl p-8 ${plan.popular ? 'border-orange-500 ring-4 ring-orange-500/20 scale-105' : 'border-slate-700'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-bold px-5 py-1.5 rounded-full shadow-lg">
                    ⭐ MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-black text-white">${plan.price}</span>
                  <span className="text-slate-400">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-slate-300">
                      <Check className="text-orange-400 flex-shrink-0" size={18} /> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => onStartTrial(plan)} className={`w-full py-3.5 rounded-xl font-bold transition ${plan.popular ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-white hover:shadow-lg hover:shadow-orange-500/30' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>
                  Start 14-Day Free Trial
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Trusted by Builders</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Ronda Chapman', company: 'Smith Brothers Construction', quote: 'We manage hundreds of subs across CA, Hawaii, and Idaho. SubCompliance Pro saves us 40+ hours per month. The AI is incredible!' },
              { name: 'Mike Rodriguez', company: 'Pacific Development Group', quote: 'The AI COI analysis catches coverage gaps we used to miss. Manual verification tools are perfect for quick spot checks.' },
              { name: 'Sarah Kim', company: 'Coastal Builders Inc', quote: 'Finally, one platform for licenses and insurance. Risk scoring helps us pick the right subs for each project.' },
            ].map((t, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:bg-slate-800 transition">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="text-amber-400 fill-amber-400" size={18} />)}</div>
                <p className="text-slate-300 mb-6 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-amber-400 rounded-full flex items-center justify-center text-white font-bold">{t.name[0]}</div>
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-slate-400 text-sm">{t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10" />
          <HardHat className="mx-auto text-white/80 mb-4" size={48} />
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 relative">Ready to Build Smarter?</h2>
          <p className="text-white/90 text-lg mb-8 relative">Join 2,000+ contractors who've eliminated compliance headaches.</p>
          <button onClick={onStartDemo} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition relative">
            Try Demo Now - No Signup Required
          </button>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <HardHat className="text-orange-400" size={24} />
            <span className="text-white font-bold">SubCompliance Pro</span>
          </div>
          <div className="flex gap-8 text-slate-400 text-sm">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
          <div className="text-slate-500 text-sm">© 2025 SubCompliance Pro</div>
        </div>
      </footer>
    </div>
  );
};

// Dashboard
const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subs, setSubs] = useState(mockSubcontractors);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [search, setSearch] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const stats = {
    total: subs.length,
    compliant: subs.filter(s => s.licenseStatus === 'Active' && s.glInsurance.status === 'compliant' && s.wcInsurance.status === 'compliant').length,
    expiring: subs.filter(s => s.glInsurance.status === 'expiring' || s.wcInsurance.status === 'expiring' || s.autoInsurance.status === 'expiring').length,
    nonCompliant: subs.filter(s => s.licenseStatus === 'Expired' || s.glInsurance.status === 'non-compliant' || s.wcInsurance.status === 'non-compliant').length,
  };

  const filteredSubs = subs.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.trade.toLowerCase().includes(search.toLowerCase()));
  const sendEmail = (sub, type) => alert(`✅ Email sent to ${sub.email} requesting ${type}`);

  const navItems = [
    { id: 'dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { id: 'subcontractors', icon: <Users size={20} />, label: 'Subcontractors' },
    { id: 'verification', icon: <ClipboardCheck size={20} />, label: 'Verification' },
    { id: 'projects', icon: <Building2 size={20} />, label: 'Projects' },
    { id: 'alerts', icon: <Bell size={20} />, label: 'Alerts', badge: stats.expiring + stats.nonCompliant },
    { id: 'reports', icon: <FileText size={20} />, label: 'Reports' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center">
              <HardHat className="text-white" size={22} />
            </div>
            <span className="text-lg font-bold text-white">SubCompliance</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === item.id ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              {item.icon}
              <span className="font-medium">{item.label}</span>
              {item.badge > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="relative">
            <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 transition">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-full flex items-center justify-center text-white font-bold">{user.name[0]}</div>
              <div className="flex-1 text-left">
                <div className="text-white text-sm font-semibold truncate">{user.name}</div>
                <div className="text-slate-500 text-xs truncate">{user.email}</div>
              </div>
              <ChevronDown size={16} className="text-slate-500" />
            </button>
            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden">
                <button className="w-full flex items-center gap-2 px-4 py-3 text-slate-300 hover:bg-slate-700 text-sm"><Settings size={16} /> Settings</button>
                <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-slate-700 text-sm"><LogOut size={16} /> Exit Demo</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="ml-64 flex-1 p-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Welcome, {user.name.split(' ')[0]}! 👷</h1>
                <p className="text-slate-500">Here's your compliance overview</p>
              </div>
              <button onClick={() => setShowAIPanel(true)} className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-orange-500/25 transition">
                <Brain size={20} /> Run AI Analysis
              </button>
            </div>

            <div className="grid grid-cols-4 gap-5">
              {[
                { label: 'Total Subs', value: stats.total, bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-900', icon: <Users className="text-slate-500" /> },
                { label: 'Compliant', value: stats.compliant, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', icon: <CheckCircle2 className="text-emerald-500" /> },
                { label: 'Expiring Soon', value: stats.expiring, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', icon: <Clock className="text-amber-500" /> },
                { label: 'Non-Compliant', value: stats.nonCompliant, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', icon: <XCircle className="text-red-500" /> },
              ].map((stat, i) => (
                <div key={i} className={`${stat.bg} rounded-2xl p-6 border-2 ${stat.border}`}>
                  <div className="flex items-center justify-between mb-3">{stat.icon}</div>
                  <div className={`text-4xl font-black ${stat.text}`}>{stat.value}</div>
                  <div className="text-slate-500 text-sm font-medium mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border-2 border-amber-200 p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><AlertTriangle className="text-amber-500" size={22} /> Expiring Soon</h3>
                <div className="space-y-3">
                  {subs.filter(s => s.glInsurance.status === 'expiring' || s.autoInsurance.status === 'expiring').slice(0, 3).map(sub => (
                    <div key={sub.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <div>
                        <div className="font-bold text-slate-900">{sub.name}</div>
                        <div className="text-sm text-amber-700">{sub.autoInsurance.status === 'expiring' ? `Auto expires ${sub.autoInsurance.expiry}` : `GL expires ${sub.glInsurance.expiry}`}</div>
                      </div>
                      <button onClick={() => sendEmail(sub, 'insurance renewal')} className="bg-amber-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 hover:bg-amber-600"><Mail size={16} /> Remind</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-red-200 p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><XCircle className="text-red-500" size={22} /> Critical Issues</h3>
                <div className="space-y-3">
                  {subs.filter(s => s.licenseStatus === 'Expired' || s.wcInsurance.status === 'non-compliant').slice(0, 3).map(sub => (
                    <div key={sub.id} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                      <div>
                        <div className="font-bold text-slate-900">{sub.name}</div>
                        <div className="text-sm text-red-700">{sub.licenseStatus === 'Expired' ? 'License Expired' : 'Workers Comp Missing'}</div>
                      </div>
                      <button onClick={() => sendEmail(sub, 'urgent compliance update')} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 hover:bg-red-600"><Mail size={16} /> Urgent</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4">Subcontractor Risk Overview</h3>
              <div className="space-y-3">
                {subs.slice(0, 5).map(sub => (
                  <div key={sub.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-orange-50 transition cursor-pointer" onClick={() => setSelectedSub(sub)}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${sub.riskScore >= 80 ? 'bg-emerald-500' : sub.riskScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}>{sub.name[0]}</div>
                      <div>
                        <div className="font-bold text-slate-900">{sub.name}</div>
                        <div className="text-sm text-slate-500">{sub.trade} • {sub.state}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-xs text-slate-500 font-medium">Risk Score</div>
                        <RiskMeter score={sub.riskScore} />
                      </div>
                      <ChevronRight className="text-slate-400" size={20} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subcontractors' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-black text-slate-900">Subcontractors</h1>
              <button onClick={() => setShowAddModal(true)} className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600"><Plus size={18} /> Add Subcontractor</button>
            </div>

            <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input type="text" placeholder="Search by name or trade..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b-2 border-slate-200">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">Subcontractor</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">License</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">GL</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">WC</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">Auto</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">Risk</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubs.map(sub => (
                      <tr key={sub.id} className="border-b border-slate-100 hover:bg-orange-50/50 transition cursor-pointer" onClick={() => setSelectedSub(sub)}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${sub.riskScore >= 80 ? 'bg-emerald-500' : sub.riskScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}>{sub.name[0]}</div>
                            <div>
                              <div className="font-bold text-slate-900">{sub.name}</div>
                              <div className="text-sm text-slate-500">{sub.trade}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-700 font-medium">{sub.state} #{sub.license}</div>
                          <StatusBadge status={sub.licenseStatus} />
                        </td>
                        <td className="px-6 py-4"><StatusBadge status={sub.glInsurance.status} /></td>
                        <td className="px-6 py-4"><StatusBadge status={sub.wcInsurance.status} /></td>
                        <td className="px-6 py-4"><StatusBadge status={sub.autoInsurance.status} /></td>
                        <td className="px-6 py-4"><RiskMeter score={sub.riskScore} /></td>
                        <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                          <button onClick={() => sendEmail(sub, 'document update')} className="text-orange-600 hover:text-orange-800 font-semibold text-sm">Email</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'verification' && <ManualVerificationSection subs={subs} />}

        {activeTab === 'projects' && (
          <div className="bg-white rounded-2xl p-16 text-center border-2 border-slate-200">
            <Building2 className="mx-auto text-slate-300 mb-4" size={64} />
            <h2 className="text-2xl font-black text-slate-900 mb-2">Project Management</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-6">Organize subs by project. Ensure compliance before work begins.</p>
            <button className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600">Create First Project</button>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-slate-900">Compliance Alerts</h1>
            <div className="space-y-4">
              {subs.filter(s => s.licenseStatus === 'Expired' || s.glInsurance.status === 'non-compliant' || s.wcInsurance.status === 'non-compliant' || s.autoInsurance.status === 'expiring').map(sub => (
                <div key={sub.id} className={`bg-white rounded-2xl border-2 p-5 flex justify-between items-center ${sub.licenseStatus === 'Expired' || sub.wcInsurance.status === 'non-compliant' ? 'border-red-300' : 'border-amber-300'}`}>
                  <div className="flex items-center gap-4">
                    {sub.licenseStatus === 'Expired' || sub.wcInsurance.status === 'non-compliant' ? <XCircle className="text-red-500" size={28} /> : <AlertTriangle className="text-amber-500" size={28} />}
                    <div>
                      <div className="font-bold text-slate-900 text-lg">{sub.name}</div>
                      <div className="text-sm text-slate-600">
                        {sub.licenseStatus === 'Expired' && '⚠️ License Expired • '}
                        {sub.wcInsurance.status === 'non-compliant' && '⚠️ Workers Comp Missing • '}
                        {sub.autoInsurance.status === 'expiring' && `⏰ Auto expires ${sub.autoInsurance.expiry}`}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => sendEmail(sub, 'urgent compliance update')} className={`px-5 py-2.5 rounded-xl font-bold ${sub.licenseStatus === 'Expired' || sub.wcInsurance.status === 'non-compliant' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-amber-500 text-white hover:bg-amber-600'}`}>
                    Send Request
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-2xl p-16 text-center border-2 border-slate-200">
            <FileText className="mx-auto text-slate-300 mb-4" size={64} />
            <h2 className="text-2xl font-black text-slate-900 mb-2">Compliance Reports</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-6">Generate audit-ready reports for stakeholders and inspectors.</p>
            <button className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600">Generate Report</button>
          </div>
        )}
      </div>

      {showAIPanel && <AIAnalysisPanel subs={subs} onClose={() => setShowAIPanel(false)} />}

      {selectedSub && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b-2 border-slate-200 flex justify-between items-center bg-gradient-to-r from-orange-50 to-amber-50">
              <div>
                <h2 className="text-xl font-black text-slate-900">{selectedSub.name}</h2>
                <p className="text-slate-500">{selectedSub.trade}</p>
              </div>
              <button onClick={() => setSelectedSub(null)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-5 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl border-2 border-orange-200">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-white text-2xl ${selectedSub.riskScore >= 80 ? 'bg-emerald-500' : selectedSub.riskScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}>{selectedSub.riskScore}</div>
                  <div>
                    <div className="font-bold text-slate-900 text-lg">Risk Score</div>
                    <div className="text-slate-600">{selectedSub.riskScore >= 80 ? '✅ Low Risk' : selectedSub.riskScore >= 50 ? '⚠️ Medium Risk' : '🚨 High Risk'}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200"><div className="text-xs text-slate-500 uppercase font-bold mb-1">Email</div><div className="font-semibold text-slate-900">{selectedSub.email}</div></div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200"><div className="text-xs text-slate-500 uppercase font-bold mb-1">Phone</div><div className="font-semibold text-slate-900">{selectedSub.phone}</div></div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 col-span-2"><div className="text-xs text-slate-500 uppercase font-bold mb-1">Address</div><div className="font-semibold text-slate-900">{selectedSub.address}</div></div>
              </div>
              
              <div>
                <h3 className="font-bold text-slate-900 mb-3">License</h3>
                <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-900">{selectedSub.state} #{selectedSub.license}</div>
                    <div className="text-sm text-slate-500">Expires: {selectedSub.licenseExpiry}</div>
                  </div>
                  <StatusBadge status={selectedSub.licenseStatus} />
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Insurance Coverage</h3>
                <div className="space-y-3">
                  {[
                    { label: 'General Liability', data: selectedSub.glInsurance },
                    { label: 'Workers Compensation', data: selectedSub.wcInsurance },
                    { label: 'Auto Insurance', data: selectedSub.autoInsurance },
                  ].map((ins, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <div className="font-bold text-slate-900">{ins.label}</div>
                        <div className="text-sm text-slate-500">Limit: {ins.data.limit} • Exp: {ins.data.expiry}</div>
                      </div>
                      <StatusBadge status={ins.data.status} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => sendEmail(selectedSub, 'all documents')} className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 flex items-center justify-center gap-2"><Mail size={18} /> Request Docs</button>
                <button className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300 flex items-center justify-center gap-2"><RefreshCw size={18} /> Verify License</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl">
            <div className="p-6 border-b-2 border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-900">Add Subcontractor</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Business Name *</label><input type="text" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="e.g., Mann Plumbing" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold text-slate-700 mb-2">State *</label><select className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500"><option>California</option><option>Hawaii</option><option>Idaho</option><option>Arizona</option></select></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">License # *</label><input type="text" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500" placeholder="941137" /></div>
              </div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Trade *</label><input type="text" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500" placeholder="e.g., Plumbing" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Email *</label><input type="email" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500" placeholder="contact@company.com" /></div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowAddModal(false)} className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300">Cancel</button>
                <button onClick={() => { setShowAddModal(false); alert('✅ Subcontractor added! License verification in progress...'); }} className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600">Add & Verify</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App
export default function App() {
  const [page, setPage] = useState('landing');
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [user, setUser] = useState(null);

  const startDemo = () => {
    setUser({ name: 'Demo User', email: 'demo@smithbros.com' });
    setPage('dashboard');
  };

  const startTrial = (plan) => {
    setCheckoutPlan(plan);
  };

  const handleCheckoutSuccess = () => {
    setUser({ name: 'Demo User', email: 'demo@smithbros.com' });
    setCheckoutPlan(null);
    setPage('dashboard');
  };

  if (user && page === 'dashboard') {
    return <Dashboard user={user} onLogout={() => { setUser(null); setPage('landing'); }} />;
  }

  return (
    <>
      <LandingPage onStartDemo={startDemo} onStartTrial={startTrial} />
      {checkoutPlan && <CheckoutModal plan={checkoutPlan} onClose={() => setCheckoutPlan(null)} onSuccess={handleCheckoutSuccess} />}
    </>
  );
}
