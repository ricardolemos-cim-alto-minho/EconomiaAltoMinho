import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- Types ---
interface LayoutProps {
  children?: React.ReactNode;
  title: string;
  subtitle: string;
  activeSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  setSlide: (idx: number) => void;
  headerRight?: React.ReactNode;
}

// --- Chart Helper Component ---
const ChartCanvas = ({ id, type, data, options }: { id: string, type: any, data: any, options: any }) => {
    const chartRef = useRef<any>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
            const ctx = canvasRef.current.getContext('2d');
            // Global Chart Defaults
            // @ts-ignore
            if (window.Chart) {
                // @ts-ignore
                window.Chart.defaults.color = '#1A1A1A';
                // @ts-ignore
                window.Chart.defaults.font.family = 'Space Grotesk';
                // @ts-ignore
                window.Chart.defaults.font.weight = '500';
                
                // @ts-ignore
                chartRef.current = new window.Chart(ctx, { type, data, options });
            }
        }
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [type, data, options]);

    return <canvas ref={canvasRef} id={id}></canvas>;
};

// --- Reusable Components ---

interface ReportCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  noShadow?: boolean;
  lime?: boolean;
  dark?: boolean;
  forest?: boolean;
}

const ReportCard: React.FC<ReportCardProps> = ({ children, className = "", noShadow = false, lime = false, dark = false, forest = false, ...props }) => {
    
    // Explicit text colors to fix contrast issues
    let colorClasses = 'bg-eco-paper text-eco-ink'; 
    if (dark) {
        colorClasses = 'bg-eco-ink text-white';
    } else if (lime) {
        colorClasses = 'bg-eco-lime text-eco-ink';
    } else if (forest) {
        colorClasses = 'bg-eco-forest text-white';
    }

    return (
        <div 
            className={`
                border-2 border-eco-ink rounded-lg p-6
                ${colorClasses}
                ${noShadow ? '' : 'shadow-hard'}
                transition-transform hover:-translate-y-1 hover:shadow-hard-hover duration-300
                ${className}
            `} 
            {...props}
        >
            {children}
        </div>
    );
};

const ActionBtn = ({ children, onClick, active = false, disabled = false, className = "", title="" }: any) => (
    <button 
        onClick={onClick} 
        disabled={disabled}
        title={title}
        className={`
            w-12 h-12 flex items-center justify-center border-2 border-eco-ink rounded-md transition-all duration-200 cursor-pointer
            disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0
            ${active 
                ? 'bg-eco-lime text-eco-ink shadow-none translate-x-[2px] translate-y-[2px]' 
                : 'bg-eco-paper text-eco-ink shadow-hard-sm hover:bg-eco-lime hover:-translate-y-0.5 hover:shadow-hard'
            }
            ${className}
        `}
    >
        {children}
    </button>
);

const StatBadge = ({ value, label, sub, color = "lime" }: any) => (
    <div className={`flex flex-col border-l-4 ${color === 'lime' ? 'border-eco-lime' : 'border-eco-forest'} pl-4`}>
        <span className="font-display font-bold text-3xl">{value}</span>
        <span className="font-mono text-[10px] uppercase font-bold tracking-wider opacity-70">{label}</span>
        {sub && <span className="text-[10px] opacity-60 mt-1">{sub}</span>}
    </div>
);

// --- Main Layout ---
const MainLayout = ({ children, title, subtitle, activeSlide, totalSlides, onNext, onPrev, setSlide }: LayoutProps) => {
  return (
    <div className="w-[1280px] h-[720px] bg-eco-bg bg-grid-pattern relative flex shadow-2xl overflow-hidden font-sans text-eco-ink border-4 border-eco-ink">
      
      {/* Sidebar Navigation */}
      <div className="w-[80px] border-r-2 border-eco-ink bg-eco-paper flex flex-col items-center py-6 z-30">
        <div className="mb-8 flex flex-col gap-3">
            <ActionBtn onClick={() => setSlide(0)} active={activeSlide === 0} title="Capa">
                <i className="fa-solid fa-house"></i>
            </ActionBtn>
            <ActionBtn onClick={() => setSlide(1)} active={activeSlide === 1} title="Índice">
                <i className="fa-solid fa-list-ul"></i>
            </ActionBtn>
        </div>
        
        {/* Progress Bar */}
        <div className="flex-1 w-2 bg-eco-bg border border-eco-ink rounded-full overflow-hidden relative mb-8">
            <div 
                className="absolute top-0 left-0 w-full bg-eco-ink transition-all duration-500"
                style={{ height: `${((activeSlide + 1) / totalSlides) * 100}%` }}
            ></div>
        </div>

        <div className="flex flex-col gap-3">
            <ActionBtn onClick={onPrev} disabled={activeSlide === 0}>
                <i className="fa-solid fa-arrow-up"></i>
            </ActionBtn>
            <ActionBtn onClick={onNext} disabled={activeSlide === totalSlides - 1}>
                <i className="fa-solid fa-arrow-down"></i>
            </ActionBtn>
        </div>
        
        <div className="mt-6 font-display font-bold text-lg">
            {activeSlide + 1}<span className="text-xs font-normal text-gray-500">/{totalSlides}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header Bar */}
        <div className="h-20 border-b-2 border-eco-ink bg-eco-paper flex items-center justify-between px-10">
            <div className="flex items-center gap-4">
                 <span className="bg-eco-ink text-eco-lime px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider rounded-sm">
                    {subtitle}
                 </span>
                 <h1 className="font-display font-bold text-xl uppercase tracking-tight truncate max-w-2xl">
                    {title}
                 </h1>
            </div>
            <div className="flex items-center gap-4">
                 <div className="text-right hidden xl:block">
                    <p className="font-bold text-xs">CIM ALTO MINHO</p>
                    <p className="text-[10px] text-gray-500">Relatório Estratégico</p>
                 </div>
                 <div className="h-8 w-[1px] bg-eco-ink/20"></div>
                 <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-eco-lime border border-eco-ink animate-pulse"></div>
                    <span className="font-mono text-xs font-bold">FEV 2026</span>
                </div>
            </div>
        </div>
        
        {/* Content Container */}
        <div className="flex-1 p-10 overflow-hidden relative bg-[#F9F9F9]">
             {/* Decorative diagonal lines */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0wIDhMODCAwIiBzdHJva2U9IiNlNWU1ZTUiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-50 pointer-events-none"></div>

            <div className="relative z-10 w-full h-full animate-slide-up flex flex-col">
                 {children}
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Slides ---

const CoverSlide = ({ onNext }: { onNext: () => void }) => (
    <div className="w-[1280px] h-[720px] bg-eco-paper relative flex flex-col border-4 border-eco-ink">
        <div className="flex-1 grid grid-cols-12">
            <div className="col-span-5 border-r-2 border-eco-ink p-16 flex flex-col justify-center bg-eco-lime/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-eco-ink to-transparent"></div>
                <div className="relative z-10">
                    <div className="flex gap-2 mb-6">
                        <span className="bg-eco-ink text-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest">CIM Alto Minho</span>
                        <span className="bg-eco-forest text-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest">INE</span>
                    </div>
                    
                    <h1 className="font-display font-bold text-6xl leading-[1] tracking-tighter mb-4 text-eco-ink">
                        Observatório<br/>
                        Económico<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-eco-forest to-eco-lime">2025-2026</span>
                    </h1>
                    
                    <div className="h-1 w-20 bg-eco-ink mb-6"></div>
                    
                    <p className="font-sans text-lg font-medium opacity-80 mb-8 max-w-sm">
                        Análise Profunda da Economia Real, Estratégia e Território.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="border-l-2 border-eco-lime pl-3">
                            <p className="text-xs font-bold text-gray-500 uppercase">Dados Reais</p>
                            <p className="font-bold">Fevereiro 2026</p>
                        </div>
                        <div className="border-l-2 border-eco-lime pl-3">
                            <p className="text-xs font-bold text-gray-500 uppercase">Abrangência</p>
                            <p className="font-bold">Regional & Macro</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="col-span-7 relative flex flex-col">
                <div className="flex-1 bg-[url('https://images.unsplash.com/photo-1541890289-b86df5b6fc69?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center grayscale contrast-125">
                     <div className="absolute inset-0 bg-eco-forest/30 mix-blend-multiply"></div>
                </div>
                
                <div className="h-[200px] border-t-2 border-eco-ink bg-white relative z-10 grid grid-cols-2">
                    <div className="p-8 border-r-2 border-eco-ink flex flex-col justify-center">
                        <p className="font-display font-bold text-3xl mb-2">289,4 Mil M€</p>
                        <p className="text-xs uppercase font-bold text-gray-500">PIB Nacional 2024 (Histórico)</p>
                    </div>
                    <div className="p-8 flex items-center justify-center bg-eco-lime hover:bg-eco-lime/80 transition-colors cursor-pointer group" onClick={onNext}>
                        <div className="flex items-center gap-4">
                            <span className="font-display font-bold text-xl uppercase tracking-widest group-hover:mr-2 transition-all">Iniciar Análise</span>
                            <i className="fa-solid fa-arrow-right text-2xl"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const IndexSlide = ({ setSlide }: { setSlide: (i: number) => void }) => {
    const chapters = [
        { t: "Contexto Macro", sub: "PIB & Inflação", i: "fa-chart-line", slide: 2 },
        { t: "Socioeconomia", sub: "População & Território", i: "fa-users", slide: 3 },
        { t: "Tecido Empresarial", sub: "Dinâmica & Emprego", i: "fa-building", slide: 4 },
        { t: "Indústria", sub: "Transformadora & VAB", i: "fa-industry", slide: 5 },
        { t: "Comércio Int.", sub: "Exportações & Nearshoring", i: "fa-globe", slide: 6 },
        { t: "Setores Estratégicos", sub: "Têxtil, Calçado", i: "fa-shirt", slide: 7 },
        { t: "Turismo", sub: "Sustentabilidade", i: "fa-tree", slide: 8 },
        { t: "Habitação", sub: "Território & Coesão", i: "fa-house", slide: 9 },
        { t: "Inovação", sub: "Indústria 4.0 & I&D", i: "fa-microchip", slide: 10 },
        { t: "RIS3 Norte", sub: "Especialização Inteligente", i: "fa-diagram-project", slide: 11 },
        { t: "Território Inteligente", sub: "Estratégia ENTI", i: "fa-city", slide: 12 },
        { t: "Visão 2030", sub: "Estratégia Futura", i: "fa-eye", slide: 13 },
        { t: "Metodologia", sub: "Fontes", i: "fa-book", slide: 14 },
    ];

    return (
        <div className="grid grid-cols-4 gap-4 h-full content-start overflow-y-auto">
            {chapters.map((item, idx) => (
                <div 
                    key={idx} 
                    onClick={() => setSlide(item.slide)}
                    className="group border-2 border-eco-ink bg-white p-5 flex flex-col gap-3 hover:bg-eco-ink hover:text-white hover:-translate-y-1 hover:shadow-hard transition-all cursor-pointer h-full"
                >
                    <div className="flex justify-between items-start">
                        <span className="font-mono text-xs font-bold opacity-50 group-hover:text-eco-lime">0{idx + 1}</span>
                        <i className={`fa-solid ${item.i} text-xl group-hover:text-eco-lime`}></i>
                    </div>
                    <div className="mt-auto">
                        <h4 className="font-bold font-display uppercase text-lg leading-tight">{item.t}</h4>
                        <p className="text-[10px] font-mono mt-1 opacity-70 group-hover:text-gray-300">{item.sub}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const NationalContextMacro = () => (
    <div className="grid grid-cols-12 gap-8 h-full">
        <div className="col-span-8 grid grid-rows-2 gap-8">
            <div className="bg-white border-2 border-eco-ink p-8 shadow-hard flex flex-col justify-center">
                <div className="flex justify-between items-end mb-4">
                    <h3 className="font-display font-bold text-3xl uppercase">Economia Portuguesa</h3>
                    <span className="bg-eco-lime px-2 py-1 text-xs font-bold uppercase">Crescimento Sólido</span>
                </div>
                <p className="text-lg leading-relaxed opacity-80">
                    Portugal registou um desempenho robusto em 2024, com o PIB nominal a atingir valores históricos. A estabilização da inflação cria um contexto favorável para o Alto Minho.
                </p>
                <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-eco-ink/10">
                    <StatBadge value="+7,1%" label="Crescimento Nominal" sub="Recuperação Pós-Crise" />
                    <StatBadge value="289,4 MM€" label="PIB 2024" sub="Valor Histórico" />
                    <StatBadge value="+1,6%" label="Emprego" sub="Dinâmica Positiva" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
                 <ReportCard className="flex flex-col justify-between">
                    <div className="flex justify-between">
                        <span className="font-mono text-xs font-bold uppercase text-gray-500">Inflação (IPC)</span>
                        <i className="fa-solid fa-percent text-eco-forest"></i>
                    </div>
                    <p className="font-display font-bold text-6xl">2,4%</p>
                    <p className="text-xs font-bold text-eco-forest">-1,9 p.p. vs ano anterior</p>
                    <p className="text-xs mt-2 opacity-70">Estabilização alivia pressão nas margens operacionais.</p>
                 </ReportCard>
                 
                 <ReportCard className="flex flex-col justify-between bg-eco-bg">
                    <div className="flex justify-between">
                        <span className="font-mono text-xs font-bold uppercase text-gray-500">Previsão 2025 (Q4)</span>
                        <i className="fa-solid fa-calendar text-eco-ink"></i>
                    </div>
                    <p className="font-display font-bold text-4xl">0,5% - 0,9%</p>
                    <p className="text-xs font-bold">Crescimento Resiliente</p>
                    <p className="text-xs mt-2 opacity-70">Garantindo estabilidade económica e confiança.</p>
                 </ReportCard>
            </div>
        </div>

        <div className="col-span-4 flex flex-col gap-6">
            <ReportCard dark className="flex-1 flex flex-col justify-center relative overflow-hidden">
                <div className="relative z-10">
                    <h4 className="font-bold text-xl uppercase text-eco-lime mb-4">Alto Minho vs Norte</h4>
                    <ul className="space-y-4 text-sm font-mono text-white">
                        <li className="flex justify-between border-b border-white/20 pb-2">
                            <span>População</span>
                            <span className="font-bold">2,2%</span>
                        </li>
                        <li className="flex justify-between border-b border-white/20 pb-2">
                            <span>Empresas</span>
                            <span className="font-bold">6,7%</span>
                        </li>
                        <li className="flex justify-between border-b border-white/20 pb-2">
                            <span>Exportações</span>
                            <span className="font-bold text-eco-lime">9,5%</span>
                        </li>
                    </ul>
                    <div className="mt-8 bg-white/10 p-4 rounded text-xs leading-relaxed text-white">
                        "O Alto Minho gera 9,5% das exportações do Norte com apenas 2,2% da população."
                    </div>
                </div>
            </ReportCard>
        </div>
    </div>
);

const SocioEconomics = () => (
    <div className="grid grid-cols-12 gap-8 h-full">
        <div className="col-span-3 flex flex-col gap-4">
             <div className="bg-eco-lime p-6 border-2 border-eco-ink shadow-hard rounded-lg">
                 <h3 className="font-display font-bold text-2xl uppercase mb-1">População</h3>
                 <p className="text-4xl font-bold">234.215</p>
                 <p className="text-xs font-mono uppercase mt-1">Habitantes</p>
             </div>
             <div className="bg-white p-6 border-2 border-eco-ink rounded-lg">
                 <h3 className="font-display font-bold text-2xl uppercase mb-1">Área</h3>
                 <p className="text-4xl font-bold">2.219</p>
                 <p className="text-xs font-mono uppercase mt-1">km²</p>
             </div>
             <div className="bg-white p-6 border-2 border-eco-ink rounded-lg flex-1">
                 <h3 className="font-display font-bold text-2xl uppercase mb-1">Densidade</h3>
                 <p className="text-4xl font-bold">105</p>
                 <p className="text-xs font-mono uppercase mt-1">hab/km²</p>
             </div>
        </div>

        <div className="col-span-9 grid grid-rows-2 gap-8">
            <div className="bg-white border-2 border-eco-ink p-8 shadow-hard grid grid-cols-2 gap-12">
                <div>
                    <h3 className="font-bold text-xl uppercase mb-6 flex items-center gap-2">
                        <i className="fa-solid fa-person-cane text-eco-ink"></i> Envelhecimento
                    </h3>
                    <div className="flex items-baseline gap-4 mb-2">
                        <span className="text-6xl font-display font-bold text-eco-ink">28,9%</span>
                        <span className="text-sm font-bold bg-eco-bg px-2 py-1">Pop. ≥ 65 Anos</span>
                    </div>
                    <p className="text-sm opacity-70 mb-4">Envelhecimento demográfico crítico.</p>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-eco-ink w-[28.9%]"></div>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-xl uppercase mb-6 flex items-center gap-2">
                         <i className="fa-solid fa-scale-unbalanced text-eco-ink"></i> Dependência
                    </h3>
                    <div className="flex items-baseline gap-4 mb-2">
                        <span className="text-6xl font-display font-bold text-eco-forest">66,5</span>
                        <span className="text-sm font-bold bg-eco-bg px-2 py-1">Índice Total</span>
                    </div>
                    <p className="text-sm opacity-70 mb-4">Pressiona sistemas de apoio.</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <ReportCard className="flex flex-col justify-center">
                    <p className="text-xs font-bold uppercase text-gray-500 mb-2">Crescimento Anual</p>
                    <p className="text-3xl font-bold text-red-500">-0,3%</p>
                    <p className="text-[10px] mt-1">2011-2023</p>
                </ReportCard>
                <ReportCard className="flex flex-col justify-center">
                    <p className="text-xs font-bold uppercase text-gray-500 mb-2">Natalidade</p>
                    <p className="text-3xl font-bold">6,6‰</p>
                    <p className="text-[10px] mt-1">2023</p>
                </ReportCard>
                <ReportCard className="flex flex-col justify-center bg-eco-forest text-white" forest>
                    <p className="text-xs font-bold uppercase text-eco-lime mb-2">Ganho Médio</p>
                    <p className="text-3xl font-bold">1.095€</p>
                    <p className="text-[10px] mt-1 text-gray-300">Mensal (2021)</p>
                </ReportCard>
            </div>
        </div>
    </div>
);

const BusinessDynamics = () => {
    // Chart Data for Creation vs Dissolution
    const chartData = {
        labels: ['2019', '2020', '2021', '2022', '2023'],
        datasets: [
            {
                label: 'Criação',
                data: [790, 640, 760, 740, 860], // Approximate values from PDF chart
                backgroundColor: '#005C42',
                borderRadius: 4
            },
            {
                label: 'Dissolução',
                data: [360, 270, 340, 340, 270], // Approximate values from PDF chart
                backgroundColor: '#F7A072',
                borderRadius: 4
            }
        ]
    };
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', align: 'end', labels: { boxWidth: 12 } }
        },
        scales: {
            y: { grid: { color: '#e5e5e5' }, border: { display: false } },
            x: { grid: { display: false } }
        }
    };

    return (
        <div className="grid grid-cols-12 gap-8 h-full">
            <div className="col-span-4 flex flex-col justify-between">
                <div>
                    <h3 className="font-display font-bold text-4xl uppercase mb-2">Dinâmica Empresarial</h3>
                    <p className="text-lg opacity-80 mb-8">Tecido robusto com 32.204 empresas ativas.</p>
                    
                    <div className="space-y-6">
                        <div className="border-l-4 border-eco-forest pl-4 py-2">
                            <p className="text-4xl font-bold">32.204</p>
                            <p className="text-xs font-bold uppercase text-gray-500">Empresas Ativas (2022)</p>
                        </div>
                    </div>
                </div>
                
                <ReportCard lime className="mt-auto">
                    <p className="font-bold text-sm mb-2 uppercase">Tendência 2023</p>
                    <p className="text-sm">Aumento na criação de empresas e redução de dissoluções, indicando retoma da confiança.</p>
                </ReportCard>
            </div>

            <div className="col-span-8 bg-white border-2 border-eco-ink p-6 shadow-hard rounded-lg flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold uppercase text-sm bg-eco-bg px-2 py-1">Evolução: Criação vs Dissolução</h4>
                </div>
                <div className="flex-1 relative w-full h-full min-h-[300px]">
                     <ChartCanvas id="businessChart" type="bar" data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

const IndustryDetails = () => (
    <div className="grid grid-cols-12 gap-8 h-full">
        <div className="col-span-12 mb-2">
            <h3 className="font-display font-bold text-4xl uppercase">Indústria Transformadora</h3>
            <p className="text-lg mt-2 opacity-80">Motor da economia regional.</p>
        </div>

        <div className="col-span-4 grid grid-rows-3 gap-4">
            <ReportCard className="flex items-center justify-between">
                <div>
                    <p className="text-4xl font-bold">1.808</p>
                    <p className="text-xs font-bold uppercase text-gray-500">Empresas</p>
                </div>
                <div className="bg-eco-lime px-2 py-1 text-xs font-bold rounded">+2,9%</div>
            </ReportCard>
            <ReportCard className="flex items-center justify-between">
                <div>
                    <p className="text-4xl font-bold">22.887</p>
                    <p className="text-xs font-bold uppercase text-gray-500">Pessoal</p>
                </div>
                <div className="bg-eco-lime px-2 py-1 text-xs font-bold rounded">+6,0%</div>
            </ReportCard>
            <ReportCard className="flex items-center justify-between bg-eco-forest text-white" forest>
                <div>
                    <p className="text-4xl font-bold">3.150 M€</p>
                    <p className="text-xs font-bold uppercase text-eco-lime">Vol. Negócios</p>
                </div>
                <div className="bg-eco-lime text-eco-ink px-2 py-1 text-xs font-bold rounded">+17,4%</div>
            </ReportCard>
        </div>

        <div className="col-span-4 bg-white border-2 border-eco-ink p-6 shadow-hard rounded-lg">
            <h4 className="font-bold uppercase text-sm mb-4 border-b pb-2">Maiores Empregadores (2022)</h4>
            <ul className="space-y-4 text-sm">
                {[
                    "Componentes para veículos automóveis",
                    "Construção de edifícios",
                    "Empresas de trabalho temporário",
                    "Comércio a retalho (supermercados)",
                    "Fabricação de calçado e artigos de pele"
                ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <span className="w-5 h-5 bg-eco-bg text-eco-ink flex items-center justify-center font-bold text-xs rounded-full shrink-0">{i+1}</span>
                        <span className="leading-tight">{item}</span>
                    </li>
                ))}
            </ul>
        </div>

        <div className="col-span-4 flex flex-col justify-center items-center bg-white border-2 border-eco-ink p-6 rounded-lg relative">
             <div className="absolute top-4 left-4 font-bold text-xs uppercase bg-eco-bg px-2 py-1">Estrutura do Emprego</div>
             <div className="w-48 h-48 rounded-full border-[16px] border-eco-forest border-r-eco-lime border-t-eco-ink relative flex items-center justify-center">
                 <div className="text-center">
                     <p className="font-bold text-2xl">53%</p>
                     <p className="text-[10px] uppercase">Terciário</p>
                 </div>
             </div>
             <div className="w-full mt-6 space-y-2">
                 <div className="flex justify-between text-xs"><span className="flex items-center gap-2"><div className="w-3 h-3 bg-eco-forest"></div>Terciário</span> <b>53%</b></div>
                 <div className="flex justify-between text-xs"><span className="flex items-center gap-2"><div className="w-3 h-3 bg-eco-ink"></div>Secundário</span> <b>45%</b></div>
                 <div className="flex justify-between text-xs"><span className="flex items-center gap-2"><div className="w-3 h-3 bg-[#F7A072]"></div>Primário</span> <b>2%</b></div>
             </div>
        </div>
    </div>
);

const TradeExports = () => {
    const tradeData = {
        labels: ['2019', '2020', '2021', '2022', '2023'],
        datasets: [
            {
                label: 'Exportações',
                data: [1950, 1750, 1900, 2300, 2550], // Approx from chart
                borderColor: '#005C42',
                backgroundColor: '#005C42',
                tension: 0.3,
                borderWidth: 3,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4
            },
            {
                label: 'Importações',
                data: [1400, 1200, 1400, 1700, 1950], // Approx from chart
                borderColor: '#F7A072',
                backgroundColor: '#F7A072',
                tension: 0.3,
                borderWidth: 3,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4
            }
        ]
    };
    
    const tradeOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', align: 'end' }
        },
        scales: {
            y: { grid: { color: '#f0f0f0' } },
            x: { grid: { display: false } }
        }
    };

    return (
        <div className="grid grid-cols-12 gap-8 h-full">
            <div className="col-span-12 mb-2 flex justify-between items-end">
                <div>
                    <h3 className="font-display font-bold text-4xl uppercase">Internacionalização</h3>
                    <p className="text-lg mt-2 opacity-80">Saldo Comercial Positivo: <strong className="text-eco-forest">+603 M€ (2023)</strong></p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold uppercase text-gray-500">Outubro 2025</p>
                    <p className="text-2xl font-bold bg-eco-lime px-2 inline-block">Recorde: 121,8 M€</p>
                    <p className="text-[10px]">(Vendas Mensais Viana do Castelo)</p>
                </div>
            </div>

            <div className="col-span-8 bg-white border-2 border-eco-ink p-6 shadow-hard rounded-lg h-[400px]">
                 <ChartCanvas id="tradeChart" type="line" data={tradeData} options={tradeOptions} />
            </div>

            <div className="col-span-4 flex flex-col gap-6">
                <ReportCard dark className="flex-1">
                    <h4 className="font-bold text-lg text-eco-lime uppercase mb-4">Nearshoring</h4>
                    <p className="text-sm leading-relaxed text-gray-300">
                        O Alto Minho capitaliza a estratégia europeia de cadeias curtas. A proximidade geográfica à Galiza e a integração no Eixo Atlântico reduzem custos e tempos de entrega.
                    </p>
                </ReportCard>
                <ReportCard>
                    <h4 className="font-bold text-lg uppercase mb-4">Vantagem Logística</h4>
                    <ul className="text-sm space-y-2">
                         <li className="flex gap-2"><i className="fa-solid fa-check text-eco-forest"></i> Alternativa segura à produção deslocalizada.</li>
                         <li className="flex gap-2"><i className="fa-solid fa-check text-eco-forest"></i> PMEs com certificações internacionais.</li>
                    </ul>
                </ReportCard>
            </div>
        </div>
    );
};

const StrategicSectors = () => (
    <div className="grid grid-cols-2 gap-8 h-full">
        {/* Calçado */}
        <ReportCard className="flex flex-col relative overflow-hidden border-t-8 border-t-eco-ink">
            <div className="flex justify-between items-start mb-6">
                 <div>
                     <h3 className="font-display font-bold text-3xl uppercase">Calçado</h3>
                     <p className="text-xs font-bold uppercase text-gray-500">Setor Estratégico</p>
                 </div>
                 <i className="fa-solid fa-shoe-prints text-4xl opacity-20"></i>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="bg-eco-bg p-3 rounded">
                     <p className="text-2xl font-bold">85M</p>
                     <p className="text-[10px] uppercase font-bold">Pares Produzidos (2022)</p>
                 </div>
                 <div className="bg-eco-bg p-3 rounded">
                     <p className="text-2xl font-bold">26,31€</p>
                     <p className="text-[10px] uppercase font-bold">Preço Médio (vs 19,05€ ESP)</p>
                 </div>
            </div>

            <div className="space-y-4 text-sm border-t pt-4">
                 <div>
                     <span className="font-bold block text-xs uppercase text-eco-forest">Portugal</span>
                     2º Maior Produtor Europeu
                 </div>
                 <div>
                     <span className="font-bold block text-xs uppercase text-red-500">Desafio 2024</span>
                     Exportações recuaram 13,8%. Pressão em custos e mão-de-obra.
                 </div>
                 <div>
                     <span className="font-bold block text-xs uppercase text-eco-ink">Aposta</span>
                     Automatização e criação de marcas próprias.
                 </div>
            </div>
        </ReportCard>

        {/* Têxtil */}
        <ReportCard className="flex flex-col relative overflow-hidden border-t-8 border-t-eco-forest">
            <div className="flex justify-between items-start mb-6">
                 <div>
                     <h3 className="font-display font-bold text-3xl uppercase">Têxtil & Vestuário</h3>
                     <p className="text-xs font-bold uppercase text-gray-500">Setor Estratégico</p>
                 </div>
                 <i className="fa-solid fa-shirt text-4xl opacity-20"></i>
            </div>
            
            <div className="bg-eco-forest text-white p-4 rounded mb-6">
                 <p className="font-bold text-lg leading-tight">"Forte presença no Alto Minho com especialização em vestuário exterior."</p>
            </div>

            <div className="space-y-4 text-sm">
                 <div className="flex gap-3 items-start">
                     <i className="fa-solid fa-triangle-exclamation mt-1 text-red-500"></i>
                     <div>
                         <span className="font-bold block text-xs uppercase">Ameaça</span>
                         Concorrência asiática crescente.
                     </div>
                 </div>
                 <div className="flex gap-3 items-start">
                     <i className="fa-solid fa-recycle mt-1 text-eco-lime"></i>
                     <div>
                         <span className="font-bold block text-xs uppercase">Tendência</span>
                         Economia Circular e Sustentabilidade.
                     </div>
                 </div>
            </div>
        </ReportCard>
    </div>
);

const TourismSlide = () => {
    // Chart for Dormidas
    const tourismData = {
        labels: ['2019', '2020', '2021', '2022', '2023'],
        datasets: [{
            label: 'Dormidas (Milhares)',
            data: [780, 460, 604, 861, 520], 
            backgroundColor: '#D2F220',
            borderRadius: 4
        }]
    };
    
    const tourismOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { display: false }, x: { grid: { display: false } } }
    };

    return (
        <div className="grid grid-cols-12 gap-8 h-full">
            <div className="col-span-5 flex flex-col gap-6">
                <ReportCard forest className="flex-1 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <i className="fa-solid fa-trophy text-eco-lime text-2xl"></i>
                            <span className="font-bold uppercase text-white tracking-widest text-xs">Reconhecimento</span>
                        </div>
                        <h3 className="font-display font-bold text-3xl text-white mb-6 uppercase leading-tight">
                            2º Melhor Destino Sustentável da Europa
                        </h3>
                        <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase text-eco-ink">
                            <span className="bg-eco-lime px-2 py-1 rounded">Green Destinations</span>
                            <span className="bg-white px-2 py-1 rounded">Carta Europeia (CETS)</span>
                            <span className="bg-white px-2 py-1 rounded">Rede Natura 2000 (30%)</span>
                        </div>
                    </div>
                    <i className="fa-solid fa-leaf text-[200px] absolute -right-10 -bottom-10 opacity-10 text-white"></i>
                </ReportCard>

                <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white p-4 border-2 border-eco-ink rounded">
                         <p className="text-2xl font-bold">54,7 M€</p>
                         <p className="text-[10px] font-bold uppercase text-gray-500">Proveitos (2023)</p>
                     </div>
                     <div className="bg-white p-4 border-2 border-eco-ink rounded">
                         <p className="text-2xl font-bold">8.743</p>
                         <p className="text-[10px] font-bold uppercase text-gray-500">Camas (Capacidade)</p>
                     </div>
                </div>
            </div>

            <div className="col-span-7 bg-white border-2 border-eco-ink p-8 shadow-hard rounded-lg flex flex-col">
                <div className="mb-6 flex justify-between items-end">
                    <h4 className="font-bold text-xl uppercase">Evolução do Turismo</h4>
                    <p className="text-xs text-gray-500">Dormidas (Milhares)</p>
                </div>
                <div className="flex-1">
                     <ChartCanvas id="tourismChart" type="bar" data={tourismData} options={tourismOptions} />
                </div>
                <div className="mt-4 pt-4 border-t text-sm opacity-80">
                     <p>Performance nacional 2024 sólida (+4,1% dormidas), mas região foca em valor vs volume.</p>
                </div>
            </div>
        </div>
    );
};

const InnovationSlide = () => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const items = [
        { id: 1, t: "Indústria 4.0", d: "Automatização industrial (calçado, têxtil, metalomecânica). Foco em robótica, sistemas ciberfísicos e IoT para otimização da produção e flexibilidade.", i: "fa-robot", details: "Implementação de linhas de produção inteligentes, com sensores para manutenção preditiva e customização em massa de produtos." },
        { id: 2, t: "Economia Circular", d: "Materiais biodegradáveis e reciclagem. Valorização de resíduos das indústrias têxtil e agroalimentar.", i: "fa-recycle", details: "Projetos de simbiose industrial onde o resíduo de uma empresa é matéria-prima de outra, reduzindo a pegada ecológica regional." },
        { id: 3, t: "Digitalização PMEs", d: "E-commerce e gestão digital. Adoção de CRM, ERP e plataformas de vendas online para atingir mercados globais.", i: "fa-laptop", details: "Capacitação digital dos empresários e trabalhadores para o marketing digital e gestão remota de processos." },
        { id: 4, t: "Energias Renováveis", d: "Solar, eólica e hidroelétrica. Potencial para comunidades de energia renovável e autoconsumo.", i: "fa-solar-panel", details: "Aproveitamento do potencial eólico offshore de Viana do Castelo e microgeração hídrica nas zonas de montanha." },
        { id: 5, t: "Agrotech", d: "Agricultura de precisão e produtos certificados. Uso de drones e sensores para monitorização de culturas.", i: "fa-tractor", details: "Certificação de origem digital (Blockchain) para produtos endógenos como o Vinho Verde e o Mel." },
        { id: 6, t: "Turismo Digital", d: "Experiências virtuais e apps. Realidade aumentada para interpretação do património e rotas inteligentes.", i: "fa-mobile-screen", details: "Apps de visitação que permitem experiências imersivas no património histórico e natural, promovendo a estadia prolongada." }
    ];

    return (
        <div className="grid grid-cols-12 gap-6 h-full relative">
            <div className="col-span-12 mb-2 flex justify-between items-end">
                <div>
                    <h3 className="font-display font-bold text-4xl uppercase">Tecnologia, I&D e Inovação</h3>
                    <p className="text-lg opacity-80">Áreas de desenvolvimento estratégico.</p>
                </div>
                <div className="text-xs text-gray-500 animate-pulse">
                    <i className="fa-solid fa-computer-mouse mr-1"></i> Clique nos cartões para mais detalhes
                </div>
            </div>

            {items.map((item) => (
                <div 
                    key={item.id} 
                    className="col-span-4"
                    onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
                >
                    <ReportCard 
                        className={`h-full cursor-pointer transition-all duration-300 group ${selectedId === item.id ? 'ring-4 ring-eco-lime bg-eco-ink text-white transform scale-105 z-10' : 'hover:bg-eco-lime hover:translate-y-[-5px]'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <i className={`fa-solid ${item.i} text-3xl ${selectedId === item.id ? 'text-eco-lime' : 'opacity-30 group-hover:text-eco-ink group-hover:opacity-100'}`}></i>
                            {selectedId === item.id && <i className="fa-solid fa-xmark text-white/50 hover:text-white"></i>}
                        </div>
                        <h4 className="font-bold text-xl uppercase mb-2 leading-tight">{item.t}</h4>
                        <p className={`text-sm ${selectedId === item.id ? 'text-gray-300' : 'opacity-80'}`}>{item.d}</p>
                        
                        {selectedId === item.id && (
                            <div className="mt-4 pt-4 border-t border-white/20 animate-slide-up">
                                <p className="text-xs font-mono text-eco-lime mb-1 uppercase font-bold">Detalhe Estratégico</p>
                                <p className="text-sm leading-relaxed">{item.details}</p>
                            </div>
                        )}
                    </ReportCard>
                </div>
            ))}
        </div>
    );
};

const MethodologySlide = () => (
    <div className="grid grid-cols-2 gap-12 h-full items-center">
        <div className="flex flex-col gap-8">
            <h3 className="font-display font-bold text-4xl uppercase">Metodologia & Fontes</h3>
            <p className="text-lg leading-relaxed">
                Este observatório reflete as publicações oficiais mais recentes até <strong className="bg-eco-lime px-1">Fevereiro de 2026</strong>, servindo como ferramenta de apoio à decisão para investidores.
            </p>
            <div className="border-l-4 border-eco-ink pl-6 space-y-4">
                <div>
                    <h5 className="font-bold uppercase text-sm">INE</h5>
                    <p className="text-sm opacity-70">Contas Nacionais 2024, Estatísticas Regionais NUTS III.</p>
                </div>
                <div>
                    <h5 className="font-bold uppercase text-sm">CIM Alto Minho</h5>
                    <p className="text-sm opacity-70">Relatórios de Gestão e Orçamentos 2026.</p>
                </div>
                <div>
                    <h5 className="font-bold uppercase text-sm">Setoriais</h5>
                    <p className="text-sm opacity-70">APICCAPS (Calçado), ATP (Têxtil), Turismo de Portugal.</p>
                </div>
            </div>
        </div>
        <ReportCard dark className="h-full flex flex-col justify-center items-center text-center p-12">
            <i className="fa-solid fa-scale-balanced text-6xl text-eco-lime mb-6"></i>
            <h4 className="font-display font-bold text-2xl uppercase mb-4 text-white">Rigor dos Dados</h4>
            <p className="text-gray-400 text-sm">
                Todas as estatísticas apresentadas baseiam-se em registos oficiais comprovados, sem extrapolações não fundamentadas.
            </p>
        </ReportCard>
    </div>
);

const Housing = () => (
    <div className="grid grid-cols-2 gap-8 h-full">
         <div className="flex flex-col justify-center">
             <h3 className="font-display font-bold text-4xl uppercase mb-6 leading-tight">Estabilidade Habitacional</h3>
             <p className="text-lg font-medium mb-8 opacity-80">
                 O Alto Minho destaca-se como alternativa viável e atrativa, resistindo à pressão inflacionária das áreas metropolitanas.
             </p>
             
             <ReportCard className="p-8 bg-white shadow-hard-lg flex flex-col gap-4 border-l-8 border-l-eco-lime">
                 <span className="text-xs uppercase font-bold text-gray-500">Mercado Imobiliário (Início 2026)</span>
                 <p className="text-6xl font-bold font-display">+5,5%</p>
                 <span className="text-sm font-bold">Aumento de preços moderado.</span>
                 <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">Contrasta com >15% nas metrópoles.</p>
             </ReportCard>
         </div>
         
         <div className="flex flex-col gap-6 justify-center">
             <ReportCard className="bg-eco-bg p-6 flex items-start gap-4" noShadow>
                 <div className="w-12 h-12 bg-white border-2 border-eco-ink flex items-center justify-center text-xl shrink-0"><i className="fa-solid fa-tree"></i></div>
                 <div>
                    <h4 className="font-bold uppercase text-lg">Qualidade de Vida</h4>
                    <p className="text-sm opacity-80 mt-1">Custos acessíveis, segurança e ativos naturais preservados. Ideal para teletrabalho e famílias jovens.</p>
                 </div>
             </ReportCard>
             
             <ReportCard className="bg-eco-bg p-6 flex items-start gap-4" noShadow>
                 <div className="w-12 h-12 bg-white border-2 border-eco-ink flex items-center justify-center text-xl shrink-0"><i className="fa-solid fa-road"></i></div>
                 <div>
                    <h4 className="font-bold uppercase text-lg">Coesão Territorial</h4>
                    <p className="text-sm opacity-80 mt-1">Investimento de <strong className="text-eco-ink">17,7 M€</strong> (CIM 2026) em mobilidade sustentável e redes digitais.</p>
                 </div>
             </ReportCard>
         </div>
    </div>
);

const VisionFinal = () => (
    <div className="h-full flex flex-col justify-center items-center text-center px-10 bg-eco-ink text-white border-2 border-eco-ink relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(210,242,32,0.1)_25%,rgba(210,242,32,0.1)_50%,transparent_50%,transparent_75%,rgba(210,242,32,0.1)_75%,rgba(210,242,32,0.1)_100%)] bg-[length:20px_20px]"></div>

        <div className="relative z-10 w-full max-w-6xl grid grid-cols-2 gap-12 items-center">
            
            <div className="text-left">
                <span className="bg-eco-lime text-eco-ink px-4 py-1 font-mono font-bold text-sm uppercase mb-6 inline-block shadow-[4px_4px_0px_0px_white]">Visão 2030</span>
                <h2 className="font-display font-bold text-5xl mb-6 uppercase leading-tight">
                    Reindustrialização<br/><span className="text-eco-lime">Verde</span> & <br/><span className="text-eco-sky">Economia Azul</span>
                </h2>
                <div className="h-1 w-24 bg-white mb-6"></div>
                <p className="text-xl font-medium leading-relaxed opacity-90">
                    "Um território autêntico, inovador e sustentável."
                </p>
            </div>

            <div className="flex flex-col gap-6">
                <div className="bg-white/10 p-6 backdrop-blur-sm border-l-4 border-eco-lime">
                    <h4 className="font-bold uppercase text-xl mb-2 text-eco-lime flex items-center gap-3">
                        <i className="fa-solid fa-leaf"></i> Simbiose Industrial
                    </h4>
                    <p className="text-sm text-gray-200">Integração profunda entre indústria avançada e preservação ambiental. Economia circular como norma.</p>
                </div>

                <div className="bg-white/10 p-6 backdrop-blur-sm border-l-4 border-eco-sky">
                    <h4 className="font-bold uppercase text-xl mb-2 text-eco-sky flex items-center gap-3">
                        <i className="fa-solid fa-wind"></i> Transição Energética
                    </h4>
                    <p className="text-sm text-gray-200">Eólica offshore, solar e hidrogénio verde. Autonomia energética regional e descarbonização.</p>
                </div>

                <div className="bg-white/10 p-6 backdrop-blur-sm border-l-4 border-white">
                    <h4 className="font-bold uppercase text-xl mb-2 text-white flex items-center gap-3">
                        <i className="fa-solid fa-globe"></i> Competitividade
                    </h4>
                    <p className="text-sm text-gray-200">Valorização de produtos endógenos e cooperação transfronteiriça com a Galiza.</p>
                </div>
            </div>
        </div>
    </div>
);

const Ris3Specialization = () => (
    <div className="grid grid-cols-12 gap-8 h-full">
        <div className="col-span-4 flex flex-col justify-center">
            <div className="mb-8">
                <span className="bg-eco-ink text-white px-3 py-1 text-xs font-bold uppercase rounded-sm">RIS3 NORTE 2027</span>
            </div>
            <h3 className="font-display font-bold text-4xl uppercase mb-6 leading-tight">Especialização Inteligente</h3>
            <p className="text-lg opacity-80 leading-relaxed mb-6">
                Domínios prioritários definidos para a Região Norte, onde o Alto Minho apresenta vantagens competitivas e potencial de diferenciação.
            </p>
            <ReportCard lime>
                <div className="flex items-center gap-3 mb-2">
                    <i className="fa-solid fa-crosshairs text-xl"></i>
                    <h4 className="font-bold uppercase text-sm">Foco Estratégico</h4>
                </div>
                <p className="text-sm">Concentração de recursos em áreas de maior potencial de inovação e valor acrescentado.</p>
            </ReportCard>
        </div>
        <div className="col-span-8 grid grid-cols-2 gap-4 content-center">
            {[
                {t: "Criatividade, Moda e Habitats", i: "fa-shirt", c: "bg-purple-100"},
                {t: "Industrialização e Sistemas Avançados", i: "fa-gears", c: "bg-blue-100"},
                {t: "Sistemas Agroambientais e Alimentação", i: "fa-wheat-awn", c: "bg-green-100"},
                {t: "Mobilidade Sustentável e Energia", i: "fa-charging-station", c: "bg-yellow-100"},
                {t: "Ciências da Vida e Saúde", i: "fa-heart-pulse", c: "bg-red-100"},
                {t: "Ativos Territoriais e Turismo", i: "fa-map-location-dot", c: "bg-orange-100"},
                {t: "Recursos e Economia do Mar", i: "fa-water", c: "bg-cyan-100"},
                {t: "Tecnologias, Estado e Sociedade", i: "fa-network-wired", c: "bg-gray-100"},
            ].map((item, i) => (
                <div key={i} className={`p-4 border-2 border-eco-ink flex items-center gap-4 hover:shadow-hard transition-all cursor-default ${item.c}`}>
                    <div className="w-10 h-10 bg-white border border-eco-ink rounded-full flex items-center justify-center shrink-0">
                        <i className={`fa-solid ${item.i} text-eco-ink`}></i>
                    </div>
                    <span className="font-bold text-sm uppercase leading-tight">{item.t}</span>
                </div>
            ))}
        </div>
    </div>
);

const SmartTerritoryENTI = () => (
    <div className="grid grid-cols-12 gap-8 h-full">
        <div className="col-span-5 flex flex-col h-full">
            <div className="mb-6">
                <span className="bg-eco-lime text-eco-ink px-3 py-1 text-xs font-bold uppercase">ENTI</span>
                <h3 className="font-display font-bold text-4xl uppercase mt-2 leading-tight">Alto Minho como Território Inteligente</h3>
                <p className="font-mono text-sm text-eco-forest mt-1 font-bold">Economia, Inovação e Competitividade Territorial</p>
            </div>
            
            <p className="text-base opacity-80 leading-relaxed mb-8 flex-1">
                Territórios inteligentes utilizam conhecimento, inovação e governação colaborativa para reforçar a competitividade económica, atrair investimento e promover desenvolvimento sustentável.
                <br/><br/>
                No Alto Minho, esta visão articula-se com a <strong>Estratégia Alto Minho 2030</strong>, apostando na digitalização, inovação e qualificações como motores.
            </p>

            <ReportCard dark className="mt-auto">
                <p className="text-xs font-bold text-eco-lime uppercase mb-2">Mensagem-Chave</p>
                <p className="text-sm text-white leading-tight">Reforçar o posicionamento do Alto Minho como território inovador, competitivo e atrativo, articulando a ENTI com a Estratégia Alto Minho 2030, a RIS3 Norte e os objetivos do Portugal 2030.</p>
            </ReportCard>
        </div>

        <div className="col-span-7 flex flex-col gap-3 justify-center h-full">
             <div className="font-bold uppercase text-sm mb-2 border-b-2 border-eco-ink pb-2">Eixos de Atuação Económica</div>
             
             {[
                 {t: "Valorização Económica", d: "Especializações produtivas, recursos endógenos e capital humano (RIS3 Norte).", i: "fa-sack-dollar"},
                 {t: "Inovação & Transição Digital", d: "Modernização empresarial, transferência de conhecimento e adoção de tecnologia.", i: "fa-microchip"},
                 {t: "Ecossistemas Territoriais", d: "Ligação CIM, municípios, empresas e ensino superior (Redes Minho/Galiza).", i: "fa-share-nodes"},
                 {t: "Atração de Investimento", d: "Plataforma competitiva para atividades de valor acrescentado (Minho INovação).", i: "fa-magnet"},
                 {t: "Governação Inteligente", d: "Planeamento estratégico, uso de dados e políticas place-based.", i: "fa-gavel"},
             ].map((item, idx) => (
                 <div key={idx} className="bg-white border border-eco-ink p-4 flex items-start gap-4 shadow-sm hover:shadow-hard transition-all">
                     <div className="w-8 h-8 bg-eco-ink text-white flex items-center justify-center rounded-sm shrink-0 mt-1">
                         <i className={`fa-solid ${item.i} text-sm`}></i>
                     </div>
                     <div>
                         <h4 className="font-bold text-sm uppercase text-eco-ink">{item.t}</h4>
                         <p className="text-xs text-gray-600 mt-1">{item.d}</p>
                     </div>
                 </div>
             ))}
        </div>
    </div>
);

// --- App Component ---
const App = () => {
    const [slide, setSlide] = useState(0);

    const slides = [
        { comp: <CoverSlide onNext={() => setSlide(1)} />, title: "", sub: "" },
        { comp: <IndexSlide setSlide={setSlide} />, title: "Índice", sub: "Estrutura do Relatório" },
        { comp: <NationalContextMacro />, title: "Contexto Macro", sub: "Portugal 2024" },
        { comp: <SocioEconomics />, title: "Socioeconomia", sub: "Indicadores-Chave" },
        { comp: <BusinessDynamics />, title: "Dinâmica Empresarial", sub: "Tecido Económico" },
        { comp: <IndustryDetails />, title: "Indústria", sub: "Setor Transformador" },
        { comp: <TradeExports />, title: "Internacionalização", sub: "Comércio Externo" },
        { comp: <StrategicSectors />, title: "Setores Estratégicos", sub: "Têxtil & Calçado" },
        { comp: <TourismSlide />, title: "Turismo & Lazer", sub: "Sustentabilidade" },
        { comp: <Housing />, title: "Habitação & Território", sub: "Coesão" },
        { comp: <InnovationSlide />, title: "I&D e Inovação", sub: "Tecnologia" },
        { comp: <Ris3Specialization />, title: "Especialização", sub: "RIS3 Norte" },
        { comp: <SmartTerritoryENTI />, title: "Território Inteligente", sub: "Estratégia ENTI" },
        { comp: <VisionFinal />, title: "Visão 2030", sub: "Estratégia Futura" },
        { comp: <MethodologySlide />, title: "Metodologia", sub: "Fontes" },
    ];
    
    const totalSlides = slides.length;
    const nextSlide = () => setSlide(prev => Math.min(prev + 1, totalSlides - 1));
    const prevSlide = () => setSlide(prev => Math.max(prev - 1, 0));

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextSlide();
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevSlide();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const activeData = slides[slide];

    return (
        <div className="w-full h-full flex justify-center items-center bg-[#E0E0E0]">
            {slide === 0 ? (
                activeData.comp
            ) : (
                <MainLayout 
                    title={activeData.title} 
                    subtitle={activeData.sub}
                    activeSlide={slide} 
                    totalSlides={totalSlides} 
                    onNext={nextSlide} 
                    onPrev={prevSlide} 
                    setSlide={setSlide}
                >
                    {activeData.comp}
                </MainLayout>
            )}
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}