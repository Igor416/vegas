from pathlib import Path

dirs_py = [list(x.glob("*.py")) for x in Path('.').iterdir() if x.is_dir()]
files_js = list(Path(r"C:\Users\User\Python\Django\vegas\frontend\src").rglob("*.js"))
num_py = 0
num_js = 0

print(dirs_py, files_js)
for dir in dirs_py:
    for file in dir:
        with open(file, 'r', encoding='utf-8') as f:
            num_py += len(f.readlines())

for file in files_js:
    with open(file, 'r', encoding='utf-8') as f:
        num_js += len(f.readlines())

print(f'{num_py} python lines, {num_js} js lines, {num_py + num_js} combined')