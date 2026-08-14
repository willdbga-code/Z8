#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
Z8 E-Motion - CRM & Sales Analytics Data Engine (Python 3)
Análise de dados de captação de leads, estatísticas de vendas e exportação Excel
=============================================================================
"""

import os
import json
import csv
from datetime import datetime

# Sample / Default Leads Data for offline analysis & testing
DEFAULT_LEADS_DATA = [
    {
        "id": "lead_demo_01",
        "name": "Roberto Andrade",
        "company": "Motos & Cia Ltda",
        "city": "Ribeirão Preto",
        "state": "SP",
        "email": "roberto@motosecia.com.br",
        "phone": "(16) 99876-5432",
        "paymentMethod": "PIX",
        "status": "fechado",
        "estimatedRevenue": 2989.00,
        "createdAt": "2026-08-13T10:30:00.000Z"
    },
    {
        "id": "lead_demo_02",
        "name": "Juliana Mendes",
        "company": "E-Scooter Brasil",
        "city": "Campinas",
        "state": "SP",
        "email": "contato@escooterbrasil.com",
        "phone": "(19) 99123-4567",
        "paymentMethod": "Cartão 12x",
        "status": "proposta",
        "estimatedRevenue": 2989.00,
        "createdAt": "2026-08-14T09:15:00.000Z"
    },
    {
        "id": "lead_demo_03",
        "name": "Carlos Eduardo Silva",
        "company": "Auto Veloce Mobilidade",
        "city": "Belo Horizonte",
        "state": "MG",
        "email": "carlos@autoveloce.com.br",
        "phone": "(31) 98888-7777",
        "paymentMethod": "PIX",
        "status": "em_contato",
        "estimatedRevenue": 2989.00,
        "createdAt": "2026-08-14T11:45:00.000Z"
    },
    {
        "id": "lead_demo_04",
        "name": "Fernanda Lima",
        "company": "Green Motion E-Bikes",
        "city": "Curitiba",
        "state": "PR",
        "email": "fernanda@greenmotion.com",
        "phone": "(41) 99777-6666",
        "paymentMethod": "PIX",
        "status": "fechado",
        "estimatedRevenue": 2989.00,
        "createdAt": "2026-08-14T13:20:00.000Z"
    }
]

def run_crm_analytics():
    print("=" * 70)
    print("📊 Z8 E-MOTION - MOTOR DE ANÁLISE DE DADOS E CRM DE VENDAS")
    print("=" * 70)

    leads = DEFAULT_LEADS_DATA
    
    total_leads = len(leads)
    status_counts = {}
    city_set = set()
    state_counts = {}
    total_revenue = 0.0

    for lead in leads:
        st = lead.get('status', 'novo')
        status_counts[st] = status_counts.get(st, 0) + 1
        
        city = lead.get('city', 'Desconhecida')
        city_set.add(city.lower().strip())
        
        state = lead.get('state', 'UF')
        state_counts[state] = state_counts.get(state, 0) + 1
        
        total_revenue += float(lead.get('estimatedRevenue', 2989.0))

    closed_leads = status_counts.get('fechado', 0)
    conversion_rate = (closed_leads / total_leads * 100) if total_leads > 0 else 0.0

    print(f"\n📈 METRICAS PRINCIPAIS:")
    print(f"  • Total de Leads Captados: {total_leads}")
    print(f"  • Cidades Com Exclusividade Reservada: {len(city_set)}")
    print(f"  • Faturamento Bruto Estimado: R$ {total_revenue:,.2f}")
    print(f"  • Taxa de Conversão em Vendas (Fechado): {conversion_rate:.1f}%")

    print(f"\n🏷️ DISTRIBUIÇÃO POR STATUS DO CRM:")
    for status, count in status_counts.items():
        pct = (count / total_leads * 100) if total_leads > 0 else 0
        print(f"  • {status.upper():<12}: {count} leads ({pct:.1f}%)")

    print(f"\n📍 COBERTURA REGIONAL POR ESTADO (UF):")
    for uf, count in state_counts.items():
        print(f"  • {uf}: {count} cidades/lojas parceiras")

    # Export to Excel / CSV
    export_dir = os.path.join(os.path.dirname(__file__), '../docs')
    os.makedirs(export_dir, exist_ok=True)
    csv_path = os.path.join(export_dir, 'relatorio_crm_z8.csv')

    fieldnames = ['ID', 'Nome', 'Empresa', 'Cidade', 'UF', 'Email', 'Telefone', 'FormaPagamento', 'ValorReserva', 'Status', 'DataCadastro']
    
    with open(csv_path, mode='w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, delimiter=';')
        writer.writeheader()
        for lead in leads:
            writer.writerow({
                'ID': lead.get('id'),
                'Nome': lead.get('name'),
                'Empresa': lead.get('company'),
                'Cidade': lead.get('city'),
                'UF': lead.get('state'),
                'Email': lead.get('email'),
                'Telefone': lead.get('phone'),
                'FormaPagamento': lead.get('paymentMethod'),
                'ValorReserva': f"{lead.get('estimatedRevenue', 2989):.2f}",
                'Status': lead.get('status'),
                'DataCadastro': lead.get('createdAt')
            })

    print(f"\n✅ Relatório analítico de CRM exportado com sucesso:")
    print(f"   📄 Arquivo CSV/Excel: {os.path.abspath(csv_path)}")
    print("=" * 70)

if __name__ == '__main__':
    run_crm_analytics()
