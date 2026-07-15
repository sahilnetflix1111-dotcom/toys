import pandas as pd
import os
import requests
import re
import glob

# Set directory where your refined excel files are
base_dir = '/home/parrot/Downloads/Telegram Desktop/SexToys_Project/new products/for antigravity/'

# Directory where we will save the folders with images
images_base_dir = os.path.join(base_dir, 'Downloaded_Images')
os.makedirs(images_base_dir, exist_ok=True)

def sanitize_folder_name(name):
    # Remove invalid characters for Windows/Linux folder names
    safe_name = re.sub(r'[<>:"/\\|?*]', '', str(name)).strip()
    return safe_name

# Find all the refined excel files
refined_files = glob.glob(os.path.join(base_dir, '*_refined.xlsx'))

for f in refined_files:
    print(f"\n--- Processing file: {os.path.basename(f)} ---")
    df = pd.read_excel(f)
    
    # Identify which column contains the product name
    title_col = None
    for col in ['title', 'item_page_title', 'name', 'data']:
        if col in df.columns:
            title_col = col
            break
            
    if not title_col or 'Product_Images_Comma_Separated' not in df.columns:
        print(f"Skipping {os.path.basename(f)} - Missing title or image columns.")
        continue
        
    for idx, row in df.iterrows():
        product_name = str(row[title_col])
        if pd.isna(product_name) or product_name.lower() == 'nan':
            continue
            
        images_str = str(row['Product_Images_Comma_Separated'])
        if pd.isna(images_str) or images_str.lower() == 'nan':
            continue
            
        # Create a subfolder for the product
        safe_folder_name = sanitize_folder_name(product_name)
        product_dir = os.path.join(images_base_dir, safe_folder_name)
        os.makedirs(product_dir, exist_ok=True)
        
        urls = images_str.split(',')
        for i, url in enumerate(urls):
            url = url.strip()
            if not url.startswith('http'):
                continue
                
            # Extract image filename from URL (ignoring query parameters like ?v=123)
            img_name = url.split('/')[-1].split('?')[0]
            if not img_name:
                img_name = f"image_{i}.jpg"
                
            img_path = os.path.join(product_dir, img_name)
            
            # Skip if already downloaded
            if os.path.exists(img_path):
                print(f"Already exists: {safe_folder_name}/{img_name}")
                continue
                
            # Download the image
            try:
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    with open(img_path, 'wb') as img_file:
                        img_file.write(response.content)
                    print(f"Downloaded: {safe_folder_name}/{img_name}")
                else:
                    print(f"Failed (Status {response.status_code}): {url}")
            except Exception as e:
                print(f"Error downloading {url}: {e}")

print("\nAll downloads finished! Images are saved in the 'Downloaded_Images' folder.")
