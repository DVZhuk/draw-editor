const backwardButton = document.querySelector('.backward-button');

backwardButton.addEventListener('click', function () {
    if (drawPlace.children.length > 0) {
        drawPlace.children[drawPlace.children.length - 1].remove();
    };
});