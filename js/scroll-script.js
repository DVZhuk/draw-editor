

let onClickDown = function (evt) {
    evt.preventDefault();
    if (evt.type == 'mousedown' ||
        evt.touches.length > 1) {
        let startCoords = {
            x: evt.pageX + drawPlace.scrollLeft - 40,
            y: evt.pageY + drawPlace.scrollTop - 40
        };

        if (evt.button == 1) {
            drawPlace.style.cursor = 'grabbing';

            let onClickUp = function () {
                document.removeEventListener('mousemove', onClickMove);
                drawPlace.style.cursor = null;
            };
            
        
            let onClickMove = function (moveEvt) {
                let shift = {
                    moveX: moveEvt.pageX - startCoords.x,
                    moveY: moveEvt.pageY - startCoords.y
                };
                drawPlace.scrollLeft = - shift.moveX + 40;
                drawPlace.scrollTop = - shift.moveY + 40;

                if (moveEvt.pageX >= drawPlace.offsetWidth + 35 || 
                    moveEvt.pageY >= drawPlace.offsetHeight + 35 ||
                    moveEvt.pageX < 45 ||
                    moveEvt.pageY < 45) { 
                        // Принудительное отжатие клика
                        onClickUp();
                };
            };
        
            document.addEventListener('mousemove', onClickMove);
            drawPlace.addEventListener('mouseup', onClickUp);
        };
    };
    

};

drawPlace.addEventListener('mousedown', onClickDown);
drawPlace.addEventListener('touchstart', onClickDown);