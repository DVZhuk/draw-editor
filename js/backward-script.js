;(function () {
const backwardButton = document.querySelector('.backward-button');
const drawPlace = document.querySelector('.draw-place');

backwardButton.addEventListener('click', function () {
    if (drawPlace.children.length > 0) {
        drawPlace.children[drawPlace.children.length - 1].remove();
    };
});

})();