import asyncio
import json
import urllib.request
import subprocess
import os
import websockets
import base64

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

async def check_page():
    port = 9227
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        f'--remote-debugging-port={port}',
        '--disable-gpu',
        '--window-size=1600,900',
        'about:blank'
    ])
    try:
        await asyncio.sleep(2.0)
        resp = urllib.request.urlopen(f'http://127.0.0.1:{port}/json')
        tabs = json.loads(resp.read().decode())
        ws_url = tabs[0]['webSocketDebuggerUrl']
        async with websockets.connect(ws_url, max_size=20*1024*1024) as ws:
            await ws.send(json.dumps({'id': 1, 'method': 'Console.enable'}))
            await ws.send(json.dumps({'id': 2, 'method': 'Runtime.enable'}))
            await ws.send(json.dumps({'id': 3, 'method': 'Page.enable'}))
            
            # Navigate to conceito
            await ws.send(json.dumps({'id': 4, 'method': 'Page.navigate', 'params': {'url': 'http://localhost:3000/conceito/'}}))
            
            logs = []
            
            start_time = asyncio.get_event_loop().time()
            while asyncio.get_event_loop().time() - start_time < 5.0:
                try:
                    raw = await asyncio.wait_for(ws.recv(), timeout=1.0)
                    msg = json.loads(raw)
                    method = msg.get('method', '')
                    if method in ['Console.messageAdded', 'Runtime.consoleAPICalled', 'Runtime.exceptionThrown']:
                        logs.append(msg)
                except asyncio.TimeoutError:
                    pass

            print(f"Captured {len(logs)} logs:")
            for l in logs:
                method = l.get('method')
                params = l.get('params', {})
                if method == 'Runtime.exceptionThrown':
                    print(">>> EXCEPTION:", params.get('exceptionDetails', {}).get('text'), params.get('exceptionDetails', {}).get('exception', {}).get('description'))
                elif method == 'Runtime.consoleAPICalled':
                    args = [a.get('value') or a.get('description') for a in params.get('args', [])]
                    print(f"CONSOLE ({params.get('type')}):", " ".join(str(x) for x in args))
                elif method == 'Console.messageAdded':
                    msg = params.get('message', {})
                    print(f"CONSOLE MSG ({msg.get('level')}):", msg.get('text'))
    finally:
        proc.kill()

asyncio.run(check_page())
