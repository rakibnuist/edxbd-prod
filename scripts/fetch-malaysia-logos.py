import urllib.request
import urllib.parse
import re
import os
import json

sites = [
    ("sunway-university", "https://sunwayuniversity.edu.my"),
    ("taylors-university", "https://university.taylors.edu.my"),
    ("universiti-malaya", "https://www.um.edu.my"),
    ("universiti-teknologi-malaysia", "https://www.utm.my"),
    ("asia-pacific-university", "https://www.apu.edu.my"),
    ("monash-university-malaysia", "https://www.monash.edu.my"),
    ("university-of-nottingham-malaysia", "https://www.nottingham.edu.my"),
    ("ucsi-university", "https://www.ucsiuniversity.edu.my"),
    ("heriot-watt-university-malaysia", "https://www.hw.ac.uk/malaysia/"),
]

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}

for slug, url in sites:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            # look for img src containing logo
            imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html, re.I)
            logo_candidates = [img for img in imgs if "logo" in img.lower() and not "footer" in img.lower()]
            print(f"=== {slug} ===")
            for c in logo_candidates[:3]:
                full_url = urllib.parse.urljoin(url, c)
                print("  ", full_url)
    except Exception as e:
        print(f"=== {slug} ERROR: {e} ===")
