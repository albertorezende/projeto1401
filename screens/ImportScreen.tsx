
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ImportScreen: React.FC = () => {
  const navigate = useNavigate();
  const { addItem, createList, activeListId, lists } = useApp();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processCSV = (text: string) => {
    const lines = text.split(/\r?\n/);
    if (lines.length < 2) return [];

    // Detectar delimitador (vírgula ou ponto e vírgula)
    const header = lines[0].toLowerCase();
    const delimiter = header.includes(';') ? ';' : ',';

    const items = [];
    // Começa do 1 para pular o cabeçalho
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Regex para lidar com campos que podem conter o delimitador dentro de aspas (ex: "Sacos de lixo (30L, 50L)")
      const parts = line.split(delimiter).map(p => p.replace(/^"|"$/g, '').trim());
      
      if (parts.length >= 2) {
        const qtyStr = parts[0];
        const name = parts[1];
        const category = parts[2] || 'Outros';

        // Tentar converter quantidade (aceita 'a', '1.5', '500', etc)
        let qty = parseFloat(qtyStr.replace(',', '.'));
        if (isNaN(qty)) qty = 1; // Fallback para itens como 'a' (diversos)

        items.push({
          name: name,
          quantity: qty,
          category: category,
          unit: qtyStr === 'a' ? 'diversos' : 'uni',
          price: 0
        });
      }
    }
    return items;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar extensão
    if (!file.name.endsWith('.csv') && !file.type.includes('csv')) {
      setError('Por favor, selecione um arquivo CSV válido.');
      return;
    }

    setIsUploading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedItems = processCSV(content);

        if (parsedItems.length === 0) {
          setError('Nenhum item encontrado no arquivo.');
          setIsUploading(false);
          return;
        }

        // Determinar ID da lista (ativa ou criar nova)
        let targetListId = activeListId;
        if (!targetListId) {
          targetListId = createList('Lista Importada');
        }

        // Adicionar cada item ao contexto
        parsedItems.forEach(item => {
          addItem(targetListId!, item);
        });

        // Pequeno delay para efeito visual de "processamento"
        setTimeout(() => {
          setIsUploading(false);
          navigate('/list');
        }, 1500);

      } catch (err) {
        console.error(err);
        setError('Erro ao processar o arquivo. Verifique o formato.');
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      setError('Erro ao ler o arquivo.');
      setIsUploading(false);
    };

    reader.readAsText(file, 'UTF-8');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col max-w-lg mx-auto w-full">
      <header className="flex items-center justify-between px-6 py-4 sticky top-0 z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
        <button onClick={() => navigate('/home')} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-center flex-1 pr-10">Importar Lista</h1>
      </header>

      <main className="flex-1 flex flex-col px-6 pb-24 gap-6 w-full">
        <div className="relative w-full aspect-[4/5] flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-white dark:bg-surface-dark transition-all group overflow-hidden shadow-sm">
          {isUploading ? (
            <div className="flex flex-col items-center gap-4 animate-fade-in">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary">sync</span>
              </div>
              <div className="text-center">
                <p className="font-bold text-primary text-lg">Processando CSV...</p>
                <p className="text-xs text-slate-400 mt-1">Organizando seus itens por categoria</p>
              </div>
            </div>
          ) : (
            <>
              <div className="relative mb-8">
                <div className="absolute -left-8 -top-2 rotate-[-15deg] bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-xl p-3 z-0">
                  <span className="material-symbols-outlined text-red-500 text-4xl">picture_as_pdf</span>
                </div>
                <div className="relative bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 rounded-xl p-5 z-10">
                  <span className="material-symbols-outlined text-primary text-5xl">table_view</span>
                </div>
                <div className="absolute -right-8 -top-2 rotate-[15deg] bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-xl p-3 z-0">
                  <span className="material-symbols-outlined text-blue-500 text-4xl">description</span>
                </div>
              </div>
              <div className="text-center flex flex-col gap-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Selecione seu CSV
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-[240px] mx-auto">
                  Formatado com: <br/>
                  <span className="text-primary font-bold">quantidade, item, categoria</span>
                </p>
              </div>
            </>
          )}
          
          <input 
            type="file" 
            accept=".csv" 
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 rounded-2xl p-4 flex items-start gap-3 animate-fade-in">
            <span className="material-symbols-outlined text-danger">error</span>
            <p className="text-danger text-sm font-bold leading-tight">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-slate-100 dark:border-white/10">
            <h4 className="text-xs font-black uppercase text-slate-400 mb-3 tracking-widest">Dica de Formato</h4>
            <code className="text-[10px] block bg-slate-50 dark:bg-black/20 p-3 rounded-lg text-slate-600 dark:text-slate-300 overflow-x-auto whitespace-pre">
              quantidade,item,categoria<br/>
              3,Detergente,Limpeza<br/>
              2,Arroz,Despensa
            </code>
          </div>

          <label className="flex w-full items-center justify-center rounded-2xl h-16 bg-primary text-background-dark font-black shadow-glow cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all">
            <span className="material-symbols-outlined mr-2">upload_file</span>
            CARREGAR ARQUIVO CSV
            <input 
              type="file" 
              accept=".csv" 
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      </main>
    </div>
  );
};

export default ImportScreen;
