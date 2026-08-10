import json

transcript_path = r'C:\Users\LENOVO\.gemini\antigravity\brain\482dd595-9727-4df8-b527-2545e88d0d6e\.system_generated\logs\transcript_full.jsonl'

step_files = {
    62: r'c:\Users\LENOVO\Desktop\Z8\index.html',
    64: r'c:\Users\LENOVO\Desktop\Z8\src\style.css',
    66: r'c:\Users\LENOVO\Desktop\Z8\src\main.js'
}

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        step = data.get('step_index')
        if step in step_files:
            target_path = step_files[step]
            for call in data.get('tool_calls', []):
                if call.get('name') == 'write_to_file':
                    content = call['args']['CodeContent']
                    with open(target_path, 'w', encoding='utf-8') as out_f:
                        out_f.write(content)
                    print(f'Successfully restored untruncated {target_path} from step {step}')
