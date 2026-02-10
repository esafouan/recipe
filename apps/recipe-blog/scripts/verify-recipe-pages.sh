#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Recipe Page Verification Script"
echo "=================================="
echo ""

# Wait for dev server
echo "⏳ Waiting for dev server to be ready..."
sleep 10

# Test recipes from different authors and categories
recipes=(
  "mortons-chicken-christopher:Chef Michael:Chicken"
  "easy-chicken-and-dumplings:Chef Michael:Chicken"
  "creamy-chicken-tortilla-soup:Sarah Mitchell:Soup"
  "spicy-thai-basil-chicken:Chef Michael:Chicken"
  "classic-beef-stew:Chef Michael:Beef"
  "chocolate-chip-cookies:Emily Rodriguez:Dessert"
)

failed=0
passed=0

for recipe_info in "${recipes[@]}"; do
  IFS=':' read -r slug author category <<< "$recipe_info"
  
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📖 Testing: $slug"
  echo "   Author: $author | Category: $category"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  # Fetch the page
  response=$(curl -s -w "\n%{http_code}" "http://localhost:3000/recipes/$slug")
  http_code=$(echo "$response" | tail -n1)
  content=$(echo "$response" | sed '$d')
  
  # Check HTTP status
  if [ "$http_code" != "200" ]; then
    echo -e "${RED}❌ FAILED: HTTP $http_code${NC}"
    ((failed++))
    continue
  fi
  
  echo -e "${GREEN}✓ Page loads (HTTP 200)${NC}"
  
  # Check for author content sections
  checks=(
    "Author's Personal Touch"
    "My Culinary Journey"
    "Recipe Notes"
  )
  
  all_checks_passed=true
  
  for check in "${checks[@]}"; do
    if echo "$content" | grep -q "$check"; then
      echo -e "${GREEN}✓ Found: $check${NC}"
    else
      echo -e "${RED}❌ Missing: $check${NC}"
      all_checks_passed=false
    fi
  done
  
  # Check for author bio card
  if echo "$content" | grep -q "About the Author"; then
    echo -e "${GREEN}✓ Author bio card present${NC}"
  else
    echo -e "${RED}❌ Missing: Author bio card${NC}"
    all_checks_passed=false
  fi
  
  # Check for author name in content
  if echo "$content" | grep -q "$author"; then
    echo -e "${GREEN}✓ Author name ($author) found${NC}"
  else
    echo -e "${YELLOW}⚠ Author name ($author) not found (may be in different format)${NC}"
  fi
  
  # Check for structured data (schema)
  if echo "$content" | grep -q "application/ld+json"; then
    echo -e "${GREEN}✓ Structured data present${NC}"
  else
    echo -e "${RED}❌ Missing: Structured data${NC}"
    all_checks_passed=false
  fi
  
  # Count paragraphs in content (rough estimate of content length)
  para_count=$(echo "$content" | grep -o "<p>" | wc -l)
  if [ "$para_count" -gt 10 ]; then
    echo -e "${GREEN}✓ Substantial content (~$para_count paragraphs)${NC}"
  else
    echo -e "${YELLOW}⚠ Limited content (~$para_count paragraphs)${NC}"
  fi
  
  if [ "$all_checks_passed" = true ]; then
    echo -e "${GREEN}✅ PASSED: All critical checks${NC}"
    ((passed++))
  else
    echo -e "${RED}❌ FAILED: Some checks failed${NC}"
    ((failed++))
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Passed: $passed${NC}"
echo -e "${RED}Failed: $failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
  echo -e "${GREEN}🎉 All recipe pages verified successfully!${NC}"
  echo -e "${GREEN}✨ Site is ready for AdSense submission.${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  Some pages have issues. Review the output above.${NC}"
  exit 1
fi
