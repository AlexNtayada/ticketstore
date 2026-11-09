"""
Generates the fictional DEMO imagery used by the template preview.

These are procedurally rendered "stage light" stand-ins, not photographs of a
real artist or event. Replace them with the organizer's own assets in
public/images and update src/config/event.ts.

Usage:  python3 scripts/generate-demo-media.py
Requires: Pillow, numpy
"""

import math
import os
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images", "demo")
os.makedirs(OUT, exist_ok=True)


def beams(draw, w, h, rng, n, origin_y, color, spread):
    for _ in range(n):
        ox = rng.uniform(0.15, 0.85) * w
        angle = rng.uniform(-spread, spread)
        length = h * rng.uniform(1.1, 1.6)
        width = rng.uniform(0.04, 0.12) * w
        tx = ox + math.sin(angle) * length
        ty = origin_y + math.cos(angle) * length
        alpha = int(rng.uniform(55, 130))
        draw.polygon(
            [(ox - 4, origin_y), (ox + 4, origin_y), (tx + width, ty), (tx - width, ty)],
            fill=color + (alpha,),
        )


def crowd(draw, w, h, rng, base_y, density, fill=(4, 4, 4, 255)):
    x = -20
    while x < w + 20:
        head_r = rng.uniform(0.012, 0.022) * w
        y = base_y + rng.uniform(-0.02, 0.03) * h
        draw.ellipse([x - head_r, y - head_r, x + head_r, y + head_r], fill=fill)
        draw.rounded_rectangle(
            [x - head_r * 2.4, y + head_r * 0.6, x + head_r * 2.4, h + 10],
            radius=int(head_r * 1.5),
            fill=fill,
        )
        if rng.random() < 0.18:  # raised arm
            ax = x + rng.uniform(-1, 1) * head_r * 2
            top = y - rng.uniform(0.08, 0.16) * h
            draw.line([(x + head_r, y + head_r), (ax, top)], fill=fill, width=int(head_r * 0.9))
            draw.ellipse([ax - head_r * 0.6, top - head_r * 0.6, ax + head_r * 0.6, top + head_r * 0.6], fill=fill)
        x += head_r * rng.uniform(2.6, 4.2) / density


def performer(draw, cx, base, scale, fill=(2, 2, 2, 255)):
    s = scale
    draw.ellipse([cx - 0.035 * s, base - 0.62 * s, cx + 0.035 * s, base - 0.54 * s], fill=fill)
    draw.polygon(
        [(cx - 0.07 * s, base - 0.5 * s), (cx + 0.07 * s, base - 0.5 * s), (cx + 0.05 * s, base - 0.18 * s), (cx - 0.05 * s, base - 0.18 * s)],
        fill=fill,
    )
    draw.polygon([(cx - 0.05 * s, base - 0.2 * s), (cx - 0.01 * s, base - 0.2 * s), (cx - 0.04 * s, base), (cx - 0.08 * s, base)], fill=fill)
    draw.polygon([(cx + 0.01 * s, base - 0.2 * s), (cx + 0.05 * s, base - 0.2 * s), (cx + 0.08 * s, base), (cx + 0.04 * s, base)], fill=fill)
    # arm raised holding mic
    draw.line([(cx + 0.06 * s, base - 0.47 * s), (cx + 0.15 * s, base - 0.74 * s)], fill=fill, width=int(0.028 * s))
    draw.line([(cx - 0.06 * s, base - 0.47 * s), (cx - 0.11 * s, base - 0.3 * s)], fill=fill, width=int(0.026 * s))


def finish(img, rng, grain=18, vignette=0.55, tint=(1.0, 1.0, 1.0)):
    arr = np.asarray(img.convert("RGB")).astype(np.float32)
    h, w, _ = arr.shape
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    v = 1 - np.clip(d - 0.35, 0, 1) * vignette
    arr *= v[..., None]
    arr *= np.array(tint, dtype=np.float32)
    noise = np.random.default_rng(rng.randint(0, 10**6)).normal(0, grain, (h, w, 1))
    arr += noise
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def stage(name, w, h, seed, beam_color, haze_color, perf=True, crowd_line=0.82, tint=(1, 1, 1), bw=False):
    rng = random.Random(seed)
    base = Image.new("RGB", (w, h), (8, 8, 9))
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    # haze glow
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gx, gy = w * rng.uniform(0.35, 0.65), h * rng.uniform(0.25, 0.45)
    gd.ellipse([gx - w * 0.5, gy - h * 0.45, gx + w * 0.5, gy + h * 0.45], fill=haze_color + (110,))
    glow = glow.filter(ImageFilter.GaussianBlur(w * 0.12))
    base.paste(glow, (0, 0), glow)
    beams(d, w, h, rng, 12, -h * 0.05, beam_color, 0.6)
    layer = layer.filter(ImageFilter.GaussianBlur(w * 0.008))
    base.paste(layer, (0, 0), layer)
    # hot spots
    spots = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sd = ImageDraw.Draw(spots)
    for _ in range(6):
        sx, sy = w * rng.uniform(0.1, 0.9), h * rng.uniform(0.0, 0.08)
        r = w * 0.018
        sd.ellipse([sx - r, sy - r, sx + r, sy + r], fill=(255, 255, 250, 230))
    spots = spots.filter(ImageFilter.GaussianBlur(w * 0.01))
    base.paste(spots, (0, 0), spots)
    sil = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sdw = ImageDraw.Draw(sil)
    # far crowd: smaller, softer, lifted by haze
    far = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    crowd(ImageDraw.Draw(far), w, h, rng, h * (crowd_line - 0.06), 1.8, fill=(14, 14, 15, 235))
    far = far.filter(ImageFilter.GaussianBlur(w * 0.004))
    base.paste(far, (0, 0), far)
    # near crowd: large, out of focus like a long-lens concert shot
    crowd(sdw, w, h, rng, h * crowd_line, 0.7)
    sil = sil.filter(ImageFilter.GaussianBlur(w * 0.006))
    base.paste(sil, (0, 0), sil)
    out = finish(base, rng, tint=tint)
    if bw:
        out = out.convert("L").convert("RGB")
    out.save(os.path.join(OUT, name), quality=82, optimize=True, progressive=True)
    print("wrote", name, w, h)


def architecture(name, w, h, seed):
    """Abstract venue facade: arches and columns in cold light."""
    rng = random.Random(seed)
    img = Image.new("RGB", (w, h), (18, 18, 20))
    d = ImageDraw.Draw(img)
    for i in range(h):
        c = int(30 + 60 * (i / h))
        d.line([(0, i), (w, i)], fill=(c, c, c + 6))
    cols = 7
    cw = w / cols
    for i in range(cols):
        x0 = i * cw + cw * 0.18
        x1 = (i + 1) * cw - cw * 0.18
        top = h * 0.32
        d.rectangle([x0, top, x1, h * 0.95], fill=(6, 6, 7))
        d.pieslice([x0, top - (x1 - x0) / 2, x1, top + (x1 - x0) / 2], 180, 360, fill=(6, 6, 7))
        glow = rng.uniform(0.3, 1)
        d.rectangle([x0 + 6, h * 0.8, x1 - 6, h * 0.95], fill=(int(200 * glow), int(190 * glow), int(150 * glow)))
    img = img.filter(ImageFilter.GaussianBlur(2))
    out = finish(img, rng, grain=14, vignette=0.7)
    out.save(os.path.join(OUT, name), quality=82, optimize=True, progressive=True)
    print("wrote", name, w, h)


if __name__ == "__main__":
    stage("hero.jpg", 2400, 1500, 7, (235, 240, 210), (90, 96, 60), crowd_line=0.86)
    stage("hero-mobile.jpg", 1080, 1620, 11, (235, 240, 210), (90, 96, 60), crowd_line=0.88)
    stage("story.jpg", 1200, 1600, 21, (255, 214, 170), (110, 60, 30), crowd_line=0.9, bw=True)
    stage("gallery-01.jpg", 2400, 1200, 31, (210, 225, 255), (40, 50, 90), crowd_line=0.8)
    stage("gallery-02.jpg", 1200, 1600, 41, (255, 120, 90), (120, 30, 20), crowd_line=0.86)
    stage("gallery-03.jpg", 1600, 1067, 51, (230, 255, 120), (60, 80, 10), perf=False, crowd_line=0.7)
    stage("gallery-04.jpg", 1200, 1500, 61, (255, 255, 255), (60, 60, 60), crowd_line=0.84, bw=True)
    stage("gallery-05.jpg", 1600, 1067, 71, (255, 190, 230), (90, 30, 70), crowd_line=0.78)
    stage("final.jpg", 2400, 1400, 81, (223, 255, 91), (80, 100, 20), crowd_line=0.75, perf=False)
    architecture("venue.jpg", 2000, 1250, 91)
    stage("og.jpg", 1200, 630, 7, (235, 240, 210), (90, 96, 60), crowd_line=0.86)
