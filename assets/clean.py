import os

folder = "./"  # حط مسار مجلد ملفات الثيم هون

for root, dirs, files in os.walk(folder):
    for file in files:
        if file.endswith(".js"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                lines = f.readlines()
            with open(path, "w", encoding="utf-8") as f:
                for line in lines:
                    if "sourceMappingURL" not in line:
                        f.write(line)
            print(f"Cleaned {path}")
