import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

data = {
    "The American Analog Set":["33","40","44","44","57","57","57","58","59","60","61","61","62","64","64",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "Alex G":["27","38","38","38","38","38","38","38","38","38","49","104","105","107","109",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "Moby":["21","23","25","25","25","25","25","26",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "Idaho":["20","24","30","30","30","30","30","30","30","30",0,0,0,0,"33",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "Modern Baseball":["11","15","22","24","24","25","25","35","38","38","40","40","41","46","46",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "American Football":["9","9",0,0,"22","33","33","36","36","36","39","39","39","44","44",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "Adnan Sami":["7","7",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "Kid Loco":["2",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "3l3d3p":["1",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "Billy Joel":["1",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "Modest Mouse":[0,"7","11","12",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "Slater":[0,"5",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "The Garden":[0,"4","10",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "Brian Green":[0,0,"14","14","14",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "Playboi Carti":[0,0,"13","13",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "Mac DeMarco":[0,0,"12","12","27","27","27","27","27","27",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "Fontaines D.C.":[0,0,0,"36","37","37","37","54","57","57","57","57","61","66","68",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "Boards of Canada":[0,0,0,0,"16","16","16",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "Neutral Milk Hotel":[0,0,0,0,0,"30","30","30","30","30",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "Origami Angel":[0,0,0,0,0,0,0,"22","47","47","50","50","50","54","68",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "Mort Garson":[0,0,0,0,0,0,0,0,"28","47","47","47","47","47","47",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "The Magnetic Fields":[0,0,0,0,0,0,0,0,0,0,"41","41","41","42","42",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "Mom Jeans.":[0,0,0,0,0,0,0,0,0,0,"35","35","35","36","41",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "sign crushes motorist":[0,0,0,0,0,0,0,0,0,0,"31","33","33","33",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
}

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