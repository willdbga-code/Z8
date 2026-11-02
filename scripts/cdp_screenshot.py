import asyncio
import json
import urllib.request
import subprocess
import time
import base64
import os
import websockets

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
brain_dir = r'C:\Users\LENOVO\.gemini\antigravity\brain\150441b7-17e3-4552-8b71-d4b2160c520a'

async def capture_page(url, out_filename, scroll_selector=None, action_js=None):
    port = 9223
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        f'--remote-debugging-port={port}',
        '--disable-gpu',
        '--hide-scrollbars',
        '--window-size=1600,1200',
        url
    ])

    try:
        await asyncio.sleep(2.5)
        resp = urllib.request.urlopen(f'http://127.0.0.1:{port}/json')
        tabs = json.loads(resp.read().decode())
        target_tab = None
        for t in tabs:
            if url.split('?')[0] in t.get('url', ''):
                target_tab = t
                break
        if not target_tab and tabs:
            target_tab = tabs[0]

        ws_url = target_tab['webSocketDebuggerUrl']
        async with websockets.connect(ws_url, max_size=20*1024*1024) as ws:
            # Enable Page & DOM
            await ws.send(json.dumps({'id': 1, 'method': 'Page.enable'}))
            await ws.recv()

            if action_js:
                await ws.send(json.dumps({
                    'id': 2,
                    'method': 'Runtime.evaluate',
                    'params': {'expression': action_js}
                }))
                await ws.recv()
                await asyncio.sleep(0.5)

            if scroll_selector:
                scroll_code = f"""
                    const el = document.querySelector('{scroll_selector}');
                    if (el) {{
                        el.scrollIntoView({{ behavior: 'instant', block: 'start' }});
                        true;
                    }} else {{
                        false;
                    }}
                """
                await ws.send(json.dumps({
                    'id': 3,
                    'method': 'Runtime.evaluate',
                    'params': {'expression': scroll_code}
                }))
                res = json.loads(await ws.recv())
                print(f"Scroll result for {scroll_selector}:", res)
                await asyncio.sleep(0.8)

            # Capture screenshot
            await ws.send(json.dumps({
                'id': 4,
                'method': 'Page.captureScreenshot',
                'params': {'format': 'png'}
            }))
            shot_res = json.loads(await ws.recv())
            img_b64 = shot_res['result']['data']
            out_path = os.path.join(brain_dir, out_filename)
            with open(out_path, 'wb') as f:
                f.write(base64.b64decode(img_b64))
            print(f"Saved screenshot: {out_path}")
    finally:
        proc.terminate()

async def main():
    # 1. Conceito 2 OS Footer
    await capture_page(
        'http://localhost:3000/conceito-2/?poslogin=1',
        'verified_conceito2_os_footer.png',
        scroll_selector='#rodape-os'
    )
    # 2. Conceito 1 OS Footer
    await capture_page(
        'http://localhost:3000/conceito/?poslogin=1',
        'verified_conceito_os_footer.png',
        scroll_selector='#rodape-os'
    )
    # 3. Conceito 2 Auth Modal open
    await capture_page(
        'http://localhost:3000/conceito-2/?auth=1',
        'verified_conceito2_auth_modal.png',
        action_js="""
            const intro = document.querySelector('.intro');
            if (intro) intro.style.display = 'none';
            if (window.openZ8AuthModal) window.openZ8AuthModal('login');
        """
    )

asyncio.run(main())
