import os
import re

# Paths
svg_path = r'd:\sem301\ThaiPBS\web\assests\img\thailand_map.svg'
html_path = r'd:\sem301\ThaiPBS\web\index.html'

# Data to inject
data_map = {
    'kkn': {
        'data-name': 'ขอนแก่น',
        'data-summary': 'ศูนย์กลางฟอสซิลไดโนเสาร์อีสาน',
        'data-museum': 'พิพิธภัณฑ์สิรินธร, พิพิธภัณฑ์ไดโนเสาร์ภูเวียง',
        'data-geopark': 'ขอนแก่นจีโอพาร์ก (Khon Kaen Geopark)'
    },
    'ksn': {
        'data-name': 'กาฬสินธุ์',
        'data-summary': 'ดินแดนภูน้อยและไดโนเสาร์หลายชนิด',
        'data-museum': 'พิพิธภัณฑ์สิรินธร',
        'data-geopark': 'จังหวัดกาฬสินธุ์ – พื้นที่ฟอสซิลสำคัญ'
    },
    'nma': {
        'data-name': 'นครราชสีมา',
        'data-summary': 'บ้านของสยามแรปเตอร์ ราชสีมาซอรัส และ Sirindhorna',
        'data-museum': 'พิพิธภัณฑ์ไม้กลายเป็นหินเฉลิมพระเกียรติฯ',
        'data-geopark': 'โคราชจีโอพาร์ก (Khorat Geopark)'
    }
}

# Read SVG
with open(svg_path, 'r', encoding='utf-8') as f:
    svg_content = f.read()

# Inject data attributes
for pid, attrs in data_map.items():
    # Find the path with this id
    # Pattern: id="pid" ... > or id="pid" ... />
    # We want to insert attributes before the closing > or />
    # But regex replacement on XML/HTML with regex is fragile.
    # However, the SVG structure is fairly regular: <path id="kkn" ... />
    
    # Construct the attribute string
    attr_str = ' '.join([f'{k}="{v}"' for k, v in attrs.items()])
    attr_str = ' ' + attr_str
    
    # Regex to find the path tag
    # Look for <path ... id="pid" ... />
    # We'll just replace 'id="pid"' with 'id="pid" [attributes]'
    # This is simple and effective if id is present.
    
    pattern = f'id="{pid}"'
    replacement = f'id="{pid}"{attr_str} class="province"' # Add class province as well
    
    svg_content = svg_content.replace(pattern, replacement)

# Add class="th-map" to the svg tag
svg_content = svg_content.replace('<svg', '<svg class="th-map"')

# Read HTML
with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Find the wrapper and replace content
# We look for <div class="map-svg-wrapper"> ... </div>
# Since we want to replace the INNER content, we can use regex or string find.
start_marker = '<div class="map-svg-wrapper">'
end_marker = '</div>'

start_idx = html_content.find(start_marker)
if start_idx != -1:
    # Find the closing div for this wrapper. 
    # Since there might be nested divs, we should be careful.
    # But looking at the file, the wrapper contains only the SVG and comments.
    # We can look for the next </div> after start_idx.
    
    # Actually, let's just replace the specific placeholder SVG block we identified earlier.
    # It starts with <svg class="th-map" ... and ends with </svg>
    
    svg_start = html_content.find('<svg class="th-map"', start_idx)
    svg_end = html_content.find('</svg>', svg_start) + 6
    
    if svg_start != -1 and svg_end != -1:
        new_html = html_content[:svg_start] + svg_content + html_content[svg_end:]
        
        # Write back
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print("Successfully updated index.html")
    else:
        print("Could not find placeholder SVG in index.html")
else:
    print("Could not find map-svg-wrapper in index.html")
