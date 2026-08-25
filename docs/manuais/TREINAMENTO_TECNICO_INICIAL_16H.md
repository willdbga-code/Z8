# ⚡ TREINAMENTO TÉCNICO INICIAL HOMOLOGADO (16 HORAS)
## **PROGRAMA OFICIAL DE CAPACITAÇÃO E CERTIFICAÇÃO TÉCNICA Z8 E-MOTION**

---

### **1. APRESENTAÇÃO DO PROGRAMA DE FORMAÇÃO TÉCNICA**

O programa de **Treinamento Técnico Inicial de 16 Horas** é o treinamento obrigatório exigido para todo mecânico, eletrotécnico ou responsável técnico de concessionárias e oficinas homologadas da **Z8 E-Motion**. 

Ao concluir os 4 módulos com aproveitamento prático mínimo de 80%, o profissional recebe o **Certificado Oficial de Técnico Credenciado Z8 E-Motion** e o crachá com QR Code de autenticação nacional.

---

### **2. GRADE CURRICULAR DETALHADA DOS 4 MÓDULOS (4H CADA)**

```
+-----------------------------------------------------------------------------------+
|                            GRADE CURRICULAR - 16 HORAS                            |
+-----------------------------------------------------------------------------------+
|  [ MÓDULO 1: 4 HORAS ]  | ENGENHARIA DE BATERIAS DE LÍTIO (LiFePO4/NMC) & BMS     |
|  [ MÓDULO 2: 4 HORAS ]  | CONTROLADORES ELETRÔNICOS FOC, CHICOTES & SENSORES HALL |
|  [ MÓDULO 3: 4 HORAS ]  | MOTORES BLDC BRUSHLESS NO CUBO & MECÂNICA DE TRAÇÃO     |
|  [ MÓDULO 4: 4 HORAS ]  | DIAGNÓSTICO AVANÇADO DE FALHAS, TESTES & PDI OFICIAL    |
+-----------------------------------------------------------------------------------+
```

---

### **MÓDULO 1 (4 Horas) – ENGENHARIA DE BATERIAS DE LÍTIO & BMS INTELIGENTE**

1. **Química e Física das Baterias de Tração Elétrica**:
   - Comparativo entre Íon de Lítio (NMC 18650 / 21700), Lítio Ferro-Fosfato (LiFePO4) e Baterias de Chumbo-Ácido Grafeno;
   - Curvas de carga (tensão vs capacidade) e taxas de descarga (1C, 2C e 3C de pico);
   - Efeito da temperatura ambiente na autonomia e degradação celular.
2. **Arquitetura e Funcionamento do BMS (Battery Management System)**:
   - Circuito de proteção contra Sobretensão (*Over-Voltage Protection - OVP: 4.25V/célula*);
   - Circuito de proteção contra Subtensão (*Under-Voltage Protection - UVP: 2.75V/célula*);
   - Proteção de sobrecorrente em aceleração e corte térmico com termistores NTC a 65°C;
   - Balanceamento ativo e passivo de células (desvio máximo tolerado: **0,03V entre blocos**).
3. **Protocolos de Segurança e Combate a Incêndio em Oficina**:
   - Procedimentos de armazenamento seguro em armário anti-chamas ventilado;
   - Manuseio de baterias que sofreram queda ou perfuração;
   - Uso de extintores de classe especial para Lítio e balde de areia seca para isolamento térmico.

---

### **MÓDULO 2 (4 Horas) – CONTROLADORES FOC (ONDA SENOIDAL), CHICOTE & SENSORES**

1. **Princípio de Operação dos Controladores FOC (Field Oriented Control)**:
   - Diferença entre controladores de onda quadrada (trapezoidal) e onda senoidal FOC;
   - Controle vetorial de torque, eficiência energética e suavidade de partida sem vibrações;
   - MOSFETs de potência e capacitores de desacoplamento de alta tensão (60V a 100V).
2. **Mapeamento de Linhas de Tensão e Chicote Elétrico**:
   - Linha de Alta Tensão (Bateria 48V/60V): Vermelho (+) e Preto (-);
   - Linha de Baixa Tensão (Conversor DC-DC 12V): Alimentação de setas, buzina, farol e alarme;
   - Linha de Referência 5V: Alimentação dos sensores Hall do motor e acelerador.
3. **Testes do Acelerador Eletrônico (Sensor Hall)**:
   - Pino Vermelho (+5V), Pino Preto (GND) e Pino Verde/Azul (Sinal de Retorno);
   - Leitura correta no multímetro: **0.8V a 1.0V em repouso | 3.8V a 4.2V em aceleração total**.

---

### **MÓDULO 3 (4 Horas) – MOTORES BLDC BRUSHLESS NO CUBO (HUB MOTOR) & MECÂNICA**

1. **Princípio Eletromagnético do Motor BLDC sem Escovas**:
   - Estator interno com bobinamento trifásico de cobre puro (Fases: U-Amarelo, V-Verde, W-Azul);
   - Rotor externo com imãs permanentes de Neodímio sinterizado (NdFeB de alta remanência);
   - Sensores de efeito Hall para sincronismo de disparo dos pulsos do controlador (ângulos de 120°).
2. **Diagnóstico e Manutenção do Motor de Cubo**:
   - Como testar os 3 sensores Hall do motor com multímetro (variação de 0V a 5V ao girar a roda manualmente);
   - Troca de rolamentos blindados 6204 / 6205 com extrator de precisão;
   - Aplicação de silicone de alta temperatura nas tampas laterais para garantir vedação estanque IP67.
3. **Mecânica de Rodagem e Freios**:
   - Ajuste de pré-carga da caixa de direção cônica;
   - Sangria e troca completa do fluido de freio sintético DOT 4.

---

### **MÓDULO 4 (4 Horas) – DIAGNÓSTICO DE FALHAS, BANCADA DE TESTES & PDI PRÁTICO**

1. **Árvore de Decisão e Diagnóstico de Falhas (Troubleshooting Guide)**:

```
[ MOTOR NÃO GIRA AO ACELERAR ]
  ├── 1. Verificar se a luz de freio está acesa direta ➔ Sensor de corte de freio travado.
  ├── 2. Medir tensão do acelerador no fio verde ➔ Se 0V = acelerador quebrado ou sem 5V.
  ├── 3. Medir tensão na entrada do controlador ➔ Se 0V = disjuntor desarmado ou BMS bloqueado.
  └── 4. Testar continuidade dos 3 fios de fase do motor ➔ Se aberto/curto = estator danificado.
```

2. **Tabela de Códigos de Erro no Display LCD**:
   - **Error 01**: Falha no sinal do acelerador eletrônico (fio rompido ou sensor Hall avariado).
   - **Error 02**: Proteção de subtensão ativada (bateria descarregada abaixo de 52V/42V).
   - **Error 03**: Falha em um ou mais sensores Hall do motor BLDC.
   - **Error 04**: Falha no interruptor de corte de freio (manete acionada).
   - **Error 05**: Sobreaquecimento do módulo controlador FOC (temperatura > 85°C).
3. **Exame Prático de Certificação**:
   - Execução de um checklist de PDI completo em 30 minutos em uma moto de bancada;
   - Identificação e reparo de 2 falhas elétricas induzidas pelo instrutor;
   - Emissão do Certificado de Técnico Credenciado Z8 E-Motion.
