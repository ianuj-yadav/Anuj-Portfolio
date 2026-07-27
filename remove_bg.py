import sys
from PIL import Image

def remove_white_bg(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    
    # Create a mask by flood-filling from the top-left corner
    # The image has a white background.
    # Convert image to RGB for flood fill
    rgb_img = img.convert("RGB")
    
    # Create a separate mask image initialized to 255 (opaque)
    # We will flood-fill the background with black (0) on this mask.
    mask = Image.new("L", rgb_img.size, 255)
    
    # We need a custom flood fill that operates on pixel differences
    # because Pillow's floodfill doesn't return a mask easily.
    # Alternatively, we can just replace pixels that are > (245, 245, 245)
    # But let's try an edge-connected BFS to be safe against white pixels inside the face.
    
    width, height = img.size
    pixels = img.load()
    
    # BFS from corners
    visited = set()
    queue = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
    
    for start_node in queue:
        if start_node not in visited:
            q = [start_node]
            while q:
                x, y = q.pop(0)
                if (x, y) in visited:
                    continue
                visited.add((x, y))
                
                r, g, b, a = pixels[x, y]
                # Check if pixel is close to white
                if r > 235 and g > 235 and b > 235:
                    # Make it transparent
                    pixels[x, y] = (r, g, b, 0)
                    
                    # Add neighbors
                    for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < width and 0 <= ny < height:
                            if (nx, ny) not in visited:
                                q.append((nx, ny))
                                
    img.save(output_path, "PNG")
    print(f"Saved to {output_path}")

if __name__ == "__main__":
    remove_white_bg(sys.argv[1], sys.argv[2])
