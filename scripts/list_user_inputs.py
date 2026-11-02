import json

with open('C:/Users/LENOVO/.gemini/antigravity/brain/150441b7-17e3-4552-8b71-d4b2160c520a/.system_generated/logs/transcript.jsonl', 'r', encoding='utf-8') as f:
    for i, l in enumerate(f):
        o = json.loads(l)
        if o.get('type') == 'USER_INPUT':
            print(f"Step {o.get('step_index')}: {repr(o.get('content', ''))[:100]} media={o.get('media')}")
