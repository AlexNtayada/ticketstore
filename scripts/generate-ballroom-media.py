"""
Temporary placeholder imagery for the "Invitație la vals" preview:
procedurally rendered gold bokeh / chandelier light on burgundy.
NOT photographs of the show. Replace with the organizer's poster and photos.
"""
import math, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images", "invitatie-la-vals")
os.makedirs(OUT, exist_ok=True)

def render(name, w, h, seed, base=(42, 8, 16), gold=(255, 205, 140), density=1.0, focus=(0.5, 0.35), streak=True):
    rng = random.Random(seed)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    fx, fy = focus[0] * w, focus[1] * h
    d = np.sqrt(((xx - fx) / w) ** 2 + ((yy - fy) / h) ** 2)
    arr = np.zeros((h, w, 3), np.float32)
    glow = np.clip(1 - d * 1.6, 0, 1) ** 2
    for c in range(3):
        arr[..., c] = base[c] * (0.55 + 1.4 * glow) + gold[c] * 0.18 * glow
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    # bokeh layers: far (small, sharp-ish), near (big, soft)
    for layer, (count, rmin, rmax, blur, alpha) in enumerate([(int(220 * density), 0.004, 0.012, 1.5, 200), (int(60 * density), 0.015, 0.045, 6, 120), (int(14 * density), 0.05, 0.11, 18, 70)]):
        L = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        dr = ImageDraw.Draw(L)
        for _ in range(count):
            # cluster around a chandelier focus
            ang = rng.uniform(0, 2 * math.pi)
            rad = abs(rng.gauss(0, 0.33)) * (1.0 + layer * 0.4)
            x = fx + math.cos(ang) * rad * w
            y = fy + math.sin(ang) * rad * h * 0.8
            r = rng.uniform(rmin, rmax) * w
            tone = rng.uniform(0.7, 1.0)
            col = (int(gold[0] * tone), int(gold[1] * tone), int(gold[2] * tone * rng.uniform(0.8, 1.05)), int(alpha * rng.uniform(0.4, 1)))
            dr.ellipse([x - r, y - r, x + r, y + r], fill=col)
            if layer > 0:
                dr.ellipse([x - r * 0.82, y - r * 0.82, x + r * 0.82, y + r * 0.82], fill=(col[0], col[1], col[2], int(col[3] * 0.55)))
        L = L.filter(ImageFilter.GaussianBlur(blur * w / 1600))
        img.paste(L, (0, 0), L)
    if streak:
        S = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        sd = ImageDraw.Draw(S)
        for _ in range(3):
            x = fx + rng.uniform(-0.25, 0.25) * w
            sd.polygon([(x - 4, 0), (x + 4, 0), (x + w * 0.12, h), (x - w * 0.12, h)], fill=gold + (34,))
        S = S.filter(ImageFilter.GaussianBlur(w * 0.02))
        img.paste(S, (0, 0), S)
    a = np.asarray(img).astype(np.float32)
    v = 1 - np.clip(np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2) - 0.45, 0, 1) * 0.7
    a *= v[..., None]
    a += np.random.default_rng(seed).normal(0, 9, (h, w, 1))
    Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(os.path.join(OUT, name), quality=80, optimize=True, progressive=True)
    print("wrote", name)

render("hero.jpg", 2400, 1500, 3, focus=(0.62, 0.3))
render("hero-mobile.jpg", 1080, 1620, 5, focus=(0.5, 0.28))
render("story.jpg", 1200, 1600, 9, base=(30, 6, 12), focus=(0.4, 0.4), density=0.8)
render("gallery-01.jpg", 2400, 1200, 13, focus=(0.3, 0.4))
render("gallery-02.jpg", 1200, 1600, 17, base=(20, 8, 10), gold=(255, 230, 190), focus=(0.5, 0.25))
render("gallery-03.jpg", 1600, 1067, 19, focus=(0.7, 0.5), density=1.3, streak=False)
render("venue.jpg", 2000, 1250, 23, base=(28, 10, 14), focus=(0.5, 0.2), density=0.7)
render("final.jpg", 2400, 1400, 29, focus=(0.5, 0.5))
render("og.jpg", 1200, 630, 3, focus=(0.62, 0.3))
