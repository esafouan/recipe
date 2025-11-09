# Social Media Configuration System ✅

## Overview
The social media buttons in the recipe detail component are now fully configurable through `site-config.json`, supporting both **profile links** and **recipe sharing** functionality.

## Configuration Location
**File**: `/config/site-config.json`
**Section**: `socialSharing`

## New Features
✅ **Profile Links**: Direct links to your social media profiles  
✅ **Recipe Sharing**: Share current recipe to social platforms  
✅ **Mixed Functionality**: Some buttons link to profiles, others share recipes  
✅ **Type Control**: Configure each button's behavior independently

## Configuration Structure

### Enhanced Configuration
```json
{
  "socialSharing": {
    "title": "Share this recipe",
    "profileLinks": {
      "facebook": "https://facebook.com/minirecipe",
      "pinterest": "https://www.pinterest.com/minirecipe_/"
    },
    "platforms": [...],
    "defaultButtons": [...]
  }
}
```

### Platform Configuration with Types
Each platform now supports a `type` property:

```json
{
  "id": "facebook",
  "name": "Facebook", 
  "icon": "facebook",
  "enabled": true,
  "mobileOnly": true,
  "description": "Visit our Facebook page",
  "type": "profile",
  "color": "text-blue-600",
  "hoverColor": "hover:bg-blue-600 hover:text-white"
}
```

#### Platform Types:
- **`"profile"`**: Links directly to your social media profile
- **`"share"`**: Shares the current recipe to the platform  
- **No type**: Defaults to sharing behavior

## Current Configuration

### Profile Link Buttons:
✅ **Facebook** → Links to `https://facebook.com/minirecipe`
✅ **Pinterest** → Links to `https://www.pinterest.com/minirecipe_/`

### Sharing Buttons:
✅ **Share** → Native device sharing (always visible)
❌ **Twitter** → Disabled (would share recipe if enabled)
❌ **WhatsApp** → Disabled (would share recipe if enabled)

### Pin It Buttons:
✅ **Pin It** buttons on recipe images still work for pinning specific recipes

### Always Available:
✅ **Print** → Print recipe functionality
✅ **Jump to Recipe** → Scroll to recipe instructions

## Button Behavior

### Profile Link Buttons:
- **Action**: Opens your social media profile in new tab
- **Target**: Your actual social media pages  
- **Security**: Opens with `noopener,noreferrer` for security
- **Text**: "Facebook", "Pinterest" (not "Share on..." or "Pin it")

### Recipe Sharing Buttons:
- **Action**: Opens platform sharing dialog with current recipe
- **Target**: Platform's sharing interface
- **Content**: Recipe name, description, image, and page URL
- **Text**: "Share", "Twitter", "WhatsApp"

## How to Modify

### Switch Button Type:
Change between profile linking and recipe sharing:
```json
{
  "id": "facebook",
  "type": "profile"  // Links to profile
}
```
```json  
{
  "id": "facebook", 
  "type": "share"    // Shares current recipe
}
```

### Add Profile URLs:
Update your social media URLs in `profileLinks`:
```json
{
  "profileLinks": {
    "facebook": "https://facebook.com/yourpage",
    "pinterest": "https://pinterest.com/yourprofile", 
    "instagram": "https://instagram.com/youraccount"
  }
}
```

### Enable/Disable Platforms:
```json
{
  "id": "twitter",
  "enabled": true,  // Change to show Twitter button
  "type": "share"   // Will share current recipe
}
```

## Mixed Strategy Examples

### Brand Building Setup:
Use profile links for main social platforms, sharing for messaging:
```json
{
  "platforms": [
    {"id": "facebook", "type": "profile", "enabled": true},
    {"id": "pinterest", "type": "profile", "enabled": true}, 
    {"id": "whatsapp", "type": "share", "enabled": true}
  ]
}
```

### Viral Sharing Setup:
Use sharing for all platforms to maximize recipe distribution:
```json
{
  "platforms": [
    {"id": "facebook", "type": "share", "enabled": true},
    {"id": "pinterest", "type": "share", "enabled": true},
    {"id": "twitter", "type": "share", "enabled": true}
  ]
}
```

### Profile + Pin Setup (Current):
Link to profiles but keep recipe pinning for Pinterest:
```json
{
  "platforms": [
    {"id": "facebook", "type": "profile", "enabled": true},
    {"id": "pinterest", "type": "profile", "enabled": true}
  ]
}
```
Plus: Pin It buttons on images for recipe-specific pinning.

## Technical Implementation

### Profile Link Handler:
```typescript
if (platformType === 'profile') {
  const profileUrl = socialSharingConfig.profileLinks?.[platformId];
  if (profileUrl) {
    window.open(profileUrl, "_blank", "noopener,noreferrer");
    return;
  }
}
```

### Fallback Behavior:
- If `type: "profile"` but no URL in `profileLinks` → Falls back to sharing
- If no `type` specified → Defaults to sharing behavior
- Invalid platform ID → Falls back to generic sharing

## Benefits

### For Brand Building:
✅ **Direct traffic** to your social media profiles  
✅ **Follower growth** instead of just one-time shares
✅ **Brand consistency** across all touchpoints
✅ **Engagement** on your main social channels

### For Recipe Sharing:
✅ **Recipe virality** through sharing functionality
✅ **Pin It buttons** still work for Pinterest recipes  
✅ **Flexible strategy** - mix profile and sharing buttons
✅ **Easy switching** between strategies via config

### For User Experience:
✅ **Clear expectations** - button text indicates action
✅ **Consistent behavior** across your site
✅ **Security** with proper link handling
✅ **Performance** with memoized handlers

The social media system now supports both building your brand presence and driving recipe sharing! 🎯📱✨
