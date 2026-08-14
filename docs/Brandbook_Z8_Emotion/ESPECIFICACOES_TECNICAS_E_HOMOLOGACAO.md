# Especificações Técnicas, Esquema Elétrico & Homologação Z8 E-motion

Este manual contém a documentação técnica avançada dos veículos da linha **Z8 E-motion**, servindo de referência para engenheiros, vistoriadores do DETRAN, mecânicos credenciados e auditores de compliance.

---

## ⚡ 1. Arquitetura do Sistema Propulsor Elétrico

```mermaid
graph LR
    BATT[Bateria Lítio LiFePO4 / NMC] --> BMS[Battery Management System - BMS]
    BMS --> CTRL[Controlador Vetorial FOC]
    CTRL --> MOTOR[Motor BLDC Cobre Puro]
    SENS[Sensores Hall + Trottle Acceleration] --> CTRL
    CTRL --> LCD[Painel Digital CAN-bus / LCD]
```

### **1.1. Especificações dos Motores BLDC (Brushless DC)**
- **Motor 2000W (Z8 Tank & Harley X21)**: Motor trifásico sem escova de imã permanente (Neodímio N45H), eficiência energêtica > 90%, torque máximo de 125 Nm.
- **Motor 1500W (Z8 FX-10 Sport)**: Motor de cubo traseiro com resfriamento térmico aprimorado, velocidade operacional de até 68 km/h.
- **Motor 1200W (Z8 N7, N95C, U2 Delivery, Mini Q)**: Motor de cubo selado contra água e poeira (IP67).
- **Motor 400W-500W (Z8 Base Norte GS-005)**: Motor de engrenagem planetária de alto torque para aclives e transporte de cargas leves.

### **1.2. Química de Baterias & BMS**
- **Baterias de Lítio (NMC / LiFePO4)**:
  - Tensão Nominal: 60V a 72V.
  - Capacidade: Até 120Ah (Autonomia de 240km).
  - Ciclos de Vida: > 2.000 ciclos com retenção de 80% da capacidade.
  - **BMS Inteligente**: Proteção contra sobrecarga, sobredosagem, curto-circuito, desbalanceamento de células e desligamento térmico a 65°C.
- **Baterias de Chumbo-Ácido Seladas (VRLA/AGM)**:
  - Tensão: 48V / 60V / 72V (20Ah).
  - Autonomia média: 50km a 70km.

---

## 🔍 2. Decodificação do Chassi (VIN de 17 Dígitos)

Todo veículo Z8 E-motion possui gravado no tubo da caixa de direção um número de chassi universal padronizado (ISO 3779 / CONTRAN):

```
Exemplo VIN:  9 Z 8  E M 1 2 3 4  R  A  0 0 0 1 0 1
Posição:      1 2 3  4 5 6 7 8 9 10 11 12 13 14 15 16 17
              \---/  \-------/ |  |  \-----------/
               WMI     VDS     |  |       VIS
```

- **Posição 1-3 (WMI - World Manufacturer Identifier)**: `9Z8` (Identificador de Importador/Fabricante Z8 no Brasil).
- **Posição 4-8 (VDS - Vehicle Descriptor Section)**: `EM123` (Código do Modelo, ex: Tank, FX-10, N7).
- **Posição 9 (Dígito Verificador)**: Dígito matemático de validação.
- **Posição 10 (Ano do Modelo)**: `R` (2024), `S` (2025), `T` (2026).
- **Posição 11 (Planta de Montagem)**: `A` (Fábrica Principal), `B` (CKD Brasil).
- **Posição 12-17 (VIS - Número de Série)**: Sequencial de produção de 6 dígitos.

---

## 📄 3. Checklist de Homologação & Emplacamento no DETRAN

```checklist
- [x] Laudo de Frenagem e Estabilidade (Conforme ABNT NBR / ISO veicular)
- [x] Memorial Descritivo assinado por Engenheiro Mecânico (ART CREA)
- [x] Concessão do Certificado de Adequação à Legislação de Trânsito (CAT SENATRAN)
- [x] Pré-cadastro do VIN no sistema SISCOLSWING / RENAVAM
- [x] Emissão de Nota Fiscal com indicação clara do Código Marca/Modelo/Versão
- [x] Selo de Licenciamento Ambiental IBAMA / CONAMA 401/2008 para Baterias
```
