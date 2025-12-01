// Touch Direction Detection per Caroselli
// Gestisce lo scroll orizzontale senza interferire con quello verticale

document.addEventListener('DOMContentLoaded', function() {
    // Ritardo per permettere al CSS dinamico di stabilizzarsi su Safari iOS
    setTimeout(() => {
        initializeCarouselTouch();
    }, 100);
});

function initializeCarouselTouch() {
    const carousels = document.querySelectorAll('.carousel-track');
    
    // Rilevamento Safari iOS
    const isSafariIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
                       /Safari/.test(navigator.userAgent) && 
                       !/Chrome|CriOS|FxiOS/.test(navigator.userAgent);
    
    // Gestione globale delle animazioni (fix per listener duplicati)
    let globalListenersAdded = false;
    const globalCarouselAnimating = new Set(); // Traccia caroselli multipli
    
    // Aggiungi listener globali solo una volta per evitare duplicati
    if (!globalListenersAdded) {
        document.addEventListener('touchmove', function(e) {
            if (globalCarouselAnimating.size > 0) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, { passive: false });
        
        document.addEventListener('wheel', function(e) {
            if (globalCarouselAnimating.size > 0) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, { passive: false });
        
        globalListenersAdded = true;
    }

    carousels.forEach(carousel => {
        let startX = null;
        let startY = null;
        let isDragging = false;
        let isHorizontalScroll = false;
        
        // Soglie adattate per Safari iOS
        const THRESHOLD = isSafariIOS ? 15 : 10; // Soglia più alta per Safari iOS
        const MAX_ANGLE_DEGREES = isSafariIOS ? 35 : 45; // Più restrittivo per Safari iOS
        
        // Funzione per calcolare l'angolo del movimento
        function getMovementAngle(deltaX, deltaY) {
            const angleRad = Math.atan2(deltaY, deltaX);
            const angleDeg = Math.abs(angleRad * 180 / Math.PI);
            return Math.min(angleDeg, 180 - angleDeg); // Normalizza tra 0-90°
        }
        
        // Monitora animazioni per questo specifico carosello
        carousel.addEventListener('transitionstart', function() {
            globalCarouselAnimating.add(carousel);
        });
        
        carousel.addEventListener('transitionend', function() {
            globalCarouselAnimating.delete(carousel);
        });
        
        carousel.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = false;
            isHorizontalScroll = false;
        }, { passive: true });
        
        // Logica touch differenziata per Safari iOS
        if (isSafariIOS) {
            // Safari iOS: logica semplificata e più permissiva
            carousel.addEventListener('touchmove', function(e) {
                // Se c'è un'animazione in corso, blocca tutto
                if (globalCarouselAnimating.has(carousel)) {
                    e.preventDefault();
                    return;
                }
                
                if (!startX || !startY) return;
                
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                const deltaX = Math.abs(currentX - startX);
                const deltaY = Math.abs(currentY - startY);
                
                // Safari iOS: logica più semplice e restrittiva
                if (deltaX > THRESHOLD && deltaX > deltaY * 1.5) {
                    isHorizontalScroll = true;
                    isDragging = true;
                    e.preventDefault(); // Blocca scroll verticale solo se chiaramente orizzontale
                }
            }, { passive: false });
        } else {
            // Altri browser: logica completa esistente
            carousel.addEventListener('touchmove', function(e) {
                // Se c'è un'animazione in corso, blocca tutto
                if (globalCarouselAnimating.has(carousel)) {
                    e.preventDefault();
                    return;
                }
                
                if (!startX || !startY) return;
                
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                
                const deltaX = Math.abs(currentX - startX);
                const deltaY = Math.abs(currentY - startY);
                
                // Calcola l'angolo del movimento
                const movementAngle = getMovementAngle(deltaX, deltaY);
                
                // Determina la direzione usando l'angolo
                if (!isDragging && (deltaX > 5 || deltaY > 5)) {
                    if (movementAngle <= MAX_ANGLE_DEGREES) {
                        // Movimento orizzontale o diagonale (≤45°)
                        isHorizontalScroll = true;
                        isDragging = true;
                    } else if (movementAngle >= (90 - MAX_ANGLE_DEGREES)) {
                        // Movimento molto verticale (≥45°)
                        isHorizontalScroll = false;
                        isDragging = true;
                    }
                }
                
                // Solo se abbiamo superato la soglia principale per confermare
                if (deltaX > THRESHOLD || deltaY > THRESHOLD) {
                    if (!isDragging) {
                        // Fallback con soglia più restrittiva
                        if (deltaX > deltaY * 2) { // Deve essere almeno 2x più orizzontale
                            isHorizontalScroll = true;
                            isDragging = true;
                        } else if (deltaY > deltaX * 2) { // Deve essere almeno 2x più verticale
                            isHorizontalScroll = false;
                            isDragging = true;
                        }
                        // Se non è chiaramente orizzontale o verticale, non fare nulla (zona grigia)
                    }
                    
                    // Se è scroll orizzontale, previeni lo scroll verticale
                    if (isHorizontalScroll) {
                        if (e.cancelable) {
                            e.preventDefault();
                        }
                    }
                } else if (isHorizontalScroll && isDragging) {
                    // Continua a prevenire anche per movimenti piccoli se abbiamo già determinato la direzione
                    if (e.cancelable) {
                        e.preventDefault();
                    }
                }
            }, { passive: false });
        }
        
        carousel.addEventListener('touchend', function(e) {
            // Reset delle variabili
            startX = null;
            startY = null;
            isDragging = false;
            isHorizontalScroll = false;
        }, { passive: true });
        
        carousel.addEventListener('touchcancel', function(e) {
            // Reset delle variabili anche in caso di cancel
            startX = null;
            startY = null;
            isDragging = false;
            isHorizontalScroll = false;
        }, { passive: true });
        
        // Gestione per eventi pointer (per compatibilità con stylus/mouse)
        let startPointerX = null;
        let startPointerY = null;
        let isPointerDragging = false;
        let isPointerHorizontalScroll = false;
        
        carousel.addEventListener('pointerdown', function(e) {
            if (e.pointerType === 'touch') return; // Gestito già da touchstart
            
            startPointerX = e.clientX;
            startPointerY = e.clientY;
            isPointerDragging = false;
            isPointerHorizontalScroll = false;
        });
        
        carousel.addEventListener('pointermove', function(e) {
            if (e.pointerType === 'touch') return; // Gestito già da touchmove
            if (!startPointerX || !startPointerY) return;
            
            const deltaX = Math.abs(e.clientX - startPointerX);
            const deltaY = Math.abs(e.clientY - startPointerY);
            
            if (deltaX > THRESHOLD || deltaY > THRESHOLD) {
                if (!isPointerDragging) {
                    if (deltaX > deltaY * 2.5) { // Soglia più restrittiva per pointer
                        isPointerHorizontalScroll = true;
                        isPointerDragging = true;
                    } else if (deltaY > deltaX * 2.5) {
                        isPointerHorizontalScroll = false;
                        isPointerDragging = true;
                    }
                }
                
                if (isPointerHorizontalScroll) {
                    e.preventDefault();
                }
            }
        });
        
        carousel.addEventListener('pointerup', function(e) {
            if (e.pointerType === 'touch') return;
            
            startPointerX = null;
            startPointerY = null;
            isPointerDragging = false;
            isPointerHorizontalScroll = false;
        });
    });
}


