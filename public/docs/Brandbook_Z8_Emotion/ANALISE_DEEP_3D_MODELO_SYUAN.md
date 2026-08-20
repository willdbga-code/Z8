# Análise Profunda 3D & Engenharia do Modelo Scooter Z8 Syuan Emerald

Este documento apresenta a desconstrução tridimensional e engenharia detalhada das imagens de referência contidas na pasta `3D/` para a criação da modelagem mesh 3D e renderização em tempo real na plataforma Z8 E-motion.

---

## 📸 1. Análise Visual & Geometria das 6 Fotografias

```
  [ VISTA FRONTAL 3/4 ]             [ VISTA DO COCKPIT ]            [ VISTA TRASEIRA 3/4 ]
  Carenagem Verde Esmeralda          Painel Digital LCD Colorido      Lanterna LED Bar Horizontal
  Farol Retangular LED DRL           Manoplas com Comandos R/1-2-3    Amortecedores Duplos Pretos
  Roda Liga 5 Rais / Freio Disco     Porta-Objetos & Gancho Bolsa     Para-lama Hugger Traseiro
```

### **1.1. Dimensões & Proporções Tridimensionais Estimadas**
- **Comprimento Total (mm)**: 1.680 mm
- **Largura do Guidão (mm)**: 690 mm
- **Altura Total (mm)**: 1.080 mm (sem espelhos) / 1.250 mm (com espelhos)
- **Altura do Assento (mm)**: 740 mm
- **Entre-eixos (mm)**: 1.190 mm
- **Vão Livre do Solo (mm)**: 145 mm
- **Rodas & Pneus**: Aros de liga leve 10" com pneus sem câmara (*tubeless*) 3.00-10.

---

## 📐 2. Desconstrução Mesh por Componentes (Component Hierarchy)

### **A. Carenagem Frontal & Conjunto Óptico (Front Shield Assembly)**
- **Escudo Superior**: Superfície contínua de curvatura suave moldada em ABS injetado com pintura esmalte esmeralda metálico brilho (`HEX #006847`). Possui emblema "SYU" vermelho em relevo.
- **Bloco do Farol**: Lente acrílica cristal transparente selada abrigando 3 módulos LED DRL quadrangulares de alta intensidade com moldura interna em policarbonato preto fosco.
- **Carenagem Inferior & Garfo**: Carenagem de transição em preto fosco com adesivos refletivos listrados em diagonal (estilo alerta/esportiva) e branding "SYUAN".

### **B. Guidão, Cockpit & Display LCD (Handlebar & Cockpit)**
- **Capa do Guidão**: Carcaça aerodinâmica em preto brilhante integrada ao visor do painel.
- **Painel Digital LCD**: Visor de cristal líquido retroiluminado com tela escura mostrando:
  - Tensão da bateria em tempo real: `50.1V`
  - Indicador de Marcha / Modo: `P` (Park), `1`, `2`, `3`
  - Velocímetro digital e odômetro de viagem.
  - Indicadores luminosos de setas, farol alto e modo Ré (`R`).
- **Comandos dos Punhos**:
  - *Esquerdo*: Chave de seta, buzina, comutador de farol alto/baixo e botão seletor de marcha à ré (`R`).
  - *Direito*: Seletor deslizante de 3 velocidades (`1-2-3`), botão liga/desliga farol e pisca-alerta.
- **Painel Interno das Pernas**: Plástico injetado preto de textura de couro com porta-garrafa/porta-objetos e gancho retrátil para bolsas.

### **C. Assoalho & Deck de Pés (Floorboard & Battery Deck)**
- **Plataforma Plana**: Piso em liga plástica reforçada revestido por tapete de borracha vulcanizada com frisos antiderrapantes longitudinais e fixação por parafusos sextavados inoxidáveis na periferia.
- **Compartimento da Bateria**: Localizado sob o piso e assento, com suporte para pacote de baterias de Lítio removível ou Chumbo-Ácido.

### **D. Assento & Carenagem Traseira (Seat & Rear Bodywork)**
- **Assento**: Banco bipartido acolchoado em espuma injetada de alta densidade revestido em vinil náutico preto impermeável com costura dupla reforçada.
- **Carenagens Laterais Traseiras**: Painéis convexos verdes com o grafismo vetorizado "S" na cor branca, contorno inferior laranja e detalhes de ventilação.
- **Suporte de Carga & Lanterna Traseira**: Estrutura tubular em aço carbono preto fosco com lanterna bar horizontal LED integrada, lente vermelha/cristal e suporte de placa de licença.
- **Suspensão & Motor**: Duplo amortecedor traseiro hidráulico com molas helicoidais pretas e motor de cubo selado (BLDC 1200W) com capa protetora lateral em resina reforçada.

---

## 🎨 3. Especificações de Materiais & Shaders Three.js

| Elemento Mesh | Tipo de Material Three.js | Parâmetros PBR (Physically Based Rendering) |
| :--- | :--- | :--- |
| **Carenagem Verde Esmeralda** | `MeshPhysicalMaterial` | `color: 0x006847`, `roughness: 0.15`, `metalness: 0.3`, `clearcoat: 1.0`, `clearcoatRoughness: 0.1` |
| **Plásticos Pretos Foscos** | `MeshStandardMaterial` | `color: 0x1a1a1a`, `roughness: 0.75`, `metalness: 0.1` |
| **Lente Farol LED** | `MeshPhysicalMaterial` | `color: 0xffffff`, `transmission: 0.9`, `opacity: 0.95`, `transparent: true`, `roughness: 0.05` |
| **Emissivo LED (Aceso)** | `MeshBasicMaterial` / Emissive | `color: 0xffffff`, `emissive: 0x00f0ff`, `emissiveIntensity: 2.5` |
| **Pneus de Borracha** | `MeshStandardMaterial` | `color: 0x111111`, `roughness: 0.85`, `metalness: 0.05` |
| **Rodas de Liga Leve** | `MeshStandardMaterial` | `color: 0x222222`, `roughness: 0.35`, `metalness: 0.85` |
| **Espelhos Retrovisores** | `MeshStandardMaterial` | `color: 0xffffff`, `metalness: 0.95`, `roughness: 0.05` (Reflexivo) |
