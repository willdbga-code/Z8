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

async def capture():
    port = 9225
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        f'--remote-debugging-port={port}',
        '--disable-gpu',
        '--window-size=1600,1000',
        'http://localhost:3000/conceito/?logout=1'
    ])
    try:
        await asyncio.sleep(4)
        resp = urllib.request.urlopen(f'http://127.0.0.1:{port}/json')
        tabs = json.loads(resp.read().decode())
        target = [t for t in tabs if 'conceito' in t.get('url', '')][0]
        
        async with websockets.connect(target['webSocketDebuggerUrl'], max_size=20*1024*1024) as ws:
            await ws.send(json.dumps({'id': 1, 'method': 'Page.enable'}))
            await ws.recv()

            # Check if there are JS errors
            await ws.send(json.dumps({
                'id': 2,
                'method': 'Runtime.evaluate',
                'params': {'expression': 'document.body.className + " // title: " + document.title + " // scroll: " + window.scrollY'}
            }))
            eval_res = await ws.recv()
            print("Page state:", json.loads(eval_res))

            # Capture screenshot
            await ws.send(json.dumps({
                'id': 3,
                'method': 'Page.captureScreenshot',
                'params': {'format': 'png'}
            }))
            shot = json.loads(await ws.recv())
            out_path = os.path.join(brain_dir, 'eval_conceito_restored.png')
            with open(out_path, 'wb') as f:
                f.write(base64.b64decode(shot['result']['data']))
            print("Saved restored screenshot to:", out_path)
    finally:
        proc.terminate()

asyncio.run(capture())
