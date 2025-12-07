# 🎭 Animation System - Hướng dẫn sử dụng

## 📋 **Tổng quan**
Hệ thống animation được xây dựng bằng **Framer Motion** để tạo hiệu ứng chuyển trang mượt mà và đẹp mắt cho toàn bộ ứng dụng.

## 🚀 **Các Component chính**

### **1. PageTransition**
Component cơ bản để wrap toàn bộ nội dung trang với hiệu ứng fade in/out.

```jsx
import PageTransition from '../components/PageTransition';

const MyPage = () => {
  return (
    <PageTransition>
      <div>Nội dung trang</div>
    </PageTransition>
  );
};
```

**Props:**
- `className`: CSS classes tùy chỉnh
- `delay`: Độ trễ trước khi bắt đầu animation (mặc định: 0)

### **2. AnimatedRoute**
Component để wrap các route với hiệu ứng chuyển trang mượt mà.

```jsx
import AnimatedRoute from '../components/AnimatedRoute';

<Route path="/about" element={
  <AnimatedRoute>
    <About />
  </AnimatedRoute>
} />
```

**Hiệu ứng:**
- Fade in từ dưới lên với scale
- Duration: 0.6s
- Easing: Custom cubic-bezier

### **3. FadeIn**
Component để tạo hiệu ứng fade in cho các element con.

```jsx
import FadeIn from '../components/FadeIn';

<FadeIn delay={0.2} direction="up">
  <Hero />
</FadeIn>
```

**Props:**
- `delay`: Độ trễ (mặc định: 0)
- `duration`: Thời gian animation (mặc định: 0.6s)
- `direction`: Hướng animation ("up", "down", "left", "right")

### **4. StaggeredList**
Component để tạo hiệu ứng staggered cho danh sách.

```jsx
import StaggeredList from '../components/StaggeredList';

<StaggeredList staggerDelay={0.1} direction="up">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</StaggeredList>
```

**Props:**
- `staggerDelay`: Độ trễ giữa các item (mặc định: 0.1s)
- `direction`: Hướng animation
- `className`: CSS classes tùy chỉnh

### **5. HoverEffect**
Component để tạo hiệu ứng hover cho các element tương tác.

```jsx
import HoverEffect from '../components/HoverEffect';

<HoverEffect scale={1.05} duration={0.2}>
  <button>Click me</button>
</HoverEffect>
```

**Props:**
- `scale`: Tỷ lệ scale khi hover (mặc định: 1.05)
- `duration`: Thời gian transition (mặc định: 0.2s)

### **6. AnimatedText**
Component để tạo hiệu ứng text animation.

```jsx
import AnimatedText from '../components/AnimatedText';

<AnimatedText animation="bounceIn" delay={0.3}>
  <h1>Tiêu đề đẹp</h1>
</AnimatedText>
```

**Props:**
- `animation`: Loại animation ("fadeIn", "slideInLeft", "slideInRight", "scaleIn", "bounceIn")
- `delay`: Độ trễ
- `duration`: Thời gian animation

### **7. ParallaxScroll**
Component để tạo hiệu ứng parallax scrolling.

```jsx
import ParallaxScroll from '../components/ParallaxScroll';

<ParallaxScroll speed={0.5}>
  <div>Nội dung có hiệu ứng parallax</div>
</ParallaxScroll>
```

**Props:**
- `speed`: Tốc độ parallax (mặc định: 0.5)

## 🎨 **Cách sử dụng trong các trang**

### **Trang Home:**
```jsx
const Home = () => {
  return (
    <PageTransition>
      <div className='bg-white'>
        <FadeIn delay={0.1}>
          <Hero />
        </FadeIn>
        <FadeIn delay={0.2}>
          <LatestCollection/>
        </FadeIn>
        <FadeIn delay={0.3}>
          <BestSeller />
        </FadeIn>
        <FadeIn delay={0.4}>
          <OurPolicy />
        </FadeIn>
        <FadeIn delay={0.5}>
          <NewsletterBox />
        </FadeIn>
      </div>
    </PageTransition>
  );
};
```

### **Trang Collection:**
```jsx
const Collection = () => {
  return (
    <PageTransition>
      <FadeIn>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Filters */}
          <div className='lg:w-72'>
            {/* Filter content */}
          </div>
          
          {/* Products */}
          <div className='flex-1'>
            <StaggeredList staggerDelay={0.05}>
              {products.map(product => (
                <ProductItem key={product.id} {...product} />
              ))}
            </StaggeredList>
          </div>
        </div>
      </FadeIn>
    </PageTransition>
  );
};
```

## ⚙️ **Cấu hình App.jsx**

```jsx
import { AnimatePresence } from "framer-motion";
import AnimatedRoute from "./components/AnimatedRoute";

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <AnimatedRoute>
            <Home />
          </AnimatedRoute>
        } />
        {/* Other routes */}
      </Routes>
    </AnimatePresence>
  );
};
```

## 🎯 **Best Practices**

### **1. Thứ tự animation:**
- Sử dụng `delay` tăng dần (0.1, 0.2, 0.3...) để tạo hiệu ứng cascade
- Hero section nên có delay thấp nhất (0.1)
- Footer nên có delay cao nhất

### **2. Performance:**
- Không sử dụng quá nhiều animation cùng lúc
- Sử dụng `AnimatePresence mode="wait"` để tránh conflict
- Wrap animation components một cách hợp lý

### **3. Accessibility:**
- Đảm bảo animation không quá nhanh hoặc quá chậm
- Sử dụng `prefers-reduced-motion` media query nếu cần
- Không làm animation quá phức tạp

## 🚀 **Tính năng nâng cao**

### **Custom Easing:**
```jsx
const customEasing = [0.25, 0.46, 0.45, 0.94];

<motion.div
  transition={{
    duration: 0.6,
    ease: customEasing
  }}
>
  Content
</motion.div>
```

### **Spring Animation:**
```jsx
<motion.div
  animate={{ scale: 1 }}
  transition={{
    type: "spring",
    stiffness: 260,
    damping: 20
  }}
>
  Bouncy content
</motion.div>
```

### **Scroll-triggered Animation:**
```jsx
const { scrollYProgress } = useScroll();
const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

<motion.div style={{ opacity }}>
  Content that fades in on scroll
</motion.div>
```

## 🎉 **Kết quả**

Với hệ thống animation này, ứng dụng của bạn sẽ có:
- ✅ **Chuyển trang mượt mà** với fade in/out
- ✅ **Hiệu ứng cascade** cho các section
- ✅ **Hover effects** đẹp mắt
- ✅ **Staggered animations** cho danh sách
- ✅ **Parallax scrolling** chuyên nghiệp
- ✅ **Text animations** sinh động
- ✅ **Performance tối ưu** với Framer Motion

Hãy sử dụng các component này một cách sáng tạo để tạo ra trải nghiệm người dùng tuyệt vời! 🚀✨
