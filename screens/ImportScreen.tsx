
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ImportScreen: React.FC = () => {
  const navigate = useNavigate();
  const { addItem, createList, setActiveList } = useApp();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return [];

    const firstLine = lines[0].toLowerCase();
    const delimiter = firstLine.includes(';') ? ';' : ',';
    
    // Ignora cabeçalho se existir
    const hasHeader = firstLine.includes('item') || firstLine.includes('produto') || firstLine.includes('nome');
    const dataLines = hasHeader ? lines.slice(1) : lines;

    return dataLines.map(line => {
      const parts = line.split(delimiter).map(p => p.replace(/^"|"$/g, '').trim());
      
      // Tenta identificar as colunas (Qtd, Nome, Categoria)
      let name = '';
      let qty = 1;
      let cat = 'Outros';

      if (parts.length === 1) {
        name = parts[0];
      } else if (!isNaN(parseFloat(parts[0].replace(',', '.')))) {
        // Provável formato: Qtd, Nome, Categoria
        qty = parseFloat(parts[0].replace(',', '.')) || 1;
        name = parts[1] || 'Item sem nome';
        cat = parts[2] || 'Outros';
      } else {
        // Provável formato: Nome, Qtd, Categoria
        name = parts[0];
        qty = parseFloat(parts[1]?.replace(',', '.')) || 1;
        cat = parts[2] || 'Outros';
      }

      return { name, quantity: qty, category: cat, unit: 'uni', price: 0 };
    }).filter(item => item.name);
  };

  const handleFile = async (file: File) => {
    setIsUploading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const items = parseCSV(text);

        if (items.length === 0) {
          setError("Não encontramos itens válidos no arquivo.");
          setIsUploading(false);
          return;
        }

        const listId = await createList(`Importação ${new Date().toLocaleDateString()}`);
        if (!listId) {
          setError("Erro ao criar lista. Verifique as permissões (RLS) no Supabase.");
          setIsUploading(false);
          return;
        }

        setActiveList(listId);
        
        // Adiciona itens em lote (um por um, mas aguardando)
        for (const item of items) {
          await addItem(listId, item);
        }

        navigate('/list');
      } catch (err) {
        setError("Erro ao processar o arquivo CSV.");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col max-w-lg mx-auto w-full">
      <header className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={() => navigate('/home')} className="size-10 flex items-center justify-center rounded-full hover:bg-black/5">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">Importar Lista</h1>
        <div className="w-10"></div>
      </header>

      <main className="p-6 flex flex-col gap-6">
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center text-center bg-white dark:bg-surface-dark relative">
          {isUploading ? (
            <div className="animate-pulse flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="font-bold text-primary">Importando...</p>
            </div>
          ) : (
            <>
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">upload_file</span>
              <h3 className="font-bold text-slate-900 dark:text-white">Arraste seu arquivo CSV</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">Formatos suportados: Vírgula (,) ou Ponto e Vírgula (;)</p>
              <input 
                type="file" 
                accept=".csv" 
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 p-4 rounded-2xl flex items-center gap-3">
            <span className="material-symbols-outlined text-danger">error</span>
            <p className="text-danger text-xs font-bold">{error}</p>
          </div>
        )}

        <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/10">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Exemplo de Formato Aceito:</h4>
          <code className="text-[10px] text-primary bg-black/5 dark:bg-black/20 p-2 rounded block">
            Qtd, Item, Categoria<br/>
            2, Leite, Laticínios<br/>
            1, Arroz, Outros
          </code>
        </div>
      </main>
    </div>
  );
};

export default ImportScreen;
