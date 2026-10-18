"""Build hero video + image assets. Run from project root:  python -I -X utf8 scripts/build-hero-assets.py
Needs: ffmpeg on PATH, numpy, Pillow. Inputs: intro.mp4, "id card.jpeg", cv.pdf (project root).
Outputs: public/hero/hero.mp4, hero.webm, public/portrait-bust.webp, og.jpg, favicon.ico, icon.png, cv.pdf
"""
import subprocess, shutil, wave, os, sys, tempfile
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "intro.mp4")
OUT = os.path.join(ROOT, "public")
os.makedirs(os.path.join(OUT, "hero"), exist_ok=True)
TMP = tempfile.mkdtemp()

FPS, SR, XF = 24, 48000, 12          # 12 frames = 0.5 s crossfade
TOTAL_F = 240                         # source is exactly 10 s
CROP = "crop=800:1000:560:60"         # person is centred at x~960, head y~80, feet y~1050 (1920x1080)
SCALE = "scale=768:960:flags=lanczos"
LEVELS = "colorlevels=rimax=0.90:gimax=0.90:bimax=0.90"  # source backdrop is 0.91-0.94 (varies by channel/frame); 0.90 maps it to >=250, <0.5% of subject pixels clip

def run(cmd):
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode:
        sys.exit(r.stderr.decode(errors="replace")[-2000:])
    return r

# ---- audio: sample-accurate crossfade in numpy (equal power) ----
raw = run(["ffmpeg", "-v", "error", "-i", SRC, "-vn", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"]).stdout
a = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2)[: 10 * SR].astype(np.float64)
assert len(a) == 10 * SR, len(a)
n = XF * SR // FPS                                    # 24000 samples
t = (np.arange(n) + 0.5) / n
fade_out, fade_in = np.cos(t * np.pi / 2)[:, None], np.sin(t * np.pi / 2)[:, None]
tail, head = a[10 * SR - n:], a[:n]
audio = np.concatenate([a[n : 10 * SR - n], tail * fade_out + head * fade_in])   # 9.5 s
# seam report: jump between last->first sample vs typical neighbour jump
step = np.abs(np.diff(audio, axis=0)).max(axis=1)
seam = np.abs(audio[0] - audio[-1]).max()
print(f"audio {len(audio)/SR:.3f}s  seam jump {seam:.5f}  typical max step {step.max():.5f}  p99 {np.percentile(step,99):.5f}")
wav = os.path.join(TMP, "loop.wav")
with wave.open(wav, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(audio, -1, 1) * 32767).astype("<i2").tobytes())

# ---- video: trim main (0.5..9.5s) + xfade(last 0.5s -> first 0.5s) ----
fc = (
    f"[0:v]{CROP},{SCALE},{LEVELS},setsar=1,format=yuv420p,split=3[a][b][c];"
    f"[a]trim=start_frame={XF}:end_frame={TOTAL_F-XF},setpts=PTS-STARTPTS,fps={FPS}[main];"
    f"[b]trim=start_frame={TOTAL_F-XF}:end_frame={TOTAL_F},setpts=PTS-STARTPTS,fps={FPS}[tail];"
    f"[c]trim=start_frame=0:end_frame={XF},setpts=PTS-STARTPTS,fps={FPS}[head];"
    f"[tail][head]xfade=transition=fade:duration={XF/FPS}:offset=0[x];"
    f"[main][x]concat=n=2:v=1:a=0,fps={FPS}[v]"
)
base = ["ffmpeg", "-v", "error", "-y", "-i", SRC, "-i", wav, "-filter_complex", fc, "-map", "[v]", "-map", "1:a", "-shortest"]
run(base + ["-c:v", "libx264", "-crf", "24", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k",
            "-movflags", "+faststart", os.path.join(OUT, "hero", "hero.mp4")])
run(base + ["-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", "-pix_fmt", "yuv420p", "-c:a", "libopus", "-b:a", "80k",
            os.path.join(OUT, "hero", "hero.webm")])

# ---- portrait bust (head-to-shirt) ----
im = Image.open(os.path.join(ROOT, "id card.jpeg")).convert("RGB")
im.crop((130, 0, 899, 961)).resize((480, 600), Image.LANCZOS).save(os.path.join(OUT, "portrait-bust.webp"), quality=88)

# ---- OG image 1200x630 ----
frame = os.path.join(TMP, "f.png")
run(["ffmpeg", "-v", "error", "-y", "-ss", "1", "-i", SRC, "-frames:v", "1", "-vf", f"{CROP},{SCALE},{LEVELS}", frame])
paper, ink, mute = (244, 242, 238), (13, 13, 13), (119, 117, 111)
og = Image.new("RGB", (1200, 630), paper)
fig = Image.open(frame).convert("RGB").resize((504, 630), Image.LANCZOS)

bg = Image.new("RGB", (504, 630), paper)
from PIL import ImageChops
og.paste(ImageChops.multiply(fig, bg), (696, 0))
d = ImageDraw.Draw(og)
def font(names, size):
    for nme in names:
        try: return ImageFont.truetype(nme, size)
        except OSError: pass
    return ImageFont.load_default()
big = font(["arialbd.ttf", "DejaVuSans-Bold.ttf"], 132)
mid = font(["ariali.ttf", "georgiai.ttf", "DejaVuSerif-Italic.ttf"], 56)
sm = font(["arial.ttf", "DejaVuSans.ttf"], 26)
d.text((72, 150), "Ajay B", font=big, fill=ink)
d.text((76, 310), "Site Reliability Engineer", font=mid, fill=mute)
d.text((76, 400), "Systems Engineer III (SRE)  |  LexisNexis Risk Solutions", font=sm, fill=ink)
og.save(os.path.join(OUT, "og.jpg"), quality=90)

# ---- favicon: ink disc with AB ----
S = 512
ic = Image.new("RGBA", (S, S), (0, 0, 0, 0))
ImageDraw.Draw(ic).ellipse((0, 0, S - 1, S - 1), fill=ink + (255,))
f = font(["arialbd.ttf", "DejaVuSans-Bold.ttf"], 230)
dd = ImageDraw.Draw(ic)
bb = dd.textbbox((0, 0), "AB", font=f)
dd.text(((S - (bb[2] - bb[0])) / 2 - bb[0], (S - (bb[3] - bb[1])) / 2 - bb[1]), "AB", font=f, fill=paper)
ic.save(os.path.join(OUT, "icon.png"))
ic.save(os.path.join(OUT, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])

shutil.copy(os.path.join(ROOT, "cv.pdf"), os.path.join(OUT, "cv.pdf"))
shutil.rmtree(TMP, ignore_errors=True)
print("done")
