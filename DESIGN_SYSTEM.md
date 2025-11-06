# Design System - Sliding Tic-Tac-Toe

## Color Palette

### Primary Colors
- **Indigo**: #4f46e5 (primary actions)
- **Indigo Light**: #6366f1 (gradients)
- **Slate**: #334155 (text on light backgrounds)
- **Slate Dark**: #1e293b (primary text)

### Status Colors
- **Success (Green)**: #16a34a, #86efac, #6ee7b7
- **Danger (Red)**: #dc2626, #fecaca, #fca5a5
- **Info (Blue)**: #60a5fa, #93c5fd
- **Warning (Amber)**: #f59e0b

### Neutral Colors
- **Background**: #f8fafc, #f1f5f9
- **Border**: #e2e8f0, #cbd5e0
- **Text Secondary**: #64748b, #718096
- **Disabled**: #a0aec0

### Gradients
```css
/* Primary Button */
linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)

/* Header Buttons */
linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)

/* Cards */
linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)

/* Player X */
linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)

/* Player O */
linear-gradient(135deg, #86efac 0%, #6ee7b7 100%)

/* Phase Badge */
linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)

/* Message */
linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%)

/* Winner Message */
linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)
```

## Typography

### Font Family
```css
-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
```

### Font Sizes
| Size | Value | Usage |
|------|-------|-------|
| xs | 0.8rem | Small labels, clear button |
| sm | 0.85rem | Secondary text, history items |
| base | 0.9rem | Info labels |
| md | 0.95rem | Body text, phase badge, buttons |
| lg | 1rem | Message text |
| xl | 1.2rem | Tagline |
| 2xl | 1.4rem | Player badge |
| 3xl | 2.2rem | Main heading |

### Font Weights
- **Regular**: 500 (tagline)
- **Semibold**: 600 (labels, info labels, buttons)
- **Bold**: 700 (message, history header, reset button)
- **Extrabold**: 800 (heading, player badge, piece count)

### Letter Spacing
- **Normal**: 0 (default)
- **Tight**: -0.5px (heading)
- **Loose**: 0.3-0.5px (uppercase labels)

## Spacing Scale

| Name | Value | Usage |
|------|-------|-------|
| xs | 4px | Small gaps |
| sm | 6px | Button padding, small gaps |
| md | 8px | Scrollbar padding |
| lg | 12px | Card padding, section gaps |
| xl | 16px | Card padding, info gaps |
| 2xl | 20px | Main padding, panel gaps |

## Border Radius

| Size | Value | Usage |
|------|-------|-------|
| sm | 8px | Clear button |
| md | 10px | Header buttons, phase badge |
| lg | 12px | Cards, reset button, history items |
| xl | 14px | Game info card |
| full | 50% | Circular elements |

## Shadows

### Shadow Scale
```css
/* Small */
0 2px 6px rgba(0, 0, 0, 0.06)

/* Medium */
0 2px 8px rgba(0, 0, 0, 0.04)

/* Large */
0 4px 12px rgba(0, 0, 0, 0.1)

/* Extra Large */
0 8px 20px rgba(0, 0, 0, 0.15)

/* Colored Shadows */
0 4px 12px rgba(79, 70, 229, 0.3)    /* Indigo */
0 4px 12px rgba(59, 130, 246, 0.2)   /* Blue */
0 4px 12px rgba(34, 197, 94, 0.2)    /* Green */
```

## Components

### Buttons

#### Primary Button (Reset)
```css
padding: 14px 20px;
font-size: 0.95rem;
font-weight: 700;
color: white;
background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
border: none;
border-radius: 12px;
box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
text-transform: uppercase;
letter-spacing: 0.5px;
```

**States**:
- Hover: translateY(-2px), shadow 0 8px 20px
- Active: translateY(0), shadow 0 4px 12px

#### Secondary Button (Header)
```css
padding: 10px 18px;
font-size: 0.95rem;
font-weight: 600;
color: #334155;
background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
border: 1px solid #cbd5e0;
border-radius: 10px;
box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
```

**States**:
- Hover: gradient darker, border #94a3b8, translateY(-2px)
- Active: translateY(0)

#### Danger Button (Clear History)
```css
padding: 6px 12px;
font-size: 0.8rem;
font-weight: 700;
color: #dc2626;
background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
border: 1px solid #fca5a5;
border-radius: 8px;
text-transform: uppercase;
letter-spacing: 0.3px;
```

### Badges

#### Player Badge
```css
padding: 12px 16px;
font-size: 1.4rem;
font-weight: 800;
min-width: 70px;
border-radius: 10px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
```

**Variants**:
- X: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%), color #991b1b
- O: linear-gradient(135deg, #86efac 0%, #6ee7b7 100%), color #15803d

#### Phase Badge
```css
padding: 10px 14px;
font-size: 0.95rem;
font-weight: 700;
background: linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%);
color: #1e3a8a;
border-radius: 10px;
box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
text-transform: uppercase;
letter-spacing: 0.5px;
```

### Cards

#### Info Card
```css
padding: 20px;
background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
border: 1px solid #e2e8f0;
border-radius: 14px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
```

#### Pieces Card
```css
padding: 16px;
background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
border: 1px solid #e2e8f0;
border-radius: 12px;
```

#### History Item
```css
padding: 10px 12px;
background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
border: 1px solid #e2e8f0;
border-radius: 8px;
transition: all 0.2s ease;
```

**Hover**:
```css
background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
border-color: #cbd5e0;
```

### Messages

#### Normal Message
```css
font-size: 1rem;
font-weight: 700;
min-height: 50px;
padding: 12px 16px;
background: linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%);
border: 1px solid #c7d2fe;
border-radius: 12px;
box-shadow: 0 2px 8px rgba(79, 70, 229, 0.1);
color: #1e293b;
```

#### Winner Message
```css
background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
border-color: #86efac;
box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
color: #166534;
animation: celebration 0.5s ease-in-out;
```

## Animations

### Celebration
```css
@keyframes celebration {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}
```

### Transitions
- **Default**: 0.2s ease
- **Buttons**: 0.3s ease
- **Cards**: 0.2s ease

## Layout

### Spacing System
- **Header**: 16px padding, 2px border
- **Main Content**: 20px padding, 20px gap
- **Left Panel**: 240px min-width, 20px gap, 8px scrollbar padding
- **Cards**: 16-20px padding, 12-16px internal gaps

### Responsive Breakpoints
- **Mobile**: max-width 400px
- **Tablet**: max-width 768px
- **Desktop**: max-width 1000px

## Accessibility

### Color Contrast
- Text on background: WCAG AA (4.5:1 minimum)
- Large text: WCAG AA (3:1 minimum)
- All colors tested for colorblind accessibility

### Touch Targets
- Minimum 10px padding (40px+ total)
- Buttons: 14px+ padding
- Clear focus states

### Typography
- Minimum font size: 0.8rem (with context)
- Line height: 1.4-1.7 for readability
- Letter spacing for emphasis

## Usage Guidelines

### When to Use Each Component

**Primary Button**: Main actions (New Game, Share)
**Secondary Button**: Navigation (How to Play, Share)
**Danger Button**: Destructive actions (Clear History)

**Player Badge**: Current player indicator
**Phase Badge**: Game phase indicator

**Info Card**: Game state information
**Message**: Game status and feedback
**History Item**: Past game records

## Implementation Notes

1. **Consistency**: Use the same spacing, colors, and shadows across all components
2. **Hierarchy**: Larger, bolder text for important information
3. **Feedback**: All interactive elements have hover/active states
4. **Accessibility**: High contrast, clear labels, proper sizing
5. **Performance**: Use gradients sparingly, optimize shadows
6. **Responsive**: Adjust spacing and sizes for mobile devices

## Future Enhancements

- Dark mode support (invert colors, adjust shadows)
- Animation library for smoother transitions
- Custom scrollbar styling for all browsers
- Accessibility improvements (ARIA labels, keyboard navigation)
- Theme customization (color picker)
