#!/usr/bin/env python3
"""
ULTRATHINK: Análise completa da arquitetura de geração HTML
Mapeia todas as interdependências e fluxo de dados
"""

import re
from pathlib import Path

def analyze_html_architecture():
    content = Path("mr-fix-my-project-please.py").read_text()
    
    # Find all HTML generation methods
    html_methods = re.findall(r'def (_generate_\w+_html[^(]*)\(self[^)]*\) -> str:', content)
    
    print("="*88)
    print("🔍 MAPEAMENTO COMPLETO DA ARQUITETURA HTML")
    print("="*88)
    print(f"\n📊 Total de funções de geração HTML: {len(html_methods)}")
    
    # Analyze each method
    print("\n📋 INVENTÁRIO DE FUNÇÕES HTML:\n")
    
    for i, method in enumerate(html_methods, 1):
        # Find method in content
        pattern = rf'def {re.escape(method)}\(self[^)]*\) -> str:(.*?)(?=\n    def |\nclass |\Z)'
        match = re.search(pattern, content, re.DOTALL)
        
        if match:
            method_body = match.group(1)
            
            # Find what data it uses (self.xxx)
            data_sources = set(re.findall(r'self\.(\w+)', method_body))
            
            # Find what methods it calls
            method_calls = set(re.findall(r'self\.(_\w+)\(', method_body))
            
            # Check if it's called by main generate_html_report
            is_main = "generate_html_report" in method and "_optimized" not in method and "_compact" not in method
            
            print(f"{i:2d}. {method}()")
            print(f"    📦 Dados consumidos: {len(data_sources)} sources")
            if data_sources:
                main_sources = [s for s in data_sources if s in ['duplicate_analysis', 'tech_stack', 'temporal_analysis', 
                                                                   'directory_purposes', 'ecosystem_intelligence', 
                                                                   'surface_scan', 'performance_metrics']]
                if main_sources:
                    print(f"       └─ {', '.join(main_sources[:5])}")
            
            print(f"    🔗 Chama: {len(method_calls)} outros métodos")
            if method_calls:
                html_calls = [c for c in method_calls if 'generate' in c or 'html' in c]
                if html_calls:
                    print(f"       └─ {', '.join(html_calls[:3])}")
            
            if is_main:
                print(f"    ⭐ MÉTODO PRINCIPAL")
            print()
    
    # Find the main orchestrator
    print("\n" + "="*88)
    print("🎯 ANÁLISE DO ORQUESTRADOR PRINCIPAL")
    print("="*88)
    
    # Find generate_html_report in UltraThinkMermaidMaximizer
    ultra_pattern = r'class UltraThinkMermaidMaximizer:.*?def generate_html_report\(self, results: dict\) -> str:(.*?)(?=\n    def |\Z)'
    ultra_match = re.search(ultra_pattern, content, re.DOTALL)
    
    if ultra_match:
        orchestrator_body = ultra_match.group(1)
        
        # Find all section calls
        section_calls = re.findall(r'self\.(_generate_\w+_html[^(]*)\(', orchestrator_body)
        
        print(f"\n📍 Localização: UltraThinkMermaidMaximizer.generate_html_report()")
        print(f"📊 Total de seções geradas: {len(set(section_calls))}")
        print(f"\n📋 ORDEM DE GERAÇÃO DAS SEÇÕES:\n")
        
        seen = set()
        for i, call in enumerate(section_calls, 1):
            if call not in seen:
                seen.add(call)
                print(f"  {i:2d}. {call}()")
    
    # Analyze data flow
    print("\n" + "="*88)
    print("🔄 FLUXO DE DADOS (De onde vêm os dados para o HTML)")
    print("="*88)
    
    # Find where results dict is populated
    results_pattern = r'results\[(["\'])(.*?)\1\]\s*='
    results_assignments = re.findall(results_pattern, content)
    
    print(f"\n📦 Dados armazenados em 'results' dict: {len(set(r[1] for r in results_assignments))}")
    print("\nPrincipais chaves do dict 'results':\n")
    
    seen_keys = set()
    for _, key in results_assignments[:30]:
        if key not in seen_keys:
            seen_keys.add(key)
            print(f"  • results['{key}']")
    
    print("\n" + "="*88)
    print("💡 CONCLUSÕES")
    print("="*88)
    print("""
1. PROBLEMA IDENTIFICADO:
   - 27+ funções de geração HTML ESPALHADAS
   - Cada uma acessa self.xxx diretamente (acoplamento)
   - Cada uma define seus próprios estilos inline
   - ZERO abstração ou camada intermediária
   
2. FLUXO ATUAL (PROBLEMÁTICO):
   Analysis Data → self.xxx → _generate_xxx_html() → HTML inline styles
   
3. FLUXO IDEAL (CENTRALIZADO):
   Analysis Data → Registry → Transformer → Components → HTML clean
   
4. PRÓXIMO PASSO:
   Criar CONTENT_REGISTRY centralizado que todas as funções consultam
    """)

if __name__ == "__main__":
    analyze_html_architecture()
