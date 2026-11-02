import json

with open('C:/Users/LENOVO/.gemini/antigravity/brain/150441b7-17e3-4552-8b71-d4b2160c520a/.system_generated/logs/transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        try:
            obj = json.loads(line)
            if obj.get('step_index') >= 3270:
                print(f"Step {obj.get('step_index')}: type={obj.get('type')} source={obj.get('source')} media={len(obj.get('media', []))} content={repr(obj.get('content', ''))[:120]}")
        except Exception as e:
            print("Error:", e)
