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

async def capture_scrolls():
    port = 9226
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        f'--remote-debugging-port={port}',
        '--disable-gpu',
        '--window-size=1600,1000',
        'http://localhost:3000/conceito/?logout=1'
    ])
    try:
        await asyncio.sleep(3.5)
        resp = urllib.request.urlopen(f'http://127.0.0.1:{port}/json')
        tabs = json.loads(resp.read().decode())
        target = [t for t in tabs if 'conceito' in t.get('url', '')][0]
        
        async with websockets.connect(target['webSocketDebuggerUrl'], max_size=20*1024*1024) as ws:
            await ws.send(json.dumps({'id': 1, 'method': 'Page.enable'}))
            await ws.recv()

            # Scroll to 1800px (3D spin and presentation text)
            await ws.send(json.dumps({
                'id': 2,
                'method': 'Runtime.evaluate',
                'params': {'expression': 'window.scrollTo(0, 1800);'}
            }))
            await ws.recv()
            await asyncio.sleep(1)

            await ws.send(json.dumps({
                'id': 3,
                'method': 'Page.captureScreenshot',
                'params': {'format': 'png'}
            }))
            shot = json.loads(await ws.recv())
            with open(os.path.join(brain_dir, 'eval_conceito_scroll_1800.png'), 'wb') as f:
                f.write(base64.b64decode(shot['result']['data']))
            print("Saved 1800px scroll")

            # Scroll to 4500px (Fleet cards)
            await ws.send(json.dumps({
                'id': 4,
                'method': 'Runtime.evaluate',
                'params': {'expression': 'window.scrollTo(0, 4500);'}
            }))
            await ws.recv()
            await asyncio.sleep(1)

            await ws.send(json.dumps({
                'id': 5,
                'method': 'Page.captureScreenshot',
                'params': {'format': 'png'}
            }))
            shot2 = json.loads(await ws.recv())
            with open(os.path.join(brain_dir, 'eval_conceito_scroll_4500.png'), 'wb') as f:
                f.write(base64.b64decode(shot2['result']['data']))
            print("Saved 4500px scroll")
    finally:
        proc.terminate()

asyncio.run(capture_scrolls())
