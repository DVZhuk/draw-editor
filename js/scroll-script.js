

let onClickDown = function (evt) {
    let startCoords;
    let shift;
    evt.preventDefault();
    if (evt.button == 1 ||
        evt.touches.length > 1) {
        if (evt.type == 'mousedown') {
            startCoords = {
                x: evt.pageX + drawPlace.scrollLeft - 40,
                y: evt.pageY + drawPlace.scrollTop - 40
            };
        } else {
            startCoords = {
                x: evt.changedTouches[0].pageX + drawPlace.scrollLeft - 40,
                y: evt.changedTouches[0].pageY + drawPlace.scrollTop - 40
            };
        };

        drawPlace.style.cursor = 'grabbing';

        let onClickUp = function () {
            document.removeEventListener('mousemove', onClickMove);
            document.removeEventListener('touchmove', onClickMove);
            drawPlace.style.cursor = null;
        };
        
    
        let onClickMove = function (moveEvt) {
            if (evt.type == 'mousedown') {
                shift = {
                    moveX: moveEvt.pageX - startCoords.x,
                    moveY: moveEvt.pageY - startCoords.y
                };
            } else {
                shift = {
                    moveX: moveEvt.changedTouches[0].pageX - startCoords.x,
                    moveY: moveEvt.changedTouches[0].pageY - startCoords.y
                };
            };
            
            drawPlace.scrollLeft = - shift.moveX + 40;
            drawPlace.scrollTop = - shift.moveY + 40;

            // Запрет на выход из draw области
            if (moveEvt.pageX >= drawPlace.offsetWidth + drawPlace.offsetLeft - 5 || 
                moveEvt.pageY >= drawPlace.offsetHeight + drawPlace.offsetTop - 5 ||
                moveEvt.pageX < drawPlace.offsetLeft + 5 ||
                moveEvt.pageY < drawPlace.offsetTop + 5) { 
                    // Принудительное отжатие клика
                    onMouseUp();
            };
            if (moveEvt.type == 'touchmove') {
                if (moveEvt.changedTouches[0].pageX >= drawPlace.offsetWidth + drawPlace.offsetLeft - 5 || 
                    moveEvt.changedTouches[0].pageY >= drawPlace.offsetHeight + drawPlace.offsetTop - 5 ||
                    moveEvt.changedTouches[0].pageX < drawPlace.offsetLeft + 5 ||
                    moveEvt.changedTouches[0].pageY < drawPlace.offsetTop + 5) { 
                        // Принудительное отжатие клика
                        onMouseUp();
                };
            };
        };
    
        document.addEventListener('mousemove', onClickMove);
        drawPlace.addEventListener('mouseup', onClickUp);
        document.addEventListener('touchmove', onClickMove);
        drawPlace.addEventListener('touchend', onClickUp);
    };
    
};

drawPlace.addEventListener('mousedown', onClickDown);
drawPlace.addEventListener('touchstart', onClickDown);
