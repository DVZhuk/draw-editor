;(function () {
const colorSelectInput = document.querySelector('.color-select__input');
const colorSelectLabel = document.querySelector('.color-select__label');
const drawPlace = document.querySelector('.draw-place');
const shapeTools = document.querySelectorAll('.shape-tools-item__input');

// Задание цвета блоку равному input color
colorSelectInput.addEventListener('input', function () {
    colorSelectLabel.style.backgroundColor = colorSelectInput.value;
});

// Создание div элемента
let div = document.createElement('div');
let currentShape;
let flag = false;
let startCoords;
let size;
let touchReversCoordX = false;
let touchReversCoordY = false;
let oneTouchFlag = false;
let doubleTouchFlag = false;


// Функция по нажатию мыши
let onMouseDown = function (evt) {
    if (evt.type == 'touchstart') {
        if (evt.touches.length == 1) {
            oneTouchFlag = true;
        };
        if (evt.touches.length == 2) {
            doubleTouchFlag = true;
        };
    };

    // Только нажатие левой кнопки
    // и прикосновение
    if (evt.button == 0 ||
        evt.type == 'touchstart') {
        evt.preventDefault();
        // Объект начальных координат
        if (evt.type == 'mousedown') {
            startCoords = {
                x: evt.pageX + drawPlace.scrollLeft - drawPlace.offsetLeft,
                y: evt.pageY + drawPlace.scrollTop - drawPlace.offsetTop
            };
        } else {
            startCoords = {
                x: evt.changedTouches[0].pageX + drawPlace.scrollLeft - drawPlace.offsetLeft,
                y: evt.changedTouches[0].pageY + drawPlace.scrollTop - drawPlace.offsetTop
            };
        };
        
        // Создание копий элементов и помещение их в переменную currentShape
        currentShape = div.cloneNode(false);
    
        // Задание положения и вставка элемента в draw область
        currentShape.style.top = startCoords.y + 'px';
        currentShape.style.left = startCoords.x + 'px';
        drawPlace.append(currentShape);
    
        // Проверка что на div класс линии (при этом классе наибольшие различия)
        let line = currentShape.classList.contains('draw-place__line');
    
        // Функция при отжатии мыши
        let onMouseUp = function () {
            // Если линия, то задание одних стилей, если фигура то других
            if (line) {
                currentShape.style.backgroundColor = 'transparent';
                currentShape.style.border = 'none';
                currentShape.style.borderColor = colorSelectInput.value;
                currentShape.style.borderWidth = '2px';
                currentShape.style.borderBottomStyle = 'solid';
            } else {
                currentShape.style.backgroundColor = colorSelectInput.value;
                currentShape.style.border = '2px solid ' + colorSelectInput.value;
            };
            if (flag) {
                // В случае если объект был нарисован в отрицательную сторону, 
                // при его размещении в draw области вернуть координацию от левой
                // стороны draw облости
                currentShape.style.left = drawPlace.offsetWidth
                 - parseInt(currentShape.style.right) - currentShape.offsetWidth +'px';

                currentShape.style.top = drawPlace.offsetHeight
                 - parseInt(currentShape.style.bottom) - currentShape.offsetHeight +'px';
                
                currentShape.style.right = null;
                currentShape.style.bottom = null;
                flag = false;
                oneTouchFlag = false;
            };
            // отключение контроля передвижения мыши
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('touchmove', onMouseMove);
            // drawPlace.removeEventListener('touchstart', onMouseDown);
        };
    
        // Функция контроля передвижения мыши
        let onMouseMove = function (moveEvt) {
            
            // Объект размеров ширины и высоты фигур / катеты треугольника для линии
            if (evt.type == 'mousedown') {
                size = {
                    width: Math.abs(moveEvt.pageX - startCoords.x 
                        - drawPlace.offsetLeft + drawPlace.scrollLeft),
                    height: Math.abs(moveEvt.pageY - startCoords.y 
                        - drawPlace.offsetTop + drawPlace.scrollTop)
                };
            } else {
                size = {
                    width: Math.abs(moveEvt.changedTouches[0].pageX - startCoords.x 
                        - drawPlace.offsetLeft + drawPlace.scrollLeft),
                    height: Math.abs(moveEvt.changedTouches[0].pageY - startCoords.y 
                        - drawPlace.offsetTop + drawPlace.scrollTop)
                };
            };            
            
            // Если линия то её длина это вектор (гипотенуза)
            if (line) {
                currentShape.style.width = Math.sqrt(Math.pow(size.width, 2) 
                + Math.pow(size.height, 2)) + 'px';
            } else {
                // если это фигура, то её ширина и высота, это ширина и высота из size
                currentShape.style.width = size.width + 'px';
                currentShape.style.height = size.height + 'px';
            };
    
            // Расчёт угла поврота линии от горизонтали
            let tangle = Math.atan(size.height / size.width) * 180 / Math.PI;

            // Проверка координации фигуры для касания
            if (moveEvt.type == 'touchmove') {
                if (moveEvt.changedTouches[0].pageX + drawPlace.scrollLeft
                    - drawPlace.offsetLeft < startCoords.x) {
                        touchReversCoordX = true;
                } else {
                    touchReversCoordX = false;
                };
                if (moveEvt.changedTouches[0].pageY + drawPlace.scrollTop 
                    - drawPlace.offsetTop < startCoords.y) {
                        touchReversCoordY = true;
                    } else {
                        touchReversCoordY = false;
                    };
            };
            if (moveEvt.type == 'mousemove') {
                touchReversCoordX = false;
                touchReversCoordY = false;
            };
    
            // Изменение координации фигуры при отводе мыши в отрицательные стороны по X
            if (moveEvt.pageX + drawPlace.scrollLeft - drawPlace.offsetLeft < startCoords.x ||
                touchReversCoordX) {
                // во 2 и 3 четвертях угол должен быть с противоположным знаком
                tangle = - tangle;
                // флаг отрицательной координации
                flag = true;
                // в отрицательной стороне, координация фигуры идёт от правой стороны
                currentShape.style.left = null;
                currentShape.style.right = drawPlace.offsetWidth - startCoords.x + 'px';
                // Для построения линии в отрицательную сторону по X необходимо изменить
                // Относительную точку трансформации
                if (line) {
                    currentShape.style.transformOrigin = 'bottom right';
                };
            } else {
                //  в положительной стороне, координация фигуры идёт от левой стороны
                currentShape.style.right = null;
                currentShape.style.left = startCoords.x + 'px';
                if (line) {
                    currentShape.style.transformOrigin = 'bottom left';
                };
            };
            // Изменение координации фигуры при отводе мыши в отрицательные стороны по Y
            if (moveEvt.pageY + drawPlace.scrollTop - drawPlace.offsetTop < startCoords.y ||
                touchReversCoordY) {
                flag = true;
                if (line) {
                    // Задание ула поворота для линии в 1 и 2 четверти
                    currentShape.style.transform = 'rotate(' + -tangle + 'deg)';
                } else {
                    currentShape.style.top = null;
                    currentShape.style.bottom = drawPlace.offsetHeight - startCoords.y + 'px';
                };
            } else {
                if (line) {
                    // Задание угла поворота для линии
                    currentShape.style.transform = 'rotate(' + tangle + 'deg)';
                } else {
                    currentShape.style.bottom = null;
                    currentShape.style.top = startCoords.y + 'px';
                };
            };
    
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

        
        // Обработка событий движения мыши и отжатия клика
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('touchmove', onMouseMove);
        drawPlace.addEventListener('mouseup', onMouseUp);
        drawPlace.addEventListener('touchend', onMouseUp);
        
        if (doubleTouchFlag) {
            drawPlace.children[drawPlace.children.length - 1].remove();
            drawPlace.children[drawPlace.children.length - 1].remove();
            document.removeEventListener('touchmove', onMouseMove);
            doubleTouchFlag = false;
        };
    
    };
    
    
    
};

// drawPlace.addEventListener('resize', function () {

// })


// Выбор изображаемого элемента из перечня возможных
for (let i = 0; i < shapeTools.length; i++) {
    shapeTools[i].addEventListener('change', function () { 
        // Управление классами стилей различных фигур
        switch (i) {
            case 0:
                div.classList.remove('draw-place__ellipse');
                div.classList.remove('draw-place__line');
                div.classList.add('draw-place__rect');
                break;
            case 1:
                div.classList.remove('draw-place__rect');
                div.classList.remove('draw-place__line');
                div.classList.add('draw-place__ellipse');
                break;
            case 2:
                div.classList.remove('draw-place__ellipse');
                div.classList.remove('draw-place__rect');
                div.classList.add('draw-place__line');
                break;
        };
        
        drawPlace.addEventListener('mousedown', onMouseDown);
        drawPlace.addEventListener('touchstart', onMouseDown);
    });
};

})();

