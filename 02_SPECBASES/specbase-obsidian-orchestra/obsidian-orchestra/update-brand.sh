#!/bin/bash
# Update brand from FinOps to Orchestra.blue

echo "🎵 Updating brand to Orchestra.blue..."
echo ""

# Find all markdown files
find . -name "*.md" -type f | while read file; do
    # Skip if file doesn't contain old names
    if ! grep -q "FinOps\|Financial Intelligence Platform" "$file" 2>/dev/null; then
        continue
    fi
    
    echo "Updating: $file"
    
    # Create backup
    cp "$file" "$file.backup"
    
    # Replace names
    sed -i '' 's/FinOps Intelligence Platform/Orchestra.blue/g' "$file"
    sed -i '' 's/Financial Intelligence Platform/Orchestra.blue/g' "$file"
    sed -i '' 's/FinOps/Orchestra/g' "$file"
    sed -i '' 's/finops/orchestra/g' "$file"
done

echo ""
echo "✅ Brand update complete!"
echo ""
echo "Files updated: $(find . -name "*.md.backup" | wc -l)"
