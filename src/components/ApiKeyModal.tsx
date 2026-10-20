'use client';

import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Cloud, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { AIConfig, LLMProvider } from '../types';
import { saveAIConfig } from '../lib/storage';
import { 
  AVAILABLE_LOCAL_MODELS, 
  isWebGPUSupported, 
  loadWebLLMModel,
  testOllamaConnection 
} from '../lib/localLLM';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIConfig;
  onUpdateConfig: (newConfig: AIConfig) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig
}) => {
  const [provider, setProvider] = useState<LLMProvider>(config.provider || 'webgpu');
  const [selectedLocalModel, setSelectedLocalModel] = useState(
    config.selectedLocalModel || 'SmolLM2-360M-Instruct-q4f16_1-MLC'
  );
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [geminiModel, setGeminiModel] = useState(config.model || 'gemini-2.0-flash');
  const [ollamaEndpoint, setOllamaEndpoint] = useState(config.ollamaEndpoint || 'http://localhost:11434');
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);

  // WebGPU check state
  const [hasWebGPU, setHasWebGPU] = useState<boolean | null>(null);
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState<{ text: string; ratio: number } | null>(null);

  // Status diagnostics
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    isWebGPUSupported().then(setHasWebGPU);
  }, []);

  if (!isOpen) return null;

  const handlePreloadWebLLM = async () => {
    setIsPreloading(true);
    setTestStatus('testing');
    try {
      await loadWebLLMModel(selectedLocalModel, (text, ratio) => {
        setPreloadProgress({ text, ratio });
      });
      setTestStatus('success');
      setTestMessage(`Model ${selectedLocalModel} loaded and cached in browser memory!`);
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(err.message || 'WebGPU model download/init failed.');
    } finally {
      setIsPreloading(false);
    }
  };

  const handleTestOllama = async () => {
    setTestStatus('testing');
    const res = await testOllamaConnection(ollamaEndpoint);
    if (res.ok) {
      setTestStatus('success');
      setOllamaModels(res.models);
      setTestMessage(`Connected to Ollama! Found ${res.models.length} model(s): ${res.models.join(', ')}`);
    } else {
      setTestStatus('error');
      setTestMessage(res.error || 'Could not connect to Ollama server.');
    }
  };

  const handleSave = () => {
    const newConfig: AIConfig = {
      ...config,
      provider,
      apiKey: apiKey.trim(),
      model: geminiModel,
      selectedLocalModel,
      ollamaEndpoint: ollamaEndpoint.trim()
    };
    saveAIConfig(newConfig);
    onUpdateConfig(newConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-gradient-to-tr from-amber-500 to-indigo-600 text-white rounded-xl shadow-md">
              <Cpu className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">AI Engine & Model Architecture</h3>
              <p className="text-xs text-slate-400">Choose between 100% Offline Local LLMs or Cloud APIs.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            ✕
          </button>
        </div>

        {/* Provider Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-4 text-xs">
          <button
            type="button"
            onClick={() => { setProvider('webgpu'); setTestStatus('idle'); }}
            className={`py-2 px-2 rounded-lg font-semibold flex flex-col items-center gap-1 transition-all ${
              provider === 'webgpu'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Local WebGPU</span>
          </button>

          <button
            type="button"
            onClick={() => { setProvider('ollama'); setTestStatus('idle'); }}
            className={`py-2 px-2 rounded-lg font-semibold flex flex-col items-center gap-1 transition-all ${
              provider === 'ollama'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <HardDrive className="w-4 h-4 text-indigo-400" />
            <span>Ollama Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => { setProvider('offline_rag'); setTestStatus('idle'); }}
            className={`py-2 px-2 rounded-lg font-semibold flex flex-col items-center gap-1 transition-all ${
              provider === 'offline_rag'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SKIT Vault RAG</span>
          </button>

          <button
            type="button"
            onClick={() => { setProvider('gemini'); setTestStatus('idle'); }}
            className={`py-2 px-2 rounded-lg font-semibold flex flex-col items-center gap-1 transition-all ${
              provider === 'gemini'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Cloud className="w-4 h-4 text-sky-400" />
            <span>Gemini API</span>
          </button>
        </div>

        {/* Tab 1: WebGPU In-Browser Local LLM */}
        {provider === 'webgpu' && (
          <div className="space-y-3.5 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/30 flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" /> In-Browser Local LLM (Zero API, 100% Offline)
                </span>
                <p className="text-slate-400 mt-1 leading-relaxed text-[11px]">
                  Runs open-weights LLMs directly on your computer's GPU via WebGPU. Once downloaded, it caches in your browser and works completely offline with no WiFi!
                </p>
              </div>

              <div className="shrink-0 text-right">
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                  hasWebGPU 
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' 
                    : 'bg-rose-950 text-rose-400 border-rose-500/40'
                }`}>
                  {hasWebGPU ? 'WebGPU Supported' : 'WebGPU Disabled'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold mb-1 block">
                Select Local Open Model:
              </label>
              <select
                value={selectedLocalModel}
                onChange={(e) => setSelectedLocalModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
              >
                {AVAILABLE_LOCAL_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.size}) — {m.recommendedFor}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Card Description */}
            {(() => {
              const current = AVAILABLE_LOCAL_MODELS.find(m => m.id === selectedLocalModel);
              return current ? (
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                  <p className="font-semibold text-slate-300">{current.description}</p>
                  <p className="text-amber-400/90 mt-1">Recommended: {current.recommendedFor}</p>
                </div>
              ) : null;
            })()}

            {/* Preload / Download Button & Progress Bar */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handlePreloadWebLLM}
                disabled={isPreloading || !hasWebGPU}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
              >
                {isPreloading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Downloading & Caching Model...</span>
                  </>
                ) : (
                  <>
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>Download & Preload to Browser Cache</span>
                  </>
                )}
              </button>

              {preloadProgress && (
                <div className="mt-2.5 space-y-1">
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full transition-all duration-300"
                      style={{ width: `${Math.round(preloadProgress.ratio * 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono truncate">
                    {preloadProgress.text} ({Math.round(preloadProgress.ratio * 100)}%)
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Desktop Ollama */}
        {provider === 'ollama' && (
          <div className="space-y-3.5 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/30">
              <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-indigo-400" /> Desktop Ollama Server (Local Host)
              </span>
              <p className="text-slate-400 mt-1 leading-relaxed text-[11px]">
                Connects to Ollama running on your computer. You can run custom models, fine-tuned weights, or 7B/8B models with zero cloud APIs.
              </p>
            </div>

            <div>
              <label className="text-slate-300 font-semibold mb-1 block">
                Ollama Endpoint URL:
              </label>
              <input
                type="text"
                value={ollamaEndpoint}
                onChange={(e) => setOllamaEndpoint(e.target.value)}
                placeholder="http://localhost:11434"
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold mb-1 block">
                Model Name in Ollama:
              </label>
              <input
                type="text"
                value={selectedLocalModel}
                onChange={(e) => setSelectedLocalModel(e.target.value)}
                placeholder="e.g. llama3.2, qwen2.5:1.5b, mistral"
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="button"
              onClick={handleTestOllama}
              disabled={testStatus === 'testing'}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-lg font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
              <span>Detect Installed Ollama Models</span>
            </button>
          </div>
        )}

        {/* Tab 3: SKIT Vault RAG (Zero-download offline) */}
        {provider === 'offline_rag' && (
          <div className="space-y-3.5 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-2">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Built-in SKIT Academic Vault RAG
              </span>
              <p className="text-slate-300 leading-relaxed text-xs">
                Requires <strong>zero downloads</strong> and <strong>no external setup</strong>!
              </p>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Uses statistical keyword indexing, unit mapping, and pre-computed analytical solvers strictly grounded in the SKIT teacher notes, assignments, and RTU syllabus.
              </p>
            </div>
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>Active by default. Ready to work offline immediately.</span>
            </div>
          </div>
        )}

        {/* Tab 4: Cloud Gemini */}
        {provider === 'gemini' && (
          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-300 font-semibold">Google Gemini API Key</label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:text-sky-300 flex items-center gap-1 text-[11px] font-semibold"
                >
                  <span>Get Free Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Model Choice</label>
              <select
                value={geminiModel}
                onChange={(e) => setGeminiModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Fastest)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Balanced)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Math)</option>
              </select>
            </div>
          </div>
        )}

        {/* Diagnostic Status Message */}
        {testStatus === 'success' && (
          <div className="mt-3 p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{testMessage}</span>
          </div>
        )}
        {testStatus === 'error' && (
          <div className="mt-3 p-2.5 bg-rose-950/40 border border-rose-500/40 rounded-lg text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{testMessage}</span>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 mt-5 flex items-center justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20"
          >
            Apply & Save
          </button>
        </div>
      </div>
    </div>
  );
};
