import subprocess
import os
import time

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
if not os.path.exists(chrome_path):
    chrome_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

print('Using browser:', chrome_path)

output_path = os.path.abspath('real_home.png')

cmd = [
    chrome_path,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    '--virtual-time-budget=5000',
    f'--screenshot={output_path}',
    'http://localhost:5173/'
]

print('Running command:', ' '.join(cmd))
res = subprocess.run(cmd, capture_output=True, text=True)
print('Return code:', res.returncode)
print('Stdout:', res.stdout)
print('Stderr:', res.stderr)

time.sleep(1)
if os.path.exists(output_path):
    print('SUCCESS! Screenshot size:', os.path.getsize(output_path)/1024, 'KB')
else:
    print('File not created.')
