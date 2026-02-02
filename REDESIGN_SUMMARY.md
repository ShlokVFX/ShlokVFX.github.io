# Website Redesign Summary

## Changes Made

### 1. **HTML Redesign** (index.html)
   - **Updated Bio**: Changed to "I'm an AI/ML engineer focused on high-performance LLM inference, working across GPU kernels, attention mechanisms, and system-level optimizations to turn research ideas into efficient, production-ready systems."
   - **Removed Sections**: 
     - Experience section (Houdini FX role)
     - Skills section with redundant categories
     - CV section (moved to footer)
   - **New Sections**:
     - **Interests Section**: Showcasing research focus areas:
       - Low-Level GPU Programming (CUDA, Triton, HIP/ROCm, PyTorch Extensions)
       - Attention Mechanisms (FlashAttention, Transformer optimization, KV Cache, Custom patterns)
       - Model Optimization (Quantization INT8/FP8, GPU Profiling, Memory optimization)
   - **Cleaner Navigation**: Removed redundant links, focused on: About, Projects, Interests, Contact
   - **Removed Audio References**: All audio asset mentions removed

### 2. **CSS Overhaul** (style.css)
   - **Minimal Design**: Removed gradient overlays, AI-vibe effects, excessive animations
   - **Color Scheme**: Changed to clean, human-designed palette:
     - Light: White background (#ffffff) with charcoal text (#1a1a1a)
     - Dark: Charcoal (#1a1a1a) with light text (#f5f5f5)
   - **Typography**: 
     - Simplified font stack (Inter only, removed JetBrains Mono)
     - Cleaner font sizes and hierarchy
     - Better line-height for readability
   - **Removed Features**:
     - Gradient text effects
     - Complex shadow systems
     - Animated decorative lines
     - Excessive hover animations
   - **Added**:
     - Simple, clean borders
     - Subtle hover states
     - Clean spacing and alignment
     - Responsive grid layouts

### 3. **JavaScript Simplification** (script.js)
   - **Removed**: All audio playback functionality (Among Us Sound Manager, cursor walking sounds, etc.)
   - **Kept**: Essential features only:
     - Theme toggle (light/dark mode)
     - Mobile navigation menu
     - Navigation highlighting on scroll
     - Smooth scroll for navigation links
   - **Code Size**: Reduced from 885 lines to 125 lines
   - **Performance**: Cleaner, faster, no audio overhead

### 4. **Content Updates**
   - **CV Link**: Updated to point to actual CV file (Shlok_Limbhare_cv-3.pdf)
   - **Metadata**: Updated title, description, keywords to reflect AI/ML focus
   - **Projects**: Kept both featured projects (100 Days of CUDA, AMD MI300X Kernels)
   - **Contact**: Email, GitHub, LinkedIn links all maintained

### 5. **Asset Cleanup**
   - **Removed**: `/assets/audio/` directory entirely (was 7+ MB of Among Us sounds)
   - **Kept**: CSS and JS only in assets
   - **Result**: Cleaner, faster repository

## Design Philosophy

The website now reflects:
- **Human-Designed**: Clean, minimal aesthetic without AI-generated vibes
- **Professional**: Suitable for both CV and blog-style presentation
- **Readable**: Focus on clarity and content hierarchy
- **Fast**: No unnecessary assets or animations
- **Accessible**: Better contrast, semantic HTML, keyboard navigation
- **Focused**: Clearly communicates AI/ML expertise in LLM inference

## Navigation Structure

```
Home (Hero)
├── About
├── Projects
│   ├── 100 Days of CUDA
│   └── AMD MI300X GPU Kernels
├── Research Interests
│   ├── Low-Level GPU Programming
│   ├── Attention Mechanisms
│   └── Model Optimization
└── Contact
    ├── Email
    ├── GitHub
    ├── LinkedIn
    └── Download CV
```

## Technologies Highlighted

**Low-Level GPU Programming**
- CUDA Development
- Triton Kernel Programming
- HIP / ROCm
- PyTorch C++/CUDA Extensions

**Attention Mechanisms**
- FlashAttention / FlashInfer-style Kernels
- Transformer Inference Optimization
- KV Cache & Memory Management
- Custom Attention Patterns

**Model Optimization**
- Quantization (INT8 / FP8)
- GPU Performance Profiling (Nsight)
- Memory Optimization
- Batching & Scheduling

## Technical Stack

- **HTML5**: Semantic, clean structure
- **CSS3**: No-framework minimal design
- **Vanilla JavaScript**: No dependencies, ~125 lines
- **Responsive**: Mobile-first, works on all devices
- **Dark Mode**: System preference detection + manual toggle
- **Accessibility**: WCAG compliant

## Result

A professional, fast-loading portfolio website that:
✅ Looks clean and human-designed
✅ Clearly communicates AI/ML expertise
✅ Focuses on LLM inference and GPU optimization
✅ No AI-generated vibes or excess features
✅ Readable like a CV, presentable like a blog
✅ Fast (minimal assets, no audio)
✅ Professional and maintainable code
