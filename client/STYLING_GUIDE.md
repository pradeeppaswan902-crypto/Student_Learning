# Dashboard Customization & Styling Guide

## Color Themes

### Default Theme (Blue)
Currently implemented with:
- Primary: Blue-600
- Secondary: Purple-500, Orange-500, Green-500
- Background: Gray-50, White

### Custom Theme Colors

To apply a different color theme, update the component color classes:

#### Dark Theme Example
```javascript
// Update in components - replace blue-600 with indigo-900
// For greeting section:
className="bg-gradient-to-r from-indigo-900 to-indigo-950 text-white"

// For progress bars:
className="bg-gradient-to-r from-indigo-600 to-indigo-700"
```

#### Green Theme Example
```javascript
// For greeting section:
className="bg-gradient-to-r from-green-600 to-green-800 text-white"

// For score card:
className="text-green-600"  // Main color
className="bg-green-50"      // Background
```

#### Professional Purple Theme
```javascript
// For greeting section:
className="bg-gradient-to-r from-purple-600 to-purple-800"

// For cards and accents:
className="text-purple-600"
className="bg-purple-200"
className="border-purple-500"
```

---

## Component-Specific Styling

### 1. Greeting Section Customization

**Change Color Scheme:**
```jsx
// GreetingSection.jsx
<div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-8 rounded-lg shadow-lg">
  {/* content */}
</div>
```

**Add Background Pattern:**
```jsx
<div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg shadow-lg relative overflow-hidden">
  <div className="absolute inset-0 opacity-10">
    {/* Add pattern SVG here */}
  </div>
</div>
```

### 2. Score Card Styling

**Change Progress Circle Colors:**
```jsx
// Update stroke colors for different performance levels
const getCircleColor = (score) => {
  if (score >= 90) return '#8b5cf6';  // Purple for excellent
  if (score >= 80) return '#10b981';  // Green for good
  if (score >= 70) return '#f59e0b';  // Amber for average
  return '#ef4444';                   // Red for poor
};
```

**Add Animation:**
```jsx
// Add to SVG circle for pulsing effect
animate={{ r: [45, 46, 45] }}
transition={{ duration: 2, repeat: Infinity }}
```

### 3. Chart Customization

**Change Chart Colors:**
```jsx
// WeeklyActivityChart.jsx
<Bar
  dataKey="lessons"
  fill="#8b5cf6"  // Change from blue to purple
  name="Lessons"
  radius={[8, 8, 0, 0]}
/>

<Line
  type="monotone"
  dataKey="time"
  stroke="#ec4899"  // Change from purple to pink
  strokeWidth={2}
/>
```

**Modify Tooltip Styling:**
```jsx
<Tooltip
  contentStyle={{
    backgroundColor: '#1f2937',  // Dark background
    borderColor: '#6366f1',      // Indigo border
    borderRadius: '12px',
    color: '#ffffff'
  }}
/>
```

### 4. Card Shadows & Hover Effects

**Modify Shadow Intensity:**
```jsx
// Change shadow on hover
className="shadow-md hover:shadow-2xl transition duration-300"

// Or use custom shadows
className="shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
```

### 5. Event Calendar Colors

**Custom Event Type Colors:**
```jsx
const getEventColor = (type) => {
  switch (type) {
    case 'quiz':
      return 'border-l-4 border-indigo-500 bg-indigo-50';
    case 'assignment':
      return 'border-l-4 border-pink-500 bg-pink-50';
    case 'event':
      return 'border-l-4 border-emerald-500 bg-emerald-50';
    default:
      return 'border-l-4 border-gray-500 bg-gray-50';
  }
};
```

### 6. Leaderboard Medal Colors

**Update Medal Styling:**
```jsx
const getRankColor = (rank) => {
  switch (rank) {
    case 1:
      return 'bg-amber-50 border-l-4 border-amber-600';  // Changed yellow to amber
    case 2:
      return 'bg-slate-50 border-l-4 border-slate-500';  // Changed gray to slate
    case 3:
      return 'bg-rose-50 border-l-4 border-rose-600';    // Changed orange to rose
    default:
      return 'bg-white border-l-4 border-indigo-300';
  }
};
```

---

## Global Styling Changes

### Update Tailwind Configuration

Edit `tailwind.config.js` to customize colors globally:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
        },
        secondary: {
          500: '#8b5cf6',
          600: '#7c3aed',
        }
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
      },
      borderRadius: {
        lg: '0.5rem',
        xl: '0.75rem',
      }
    },
  },
  plugins: [],
}
```

### Apply Theme Across Components

```jsx
// Use custom theme colors
className="bg-primary-600 text-white"
className="border-secondary-500"
className="text-primary-700"
```

---

## Layout Customizations

### Change Grid Layout

**More Compact Layout (3 columns on desktop):**
```jsx
// Dashboard.jsx - Modify grid
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {/* Components */}
</div>
```

**Full Width Components:**
```jsx
<div className="w-full">
  <WeeklyActivityChart data={data} />
</div>
```

### Add Spacing/Padding Variations

```jsx
// Comfortable spacing
<div className="bg-gray-50 min-h-screen p-8">
  {/* More padding */}
</div>

// Compact spacing
<div className="bg-gray-50 min-h-screen p-4">
  {/* Less padding */}
</div>
```

---

## Animation Enhancements

### Add Entrance Animations

```jsx
// Use Framer Motion (optional dependency)
import { motion } from 'framer-motion';

export const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Dashboard content */}
    </motion.div>
  );
};
```

### Stagger Animation for Cards

```jsx
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
  initial="hidden"
  animate="show"
>
  {cards.map(card => (
    <motion.div key={card.id} variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
      {/* Card content */}
    </motion.div>
  ))}
</motion.div>
```

---

## Dark Mode Support

### Add Dark Mode Toggle

```jsx
// hooks/useDarkMode.jsx
import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const preference = localStorage.getItem('darkMode');
    setIsDark(preference === 'true');
  }, []);

  const toggle = () => {
    setIsDark(!isDark);
    localStorage.setItem('darkMode', !isDark);
    document.documentElement.classList.toggle('dark');
  };

  return [isDark, toggle];
};
```

### Dark Mode Colors in Components

```jsx
// Update components for dark mode
<div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 rounded-lg">
  <h3 className="text-gray-600 dark:text-gray-400">Header</h3>
</div>
```

---

## Responsive Design Customization

### Adjust Breakpoints

```jsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Components stack on mobile, 2 cols on tablet, etc. */}
</div>

// Custom breakpoints in tailwind.config.js
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}
```

### Hide/Show Components by Screen Size

```jsx
{/* Show only on desktop */}
<div className="hidden lg:block">
  <SkillsCard />
</div>

{/* Show only on mobile/tablet */}
<div className="lg:hidden">
  <SimplifiedView />
</div>
```

---

## Font Customization

### Change Font Family

```javascript
// tailwind.config.js
theme: {
  fontFamily: {
    sans: ['Inter', 'ui-sans-serif', 'system-ui'],
    serif: ['Georgia', 'serif'],
    mono: ['Menlo', 'Monaco', 'monospace'],
  },
}
```

### Apply to Components

```jsx
<div className="font-sans text-base">Normal text</div>
<h1 className="font-serif text-3xl">Serif heading</h1>
<code className="font-mono text-sm">Code block</code>
```

---

## Component Size Variations

### Create Size Props for Reusability

```jsx
// AcademicScoreCard.jsx - Add size variation
const AcademicScoreCard = ({ score = 0, size = 'md' }) => {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`bg-white rounded-lg shadow-md ${sizeClasses[size]}`}>
      {/* content */}
    </div>
  );
};
```

---

## Accessibility Enhancements

### Add ARIA Labels

```jsx
<div
  role="progressbar"
  aria-valuenow={percentage}
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Assignment completion progress"
>
  {/* Progress bar */}
</div>
```

### Ensure Color Contrast

```jsx
// Use high contrast colors for text
<p className="text-gray-800 dark:text-gray-100">High contrast text</p>

// Avoid color-only info
<span>● Red (Error)</span>  // Description with color indicator
```

---

## Performance Optimization

### Lazy Load Components

```jsx
import React, { lazy, Suspense } from 'react';

const Leaderboard = lazy(() => import('./Leaderboard'));

export const Dashboard = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Leaderboard />
    </Suspense>
  );
};
```

### Memoize Components

```jsx
import React from 'react';

export const AcademicScoreCard = React.memo(({ score }) => {
  return <div>{score}%</div>;
});
```

---

## Preset Themes

### Copy-Paste Theme Configurations

**Tech Blue Theme (Current - Default)**
```
Primary: #0284c7 (Blue-600)
Secondary: #8b5cf6 (Purple-500)
Success: #10b981 (Green-500)
Warning: #f59e0b (Amber-500)
Danger: #ef4444 (Red-500)
```

**Professional Dark Theme**
```
Primary: #6366f1 (Indigo-500)
Secondary: #8b5cf6 (Purple-500)
Success: #14b8a6 (Teal-500)
Warning: #eab308 (Yellow-400)
Danger: #f87171 (Red-400)
Background: #0f172a (Slate-950)
```

**Minimalist Light Theme**
```
Primary: #374151 (Gray-700)
Secondary: #6b7280 (Gray-500)
Success: #059669 (Emerald-600)
Warning: #d97706 (Amber-600)
Danger: #dc2626 (Red-600)
Background: #ffffff (White)
```

---

## Browser DevTools Tips

1. **Inspect Elements:** Right-click → Inspect Element
2. **Modify Styles:** Edit CSS in DevTools for quick testing
3. **Responsive Testing:** Toggle device toolbar (Ctrl+Shift+M)
4. **Performance Profiling:** Lighthouse audit for optimization

---

**Last Updated:** April 21, 2026
