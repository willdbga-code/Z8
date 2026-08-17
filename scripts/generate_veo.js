#!/usr/bin/env node
/**
 * Z8 E-Motion - Gerador Automático de Vídeos com Google Veo (Node.js)
 * Usa o SDK oficial @google/genai
 * 
 * Uso:
 *   node scripts/generate_veo.js --preset tank-paulista
 *   node scripts/generate_veo.js --preset fx10-sjc
 *   node scripts/generate_veo.js --list
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MODELS_DIR = path.join(ROOT_DIR, 'public', 'assets', 'models');
const VIDEOS_DIR = path.join(ROOT_DIR, 'public', 'assets', 'videos');

const PRESETS = {
  'tank-paulista': {
    title: 'Z8 Tank High-Speed na Av. Paulista (São Paulo)',
    image: path.join(MODELS_DIR, 'z8_tank_paulista_wide.jpg'),
    output: 'z8_tank_paulista_veo.mp4',
    prompt:
      'Cinematic tracking drone shot moving smoothly around the Z8 Tank High-Speed electric motorcycle ' +
      'parked on the red central bike lane of Avenida Paulista in São Paulo. Golden hour sunset light ' +
      'glances across the matte yellow fairings and black tubular frame. In the background, ' +
      'the iconic MASP museum with red pillars and skyscrapers glow with warm light. ' +
      'Natural wind, subtle camera orbit, 8k automotive commercial, photorealistic motion blur, 60fps.',
    aspectRatio: '16:9',
    durationSeconds: 5
  },
  'tank-headlight': {
    title: 'Z8 Tank Close Farol Halo LED (Golden Hour)',
    image: path.join(MODELS_DIR, 'z8_tank_paulista_headlight.jpg'),
    output: 'z8_tank_headlight_veo.mp4',
    prompt:
      'Extreme macro slow push-in shot on the glowing twin circular halo LED headlights of the Z8 Tank motorcycle. ' +
      'Warm golden hour lighting reveals fine textures of the steel protective grille and matte yellow cowl. ' +
      'In the background, the soft bokeh lights of Avenida Paulista shift smoothly with shallow depth of field. ' +
      'Ultra crisp automotive detail, cinematic optical lens flare, 4k 60fps.',
    aspectRatio: '16:9',
    durationSeconds: 5
  },
  'fx10-sjc': {
    title: 'Z8 FX-10 Sport em São José dos Campos (Av. Adhemar de Barros)',
    image: path.join(MODELS_DIR, 'z8_fx10_sjc_wide.jpg'),
    output: 'z8_fx10_sjc_veo.mp4',
    prompt:
      'Smooth low-angle cinematic tracking shot gliding alongside the Z8 FX-10 Sport electric scooter ' +
      'on the palm-lined promenade of Avenida Adhemar de Barros in São José dos Campos. Warm late-afternoon ' +
      'sunlight highlights the matte carbon-fiber textures, sharp aerodynamic lines, and glowing cyan-white ' +
      'LED light strips. Imperial palm trees and upscale residential architecture glide in parallax. ' +
      'High-end automotive commercial, pristine reflections, ultra-realistic motion, 60fps.',
    aspectRatio: '16:9',
    durationSeconds: 5
  },
  'fx10-capivari': {
    title: 'Z8 FX-10 Sport em Campos do Jordão (Vila Capivari)',
    image: path.join(MODELS_DIR, 'z8_fx10_capivari_wide.jpg'),
    output: 'z8_fx10_capivari_veo.mp4',
    prompt:
      'Cinematic slow panning camera gliding across the cobblestone square of Vila Capivari in Campos do Jordão, ' +
      'framing the sleek carbon-black Z8 FX-10 Sport electric scooter. In the background, Swiss alpine chalets, ' +
      'cozy bistro string lights, and tall Araucária pine trees glow under a golden hour mountain sunset. ' +
      'Atmospheric mountain dusk, smooth camera stabilization, 4k editorial quality.',
    aspectRatio: '16:9',
    durationSeconds: 5
  },
  'u2-warehouse': {
    title: 'Z8 U2 Delivery Cargo no Galpão de Fulfillment (Shopee / Mercado Livre)',
    image: path.join(MODELS_DIR, 'z8_u2_warehouse_wide.jpg'),
    output: 'z8_u2_warehouse_veo.mp4',
    prompt:
      'Cinematic tracking drone shot moving smoothly past the Z8 U2 Delivery Cargo electric scooter ' +
      'inside a modern high-tech e-commerce logistics fulfillment distribution center. Polished epoxy floor reflections, ' +
      'towering storage racks filled with shipping packages, automated conveyor belts, and bright industrial LED lighting. ' +
      'The safety orange tubular frame and glowing circular halo LED headlight stand out with crisp commercial reflections, 60fps.',
    aspectRatio: '16:9',
    durationSeconds: 5
  },
  'harley-carvalhopinto': {
    title: 'Z8 Harley X21 Custom na Rodovia Carvalho Pinto (SP-070)',
    image: path.join(MODELS_DIR, 'z8_harley_carvalho_wide.jpg'),
    output: 'z8_harley_carvalho_veo.mp4',
    prompt:
      'Cinematic highway tracking drone shot following the Z8 Harley X21 Custom electric chopper motorcycle ' +
      'cruising along the smooth asphalt curves of Rodovia Carvalho Pinto (SP-070). Polished chrome ape-hanger ' +
      'handlebars and satin black teardrop bodywork gleaming under a breathtaking golden hour sunset horizon. ' +
      'Rolling green hills of Vale do Paraíba, modern viaducts, wide open road freedom, high-end 8k automotive commercial, 60fps.',
    aspectRatio: '16:9',
    durationSeconds: 5
  },
  'q10-madalena': {
    title: 'Z8 Q10 Vintage na Vila Madalena (Café Bistrô & Paralelepípedos)',
    image: path.join(MODELS_DIR, 'z8_q10_madalena_wide.jpg'),
    output: 'z8_q10_madalena_veo.mp4',
    prompt:
      'Cinematic low-angle slow push-in shot along the cobblestone street in Vila Madalena, São Paulo, ' +
      'framing the elegant gunmetal titanium Z8 Q10 Vintage electric scooter outside a charming coffee shop bistro. ' +
      'Warm golden afternoon sunlight, rich brown leather saddle textures, and glowing circular halo LED headlight ' +
      'contrasting with lush green terrace plants and ambient string lights. 4k 60fps automotive editorial.',
    aspectRatio: '16:9',
    durationSeconds: 5
  },
  'n710-farialima': {
    title: 'Z8 N710 Urban Plus na Av. Faria Lima (Distrito Financeiro)',
    image: path.join(MODELS_DIR, 'z8_n710_farialima_wide.jpg'),
    output: 'z8_n710_farialima_veo.mp4',
    prompt:
      'Cinematic smooth tracking camera orbiting around the deep emerald green Z8 N710 Urban Plus electric scooter ' +
      'parked on a sleek pedestrian plaza on Avenida Brigadeiro Faria Lima in São Paulo during twilight blue hour. ' +
      'Horizontal glowing mecha LED light bar reflecting off modern glass skyscraper facades and polished granite floor. ' +
      'Futuristic urban mobility aesthetic, pristine 8k commercial quality, 60fps.',
    aspectRatio: '16:9',
    durationSeconds: 5
  },
  'tank-minas': {
    title: 'Z8 Tank High-Speed em Trilha Off-Road no Interior de Minas Gerais',
    image: path.join(MODELS_DIR, 'z8_tank_minas_wide.jpg'),
    output: 'z8_tank_minas_veo.mp4',
    prompt:
      'Cinematic slow tracking drone shot rising smoothly above the Z8 Tank High-Speed electric adventure motorcycle ' +
      'parked on a rugged, muddy red clay dirt trail in the rural rolling green mountains of Minas Gerais, Brazil. ' +
      'Morning golden mist swirling through the valleys, rustic wooden fences, and wet red clay mud reflecting the sunrise light. ' +
      'The glowing dual circular halo LED headlights shine brightly with pristine high-torque off-road commercial quality, 60fps.',
    aspectRatio: '16:9',
    durationSeconds: 5
  }
};

async function run() {
  const args = process.argv.slice(2);
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (args.includes('--list') || args.includes('-l')) {
    console.log('\n🎬 PRESETS CINEMATOGRÁFICOS DISPONÍVEIS:');
    console.log('-------------------------------------------------------');
    for (const [key, p] of Object.entries(PRESETS)) {
      console.log(`🔹 ${key.padEnd(16)} : ${p.title}`);
      console.log(`   Arquivo Saída    : ${p.output}\n`);
    }
    return;
  }

  if (!apiKey) {
    console.error('\n⚠️  GEMINI_API_KEY não encontrada no seu arquivo .env!');
    console.error('👉 Crie ou edite o arquivo .env e adicione sua chave: GEMINI_API_KEY=sua_chave_aqui');
    console.error('👉 Obtenha sua chave gratuita em: https://aistudio.google.com/\n');
    process.exit(1);
  }

  const presetArgIndex = args.indexOf('--preset');
  const presetKey = presetArgIndex !== -1 ? args[presetArgIndex + 1] : 'tank-paulista';
  const preset = PRESETS[presetKey] || PRESETS['tank-paulista'];

  console.log('\n=======================================================');
  console.log('🚀 Z8 E-MOTION - GERADOR DE VÍDEO GOOGLE VEO (Node.js)');
  console.log('=======================================================');
  console.log(`🎬 Preset Selecionado: ${preset.title}`);
  console.log(`📐 Formato: ${preset.aspectRatio} | Duração: ${preset.durationSeconds}s`);
  console.log(`🖼️  Imagem Base: ${path.basename(preset.image)}`);
  console.log(`📝 Prompt: ${preset.prompt.slice(0, 90)}...\n`);

  if (!fs.existsSync(VIDEOS_DIR)) {
    fs.mkdirSync(VIDEOS_DIR, { recursive: true });
  }

  const outputPath = path.join(VIDEOS_DIR, preset.output);
  const ai = new GoogleGenAI({ apiKey });

  try {
    let imagePayload = undefined;
    if (fs.existsSync(preset.image)) {
      const buffer = fs.readFileSync(preset.image);
      imagePayload = {
        imageBytes: buffer.toString('base64'),
        mimeType: preset.image.endsWith('.png') ? 'image/png' : 'image/jpeg'
      };
    }

    console.log('⏳ Enviando requisição para a nuvem do Google Veo...');
    const startTime = Date.now();

    let operation = await ai.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: preset.prompt,
      image: imagePayload,
      config: {
        aspectRatio: preset.aspectRatio,
        durationSeconds: preset.durationSeconds
      }
    });

    const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let idx = 0;

    while (!operation.done) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      process.stdout.write(`\r${spinner[idx % spinner.length]} Renderizando com Google Veo... (${elapsed}s decorridos)`);
      idx++;
      await new Promise((res) => setTimeout(res, 5000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    console.log('\n\n🎉 Renderização concluída com sucesso!');
    const video = operation.response?.generatedVideos?.[0];

    if (video?.video?.videoBytes) {
      const videoBuffer = Buffer.from(video.video.videoBytes, 'base64');
      fs.writeFileSync(outputPath, videoBuffer);
      const sizeMb = (fs.statSync(outputPath).size / (1024 * 1024)).toFixed(2);
      console.log(`💾 Vídeo salvo em: ${outputPath}`);
      console.log(`📦 Tamanho: ${sizeMb} MB`);
      console.log(`⏱️  Tempo total: ${Math.floor((Date.now() - startTime) / 1000)}s`);
      console.log('🌐 Pronto para uso no site Z8 E-Motion!');
    } else {
      console.log('⚠️ Vídeo gerado sem bytes diretos. Verifique a resposta da API.');
    }
  } catch (err) {
    console.error('\n❌ Erro ao processar chamada do Veo:', err.message);
    console.error('💡 Certifique-se de que sua API Key tenha permissão de acesso ao Veo no Google AI Studio / Vertex AI.');
  }
}

run();
