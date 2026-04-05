#!/usr/bin/env python3

from PIL import Image
import os
from pathlib import Path

LOW_RES_DIR = "/home/monke/Codes/wheredolocals/docs/assets/img/low-res"

print("🔄 Ridimensionamento immagini...")
print("=" * 40)

# Estensioni supportate
EXTENSIONS = ('.jpg', '.jpeg', '.png', '.webp')

for root, dirs, files in os.walk(LOW_RES_DIR):
    for filename in files:
        if filename.lower().endswith(EXTENSIONS):
            img_path = os.path.join(root, filename)
            
            try:
                img = Image.open(img_path)
                
                # Calcola nuova altezza mantenendo proporzione
                ratio = img.height / img.width
                new_height = int(1080 * ratio)
                
                # Ridimensiona
                img_resized = img.resize((1080, new_height), Image.Resampling.LANCZOS)
                
                # Sovrascrive
                img_resized.save(img_path, quality=85, optimize=True)
                
                print(f"✓ {filename}: {img.size} → {img_resized.size}")
                
            except Exception as e:
                print(f"✗ {filename}: {e}")

print("=" * 40)
print("✅ Completato!")