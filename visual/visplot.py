import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import matplotlib.cm as cm

# -----------------------------
# Load and clean data
# -----------------------------

with open("visual/data.json", "r") as f:
    raw = json.load(f)

# Convert to equal-length integer lists
clean = {}
max_len = 0

for artist, values in raw.items():
    vals = [int(v) for v in values]
    clean[artist] = vals
    max_len = max(max_len, len(vals))

for artist in clean:
    if len(clean[artist]) < max_len:
        clean[artist] += [0] * (max_len - len(clean[artist]))

df = pd.DataFrame(clean)
artists = df.columns.tolist()

# -----------------------------
# Animation parameters
# -----------------------------

TOP_N = 10
STEPS_PER_PERIOD = 50      # smoothness
INTERVAL = 30              # speed (ms)

total_frames = (len(df) - 1) * STEPS_PER_PERIOD

# -----------------------------
# Stable colors
# -----------------------------

cmap = cm.get_cmap("tab20", len(artists))
colors = {artist: cmap(i) for i, artist in enumerate(artists)}

# -----------------------------
# Figure setup
# -----------------------------

fig, ax = plt.subplots(figsize=(14, 8))
plt.subplots_adjust(left=0.35)

max_value = df.values.max()
ax.set_xlim(0, max_value * 1.1)
ax.set_ylim(-0.5, TOP_N - 0.5)
ax.invert_yaxis()
ax.set_yticks([])
ax.set_xlabel("Value")
ax.set_title("Bar Chart Race")

# Persistent objects
bars = {}
name_text = {}
value_text = {}

for artist in artists:
    bar = ax.barh(0, 0, color=colors[artist])[0]
    bars[artist] = bar

    name_text[artist] = ax.text(
        0, 0, artist,
        va="center",
        ha="right",
        fontsize=10
    )

    value_text[artist] = ax.text(
        0, 0, "0",
        va="center",
        ha="left",
        fontsize=10
    )

# -----------------------------
# Helpers
# -----------------------------

def get_ranks(values):
    ordered = values.sort_values(ascending=False)
    return {artist: rank for rank, artist in enumerate(ordered.index)}

def interpolate(frame):
    period = frame // STEPS_PER_PERIOD
    step = frame % STEPS_PER_PERIOD
    alpha = step / STEPS_PER_PERIOD

    v0 = df.iloc[period]
    v1 = df.iloc[period + 1]

    values = v0 + (v1 - v0) * alpha

    r0 = get_ranks(v0)
    r1 = get_ranks(v1)

    ranks = {
        artist: r0[artist] + (r1[artist] - r0[artist]) * alpha
        for artist in artists
    }

    return values, ranks

# -----------------------------
# Animation update
# -----------------------------

def update(frame):
    values, ranks = interpolate(frame)

    period = frame // STEPS_PER_PERIOD

    # Update dynamic title
    ax.set_title(f"Bar Chart Race — Date {period}")

    # Determine top N at this moment
    sorted_now = sorted(artists, key=lambda a: values[a], reverse=True)
    top_artists = sorted_now[:TOP_N]

    for artist in artists:
        if artist in top_artists:
            y = ranks[artist]
            width = values[artist]

            bars[artist].set_visible(True)
            bars[artist].set_width(width)
            bars[artist].set_y(y)

            name_text[artist].set_visible(True)
            name_text[artist].set_position((-max_value * 0.02, y))

            value_text[artist].set_visible(True)
            value_text[artist].set_position((width + max_value * 0.01, y))
            value_text[artist].set_text(f"{int(width)}")

        else:
            bars[artist].set_visible(False)
            name_text[artist].set_visible(False)
            value_text[artist].set_visible(False)

    return list(bars.values())
# -----------------------------
# Run animation
# -----------------------------

ani = FuncAnimation(
    fig,
    update,
    frames=total_frames,
    interval=INTERVAL,
    blit=False
)

plt.show()