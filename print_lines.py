from pathlib import Path
lines = Path('script.js').read_text().splitlines()
start = 1220
end = 1500
for i in range(start-1, min(end, len(lines))):
    print(f'{i+1:04d}: {lines[i]}')
