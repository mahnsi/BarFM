import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import json

with open('visual/data.json', 'r') as file:
    data = json.load(file)

# pad data to same as max size and convert to floats
max_len = max(len(v) for v in data.values())
for artist in data:
    data[artist] = [float(x) for x in data[artist]]
    data[artist] += [0.0] * (max_len - len(data[artist]))

# create data frame 
df = pd.DataFrame(data)
df.index.name = 'Date Range' #means each row represents a different date range (end date)
print(df.head())

# ----------------------
# interpolate for smoothness
steps_between = 30  
frames = []

for i in range(len(df) - 1):
    current = df.iloc[i] # current row (date range)
    next = df.iloc[i + 1]
    for step in range(steps_between):
        interp = current + (next - current) * (step / steps_between)
        frames.append(interp) # adding more "intermediate" frames in between so its not jumpy

frames.append(df.iloc[-1])  #final frame

# ----------------------
# colours
import random
random.seed(42)
artist_list = df.columns.tolist()
colors = plt.cm.tab20.colors + plt.cm.Paired.colors + plt.cm.Set3.colors
artist_colors = {artist: colors[i % len(colors)] for i, artist in enumerate(artist_list)}

# ----------------------
# animation
fig, ax = plt.subplots(figsize=(10, 6))

def update(frame_idx):
    ax.clear()
    frame = frames[frame_idx]
    top10 = frame.sort_values(ascending=False).head(10)[::-1]

    bars = ax.barh(top10.index, top10.values, color=[artist_colors[artist] for artist in top10.index])
    ax.set_title(f"Top 10 Artists — Frame {frame_idx//steps_between + 1}", fontsize=16)
    ax.set_xlim(0, df.max().max() * 1.1)
    ax.grid(True, axis='x', linestyle='--', alpha=0.3)

    for bar in bars:
        width = bar.get_width()
        ax.text(width + 1, bar.get_y() + bar.get_height()/2,
                f'{width:.1f}', va='center', fontsize=10)

ani = FuncAnimation(fig, update, frames=len(frames), interval=100)

ani.save("visual/bar_race_smooth.gif", writer='pillow', fps=30)