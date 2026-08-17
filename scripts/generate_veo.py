#!/usr/bin/env python3
"""
Z8 E-Motion - Automação de Geração de Vídeo com Google Veo
Gera vídeos cinematográficos automotivos em alta resolução a partir de imagens ou prompts.

Uso:
  python scripts/generate_veo.py --preset tank-paulista
  python scripts/generate_veo.py --preset fx10-sjc
  python scripts/generate_veo.py --image public/assets/models/z8_tank_paulista_wide.jpg --prompt "Slow orbit drone shot" --output z8_custom.mp4
  python scripts/generate_veo.py --list-presets
"""

import os
import sys
import time
import argparse
from pathlib import Path
from dotenv import load_dotenv

# Garante compatibilidade UTF-8 no terminal Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Carrega variáveis de ambiente do .env
load_dotenv()

# Diretórios base
ROOT_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = ROOT_DIR / "public" / "assets" / "models"
VIDEOS_DIR = ROOT_DIR / "public" / "assets" / "videos"

# Presets pré-configurados de cena e direção de câmera
PRESETS = {
    "tank-paulista": {
        "title": "Z8 Tank High-Speed na Av. Paulista (São Paulo)",
        "image": MODELS_DIR / "z8_tank_paulista_wide.jpg",
        "output": "z8_tank_paulista_veo.mp4",
        "prompt": (
            "Cinematic tracking drone shot moving smoothly around the Z8 Tank High-Speed electric motorcycle "
            "parked on the red central bike lane of Avenida Paulista in São Paulo. The golden hour sunset light "
            "glances across the matte yellow ochre fairings and exposed black tubular steel frame. In the background, "
            "the iconic MASP museum with red pillars and soaring modern skyscrapers are illuminated with warm reflections. "
            "Natural wind, subtle camera orbit, high-end 8k automotive commercial, photorealistic motion blur, 60fps."
        ),
        "aspect_ratio": "16:9",
        "duration_seconds": 5
    },
    "tank-headlight": {
        "title": "Z8 Tank Close Farol Halo LED (Golden Hour)",
        "image": MODELS_DIR / "z8_tank_paulista_headlight.jpg",
        "output": "z8_tank_headlight_veo.mp4",
        "prompt": (
            "Extreme macro slow push-in shot on the glowing twin circular halo LED headlights of the Z8 Tank motorcycle. "
            "Warm golden hour lighting reveals fine textures of the steel protective grille and matte yellow cowl. "
            "In the background, the soft bokeh lights of Avenida Paulista shift smoothly with shallow depth of field. "
            "Ultra crisp automotive detail, cinematic optical lens flare, 4k 60fps."
        ),
        "aspect_ratio": "16:9",
        "duration_seconds": 5
    },
    "fx10-sjc": {
        "title": "Z8 FX-10 Sport em São José dos Campos (Av. Adhemar de Barros)",
        "image": MODELS_DIR / "z8_fx10_sjc_wide.jpg",
        "output": "z8_fx10_sjc_veo.mp4",
        "prompt": (
            "Smooth low-angle cinematic tracking shot gliding alongside the Z8 FX-10 Sport electric scooter "
            "on the palm-lined promenade of Avenida Adhemar de Barros in São José dos Campos. Warm late-afternoon "
            "sunlight highlights the matte carbon-fiber textures, sharp aerodynamic lines, and glowing cyan-white "
            "LED light strips. Imperial palm trees and upscale residential architecture glide in parallax. "
            "High-end automotive commercial, pristine reflections, ultra-realistic motion, 60fps."
        ),
        "aspect_ratio": "16:9",
        "duration_seconds": 5
    },
    "fx10-capivari": {
        "title": "Z8 FX-10 Sport em Campos do Jordão (Vila Capivari)",
        "image": MODELS_DIR / "z8_fx10_capivari_wide.jpg",
        "output": "z8_fx10_capivari_veo.mp4",
        "prompt": (
            "Cinematic slow panning camera gliding across the cobblestone square of Vila Capivari in Campos do Jordão, "
            "framing the sleek carbon-black Z8 FX-10 Sport electric scooter. In the background, Swiss alpine chalets, "
            "cozy bistro string lights, and tall Araucária pine trees glow under a golden hour mountain sunset. "
            "Atmospheric mountain dusk, smooth camera stabilization, 4k editorial quality."
        ),
        "aspect_ratio": "16:9",
        "duration_seconds": 5
    },
    "u2-warehouse": {
        "title": "Z8 U2 Delivery Cargo no Galpão de Fulfillment (Shopee / Mercado Livre)",
        "image": MODELS_DIR / "z8_u2_warehouse_wide.jpg",
        "output": "z8_u2_warehouse_veo.mp4",
        "prompt": (
            "Cinematic tracking drone shot moving smoothly past the Z8 U2 Delivery Cargo electric scooter "
            "inside a modern high-tech e-commerce logistics fulfillment distribution center. Polished epoxy floor reflections, "
            "towering storage racks filled with shipping packages, automated conveyor belts, and bright industrial LED lighting. "
            "The safety orange tubular frame and glowing circular halo LED headlight stand out with crisp commercial reflections, 60fps."
        ),
        "aspect_ratio": "16:9",
        "duration_seconds": 5
    },
    "harley-carvalhopinto": {
        "title": "Z8 Harley X21 Custom na Rodovia Carvalho Pinto (SP-070)",
        "image": MODELS_DIR / "z8_harley_carvalho_wide.jpg",
        "output": "z8_harley_carvalho_veo.mp4",
        "prompt": (
            "Cinematic highway tracking drone shot following the Z8 Harley X21 Custom electric chopper motorcycle "
            "cruising along the smooth asphalt curves of Rodovia Carvalho Pinto (SP-070). Polished chrome ape-hanger "
            "handlebars and satin black teardrop bodywork gleaming under a breathtaking golden hour sunset horizon. "
            "Rolling green hills of Vale do Paraíba, modern viaducts, wide open road freedom, high-end 8k automotive commercial, 60fps."
        ),
        "aspect_ratio": "16:9",
        "duration_seconds": 5
    },
    "q10-madalena": {
        "title": "Z8 Q10 Vintage na Vila Madalena (Café Bistrô & Paralelepípedos)",
        "image": MODELS_DIR / "z8_q10_madalena_wide.jpg",
        "output": "z8_q10_madalena_veo.mp4",
        "prompt": (
            "Cinematic low-angle slow push-in shot along the cobblestone street in Vila Madalena, São Paulo, "
            "framing the elegant gunmetal titanium Z8 Q10 Vintage electric scooter outside a charming coffee shop bistro. "
            "Warm golden afternoon sunlight, rich brown leather saddle textures, and glowing circular halo LED headlight "
            "contrasting with lush green terrace plants and ambient string lights. 4k 60fps automotive editorial."
        ),
        "aspect_ratio": "16:9",
        "duration_seconds": 5
    },
    "n710-farialima": {
        "title": "Z8 N710 Urban Plus na Av. Faria Lima (Distrito Financeiro)",
        "image": MODELS_DIR / "z8_n710_farialima_wide.jpg",
        "output": "z8_n710_farialima_veo.mp4",
        "prompt": (
            "Cinematic smooth tracking camera orbiting around the deep emerald green Z8 N710 Urban Plus electric scooter "
            "parked on a sleek pedestrian plaza on Avenida Brigadeiro Faria Lima in São Paulo during twilight blue hour. "
            "Horizontal glowing mecha LED light bar reflecting off modern glass skyscraper facades and polished granite floor. "
            "Futuristic urban mobility aesthetic, pristine 8k commercial quality, 60fps."
        ),
        "aspect_ratio": "16:9",
        "duration_seconds": 5
    },
    "tank-minas": {
        "title": "Z8 Tank High-Speed em Trilha Off-Road no Interior de Minas Gerais",
        "image": MODELS_DIR / "z8_tank_minas_wide.jpg",
        "output": "z8_tank_minas_veo.mp4",
        "prompt": (
            "Cinematic slow tracking drone shot rising smoothly above the Z8 Tank High-Speed electric adventure motorcycle "
            "parked on a rugged, muddy red clay dirt trail in the rural rolling green mountains of Minas Gerais, Brazil. "
            "Morning golden mist swirling through the valleys, rustic wooden fences, and wet red clay mud reflecting the sunrise light. "
            "The glowing dual circular halo LED headlights shine brightly with pristine high-torque off-road commercial quality, 60fps."
        ),
        "aspect_ratio": "16:9",
        "duration_seconds": 5
    }
}


def get_api_key():
    """Recupera a chave de API ou solicita ao usuário."""
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not key:
        print("\n⚠️  Nenhuma chave de API encontrada em GEMINI_API_KEY no arquivo .env!")
        print("👉 Obtenha sua chave gratuita em: https://aistudio.google.com/")
        try:
            key = input("Cole sua API Key aqui (ou pressione Enter para cancelar): ").strip()
        except EOFError:
            key = ""
        if not key:
            print("❌ Operação cancelada. Defina GEMINI_API_KEY no seu arquivo .env.")
            sys.exit(1)
    return key


def generate_video(prompt, image_path=None, output_filename="veo_video.mp4", aspect_ratio="16:9", duration_seconds=5, model="veo-2.0-generate-001"):
    """Gera o vídeo usando o Google GenAI SDK (Veo)."""
    api_key = get_api_key()
    
    try:
        from google import genai
        from google.genai import types
    except ImportError:
        print("❌ Biblioteca google-genai não encontrada. Instale com: pip install google-genai")
        sys.exit(1)

    print(f"\n=======================================================")
    print(f"🚀 Z8 E-MOTION - GERADOR DE VÍDEO GOOGLE VEO")
    print(f"=======================================================")
    print(f"🤖 Modelo: {model}")
    print(f"📐 Formato: {aspect_ratio} | Duração: {duration_seconds}s")
    print(f"📝 Prompt: {prompt[:90]}...")
    
    client = genai.Client(api_key=api_key)
    VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
    output_path = VIDEOS_DIR / output_filename

    image_obj = None
    if image_path and Path(image_path).exists():
        print(f"🖼️  Usando imagem base: {image_path}")
        with open(image_path, "rb") as img_file:
            image_bytes = img_file.read()
        
        mime = "image/jpeg" if str(image_path).lower().endswith((".jpg", ".jpeg")) else "image/png"
        image_obj = types.Image(image_bytes=image_bytes, mime_type=mime)
    else:
        print("ℹ️  Modo Text-to-Video (sem imagem base).")

    print("\n⏳ Enviando requisição para a nuvem do Google Veo...")
    start_time = time.time()

    try:
        config_args = {"aspect_ratio": aspect_ratio}
        if duration_seconds:
            config_args["duration_seconds"] = duration_seconds

        operation = client.models.generate_videos(
            model=model,
            prompt=prompt,
            image=image_obj,
            config=types.GenerateVideosConfig(**config_args)
        )

        spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
        idx = 0
        while not operation.done:
            elapsed = int(time.time() - start_time)
            symbol = spinner[idx % len(spinner)]
            print(f"\r{symbol} Renderizando vídeo com Google Veo na nuvem... ({elapsed}s decorridos)", end="", flush=True)
            time.sleep(5)
            idx += 1
            operation = client.operations.get(operation)

        print("\n\n🎉 Renderização concluída com sucesso!")
        
        # Faz o download do vídeo gerado
        generated_video = operation.result.generated_videos[0]
        with open(output_path, "wb") as f:
            f.write(generated_video.video.video_bytes)

        file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
        print(f"💾 Vídeo salvo em: {output_path}")
        print(f"📦 Tamanho do arquivo: {file_size_mb:.2f} MB")
        print(f"⏱️  Tempo total de processamento: {int(time.time() - start_time)}s")
        print(f"🌐 Pronto para uso no site Z8 E-Motion!")
        return output_path

    except Exception as e:
        print(f"\n❌ Erro ao gerar vídeo com Veo: {e}")
        print("💡 Verifique se sua chave possui permissão de acesso ao modelo Veo (Google AI Studio / Vertex AI).")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Z8 E-Motion - Gerador Automático de Vídeos com Google Veo")
    parser.add_argument("--preset", choices=list(PRESETS.keys()), help="Nome do preset cinematográfico pré-configurado")
    parser.add_argument("--prompt", help="Prompt de direção de cena customizado")
    parser.add_argument("--image", help="Caminho da imagem base (Image-to-Video)")
    parser.add_argument("--output", default="z8_veo_render.mp4", help="Nome do arquivo de saída .mp4")
    parser.add_argument("--aspect", choices=["16:9", "9:16"], default="16:9", help="Proporção da tela (16:9 widescreen ou 9:16 reels)")
    parser.add_argument("--duration", type=int, default=5, help="Duração em segundos (padrão: 5)")
    parser.add_argument("--model", default="veo-2.0-generate-001", help="Identificador do modelo Veo na API")
    parser.add_argument("--list-presets", action="store_true", help="Lista todos os presets disponíveis")

    args = parser.parse_args()

    if args.list_presets:
        print("\n🎬 PRESETS CINEMATOGRÁFICOS DISPONÍVEIS:")
        print("-------------------------------------------------------")
        for key, p in PRESETS.items():
            print(f"🔹 {key.ljust(18)} : {p['title']}")
            print(f"   Imagem Base     : {p['image'].name if p['image'].exists() else 'N/A'}")
            print(f"   Arquivo Saída   : {p['output']}\n")
        return

    if args.preset:
        preset_data = PRESETS[args.preset]
        print(f"🎬 Carregando Preset: {preset_data['title']}")
        generate_video(
            prompt=preset_data["prompt"],
            image_path=preset_data["image"],
            output_filename=preset_data["output"],
            aspect_ratio=preset_data["aspect_ratio"],
            duration_seconds=preset_data["duration_seconds"],
            model=args.model
        )
    elif args.prompt:
        generate_video(
            prompt=args.prompt,
            image_path=args.image,
            output_filename=args.output,
            aspect_ratio=args.aspect,
            duration_seconds=args.duration,
            model=args.model
        )
    else:
        # Modo Interativo
        print("\n🎬 BEM-VINDO AO GERADOR DE VÍDEO Z8 E-MOTION (VEO 3 / 2)")
        print("Escolha um preset ou personalize sua cena:")
        presets_list = list(PRESETS.keys())
        for i, key in enumerate(presets_list, 1):
            print(f"  [{i}] {PRESETS[key]['title']}")
        print(f"  [{len(presets_list) + 1}] Prompt personalizado")
        
        choice = input(f"\nDigite o número da opção (1-{len(presets_list) + 1}) [Padrão: 1]: ").strip() or "1"
        try:
            choice_idx = int(choice) - 1
            if 0 <= choice_idx < len(presets_list):
                chosen_key = presets_list[choice_idx]
                p = PRESETS[chosen_key]
                generate_video(
                    prompt=p["prompt"],
                    image_path=p["image"],
                    output_filename=p["output"],
                    aspect_ratio=p["aspect_ratio"],
                    duration_seconds=p["duration_seconds"],
                    model=args.model
                )
            else:
                prompt = input("Digite a descrição da cena (Prompt): ").strip()
                image = input("Caminho da imagem base (opcional, Enter para pular): ").strip() or None
                output = input("Nome do arquivo de saída [ex: video.mp4]: ").strip() or "z8_custom_video.mp4"
                generate_video(prompt=prompt, image_path=image, output_filename=output, model=args.model)
        except Exception as e:
            print(f"Erro na seleção: {e}")


if __name__ == "__main__":
    main()
