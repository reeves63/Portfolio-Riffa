// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const galleryGrid = document.querySelector('.gallery-grid');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxImg = lightboxModal.querySelector('.lightbox-img-wrapper img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const zoomBtns = document.querySelectorAll('.zoom-btn');
  
  // Variables
  let currentIndex = 0;
  let visibleItems = [...galleryItems];
  let isFiltering = false; // Tambahkan flag untuk mencegah klik berulang saat animasi sedang berjalan
  
  // Initialize the gallery
  const initGallery = () => {
    // Enhanced staggered animation
    galleryItems.forEach((item, index) => {
      // Calculates different delays based on both row and column position for a more natural flow
      // For a standard grid layout
      const delay = index % 5 + Math.floor(index / 5) * 0.5;
      item.style.setProperty('--delay', delay);
      setTimeout(() => {
        item.classList.add('show');
      }, 100 * delay);
    });
    
    // Initially show all items
    filterGalleryItems('all');
  };
  
  // Filter gallery items based on category - implementasi baru yang lebih smooth
  const filterGalleryItems = async (category) => {
    // Jika animasi filter sebelumnya masih berjalan, jangan lakukan apa-apa
    if (isFiltering) return;
    
    // Set flag filtering menjadi true
    isFiltering = true;
    
    // Add loading effect
    galleryGrid.classList.add('loading');
    
    // 1. Sembunyikan semua item terlebih dahulu
    const hideAllItems = () => {
      return new Promise(resolve => {
        // Hapus kelas show dari semua item untuk memulai animasi fade out
        galleryItems.forEach(item => {
          item.classList.remove('show');
        });
        
        // Tunggu hingga transisi selesai (250ms)
        setTimeout(() => {
          // Setelah transisi selesai, sembunyikan item dengan display: none
          galleryItems.forEach(item => {
            item.style.display = 'none';
          });
          resolve();
        }, 250); // Waktu yang lebih cepat untuk transisi keluar
      });
    };
    
    // 2. Tampilkan hanya item yang sesuai dengan kategori
    const showFilteredItems = () => {
      let visibleCount = 0;
      
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || category === itemCategory) {
          // Set display block terlebih dahulu tapi masih dengan opacity 0 (melalui CSS)
          item.style.display = 'block';
          
          // Beri delay untuk menghindari reflow sebelum animasi
          setTimeout(() => {
            // Reset animation delay for filtered items - buat animasi lebih cepat
            const newDelay = visibleCount % 4 * 0.1; // Delay yang sangat cepat
            item.style.setProperty('--delay', newDelay);
            visibleCount++;
            
            // Tambahkan kelas show yang memicu animasi
            item.classList.add('show');
          }, 20); // Delay sangat singkat
        }
      });
      
      // Update visible items array for lightbox navigation
      visibleItems = [...galleryItems].filter(item => {
        const itemCategory = item.getAttribute('data-category');
        return category === 'all' || category === itemCategory;
      });
    };
    
    // Eksekusi urutan transisi
    await hideAllItems();
    showFilteredItems();
    
    // Remove loading effect
    setTimeout(() => {
      galleryGrid.classList.remove('loading');
      
      // Add visual feedback that the filter has been applied
      const activeBtn = document.querySelector('.filter-btn.active');
      activeBtn.classList.add('pulse');
      setTimeout(() => {
        activeBtn.classList.remove('pulse');
      }, 500);
      
      // Reset flag filtering
      isFiltering = false;
    }, 100);
  };
  
  // Open lightbox with specific image
  const openLightbox = (imgSrc, index) => {
    // Fix: Use actual image src if data-src points to a file that doesn't exist
    const imgElement = visibleItems[index].querySelector('.screenshot-wrapper img');
    // Use the actual displayed image as a fallback if the data-src image doesn't exist
    const actualSrc = imgElement.src;
    
    // Preload the image before showing to avoid flickering
    const preloadImg = new Image();
    preloadImg.src = imgSrc || actualSrc;
    preloadImg.onload = () => {
      lightboxImg.src = imgSrc || actualSrc;
      
      // Add caption to lightbox if needed
      const title = visibleItems[index].querySelector('.screenshot-title').textContent;
      const caption = document.querySelector('.lightbox-caption');
      if (caption) {
        caption.textContent = title;
      }
      
      currentIndex = index;
      lightboxModal.classList.add('open');
      document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
    };
  };
  
  // Close lightbox
  const closeLightbox = () => {
    lightboxModal.classList.remove('open');
    document.body.style.overflow = ''; // Restore scrolling
  };
  
  // Navigate to previous image
  const prevImage = () => {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    const imgSrc = visibleItems[currentIndex].querySelector('.zoom-btn').getAttribute('data-src');
    const actualImgSrc = visibleItems[currentIndex].querySelector('.screenshot-wrapper img').src;
    
    // Add transition effect
    lightboxImg.classList.add('fade');
    
    // Preload for smoother transitions
    const preloadImg = new Image();
    preloadImg.src = imgSrc || actualImgSrc;
    preloadImg.onload = () => {
      lightboxImg.src = imgSrc || actualImgSrc;
      
      // Update caption if needed
      const title = visibleItems[currentIndex].querySelector('.screenshot-title').textContent;
      const caption = document.querySelector('.lightbox-caption');
      if (caption) {
        caption.textContent = title;
      }
      
      setTimeout(() => {
        lightboxImg.classList.remove('fade');
      }, 300);
    };
  };
  
  // Navigate to next image
  const nextImage = () => {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    const imgSrc = visibleItems[currentIndex].querySelector('.zoom-btn').getAttribute('data-src');
    const actualImgSrc = visibleItems[currentIndex].querySelector('.screenshot-wrapper img').src;
    
    // Add transition effect
    lightboxImg.classList.add('fade');
    
    // Preload for smoother transitions
    const preloadImg = new Image();
    preloadImg.src = imgSrc || actualImgSrc;
    preloadImg.onload = () => {
      lightboxImg.src = imgSrc || actualImgSrc;
      
      // Update caption if needed
      const title = visibleItems[currentIndex].querySelector('.screenshot-title').textContent;
      const caption = document.querySelector('.lightbox-caption');
      if (caption) {
        caption.textContent = title;
      }
      
      setTimeout(() => {
        lightboxImg.classList.remove('fade');
      }, 300);
    };
  };
  
  // Add event listeners
  const addEventListeners = () => {
    // Filter buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Jika animasi sedang berjalan, jangan proses klik
        if (isFiltering) return;
        
        // Update active button
        filterBtns.forEach(btn => btn.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter items
        const category = btn.getAttribute('data-filter');
        filterGalleryItems(category);
      });
    });
    
    // Zoom buttons
    zoomBtns.forEach((btn, index) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const imgSrc = btn.getAttribute('data-src');
        
        // Find index of the clicked item within visible items
        const visibleIndex = visibleItems.findIndex(item => 
          item.contains(btn)
        );
        
        openLightbox(imgSrc, visibleIndex);
      });
    });
    
    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('open')) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    });
    
    // Lightbox navigation buttons
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);
    
    // Handle resize events to maintain responsive layout
    window.addEventListener('resize', () => {
      // Adjust filter buttons scrolling on mobile
      if (window.innerWidth <= 768) {
        const filterWrapper = document.querySelector('.filter-wrapper');
        filterWrapper.scrollLeft = 0;
      }
    });
    
    // Add swipe support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
    
    const handleSwipe = () => {
      const swipeThreshold = 50; // Minimum distance to trigger swipe
      
      if (!lightboxModal.classList.contains('open')) return;
      
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left, go to next image
        nextImage();
      }
      
      if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right, go to previous image
        prevImage();
      }
    };
    
    // Tambahan: memperbaiki ukuran gambar saat lightbox
    lightboxImg.addEventListener('load', () => {
      // Pastikan gambar dalam lightbox tidak terlalu besar
      const maxWidth = window.innerWidth * 0.8;
      const maxHeight = window.innerHeight * 0.8;
      
      if (lightboxImg.naturalHeight > maxHeight || lightboxImg.naturalWidth > maxWidth) {
        lightboxImg.style.maxHeight = maxHeight + 'px';
        lightboxImg.style.maxWidth = maxWidth + 'px';
      } else {
        // Jika ukuran gambar lebih kecil dari batas maksimum, tampilkan ukuran asli
        lightboxImg.style.maxHeight = lightboxImg.naturalHeight + 'px';
        lightboxImg.style.maxWidth = lightboxImg.naturalWidth + 'px';
      }
    });
  };
  
  // Add caption element to the lightbox if it doesn't exist
  const addLightboxCaption = () => {
    const captionExists = document.querySelector('.lightbox-caption');
    if (!captionExists) {
      const captionElement = document.createElement('div');
      captionElement.className = 'lightbox-caption';
      const lightboxContent = document.querySelector('.lightbox-content');
      lightboxContent.appendChild(captionElement);
    }
  };
  
  // Initialize the gallery with dynamic loading animation
  const galleryInit = () => {
    // Create loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'gallery-loading';
    loadingDiv.innerHTML = '<div class="loading-spinner"></div>';
    galleryGrid.parentNode.insertBefore(loadingDiv, galleryGrid.nextSibling);
    
    // Add lightbox caption
    addLightboxCaption();
    
    // Simulate loading (for demonstration) - reduced time for better UX
    setTimeout(() => {
      // Hide loading indicator
      loadingDiv.style.display = 'none';
      
      // Initialize gallery
      initGallery();
      addEventListeners();
      
      // Optional: optimize layout after images are loaded
      window.addEventListener('load', () => {
        // Pastikan semua gambar sudah dimuat dengan benar
        galleryItems.forEach(item => {
          const img = item.querySelector('img');
          if (img && !img.complete) {
            img.addEventListener('load', () => {
              item.classList.add('img-loaded');
            });
          } else {
            item.classList.add('img-loaded');
          }
        });
      });
    }, 500); // Reduced simulated loading time
  };
  
  // Start gallery initialization
  galleryInit();
});