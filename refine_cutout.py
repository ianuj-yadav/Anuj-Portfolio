import sys
from PIL import Image, ImageFilter
import numpy as np

def process_image(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    data = np.array(img, dtype=np.float32)
    r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]
    
    # Identify background starting from top corners
    # Calculate whiteness score: minimum of (r, g, b)
    whiteness = np.minimum(np.minimum(r, g), b)
    
    # Create background mask via floodfill from top-left (0,0), top-right (w-1,0)
    bg_mask = np.zeros((height, width), dtype=bool)
    visited = np.zeros((height, width), dtype=bool)
    
    # BFS queue
    queue = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
    # Add top border pixels to queue
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height-1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width-1, y))
        
    q_idx = 0
    while q_idx < len(queue):
        x, y = queue[q_idx]
        q_idx += 1
        
        if visited[y, x]:
            continue
        visited[y, x] = True
        
        # If whiteness is high (> 200), mark as background
        if whiteness[y, x] > 200:
            bg_mask[y, x] = True
            for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height and not visited[ny, nx]:
                    if whiteness[ny, nx] > 180: # lower threshold for connected pixels
                        queue.append((nx, ny))

    # Compute continuous alpha channel based on whiteness for background-connected region
    alpha = np.ones((height, width), dtype=np.float32) * 255.0
    
    # Where bg_mask is True, alpha is 0
    alpha[bg_mask] = 0.0
    
    # For transition pixels near the boundary (whiteness between 150 and 240 connected to bg)
    # Smooth alpha transition to eliminate white halo
    transition = (whiteness > 150) & (~bg_mask)
    # Check if adjacent to background
    padded_bg = np.pad(bg_mask, 1, mode='edge')
    adj_to_bg = (
        padded_bg[:-2, 1:-1] | padded_bg[2:, 1:-1] |
        padded_bg[1:-1, :-2] | padded_bg[1:-1, 2:] |
        padded_bg[:-2, :-2] | padded_bg[:-2, 2:] |
        padded_bg[2:, :-2] | padded_bg[2:, 2:]
    )
    
    halo_pixels = transition & adj_to_bg
    # Calculate alpha based on whiteness in halo: map 150..245 -> 1.0..0.0
    halo_alpha = np.clip((245.0 - whiteness[halo_pixels]) / (245.0 - 150.0), 0.0, 1.0) * 255.0
    alpha[halo_pixels] = halo_alpha
    
    # De-fringe: Remove white color bias from RGB on semi-transparent edge pixels
    # Original pixel = alpha * Foreground + (1 - alpha) * White(255)
    # => Foreground = (Original - (1 - alpha) * 255) / alpha
    alpha_norm = alpha / 255.0
    alpha_mask = alpha_norm > 0.01
    
    for c in range(3):
        col = data[:, :, c]
        # De-fringe formula
        defringed = np.where(
            (alpha_norm < 0.99) & alpha_mask,
            np.clip((col - (1.0 - alpha_norm) * 255.0) / np.maximum(alpha_norm, 0.05), 0, 255),
            col
        )
        data[:, :, c] = defringed
        
    data[:, :, 3] = alpha
    
    out_img = Image.fromarray(np.uint8(data), mode="RGBA")
    
    # Smooth alpha mask slightly using PIL GaussianBlur on alpha channel
    alpha_channel = out_img.split()[3]
    alpha_smoothed = alpha_channel.filter(ImageFilter.GaussianBlur(radius=0.5))
    out_img.putalpha(alpha_smoothed)
    
    out_img.save(output_path, "PNG")
    print(f"Refined cutout saved to {output_path}")

if __name__ == "__main__":
    process_image(sys.argv[1], sys.argv[2])
