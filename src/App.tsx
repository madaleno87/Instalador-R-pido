import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Monitor, Apple, Terminal, Check, Copy, Download, 
  Globe, Code, MessageSquare, Music, Wrench, Package,
  Settings, CheckSquare, Square, FileText, Archive, HardDrive, MonitorSmartphone
} from 'lucide-react';

type OS = 'windows' | 'macos' | 'linux';

interface AppDef {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  packages: {
    windows?: string;
    macos?: string;
    linux?: string;
  };
}

const APPS: AppDef[] = [
  { id: 'adobe-reader', name: 'Adobe Acrobat Reader', category: 'Produtividade', icon: FileText, packages: { windows: 'Adobe.Acrobat.Reader.64-bit', macos: 'adobe-acrobat-reader' } },
  { id: 'winrar', name: 'WinRAR', category: 'Utilitários', icon: Archive, packages: { windows: 'RARLab.WinRAR', linux: 'rar unrar' } },
  { id: 'synology-drive', name: 'Synology Drive Client', category: 'Nuvem e Backup', icon: HardDrive, packages: { windows: 'Synology.SynologyDriveClient', macos: 'synology-drive' } },
  { id: 'tightvnc', name: 'TightVNC', category: 'Acesso Remoto', icon: MonitorSmartphone, packages: { windows: 'TightVNC.TightVNC', linux: 'tightvncserver xtightvncviewer' } },

  { id: 'chrome', name: 'Google Chrome', category: 'Navegadores', icon: Globe, packages: { windows: 'Google.Chrome', macos: 'google-chrome', linux: 'google-chrome-stable' } },
  { id: 'firefox', name: 'Mozilla Firefox', category: 'Navegadores', icon: Globe, packages: { windows: 'Mozilla.Firefox', macos: 'firefox', linux: 'firefox' } },
  { id: 'brave', name: 'Brave Browser', category: 'Navegadores', icon: Globe, packages: { windows: 'Brave.Brave', macos: 'brave-browser', linux: 'brave-browser' } },
  
  { id: 'vscode', name: 'VS Code', category: 'Desenvolvimento', icon: Code, packages: { windows: 'Microsoft.VisualStudioCode', macos: 'visual-studio-code', linux: 'code' } },
  { id: 'git', name: 'Git', category: 'Desenvolvimento', icon: Code, packages: { windows: 'Git.Git', macos: 'git', linux: 'git' } },
  { id: 'nodejs', name: 'Node.js', category: 'Desenvolvimento', icon: Code, packages: { windows: 'OpenJS.NodeJS', macos: 'node', linux: 'nodejs' } },
  { id: 'docker', name: 'Docker Desktop', category: 'Desenvolvimento', icon: Package, packages: { windows: 'Docker.DockerDesktop', macos: 'docker', linux: 'docker-ce' } },
  { id: 'python', name: 'Python 3', category: 'Desenvolvimento', icon: Code, packages: { windows: 'Python.Python.3.11', macos: 'python', linux: 'python3' } },

  { id: 'discord', name: 'Discord', category: 'Comunicação', icon: MessageSquare, packages: { windows: 'Discord.Discord', macos: 'discord', linux: 'discord' } },
  { id: 'slack', name: 'Slack', category: 'Comunicação', icon: MessageSquare, packages: { windows: 'SlackTechnologies.Slack', macos: 'slack', linux: 'slack' } },
  { id: 'zoom', name: 'Zoom', category: 'Comunicação', icon: MessageSquare, packages: { windows: 'Zoom.Zoom', macos: 'zoom', linux: 'zoom' } },

  { id: 'spotify', name: 'Spotify', category: 'Mídia', icon: Music, packages: { windows: 'Spotify.Spotify', macos: 'spotify', linux: 'spotify-client' } },
  { id: 'vlc', name: 'VLC Media Player', category: 'Mídia', icon: Music, packages: { windows: 'VideoLAN.VLC', macos: 'vlc', linux: 'vlc' } },

  { id: '7zip', name: '7-Zip', category: 'Utilitários', icon: Wrench, packages: { windows: '7zip.7zip', macos: 'p7zip', linux: 'p7zip-full' } },
  { id: 'notion', name: 'Notion', category: 'Utilitários', icon: Wrench, packages: { windows: 'Notion.Notion', macos: 'notion', linux: 'notion-app' } },
];

export default function App() {
  const [selectedOS, setSelectedOS] = useState<OS>('windows');
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(APPS.map(app => app.category));
    return Array.from(cats);
  }, []);

  const toggleApp = (id: string) => {
    const newSelected = new Set(selectedApps);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedApps(newSelected);
  };

  const generateScript = () => {
    const appsToInstall = APPS.filter(app => selectedApps.has(app.id) && app.packages[selectedOS]);
    
    if (appsToInstall.length === 0) {
      return '# Selecione pelo menos um aplicativo para gerar o script.';
    }

    const packageNames = appsToInstall.map(app => app.packages[selectedOS]).join(' ');

    switch (selectedOS) {
      case 'windows':
        return `@echo off\ncolor 0A\ntitle Instalador Rapido\necho ===================================================\necho Instalador Rapido - Iniciando instalacao...\necho ===================================================\necho.\nwinget install -e --id ${appsToInstall.map(a => a.packages.windows).join(' ')} --accept-package-agreements --accept-source-agreements\necho.\necho ===================================================\necho Instalacao concluida com sucesso!\necho ===================================================\npause`;
      case 'macos':
        return `#!/bin/bash\necho "Instalador Rapido - Iniciando instalacao..."\nbrew install --cask ${packageNames}\necho "Instalacao concluida com sucesso!"`;
      case 'linux':
        return `#!/bin/bash\necho "Instalador Rapido - Iniciando instalacao..."\nsudo apt update && sudo apt install -y ${packageNames}\necho "Instalacao concluida com sucesso!"`;
      default:
        return '';
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateScript());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const script = generateScript();
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedOS === 'windows' ? 'install.bat' : 'install.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-blue-200">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Settings size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Instalador Rápido</h1>
          </div>
          <div className="text-sm text-neutral-500 hidden sm:block">
            Selecione os apps e instale tudo de uma vez.
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: App Selection */}
          <div className="lg:col-span-8 space-y-8">
            {categories.map(category => (
              <div key={category} className="space-y-4">
                <h2 className="text-lg font-semibold text-neutral-700 border-b border-neutral-200 pb-2">
                  {category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {APPS.filter(app => app.category === category).map(app => {
                    const isSelected = selectedApps.has(app.id);
                    const isAvailable = !!app.packages[selectedOS];
                    const Icon = app.icon;

                    return (
                      <motion.button
                        key={app.id}
                        whileHover={{ scale: isAvailable ? 1.02 : 1 }}
                        whileTap={{ scale: isAvailable ? 0.98 : 1 }}
                        onClick={() => isAvailable && toggleApp(app.id)}
                        disabled={!isAvailable}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                          !isAvailable 
                            ? 'opacity-50 cursor-not-allowed bg-neutral-100 border-neutral-200' 
                            : isSelected
                              ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500'
                              : 'bg-white border-neutral-200 hover:border-blue-300 hover:bg-neutral-50'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-neutral-100 text-neutral-500'}`}>
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isSelected ? 'text-blue-900' : 'text-neutral-700'}`}>
                            {app.name}
                          </p>
                          {!isAvailable && (
                            <p className="text-[10px] text-neutral-400">Indisponível p/ {selectedOS}</p>
                          )}
                        </div>
                        <div className="text-neutral-400">
                          {isSelected ? <CheckSquare size={18} className="text-blue-600" /> : <Square size={18} />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Script Generator */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm sticky top-24 overflow-hidden">
              <div className="p-5 border-b border-neutral-100 bg-neutral-50/50">
                <h3 className="text-base font-semibold text-neutral-800 mb-4">Sistema Operacional</h3>
                <div className="flex bg-neutral-100 p-1 rounded-lg">
                  {(['windows', 'macos', 'linux'] as OS[]).map((os) => (
                    <button
                      key={os}
                      onClick={() => setSelectedOS(os)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                        selectedOS === os 
                          ? 'bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200/50' 
                          : 'text-neutral-500 hover:text-neutral-700'
                      }`}
                    >
                      {os === 'windows' && <Monitor size={16} />}
                      {os === 'macos' && <Apple size={16} />}
                      {os === 'linux' && <Terminal size={16} />}
                      <span className="capitalize hidden sm:inline">{os}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-neutral-800">Seu Script</h3>
                  <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {selectedApps.size} selecionados
                  </span>
                </div>
                
                <div className="relative group">
                  <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-xl text-sm font-mono overflow-x-auto whitespace-pre-wrap min-h-[120px]">
                    {generateScript()}
                  </pre>
                  
                  {selectedApps.size > 0 && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={handleCopy}
                        className="p-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
                        title="Copiar script"
                      >
                        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleCopy}
                    disabled={selectedApps.size === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-xl font-medium transition-colors"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? 'Copiado!' : 'Copiar Comando'}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={selectedApps.size === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border border-neutral-200 hover:bg-neutral-50 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed text-neutral-700 py-2.5 px-4 rounded-xl font-medium transition-colors"
                    title="Baixar arquivo executável"
                  >
                    <Download size={18} />
                    Baixar Executável
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-neutral-100">
                  <h4 className="text-sm font-medium text-neutral-700 mb-2">Como usar?</h4>
                  <ol className="text-sm text-neutral-500 space-y-2 list-decimal list-inside">
                    {selectedOS === 'windows' && (
                      <>
                        <li>Abra o <strong>PowerShell</strong> ou <strong>CMD</strong>.</li>
                        <li>Cole o comando acima e pressione Enter.</li>
                        <li>Aguarde a instalação automática.</li>
                      </>
                    )}
                    {selectedOS === 'macos' && (
                      <>
                        <li>Abra o <strong>Terminal</strong>.</li>
                        <li>Certifique-se de ter o <a href="https://brew.sh/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Homebrew</a> instalado.</li>
                        <li>Cole o comando e pressione Enter.</li>
                      </>
                    )}
                    {selectedOS === 'linux' && (
                      <>
                        <li>Abra o <strong>Terminal</strong>.</li>
                        <li>Cole o comando acima.</li>
                        <li>Digite sua senha (sudo) se solicitado.</li>
                      </>
                    )}
                  </ol>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
