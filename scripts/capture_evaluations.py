import subprocess
import os

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
brain_dir = r'C:\Users\LENOVO\.gemini\antigravity\brain\150441b7-17e3-4552-8b71-d4b2160c520a'

targets = [
    {
        'url': 'http://localhost:3000/conceito-2/?poslogin=1&scrollto=rodape-os',
        'out': os.path.join(brain_dir, 'eval_conceito2_rodape_os.png'),
        'size': '1600,1200'
    },
    {
        'url': 'http://localhost:3000/conceito/?poslogin=1&scrollto=rodape-os',
        'out': os.path.join(brain_dir, 'eval_conceito_rodape_os.png'),
        'size': '1600,1200'
    },
    {
        'url': 'http://localhost:3000/conceito-2/?login=1',
        'out': os.path.join(brain_dir, 'eval_conceito2_auth_modal.png'),
        'size': '1600,1100'
    }
]

for t in targets:
    print(f"Capturing {t['url']}...")
    cmd = [
        edge_path,
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--virtual-time-budget=2500',
        f"--window-size={t['size']}",
        f"--screenshot={t['out']}",
        t['url']
    ]
    subprocess.run(cmd)
    print(f"Saved: {t['out']}")

print("All captures completed.")
